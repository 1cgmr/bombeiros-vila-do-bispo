import {Icon} from '@/components/ui/icon'

export function EmptyState({title = 'Conteúdo em preparação', description = 'A informação oficial será publicada nesta página após validação.'}: {title?: string; description?: string}) {
  return (
    <div className="rounded-sm border border-neutral-border bg-white px-6 py-12 text-center sm:px-10">
      <Icon className="mx-auto h-9 w-9 text-brand-gold" name="shield" />
      <h2 className="mt-4 text-xl font-bold text-brand-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-muted-text">{description}</p>
    </div>
  )
}
