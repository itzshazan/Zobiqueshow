// Analytics events from brief section J. Events go to window.dataLayer, which a
// tag manager (e.g. GTM) can pick up once one is installed and consent allows it.
// Nothing is sent anywhere by this file on its own.

export type AnalyticsEvent =
  | { name: 'cta_click'; label: string; destination: string }
  | { name: 'product_card_click'; product: string }
  | { name: 'labs_cta_click'; location: string }
  | { name: 'outbound_click'; domain: string }
  | { name: 'contact_submit'; reason: string }
  | { name: 'case_study_view'; slug: string }

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
  }
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return
  const { name, ...params } = event
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event: name, ...params })
}

/** Host of a URL, or null for links that stay on zobique.com. */
export function outboundDomain(href: string): string | null {
  if (!/^https?:\/\//.test(href)) return null
  try {
    const host = new URL(href).hostname
    return host === 'zobique.com' || host === 'www.zobique.com' ? null : host
  } catch {
    return null
  }
}
