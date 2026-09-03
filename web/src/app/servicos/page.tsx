import type {Metadata} from 'next'

import {EmptyState} from '@/components/content/empty-state'
import {PageHeader} from '@/components/content/page-header'
import {ServiceCard} from '@/components/content/service-card'
import {buildMetadata} from '@/lib/metadata'
import {getServices} from '@/sanity/queries/services'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({title: 'Serviços', path: '/servicos', siteSettings: settings})
}

export default async function ServicesPage() {
  const services = await getServices()
  return <><PageHeader eyebrow="Informação pública" title="Serviços" /><div className="container-site section-space">{services.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => <ServiceCard key={service._id} service={service} />)}</div> : <EmptyState />}</div></>
}
