import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {buildMetadata} from '@/lib/metadata'
import {getServiceBySlug} from '@/sanity/queries/services'
import {getSiteSettings} from '@/sanity/queries/site-settings'

type PageProps = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  const [service, settings] = await Promise.all([getServiceBySlug(slug), getSiteSettings()])
  if (!service) return {title: 'Serviço não encontrado'}
  return buildMetadata({title: service.title || 'Serviço', description: service.summary, path: `/servicos/${slug}`, seo: service.seo, siteSettings: settings})
}

export default async function ServiceDetailPage({params}: PageProps) {
  const {slug} = await params
  const service = await getServiceBySlug(slug)
  if (!service) notFound()
  return <><PageHeader eyebrow="Serviços" introduction={service.summary} title={service.title || 'Serviço'} /><div className="container-site section-space grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]"><div><PortableTextRenderer value={service.content} />{service.availabilityInformation?.length ? <section className="mt-12 rounded-sm bg-brand-gold-pale p-6"><h2 className="text-2xl font-bold text-brand-navy">Disponibilidade</h2><PortableTextRenderer value={service.availabilityInformation} /></section> : null}</div>{service.image?.asset?.url ? <SanityImage className="h-auto w-full rounded-sm object-cover" height={800} image={service.image} sizes="(max-width: 1024px) 100vw, 352px" width={600} /> : null}</div></>
}
