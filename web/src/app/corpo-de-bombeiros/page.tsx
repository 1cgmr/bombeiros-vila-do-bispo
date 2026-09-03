import type {Metadata} from 'next'

import {EmptyState} from '@/components/content/empty-state'
import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {buildMetadata} from '@/lib/metadata'
import {getGoverningBodies} from '@/sanity/queries/governance'
import {getInstitutionalPage} from '@/sanity/queries/institutional-pages'
import {getSiteSettings} from '@/sanity/queries/site-settings'
import {getVehicles} from '@/sanity/queries/vehicles'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getInstitutionalPage('fireBrigade'), getSiteSettings()])
  return buildMetadata({title: page?.title || 'Corpo de Bombeiros', description: page?.introduction, path: '/corpo-de-bombeiros', seo: page?.seo, siteSettings: settings})
}

export default async function FireBrigadePage() {
  const [page, governingBodies, vehicles] = await Promise.all([getInstitutionalPage('fireBrigade'), getGoverningBodies(), getVehicles()])
  const hasContent = Boolean(page || governingBodies.length || vehicles.length)
  return <><PageHeader introduction={page?.introduction} title={page?.title || 'Corpo de Bombeiros'} /><div className="container-site section-space">{hasContent ? <div className="space-y-16">{page ? <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]"><PortableTextRenderer value={page.body} />{page.featuredImage?.asset?.url ? <SanityImage className="h-auto w-full rounded-sm object-cover" height={800} image={page.featuredImage} sizes="(max-width: 1024px) 100vw, 352px" width={600} /> : null}</section> : null}{governingBodies.length ? <section><h2 className="mb-7 text-3xl font-extrabold text-brand-navy">Comando e órgãos sociais</h2><div className="grid gap-6 lg:grid-cols-2">{governingBodies.map((body) => <article className="rounded-sm border border-neutral-border bg-white p-6" key={body._id}><h3 className="text-2xl font-bold text-brand-navy">{body.title}</h3><PortableTextRenderer value={body.description} />{body.roles?.length ? <ul className="mt-5 divide-y divide-neutral-border">{body.roles.map((role) => <li className="flex items-center gap-4 py-4" key={role._key}>{role.person?.photograph?.asset?.url ? <SanityImage className="h-14 w-14 rounded-full object-cover" height={112} image={role.person.photograph} sizes="56px" width={112} /> : null}<span><strong className="block text-brand-navy">{role.person?.publicName}</strong><span className="text-sm text-muted-text">{role.roleTitle}</span></span></li>)}</ul> : null}</article>)}</div></section> : null}{vehicles.length ? <section><h2 className="mb-7 text-3xl font-extrabold text-brand-navy">Viaturas</h2><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{vehicles.map((vehicle) => <article className="overflow-hidden rounded-sm border border-neutral-border bg-white" key={vehicle._id}>{vehicle.mainImage?.asset?.url ? <SanityImage className="aspect-[16/10] h-auto w-full object-cover" height={500} image={vehicle.mainImage} sizes="(max-width: 768px) 100vw, 33vw" width={800} /> : null}<div className="p-5"><h3 className="text-xl font-bold text-brand-navy">{vehicle.designation}</h3><p className="mt-1 text-sm font-bold uppercase tracking-wide text-brand-gold-dark">{vehicle.otherCategory || vehicle.category}</p><PortableTextRenderer value={vehicle.publicDescription} /></div></article>)}</div></section> : null}</div> : <EmptyState />}</div></>
}
