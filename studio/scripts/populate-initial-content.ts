import {createHash} from 'node:crypto'
import {createReadStream, readFileSync} from 'node:fs'
import {resolve} from 'node:path'

import {getCliClient} from 'sanity/cli'

const API_VERSION = '2026-03-01'
const EXPECTED_PROJECT_ID = 'n3esjk8x'
const EXPECTED_DATASET = 'production'
const TEST_ARTICLE_TITLE = 'Artigo de teste'

const LEGACY_PRIVATE_IDS = [
  'institutionalPage.association',
  'institutionalPage.fireBrigade',
  'service.protection-and-rescue',
  'service.firefighting',
  'service.social-transport',
  'person.emerson-gomes',
  'person.carlos-costa',
  'governingBody.command',
  'governingBody.direction',
  'newsCategory.institutional',
  'newsArticle.vfci-2026',
  'newsArticle.regional-firefighter-day-2026',
  'newsArticle.social-transport-2026',
] as const

const LEGACY_ID_REPLACEMENTS: Record<string, string> = {
  'service.protection-and-rescue': 'service-protection-and-rescue',
  'service.firefighting': 'service-firefighting',
  'service.social-transport': 'service-social-transport',
}

const LEGACY_DEPENDENT_IDS = [
  'governingBody.command',
  'governingBody.direction',
  'newsArticle.vfci-2026',
  'newsArticle.regional-firefighter-day-2026',
  'newsArticle.social-transport-2026',
] as const

const SOURCE_URLS = {
  legalAssociation:
    'https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2007-70048101',
  legalFireBrigade:
    'https://diariodarepublica.pt/dr/detalhe/decreto-lei/247-2007-635841',
  vfci:
    'https://www.cm-viladobispo.pt/noticias/vila-do-bispo-e-o-primeiro-municipio-do-algarve-a-entregar-uma-viatura-aos-bombeiros-no-ambito-do-algarve-2030',
  regionalDay:
    'https://www.cm-viladobispo.pt/noticias/comemoracoes-do-dia-regional-do-bombeiro-do-algarve',
  socialTransport:
    'https://www.cm-viladobispo.pt/noticias/camara-promove-transporte-social-mais-abrangente-em-colaboracao-com-os-bombeiros-de-vila-do-bispo',
} as const

type PortableTextBlock = {
  _key: string
  _type: 'block'
  children: Array<{
    _key: string
    _type: 'span'
    marks: string[]
    text: string
  }>
  markDefs: Array<{
    _key: string
    _type: 'link'
    href: string
    openInNewTab: boolean
  }>
  style: 'normal'
}

type SanityDocument = {
  _id: string
  _type: string
  [key: string]: unknown
}

type ImageAssetReference = {
  _ref: string
  _type: 'reference'
}

const paragraph = (key: string, text: string): PortableTextBlock => ({
  _key: key,
  _type: 'block',
  children: [
    {
      _key: `${key}-text`,
      _type: 'span',
      marks: [],
      text,
    },
  ],
  markDefs: [],
  style: 'normal',
})

const sourceParagraph = (
  key: string,
  sourceName: string,
  sourceUrl: string,
): PortableTextBlock => ({
  _key: key,
  _type: 'block',
  children: [
    {
      _key: `${key}-label`,
      _type: 'span',
      marks: [],
      text: 'Fonte: ',
    },
    {
      _key: `${key}-link`,
      _type: 'span',
      marks: [`${key}-definition`],
      text: sourceName,
    },
  ],
  markDefs: [
    {
      _key: `${key}-definition`,
      _type: 'link',
      href: sourceUrl,
      openInNewTab: true,
    },
  ],
  style: 'normal',
})

const reference = (key: string, id: string) => ({
  _key: key,
  _ref: id,
  _type: 'reference' as const,
})

const image = (asset: ImageAssetReference, alt: string) => ({
  _type: 'accessibleImage' as const,
  alt,
  asset,
  decorative: false,
})

const logoPath = resolve(process.cwd(), '..', 'docs', 'images', 'Logo_bombeiros.jpeg')
const stationPath = resolve(process.cwd(), '..', 'docs', 'images', 'Foto_Quartel.jpg')

const client = getCliClient({apiVersion: API_VERSION}).withConfig({
  perspective: 'raw',
  useCdn: false,
})

const isApply = process.argv.includes('--apply')

function fileSha1(filePath: string) {
  return createHash('sha1').update(readFileSync(filePath)).digest('hex')
}

async function findImageAsset(filePath: string) {
  const sha1hash = fileSha1(filePath)
  const assetId = await client.fetch<string | null>(
    '*[_type == "sanity.imageAsset" && sha1hash == $sha1hash][0]._id',
    {sha1hash},
  )

  return {assetId, sha1hash}
}

async function ensureImageAsset(filePath: string, filename: string) {
  const existing = await findImageAsset(filePath)
  if (existing.assetId) {
    console.log(`Ativo reutilizado: ${filename} -> ${existing.assetId}`)
    return existing.assetId
  }

  const asset = await client.assets.upload('image', createReadStream(filePath), {
    filename,
    source: {
      id: `fire-brigade-supplied-${existing.sha1hash}`,
      name: 'Ficheiro fornecido diretamente pelos Bombeiros Voluntários de Vila do Bispo',
    },
  })

  console.log(`Ativo carregado: ${filename} -> ${asset._id}`)
  return asset._id
}

function buildDocuments(logoAssetId: string, stationAssetId: string): SanityDocument[] {
  const logoAsset: ImageAssetReference = {_ref: logoAssetId, _type: 'reference'}
  const stationAsset: ImageAssetReference = {
    _ref: stationAssetId,
    _type: 'reference',
  }

  const serviceIds = {
    protection: 'service-protection-and-rescue',
    firefighting: 'service-firefighting',
    socialTransport: 'service-social-transport',
  }

  const categoryId = 'news-category-institutional'

  return [
    {
      _id: 'siteSettings',
      _type: 'siteSettings',
      officialName: 'Associação Humanitária dos Bombeiros Voluntários de Vila do Bispo',
      shortName: 'Bombeiros Voluntários de Vila do Bispo',
      institutionalDescription:
        'Associação sem fins lucrativos que detém e mantém em atividade o Corpo de Bombeiros Voluntários de Vila do Bispo, ao serviço da proteção e do socorro da comunidade.',
      logo: image(logoAsset, 'Emblema dos Bombeiros Voluntários de Vila do Bispo'),
      defaultSeo: {
        _type: 'seo',
        metaTitle: 'Bombeiros Voluntários de Vila do Bispo',
        metaDescription:
          'Associação Humanitária dos Bombeiros Voluntários de Vila do Bispo: informação institucional, serviços, notícias e contactos.',
        noIndex: false,
      },
    },
    {
      _id: 'homepage',
      _type: 'homepage',
      hero: {
        _type: 'object',
        headline: 'Desde 1982 ao serviço da comunidade',
        highlightedFragment: 'Desde 1982',
        description:
          'Proteção e socorro no concelho de Vila do Bispo, com proximidade à população.',
        image: image(stationAsset, 'Quartel dos Bombeiros Voluntários de Vila do Bispo'),
        recruitmentCta: {
          _type: 'callToAction',
          destinationType: 'internal',
          internalPath: '/recrutamento',
          label: 'Quero ser bombeiro',
          style: 'primary',
        },
        supportCta: {
          _type: 'callToAction',
          destinationType: 'internal',
          internalPath: '/socios-e-apoio',
          label: 'Sócios e apoio',
          style: 'secondary',
        },
      },
      mission: {
        _type: 'object',
        sectionLabel: 'A nossa missão',
        title: 'Proteger pessoas e bens, servir a comunidade',
        body: [
          paragraph(
            'homepage-mission-1',
            'A Associação mantém em atividade o Corpo de Bombeiros Voluntários de Vila do Bispo, cuja missão inclui a proteção e o socorro de pessoas e bens, o combate a incêndios e a participação nas ações de proteção civil.',
          ),
          paragraph(
            'homepage-mission-2',
            'Esta missão concretiza-se numa resposta de proximidade às necessidades da população e do território.',
          ),
        ],
      },
      featuredServices: [
        reference('homepage-service-protection', serviceIds.protection),
        reference('homepage-service-firefighting', serviceIds.firefighting),
        reference('homepage-service-social-transport', serviceIds.socialTransport),
      ],
      latestNews: {
        _type: 'object',
        itemCount: 3,
        sectionLabel: 'Atualidade',
        title: 'Notícias e atividades',
      },
      supportSection: {
        _type: 'object',
        sectionLabel: 'Participação',
        title: 'Sócios e apoio',
        description:
          'Conheça as formas de participação e apoio à Associação assim que a informação oficial estiver disponível.',
        cta: {
          _type: 'callToAction',
          destinationType: 'internal',
          internalPath: '/socios-e-apoio',
          label: 'Saber mais',
          style: 'primary',
        },
      },
      seo: {
        _type: 'seo',
        metaTitle: 'Bombeiros Voluntários de Vila do Bispo',
        metaDescription:
          'Informação institucional, serviços, notícias e contactos dos Bombeiros Voluntários de Vila do Bispo.',
        noIndex: false,
      },
    },
    {
      _id: 'institutional-page-association',
      _type: 'institutionalPage',
      title: 'Associação',
      introduction:
        'A Associação Humanitária dos Bombeiros Voluntários de Vila do Bispo foi constituída em 27 de maio de 1982.',
      featuredImage: image(
        stationAsset,
        'Quartel dos Bombeiros Voluntários de Vila do Bispo',
      ),
      body: [
        paragraph(
          'association-history-1',
          'Constituída em 27 de maio de 1982, a Associação Humanitária dos Bombeiros Voluntários de Vila do Bispo é uma pessoa coletiva sem fins lucrativos que detém e mantém em atividade o Corpo de Bombeiros Voluntários de Vila do Bispo.',
        ),
        paragraph(
          'association-history-2',
          'A sua finalidade principal é contribuir para a proteção de pessoas e bens e assegurar o apoio necessário à atividade do Corpo de Bombeiros, em serviço à comunidade.',
        ),
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'Associação | Bombeiros de Vila do Bispo',
        metaDescription:
          'Conheça a Associação Humanitária dos Bombeiros Voluntários de Vila do Bispo, constituída em 1982.',
        noIndex: false,
      },
    },
    {
      _id: 'institutional-page-fire-brigade',
      _type: 'institutionalPage',
      title: 'Corpo de Bombeiros',
      introduction:
        'O Corpo de Bombeiros Voluntários de Vila do Bispo assegura missões de proteção, socorro e apoio à população.',
      featuredImage: image(
        stationAsset,
        'Quartel dos Bombeiros Voluntários de Vila do Bispo',
      ),
      body: [
        paragraph(
          'fire-brigade-mission-1',
          'Entre as missões legalmente atribuídas aos corpos de bombeiros encontram-se a prevenção e o combate a incêndios, o socorro às populações, o socorro e transporte de acidentados e doentes e a participação noutras atividades de proteção civil.',
        ),
        paragraph(
          'fire-brigade-mission-2',
          'No concelho de Vila do Bispo, o Corpo de Bombeiros atua em articulação com as entidades de proteção civil e presta apoio de proximidade à comunidade.',
        ),
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'Corpo de Bombeiros | Vila do Bispo',
        metaDescription:
          'Conheça a missão do Corpo de Bombeiros Voluntários de Vila do Bispo na proteção e no socorro da população.',
        noIndex: false,
      },
    },
    {
      _id: 'contactInformation',
      _type: 'contactInformation',
      informationConfirmedForPublication: true,
      telephone: '282 639 285',
      emergencyWarning: 'Em caso de emergência, ligue 112.',
      seo: {
        _type: 'seo',
        metaTitle: 'Contactos | Bombeiros de Vila do Bispo',
        metaDescription:
          'Contacto geral dos Bombeiros Voluntários de Vila do Bispo. Em caso de emergência, ligue 112.',
        noIndex: false,
      },
    },
    {
      _id: serviceIds.protection,
      _type: 'service',
      title: 'Proteção e socorro',
      slug: {_type: 'slug', current: 'protecao-e-socorro'},
      summary:
        'Resposta de proximidade em missões de socorro às populações e proteção de pessoas e bens.',
      visualType: 'icon',
      icon: 'emergency',
      content: [
        paragraph(
          'service-protection-1',
          'O Corpo de Bombeiros participa em missões de socorro às populações e de proteção de pessoas e bens, no âmbito das atribuições dos corpos de bombeiros e do sistema de proteção civil.',
        ),
        paragraph(
          'service-protection-2',
          'A resposta é articulada com as entidades competentes de acordo com a natureza de cada ocorrência.',
        ),
      ],
      displayOrder: 10,
      seo: {
        _type: 'seo',
        metaTitle: 'Proteção e socorro | Bombeiros de Vila do Bispo',
        metaDescription:
          'Missões de proteção e socorro às populações dos Bombeiros Voluntários de Vila do Bispo.',
        noIndex: false,
      },
    },
    {
      _id: serviceIds.firefighting,
      _type: 'service',
      title: 'Combate a incêndios',
      slug: {_type: 'slug', current: 'combate-a-incendios'},
      summary:
        'Prevenção e combate a incêndios, incluindo a resposta a incêndios rurais no território.',
      visualType: 'icon',
      icon: 'prevention',
      content: [
        paragraph(
          'service-firefighting-1',
          'A prevenção e o combate a incêndios integram as missões dos corpos de bombeiros. No concelho, os meios são preparados para apoiar uma resposta eficaz e segura, incluindo em incêndios rurais.',
        ),
        paragraph(
          'service-firefighting-2',
          'Em 2026, a capacidade de resposta foi reforçada com a entrega de uma Viatura Florestal de Combate a Incêndios pelo Município de Vila do Bispo.',
        ),
      ],
      displayOrder: 20,
      seo: {
        _type: 'seo',
        metaTitle: 'Combate a incêndios | Bombeiros de Vila do Bispo',
        metaDescription:
          'Informação sobre a missão de combate a incêndios dos Bombeiros Voluntários de Vila do Bispo.',
        noIndex: false,
      },
    },
    {
      _id: serviceIds.socialTransport,
      _type: 'service',
      title: 'Transporte social',
      slug: {_type: 'slug', current: 'transporte-social'},
      summary:
        'Apoio ao transporte de munícipes abrangidos pelo protocolo celebrado com o Município de Vila do Bispo.',
      visualType: 'icon',
      icon: 'transport',
      content: [
        paragraph(
          'service-social-transport-1',
          'Os Bombeiros de Vila do Bispo asseguram transporte social ao abrigo de um protocolo de colaboração com o Município de Vila do Bispo.',
        ),
        paragraph(
          'service-social-transport-2',
          'O apoio abrange as pessoas e deslocações que cumpram as condições definidas pelo Município. Para conhecer os critérios aplicáveis, deve ser consultada a informação municipal em vigor.',
        ),
      ],
      displayOrder: 30,
      seo: {
        _type: 'seo',
        metaTitle: 'Transporte social | Bombeiros de Vila do Bispo',
        metaDescription:
          'Informação sobre o transporte social assegurado pelos Bombeiros de Vila do Bispo ao abrigo de protocolo municipal.',
        noIndex: false,
      },
    },
    {
      _id: 'person-emerson-gomes',
      _type: 'person',
      publicName: 'Emerson Gomes',
    },
    {
      _id: 'person-carlos-costa',
      _type: 'person',
      publicName: 'Carlos Costa',
    },
    {
      _id: 'governing-body-command',
      _type: 'governingBody',
      bodyType: 'command',
      title: 'Comando',
      roles: [
        {
          _key: 'command-commander',
          _type: 'governingRole',
          roleTitle: 'Comandante',
          person: reference('command-commander-person', 'person-emerson-gomes'),
        },
      ],
    },
    {
      _id: 'governing-body-direction',
      _type: 'governingBody',
      bodyType: 'governingBody',
      title: 'Direção',
      roles: [
        {
          _key: 'direction-president',
          _type: 'governingRole',
          roleTitle: 'Presidente da Direção',
          person: reference('direction-president-person', 'person-carlos-costa'),
        },
      ],
    },
    {
      _id: categoryId,
      _type: 'newsCategory',
      name: 'Notícias institucionais',
      slug: {_type: 'slug', current: 'noticias-institucionais'},
      description: 'Atualidade institucional e atividade pública da Associação e do Corpo de Bombeiros.',
    },
    {
      _id: 'news-article-vfci-2026',
      _type: 'newsArticle',
      title: 'Nova VFCI reforça meios de combate a incêndios rurais',
      slug: {
        _type: 'slug',
        current: 'nova-vfci-reforca-meios-combate-incendios-rurais',
      },
      excerpt:
        'O Município de Vila do Bispo entregou uma Viatura Florestal de Combate a Incêndios aos Bombeiros Voluntários.',
      publicationDate: '2026-05-30T12:00:00.000Z',
      categories: [reference('news-vfci-category', categoryId)],
      body: [
        paragraph(
          'news-vfci-1',
          'O Município de Vila do Bispo entregou aos Bombeiros Voluntários uma Viatura Florestal de Combate a Incêndios, destinada a reforçar a resposta a incêndios rurais e as operações de socorro e proteção civil.',
        ),
        paragraph(
          'news-vfci-2',
          'A cerimónia integrou o programa comemorativo do 44.º aniversário dos Bombeiros. Segundo o Município, Vila do Bispo foi o primeiro concelho do Algarve a concretizar uma entrega deste tipo no âmbito do programa Algarve 2030.',
        ),
        sourceParagraph('news-vfci-source', 'Município de Vila do Bispo', SOURCE_URLS.vfci),
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'Nova VFCI entregue aos Bombeiros de Vila do Bispo',
        metaDescription:
          'A nova Viatura Florestal de Combate a Incêndios reforça a resposta dos Bombeiros Voluntários de Vila do Bispo.',
        noIndex: false,
      },
    },
    {
      _id: 'news-article-regional-firefighter-day-2026',
      _type: 'newsArticle',
      title: 'Bombeiros de Vila do Bispo no Dia Regional do Bombeiro',
      slug: {
        _type: 'slug',
        current: 'dia-regional-do-bombeiro-algarve-2026',
      },
      excerpt:
        'O Corpo de Bombeiros Voluntários de Vila do Bispo participou nas comemorações regionais realizadas em Portimão.',
      publicationDate: '2026-05-03T12:00:00.000Z',
      categories: [reference('news-regional-day-category', categoryId)],
      body: [
        paragraph(
          'news-regional-day-1',
          'O Corpo de Bombeiros Voluntários de Vila do Bispo participou nas comemorações do Dia Regional do Bombeiro do Algarve, realizadas em Portimão no dia 3 de maio de 2026.',
        ),
        paragraph(
          'news-regional-day-2',
          'A representação de Vila do Bispo integrou 13 operacionais e três viaturas na exposição temática e no desfile operacional. Estes números referem-se exclusivamente à participação no evento e não ao efetivo ou à frota total da corporação.',
        ),
        sourceParagraph(
          'news-regional-day-source',
          'Município de Vila do Bispo',
          SOURCE_URLS.regionalDay,
        ),
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'Dia Regional do Bombeiro do Algarve 2026',
        metaDescription:
          'Participação dos Bombeiros Voluntários de Vila do Bispo nas comemorações regionais realizadas em Portimão.',
        noIndex: false,
      },
    },
    {
      _id: 'news-article-social-transport-2026',
      _type: 'newsArticle',
      title: 'Protocolo de transporte social passa a abranger mais munícipes',
      slug: {
        _type: 'slug',
        current: 'protocolo-transporte-social-mais-abrangente-2026',
      },
      excerpt:
        'Uma nova adenda ao protocolo com o Município alargou o apoio de transporte social assegurado pelos Bombeiros.',
      publicationDate: '2026-01-08T12:00:00.000Z',
      categories: [reference('news-social-transport-category', categoryId)],
      body: [
        paragraph(
          'news-social-transport-1',
          'A Associação e o Município de Vila do Bispo assinaram, em 8 de janeiro de 2026, uma segunda adenda ao protocolo de transporte social celebrado em 2013.',
        ),
        paragraph(
          'news-social-transport-2',
          'A alteração alargou o apoio a outras pessoas com necessidades específicas, além das situações já abrangidas. O acesso mantém-se sujeito às condições previstas no protocolo municipal.',
        ),
        sourceParagraph(
          'news-social-transport-source',
          'Município de Vila do Bispo',
          SOURCE_URLS.socialTransport,
        ),
      ],
      seo: {
        _type: 'seo',
        metaTitle: 'Protocolo de transporte social alargado em 2026',
        metaDescription:
          'A adenda ao protocolo municipal alarga o transporte social assegurado pelos Bombeiros de Vila do Bispo.',
        noIndex: false,
      },
    },
  ]
}

function withoutSystemFields(document: SanityDocument, draftId: string): SanityDocument {
  const {
    _createdAt: _ignoredCreatedAt,
    _rev: _ignoredRevision,
    _updatedAt: _ignoredUpdatedAt,
    ...content
  } = document
  void _ignoredCreatedAt
  void _ignoredRevision
  void _ignoredUpdatedAt
  const preservedContent =
    document._type === 'newsArticle' && Array.isArray(content.categories)
      ? {
          ...content,
          categories: [
            reference('preserved-test-category', 'news-category-institutional'),
          ],
        }
      : content

  return {...preservedContent, _id: draftId}
}

async function findTestContent() {
  const articles = await client.fetch<SanityDocument[]>(
    '*[_type == "newsArticle" && !(_id in path("drafts.**")) && title == $title]',
    {title: TEST_ARTICLE_TITLE},
  )

  if (articles.length > 1) {
    throw new Error(
      `Foram encontrados ${articles.length} artigos publicados com o título “${TEST_ARTICLE_TITLE}”. A despublicação automática foi interrompida.`,
    )
  }

  const article = articles[0]
  if (!article) return {article: null, category: null}

  const categoryReferences = Array.isArray(article.categories)
    ? article.categories
        .map((item) =>
          typeof item === 'object' && item && '_ref' in item
            ? String(item._ref)
            : null,
        )
        .filter((item): item is string => Boolean(item))
    : []

  const category = categoryReferences.length
    ? await client.fetch<SanityDocument | null>(
        '*[_type == "newsCategory" && !(_id in path("drafts.**")) && _id in $ids && lower(name) == "teste"][0]',
        {ids: categoryReferences},
      )
    : null

  if (category) {
    const otherReferences = await client.fetch<number>(
      'count(*[_type == "newsArticle" && !(_id in path("drafts.**")) && _id != $articleId && references($categoryId)])',
      {articleId: article._id, categoryId: category._id},
    )
    if (otherReferences > 0) return {article, category: null}
  }

  return {article, category}
}

async function run() {
  const config = client.config()
  if (
    config.projectId !== EXPECTED_PROJECT_ID ||
    config.dataset !== EXPECTED_DATASET
  ) {
    throw new Error(
      `Destino inesperado: ${config.projectId}/${config.dataset}. Esperado: ${EXPECTED_PROJECT_ID}/${EXPECTED_DATASET}.`,
    )
  }

  const logoAsset = await findImageAsset(logoPath)
  const stationAsset = await findImageAsset(stationPath)
  const testContent = await findTestContent()

  const placeholderAssetId = 'dry-run-image-asset'
  const proposedDocuments = buildDocuments(
    logoAsset.assetId ?? placeholderAssetId,
    stationAsset.assetId ?? placeholderAssetId,
  )
  const targetIds = proposedDocuments.map((document) => document._id)
  const existingIds = await client.fetch<string[]>(
    '*[_id in $ids || _id in $draftIds]._id',
    {ids: targetIds, draftIds: targetIds.map((id) => `drafts.${id}`)},
  )
  const existingBaseIds = new Set(existingIds.map((id) => id.replace(/^drafts\./, '')))
  const idsToCreate = targetIds.filter((id) => !existingBaseIds.has(id))
  const legacyPrivateIds = await client.fetch<string[]>(
    '*[_id in $ids]._id',
    {ids: [...LEGACY_PRIVATE_IDS]},
  )
  const homepageFeaturedServices = await client.fetch<
    Array<{_key?: string; _ref?: string; _type?: string}> | null
  >('*[_id == "homepage"][0].featuredServices')
  const migratedHomepageServices = homepageFeaturedServices?.map((item) => ({
    ...item,
    _ref: item._ref ? (LEGACY_ID_REPLACEMENTS[item._ref] ?? item._ref) : item._ref,
  }))
  const homepageNeedsReferenceMigration = Boolean(
    homepageFeaturedServices?.some(
      (item) => item._ref && LEGACY_ID_REPLACEMENTS[item._ref],
    ),
  )
  const invalidEmergencyCta = await client.fetch<boolean>(
    'defined(*[_id == "homepage" && hero.emergencyCta.phoneNumber == "112"][0])',
  )
  const preservedTestDraft = await client.fetch<SanityDocument | null>(
    '*[_type == "newsArticle" && _id in path("drafts.**") && title == $title][0]',
    {title: TEST_ARTICLE_TITLE},
  )
  const preservedTestDraftNeedsCategory = Boolean(
    preservedTestDraft &&
      (!Array.isArray(preservedTestDraft.categories) ||
        !preservedTestDraft.categories.some(
          (category) =>
            typeof category === 'object' &&
            category &&
            '_ref' in category &&
            category._ref === 'news-category-institutional',
        )),
  )

  console.log(`Destino confirmado: ${EXPECTED_PROJECT_ID}/${EXPECTED_DATASET}`)
  console.log(`Modo: ${isApply ? 'APLICAR' : 'SIMULAÇÃO'}`)
  console.log(`Documentos propostos: ${proposedDocuments.length}`)
  console.log(`Documentos novos: ${idsToCreate.length}`)
  console.log(`Documentos já existentes e preservados: ${targetIds.length - idsToCreate.length}`)
  console.log(`Documentos privados legados a remover: ${legacyPrivateIds.length}`)
  console.log(
    `Referências do homepage a migrar: ${homepageNeedsReferenceMigration ? 'sim' : 'não'}`,
  )
  console.log(`CTA 112 inválido no CMS a remover: ${invalidEmergencyCta ? 'sim' : 'não'}`)
  console.log(
    `Categoria do rascunho de teste a corrigir: ${preservedTestDraftNeedsCategory ? 'sim' : 'não'}`,
  )
  console.log(
    `Logótipo: ${logoAsset.assetId ? `reutilizar ${logoAsset.assetId}` : 'carregar uma vez'}`,
  )
  console.log(
    `Fotografia do quartel: ${stationAsset.assetId ? `reutilizar ${stationAsset.assetId}` : 'carregar uma vez'}`,
  )
  console.log(
    `Artigo de teste publicado: ${testContent.article ? testContent.article._id : 'não encontrado'}`,
  )
  console.log(
    `Categoria de teste publicável sem outras referências: ${testContent.category ? testContent.category._id : 'não encontrada/não elegível'}`,
  )

  if (!isApply) {
    console.log('Nenhuma alteração remota efetuada. Use --apply depois de rever este resumo.')
    return
  }

  const logoAssetId = await ensureImageAsset(logoPath, 'Logo_bombeiros.jpeg')
  const stationAssetId = await ensureImageAsset(stationPath, 'Foto_Quartel.jpg')
  const documents = buildDocuments(logoAssetId, stationAssetId)
  let createTransaction = client.transaction()

  for (const document of documents) {
    createTransaction = createTransaction.createIfNotExists(document)
  }

  for (const publishedTestDocument of [testContent.article, testContent.category]) {
    if (!publishedTestDocument) continue
    const draftId = `drafts.${publishedTestDocument._id}`
    createTransaction = createTransaction
      .createIfNotExists(withoutSystemFields(publishedTestDocument, draftId))
      .delete(publishedTestDocument._id)
  }

  const createResult = await createTransaction.commit({visibility: 'sync'})
  console.log(`Transação de criação concluída: ${createResult.transactionId}`)

  if (homepageNeedsReferenceMigration && migratedHomepageServices) {
    await client
      .patch('homepage')
      .set({featuredServices: migratedHomepageServices})
      .commit({visibility: 'sync'})
    console.log('Referências do homepage migradas para IDs públicos.')
  }

  if (invalidEmergencyCta) {
    await client
      .patch('homepage')
      .unset(['hero.emergencyCta'])
      .commit({visibility: 'sync'})
    console.log('CTA CMS inválido removido; o frontend mantém o CTA 112 de emergência.')
  }

  if (preservedTestDraftNeedsCategory && preservedTestDraft) {
    await client
      .patch(preservedTestDraft._id)
      .set({
        categories: [
          reference('preserved-test-category', 'news-category-institutional'),
        ],
      })
      .commit({visibility: 'sync'})
    console.log('Rascunho de teste ligado à categoria institucional publicada.')
  }

  const legacyDependentIds = legacyPrivateIds.filter((id) =>
    LEGACY_DEPENDENT_IDS.includes(id as (typeof LEGACY_DEPENDENT_IDS)[number]),
  )
  if (legacyDependentIds.length) {
    let dependentDelete = client.transaction()
    for (const id of legacyDependentIds) dependentDelete = dependentDelete.delete(id)
    await dependentDelete.commit({visibility: 'sync'})
  }

  const remainingLegacyIds = legacyPrivateIds.filter(
    (id) => !legacyDependentIds.includes(id),
  )
  if (remainingLegacyIds.length) {
    let remainingDelete = client.transaction()
    for (const id of remainingLegacyIds) remainingDelete = remainingDelete.delete(id)
    await remainingDelete.commit({visibility: 'sync'})
  }

  console.log(`Documentos privados legados removidos: ${legacyPrivateIds.length}`)
  console.log(`Documentos criados quando ausentes: ${documents.length}`)
  console.log(
    `Conteúdo de teste despublicado: ${[testContent.article, testContent.category].filter(Boolean).length}`,
  )
}

run().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
