import {getCliClient} from 'sanity/cli'

const API_VERSION = '2026-09-04'
const EXPECTED_PROJECT_ID = 'n3esjk8x'
const EXPECTED_DATASET = 'production'

const targetIds = [
  'homepage',
  'trainingInformation',
  'recruitmentInformation',
  'news-article-vfci-2026',
  'news-article-regional-firefighter-day-2026',
  'news-article-social-transport-2026',
] as const

type SanityDocument = {
  _id: string
  _rev: string
  _type: string
  [key: string]: unknown
}

const paragraph = (key: string, text: string) => ({
  _key: key,
  _type: 'block',
  children: [{_key: `${key}-text`, _type: 'span', marks: [], text}],
  markDefs: [],
  style: 'normal',
})

const answer = (key: string, text: string) => [paragraph(key, text)]

const trainingInformation = {
  _id: 'trainingInformation',
  _type: 'trainingInformation',
  introduction: [
    paragraph(
      'training-introduction',
      'A formação contínua é uma componente essencial da preparação dos bombeiros, contribuindo para a atualização de conhecimentos, o treino de procedimentos e a segurança nas diferentes missões.',
    ),
  ],
  body: [
    paragraph(
      'training-publication-information',
      'Nesta área serão divulgadas ações de formação quando existirem informações oficialmente confirmadas. Cada ação publicada indicará os destinatários, as datas, o local e a forma de inscrição aplicável.',
    ),
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Formação | Bombeiros de Vila do Bispo',
    metaDescription:
      'Informação sobre formação e preparação dos Bombeiros Voluntários de Vila do Bispo.',
    noIndex: false,
  },
}

const recruitmentInformation = {
  _id: 'recruitmentInformation',
  _type: 'recruitmentInformation',
  introduction: [
    paragraph(
      'recruitment-introduction',
      'Ser bombeiro voluntário é assumir um compromisso de serviço à comunidade, aprendizagem contínua e trabalho em equipa. Nesta página serão reunidas as informações oficialmente confirmadas sobre o recrutamento para os Bombeiros Voluntários de Vila do Bispo.',
    ),
  ],
  expectations: [
    paragraph(
      'recruitment-expectations',
      'O percurso de integração inclui preparação e formação adequadas às funções a desempenhar. Os requisitos, as etapas e as condições de candidatura serão publicados após validação oficial.',
    ),
  ],
  faq: [
    {
      _key: 'recruitment-faq-open',
      _type: 'faqItem',
      question: 'Estão abertas candidaturas?',
      answer: answer(
        'recruitment-faq-open-answer',
        'A abertura de candidaturas e as respetivas condições serão comunicadas nesta página. Até essa informação ser publicada, não deve ser presumido que exista um processo de recrutamento em curso.',
      ),
    },
    {
      _key: 'recruitment-faq-contact',
      _type: 'faqItem',
      question: 'Como posso pedir esclarecimentos?',
      answer: answer(
        'recruitment-faq-contact-answer',
        'Utilize os contactos oficiais publicados na página de Contactos.',
      ),
    },
  ],
  seo: {
    _type: 'seo',
    metaTitle: 'Recrutamento | Bombeiros de Vila do Bispo',
    metaDescription:
      'Informação sobre recrutamento para os Bombeiros Voluntários de Vila do Bispo.',
    noIndex: false,
  },
}

const newsFallbacks: Record<string, string> = {
  'news-article-vfci-2026': 'vehicle',
  'news-article-regional-firefighter-day-2026': 'community',
  'news-article-social-transport-2026': 'transport',
}

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  perspective: 'raw',
  useCdn: false,
})

const isApply = process.argv.includes('--apply')

function missingFields(document: SanityDocument, desired: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(desired).filter(
      ([key, value]) => !key.startsWith('_') && document[key] === undefined && value !== undefined,
    ),
  )
}

async function main() {
  const config = client.config()
  if (config.projectId !== EXPECTED_PROJECT_ID || config.dataset !== EXPECTED_DATASET) {
    throw new Error(
      `Destino inesperado: ${config.projectId}/${config.dataset}. Esperado: ${EXPECTED_PROJECT_ID}/${EXPECTED_DATASET}.`,
    )
  }

  const [documents, drafts, stationAssetId] = await Promise.all([
    client.fetch<SanityDocument[]>('*[_id in $ids]', {ids: [...targetIds]}),
    client.fetch<Array<{_id: string}>>('*[_id in $ids]', {
      ids: targetIds.map((id) => `drafts.${id}`),
    }),
    client.fetch<string | null>(
      '*[_type == "sanity.imageAsset" && originalFilename == "Foto_Quartel.jpg"] | order(_createdAt desc)[0]._id',
    ),
  ])

  if (drafts.length) {
    throw new Error(
      `Existem rascunhos nos documentos alvo (${drafts.map(({_id}) => _id).join(', ')}). Reveja-os no Studio antes de executar esta migração.`,
    )
  }
  if (!stationAssetId) {
    throw new Error('Não foi encontrado no Sanity o ativo oficial Foto_Quartel.jpg.')
  }

  const byId = new Map(documents.map((document) => [document._id, document]))
  const homepage = byId.get('homepage')
  if (!homepage) throw new Error('O documento publicado Página Inicial não existe.')

  const homepageMission = homepage.mission as {image?: unknown} | undefined
  const addMissionImage = !homepageMission?.image
  const training = byId.get('trainingInformation')
  const recruitment = byId.get('recruitmentInformation')
  const trainingFields = training ? missingFields(training, trainingInformation) : null
  const recruitmentFields = recruitment
    ? missingFields(recruitment, recruitmentInformation)
    : null
  const newsToPatch = Object.entries(newsFallbacks).filter(([id]) => {
    const article = byId.get(id)
    if (!article) throw new Error(`O artigo publicado ${id} não existe.`)
    return article.fallbackVisual === undefined
  })

  console.log(`Destino confirmado: ${EXPECTED_PROJECT_ID}/${EXPECTED_DATASET}`)
  console.log(`Modo: ${isApply ? 'APLICAR' : 'SIMULAÇÃO'}`)
  console.log(`Imagem da missão a adicionar: ${addMissionImage ? 'sim' : 'não (preservada)'}`)
  console.log(
    `Apresentação da Formação: ${training ? `${Object.keys(trainingFields || {}).length} campos em falta` : 'criar documento'}`,
  )
  console.log(
    `Recrutamento: ${recruitment ? `${Object.keys(recruitmentFields || {}).length} campos em falta` : 'criar documento'}`,
  )
  console.log(`Ilustrações de notícias a definir: ${newsToPatch.length}`)

  if (!isApply) {
    console.log('Nenhuma alteração remota efetuada. Use --apply depois de rever este resumo.')
    return
  }

  let transaction = client.transaction()

  if (addMissionImage) {
    const image = {
      _type: 'accessibleImage',
      alt: 'Quartel dos Bombeiros Voluntários de Vila do Bispo',
      asset: {_ref: stationAssetId, _type: 'reference'},
      decorative: false,
      hotspot: {
        _type: 'sanity.imageHotspot',
        height: 0.86,
        width: 0.58,
        x: 0.64,
        y: 0.5,
      },
    }
    transaction = transaction.patch('homepage', (patch) =>
      patch.ifRevisionId(homepage._rev).set({'mission.image': image}),
    )
  }

  if (!training) {
    transaction = transaction.createIfNotExists(trainingInformation)
  } else if (trainingFields && Object.keys(trainingFields).length) {
    transaction = transaction.patch(training._id, (patch) =>
      patch.ifRevisionId(training._rev).set(trainingFields),
    )
  }

  if (!recruitment) {
    transaction = transaction.createIfNotExists(recruitmentInformation)
  } else if (recruitmentFields && Object.keys(recruitmentFields).length) {
    transaction = transaction.patch(recruitment._id, (patch) =>
      patch.ifRevisionId(recruitment._rev).set(recruitmentFields),
    )
  }

  for (const [id, fallbackVisual] of newsToPatch) {
    const article = byId.get(id)
    if (!article) continue
    transaction = transaction.patch(id, (patch) =>
      patch.ifRevisionId(article._rev).set({fallbackVisual}),
    )
  }

  const result = await transaction.commit({visibility: 'sync'})
  console.log(`Alterações aplicadas numa transação: ${result.transactionId}`)
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
