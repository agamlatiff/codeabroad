import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'

interface MarqueeItem {
  code: string
  greeting: string
  phonetic: string
  lang: string
}

const MARQUEE_GREETINGS: ReadonlyArray<MarqueeItem> = [
  { code: 'ja', greeting: 'おはようございます', phonetic: 'Ohayou gozaimasu', lang: 'Jepang' },
  { code: 'en-gb', greeting: 'Good morning', phonetic: 'IELTS Track', lang: 'Inggris UK' },
  { code: 'de', greeting: 'Guten Morgen', phonetic: 'Goethe Track', lang: 'Jerman' },
  { code: 'zh', greeting: '你好', phonetic: 'Nǐ hǎo', lang: 'Mandarin' },
  { code: 'fr', greeting: 'Bonjour', phonetic: 'DELF Track', lang: 'Prancis' },
  { code: 'en-us', greeting: 'Nice to meet you', phonetic: 'TOEFL Track', lang: 'Inggris US' },
  { code: 'ja', greeting: 'よろしくお願いします', phonetic: 'Yoroshiku', lang: 'Jepang' },
  { code: 'de', greeting: 'Vielen Dank', phonetic: 'Terima kasih', lang: 'Jerman' },
  { code: 'zh', greeting: '谢谢', phonetic: 'Xièxie', lang: 'Mandarin' },
  { code: 'fr', greeting: 'Merci beaucoup', phonetic: 'Terima kasih', lang: 'Prancis' },
]

/**
 * Full-width subtle infinite marquee reinforcing Merantalk's multi-language identity.
 */
export const LandingGreetingMarquee = () => {
  const repeated = [...MARQUEE_GREETINGS, ...MARQUEE_GREETINGS]

  return (
    <div
      aria-label="Sapaan lintas bahasa di Merantalk"
      className="group border-y border-slate-200/80 bg-white py-3.5 overflow-hidden select-none"
    >
      <div className="flex w-max items-center gap-6 animate-landing-marquee">
        {repeated.map((item, idx) => (
          <div
            key={`${item.code}-${idx}`}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FAFAF9] border border-slate-200/80 shrink-0"
          >
            <div className="w-6 h-4 rounded-sm overflow-hidden border border-slate-200 shrink-0">
              <LanguageFlagIllustration
                code={item.code}
                compact
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-brand font-black text-xs sm:text-sm text-slate-800">
              {item.greeting}
            </span>
            <span className="text-[11px] font-mono text-slate-400">· {item.phonetic}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
