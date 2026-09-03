import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const INSTITUTIONAL_DOCUMENTS_QUERY = defineQuery(`
  *[_type == "institutionalDocument"] | order(date desc, title asc){
    _id,
    title,
    category,
    date,
    reference,
    accessibleSummary,
    "file": file.asset->{_id, url, originalFilename, mimeType, size}
  }
`)

export function getInstitutionalDocuments() {
  return sanityClient.fetch(INSTITUTIONAL_DOCUMENTS_QUERY)
}
