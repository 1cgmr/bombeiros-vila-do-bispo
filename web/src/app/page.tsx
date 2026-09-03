import {getSiteSettings} from '@/sanity/queries/site-settings'

export const revalidate = 300

export default async function Home() {
  const siteSettings = await getSiteSettings()

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section
        aria-labelledby="foundation-title"
        className="w-full max-w-2xl rounded-2xl border border-[var(--foundation-border)] bg-[var(--foundation-surface)] p-8 shadow-sm sm:p-12"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--foundation-muted)]">
          Website institucional
        </p>
        <h1 id="foundation-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Fundação técnica em desenvolvimento
        </h1>
        <p className="mt-5 max-w-prose leading-7 text-[var(--foundation-muted)]">
          A estrutura técnica está pronta para receber conteúdo oficial validado. As páginas e o design finais serão
          implementados numa fase posterior.
        </p>
        <p className="mt-8 border-t border-[var(--foundation-border)] pt-5 text-sm text-[var(--foundation-muted)]">
          {siteSettings
            ? 'Ligação pública ao Sanity ativa; existem configurações do site publicadas.'
            : 'Ligação pública ao Sanity ativa; as configurações do site ainda não estão publicadas.'}
        </p>
      </section>
    </main>
  )
}
