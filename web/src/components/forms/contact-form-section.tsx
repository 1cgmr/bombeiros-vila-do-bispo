import {PortableTextRenderer} from '@/components/content/portable-text'
import type {
  ContactFormClientConfig,
  ContactFormId,
  PublicContactFormConfig,
} from '@/lib/contact-form/types'

import {ContactForm} from './contact-form'

function getClientConfig(
  config: PublicContactFormConfig,
): ContactFormClientConfig | null {
  const phoneVisible = config.phoneVisible !== false
  const subjectVisible = config.subjectVisible !== false

  if (
    !config.submitButtonLabel ||
    !config.successMessage ||
    !config.errorMessage ||
    !config.nameLabel ||
    !config.emailLabel ||
    !config.messageLabel ||
    (phoneVisible && !config.phoneLabel) ||
    (subjectVisible && !config.subjectLabel)
  )
    return null

  return {
    submitButtonLabel: config.submitButtonLabel,
    successMessage: config.successMessage,
    errorMessage: config.errorMessage,
    nameLabel: config.nameLabel,
    emailLabel: config.emailLabel,
    phoneLabel: config.phoneLabel ?? undefined,
    phoneVisible,
    phoneRequired: phoneVisible && config.phoneRequired === true,
    subjectLabel: config.subjectLabel ?? undefined,
    subjectVisible,
    subjectRequired: subjectVisible && config.subjectRequired === true,
    messageLabel: config.messageLabel,
  }
}

export function ContactFormSection({
  formId,
  config,
}: {
  formId: ContactFormId
  config?: PublicContactFormConfig | null
}) {
  if (
    config?.enabled !== true ||
    !config.heading ||
    !Array.isArray(config.privacyNotice) ||
    !config.privacyNotice.length
  )
    return null
  const clientConfig = getClientConfig(config)
  if (!clientConfig) return null

  const headingId = `${formId}-contact-form-heading`

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-sm border border-neutral-border bg-white p-6 shadow-sm sm:p-8"
    >
      <h2 className="text-3xl font-extrabold text-brand-navy" id={headingId}>
        {config.heading}
      </h2>
      <PortableTextRenderer className="mt-3 max-w-3xl" value={config.introduction} />
      <ContactForm config={clientConfig} formId={formId} />
      <div className="mt-6 border-t border-neutral-border pt-4 text-sm">
        <PortableTextRenderer value={config.privacyNotice} />
      </div>
    </section>
  )
}
