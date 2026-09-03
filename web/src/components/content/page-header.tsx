import type {ReactNode} from 'react'

export function PageHeader({eyebrow, title, introduction}: {eyebrow?: string; title: string; introduction?: ReactNode}) {
  return (
    <header className="relative overflow-hidden bg-brand-navy text-white">
      <div aria-hidden="true" className="absolute -right-24 -top-32 h-96 w-96 rotate-12 border-[5rem] border-white/3" />
      <div className="container-site relative py-16 sm:py-20 lg:py-24">
        {eyebrow ? <p className="mb-4 text-xs font-extrabold uppercase tracking-[.2em] text-brand-gold-light">{eyebrow}</p> : null}
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
        {introduction ? <div className="mt-5 max-w-3xl text-lg leading-8 text-white/76">{introduction}</div> : null}
      </div>
    </header>
  )
}
