import {sendContactEmail, ContactEmailConfigurationError} from '@/lib/contact-form/email'
import type {ContactFormResponse} from '@/lib/contact-form/types'
import {isContactFormId} from '@/lib/contact-form/types'
import {
  MAX_CONTACT_REQUEST_BYTES,
  parseContactRequest,
  validateContactSubmission,
} from '@/lib/contact-form/validation'
import {getContactFormDeliveryConfig} from '@/sanity/queries/contact-forms'

export const runtime = 'nodejs'

function jsonResponse(body: ContactFormResponse, status: number) {
  return Response.json(body, {
    status,
    headers: {'Cache-Control': 'no-store'},
  })
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type')?.toLowerCase() ?? ''
  const mediaType = contentType.split(';', 1)[0].trim()
  if (mediaType !== 'application/json')
    return jsonResponse({ok: false, code: 'INVALID_REQUEST'}, 415)

  const contentLength = Number(request.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_CONTACT_REQUEST_BYTES)
    return jsonResponse({ok: false, code: 'INVALID_REQUEST'}, 413)

  let rawBody: string
  let body: unknown
  try {
    rawBody = await request.text()
    if (new TextEncoder().encode(rawBody).byteLength > MAX_CONTACT_REQUEST_BYTES)
      return jsonResponse({ok: false, code: 'INVALID_REQUEST'}, 413)
    body = JSON.parse(rawBody)
  } catch {
    return jsonResponse({ok: false, code: 'INVALID_REQUEST'}, 400)
  }

  const parsed = parseContactRequest(body)
  if (!parsed.ok)
    return jsonResponse({ok: false, code: parsed.code}, 400)

  if (!isContactFormId(parsed.value.formId))
    return jsonResponse({ok: false, code: 'INVALID_REQUEST'}, 400)

  if (parsed.value.website.trim()) return jsonResponse({ok: true}, 200)

  let config
  try {
    config = await getContactFormDeliveryConfig(parsed.value.formId)
  } catch {
    console.error('Contact form configuration lookup failed')
    return jsonResponse({ok: false, code: 'SERVICE_UNAVAILABLE'}, 503)
  }

  if (!config)
    return jsonResponse({ok: false, code: 'FORM_UNAVAILABLE'}, 404)

  const validation = validateContactSubmission(parsed.value, config)
  if (!validation.ok)
    return jsonResponse(
      {
        ok: false,
        code: validation.code,
        fieldErrors: validation.fieldErrors,
      },
      400,
    )

  try {
    await sendContactEmail({submission: validation.value, config})
    return jsonResponse({ok: true}, 200)
  } catch (error) {
    if (error instanceof ContactEmailConfigurationError)
      return jsonResponse({ok: false, code: 'SERVICE_UNAVAILABLE'}, 503)

    console.error('Contact email delivery failed')
    return jsonResponse({ok: false, code: 'SEND_FAILED'}, 502)
  }
}
