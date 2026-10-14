import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  adminLogin,
  adminLogout,
  adminMe,
  adminFileUrl,
  adminOrderZipUrl,
  adminPaymentProofUrl,
  fetchOrderDetail,
  fetchOrders,
  markOrderFulfilled,
} from '../api/adminApi'
import { formatOrderRef } from '../utils/formatOrderRef'
import { isWhatsAppCustomProduct, isPhotoUploadProduct } from '../utils/customizationMode'

export default function AdminPage() {
  const [configured, setConfigured] = useState(null)
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [listError, setListError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionMsg, setActionMsg] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const me = await adminMe()
      setConfigured(me.configured)
      setAuthed(Boolean(me.admin))
    } catch {
      setConfigured(false)
      setAuthed(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const reloadList = useCallback(async () => {
    setListError(null)
    try {
      const { orders: list } = await fetchOrders()
      setOrders(list ?? [])
    } catch (e) {
      setListError(e instanceof Error ? e.message : 'Could not load orders')
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!authed) return
    reloadList()
  }, [authed, reloadList])

  useEffect(() => {
    if (!selectedId || !authed) {
      setDetail(null)
      return
    }
    let cancelled = false
    setDetailLoading(true)
    ;(async () => {
      try {
        const d = await fetchOrderDetail(selectedId)
        if (!cancelled) setDetail(d)
      } catch {
        if (!cancelled) setDetail(null)
      } finally {
        if (!cancelled) setDetailLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [selectedId, authed])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError(null)
    try {
      await adminLogin(password)
      setPassword('')
      setAuthed(true)
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const handleLogout = async () => {
    await adminLogout()
    setAuthed(false)
    setOrders([])
    setSelectedId(null)
    setDetail(null)
    await refresh()
  }

  const handleFulfilled = async () => {
    if (!selectedId) return
    setActionMsg(null)
    try {
      await markOrderFulfilled(selectedId)
      setActionMsg(
        'Marked fulfilled. Photos are still retained until a deletion workflow is approved.',
      )
      const d = await fetchOrderDetail(selectedId)
      setDetail(d)
      await reloadList()
    } catch (e) {
      setActionMsg(e instanceof Error ? e.message : 'Update failed')
    }
  }

  if (loading) {
    return (
      <main className="min-h-svh bg-[#fffcfd] px-4 py-16 text-center text-sm text-[#6b7280]">
        Loading…
      </main>
    )
  }

  if (!configured) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Admin is not configured on the server. Set{' '}
          <code className="rounded bg-[#fffcfd]/90 px-1">ADMIN_PASSWORD</code>{' '}
          and{' '}
          <code className="rounded bg-[#fffcfd]/90 px-1">SESSION_SECRET</code>{' '}
          in the API environment, then restart.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-medium text-[#9d174d] hover:underline"
        >
          ← Back to shop
        </Link>
      </main>
    )
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[#fdf0f5] bg-[#fffcfd] p-8 shadow-sm"
        >
          <h1 className="font-semibold text-xl text-[#831843]">Orders admin</h1>
          <p className="mt-2 text-sm text-[#6b7280]">
            Sign in with your admin password.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {loginError && (
              <p className="text-sm text-[#493c43]" role="alert">
                {loginError}
              </p>
            )}
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-[#f6b6cc] px-4 py-3 text-sm text-[#831843] outline-none focus:border-[#f6b6cc] focus:ring-2 focus:ring-[#f6b6cc]"
              placeholder="Password"
            />
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#e66f98] to-[#e66f98] py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(73,60,67,0.12)]"
            >
              Sign in
            </button>
          </form>
          <Link
            to="/"
            className="mt-6 inline-block text-sm font-medium text-[#9d174d] hover:underline"
          >
            ← Back to shop
          </Link>
        </motion.div>
      </main>
    )
  }

  const c = detail?.order?.customer
  const cartLines = detail?.order?.cartSnapshot

  return (
    <main className="min-h-svh bg-[#fffcfd] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-semibold text-2xl text-[#831843]">Orders</h1>
            <p className="mt-1 text-sm text-[#6b7280]">
              Submitted orders, payment screenshots, and customer photos.
              Payment is never auto-verified.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl border border-[#f6b6cc] bg-[#fffcfd] px-4 py-2 text-sm font-semibold text-[#e66f98] hover:bg-[#fdf0f5]"
            >
              Log out
            </button>
            <Link
              to="/"
              className="rounded-2xl border border-[#f6b6cc] bg-[#fffcfd] px-4 py-2 text-sm font-semibold text-[#e66f98] hover:bg-[#fdf0f5]"
            >
              Shop
            </Link>
          </div>
        </div>

        {listError && (
          <p className="mt-4 text-sm text-[#493c43]" role="alert">
            {listError}
          </p>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ul className="max-h-[70vh] space-y-2 overflow-y-auto rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] p-2">
              {orders.length === 0 && (
                <li className="px-3 py-3 text-sm text-[#9ca3af]">
                  No orders yet.
                </li>
              )}
              {orders.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(o.id)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      selectedId === o.id
                        ? 'bg-gradient-to-r from-[#e66f98] to-[#e66f98] text-white'
                        : 'text-[#374151] hover:bg-[#fdf0f5]'
                    }`}
                  >
                    <span className="block font-medium truncate">
                      {o.productName}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs font-mono truncate ${
                        selectedId === o.id ? 'text-white/90' : 'text-[#9ca3af]'
                      }`}
                    >
                      {formatOrderRef(o.id)} · {o.status || 'draft'}
                    </span>
                    <span
                      className={`mt-0.5 block text-xs ${
                        selectedId === o.id ? 'text-white/90' : 'text-[#6b7280]'
                      }`}
                    >
                      {o.customerPreview?.fullName} · RS.{' '}
                      {typeof o.orderTotal === 'number'
                        ? o.orderTotal.toLocaleString()
                        : '—'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            {!selectedId && (
              <p className="rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] p-8 text-center text-sm text-[#9ca3af]">
                Select an order to view details and photos.
              </p>
            )}
            {selectedId && detailLoading && (
              <p className="text-sm text-[#6b7280]">Loading…</p>
            )}
            {selectedId && !detailLoading && detail && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-[#e66f98]">
                      Order
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={adminOrderZipUrl(detail.order.id)}
                        className="rounded-xl bg-[#e66f98] px-3 py-1.5 text-xs font-semibold text-white"
                      >
                        Download ZIP
                      </a>
                      <button
                        type="button"
                        onClick={handleFulfilled}
                        className="rounded-xl border border-[#f6b6cc] px-3 py-1.5 text-xs font-semibold text-[#e66f98]"
                      >
                        Mark fulfilled
                      </button>
                    </div>
                  </div>
                  {actionMsg && (
                    <p className="mt-3 text-xs text-[#755f69]">{actionMsg}</p>
                  )}
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-[#9ca3af]">Reference</dt>
                      <dd className="font-mono text-xs text-[#374151] break-all">
                        {formatOrderRef(detail.order.id)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#9ca3af]">Status</dt>
                      <dd className="text-[#374151]">
                        {detail.order.status || 'draft'}
                        <span className="mt-0.5 block text-[11px] text-[#9ca3af]">
                          Payment not auto-verified
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#9ca3af]">Created</dt>
                      <dd className="text-[#374151]">{detail.order.createdAt}</dd>
                    </div>
                    <div>
                      <dt className="text-[#9ca3af]">Submitted</dt>
                      <dd className="text-[#374151]">
                        {detail.order.submittedAt || '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#9ca3af]">Product / cart</dt>
                      <dd className="text-[#374151]">{detail.order.productName}</dd>
                    </div>
                    <div>
                      <dt className="text-[#9ca3af]">Total</dt>
                      <dd className="font-medium text-[#831843]">
                        RS. {detail.order.orderTotal?.toLocaleString?.() ?? '—'}
                      </dd>
                    </div>
                  </dl>
                  {detail.order.selectionSummary && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-[#6b7280]">
                      <span className="font-medium text-[#9d174d]">Options: </span>
                      {detail.order.selectionSummary}
                    </p>
                  )}
                </div>

                {Array.isArray(cartLines) && cartLines.length > 0 && (
                  <div className="rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] p-6 shadow-sm">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-[#e66f98]">
                      Line items
                    </h2>
                    <ul className="mt-3 space-y-2 text-sm text-[#374151]">
                      {cartLines.map((line) => (
                        <li
                          key={line.lineId}
                          className="rounded-xl border border-[#fdf0f5] px-3 py-2"
                        >
                          <p className="font-medium">
                            {line.name} × {line.qty}
                          </p>
                          <p className="text-xs text-[#6b7280]">{line.summary}</p>
                          <p className="mt-1 text-[11px] text-[#9ca3af]">
                            Mode:{' '}
                            {isPhotoUploadProduct(line.slug)
                              ? 'website photos'
                              : isWhatsAppCustomProduct(line.slug)
                                ? 'WhatsApp customization'
                                : 'standard'}{' '}
                            · line {line.lineId}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] p-6 shadow-sm">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[#e66f98]">
                    Customer
                  </h2>
                  {c && (
                    <ul className="mt-3 space-y-2 text-sm text-[#374151]">
                      <li>
                        <span className="text-[#9ca3af]">Name </span>
                        {c.fullName}
                      </li>
                      <li>
                        <span className="text-[#9ca3af]">Phone </span>
                        <a
                          className="text-[#e66f98] underline"
                          href={`tel:${c.phone}`}
                        >
                          {c.phone}
                        </a>
                      </li>
                      <li>
                        <span className="text-[#9ca3af]">City </span>
                        {c.city}
                      </li>
                      <li>
                        <span className="text-[#9ca3af]">Address </span>
                        {c.address}
                      </li>
                      {c.notes && (
                        <li>
                          <span className="text-[#9ca3af]">Notes </span>
                          {c.notes}
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] p-6 shadow-sm">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[#e66f98]">
                    Payment screenshot
                  </h2>
                  {detail.order.paymentProof ? (
                    <div className="mt-4 space-y-3">
                      <a
                        href={adminPaymentProofUrl(detail.order.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-sm font-semibold text-[#e66f98] underline"
                      >
                        Download payment screenshot
                      </a>
                      <a
                        href={adminFileUrl(
                          detail.order.id,
                          detail.order.paymentProof.storedFilename,
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="block overflow-hidden rounded-2xl border border-[#fdf0f5]"
                      >
                        <img
                          src={adminFileUrl(
                            detail.order.id,
                            detail.order.paymentProof.storedFilename,
                          )}
                          alt="Payment screenshot"
                          className="max-h-72 w-full object-contain bg-[#fdf0f5]"
                        />
                      </a>
                      <p className="text-[11px] text-[#9ca3af]">
                        Manual review required — not auto-verified.
                      </p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-[#9ca3af]">
                      No payment screenshot on file.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] p-6 shadow-sm">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[#e66f98]">
                    Customer photos ({detail.uploads?.length ?? 0})
                  </h2>
                  {!(detail.uploadsByLine?.length || detail.uploads?.length) && (
                    <p className="mt-3 text-sm text-[#9ca3af]">
                      No product photos for this order (WhatsApp-customization
                      products collect details off-site).
                    </p>
                  )}
                  {(detail.uploadsByLine?.length
                    ? detail.uploadsByLine
                    : [
                        {
                          lineItemId: 'all',
                          productName: 'Photos',
                          files: detail.uploads || [],
                        },
                      ]
                  ).map((group) =>
                    group.files?.length ? (
                      <div key={group.lineItemId} className="mt-5">
                        <p className="text-xs font-semibold text-[#493c43]">
                          {group.productName || group.productSlug || 'Photos'}
                          <span className="ml-2 font-normal text-[#9ca3af]">
                            {group.files.length} file
                            {group.files.length === 1 ? '' : 's'} · line{' '}
                            {group.lineItemId}
                          </span>
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {group.files.map((u) => (
                            <a
                              key={u.id}
                              href={adminFileUrl(
                                detail.order.id,
                                u.stored_filename,
                              )}
                              target="_blank"
                              rel="noreferrer"
                              download={u.original_name}
                              className="group block overflow-hidden rounded-2xl border border-[#fdf0f5] bg-[#fffcfd]"
                            >
                              <img
                                src={adminFileUrl(
                                  detail.order.id,
                                  u.stored_filename,
                                )}
                                alt={u.original_name || 'Upload'}
                                className="aspect-square w-full object-cover transition group-hover:opacity-95"
                              />
                              <p className="truncate px-2 py-1.5 text-[10px] text-[#6b7280]">
                                {u.original_name}
                              </p>
                              {u.created_at && (
                                <p className="px-2 pb-1.5 text-[10px] text-[#9ca3af]">
                                  {u.created_at}
                                </p>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
