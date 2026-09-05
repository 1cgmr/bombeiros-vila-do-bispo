export const contactFormIds = ['training', 'recruitment'] as const

export type ContactFormId = (typeof contactFormIds)[number]

export const contactFormContexts: Record<ContactFormId, string> = {
  training: 'Formação',
  recruitment: 'Recrutamento',
}
export type PublicContactFormConfig = {
  enabled: boolean | null
  heading: string | null
  introduction: unknown
  privacyNotice: unknown
  submitButtonLabel: string | null
  successMessage: string | null
  errorMessage: string | null
  nameLabel: string | null
  emailLabel: string | null
  phoneLabel: string | null
  phoneVisible: boolean | null
  phoneRequired: boolean | null
  subjectLabel: string | null
  subjectVisible: boolean | null
  subjectRequired: boolean | null
  messageLabel: string | null
}

export type ContactFormClientConfig = {
  submitButtonLabel: string
  successMessage: string
  errorMessage: string
  nameLabel: string
  emailLabel: string
  phoneLabel?: string
  phoneVisible: boolean
  phoneRequired: boolean
  subjectLabel?: string
  subjectVisible: boolean
  subjectRequired: boolean
  messageLabel: string
}

export type ContactFormDeliveryConfig = {
  enabled: boolean
  recipientEmail: string
  emailSubjectPrefix: string
  phoneVisible: boolean
  phoneRequired: boolean
  subjectVisible: boolean
  subjectRequired: boolean
}

export type ContactFormSubmission = {
  formId: ContactFormId
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
}

export type ContactFormField = 'name' | 'email' | 'phone' | 'subject' | 'message'

export type ContactFormFieldErrors = Partial<Record<ContactFormField, string>>

export type ContactFormResponse =
  | {ok: true}
  | {
      ok: false
      code:
        | 'INVALID_REQUEST'
        | 'VALIDATION_ERROR'
        | 'FORM_UNAVAILABLE'
        | 'SERVICE_UNAVAILABLE'
        | 'SEND_FAILED'
      fieldErrors?: ContactFormFieldErrors
    }

export function isContactFormId(value: unknown): value is ContactFormId {
  return typeof value === 'string' && contactFormIds.includes(value as ContactFormId)
}
