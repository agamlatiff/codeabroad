const IPA_SYMBOL_REGEX = /[ˈˌəɪʊɛæɔɑʃθðŋʒʌɜː]/

/**
 * Detects whether a reading or phonetic guide string is formatted in raw IPA
 * (wrapped in slashes `/.../` or containing standard IPA symbols).
 * Returns false for standard Japanese romaji/kana so romaji stays visible by default.
 */
export const isIpaText = (value?: string | null): boolean => {
  const trimmed = value?.trim()
  if (!trimmed) return false
  if (/^\/.*\/$/.test(trimmed)) return true
  return IPA_SYMBOL_REGEX.test(trimmed)
}
