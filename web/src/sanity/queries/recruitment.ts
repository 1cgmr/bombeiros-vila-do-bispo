import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const RECRUITMENT_INFORMATION_QUERY = defineQuery(`
  *[_type == "recruitmentInformation" && _id == "recruitmentInformation"][0]{
    _id,
    introduction,
    eligibility,
    requirements,
    stages[]{_key, title, description},
    expectations,
    faq[]{_key, question, answer},
    futureFormIntroduction,
    privacySummary,
    seo
  }
`)

export function getRecruitmentInformation() {
  return sanityClient.fetch(RECRUITMENT_INFORMATION_QUERY)
}
