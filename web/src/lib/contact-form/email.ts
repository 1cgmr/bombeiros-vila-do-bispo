import 'server-only'

import {Resend} from 'resend'

import {getResendEnvironment} from './environment'
import {
  contactFormContexts,
  type ContactFormDeliveryConfig,
  type ContactFormSubmission,
} from './types'

export class ContactEmailConfigurationError extends Error {
  constructor() {
    super('Contact email service is not configured')
    this.name = 'ContactEmailConfigurationError'
  }
}
export class ContactEmailSendError extends Error {
  constructor() {
    super('Contact email delivery failed')
    this.name = 'ContactEmailSendError'
  }
}

export async function sendContactEmail({
  submission,
  config,
  submittedAt = new Date(),
}: {
  submission: ContactFormSubmission
  config: ContactFormDeliveryConfig
  submittedAt?: Date
}) {
  const environment = getResendEnvironment()
  if (!environment) throw new ContactEmailConfigurationError()

  const context = contactFormContexts[submission.formId]
  const subjectDetail = submission.subject || 'Novo pedido de contacto'
  const subject = `${config.emailSubjectPrefix} ${subjectDetail}`.trim()
  const lines = [
    `Formulário: ${context}`,
    `Nome: ${submission.name}`,
    `Email: ${submission.email}`,
    ...(submission.phone ? [`Telefone: ${submission.phone}`] : []),
    ...(submission.subject ? [`Assunto indicado: ${submission.subject}`] : []),
    '',
    'Mensagem:',
    submission.message,
    '',
    `Data de envio: ${submittedAt.toISOString()}`,
  ]

  const resend = new Resend(environment.apiKey)
  const {error} = await resend.emails.send({
    from: `Website — Bombeiros de Vila do Bispo <${environment.fromEmail}>`,
    to: config.recipientEmail,
    replyTo: submission.email,
    subject,
    text: lines.join('\n'),
  })

  if (error) throw new ContactEmailSendError()
}
