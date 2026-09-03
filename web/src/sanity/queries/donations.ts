import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const DONATION_INFORMATION_QUERY = defineQuery(`
  *[_type == "donationInformation" && _id == "donationInformation"][0]{
    _id,
    introduction,
    waysToContribute,
    donationMethods[confirmedForPublication == true]{
      _key,
      methodType,
      title,
      description,
      iban,
      mbWayNumber,
      externalUrl
    },
    seo
  }
`)

export function getDonationInformation() {
  return sanityClient.fetch(DONATION_INFORMATION_QUERY)
}
