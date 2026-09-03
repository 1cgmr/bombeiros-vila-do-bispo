export const singletonTypes = new Set([
  'siteSettings',
  'homepage',
  'recruitmentInformation',
  'membershipInformation',
  'donationInformation',
  'contactInformation',
])

export const protectedDocumentTypes = new Set([
  ...singletonTypes,
  'institutionalPage',
])

export const singletonActions = new Set([
  'publish',
  'discardChanges',
  'restore',
])

export const institutionalPageIds = {
  association: 'institutionalPage.association',
  fireBrigade: 'institutionalPage.fireBrigade',
  privacyPolicy: 'institutionalPage.privacyPolicy',
  accessibilityStatement: 'institutionalPage.accessibilityStatement',
} as const
