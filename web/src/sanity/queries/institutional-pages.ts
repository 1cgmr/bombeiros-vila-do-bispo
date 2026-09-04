import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const institutionalPageIds = {
  association: 'institutional-page-association',
  fireBrigade: 'institutional-page-fire-brigade',
  privacyPolicy: 'institutional-page-privacy-policy',
  accessibilityStatement: 'institutional-page-accessibility-statement',
} as const

export type InstitutionalPageKey = keyof typeof institutionalPageIds

export const INSTITUTIONAL_PAGE_QUERY = defineQuery(`
  *[_type == "institutionalPage" && _id == $documentId][0]{
    _id,
    title,
    introduction,
    featuredImage{
      asset->{_id, url, metadata{dimensions, lqip}},
      alt,
      decorative,
      caption,
      credit,
      crop,
      hotspot
    },
    body,
    documents[]->{
      _id,
      title,
      category,
      date,
      reference,
      accessibleSummary,
      "file": file.asset->{_id, url, originalFilename, mimeType, size}
    },
    seo
  }
`)

export function getInstitutionalPage(page: InstitutionalPageKey) {
  return sanityClient.fetch(INSTITUTIONAL_PAGE_QUERY, {
    documentId: institutionalPageIds[page],
  })
}
