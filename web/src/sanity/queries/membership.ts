import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const MEMBERSHIP_INFORMATION_QUERY = defineQuery(`
  *[_type == "membershipInformation" && _id == "membershipInformation"][0]{
    _id,
    introduction,
    eligibility,
    benefits,
    process[]{_key, title, description},
    "fees": select(feesConfirmedForPublication == true => fees),
    faq[]{_key, question, answer},
    futureFormIntroduction,
    seo
  }
`)

export function getMembershipInformation() {
  return sanityClient.fetch(MEMBERSHIP_INFORMATION_QUERY)
}
