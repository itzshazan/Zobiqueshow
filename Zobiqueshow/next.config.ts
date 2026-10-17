import type { NextConfig } from 'next'
import redirectMap from './redirects.json'

const isProd = process.env.NODE_ENV === 'production'

// Next needs inline scripts for hydration; a nonce-based CSP would remove 'unsafe-inline'
// but forces every page to render dynamically, which costs speed (brief: speed is brand).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://res.cloudinary.com",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  ...(isProd ? [{ key: 'Content-Security-Policy', value: csp }] : []),
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
  // Server-side, single-hop 301s for the Career AI move. Off until cut-over (brief K.9: STOP first).
  async redirects() {
    // Work was renamed Case Studies; old links keep working
    const renamedSection = [
      { source: '/work', destination: '/case-studies', statusCode: 301 as const },
      { source: '/work/:slug', destination: '/case-studies/:slug', statusCode: 301 as const },
    ]
    if (process.env.ENABLE_MIGRATION_REDIRECTS !== 'true') return renamedSection
    const toCareerAi = redirectMap.toCareerAi.map((source) => ({
      source,
      destination: `${redirectMap.careerAiOrigin}${source}`,
      statusCode: 301 as const,
    }))
    const renamed = redirectMap.renamed.map((r) => ({ ...r, statusCode: 301 as const }))
    return [...renamedSection, ...toCareerAi, ...renamed]
  },
}

export default nextConfig
