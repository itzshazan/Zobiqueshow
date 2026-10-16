// All copy and data pulled from zobique.com and labs.zobique.com

import { CDN_URL } from '@/lib/constants'
import type { Logo, Stat, TitledText, Match, Solution, Phase, Company, Spec, Testimonial, Pair, ContactLink } from '@/types'

// Client logos for the scrolling strip under the hero
export const marquee: Logo[] = [
  { name: 'National Career Service', src: CDN_URL + 'v1777100591/ncs-small-logo_ucxlog.png', h: 58 },
  { name: 'Microsoft', src: '/logos/microsoft.svg' },
  { name: 'IBM', src: '/logos/ibm.svg' },
  { name: 'Hobfit', src: CDN_URL + 'v1776186102/hobfit_ypukos.png' },
  { name: 'Clerk', src: CDN_URL + 'v1777102661/clerk_bzvmrq.png' },
  { name: 'Appspine', src: CDN_URL + 'v1774548949/appspine_xvlp6a.png' },
  { name: 'German Leap', src: CDN_URL + 'v1775897286/germanLeap_virujq.png' },
  { name: 'Agnistoka', src: CDN_URL + 'v1775897075/agnistoka_rikzrv.png' },
  { name: 'Mera Nivas', src: CDN_URL + 'v1775898712/meranivas_k05kpt.png' },
  { name: 'Aipply', src: CDN_URL + 'v1776186160/aipply_a4fidw.png' },
  { name: 'Techcloud Ltd', src: CDN_URL + 'v1777101358/tech_cloud_ltd_logo_zqkyzq.jpg' },
]

export const stats: Stat[] = [
  { count: 50, suffix: '+', label: 'businesses served by Zobique Labs' },
  { count: 95, suffix: '%', label: 'match accuracy on the career platform' },
  { text: '2–16', label: 'weeks from first call to production' },
  { text: '99.9', suffix: '%', label: 'uptime across the platform' },
]

export const platformServices: TitledText[] = [
  { title: 'Job Intelligence', body: "AI job matching, application tracking, hiring signals and a job-search chatbot that surfaces roles you'd actually get." },
  { title: 'Resume & ATS Tools', body: 'An AI resume builder that rewrites for every job description and gets you past applicant tracking systems.' },
  { title: 'Interview Prep', body: "Mock interviews with AI feedback on what you said and how you said it, tuned to the role you're applying for." },
  { title: 'Career Studio', body: 'Career roadmaps, skill gap analysis and a career readiness score, with certification and course recommendations.' },
  { title: 'Placement Intelligence', body: 'Tools for universities and placement cells: placement analytics, student engagement tracking and campus drives.' },
]

export const matches: Match[] = [
  ['Software Engineer', 'Google', 98],
  ['Frontend Dev', 'Microsoft', 95],
  ['Product Designer', 'Meta', 92],
  ['Data Scientist', 'Amazon', 87],
  ['DevOps Engineer', 'Netflix', 78],
]

// Downloaded from Wikimedia Commons into public/logos
export const topCompanies: Logo[] = [
  { name: 'Google', src: '/logos/google.svg' },
  { name: 'Microsoft', src: '/logos/microsoft.svg' },
  { name: 'Amazon', src: '/logos/amazon.svg' },
  { name: 'Meta', src: '/logos/meta.svg', h: 22 },
  { name: 'Apple', src: '/logos/apple.svg', h: 32 },
  { name: 'Netflix', src: '/logos/netflix.svg' },
  { name: 'Spotify', src: '/logos/spotify.svg' },
  { name: 'IBM', src: '/logos/ibm.svg' },
]

export const labsServices: TitledText[] = [
  { title: 'AI Application Development', body: 'From concept to production-ready AI, built around your data and your operating model.' },
  { title: 'AI Agent Development', body: 'Multi-agent systems with deterministic guardrails, so automation never outruns your control.' },
  { title: 'AI Copilot Development', body: 'Copilots for sales, support and ops teams that think alongside them in real time.' },
  { title: 'Enterprise AI Solutions', body: 'Private, secure AI your enterprise can trust, built for strict governance and zero data leakage.' },
  { title: 'AI Workflow Automation', body: 'Assistants trained on your own knowledge base, built to multiply what your team gets done.' },
  { title: 'AI Strategy & Architecture', body: 'Senior technical ownership of your AI architecture, roadmap and delivery, via embedded or production engineering.' },
]

export const solutions: Solution[] = [
  { name: 'AI Sales Agent', group: 'Customer-facing' },
  { name: 'AI Voice Agent', group: 'Customer-facing' },
  { name: 'AI Customer Support', group: 'Customer-facing' },
  { name: 'AI Recruitment Agent', group: 'Customer-facing' },
  { name: 'AI Agent Growth Systems', group: 'Customer-facing' },
  { name: 'Document AI', group: 'Document & enterprise' },
  { name: 'Intelligent Document Processing', group: 'Document & enterprise' },
  { name: 'Private RAG', group: 'Document & enterprise' },
  { name: 'Enterprise AI Automation', group: 'Document & enterprise' },
]

export const deliveryPhases: Phase[] = [
  { title: 'Discover', items: ['Workflow mapping', 'ROI modeling', 'Architecture blueprint'] },
  { title: 'Design', items: ['Agent behavior', 'Tool access', 'Escalation paths', 'Prototypes'] },
  { title: 'Build', items: ['Integrations', 'Custom RAG', 'Private fine-tuning', 'Testing on real data'] },
  { title: 'Launch & Evolve', items: ['Zero-downtime deployment', 'Telemetry', 'Retraining', 'A/B testing'] },
]

export const specs: Spec[] = [
  ['Models', ['OpenAI', 'Anthropic', 'Gemini', 'Qwen', 'DeepSeek']],
  ['Industries', ['Healthcare', 'Finance', 'Recruitment', 'Logistics']],
  ['Engagement', ['Embedded AI Engineering', 'Production AI Engineering']],
  ['Security', ['SOC2 standards', 'Role-based access', 'Private deployments']],
]

export const companies: Company[] = [
  { name: 'National Career Service', desc: 'Govt. of India job-skill matching', img: CDN_URL + 'v1777100591/ncs-small-logo_ucxlog.png', tags: ['Labs', 'Platform', 'Government'] },
  { name: 'Bizowl', desc: 'Marketplace & community platform', tags: ['Labs', 'Build'] },
  { name: 'Hobfit', desc: 'Health & fitness', img: CDN_URL + 'v1776186102/hobfit_ypukos.png', tags: ['Labs', 'Platform'] },
  { name: 'Clerk', desc: 'Patent drafting automation', img: CDN_URL + 'v1777102661/clerk_bzvmrq.png', tags: ['Labs', 'Automation'] },
  { name: 'Appspine', desc: 'Product engineering', img: CDN_URL + 'v1774548949/appspine_xvlp6a.png', tags: ['Labs', 'Platform'] },
  { name: 'German Leap', desc: 'Study & careers abroad', img: CDN_URL + 'v1775897286/germanLeap_virujq.png', tags: ['Labs', 'Platform'] },
  { name: 'Agnistoka', desc: 'Partner brand', img: CDN_URL + 'v1775897075/agnistoka_rikzrv.png', tags: ['Labs', 'Platform'] },
  { name: 'Mera Nivas', desc: 'Real estate & housing', img: CDN_URL + 'v1775898712/meranivas_k05kpt.png', tags: ['Labs', 'Platform'] },
  { name: 'Aipply', desc: 'AI job applications', img: CDN_URL + 'v1776186160/aipply_a4fidw.png', tags: ['Labs', 'Platform'] },
  { name: 'Techcloud Ltd', desc: 'Cloud services', img: CDN_URL + 'v1777101358/tech_cloud_ltd_logo_zqkyzq.jpg', tags: ['Platform'] },
  { name: 'VIIPS', desc: 'Founder-led venture', tags: ['Labs'] },
  { name: 'Ace10x', desc: 'Growth systems', tags: ['Labs'] },
  { name: 'SilverButton', desc: 'Client build', tags: ['Labs'] },
  { name: 'MRIIF', desc: 'Innovation & incubation', tags: ['Labs', 'Build'] },
  { name: 'Microsoft', desc: 'Trusted by', tags: ['Platform'] },
  { name: 'IBM', desc: 'Trusted by', tags: ['Platform'] },
]

export const testimonials: Testimonial[] = [
  {
    quote: 'Integrating a job and skill matching algorithm into an existing government ecosystem comes with its own layers of complexity. The team navigated all of it with professionalism and technical depth.',
    initials: 'NCS', name: 'National Career Service', role: 'Ministry of Labour and Employment, Govt. of India',
  },
  {
    quote: "Building a marketplace and community platform together is no small task. It genuinely feels like working with a team that's invested in Bizowl's success, not just delivering a project.",
    initials: 'PS', name: 'Prashant Shirohi', role: 'Founder, Bizowl',
  },
  {
    // Paraphrased from zobique.com; replace with the original wording if available
    quote: 'Zobique helped me build an ATS-friendly resume and figure out exactly which cloud certifications to go after next.',
    initials: 'SC', name: 'Sachin Chaubey', role: '3rd-year student, Cloud Computing enthusiast',
  },
]

export const faqs: Pair[] = [
  ["What's the difference between Zobique and Zobique Labs?", 'Zobique is a career intelligence platform for students, graduates and universities. Zobique Labs is our engineering studio, building custom AI agents, copilots and automation for businesses.'],
  ['What makes the Zobique platform different from other job sites?', "It doesn't just list jobs. It predicts the roles you fit, optimizes your resume for each application, prepares you for interviews and tracks everything in one place."],
  ['How fast can Labs get an AI system into production?', 'Typically between 2 and 16 weeks, depending on scope, through a Discover, Design, Build and Launch process.'],
  ["Is my company's data safe with Labs?", 'Systems are built with strict data privacy, SOC2 compliance standards and role-based access controls, including private deployments with zero data leakage.'],
  ['Does the platform cover careers outside computer science?', 'Yes. Career guidance, certifications and course recommendations extend beyond CS, and job suggestions take your location into account.'],
]

export const contacts: ContactLink[] = [
  { label: 'New projects', value: 'contact@zobique.com', href: 'mailto:contact@zobique.com' },
  { label: 'Platform support', value: 'support@zobique.com', href: 'mailto:support@zobique.com' },
  { label: 'Call or WhatsApp', value: '+91 81302 43850', href: 'https://wa.me/918130243850' },
]

export const socials: Pair[] = [
  ['X / Twitter', 'https://x.com/zobiqueai'],
  ['LinkedIn', 'https://www.linkedin.com/company/zobique'],
  ['Instagram', 'https://www.instagram.com/zobiqueai'],
  ['YouTube', 'https://www.youtube.com/@zobique'],
]
