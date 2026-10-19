// Shared by the contact form (instant feedback) and the API route (the real check).

export const CONTACT_LIMITS = { name: 100, email: 200, organisation: 150, message: 5000 } as const

export interface ContactInput {
  name: string
  email: string
  organisation: string
  reason: string
  message: string
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i

export function validateContact(raw: Record<string, unknown>, allowedReasons: string[]): ContactErrors {
  const v = (k: string) => (typeof raw[k] === 'string' ? (raw[k] as string).trim() : '')
  const errors: ContactErrors = {}

  const name = v('name')
  if (!name) errors.name = 'Please enter your name.'
  else if (name.length > CONTACT_LIMITS.name) errors.name = `Keep your name under ${CONTACT_LIMITS.name} characters.`

  const email = v('email')
  if (!email) errors.email = 'Please enter your email address.'
  else if (email.length > CONTACT_LIMITS.email || !EMAIL.test(email)) errors.email = 'Please enter a valid email address, like name@company.com.'

  if (v('organisation').length > CONTACT_LIMITS.organisation) errors.organisation = `Keep this under ${CONTACT_LIMITS.organisation} characters.`

  if (!allowedReasons.includes(v('reason'))) errors.reason = 'Please choose a reason.'

  const message = v('message')
  if (message.length < 10) errors.message = 'Please write a little more about what you need (at least 10 characters).'
  else if (message.length > CONTACT_LIMITS.message) errors.message = `Keep your message under ${CONTACT_LIMITS.message} characters.`

  return errors
}

export function cleanContact(raw: Record<string, unknown>): ContactInput {
  const v = (k: string) => (typeof raw[k] === 'string' ? (raw[k] as string).trim() : '')
  return { name: v('name'), email: v('email'), organisation: v('organisation'), reason: v('reason'), message: v('message') }
}
