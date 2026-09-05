// @vitest-environment jsdom

import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import type {ContactFormClientConfig, PublicContactFormConfig} from '@/lib/contact-form/types'

import {ContactForm} from './contact-form'
import {ContactFormSection} from './contact-form-section'

const config: ContactFormClientConfig = {
  nameLabel: 'Nome',
  emailLabel: 'Email',
  phoneLabel: 'Telefone',
  phoneVisible: true,
  phoneRequired: false,
  subjectLabel: 'Assunto',
  subjectVisible: true,
  subjectRequired: false,
  messageLabel: 'Mensagem',
  submitButtonLabel: 'Enviar pedido',
  successMessage: 'Mensagem enviada.',
  errorMessage: 'Não foi possível enviar.',
}

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText('Nome'), {target: {value: 'Ana Silva'}})
  fireEvent.change(screen.getByLabelText('Email'), {target: {value: 'ana@example.com'}})
  fireEvent.change(screen.getByLabelText('Mensagem'), {target: {value: 'Informação.'}})
}

describe('ContactForm', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      return window.setTimeout(() => callback(0), 0)
    })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders explicit accessible labels and required core fields', () => {
    render(<ContactForm config={config} formId="training" />)
    expect(screen.getByLabelText('Nome').hasAttribute('required')).toBe(true)
    expect(screen.getByLabelText('Email').hasAttribute('required')).toBe(true)
    expect(screen.getByLabelText('Mensagem').hasAttribute('required')).toBe(true)
    expect(screen.getByLabelText(/Telefone/).hasAttribute('required')).toBe(false)
    expect(screen.getByLabelText(/Assunto/).hasAttribute('required')).toBe(false)
  })

  it('does not render optional fields disabled by the CMS configuration', () => {
    render(
      <ContactForm
        config={{...config, phoneVisible: false, subjectVisible: false}}
        formId="recruitment"
      />,
    )
    expect(screen.queryByLabelText(/Telefone/)).toBeNull()
    expect(screen.queryByLabelText(/Assunto/)).toBeNull()
  })

  it('prevents duplicate submissions while showing the loading and success states', async () => {
    let resolveRequest: ((value: Response) => void) | undefined
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveRequest = resolve
        }),
    )
    vi.stubGlobal('fetch', fetchMock)
    render(<ContactForm config={config} formId="training" />)
    fillRequiredFields()

    const form = screen.getByRole('button', {name: 'Enviar pedido'}).closest('form')!
    fireEvent.submit(form)
    fireEvent.submit(form)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect((screen.getByRole('button', {name: 'A enviar…'}) as HTMLButtonElement).disabled).toBe(true)

    resolveRequest?.(
      new Response(JSON.stringify({ok: true}), {
        status: 200,
        headers: {'Content-Type': 'application/json'},
      }),
    )
    const status = await screen.findByRole('status')
    expect(status.textContent).toContain('Mensagem enviada.')
    expect((screen.getByLabelText('Nome') as HTMLInputElement).value).toBe('')
    await waitFor(() => expect(document.activeElement).toBe(status))
  })

  it('associates server validation errors with their fields', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ok: false,
            code: 'VALIDATION_ERROR',
            fieldErrors: {email: 'Introduza um endereço de email válido.'},
          }),
          {status: 400, headers: {'Content-Type': 'application/json'}},
        ),
      ),
    )
    render(<ContactForm config={config} formId="training" />)
    fillRequiredFields()
    fireEvent.submit(screen.getByRole('button').closest('form')!)

    const error = await screen.findByText('Introduza um endereço de email válido.')
    expect(screen.getByLabelText('Email').getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByLabelText('Email').getAttribute('aria-describedby')).toBe(error.id)
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole('alert')))
  })

  it('shows the configured safe message for a server failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ok: false, code: 'SEND_FAILED'}), {
          status: 502,
          headers: {'Content-Type': 'application/json'},
        }),
      ),
    )
    render(<ContactForm config={config} formId="recruitment" />)
    fillRequiredFields()
    fireEvent.submit(screen.getByRole('button').closest('form')!)
    expect((await screen.findByRole('alert')).textContent).toContain('Não foi possível enviar.')
  })

  it('renders no form section when disabled', async () => {
    const publicConfig: PublicContactFormConfig = {
      enabled: false,
      heading: 'Contacte-nos',
      introduction: null,
      privacyNotice: null,
      submitButtonLabel: config.submitButtonLabel,
      successMessage: config.successMessage,
      errorMessage: config.errorMessage,
      nameLabel: config.nameLabel,
      emailLabel: config.emailLabel,
      phoneLabel: config.phoneLabel ?? null,
      phoneVisible: config.phoneVisible,
      phoneRequired: config.phoneRequired,
      subjectLabel: config.subjectLabel ?? null,
      subjectVisible: config.subjectVisible,
      subjectRequired: config.subjectRequired,
      messageLabel: config.messageLabel,
    }
    const {container} = render(
      <ContactFormSection config={publicConfig} formId="training" />,
    )
    expect(container.innerHTML).toBe('')
  })
})
