import 'server-only'

import {defineQuery} from 'groq'

import type {ContactFormDeliveryConfig, ContactFormId} from '@/lib/contact-form/types'
import {containsHeaderBreak, isValidEmailAddress} from '@/lib/contact-form/validation'

import {sanityClient} from '../client'

const formDocuments: Record<
  ContactFormId,
  {documentId: string; documentType: string}
> = {
  training: {
    documentId: 'trainingInformation',
    documentType: 'trainingInformation',
  },
  recruitment: {
    documentId: 'recruitmentInformation',
    documentType: 'recruitmentInformation',
  },
}

export const CONTACT_FORM_DELIVERY_QUERY = defineQuery(`
  *[_id == $documentId && _type == $documentType][0]{
    contactForm{
      enabled,
      recipientEmail,
      emailSubjectPrefix,
      phoneVisible,
      phoneRequired,
      subjectVisible,
      subjectRequired,
      "hasPrivacyNotice": count(privacyNotice) > 0
    }
  }
`)

type RawDeliveryConfig = {
  contactForm: {
    enabled: boolean | null
    recipientEmail: string | null
    emailSubjectPrefix: string | null
    phoneVisible: boolean | null
    phoneRequired: boolean | null
    subjectVisible: boolean | null
    subjectRequired: boolean | null
    hasPrivacyNotice: boolean
  } | null
} | null

export async function getContactFormDeliveryConfig(
  formId: ContactFormId,
): Promise<ContactFormDeliveryConfig | null> {
  const document = formDocuments[formId]
  const result = await sanityClient.withConfig({useCdn: false}).fetch(
    CONTACT_FORM_DELIVERY_QUERY,
    document,
    {cache: 'no-store'},
  ) as RawDeliveryConfig
  const config = result?.contactForm

  if (
    config?.enabled !== true ||
    typeof config.recipientEmail !== 'string' ||
    !isValidEmailAddress(config.recipientEmail) ||
    typeof config.emailSubjectPrefix !== 'string' ||
    !config.emailSubjectPrefix.trim() ||
    config.emailSubjectPrefix.length > 100 ||
    containsHeaderBreak(config.emailSubjectPrefix) ||
    config.hasPrivacyNotice !== true
  )
    return null

  return {
    enabled: true,
    recipientEmail: config.recipientEmail.trim(),
    emailSubjectPrefix: config.emailSubjectPrefix.trim(),
    phoneVisible: config.phoneVisible !== false,
    phoneRequired:
      config.phoneVisible !== false && config.phoneRequired === true,
    subjectVisible: config.subjectVisible !== false,
    subjectRequired:
      config.subjectVisible !== false && config.subjectRequired === true,
  }
}

export {formDocuments}
