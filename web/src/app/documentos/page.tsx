import type {Metadata} from 'next'

import {DocumentList} from '@/components/content/document-list'
import {EmptyState} from '@/components/content/empty-state'
import {PageHeader} from '@/components/content/page-header'
import {buildMetadata} from '@/lib/metadata'
import {getInstitutionalDocuments} from '@/sanity/queries/institutional-documents'
import {getSiteSettings} from '@/sanity/queries/site-settings'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return buildMetadata({title: 'Documentos', path: '/documentos', siteSettings: settings})
}

export default async function DocumentsPage() {
  const documents = await getInstitutionalDocuments()
  return <><PageHeader eyebrow="Transparência" title="Documentos" /><div className="container-site section-space"><div className="mx-auto max-w-4xl">{documents.length ? <DocumentList documents={documents} /> : <EmptyState />}</div></div></>
}
