import {PortableText, type PortableTextBlock, type PortableTextComponents} from '@portabletext/react'
import Link from 'next/link'

import {SanityImage, type SanityImageValue} from './sanity-image'

const components: PortableTextComponents = {
  block: {
    h2: ({children}) => <h2 className="mt-12 text-3xl font-bold tracking-tight text-brand-navy first:mt-0">{children}</h2>,
    h3: ({children}) => <h3 className="mt-9 text-2xl font-bold tracking-tight text-brand-navy">{children}</h3>,
    h4: ({children}) => <h4 className="mt-7 text-xl font-bold text-brand-navy">{children}</h4>,
    normal: ({children}) => <p className="my-5 leading-8 text-neutral-text">{children}</p>,
  },
  list: {
    bullet: ({children}) => <ul className="my-5 list-disc space-y-2 pl-6 marker:text-brand-gold">{children}</ul>,
    number: ({children}) => <ol className="my-5 list-decimal space-y-2 pl-6 marker:font-bold marker:text-brand-gold">{children}</ol>,
  },
  marks: {
    strong: ({children}) => <strong className="font-bold text-brand-navy">{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : ''
      if (!href) return <>{children}</>
      const external = href.startsWith('https://')
      return (
        <a className="font-semibold text-brand-navy underline decoration-brand-gold decoration-2 underline-offset-4 hover:text-brand-gold-dark" href={href} rel={external ? 'noopener noreferrer' : undefined} target={external ? '_blank' : undefined}>
          {children}
        </a>
      )
    },
  },
  types: {
    accessibleImage: ({value}) => (
      <figure className="my-10">
        <SanityImage className="h-auto w-full rounded-sm object-cover" height={800} image={value as SanityImageValue} sizes="(max-width: 768px) 100vw, 760px" width={1200} />
        {(value as SanityImageValue)?.caption ? <figcaption className="mt-3 text-sm text-muted-text">{(value as SanityImageValue)?.caption}{(value as SanityImageValue)?.credit ? ` — ${(value as SanityImageValue)?.credit}` : ''}</figcaption> : null}
      </figure>
    ),
    institutionalDocumentReference: ({value}) => {
      const reference = typeof value?._ref === 'string' ? value._ref : undefined
      if (!reference) return null
      return <p className="my-6"><Link className="font-bold text-brand-navy underline decoration-brand-gold decoration-2 underline-offset-4" href={`/documentos#${encodeURIComponent(reference)}`}>Consultar documento institucional</Link></p>
    },
  },
  unknownType: () => null,
  unknownMark: ({children}) => <>{children}</>,
}

export function PortableTextRenderer({value, className = ''}: {value?: unknown; className?: string}) {
  if (!Array.isArray(value) || !value.length) return null
  return <div className={`portable-text ${className}`}><PortableText components={components} value={value as PortableTextBlock[]} /></div>
}
