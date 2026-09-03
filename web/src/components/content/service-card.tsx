import Link from 'next/link'

import {SanityImage, type SanityImageValue} from './sanity-image'
import {Icon} from '@/components/ui/icon'

export type ServiceCardValue = {
  _id: string
  title: string | null
  slug: string | null
  summary?: string | null
  image?: SanityImageValue
  visualType?: string | null
}

export function ServiceCard({service}: {service: ServiceCardValue}) {
  if (!service.title || !service.slug) return null

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-neutral-border bg-white shadow-[0_8px_30px_rgb(9_35_61_/_0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(9_35_61_/_0.12)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-navy">
        {service.image?.asset?.url ? <SanityImage className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" height={500} image={service.image} sizes="(max-width: 768px) 100vw, 33vw" width={800} /> : <div aria-hidden="true" className="grid h-full place-items-center bg-[linear-gradient(135deg,var(--brand-navy),var(--brand-navy-dark))]"><Icon className="h-16 w-16 text-brand-gold/75" name="shield" /></div>}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-brand-gold" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-extrabold text-brand-navy"><Link className="focus-visible:outline-2 focus-visible:outline-brand-gold" href={`/servicos/${service.slug}`}>{service.title}</Link></h3>
        {service.summary ? <p className="mt-3 line-clamp-3 leading-7 text-muted-text">{service.summary}</p> : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-extrabold uppercase tracking-wide text-brand-gold-dark">Saber mais <Icon className="h-4 w-4" name="arrow" /></span>
      </div>
    </article>
  )
}
