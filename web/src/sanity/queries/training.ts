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

export const TRAINING_BY_SLUG_QUERY = defineQuery(`
  *[_type == "training" && slug.current == $slug][0]{
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

export function getTrainingBySlug(slug: string) {
  return sanityClient.fetch(TRAINING_BY_SLUG_QUERY, {slug})
}
