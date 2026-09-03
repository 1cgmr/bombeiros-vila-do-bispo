export function Steps({items}: {items?: Array<{_key: string; title?: string | null; description?: string | null}> | null}) {
  const available = items?.filter((item) => item.title) ?? []
  if (!available.length) return null
  return <ol className="grid gap-5 md:grid-cols-2">{available.map((item, index) => <li className="relative rounded-sm border border-neutral-border bg-white p-6 pl-20" key={item._key}><span aria-hidden="true" className="absolute left-5 top-5 grid h-10 w-10 place-items-center bg-brand-gold font-black text-brand-navy">{index + 1}</span><h3 className="text-xl font-bold text-brand-navy">{item.title}</h3>{item.description ? <p className="mt-2 leading-7 text-muted-text">{item.description}</p> : null}</li>)}</ol>
}
