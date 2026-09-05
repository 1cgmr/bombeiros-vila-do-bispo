import 'server-only'

import {isValidEmailAddress} from './validation'

export type ResendEnvironment = {
  apiKey: string
  fromEmail: string
}
export function getResendEnvironment(): ResendEnvironment | null {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim()

  if (!apiKey || !fromEmail || !isValidEmailAddress(fromEmail)) return null

  return {apiKey, fromEmail}
}
