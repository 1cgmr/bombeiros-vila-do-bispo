import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const VEHICLES_QUERY = defineQuery(`
  *[_type == "vehicle"] | order(coalesce(displayOrder, 9999) asc, designation asc){
    _id,
    designation,
    category,
    otherCategory,
    mainImage{
      asset->{_id, url, metadata{dimensions, lqip}},
      alt,
      decorative,
      caption,
      credit,
      crop,
      hotspot
    },
    publicDescription,
    "publicSpecifications": select(
      specificationsApprovedForPublication == true => publicSpecifications
    ),
    gallery[]{
      _key,
      image{
        asset->{_id, url, metadata{dimensions, lqip}},
        alt,
        decorative,
        caption,
        credit,
        crop,
        hotspot
      }
    },
    displayOrder
  }
`)

export function getVehicles() {
  return sanityClient.fetch(VEHICLES_QUERY)
}
