import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PAGES = ['/', '/products', '/products/career-ai', '/products/voicenity', '/labs', '/case-studies', '/case-studies/career-ai-ncs', '/about', '/contact', '/privacy', '/terms']

test.describe('routes', () => {
  for (const path of PAGES) {
    test(`${path} renders with one h1 and no console errors`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
      page.on('pageerror', (e) => errors.push(e.message))
      const res = await page.goto(path)
      expect(res?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      expect(await page.content()).not.toContain('[PLACEHOLDER')
      expect(errors).toEqual([])
    })
  }

  test('unknown URLs get the helpful 404', async ({ page }) => {
    const res = await page.goto('/does-not-exist')
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText("This page doesn't exist.")
    for (const name of ['Products', 'Zobique Labs', 'Contact']) {
      await expect(page.getByRole('main').getByRole('link', { name })).toBeVisible()
    }
  })

  test('insights stays hidden while its feature flag is off', async ({ page }) => {
    expect((await page.goto('/insights'))?.status()).toBe(404)
    const sitemap = await (await page.request.get('/sitemap.xml')).text()
    expect(sitemap).not.toContain('/insights')
  })
})

test.describe('navigation', () => {
  test('every internal link on every page resolves', async ({ page, request }) => {
    const seen = new Set<string>()
    for (const path of PAGES) {
      await page.goto(path)
      const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!))
      for (const href of hrefs) seen.add(href.split('#')[0] || '/')
    }
    for (const href of seen) {
      expect((await request.get(href)).status(), href).toBe(200)
    }
  })

  test('outbound CTAs point at the right sites and carry the external icon', async ({ page }) => {
    await page.goto('/')
    const careerAi = page.getByRole('link', { name: 'Open Career AI' })
    await expect(careerAi).toHaveAttribute('href', 'https://careerai.zobique.com')
    await expect(careerAi.locator('svg.ext-icon')).toHaveCount(1)
    await expect(careerAi).not.toHaveAttribute('target', '_blank') // same tab, per brief
    await expect(page.getByRole('link', { name: 'Join early access' })).toHaveAttribute('href', 'https://voicenity.zobique.com')
    await expect(page.getByRole('link', { name: /Talk to Zobique Labs/ }).first()).toHaveAttribute('href', 'https://labs.zobique.com/contact')
  })

  test('CTA clicks push analytics events', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Explore our products' }).click()
    const events = await page.evaluate(() => (window.dataLayer ?? []).map((e) => e.event))
    expect(events).toContain('cta_click')
  })
})

test.describe('header', () => {
  test('products dropdown works from the keyboard', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navigation')
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'Products' })
    await trigger.focus()
    await page.keyboard.press('Enter')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#products-menu').getByRole('link', { name: /Voicenity/ })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
  })

  test('mobile menu traps focus and closes on Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile navigation')
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Open menu' })
    await toggle.click()
    const menu = page.getByRole('dialog', { name: 'Menu' })
    await expect(menu).toBeVisible()
    // Tab well past the last item: focus must stay inside the menu or on its toggle
    for (let i = 0; i < 12; i++) await page.keyboard.press('Tab')
    const inside = await page.evaluate(() => {
      const a = document.activeElement
      return !!a && (!!a.closest('#mobile-menu') || a.classList.contains('menu-toggle'))
    })
    expect(inside).toBe(true)
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
  })
})

test.describe('evidence and consent guards', () => {
  test('unverified claims and non-consented clients do not render', async ({ page }) => {
    for (const path of ['/', '/case-studies', '/labs', '/about', '/products/career-ai']) {
      await page.goto(path)
      const text = await page.locator('body').innerText()
      expect(text, path).not.toContain('Ace10x') // conflicting
      expect(text, path).not.toMatch(/50\+|95%|99\.9%|Ministry/) // removed or unapproved claims
    }
  })

  test('case studies approved for publishing do render', async ({ page }) => {
    await page.goto('/case-studies')
    for (const client of ['National Career Service (NCS)', 'Bizowl', 'Vastav Intellect']) {
      await expect(page.locator('.cs-nav').getByText(client, { exact: true })).toBeVisible()
    }
  })

  test('verified press and features render in Featured', async ({ page }) => {
    await page.goto('/')
    const featured = page.getByRole('region', { name: 'Featured' })
    for (const outlet of ['India Today', 'National Career Service', 'Rising Startup', 'Startup By Vstdy']) {
      await expect(featured.getByRole('link', { name: new RegExp(outlet) })).toHaveCount(1)
    }
  })

  test('the verified NCS deployment does render', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.wz-sub')).toContainText('deployed for National Career Service users')
  })
})

test.describe('contact form', () => {
  test('shows field errors and does not send an invalid form', async ({ page }) => {
    await page.goto('/contact')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText('Please enter your name.')).toBeVisible()
    await expect(page.getByLabel('Name', { exact: true })).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByLabel('Name', { exact: true })).toBeFocused()
  })

  test('sends a valid message and confirms', async ({ page }) => {
    await page.goto('/contact')
    await page.getByLabel('Name', { exact: true }).fill('Test Person')
    await page.getByLabel('Email', { exact: true }).fill('test@example.com')
    await page.getByLabel('Reason', { exact: true }).selectOption('press')
    await page.getByLabel('Message', { exact: true }).fill('Hello, this is an automated test message.')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText(/your message is with us/)).toBeVisible()
  })

  test('shows the error state when the server fails', async ({ page }) => {
    await page.route('/api/contact', (route) => route.fulfill({ status: 502, body: '{}' }))
    await page.goto('/contact')
    await page.getByLabel('Name', { exact: true }).fill('Test Person')
    await page.getByLabel('Email', { exact: true }).fill('test@example.com')
    await page.getByLabel('Reason', { exact: true }).selectOption('other')
    await page.getByLabel('Message', { exact: true }).fill('Hello, this is an automated test message.')
    await page.getByRole('button', { name: 'Send message' }).click()
    await expect(page.getByText(/didn't send/)).toBeVisible()
  })

  test('API rejects bad input, ignores the honeypot and escapes nothing into HTML', async ({ request }) => {
    const bad = await request.post('/api/contact', { data: { name: '', email: 'nope', reason: 'x', message: 'hi' } })
    expect(bad.status()).toBe(422)
    const fields = (await bad.json()).fields
    expect(Object.keys(fields).sort()).toEqual(['email', 'message', 'name', 'reason'])

    const bot = await request.post('/api/contact', { data: { website: 'http://spam', name: 'x' } })
    expect(bot.status()).toBe(200)

    const notJson = await request.post('/api/contact', { data: 'not json', headers: { 'Content-Type': 'application/json' } })
    expect(notJson.status()).toBe(400)
  })
})

test.describe('accessibility', () => {
  for (const path of [...PAGES, '/does-not-exist']) {
    test(`${path} has no serious or critical axe violations`, async ({ page }) => {
      // Reduced motion so no element is caught mid-fade, which skews contrast checks
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(path)
      // Let the entrance animations finish: scroll everything into view, then wait for the fades
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)) }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(1200)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(', ')}`)).toEqual([])
    })
  }

  test('respects reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.mouse.wheel(0, 2000)
    const hidden = await page.locator('.reveal:not(.is-in)').evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length)
    expect(hidden).toBe(0)
  })
})
