import path from 'path'
import fs from 'fs'
import rateLimit from 'express-rate-limit'
import { getDb, persist } from './db.js'
import { isValidOrderIdParam } from './orderId.js'
import { buildOrderZip } from './emailOrderZip.js'

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { error: 'Too many login attempts, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
})

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim())
}

export function requireAdmin(req, res, next) {
  if (!adminConfigured()) {
    return res.status(503).json({ error: 'Admin is not configured' })
  }
  if (!req.session?.admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

function parseRows(stmt) {
  const rows = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject())
  }
  stmt.free()
  return rows
}

function resolveOrderFile(uploadRoot, orderId, storedFilename) {
  const base = path.basename(storedFilename)
  if (base !== storedFilename || base === '.' || base === '..') {
    return null
  }
  const dir = path.resolve(path.join(uploadRoot, orderId))
  const full = path.join(dir, base)
  const resolvedFile = path.resolve(full)
  const rel = path.relative(dir, resolvedFile)
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return null
  }
  if (!fs.existsSync(resolvedFile)) return null
  return resolvedFile
}

/**
 * @param {import('express').Express} app
 * @param {{ uploadRoot: string }} opts
 */
export function registerAdminRoutes(app, { uploadRoot }) {
  app.post('/api/admin/login', adminLoginLimiter, (req, res) => {
    if (!adminConfigured()) {
      return res.status(503).json({ error: 'Admin not configured' })
    }
    const pwd = String(req.body?.password ?? '')
    if (pwd !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' })
    }
    req.session.admin = true
    return res.json({ ok: true })
  })

  app.post('/api/admin/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ ok: true })
    })
  })

  app.get('/api/admin/me', (req, res) => {
    if (!adminConfigured()) {
      return res.json({ admin: false, configured: false })
    }
    return res.json({
      configured: true,
      admin: Boolean(req.session?.admin),
    })
  })

  app.get('/api/admin/orders', requireAdmin, (_req, res) => {
    try {
      const db = getDb()
      const stmt = db.prepare(
        `SELECT id, created_at, submitted_at, status, checkout_source, slug, product_name,
                unit_price, order_qty, selection_summary, order_total, advance_amount,
                customer_json, payment_proof_filename
         FROM orders
         ORDER BY datetime(COALESCE(submitted_at, created_at)) DESC
         LIMIT 500`,
      )
      const raw = parseRows(stmt)
      const orders = raw.map((row) => {
        let customer = {}
        try {
          customer = JSON.parse(row.customer_json || '{}')
        } catch {
          /* ignore */
        }
        return {
          id: row.id,
          createdAt: row.created_at,
          submittedAt: row.submitted_at || null,
          status: row.status || 'draft',
          checkoutSource: row.checkout_source,
          slug: row.slug,
          productName: row.product_name,
          unitPrice: row.unit_price,
          orderQty: row.order_qty,
          selectionSummary: row.selection_summary,
          orderTotal: row.order_total,
          advanceAmount: row.advance_amount,
          hasPaymentProof: Boolean(row.payment_proof_filename),
          paymentVerified: false,
          customerPreview: {
            fullName: customer.fullName,
            phone: customer.phone,
            city: customer.city,
          },
        }
      })
      res.json({ orders })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to list orders' })
    }
  })

  app.get('/api/admin/orders/:id', requireAdmin, (req, res) => {
    const id = req.params.id
    if (!isValidOrderIdParam(id)) {
      return res.status(400).json({ error: 'Invalid order id' })
    }
    try {
      const db = getDb()
      const oStmt = db.prepare('SELECT * FROM orders WHERE id = ?')
      oStmt.bind([id])
      if (!oStmt.step()) {
        oStmt.free()
        return res.status(404).json({ error: 'Order not found' })
      }
      const orderRow = oStmt.getAsObject()
      oStmt.free()

      let customer = {}
      try {
        customer = JSON.parse(orderRow.customer_json || '{}')
      } catch {
        /* ignore */
      }

      let cartSnapshot = null
      if (orderRow.cart_snapshot_json) {
        try {
          cartSnapshot = JSON.parse(orderRow.cart_snapshot_json)
        } catch {
          cartSnapshot = null
        }
      }

      const uStmt = db.prepare(
        `SELECT id, original_name, stored_filename, mime_type, size_bytes,
                line_item_id, product_id, product_slug, product_name, created_at
         FROM order_uploads WHERE order_id = ? ORDER BY id ASC`,
      )
      uStmt.bind([id])
      const uploads = parseRows(uStmt)

      const uploadsByLine = {}
      for (const u of uploads) {
        const key = u.line_item_id || 'unassigned'
        if (!uploadsByLine[key]) {
          uploadsByLine[key] = {
            lineItemId: key,
            productId: u.product_id,
            productSlug: u.product_slug,
            productName: u.product_name,
            files: [],
          }
        }
        uploadsByLine[key].files.push(u)
      }

      res.json({
        order: {
          id: orderRow.id,
          createdAt: orderRow.created_at,
          submittedAt: orderRow.submitted_at || null,
          status: orderRow.status || 'draft',
          checkoutSource: orderRow.checkout_source,
          slug: orderRow.slug,
          productName: orderRow.product_name,
          unitPrice: orderRow.unit_price,
          orderQty: orderRow.order_qty,
          selectionSummary: orderRow.selection_summary,
          includeDelivery: Boolean(orderRow.include_delivery),
          orderTotal: orderRow.order_total,
          advanceAmount: orderRow.advance_amount,
          balanceOnDelivery: orderRow.balance_on_delivery,
          cartSnapshot,
          customer,
          paymentVerified: false,
          paymentProof: orderRow.payment_proof_filename
            ? {
                storedFilename: orderRow.payment_proof_filename,
                originalName: orderRow.payment_proof_original_name,
                mimeType: orderRow.payment_proof_mime,
                sizeBytes: orderRow.payment_proof_size,
              }
            : null,
        },
        uploads,
        uploadsByLine: Object.values(uploadsByLine),
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to load order' })
    }
  })

  app.get(
    '/api/admin/orders/:orderId/files/:storedFilename',
    requireAdmin,
    (req, res) => {
      const orderId = req.params.orderId
      let storedFilename = req.params.storedFilename
      try {
        storedFilename = decodeURIComponent(storedFilename)
      } catch {
        return res.status(400).end()
      }
      if (!isValidOrderIdParam(orderId)) {
        return res.status(400).json({ error: 'Invalid order id' })
      }
      const resolvedFile = resolveOrderFile(uploadRoot, orderId, storedFilename)
      if (!resolvedFile) {
        return res.status(404).end()
      }
      res.sendFile(resolvedFile)
    },
  )

  app.get(
    '/api/admin/orders/:id/payment-proof',
    requireAdmin,
    (req, res) => {
      const id = req.params.id
      if (!isValidOrderIdParam(id)) {
        return res.status(400).json({ error: 'Invalid order id' })
      }
      const db = getDb()
      const stmt = db.prepare(
        'SELECT payment_proof_filename, payment_proof_original_name FROM orders WHERE id = ?',
      )
      stmt.bind([id])
      if (!stmt.step()) {
        stmt.free()
        return res.status(404).json({ error: 'Order not found' })
      }
      const row = stmt.getAsObject()
      stmt.free()
      const filename = row.payment_proof_filename
      if (!filename) {
        return res.status(404).json({ error: 'No payment screenshot on file' })
      }
      const resolved = resolveOrderFile(uploadRoot, id, String(filename))
      if (!resolved) return res.status(404).end()
      const downloadName =
        row.payment_proof_original_name || `payment-${id}.jpg`
      res.download(resolved, String(downloadName))
    },
  )

  app.get('/api/admin/orders/:id/zip', requireAdmin, async (req, res) => {
    const id = req.params.id
    if (!isValidOrderIdParam(id)) {
      return res.status(400).json({ error: 'Invalid order id' })
    }
    try {
      const pkg = await buildOrderZip(id, uploadRoot, null)
      res.download(pkg.zipPath, `socutesy-order-${id}.zip`)
    } catch (e) {
      console.error(e)
      res.status(500).json({
        error: e instanceof Error ? e.message : 'Failed to build ZIP',
      })
    }
  })

  /** Mark fulfillment complete (manual) — does not delete photos yet. */
  app.post(
    '/api/admin/orders/:id/mark-fulfilled',
    requireAdmin,
    (req, res) => {
      const id = req.params.id
      if (!isValidOrderIdParam(id)) {
        return res.status(400).json({ error: 'Invalid order id' })
      }
      try {
        const db = getDb()
        const stmt = db.prepare('SELECT id, status FROM orders WHERE id = ?')
        stmt.bind([id])
        if (!stmt.step()) {
          stmt.free()
          return res.status(404).json({ error: 'Order not found' })
        }
        stmt.free()
        db.run(`UPDATE orders SET status = ? WHERE id = ?`, [
          'fulfilled',
          id,
        ])
        persist()
        res.json({
          ok: true,
          status: 'fulfilled',
          note: 'Photos are retained until a deletion workflow is approved.',
        })
      } catch (e) {
        console.error(e)
        res.status(500).json({ error: 'Failed to update status' })
      }
    },
  )
}
