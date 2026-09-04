import Link from 'next/link'
import type {Metadata} from 'next'

import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {formatDate} from '@/lib/content'
import {buildMetadata} from '@/lib/metadata'
import {getSiteSettings} from '@/sanity/queries/site-settings'
import {getTraining, getTrainingInformation} from '@/sanity/queries/training'

export async function generateMetadata(): Promise<Metadata> {
  const [content, settings] = await Promise.all([getTrainingInformation(), getSiteSettings()])
  return buildMetadata({title: 'Formação', path: '/formacao', seo: content?.seo, siteSettings: settings})
}

export default async function TrainingPage() {
  const [content, training] = await Promise.all([getTrainingInformation(), getTraining()])
  return <><PageHeader eyebrow="Conhecimento e preparação" title="Formação" /><div className="container-site section-space"><div className="mx-auto max-w-5xl space-y-14">{content?.introduction?.length || content?.body?.length ? <section className="max-w-4xl"><PortableTextRenderer value={content.introduction} />{content.body?.length ? <PortableTextRenderer className="mt-6" value={content.body} /> : null}</section> : null}<section><h2 className="mb-6 text-3xl font-extrabold text-brand-navy">Ações de formação</h2>{training.length ? <div className="grid gap-5">{training.map((item) => item.slug && item.title ? <article className="rounded-sm border border-neutral-border bg-white p-6 shadow-sm" key={item._id}><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-wide text-brand-gold-dark">{formatDate(item.startDate) || 'Data a anunciar'}</p><h3 className="mt-2 text-2xl font-extrabold text-brand-navy"><Link className="hover:text-brand-gold-dark focus-visible:outline-2 focus-visible:outline-brand-gold" href={`/formacao/${item.slug}`}>{item.title}</Link></h3>{item.summary ? <p className="mt-2 max-w-3xl text-muted-text">{item.summary}</p> : null}</div><Link className="shrink-0 font-bold text-brand-navy underline decoration-brand-gold decoration-2 underline-offset-4" href={`/formacao/${item.slug}`}>Ver informação</Link></div></article> : null)}</div> : <p className="rounded-sm border border-neutral-border bg-white px-6 py-7 text-muted-text">De momento não existem ações de formação publicadas.</p>}</section></div></div></>
}
