export type AddressValue = {
  line1?: string | null
  line2?: string | null
  postalCode?: string | null
  locality?: string | null
  municipality?: string | null
  country?: string | null
} | null

export type CallToActionValue = {
  label?: string | null
  accessibleLabel?: string | null
  destinationType?: 'internal' | 'external' | 'telephone' | null
  internalPath?: string | null
  externalUrl?: string | null
  phoneNumber?: string | null
  style?: 'primary' | 'secondary' | 'emergency' | null
} | null | undefined

export function formatAddress(address: AddressValue) {
  if (!address) return []

  return [
    address.line1,
    address.line2,
    [address.postalCode, address.locality].filter(Boolean).join(' '),
    address.municipality,
    address.country,
  ].filter((line): line is string => Boolean(line?.trim()))
}

export function getCallToActionHref(callToAction: CallToActionValue) {
  if (!callToAction) return null

  if (callToAction.destinationType === 'internal' && callToAction.internalPath?.startsWith('/')) {
    return callToAction.internalPath
  }

  if (callToAction.destinationType === 'external' && callToAction.externalUrl?.startsWith('https://')) {
    return callToAction.externalUrl
  }

  if (callToAction.destinationType === 'telephone' && callToAction.phoneNumber) {
    return `tel:${callToAction.phoneNumber.replace(/[^+\d]/g, '')}`
  }

  return null
}

export function formatDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function hasPortableText(value: unknown): value is Array<Record<string, unknown>> {
  return Array.isArray(value) && value.length > 0
}
