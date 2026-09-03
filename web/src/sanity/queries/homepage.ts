import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const HOMEPAGE_QUERY = defineQuery(`
  *[_type == "homepage" && _id == "homepage"][0]{
    _id,
    _type,
    hero{
      headline,
      highlightedFragment,
      description,
      image{
        asset->{_id, url, metadata{dimensions, lqip}},
        alt,
        decorative,
        caption,
        credit,
        crop,
        hotspot
      },
      emergencyCta,
      recruitmentCta,
      supportCta
    },
    statistics[confirmedForPublication == true]{
      _key,
      kind,
      label,
      value,
      suffix,
      asOfDate
    },
    mission{
      sectionLabel,
      title,
      body,
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
    featuredServices[]->{
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
      icon
    },
    latestNews{sectionLabel, title, itemCount},
    supportSection{sectionLabel, title, description, cta},
    seo
  }
`)

export function getHomepage() {
  return sanityClient.fetch(HOMEPAGE_QUERY)
}
