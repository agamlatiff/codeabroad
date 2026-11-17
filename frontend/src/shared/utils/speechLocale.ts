/**
 * Maps backend language ISO codes (e.g. 'ja', 'en-gb', 'en-us', 'de', 'zh', 'fr')
 * to BCP-47 Web Speech API synthesis / recognition locales.
 */
export const resolveSpeechLocale = (languageCode?: string): string => {
  const normalized = languageCode?.trim().toLowerCase()
  switch (normalized) {
    case 'ja':
    case 'ja-jp':
      return 'ja-JP'
    case 'en-gb':
    case 'en-uk':
      return 'en-GB'
    case 'en':
    case 'en-us':
      return 'en-US'
    case 'de':
    case 'de-de':
      return 'de-DE'
    case 'zh':
    case 'zh-cn':
    case 'cmn':
      return 'zh-CN'
    case 'fr':
    case 'fr-fr':
      return 'fr-FR'
    case 'ko':
    case 'ko-kr':
      return 'ko-KR'
    case 'es':
    case 'es-es':
      return 'es-ES'
    case 'id':
    case 'id-id':
      return 'id-ID'
    default:
      return 'en-US'
  }
}
