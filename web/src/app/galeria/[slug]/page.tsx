import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {formatDate} from '@/lib/content'
import {buildMetadata} from '@/lib/metadata'
import {getGalleryBySlug} from '@/sanity/queries/galleries'
import {getSiteSettings} from '@/sanity/queries/site-settings'

type PageProps = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  const [gallery, settings] = await Promise.all([getGalleryBySlug(slug), getSiteSettings()])
  if (!gallery) return {title: 'Galeria não encontrada'}
  return buildMetadata({title: gallery.title || 'Galeria', path: `/galeria/${slug}`, seo: gallery.seo, siteSettings: settings})
}

export default async function GalleryDetailPage({params}: PageProps) {
  const {slug} = await params
  const gallery = await getGalleryBySlug(slug)
  if (!gallery) notFound()
  return <><PageHeader eyebrow={formatDate(gallery.date) || 'Galeria'} title={gallery.title || 'Galeria'} /><div className="container-site section-space"><div className="mx-auto mb-10 max-w-4xl"><PortableTextRenderer value={gallery.description} /></div>{gallery.items?.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{gallery.items.map((item) => item.image?.asset?.url ? <figure key={item._key}><SanityImage className="aspect-[4/3] h-auto w-full rounded-sm object-cover" height={750} image={item.image} sizes="(max-width: 768px) 100vw, 33vw" width={1000} />{item.image.caption ? <figcaption className="mt-2 text-sm text-muted-text">{item.image.caption}{item.image.credit ? ` — ${item.image.credit}` : ''}</figcaption> : null}</figure> : null)}</div> : null}</div></>
}
