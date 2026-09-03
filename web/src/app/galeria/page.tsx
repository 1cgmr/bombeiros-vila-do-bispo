import Link from 'next/link'
import type {Metadata} from 'next'

import {EmptyState} from '@/components/content/empty-state'
import {PageHeader} from '@/components/content/page-header'
import {SanityImage} from '@/components/content/sanity-image'
import {formatDate} from '@/lib/content'
import {buildMetadata} from '@/lib/metadata'
import {getGalleries} from '@/sanity/queries/galleries'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({title: 'Galeria', path: '/galeria', siteSettings: settings})
}

export default async function GalleryPage() {
  const galleries = await getGalleries()
  return <><PageHeader eyebrow="Registo visual" title="Galeria" /><div className="container-site section-space">{galleries.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{galleries.map((gallery) => gallery.slug && gallery.title ? <article className="group overflow-hidden rounded-sm bg-white shadow-[0_8px_30px_rgb(9_35_61_/_0.08)]" key={gallery._id}><Link className="block focus-visible:outline-3 focus-visible:outline-brand-gold" href={`/galeria/${gallery.slug}`}><div className="aspect-[4/3] overflow-hidden bg-brand-navy">{gallery.coverImage?.asset?.url ? <SanityImage className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" height={600} image={gallery.coverImage} sizes="(max-width: 768px) 100vw, 33vw" width={800} /> : null}</div><div className="p-5"><p className="text-xs font-bold uppercase tracking-wide text-brand-gold-dark">{formatDate(gallery.date) || 'Galeria'}</p><h2 className="mt-2 text-xl font-extrabold text-brand-navy">{gallery.title}</h2></div></Link></article> : null)}</div> : <EmptyState />}</div></>
}
