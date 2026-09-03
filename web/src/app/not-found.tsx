import {ButtonLink} from '@/components/ui/button-link'

export default function NotFound() {
  return <div className="container-site section-space text-center"><p className="section-label">Erro 404</p><h1 className="mt-3 text-4xl font-extrabold text-brand-navy">Página não encontrada</h1><p className="mx-auto mt-4 max-w-xl text-lg text-muted-text">O endereço indicado não corresponde a uma página publicada.</p><ButtonLink className="mt-8" href="/" variant="navy">Voltar ao início</ButtonLink></div>
}
