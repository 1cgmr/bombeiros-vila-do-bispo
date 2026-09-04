export const singletonTypes = new Set([
  'siteSettings',
  'homepage',
  'trainingInformation',
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
  association: 'institutional-page-association',
  fireBrigade: 'institutional-page-fire-brigade',
  privacyPolicy: 'institutional-page-privacy-policy',
  accessibilityStatement: 'institutional-page-accessibility-statement',
} as const
