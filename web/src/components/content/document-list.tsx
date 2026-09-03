import {Icon} from '@/components/ui/icon'
import {formatDate} from '@/lib/content'

export type DocumentListValue = {
  _id: string
  title?: string | null
  category?: string | null
  date?: string | null
  reference?: string | null
  accessibleSummary?: unknown
  file?: {url?: string | null; size?: number | null; mimeType?: string | null} | null
}

export function DocumentList({documents}: {documents?: DocumentListValue[] | null}) {
  const available = documents?.filter((document) => document.title && document.file?.url) ?? []
  if (!available.length) return null

  return (
    <ul className="grid gap-4">
      {available.map((document) => (
        <li className="rounded-sm border border-neutral-border bg-white" id={document._id} key={document._id}>
          <a className="flex min-h-24 items-center gap-4 p-5 transition hover:border-brand-gold hover:bg-brand-gold-pale focus-visible:outline-2 focus-visible:outline-brand-gold" href={document.file?.url || undefined} rel="noopener noreferrer" target="_blank">
            <span className="grid h-12 w-12 shrink-0 place-items-center bg-brand-navy text-white"><Icon className="h-6 w-6" name="document" /></span>
            <span className="min-w-0">
              <strong className="block text-lg text-brand-navy">{document.title}</strong>
              <span className="mt-1 block text-sm text-muted-text">{[document.category, formatDate(document.date), document.reference].filter(Boolean).join(' · ') || 'Documento PDF'}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
