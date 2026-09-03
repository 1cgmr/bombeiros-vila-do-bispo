import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {DetailMeta} from '@/components/content/detail-meta'
import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {buildMetadata} from '@/lib/metadata'
import {getSiteSettings} from '@/sanity/queries/site-settings'
import {getTrainingBySlug} from '@/sanity/queries/training'

type PageProps = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  const [training, settings] = await Promise.all([getTrainingBySlug(slug), getSiteSettings()])
  if (!training) return {title: 'Formação não encontrada'}
  return buildMetadata({title: training.title || 'Formação', description: training.summary, path: `/formacao/${slug}`, seo: training.seo, siteSettings: settings})
}

export default async function TrainingDetailPage({params}: PageProps) {
  const {slug} = await params
  const training = await getTrainingBySlug(slug)
  if (!training) notFound()
  return <><PageHeader eyebrow="Formação" introduction={<><span>{training.summary}</span><DetailMeta audience={training.audience} date={training.startDate} location={training.location} /></>} title={training.title || 'Formação'} /><div className="container-site section-space"><div className="mx-auto max-w-4xl"><PortableTextRenderer value={training.description} />{training.enrollmentInformation?.length ? <section className="mt-12 rounded-sm bg-brand-gold-pale p-6"><h2 className="text-2xl font-bold text-brand-navy">Inscrições</h2><PortableTextRenderer value={training.enrollmentInformation} /></section> : null}</div></div></>
}
