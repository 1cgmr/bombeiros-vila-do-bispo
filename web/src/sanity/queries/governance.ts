import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const GOVERNING_BODIES_QUERY = defineQuery(`
  *[_type == "governingBody" && bodyType == $bodyType] | order(mandateStart desc, title asc){
    _id,
    bodyType,
    title,
    mandateStart,
    mandateEnd,
    description,
    roles[]{
      _key,
      roleTitle,
      publicNote,
      person->{
        _id,
        publicName,
        photograph{
          asset->{_id, url, metadata{dimensions, lqip}},
          alt,
          decorative,
          caption,
          credit,
          crop,
          hotspot
        },
        biography,
        publicContactChannels[authorizedForPublication == true]{
          _key,
          label,
          channelType,
          value,
          description
        }
      }
    }
  }
`)

export const PEOPLE_QUERY = defineQuery(`
  *[_type == "person"] | order(publicName asc){
    _id,
    publicName,
    photograph{
      asset->{_id, url, metadata{dimensions, lqip}},
      alt,
      decorative,
      caption,
      credit,
      crop,
      hotspot
    },
    biography,
    publicContactChannels[authorizedForPublication == true]{
      _key,
      label,
      channelType,
      value,
      description
    }
  }
`)

export function getGoverningBodies(bodyType: 'command' | 'governingBody') {
  return sanityClient.fetch(GOVERNING_BODIES_QUERY, {bodyType})
}

export function getPeople() {
  return sanityClient.fetch(PEOPLE_QUERY)
}
