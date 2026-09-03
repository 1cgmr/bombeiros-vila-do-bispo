import type {MetadataRoute} from 'next'

import {resolveSiteUrl} from '@/lib/metadata'
import {getGalleries} from '@/sanity/queries/galleries'
import {getNewsArticles} from '@/sanity/queries/news'
import {getServices} from '@/sanity/queries/services'
import {getSiteSettings} from '@/sanity/queries/site-settings'
import {getTraining} from '@/sanity/queries/training'

const staticPaths = ['/', '/associacao', '/corpo-de-bombeiros', '/servicos', '/formacao', '/recrutamento', '/noticias', '/socios-e-apoio', '/galeria', '/documentos', '/contactos', '/privacidade', '/acessibilidade']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, services, articles, training, galleries] = await Promise.all([getSiteSettings(), getServices(), getNewsArticles(100), getTraining(), getGalleries()])
  const baseUrl = resolveSiteUrl(settings?.siteUrl)
  if (!baseUrl) return []

  const entry = (path: string, lastModified?: string | null): MetadataRoute.Sitemap[number] => ({url: new URL(path, `${baseUrl}/`).toString(), lastModified: lastModified || undefined})

  return [
    ...staticPaths.map((path) => entry(path)),
    ...services.filter((item) => item.slug).map((item) => entry(`/servicos/${item.slug}`)),
    ...articles.filter((item) => item.slug).map((item) => entry(`/noticias/${item.slug}`, item.publicationDate)),
    ...training.filter((item) => item.slug).map((item) => entry(`/formacao/${item.slug}`, item.startDate)),
    ...galleries.filter((item) => item.slug).map((item) => entry(`/galeria/${item.slug}`, item.date)),
  ]
}
