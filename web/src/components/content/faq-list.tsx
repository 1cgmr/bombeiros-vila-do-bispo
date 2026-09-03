import {PortableTextRenderer} from './portable-text'

export function FaqList({items}: {items?: Array<{_key: string; question?: string | null; answer?: unknown}> | null}) {
  const available = items?.filter((item) => item.question) ?? []
  if (!available.length) return null
  return <div className="divide-y divide-neutral-border rounded-sm border border-neutral-border bg-white">{available.map((item) => <details className="group p-5 open:bg-brand-gold-pale/45" key={item._key}><summary className="cursor-pointer list-none pr-8 text-lg font-bold text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-gold">{item.question}<span aria-hidden="true" className="float-right text-brand-gold-dark group-open:rotate-45">+</span></summary><PortableTextRenderer className="pt-2" value={item.answer} /></details>)}</div>
}
