import type {MetadataRoute} from 'next'

import {resolveSiteUrl} from '@/lib/metadata'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings()
  const baseUrl = resolveSiteUrl(settings?.siteUrl)
  const preview = process.env.VERCEL_ENV === 'preview'

  return {
    rules: preview ? {userAgent: '*', disallow: '/'} : {userAgent: '*', allow: '/'},
    sitemap: !preview && baseUrl ? `${baseUrl}/sitemap.xml` : undefined,
  }
}
