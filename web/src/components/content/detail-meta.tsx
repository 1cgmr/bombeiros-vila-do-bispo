import {formatDate} from '@/lib/content'
import {Icon} from '@/components/ui/icon'

export function DetailMeta({date, location, audience}: {date?: string | null; location?: string | null; audience?: string | null}) {
  const formattedDate = formatDate(date)
  if (!formattedDate && !location && !audience) return null
  return <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-white/75">{formattedDate ? <time className="inline-flex items-center gap-2" dateTime={date || undefined}><Icon className="h-4 w-4 text-brand-gold-light" name="calendar" />{formattedDate}</time> : null}{location ? <span className="inline-flex items-center gap-2"><Icon className="h-4 w-4 text-brand-gold-light" name="location" />{location}</span> : null}{audience ? <span>Destinatários: {audience}</span> : null}</div>
}
