import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const PARTNERS_QUERY = defineQuery(`
  *[_type == "partner" && active == true]
    | order(coalesce(displayOrder, 9999) asc, name asc){
      _id,
      name,
      logo{
        asset->{_id, url, metadata{dimensions, lqip}},
        alt,
        decorative,
        caption,
        credit,
        crop,
        hotspot
      },
      website,
      description,
      displayOrder
    }
`)

export function getPartners() {
  return sanityClient.fetch(PARTNERS_QUERY)
}
