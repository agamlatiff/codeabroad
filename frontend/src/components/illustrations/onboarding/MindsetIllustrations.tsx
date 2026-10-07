import type { IllustrationProps } from '../types'

// Mindset Track 1: Specialist Mindset (Deep Laser Focus)
export const SpecialistMindsetIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      <circle cx="120" cy="80" r="54" stroke="#EEF2FF" strokeWidth="8" />
      <circle cx="120" cy="80" r="42" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="120" cy="80" r="26" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2.5" />
      <circle cx="120" cy="80" r="12" fill="#4F46E5" />
      <line x1="120" y1="16" x2="120" y2="44" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="120" y1="116" x2="120" y2="144" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="56" y1="80" x2="84" y2="80" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="156" y1="80" x2="184" y2="80" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M72 68 L60 80 L72 92" stroke="#4338CA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M168 68 L180 80 L168 92" stroke="#4338CA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
)

// Mindset Track 2: Generalist Mindset (Cross-Functional Ecosystem)
export const GeneralistMindsetIllustration = ({ className = 'w-full h-full max-h-44 object-contain' }: IllustrationProps) => (
  <div className="w-full h-full flex items-center justify-center p-3">
    <svg viewBox="0 0 240 160" className={className} fill="none">
      <ellipse cx="120" cy="80" rx="66" ry="24" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="4 4" transform="rotate(-20 120 80)" />
      <ellipse cx="120" cy="80" rx="66" ry="24" stroke="#C7D2FE" strokeWidth="2" strokeDasharray="4 4" transform="rotate(40 120 80)" />
      <circle cx="120" cy="80" r="30" fill="#312E81" stroke="#4F46E5" strokeWidth="2.5" />
      <ellipse cx="120" cy="80" rx="14" ry="29" stroke="#818CF8" strokeWidth="1.5" />
      <line x1="91" y1="80" x2="149" y2="80" stroke="#818CF8" strokeWidth="1.5" />
      <circle cx="62" cy="52" r="10" fill="#4F46E5" />
      <circle cx="178" cy="58" r="10" fill="#10B981" />
      <circle cx="120" cy="132" r="10" fill="#F59E0B" />
      <line x1="71" y1="59" x2="98" y2="70" stroke="#818CF8" strokeWidth="2" />
      <line x1="169" y1="64" x2="143" y2="73" stroke="#818CF8" strokeWidth="2" />
      <line x1="120" y1="122" x2="120" y2="110" stroke="#818CF8" strokeWidth="2" />
    </svg>
  </div>
)
