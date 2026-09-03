import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const SERVICES_QUERY = defineQuery(`
  *[_type == "service"] | order(coalesce(displayOrder, 9999) asc, title asc){
    _id,
    title,
    "slug": slug.current,
    summary,
    visualType,
    image{
      asset->{_id, url, metadata{dimensions, lqip}},
      alt,
      decorative,
      caption,
      credit,
      crop,
      hotspot
    },
    icon,
    displayOrder
  }
`)

export const SERVICE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "service" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    visualType,
    image{
      asset->{_id, url, metadata{dimensions, lqip}},
      alt,
      decorative,
      caption,
      credit,
      crop,
      hotspot
    },
    icon,
    content,
    availabilityInformation,
    contactChannels[authorizedForPublication == true]{
      _key,
      label,
      channelType,
      value,
      description
    },
    seo
  }
`)

export function getServices() {
  return sanityClient.fetch(SERVICES_QUERY)
}

export function getServiceBySlug(slug: string) {
  return sanityClient.fetch(SERVICE_BY_SLUG_QUERY, {slug})
}
