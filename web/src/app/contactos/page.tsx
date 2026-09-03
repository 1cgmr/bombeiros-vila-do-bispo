import type {Metadata} from 'next'

import {EmptyState} from '@/components/content/empty-state'
import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {ButtonLink} from '@/components/ui/button-link'
import {Icon} from '@/components/ui/icon'
import {formatAddress} from '@/lib/content'
import {buildMetadata} from '@/lib/metadata'
import {getContactInformation} from '@/sanity/queries/contact'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const [contact, settings] = await Promise.all([getContactInformation(), getSiteSettings()])
  return buildMetadata({title: 'Contactos', path: '/contactos', seo: contact?.seo, siteSettings: settings})
}

export default async function ContactPage() {
  const contact = await getContactInformation()
  const address = formatAddress(contact?.address ?? null)
  const hasNormalContact = Boolean(address.length || contact?.telephone || contact?.generalEmail || contact?.additionalChannels?.length)
  return <><PageHeader eyebrow="Informação de contacto" title="Contactos" /><section className="bg-emergency-red text-white"><div className="container-site flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-wide">Em caso de emergência</p><p className="text-3xl font-black">Ligue 112</p></div><a aria-label="Ligar 112 em caso de emergência" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-white px-6 font-black text-emergency-red focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white" href="tel:112"><Icon className="h-5 w-5" name="phone" />112</a></div></section><div className="container-site section-space">{hasNormalContact ? <div className="grid gap-8 lg:grid-cols-2"><section className="rounded-sm border border-neutral-border bg-white p-7"><h2 className="text-2xl font-extrabold text-brand-navy">Contacto geral</h2><div className="mt-6 space-y-5">{contact?.telephone ? <a className="flex min-h-11 items-center gap-3 font-semibold hover:text-brand-gold-dark" href={`tel:${contact.telephone.replace(/[^+\d]/g, '')}`}><Icon className="h-5 w-5 text-brand-gold-dark" name="phone" />{contact.telephone}</a> : null}{contact?.generalEmail ? <a className="flex min-h-11 items-center gap-3 break-all font-semibold hover:text-brand-gold-dark" href={`mailto:${contact.generalEmail}`}><Icon className="h-5 w-5 shrink-0 text-brand-gold-dark" name="mail" />{contact.generalEmail}</a> : null}{address.length ? <div className="flex gap-3"><Icon className="mt-1 h-5 w-5 shrink-0 text-brand-gold-dark" name="location" /><address className="not-italic">{address.map((line) => <span className="block" key={line}>{line}</span>)}</address></div> : null}{contact?.directionsMapUrl?.startsWith('https://') ? <ButtonLink href={contact.directionsMapUrl} variant="outline">Como chegar</ButtonLink> : null}</div></section><section className="rounded-sm bg-brand-gold-pale p-7"><h2 className="text-2xl font-extrabold text-brand-navy">Horário e outros contactos</h2><PortableTextRenderer value={contact?.contactHours} />{contact?.additionalChannels?.length ? <ul className="mt-6 space-y-3">{contact.additionalChannels.map((channel) => <li className="border-t border-brand-gold/30 pt-3" key={channel._key}><strong className="block text-brand-navy">{channel.label}</strong><span>{channel.value}</span>{channel.description ? <p className="text-sm text-muted-text">{channel.description}</p> : null}</li>)}</ul> : null}</section></div> : <EmptyState title="Contactos em preparação" />}</div></>
}
