import {sanityClient} from '../client'

export type SiteSettings = {
  officialName?: string
  shortName?: string
}

export const siteSettingsQuery = `
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    officialName,
    shortName
  }
`

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityClient.fetch<SiteSettings | null>(siteSettingsQuery)
}
