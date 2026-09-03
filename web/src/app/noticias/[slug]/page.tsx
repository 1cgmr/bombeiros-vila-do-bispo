import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {PageHeader} from '@/components/content/page-header'
import {PortableTextRenderer} from '@/components/content/portable-text'
import {SanityImage} from '@/components/content/sanity-image'
import {formatDate} from '@/lib/content'
import {buildMetadata} from '@/lib/metadata'
import {getNewsArticleBySlug} from '@/sanity/queries/news'
import {getSiteSettings} from '@/sanity/queries/site-settings'

type PageProps = {params: Promise<{slug: string}>}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params
  const [article, settings] = await Promise.all([getNewsArticleBySlug(slug), getSiteSettings()])
  if (!article) return {title: 'Notícia não encontrada'}
  return buildMetadata({title: article.title || 'Notícia', description: article.excerpt, path: `/noticias/${slug}`, seo: article.seo, siteSettings: settings})
}

export default async function NewsDetailPage({params}: PageProps) {
  const {slug} = await params
  const article = await getNewsArticleBySlug(slug)
  if (!article) notFound()
  const date = formatDate(article.publicationDate)
  return <><PageHeader eyebrow={article.categories?.find((category) => category.name)?.name || 'Notícias'} introduction={<>{date ? <time dateTime={article.publicationDate || undefined}>{date}</time> : null}{article.author?.publicName ? <span> · {article.author.publicName}</span> : null}</>} title={article.title || 'Notícia'} /><article className="container-site section-space"><div className="mx-auto max-w-4xl">{article.mainImage?.asset?.url ? <SanityImage className="mb-10 h-auto w-full rounded-sm object-cover" height={900} image={article.mainImage} sizes="(max-width: 896px) 100vw, 896px" width={1400} /> : null}{article.excerpt ? <p className="mb-8 border-l-4 border-brand-gold pl-5 text-xl leading-8 text-brand-navy">{article.excerpt}</p> : null}<PortableTextRenderer value={article.body} /></div></article></>
}
