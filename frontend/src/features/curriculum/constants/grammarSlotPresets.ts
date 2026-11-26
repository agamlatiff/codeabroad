import type { GrammarRole } from '@/features/curriculum/types/curriculum'

export interface SlotChipOption {
  jp: string
  reading: string
  meaning: string
}

export interface GrammarSlotPreset {
  promptHint: string
  slot1Label: string
  slot1Role: GrammarRole
  slot1Options: SlotChipOption[]
  middleFixed?: {
    jp: string
    reading: string
    label: string
    role: GrammarRole
  }
  slot2Label: string
  slot2Role: GrammarRole
  slot2Options: SlotChipOption[]
  endingFixed?: {
    jp: string
    reading: string
    label: string
    role: GrammarRole
  }
  buildTranslation: (opt1: SlotChipOption, opt2: SlotChipOption) => string
}

const FRIENDLY_SLOT_TEXT_MAP: Array<[RegExp, string]> = [
  [/\bTopik\s*\/\s*Subjek\b/gi, 'Yang Dibahas'],
  [/\bSubjek\s*\/\s*Topik\b/gi, 'Yang Dibahas'],
  [/\bPredikat\b/gi, 'Keterangan'],
  [/\bObjek\b/gi, 'Objek / Benda'],
  [/\bKata Benda\b/gi, 'Nama Benda'],
  [/\bKata Kerja\b/gi, 'Kegiatan / Aksi'],
  [/\bKata Sifat\b/gi, 'Sifat / Keadaan'],
]

/**
 * Converts academic linguistic labels into plain Indonesian labels that total beginners
 * can grasp immediately without prior grammar terminology.
 */
export function humanizeFormulaSlotText(raw: string): string {
  let result = raw
  for (const [pattern, replacement] of FRIENDLY_SLOT_TEXT_MAP) {
    result = result.replace(pattern, replacement)
  }
  return result
}

/**
 * Curated mix-and-match slot presets for flagship N5 grammar points where every
 * combination produces 100% natural, grammatically accurate Japanese & Indonesian.
 */
export const GRAMMAR_SLOT_PRESETS: Record<string, GrammarSlotPreset> = {
  'GP-JA-N5-001': {
    promptHint: 'Klik kata di bawah untuk merasakan sendiri cara kerja は (wa):',
    slot1Label: '1. Pilih Orangnya',
    slot1Role: 'topic',
    slot1Options: [
      { jp: 'わたし', reading: 'watashi', meaning: 'Saya' },
      { jp: 'たなかさん', reading: 'Tanaka-san', meaning: 'Tanaka' },
      { jp: 'ともだち', reading: 'tomodachi', meaning: 'Teman saya' },
    ],
    middleFixed: {
      jp: 'は',
      reading: 'wa',
      label: 'Penanda topik',
      role: 'particle',
    },
    slot2Label: '2. Pilih Pekerjaan / Perannya',
    slot2Role: 'predicate',
    slot2Options: [
      { jp: 'がくせい', reading: 'gakusei', meaning: 'pelajar' },
      { jp: 'せんせい', reading: 'sensei', meaning: 'guru' },
      { jp: 'かいしゃいん', reading: 'kaishain', meaning: 'karyawan' },
    ],
    endingFixed: {
      jp: 'です',
      reading: 'desu',
      label: 'Akhiran sopan',
      role: 'ending',
    },
    buildTranslation: (o1, o2) => `${o1.meaning} adalah ${o2.meaning}.`,
  },
  'GP-JA-N5-003': {
    promptHint: 'Coba ganti pemilik dan bendanya untuk melihat fungsi の (no):',
    slot1Label: '1. Pilih Pemiliknya',
    slot1Role: 'topic',
    slot1Options: [
      { jp: 'わたし', reading: 'watashi', meaning: 'saya' },
      { jp: 'せんせい', reading: 'sensei', meaning: 'guru' },
      { jp: 'ともだち', reading: 'tomodachi', meaning: 'teman saya' },
    ],
    middleFixed: {
      jp: 'の',
      reading: 'no',
      label: 'Penghubung milik',
      role: 'particle',
    },
    slot2Label: '2. Pilih Bendanya',
    slot2Role: 'predicate',
    slot2Options: [
      { jp: 'ほん', reading: 'hon', meaning: 'Buku' },
      { jp: 'かばん', reading: 'kaban', meaning: 'Tas' },
      { jp: 'くるま', reading: 'kuruma', meaning: 'Mobil' },
    ],
    endingFixed: {
      jp: 'です',
      reading: 'desu',
      label: 'Akhiran sopan',
      role: 'ending',
    },
    buildTranslation: (o1, o2) => `Ini adalah ${o2.meaning.toLowerCase()} milik ${o1.meaning}.`,
  },
  'GP-JA-N5-004': {
    promptHint: 'Coba ganti minuman dan kegiatannya untuk melihat fungsi を (o):',
    slot1Label: '1. Pilih Minumannya',
    slot1Role: 'object',
    slot1Options: [
      { jp: 'みず', reading: 'mizu', meaning: 'air' },
      { jp: 'コーヒー', reading: 'koohii', meaning: 'kopi' },
      { jp: 'おちゃ', reading: 'ocha', meaning: 'teh' },
    ],
    middleFixed: {
      jp: 'を',
      reading: 'o',
      label: 'Penanda objek',
      role: 'particle',
    },
    slot2Label: '2. Pilih Kegiatannya',
    slot2Role: 'predicate',
    slot2Options: [
      { jp: 'のみます', reading: 'nomimasu', meaning: 'Minum' },
      { jp: 'かいます', reading: 'kaimasu', meaning: 'Membeli' },
      { jp: 'つくります', reading: 'tsukurimasu', meaning: 'Membuat' },
    ],
    buildTranslation: (o1, o2) => `${o2.meaning} ${o1.meaning}.`,
  },
  'GP-JA-N5-005': {
    promptHint: 'Coba ganti tempat tujuan dan arahnya bersama に (ni):',
    slot1Label: '1. Pilih Tempat Tujuan',
    slot1Role: 'modifier',
    slot1Options: [
      { jp: 'がっこう', reading: 'gakkou', meaning: 'sekolah' },
      { jp: 'えき', reading: 'eki', meaning: 'stasiun' },
      { jp: 'にほん', reading: 'Nihon', meaning: 'Jepang' },
    ],
    middleFixed: {
      jp: 'に',
      reading: 'ni',
      label: 'Penanda tujuan',
      role: 'particle',
    },
    slot2Label: '2. Pilih Arah (Pergi / Datang / Pulang)',
    slot2Role: 'predicate',
    slot2Options: [
      { jp: 'いきます', reading: 'ikimasu', meaning: 'Pergi ke' },
      { jp: 'きます', reading: 'kimasu', meaning: 'Datang ke' },
      { jp: 'かえります', reading: 'kaerimasu', meaning: 'Pulang ke' },
    ],
    buildTranslation: (o1, o2) => `${o2.meaning} ${o1.meaning}.`,
  },
  'GP-JA-N5-007': {
    promptHint: 'Coba ganti tempat dan kegiatannya bersama で (de):',
    slot1Label: '1. Pilih Tempat Kegiatan',
    slot1Role: 'modifier',
    slot1Options: [
      { jp: 'カフェ', reading: 'kafe', meaning: 'kafe' },
      { jp: 'としょかん', reading: 'toshokan', meaning: 'perpustakaan' },
      { jp: 'へや', reading: 'heya', meaning: 'kamar' },
    ],
    middleFixed: {
      jp: 'で',
      reading: 'de',
      label: 'Di (lokasi aksi)',
      role: 'particle',
    },
    slot2Label: '2. Pilih Kegiatannya',
    slot2Role: 'predicate',
    slot2Options: [
      { jp: 'べんきょうします', reading: 'benkyou shimasu', meaning: 'Belajar' },
      { jp: 'はたらきます', reading: 'hatarakimasu', meaning: 'Bekerja' },
      { jp: 'やすみます', reading: 'yasumimasu', meaning: 'Beristirahat' },
    ],
    buildTranslation: (o1, o2) => `${o2.meaning} di ${o1.meaning}.`,
  },
}
