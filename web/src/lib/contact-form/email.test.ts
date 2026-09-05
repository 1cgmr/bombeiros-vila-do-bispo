import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

const resendMocks = vi.hoisted(() => ({
  construct: vi.fn(),
  send: vi.fn(),
}))

vi.mock('server-only', () => ({}))
vi.mock('resend', () => ({
  Resend: class {
    emails = {send: resendMocks.send}

    constructor(apiKey: string) {
      resendMocks.construct(apiKey)
    }
  },
}))

import {
  ContactEmailConfigurationError,
  ContactEmailSendError,
  sendContactEmail,
} from './email'

const config = {
  enabled: true,
  recipientEmail: 'destino@example.com',
  emailSubjectPrefix: '[Website - Recrutamento]',
  phoneVisible: true,
  phoneRequired: false,
  subjectVisible: true,
  subjectRequired: false,
}

describe('Resend contact email adapter', () => {
  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', 'test-api-key')
    vi.stubEnv('RESEND_FROM_EMAIL', 'formularios@example.com')
    resendMocks.send.mockResolvedValue({data: {id: 'email-id'}, error: null})
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it('uses the trusted sender and recipient and the visitor only as Reply-To', async () => {
    await sendContactEmail({
      config,
      submittedAt: new Date('2026-09-05T12:00:00.000Z'),
      submission: {
        formId: 'recruitment',
        name: 'Ana Silva',
        email: 'ana@example.com',
        phone: '912 345 678',
        subject: 'Pedido de informação',
        message: 'Gostaria de saber mais.',
      },
    })

    expect(resendMocks.construct).toHaveBeenCalledWith('test-api-key')
    expect(resendMocks.send).toHaveBeenCalledWith({
      from: 'Website — Bombeiros de Vila do Bispo <formularios@example.com>',
      to: 'destino@example.com',
      replyTo: 'ana@example.com',
      subject: '[Website - Recrutamento] Pedido de informação',
      text: expect.stringContaining('Formulário: Recrutamento'),
    })
    const payload = resendMocks.send.mock.calls[0][0]
    expect(payload.text).toContain('Telefone: 912 345 678')
    expect(payload.text).toContain('Data de envio: 2026-09-05T12:00:00.000Z')
  })

  it('uses the generic subject fallback', async () => {
    await sendContactEmail({
      config,
      submission: {
        formId: 'recruitment',
        name: 'Ana Silva',
        email: 'ana@example.com',
        message: 'Mensagem.',
      },
    })
    expect(resendMocks.send.mock.calls[0][0].subject).toBe(
      '[Website - Recrutamento] Novo pedido de contacto',
    )
  })

  it('fails safely when server configuration is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    await expect(
      sendContactEmail({
        config,
        submission: {
          formId: 'recruitment',
          name: 'Ana Silva',
          email: 'ana@example.com',
          message: 'Mensagem.',
        },
      }),
    ).rejects.toBeInstanceOf(ContactEmailConfigurationError)
    expect(resendMocks.send).not.toHaveBeenCalled()
  })

  it('converts a provider error into a safe application error', async () => {
    resendMocks.send.mockResolvedValue({data: null, error: {message: 'provider details'}})
    await expect(
      sendContactEmail({
        config,
        submission: {
          formId: 'recruitment',
          name: 'Ana Silva',
          email: 'ana@example.com',
          message: 'Mensagem.',
        },
      }),
    ).rejects.toBeInstanceOf(ContactEmailSendError)
  })
})
