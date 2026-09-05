import {describe, expect, it} from 'vitest'

import type {ContactFormDeliveryConfig} from './types'
import {parseContactRequest, validateContactSubmission} from './validation'

const config: ContactFormDeliveryConfig = {
  enabled: true,
  recipientEmail: 'destino@example.com',
  emailSubjectPrefix: '[Website - Formação]',
  phoneVisible: true,
  phoneRequired: false,
  subjectVisible: true,
  subjectRequired: false,
}

const request = {
  formId: 'training',
  name: 'Ana Silva',
  email: 'ana@example.com',
  phone: '',
  subject: '',
  message: 'Gostaria de obter informações.',
  website: '',
}

describe('contact request validation', () => {
  it('accepts and normalizes a valid request', () => {
    const parsed = parseContactRequest({...request, name: '  Ana   Silva  '})
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return

    const result = validateContactSubmission(parsed.value, config)
    expect(result).toEqual({
      ok: true,
      value: {
        formId: 'training',
        name: 'Ana Silva',
        email: 'ana@example.com',
        message: 'Gostaria de obter informações.',
      },
    })
  })

  it('rejects unknown keys and non-string values', () => {
    expect(parseContactRequest({...request, recipient: 'attacker@example.com'}).ok).toBe(false)
    expect(parseContactRequest({...request, name: 123}).ok).toBe(false)
    expect(parseContactRequest([]).ok).toBe(false)
  })

  it('enforces required, length and email rules', () => {
    const parsed = parseContactRequest({
      ...request,
      name: '',
      email: 'invalid',
      message: 'x'.repeat(5_001),
    })
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return

    const result = validateContactSubmission(parsed.value, config)
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.fieldErrors).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      message: expect.any(String),
    })
  })

  it('uses trusted visibility and required rules', () => {
    const hidden = parseContactRequest({...request, phone: '999999999'})
    expect(hidden.ok).toBe(true)
    if (!hidden.ok) return
    const hiddenResult = validateContactSubmission(hidden.value, {
      ...config,
      phoneVisible: false,
    })
    expect(hiddenResult.ok).toBe(false)
    if (!hiddenResult.ok)
      expect(hiddenResult.fieldErrors.phone).toBe('Este campo não está disponível.')

    const required = parseContactRequest(request)
    expect(required.ok).toBe(true)
    if (!required.ok) return
    const requiredResult = validateContactSubmission(required.value, {
      ...config,
      subjectRequired: true,
    })
    expect(requiredResult.ok).toBe(false)
    if (!requiredResult.ok)
      expect(requiredResult.fieldErrors.subject).toBe('Indique o assunto.')
  })

  it('rejects header breaks in the visitor subject', () => {
    const parsed = parseContactRequest({...request, subject: 'Pedido\r\nBcc: vítima@example.com'})
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    const result = validateContactSubmission(parsed.value, config)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.fieldErrors.subject).toBeDefined()
  })

  it('rejects line breaks that could confuse structured email fields', () => {
    const parsed = parseContactRequest({...request, name: 'Ana\nEmail: falso@example.com'})
    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    const result = validateContactSubmission(parsed.value, config)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.fieldErrors.name).toBeDefined()
  })
})
