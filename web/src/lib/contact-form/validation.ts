import type {
  ContactFormDeliveryConfig,
  ContactFormFieldErrors,
  ContactFormSubmission,
} from './types'
import {isContactFormId} from './types'

export const MAX_CONTACT_REQUEST_BYTES = 20_000

const allowedKeys = new Set([
  'formId',
  'name',
  'email',
  'phone',
  'subject',
  'message',
  'website',
])

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^\+?[0-9][0-9\s().-]{5,39}$/
const headerBreakPattern = /[\r\n]/

type ParsedRequest = {
  formId: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  website: string
}
export type RequestShapeResult =
  | {ok: true; value: ParsedRequest}
  | {ok: false; code: 'INVALID_REQUEST'}

export type SubmissionValidationResult =
  | {ok: true; value: ContactFormSubmission}
  | {
      ok: false
      code: 'VALIDATION_ERROR'
      fieldErrors: ContactFormFieldErrors
    }

function normalizeSingleLine(value: string) {
  return value.normalize('NFC').trim().replace(/[\t ]+/g, ' ')
}

function normalizeMessage(value: string) {
  return value.normalize('NFC').replace(/\r\n?/g, '\n').trim()
}

export function parseContactRequest(value: unknown): RequestShapeResult {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return {ok: false, code: 'INVALID_REQUEST'}

  const record = value as Record<string, unknown>
  if (Object.keys(record).some((key) => !allowedKeys.has(key)))
    return {ok: false, code: 'INVALID_REQUEST'}

  for (const requiredKey of ['formId', 'name', 'email', 'message', 'website']) {
    if (!(requiredKey in record)) return {ok: false, code: 'INVALID_REQUEST'}
  }

  for (const key of allowedKeys) {
    if (key in record && typeof record[key] !== 'string')
      return {ok: false, code: 'INVALID_REQUEST'}
  }

  return {
    ok: true,
    value: {
      formId: record.formId as string,
      name: record.name as string,
      email: record.email as string,
      phone: (record.phone as string | undefined) ?? '',
      subject: (record.subject as string | undefined) ?? '',
      message: record.message as string,
      website: record.website as string,
    },
  }
}

export function validateContactSubmission(
  request: ParsedRequest,
  config: ContactFormDeliveryConfig,
): SubmissionValidationResult {
  const fieldErrors: ContactFormFieldErrors = {}
  const name = normalizeSingleLine(request.name)
  const email = normalizeSingleLine(request.email)
  const phone = normalizeSingleLine(request.phone)
  const subject = normalizeSingleLine(request.subject)
  const message = normalizeMessage(request.message)

  if (!name) fieldErrors.name = 'Indique o seu nome.'
  else if (name.length > 120 || headerBreakPattern.test(name))
    fieldErrors.name = 'O nome é inválido ou demasiado longo.'

  if (!email) fieldErrors.email = 'Indique o seu email.'
  else if (
    email.length > 254 ||
    headerBreakPattern.test(email) ||
    !emailPattern.test(email)
  )
    fieldErrors.email = 'Introduza um endereço de email válido.'

  if (config.phoneVisible) {
    if (config.phoneRequired && !phone)
      fieldErrors.phone = 'Indique o seu número de telefone.'
    else if (phone && (phone.length > 40 || !phonePattern.test(phone)))
      fieldErrors.phone = 'Introduza um número de telefone válido.'
  } else if (phone) {
    fieldErrors.phone = 'Este campo não está disponível.'
  }

  if (config.subjectVisible) {
    if (config.subjectRequired && !subject)
      fieldErrors.subject = 'Indique o assunto.'
    else if (subject.length > 160 || headerBreakPattern.test(subject))
      fieldErrors.subject = 'O assunto é inválido ou demasiado longo.'
  } else if (subject) {
    fieldErrors.subject = 'Este campo não está disponível.'
  }

  if (!message) fieldErrors.message = 'Escreva a sua mensagem.'
  else if (message.length > 5_000)
    fieldErrors.message = 'A mensagem é demasiado longa.'

  if (Object.keys(fieldErrors).length)
    return {ok: false, code: 'VALIDATION_ERROR', fieldErrors}

  if (!isContactFormId(request.formId))
    return {ok: false, code: 'VALIDATION_ERROR', fieldErrors: {}}

  return {
    ok: true,
    value: {
      formId: request.formId,
      name,
      email,
      phone: config.phoneVisible && phone ? phone : undefined,
      subject: config.subjectVisible && subject ? subject : undefined,
      message,
    },
  }
}

export function isValidEmailAddress(value: string) {
  return (
    value.length <= 254 &&
    !headerBreakPattern.test(value) &&
    emailPattern.test(value)
  )
}

export function containsHeaderBreak(value: string) {
  return headerBreakPattern.test(value)
}
