import {defineQuery} from 'groq'

import {sanityClient} from '../client'

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    _id,
    _type,
    officialName,
    shortName,
    institutionalDescription,
    logo{
      asset->{
        _id,
        url,
        metadata{dimensions, lqip}
      },
      alt,
      decorative,
      caption,
      credit,
      crop,
      hotspot
    },
    siteUrl,
    defaultSeo{
      metaTitle,
      metaDescription,
      noIndex,
      openGraphImage{
        asset->{_id, url, metadata{dimensions, lqip}},
        alt,
        decorative,
        caption,
        credit,
        crop,
        hotspot
      }
    }
  }
`)

export function getSiteSettings() {
  return sanityClient.fetch(SITE_SETTINGS_QUERY)
}
