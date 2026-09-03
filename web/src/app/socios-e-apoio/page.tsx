import type {Metadata} from 'next'

import {EmptyState} from '@/components/content/empty-state'
import {FaqList} from '@/components/content/faq-list'
import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {Steps} from '@/components/content/steps'
import {buildMetadata} from '@/lib/metadata'
import {getDonationInformation} from '@/sanity/queries/donations'
import {getMembershipInformation} from '@/sanity/queries/membership'
import {getPartners} from '@/sanity/queries/partners'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const [membership, settings] = await Promise.all([getMembershipInformation(), getSiteSettings()])
  return buildMetadata({title: 'Sócios e apoio', path: '/socios-e-apoio', seo: membership?.seo, siteSettings: settings})
}

export default async function SupportPage() {
  const [membership, donation, partners] = await Promise.all([getMembershipInformation(), getDonationInformation(), getPartners()])
  const hasContent = Boolean(membership || donation || partners.length)
  return <><PageHeader eyebrow="Participação" title="Sócios e apoio" /><div className="container-site section-space">{hasContent ? <div className="space-y-16"><section className="mx-auto max-w-5xl"><h2 className="mb-6 text-3xl font-extrabold text-brand-navy">Informação para sócios</h2><PortableTextRenderer value={membership?.introduction} />{membership?.eligibility?.length ? <PortableTextRenderer value={membership.eligibility} /> : null}{membership?.benefits?.length ? <ul className="my-8 grid gap-3 sm:grid-cols-2">{membership.benefits.map((benefit) => <li className="border-l-4 border-brand-gold bg-white px-5 py-4" key={benefit}>{benefit}</li>)}</ul> : null}{membership?.process?.length ? <><h3 className="mb-5 mt-10 text-2xl font-bold text-brand-navy">Como tornar-se sócio</h3><Steps items={membership.process} /></> : null}{membership?.fees?.length ? <section className="mt-10 rounded-sm bg-brand-gold-pale p-6"><h3 className="text-2xl font-bold text-brand-navy">Quotas e valores</h3><PortableTextRenderer value={membership.fees} /></section> : null}{membership?.faq?.length ? <section className="mt-10"><h3 className="mb-5 text-2xl font-bold text-brand-navy">Perguntas frequentes</h3><FaqList items={membership.faq} /></section> : null}</section>{donation ? <section className="rounded-sm bg-brand-navy px-6 py-10 text-white sm:px-10"><h2 className="text-3xl font-extrabold">Donativos</h2><PortableTextRenderer className="[&_p]:text-white/80 [&_h2]:text-white [&_h3]:text-white" value={donation.introduction} /><PortableTextRenderer className="[&_p]:text-white/80 [&_h2]:text-white [&_h3]:text-white" value={donation.waysToContribute} />{donation.donationMethods?.length ? <div className="mt-8 grid gap-4 md:grid-cols-2">{donation.donationMethods.map((method) => <article className="rounded-sm bg-white/8 p-5" key={method._key}><h3 className="text-xl font-bold text-brand-gold-light">{method.title}</h3><PortableTextRenderer className="[&_p]:text-white/80" value={method.description} />{method.iban ? <p className="mt-3 font-mono">IBAN: {method.iban}</p> : null}{method.mbWayNumber ? <p className="mt-3">MB WAY: {method.mbWayNumber}</p> : null}{method.externalUrl?.startsWith('https://') ? <a className="mt-3 inline-block font-bold underline decoration-brand-gold" href={method.externalUrl} rel="noopener noreferrer" target="_blank">Abrir página externa</a> : null}</article>)}</div> : null}</section> : null}{partners.length ? <section><h2 className="mb-7 text-3xl font-extrabold text-brand-navy">Parceiros</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{partners.map((partner) => <article className="rounded-sm border border-neutral-border bg-white p-6 text-center" key={partner._id}>{partner.logo?.asset?.url ? <SanityImage className="mx-auto h-20 w-full object-contain" height={200} image={partner.logo} sizes="200px" width={400} /> : null}<h3 className="mt-4 font-bold text-brand-navy">{partner.name}</h3></article>)}</div></section> : null}</div> : <EmptyState />}</div></>
}
