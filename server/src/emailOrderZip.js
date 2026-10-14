import fs from 'fs'
import path from 'path'
import { createWriteStream } from 'fs'
import { ZipArchive } from 'archiver'
import nodemailer from 'nodemailer'
import { getDb } from './db.js'

/**
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function getMailConfig() {
  const ownerEmail = process.env.OWNER_EMAIL?.trim()
  const host = process.env.SMTP_HOST?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()
  const from = process.env.SMTP_FROM?.trim() || user
  const port = Number(process.env.SMTP_PORT) || 587
  if (!ownerEmail) {
    return { ok: false, error: 'OWNER_EMAIL is not configured on the server' }
  }
  if (!host || !user || !pass || !from) {
    return {
      ok: false,
      error:
        'SMTP is not configured (need SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM)',
    }
  }
  return {
    ok: true,
    ownerEmail,
    host,
    port,
    user,
    pass,
    from,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
  }
}

function getOrderRow(orderId) {
  const db = getDb()
  const stmt = db.prepare('SELECT * FROM orders WHERE id = ? LIMIT 1')
  stmt.bind([orderId])
  if (!stmt.step()) {
    stmt.free()
    return null
  }
  const row = stmt.getAsObject()
  stmt.free()
  return row
}

function listOrderUploads(orderId) {
  const db = getDb()
  const stmt = db.prepare(
    `SELECT original_name, stored_filename, line_item_id, product_slug, product_name
     FROM order_uploads WHERE order_id = ? ORDER BY id ASC`,
  )
  stmt.bind([orderId])
  const rows = []
  while (stmt.step()) {
    rows.push(stmt.getAsObject())
  }
  stmt.free()
  return rows
}

/**
 * @param {Record<string, unknown>} row
 */
export function buildOrderDetailsText(row) {
  let customer = {}
  try {
    customer = JSON.parse(String(row.customer_json || '{}'))
  } catch {
    customer = {}
  }
  let cartLines = null
  try {
    if (row.cart_snapshot_json) {
      cartLines = JSON.parse(String(row.cart_snapshot_json))
    }
  } catch {
    cartLines = null
  }

  const lines = [
    'SoCutesy — New order submission',
    '==============================',
    `Order ID: ${row.id}`,
    `Created: ${row.created_at}`,
    `Submitted: ${row.submitted_at || '—'}`,
    `Status: ${row.status || 'draft'}`,
    `Checkout: ${row.checkout_source}`,
    '',
    'NOTE: Payment screenshot attached does NOT mean JazzCash was verified automatically.',
    '',
    'Product',
    '-------',
    `Name: ${row.product_name}`,
    `Slug: ${row.slug ?? '—'}`,
    `Unit price: RS. ${Number(row.unit_price).toLocaleString()}`,
    `Quantity: ${row.order_qty}`,
    `Selection: ${row.selection_summary || '—'}`,
    '',
  ]

  if (Array.isArray(cartLines) && cartLines.length) {
    lines.push('Cart lines', '----------')
    for (const line of cartLines) {
      lines.push(
        `• ${line.name}${line.summary ? ` (${line.summary})` : ''} × ${line.qty} — RS. ${Number(line.unitPrice * line.qty).toLocaleString()} [line ${line.lineId || '—'}]`,
      )
    }
    lines.push('')
  }

  lines.push(
    'Customer',
    '--------',
    `Name: ${customer.fullName ?? '—'}`,
    `Phone: ${customer.phone ?? '—'}`,
    `City: ${customer.city ?? '—'}`,
    `Address: ${customer.address ?? '—'}`,
    `Notes: ${customer.notes || '—'}`,
    '',
    'Payment',
    '-------',
    `Include delivery: ${row.include_delivery ? 'yes' : 'no'}`,
    `Order total: RS. ${Number(row.order_total).toLocaleString()}`,
    `Advance (50%): RS. ${Number(row.advance_amount).toLocaleString()}`,
    `Balance on delivery: RS. ${Number(row.balance_on_delivery).toLocaleString()}`,
    '',
    'Photos are grouped by product/line in the ZIP when available.',
  )

  return lines.join('\n')
}

function safeFolder(name) {
  return String(name || 'item')
    .replace(/[/\\?%*:|"<>]/g, '_')
    .slice(0, 80)
}

/**
 * Build a ZIP for an order (details + photos by line + payment proof).
 * @param {string} orderId
 * @param {string} uploadRoot
 * @param {{ filename: string, originalname?: string } | null} paymentFile
 * @returns {Promise<{ zipPath: string, detailsText: string, orderId: string }>}
 */
export async function buildOrderZip(orderId, uploadRoot, paymentFile) {
  const row = getOrderRow(orderId)
  if (!row) throw new Error('Order not found')

  const detailsText = buildOrderDetailsText(row)
  const orderDir = path.join(uploadRoot, orderId)
  fs.mkdirSync(orderDir, { recursive: true })

  const zipPath = path.join(orderDir, `socutesy-order-${orderId}.zip`)
  const output = createWriteStream(zipPath)
  const archive = new ZipArchive({ zlib: { level: 9 } })

  const done = new Promise((resolve, reject) => {
    output.on('close', resolve)
    archive.on('error', reject)
    output.on('error', reject)
  })

  archive.pipe(output)
  archive.append(detailsText, { name: 'order-details.txt' })

  const uploads = listOrderUploads(orderId)
  const usedNames = new Set()
  for (const u of uploads) {
    const stored = String(u.stored_filename || '')
    const abs = path.join(orderDir, stored)
    if (!stored || !fs.existsSync(abs)) continue
    const folder = safeFolder(
      u.product_name || u.product_slug || u.line_item_id || 'photos',
    )
    let safeName = String(u.original_name || stored).replace(
      /[/\\?%*:|"<>]/g,
      '_',
    )
    let unique = `${folder}/${safeName}`
    let n = 1
    while (usedNames.has(unique)) {
      const ext = path.extname(safeName)
      const base = path.basename(safeName, ext)
      unique = `${folder}/${base}-${n}${ext}`
      n += 1
    }
    usedNames.add(unique)
    archive.file(abs, { name: `photos/${unique}` })
  }

  const proofName =
    paymentFile?.filename ||
    (typeof row.payment_proof_filename === 'string'
      ? row.payment_proof_filename
      : null)
  const proofOriginal =
    paymentFile?.originalname ||
    (typeof row.payment_proof_original_name === 'string'
      ? row.payment_proof_original_name
      : null)
  if (proofName) {
    const abs = path.join(orderDir, proofName)
    if (fs.existsSync(abs)) {
      const ext = path.extname(proofOriginal || proofName)
      archive.file(abs, {
        name: `payment-proof/payment-screenshot${ext || '.jpg'}`,
      })
    }
  }

  await archive.finalize()
  await done

  return { zipPath, detailsText, orderId }
}

/**
 * Email the order ZIP to the shop owner.
 * @param {{ zipPath: string, detailsText: string, orderId: string }} pkg
 */
export async function emailOrderZip(pkg) {
  const cfg = getMailConfig()
  if (!cfg.ok) {
    const err = new Error(cfg.error)
    err.code = 'SMTP_NOT_CONFIGURED'
    throw err
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  })

  await transporter.sendMail({
    from: cfg.from,
    to: cfg.ownerEmail,
    subject: `SoCutesy order ${pkg.orderId} (submitted — payment not auto-verified)`,
    text: `${pkg.detailsText}\n\nFull package attached as ZIP.`,
    attachments: [
      {
        filename: `socutesy-order-${pkg.orderId}.zip`,
        path: pkg.zipPath,
      },
    ],
  })
}
