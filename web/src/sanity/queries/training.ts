import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const TRAINING_QUERY = defineQuery(`
  *[_type == "training"] | order(coalesce(startDate, "9999-12-31T23:59:59Z") asc, title asc){
    _id,
    title,
    "slug": slug.current,
    summary,
    description,
    startDate,
    endDate,
    location,
    audience,
    enrollmentInformation,
    status,
    seo
  }
`)

export function getTraining() {
  return sanityClient.fetch(TRAINING_QUERY)
}
