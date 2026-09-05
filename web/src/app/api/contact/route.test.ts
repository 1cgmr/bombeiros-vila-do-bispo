import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

const routeMocks = vi.hoisted(() => ({
  getConfig: vi.fn(),
  sendEmail: vi.fn(),
}))

vi.mock('@/sanity/queries/contact-forms', () => ({
  getContactFormDeliveryConfig: routeMocks.getConfig,
}))
vi.mock('@/lib/contact-form/email', () => {
  class ContactEmailConfigurationError extends Error {}
  return {
    ContactEmailConfigurationError,
    sendContactEmail: routeMocks.sendEmail,
  }
})
import {ContactEmailConfigurationError} from '@/lib/contact-form/email'

import {POST} from './route'

const config = {
  enabled: true,
  recipientEmail: 'destino@example.com',
  emailSubjectPrefix: '[Website]',
  phoneVisible: true,
  phoneRequired: false,
  subjectVisible: true,
  subjectRequired: false,
}

const validBody = {
  formId: 'training',
  name: 'Ana Silva',
  email: 'ana@example.com',
  phone: '',
  subject: 'Informações',
  message: 'Gostaria de saber mais.',
  website: '',
}

function request(body: unknown, contentType = 'application/json') {
  return new Request('https://example.com/api/contact', {
    method: 'POST',
    headers: {'Content-Type': contentType},
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routeMocks.getConfig.mockResolvedValue(config)
    routeMocks.sendEmail.mockResolvedValue(undefined)
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => vi.restoreAllMocks())

  it.each(['training', 'recruitment'] as const)(
    'sends a valid %s submission using its trusted configuration',
    async (formId) => {
      const response = await POST(request({...validBody, formId}))
      expect(response.status).toBe(200)
      expect(routeMocks.getConfig).toHaveBeenCalledWith(formId)
      expect(routeMocks.sendEmail).toHaveBeenCalledWith({
        config,
        submission: expect.objectContaining({formId, email: 'ana@example.com'}),
      })
    },
  )

  it('rejects invalid content types and malformed JSON', async () => {
    expect((await POST(request(validBody, 'text/plain'))).status).toBe(415)
    expect((await POST(request('{invalid'))).status).toBe(400)
  })

  it('rejects an unknown form without looking up configuration', async () => {
    const response = await POST(request({...validBody, formId: 'unknown'}))
    expect(response.status).toBe(400)
    expect(routeMocks.getConfig).not.toHaveBeenCalled()
  })

  it.each(['recipient', 'to', 'from', 'replyTo'])(
    'rejects the browser-supplied delivery field %s',
    async (field) => {
      const response = await POST(request({...validBody, [field]: 'attacker@example.com'}))
      expect(response.status).toBe(400)
      expect(routeMocks.sendEmail).not.toHaveBeenCalled()
    },
  )

  it('rejects invalid email, missing data, oversized fields and non-string data', async () => {
    for (const body of [
      {...validBody, email: 'invalid'},
      {...validBody, message: ''},
      {...validBody, name: 'x'.repeat(121)},
      {...validBody, name: 123},
    ]) {
      const response = await POST(request(body))
      expect(response.status).toBe(400)
    }
    expect(routeMocks.sendEmail).not.toHaveBeenCalled()
  })

  it('rejects header injection in the visitor subject', async () => {
    const response = await POST(
      request({...validBody, subject: 'Pedido\r\nBcc: vítima@example.com'}),
    )
    expect(response.status).toBe(400)
    expect(routeMocks.sendEmail).not.toHaveBeenCalled()
  })

  it('returns success for the honeypot without looking up configuration or sending', async () => {
    const response = await POST(request({...validBody, website: 'https://spam.example'}))
    expect(response.status).toBe(200)
    expect(routeMocks.getConfig).not.toHaveBeenCalled()
    expect(routeMocks.sendEmail).not.toHaveBeenCalled()
  })

  it('rejects a disabled or unavailable form', async () => {
    routeMocks.getConfig.mockResolvedValue(null)
    const response = await POST(request(validBody))
    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ok: false, code: 'FORM_UNAVAILABLE'})
  })

  it('returns a safe response for missing Resend configuration', async () => {
    routeMocks.sendEmail.mockRejectedValue(new ContactEmailConfigurationError())
    const response = await POST(request(validBody))
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ok: false, code: 'SERVICE_UNAVAILABLE'})
  })

  it('returns a safe response for a Resend provider failure', async () => {
    routeMocks.sendEmail.mockRejectedValue(new Error('provider details'))
    const response = await POST(request(validBody))
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ok: false, code: 'SEND_FAILED'})
  })
})
