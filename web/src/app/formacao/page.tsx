import Link from 'next/link'
import type {Metadata} from 'next'

import {EmptyState} from '@/components/content/empty-state'
import {PageHeader} from '@/components/content/page-header'
import {formatDate} from '@/lib/content'
import {buildMetadata} from '@/lib/metadata'
import {getSiteSettings} from '@/sanity/queries/site-settings'
import {getTraining} from '@/sanity/queries/training'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({title: 'Formação', path: '/formacao', siteSettings: settings})
}

export default async function TrainingPage() {
  const training = await getTraining()
  return <><PageHeader eyebrow="Conhecimento e preparação" title="Formação" /><div className="container-site section-space">{training.length ? <div className="grid gap-5">{training.map((item) => item.slug && item.title ? <article className="rounded-sm border border-neutral-border bg-white p-6 shadow-sm" key={item._id}><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-wide text-brand-gold-dark">{formatDate(item.startDate) || 'Data a anunciar'}</p><h2 className="mt-2 text-2xl font-extrabold text-brand-navy"><Link className="hover:text-brand-gold-dark focus-visible:outline-2 focus-visible:outline-brand-gold" href={`/formacao/${item.slug}`}>{item.title}</Link></h2>{item.summary ? <p className="mt-2 max-w-3xl text-muted-text">{item.summary}</p> : null}</div><Link className="shrink-0 font-bold text-brand-navy underline decoration-brand-gold decoration-2 underline-offset-4" href={`/formacao/${item.slug}`}>Ver informação</Link></div></article> : null)}</div> : <EmptyState />}</div></>
}
