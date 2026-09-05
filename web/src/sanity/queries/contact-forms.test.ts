import {beforeEach, describe, expect, it, vi} from 'vitest'

const sanityMocks = vi.hoisted(() => ({
  fetch: vi.fn(),
  withConfig: vi.fn(),
}))

vi.mock('server-only', () => ({}))
vi.mock('../client', () => ({
  sanityClient: {
    withConfig: sanityMocks.withConfig,
  },
}))

import {getContactFormDeliveryConfig} from './contact-forms'

const enabledResult = {
  contactForm: {
    enabled: true,
    recipientEmail: 'destino@example.com',
    emailSubjectPrefix: '[Website]',
    phoneVisible: true,
    phoneRequired: false,
    subjectVisible: true,
    subjectRequired: false,
    hasPrivacyNotice: true,
  },
}

describe('trusted contact form configuration lookup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sanityMocks.withConfig.mockReturnValue({fetch: sanityMocks.fetch})
    sanityMocks.fetch.mockResolvedValue(enabledResult)
  })

  it.each([
    ['training', 'trainingInformation', 'trainingInformation'],
    ['recruitment', 'recruitmentInformation', 'recruitmentInformation'],
  ] as const)('maps %s to its independent stable singleton', async (formId, documentId, documentType) => {
    await getContactFormDeliveryConfig(formId)
    expect(sanityMocks.withConfig).toHaveBeenCalledWith({useCdn: false})
    expect(sanityMocks.fetch).toHaveBeenCalledWith(
      expect.anything(),
      {documentId, documentType},
      {cache: 'no-store'},
    )
  })

  it('rejects disabled or unsafe delivery configuration', async () => {
    sanityMocks.fetch.mockResolvedValue({
      contactForm: {...enabledResult.contactForm, enabled: false},
    })
    await expect(getContactFormDeliveryConfig('training')).resolves.toBeNull()

    sanityMocks.fetch.mockResolvedValue({
      contactForm: {
        ...enabledResult.contactForm,
        emailSubjectPrefix: '[Website]\r\nBcc: vítima@example.com',
      },
    })
    await expect(getContactFormDeliveryConfig('training')).resolves.toBeNull()
  })
})
