'use client'

import {type FormEvent, useRef, useState} from 'react'

import type {
  ContactFormClientConfig,
  ContactFormField,
  ContactFormFieldErrors,
  ContactFormId,
  ContactFormResponse,
} from '@/lib/contact-form/types'

const fieldClassName =
  'mt-2 min-h-12 w-full rounded-sm border border-neutral-border bg-white px-4 py-3 text-neutral-text outline-none transition focus:border-brand-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold'

export function ContactForm({
  formId,
  config,
}: {
  formId: ContactFormId
  config: ContactFormClientConfig
}) {
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'success' | 'validation-error' | 'error'
  >('idle')
  const [fieldErrors, setFieldErrors] = useState<ContactFormFieldErrors>({})
  const submittingRef = useRef(false)
  const feedbackRef = useRef<HTMLDivElement>(null)

  const clearFieldError = (field: ContactFormField) => {
    setFieldErrors((current) => {
      if (!current[field]) return current
      const next = {...current}
      delete next[field]
      return next
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submittingRef.current) return

    submittingRef.current = true
    setStatus('submitting')
    setFieldErrors({})

    const form = event.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          formId,
          name: data.get('name'),
          email: data.get('email'),
          phone: data.get('phone') ?? '',
          subject: data.get('subject') ?? '',
          message: data.get('message'),
          website: data.get('website'),
        }),
      })
      const result = (await response.json().catch(() => null)) as
        | ContactFormResponse
        | null

      if (response.ok && result?.ok === true) {
        form.reset()
        setStatus('success')
      } else if (
        result?.ok === false &&
        result.code === 'VALIDATION_ERROR' &&
        result.fieldErrors
      ) {
        setFieldErrors(result.fieldErrors)
        setStatus('validation-error')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    } finally {
      submittingRef.current = false
      requestAnimationFrame(() => feedbackRef.current?.focus())
    }
  }

  const errorFor = (field: ContactFormField) => fieldErrors[field]
  const describedBy = (field: ContactFormField) =>
    errorFor(field) ? `${formId}-${field}-error` : undefined

  return (
    <form
      aria-busy={status === 'submitting'}
      className="mt-8 grid gap-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="font-bold text-brand-navy" htmlFor={`${formId}-name`}>
            {config.nameLabel}
          </label>
          <input
            aria-describedby={describedBy('name')}
            aria-invalid={Boolean(errorFor('name'))}
            autoComplete="name"
            className={fieldClassName}
            id={`${formId}-name`}
            maxLength={120}
            name="name"
            onChange={() => clearFieldError('name')}
            required
            type="text"
          />
          <FieldError error={errorFor('name')} id={`${formId}-name-error`} />
        </div>
        <div>
          <label className="font-bold text-brand-navy" htmlFor={`${formId}-email`}>
            {config.emailLabel}
          </label>
          <input
            aria-describedby={describedBy('email')}
            aria-invalid={Boolean(errorFor('email'))}
            autoComplete="email"
            className={fieldClassName}
            id={`${formId}-email`}
            maxLength={254}
            name="email"
            onChange={() => clearFieldError('email')}
            required
            type="email"
          />
          <FieldError error={errorFor('email')} id={`${formId}-email-error`} />
        </div>
        {config.phoneVisible ? (
          <div>
            <label className="font-bold text-brand-navy" htmlFor={`${formId}-phone`}>
              {config.phoneLabel}
              {!config.phoneRequired ? <span className="font-normal text-muted-text"> (opcional)</span> : null}
            </label>
            <input
              aria-describedby={describedBy('phone')}
              aria-invalid={Boolean(errorFor('phone'))}
              autoComplete="tel"
              className={fieldClassName}
              id={`${formId}-phone`}
              maxLength={40}
              name="phone"
              onChange={() => clearFieldError('phone')}
              required={config.phoneRequired}
              type="tel"
            />
            <FieldError error={errorFor('phone')} id={`${formId}-phone-error`} />
          </div>
        ) : null}
        {config.subjectVisible ? (
          <div>
            <label className="font-bold text-brand-navy" htmlFor={`${formId}-subject`}>
              {config.subjectLabel}
              {!config.subjectRequired ? <span className="font-normal text-muted-text"> (opcional)</span> : null}
            </label>
            <input
              aria-describedby={describedBy('subject')}
              aria-invalid={Boolean(errorFor('subject'))}
              className={fieldClassName}
              id={`${formId}-subject`}
              maxLength={160}
              name="subject"
              onChange={() => clearFieldError('subject')}
              required={config.subjectRequired}
              type="text"
            />
            <FieldError error={errorFor('subject')} id={`${formId}-subject-error`} />
          </div>
        ) : null}
      </div>
      <div>
        <label className="font-bold text-brand-navy" htmlFor={`${formId}-message`}>
          {config.messageLabel}
        </label>
        <textarea
          aria-describedby={describedBy('message')}
          aria-invalid={Boolean(errorFor('message'))}
          className={`${fieldClassName} min-h-40 resize-y`}
          id={`${formId}-message`}
          maxLength={5000}
          name="message"
          onChange={() => clearFieldError('message')}
          required
          rows={7}
        />
        <FieldError error={errorFor('message')} id={`${formId}-message-error`} />
      </div>
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          autoComplete="off"
          id={`${formId}-website`}
          name="website"
          tabIndex={-1}
          type="text"
        />
      </div>
      <div>
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-sm bg-brand-navy px-6 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-brand-navy-dark focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-gold disabled:cursor-wait disabled:opacity-65"
          disabled={status === 'submitting'}
          type="submit"
        >
          {status === 'submitting' ? 'A enviar…' : config.submitButtonLabel}
        </button>
      </div>
      {status === 'success' || status === 'validation-error' || status === 'error' ? (
        <div
          className={`rounded-sm border px-4 py-3 ${status === 'success' ? 'border-brand-gold bg-brand-gold-pale text-brand-navy' : 'border-emergency-red/35 bg-red-50 text-emergency-red'}`}
          ref={feedbackRef}
          role={status === 'success' ? 'status' : 'alert'}
          tabIndex={-1}
        >
          {status === 'success'
            ? config.successMessage
            : status === 'validation-error'
              ? 'Corrija os campos assinalados e tente novamente.'
              : config.errorMessage}
        </div>
      ) : null}
    </form>
  )
}
function FieldError({error, id}: {error?: string; id: string}) {
  return error ? (
    <p className="mt-2 text-sm font-semibold text-emergency-red" id={id}>
      {error}
    </p>
  ) : null
}
