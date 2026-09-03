import type {Metadata} from 'next'

import {EmptyState} from '@/components/content/empty-state'
import {FaqList} from '@/components/content/faq-list'
import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {Steps} from '@/components/content/steps'
import {buildMetadata} from '@/lib/metadata'
import {getRecruitmentInformation} from '@/sanity/queries/recruitment'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const [content, settings] = await Promise.all([getRecruitmentInformation(), getSiteSettings()])
  return buildMetadata({title: 'Recrutamento', path: '/recrutamento', seo: content?.seo, siteSettings: settings})
}

export default async function RecruitmentPage() {
  const content = await getRecruitmentInformation()
  return <><PageHeader eyebrow="Quero ser bombeiro" title="Recrutamento" /><div className="container-site section-space">{content ? <div className="mx-auto max-w-5xl space-y-14"><PortableTextRenderer value={content.introduction} />{content.eligibility?.length ? <section><h2 className="mb-5 text-3xl font-extrabold text-brand-navy">Quem se pode candidatar</h2><PortableTextRenderer value={content.eligibility} /></section> : null}{content.requirements?.length ? <section><h2 className="mb-5 text-3xl font-extrabold text-brand-navy">Requisitos</h2><ul className="grid gap-3 sm:grid-cols-2">{content.requirements.map((requirement) => <li className="border-l-4 border-brand-gold bg-white px-5 py-4" key={requirement}>{requirement}</li>)}</ul></section> : null}{content.stages?.length ? <section><h2 className="mb-6 text-3xl font-extrabold text-brand-navy">Etapas do processo</h2><Steps items={content.stages} /></section> : null}{content.expectations?.length ? <section><h2 className="mb-5 text-3xl font-extrabold text-brand-navy">O que esperar</h2><PortableTextRenderer value={content.expectations} /></section> : null}{content.faq?.length ? <section><h2 className="mb-6 text-3xl font-extrabold text-brand-navy">Perguntas frequentes</h2><FaqList items={content.faq} /></section> : null}</div> : <EmptyState />}</div></>
}
