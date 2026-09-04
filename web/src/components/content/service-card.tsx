import Link from 'next/link'

import {SanityImage, type SanityImageValue} from './sanity-image'
import {ContentVisual, type ContentVisualVariant} from './content-visual'
import {Icon} from '@/components/ui/icon'

export type ServiceCardValue = {
  _id: string
  title: string | null
  slug: string | null
  summary?: string | null
  image?: SanityImageValue
  visualType?: string | null
  icon?: string | null
}

export function ServiceCard({service}: {service: ServiceCardValue}) {
  if (!service.title || !service.slug) return null

  return (
    <article className="h-full">
      <Link className="group flex h-full flex-col overflow-hidden rounded-sm border border-neutral-border bg-white shadow-[0_8px_30px_rgb(9_35_61_/_0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(9_35_61_/_0.12)] focus-visible:-translate-y-1 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-brand-gold" href={`/servicos/${service.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy">
          {service.image?.asset?.url ? <SanityImage className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" height={500} image={service.image} sizes="(max-width: 768px) 100vw, 33vw" width={800} /> : <ContentVisual variant={service.icon as ContentVisualVariant | null} />}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-brand-gold" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-extrabold text-brand-navy">{service.title}</h3>
          {service.summary ? <p className="mt-3 line-clamp-3 leading-7 text-muted-text">{service.summary}</p> : null}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-extrabold uppercase tracking-wide text-brand-gold-dark">Saber mais <Icon className="h-4 w-4" name="arrow" /></span>
        </div>
      </Link>
    </article>
  )
}
