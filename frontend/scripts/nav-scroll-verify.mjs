import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5180'

async function waitPath(page, pred, timeout = 8000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const p = await page.evaluate(() => location.pathname + location.search + location.hash)
    if (pred(p)) return p
    await page.waitForTimeout(40)
  }
  throw new Error('timeout waiting for path')
}

async function sampleY(page, ms = 1000) {
  return page.evaluate(async (duration) => {
    const out = []
    const t0 = performance.now()
    while (performance.now() - t0 < duration) {
      out.push({ t: Math.round(performance.now() - t0), y: Math.round(window.scrollY) })
      await new Promise((r) => setTimeout(r, 50))
    }
    return out
  }, ms)
}

async function measure(page) {
  return page.evaluate(() => {
    const frames = document.getElementById('section-frames')
    return {
      path: location.pathname + location.search + location.hash,
      y: Math.round(window.scrollY),
      framesTop: frames ? Math.round(frames.getBoundingClientRect().top) : null,
      idx: window.history.state?.idx ?? null,
      storage: sessionStorage.getItem('socutesy:scroll-positions-v2'),
    }
  })
}

/** Click without Playwright's scroll-into-view (which would corrupt saved Y). */
async function clickProductIn(page, sectionId) {
  return page.evaluate((id) => {
    const section = document.getElementById(id)
    const link = section?.querySelector('a[href^="/product/"]')
    if (!link) throw new Error('no product in ' + id)
    const href = link.getAttribute('href')
    // HTMLElement.click() does not scroll-into-view or focus first
    link.click()
    return href
  }, sectionId)
}

async function run() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  const results = {}

  // ---------- A: Homepage deep scroll → product → browser Back ----------
  await page.goto(`${BASE}/?nav=A`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#section-frames')
  await page.evaluate(() => {
    sessionStorage.removeItem('socutesy:scroll-positions-v2')
    const el = document.getElementById('section-frames')
    const top = el.getBoundingClientRect().top + window.scrollY - 96 + 280
    window.scrollTo(0, top)
  })
  await page.waitForTimeout(500)
  const beforeA = await measure(page)
  await clickProductIn(page, 'section-frames')
  await waitPath(page, (p) => p.startsWith('/product/'))
  await page.waitForTimeout(400)
  const productA = await measure(page)
  await page.goBack()
  await waitPath(page, (p) => !p.startsWith('/product/'))
  const samplesA = await sampleY(page, 1100)
  const afterA = await measure(page)
  results.A = {
    before: beforeA,
    product: productA,
    after: afterA,
    delta: afterA.y - beforeA.y,
    framesTopDelta: (afterA.framesTop ?? 0) - (beforeA.framesTop ?? 0),
    firstY: samplesA[0]?.y,
    lastY: samplesA[samplesA.length - 1]?.y,
    minY: Math.min(...samplesA.map((s) => s.y)),
    climb: (samplesA[samplesA.length - 1]?.y ?? 0) - (samplesA[0]?.y ?? 0),
    routeOk: !afterA.path.startsWith('/product/') && afterA.path.startsWith('/'),
    scrollOk: Math.abs(afterA.y - beforeA.y) <= 24 || Math.abs((afterA.framesTop ?? 0) - (beforeA.framesTop ?? 0)) <= 24,
    noFlashAtTop: (samplesA[0]?.y ?? 0) >= beforeA.y - 120,
  }

  // ---------- B: Category hash → deeper scroll → product → Back ----------
  await page.goto(`${BASE}/#section-frames`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(900)
  await page.evaluate(() => {
    sessionStorage.removeItem('socutesy:scroll-positions-v2')
    // Re-seed: land on frames then scroll deeper
    const el = document.getElementById('section-frames')
    const top = el.getBoundingClientRect().top + window.scrollY - 96
    window.scrollTo(0, top)
  })
  await page.waitForTimeout(200)
  await page.evaluate(() => window.scrollBy(0, 320))
  await page.waitForTimeout(350)
  const beforeB = await measure(page)
  await clickProductIn(page, 'section-frames')
  await waitPath(page, (p) => p.startsWith('/product/'))
  await page.waitForTimeout(350)
  await page.goBack()
  await waitPath(page, (p) => !p.startsWith('/product/'))
  const samplesB = await sampleY(page, 1100)
  const afterB = await measure(page)
  results.B = {
    before: beforeB,
    after: afterB,
    delta: afterB.y - beforeB.y,
    framesTopDelta: (afterB.framesTop ?? 0) - (beforeB.framesTop ?? 0),
    firstY: samplesB[0]?.y,
    lastY: samplesB[samplesB.length - 1]?.y,
    routeOk: afterB.path.includes('section-frames') || afterB.path.startsWith('/'),
    scrollOk:
      Math.abs(afterB.y - beforeB.y) <= 24 ||
      Math.abs((afterB.framesTop ?? 0) - (beforeB.framesTop ?? 0)) <= 24,
    noUpwardJump: afterB.y >= beforeB.y - 24 || (afterB.framesTop ?? 0) <= (beforeB.framesTop ?? 0) + 24,
  }

  // ---------- C: In-app Back ----------
  await page.evaluate(() => window.scrollBy(0, 40))
  await page.waitForTimeout(200)
  const beforeC = await measure(page)
  await clickProductIn(page, 'section-frames')
  await waitPath(page, (p) => p.startsWith('/product/'))
  await page.waitForTimeout(400)
  const back = page.getByRole('button', { name: /back/i }).first()
  if (await back.count()) {
    await back.click({ force: true })
  } else {
    await page.locator('button:has-text("Back"), a:has-text("Back")').first().click({ force: true })
  }
  await waitPath(page, (p) => !p.startsWith('/product/'))
  const samplesC = await sampleY(page, 900)
  const afterC = await measure(page)
  results.C = {
    before: beforeC,
    after: afterC,
    delta: afterC.y - beforeC.y,
    framesTopDelta: (afterC.framesTop ?? 0) - (beforeC.framesTop ?? 0),
    firstY: samplesC[0]?.y,
    scrollOk:
      Math.abs(afterC.y - beforeC.y) <= 24 ||
      Math.abs((afterC.framesTop ?? 0) - (beforeC.framesTop ?? 0)) <= 24,
    routeOk: !afterC.path.startsWith('/product/'),
  }

  // ---------- D: Back then Forward ----------
  const beforeD = await measure(page)
  await clickProductIn(page, 'section-albums')
  await waitPath(page, (p) => p.startsWith('/product/'))
  await page.waitForTimeout(300)
  const onProductD = await page.evaluate(() => location.pathname)
  await page.goBack()
  await waitPath(page, (p) => !p.startsWith('/product/'))
  await page.waitForTimeout(700)
  const afterBackD = await measure(page)
  await page.goForward()
  await waitPath(page, (p) => p.startsWith('/product/'))
  await page.waitForTimeout(300)
  const afterFwdD = await measure(page)
  results.D = {
    before: beforeD,
    product: onProductD,
    afterBack: afterBackD,
    afterForward: afterFwdD,
    backRouteOk: !afterBackD.path.startsWith('/product/'),
    forwardRouteOk: afterFwdD.path === onProductD,
    scrollBackOk:
      Math.abs(afterBackD.y - beforeD.y) <= 24 ||
      Math.abs((afterBackD.framesTop ?? 0) - (beforeD.framesTop ?? 0)) <= 24,
  }

  // ---------- E: Shop All → product → Back ----------
  await page.goBack()
  await waitPath(page, (p) => !p.startsWith('/product/'))
  await page.getByRole('button', { name: 'Shop All' }).first().click({ force: true })
  await page.waitForTimeout(900)
  await page.evaluate(() => {
    window.scrollTo(0, 1800)
  })
  await page.waitForTimeout(350)
  const beforeE = await measure(page)
  await page.evaluate(() => {
    document.querySelector('a[href^="/product/"]')?.click()
  })
  await waitPath(page, (p) => p.startsWith('/product/'))
  await page.waitForTimeout(300)
  await page.goBack()
  await waitPath(page, (p) => !p.startsWith('/product/'))
  await page.waitForTimeout(900)
  const afterE = await measure(page)
  results.E = {
    before: beforeE,
    after: afterE,
    delta: afterE.y - beforeE.y,
    scrollOk: Math.abs(afterE.y - beforeE.y) <= 24,
    routeOk: !afterE.path.startsWith('/product/'),
  }

  // ---------- F: Direct product + refresh ----------
  await page.goto(`${BASE}/product/mini-frame`, { waitUntil: 'networkidle' })
  const direct = await measure(page)
  await page.reload({ waitUntil: 'networkidle' })
  const refreshed = await measure(page)
  results.F = {
    direct,
    refreshed,
    ok:
      direct.path.startsWith('/product/') &&
      refreshed.path.startsWith('/product/') &&
      direct.y <= 40 &&
      refreshed.y <= 40,
  }

  results.summary = {
    A: results.A.scrollOk && results.A.routeOk && results.A.noFlashAtTop,
    B: results.B.scrollOk && results.B.noUpwardJump && results.B.routeOk,
    C: results.C.scrollOk && results.C.routeOk,
    D: results.D.backRouteOk && results.D.forwardRouteOk && results.D.scrollBackOk,
    E: results.E.scrollOk && results.E.routeOk,
    F: results.F.ok,
  }

  await browser.close()
  console.log(JSON.stringify(results, null, 2))
  const failed = Object.entries(results.summary).filter(([, v]) => !v)
  if (failed.length) {
    console.error('FAILED:', failed.map(([k]) => k).join(', '))
    process.exit(1)
  }
  console.error('ALL PASSED')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
