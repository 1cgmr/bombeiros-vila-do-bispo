import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const CONTACT_INFORMATION_QUERY = defineQuery(`
  *[
    _type == "contactInformation" &&
    _id == "contactInformation" &&
    informationConfirmedForPublication == true
  ][0]{
    _id,
    address,
    generalEmail,
    telephone,
    additionalChannels[authorizedForPublication == true]{
      _key,
      label,
      channelType,
      value,
      description
    },
    contactHours,
    directionsMapUrl,
    socialLinks[]{_key, platform, label, url},
    emergencyWarning,
    seo
  }
`)

export function getContactInformation() {
  return sanityClient.fetch(CONTACT_INFORMATION_QUERY)
}
