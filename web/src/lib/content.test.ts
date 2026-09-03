import {describe, expect, it} from 'vitest'

import {formatAddress, getCallToActionHref, hasPortableText} from './content'

describe('content helpers', () => {
  it('handles absent CMS content without inventing values', () => {
    expect(formatAddress(null)).toEqual([])
    expect(getCallToActionHref(null)).toBeNull()
    expect(hasPortableText(undefined)).toBe(false)
  })

  it('formats only supplied address lines', () => {
    expect(formatAddress({line1: 'Linha oficial', postalCode: '0000-000', locality: 'Localidade'})).toEqual(['Linha oficial', '0000-000 Localidade'])
  })

  it('accepts controlled CTA destinations', () => {
    expect(getCallToActionHref({destinationType: 'internal', internalPath: '/recrutamento'})).toBe('/recrutamento')
    expect(getCallToActionHref({destinationType: 'external', externalUrl: 'http://inseguro.example'})).toBeNull()
    expect(getCallToActionHref({destinationType: 'telephone', phoneNumber: '+351 000 000 000'})).toBe('tel:+351000000000')
  })
})
