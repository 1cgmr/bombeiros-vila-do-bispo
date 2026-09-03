import type {Metadata} from 'next'
import type {SanityImageSource} from '@sanity/image-url'

import {urlForImage} from '@/sanity/image'

type SeoValue = {
  metaTitle?: string | null
  metaDescription?: string | null
  noIndex?: boolean | null
  openGraphImage?: {asset?: unknown; alt?: string | null} | null
} | null

type SiteSettingsValue = {
  officialName?: string | null
  shortName?: string | null
  siteUrl?: string | null
  defaultSeo?: SeoValue
} | null

export const defaultSiteName = 'Bombeiros Voluntários de Vila do Bispo'

function getOpenGraphImageUrl(image?: {asset?: unknown} | null) {
  if (!image?.asset) return undefined
  if (typeof image.asset === 'object' && 'url' in image.asset && typeof image.asset.url === 'string') return image.asset.url

  try {
    return urlForImage(image as SanityImageSource).width(1200).height(630).quality(86).url()
  } catch {
    return undefined
  }
}

export function resolveSiteUrl(siteUrl?: string | null) {
  if (siteUrl?.startsWith('https://')) return siteUrl.replace(/\/$/, '')

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl.replace(/\/$/, '')}`

  return process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
}

export function buildMetadata({
  title,
  description,
  path = '/',
  seo,
  siteSettings,
}: {
  title: string
  description?: string | null
  path?: string
  seo?: SeoValue
  siteSettings?: SiteSettingsValue
}): Metadata {
  const resolvedSeo = seo ?? siteSettings?.defaultSeo
  const resolvedTitle = resolvedSeo?.metaTitle || title
  const resolvedDescription = resolvedSeo?.metaDescription || description || undefined
  const siteName = siteSettings?.officialName || siteSettings?.shortName || defaultSiteName
  const baseUrl = resolveSiteUrl(siteSettings?.siteUrl)
  const pageUrl = baseUrl ? new URL(path, `${baseUrl}/`).toString() : undefined
  const imageUrl = getOpenGraphImageUrl(resolvedSeo?.openGraphImage)
  const noIndex = Boolean(resolvedSeo?.noIndex)

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: pageUrl ? {canonical: pageUrl} : undefined,
    robots: noIndex ? {index: false, follow: false} : undefined,
    openGraph: {
      type: 'website',
      locale: 'pt_PT',
      siteName,
      title: resolvedTitle,
      description: resolvedDescription,
      url: pageUrl,
      images: imageUrl
        ? [{url: imageUrl, alt: resolvedSeo?.openGraphImage?.alt || resolvedTitle}]
        : undefined,
    },
  }
}
