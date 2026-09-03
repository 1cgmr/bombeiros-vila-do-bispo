import type {Metadata} from 'next'

import {EmptyState} from '@/components/content/empty-state'
import {NewsCard} from '@/components/content/news-card'
import {PageHeader} from '@/components/content/page-header'
import {buildMetadata} from '@/lib/metadata'
import {getNewsArticles} from '@/sanity/queries/news'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({title: 'Notícias e atividades', path: '/noticias', siteSettings: settings})
}

export default async function NewsPage() {
  const articles = await getNewsArticles(24)
  return <><PageHeader eyebrow="Atualidade" title="Notícias e atividades" /><div className="container-site section-space">{articles.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <NewsCard article={article} key={article._id} />)}</div> : <EmptyState />}</div></>
}
