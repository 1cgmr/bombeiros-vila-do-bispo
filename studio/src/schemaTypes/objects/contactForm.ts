import {defineField, defineType} from 'sanity'

type ContactFormParent = {
  enabled?: boolean
  phoneVisible?: boolean
  subjectVisible?: boolean
}

const isEnabled = (parent: unknown) =>
  (parent as ContactFormParent | undefined)?.enabled === true

const isVisible = (parent: unknown, field: 'phone' | 'subject') => {
  const value = parent as ContactFormParent | undefined
  return field === 'phone'
    ? value?.phoneVisible !== false
    : value?.subjectVisible !== false
}

export const contactForm = defineType({
  name: 'contactForm',
  title: 'Formulário de contacto',
  type: 'object',
  initialValue: {
    enabled: false,
    nameLabel: 'Nome',
    emailLabel: 'Email',
    phoneLabel: 'Telefone',
    phoneVisible: true,
    phoneRequired: false,
    subjectLabel: 'Assunto',
    subjectVisible: true,
    subjectRequired: false,
    messageLabel: 'Mensagem',
    submitButtonLabel: 'Enviar pedido',
    successMessage: 'A sua mensagem foi enviada com sucesso.',
    errorMessage:
      'Não foi possível enviar a mensagem. Tente novamente mais tarde.',
  },
  fields: [
    defineField({
      name: 'enabled',
      title: 'Formulário ativo',
      type: 'boolean',
      description:
        'Ative apenas depois de confirmar o destinatário, o aviso de privacidade e a configuração do serviço de email.',
    }),
    defineField({
      name: 'heading',
      title: 'Título da secção',
      type: 'string',
      validation: (rule) =>
        rule.max(120).custom((value, context) =>
          isEnabled(context.parent) && !value
            ? 'Indique o título da secção antes de ativar o formulário.'
            : true,
        ),
    }),
    defineField({
      name: 'introduction',
      title: 'Introdução',
      type: 'portableText',
    }),
    defineField({
      name: 'privacyNotice',
      title: 'Aviso de privacidade',
      type: 'portableText',
      description:
        'Utilize apenas texto aprovado oficialmente. Não invente informação jurídica.',
      validation: (rule) =>
        rule.custom((value, context) =>
          isEnabled(context.parent) && (!Array.isArray(value) || !value.length)
            ? 'Introduza o aviso de privacidade aprovado antes de ativar o formulário.'
            : true,
        ),
    }),
    defineField({
      name: 'recipientEmail',
      title: 'Email destinatário',
      type: 'string',
      description:
        'Este endereço recebe as mensagens. Não é enviado pelo browser, mas pertence ao dataset público do Sanity.',
      validation: (rule) =>
        rule.email().custom((value, context) =>
          isEnabled(context.parent) && !value
            ? 'Indique o email destinatário antes de ativar o formulário.'
            : true,
        ),
    }),
    defineField({
      name: 'emailSubjectPrefix',
      title: 'Prefixo do assunto do email',
      type: 'string',
      description: 'Exemplo: [Website - Recrutamento]',
      validation: (rule) =>
        rule.max(100).custom((value, context) => {
          if (isEnabled(context.parent) && !value)
            return 'Indique o prefixo do assunto antes de ativar o formulário.'
          return typeof value === 'string' && /[\r\n]/.test(value)
            ? 'O prefixo não pode conter quebras de linha.'
            : true
        }),
    }),
    defineField({
      name: 'submitButtonLabel',
      title: 'Texto do botão de envio',
      type: 'string',
      validation: (rule) =>
        rule.max(60).custom((value, context) =>
          isEnabled(context.parent) && !value
            ? 'Indique o texto do botão antes de ativar o formulário.'
            : true,
        ),
    }),
    defineField({
      name: 'successMessage',
      title: 'Mensagem de sucesso',
      type: 'text',
      rows: 2,
      validation: (rule) =>
        rule.max(300).custom((value, context) =>
          isEnabled(context.parent) && !value
            ? 'Indique a mensagem de sucesso antes de ativar o formulário.'
            : true,
        ),
    }),
    defineField({
      name: 'errorMessage',
      title: 'Mensagem de erro',
      type: 'text',
      rows: 2,
      validation: (rule) =>
        rule.max(300).custom((value, context) =>
          isEnabled(context.parent) && !value
            ? 'Indique a mensagem de erro antes de ativar o formulário.'
            : true,
        ),
    }),
    defineField({
      name: 'nameLabel',
      title: 'Etiqueta do nome',
      type: 'string',
      validation: (rule) =>
        rule.max(80).custom((value, context) =>
          isEnabled(context.parent) && !value
            ? 'Indique a etiqueta do nome.'
            : true,
        ),
    }),
    defineField({
      name: 'emailLabel',
      title: 'Etiqueta do email',
      type: 'string',
      validation: (rule) =>
        rule.max(80).custom((value, context) =>
          isEnabled(context.parent) && !value
            ? 'Indique a etiqueta do email.'
            : true,
        ),
    }),
    defineField({
      name: 'phoneVisible',
      title: 'Mostrar telefone',
      type: 'boolean',
    }),
    defineField({
      name: 'phoneRequired',
      title: 'Telefone obrigatório',
      type: 'boolean',
      validation: (rule) =>
        rule.custom((value, context) =>
          value === true && !isVisible(context.parent, 'phone')
            ? 'Um campo oculto não pode ser obrigatório.'
            : true,
        ),
    }),
    defineField({
      name: 'phoneLabel',
      title: 'Etiqueta do telefone',
      type: 'string',
      hidden: ({parent}) => !isVisible(parent, 'phone'),
      validation: (rule) =>
        rule.max(80).custom((value, context) =>
          isEnabled(context.parent) &&
          isVisible(context.parent, 'phone') &&
          !value
            ? 'Indique a etiqueta do telefone.'
            : true,
        ),
    }),
    defineField({
      name: 'subjectVisible',
      title: 'Mostrar assunto',
      type: 'boolean',
    }),
    defineField({
      name: 'subjectRequired',
      title: 'Assunto obrigatório',
      type: 'boolean',
      validation: (rule) =>
        rule.custom((value, context) =>
          value === true && !isVisible(context.parent, 'subject')
            ? 'Um campo oculto não pode ser obrigatório.'
            : true,
        ),
    }),
    defineField({
      name: 'subjectLabel',
      title: 'Etiqueta do assunto',
      type: 'string',
      hidden: ({parent}) => !isVisible(parent, 'subject'),
      validation: (rule) =>
        rule.max(80).custom((value, context) =>
          isEnabled(context.parent) &&
          isVisible(context.parent, 'subject') &&
          !value
            ? 'Indique a etiqueta do assunto.'
            : true,
        ),
    }),
    defineField({
      name: 'messageLabel',
      title: 'Etiqueta da mensagem',
      type: 'string',
      validation: (rule) =>
        rule.max(80).custom((value, context) =>
          isEnabled(context.parent) && !value
            ? 'Indique a etiqueta da mensagem.'
            : true,
        ),
    }),
  ],
  preview: {
    select: {enabled: 'enabled', heading: 'heading'},
    prepare: ({enabled, heading}) => ({
      title: heading || 'Formulário de contacto',
      subtitle: enabled ? 'Ativo' : 'Inativo',
    }),
  },
})
