import Link from 'next/link'

import {formatDate} from '@/lib/content'
import {Icon} from '@/components/ui/icon'

import {SanityImage, type SanityImageValue} from './sanity-image'
import {ContentVisual, type ContentVisualVariant} from './content-visual'

export type NewsCardValue = {
  _id: string
  title: string | null
  slug: string | null
  excerpt?: string | null
  publicationDate?: string | null
  mainImage?: SanityImageValue
  fallbackVisual?: string | null
  categories?: Array<{_id: string; name?: string | null}> | null
}

export function NewsCard({article}: {article: NewsCardValue}) {
  if (!article.title || !article.slug) return null
  const date = formatDate(article.publicationDate)
  const category = article.categories?.find((item) => item.name)?.name

  return (
    <article className="group overflow-hidden rounded-sm bg-white shadow-[0_8px_30px_rgb(9_35_61_/_0.08)]">
      <div className="aspect-[16/9] overflow-hidden bg-brand-navy/8">
        {article.mainImage?.asset?.url ? <SanityImage className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" height={480} image={article.mainImage} sizes="(max-width: 768px) 100vw, 33vw" width={800} /> : <ContentVisual variant={article.fallbackVisual as ContentVisualVariant | null} />}
      </div>
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wide text-brand-gold-dark">
          {category ? <span>{category}</span> : null}
          {category && date ? <span aria-hidden="true">·</span> : null}
          {date ? <time className="inline-flex items-center gap-1.5" dateTime={article.publicationDate || undefined}><Icon className="h-3.5 w-3.5" name="calendar" />{date}</time> : null}
        </div>
        <h3 className="mt-3 text-xl font-extrabold leading-snug text-brand-navy"><Link className="focus-visible:outline-2 focus-visible:outline-brand-gold" href={`/noticias/${article.slug}`}>{article.title}</Link></h3>
        {article.excerpt ? <p className="mt-3 line-clamp-3 leading-7 text-muted-text">{article.excerpt}</p> : null}
        <Link className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wide text-brand-gold-dark hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-gold" href={`/noticias/${article.slug}`}>Ler notícia <Icon className="h-4 w-4" name="arrow" /></Link>
      </div>
    </article>
  )
}
