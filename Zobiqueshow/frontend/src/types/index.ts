// Shapes of the content in data/content.ts

export interface Logo { name: string; src: string; h?: number }
export interface Stat { label: string; count?: number; text?: string; suffix?: string }
export interface TitledText { title: string; body: string }
export type Match = readonly [role: string, company: string, pct: number]
export interface Solution { name: string; group: string }
export interface Phase { title: string; items: string[] }
export type Spec = readonly [label: string, values: string[]]
export interface Company { name: string; desc: string; img?: string; tags: string[] }
export interface Testimonial { quote: string; initials: string; name: string; role: string }
export type Pair = readonly [string, string]
export interface ContactLink { label: string; value: string; href: string }
