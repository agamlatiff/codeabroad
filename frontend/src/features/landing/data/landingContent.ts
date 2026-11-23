export type DemoLanguageCode = 'ja' | 'en-gb' | 'de' | 'zh' | 'fr'

export interface DemoPhraseCard {
  id: string
  nativeText: string
  phonetic: string
  meaning: string
  contextTag: string
}

export interface DemoQuizQuestion {
  id: string
  prompt: string
  sampleText: string
  hint: string
  options: Array<{ id: string; label: string; sub?: string }>
  correctOptionId: string
  explanation: string
}

export interface LandingLanguageDemoPack {
  code: DemoLanguageCode
  label: string
  speechLocale: string
  examLabel: string
  phraseSubtitle: string
  phrases: ReadonlyArray<DemoPhraseCard>
  questions: ReadonlyArray<DemoQuizQuestion>
}

export interface LandingFeatureItem {
  id: string
  badge: string
  title: string
  description: string
  href: string
  ctaLabel: string
  accent: 'blue' | 'emerald' | 'amber' | 'sky'
  isAccountOnly?: boolean
}

export interface GuestVsAccountRow {
  feature: string
  guestAccess: string
  accountAccess: string
  accountAdvantage?: boolean
}

export const HERO_TRUST_BADGES = [
  '6 Jalur Bahasa Global',
  'Tanpa Daftar Langsung Coba',
  'Standar JLPT, IELTS, Goethe, HSK & DELF',
] as const

export const LANDING_DEMO_PACKS: ReadonlyArray<LandingLanguageDemoPack> = [
  {
    code: 'ja',
    label: 'Jepang',
    speechLocale: 'ja-JP',
    examLabel: 'JLPT N5 – N1',
    phraseSubtitle: 'Ungkapan wajib hari pertama kerja & kehidupan di Jepang',
    phrases: [
      {
        id: 'ja-ohayou',
        nativeText: 'おはようございます',
        phonetic: 'Ohayou gozaimasu',
        meaning: 'Selamat pagi (sopan di kantor)',
        contextTag: 'Sapaan Kerja',
      },
      {
        id: 'ja-sumimasen',
        nativeText: 'すみません',
        phonetic: 'Sumimasen',
        meaning: 'Permisi / Maaf (serbaguna)',
        contextTag: 'Etika Harian',
      },
      {
        id: 'ja-arigatou',
        nativeText: 'ありがとうございます',
        phonetic: 'Arigatou gozaimasu',
        meaning: 'Terima kasih banyak',
        contextTag: 'Sopan Standar',
      },
      {
        id: 'ja-yoroshiku',
        nativeText: 'よろしくお願いします',
        phonetic: 'Yoroshiku onegaishimasu',
        meaning: 'Mohon bantuannya / Salam kerja sama',
        contextTag: 'Perkenalan',
      },
    ],
    questions: [
      {
        id: 'quiz-ja-kana-a',
        prompt: 'Manakah huruf Hiragana yang dibaca "a" (seperti pada あした / besok)?',
        sampleText: 'あした (a-shi-ta)',
        hint: 'Vokal pembuka pertama dalam deret Hiragana',
        options: [
          { id: 'opt-ja-a', label: 'あ', sub: 'a' },
          { id: 'opt-ja-i', label: 'い', sub: 'i' },
          { id: 'opt-ja-ka', label: 'か', sub: 'ka' },
          { id: 'opt-ja-sa', label: 'さ', sub: 'sa' },
        ],
        correctOptionId: 'opt-ja-a',
        explanation: 'Benar! あ adalah huruf vokal pertama dalam Hiragana yang dibaca "a".',
      },
      {
        id: 'quiz-ja-greeting',
        prompt:
          'Saat baru masuk kantor di Jepang pukul 08.30 pagi, sapaan sopan mana yang paling tepat?',
        sampleText: 'Situasi: Menyambut rekan & atasan di pagi hari',
        hint: 'Gunakan bentuk sopan (akhiran -gozaimasu)',
        options: [
          { id: 'opt-ja-ohayou', label: 'おはようございます', sub: 'Ohayou gozaimasu' },
          { id: 'opt-ja-konbanwa', label: 'こんばんは', sub: 'Konbanwa' },
          { id: 'opt-ja-sayonara', label: 'さようなら', sub: 'Sayounara' },
          { id: 'opt-ja-oyasumi', label: 'おやすみなさい', sub: 'Oyasuminasai' },
        ],
        correctOptionId: 'opt-ja-ohayou',
        explanation:
          'Tepat! "Ohayou gozaimasu" adalah sapaan pagi standar profesional di lingkungan kerja Jepang.',
      },
    ],
  },
  {
    code: 'en-gb',
    label: 'Inggris',
    speechLocale: 'en-GB',
    examLabel: 'IELTS / TOEFL',
    phraseSubtitle: 'Ungkapan profesional untuk interview, rapat & studi internasional',
    phrases: [
      {
        id: 'en-nice-to-meet',
        nativeText: 'Nice to meet you',
        phonetic: '/naɪs tuː miːt juː/',
        meaning: 'Senang bertemu dengan Anda',
        contextTag: 'Perkenalan',
      },
      {
        id: 'en-repeat',
        nativeText: 'Could you repeat that, please?',
        phonetic: '/kʊd juː rɪˈpiːt ðæt pliːz/',
        meaning: 'Bisakah Anda mengulanginya?',
        contextTag: 'Rapat & Kelas',
      },
      {
        id: 'en-schedule',
        nativeText: "I'd like to schedule a meeting",
        phonetic: '/aɪd laɪk tuː ˈʃedjuːl ə ˈmiːtɪŋ/',
        meaning: 'Saya ingin menjadwalkan rapat',
        contextTag: 'Kantor Global',
      },
      {
        id: 'en-assistance',
        nativeText: 'Thank you for your assistance',
        phonetic: '/θæŋk juː fɔːr jɔːr əˈsɪstəns/',
        meaning: 'Terima kasih atas bantuannya',
        contextTag: 'Profesional',
      },
    ],
    questions: [
      {
        id: 'quiz-en-repeat',
        prompt:
          'Saat wawancara kerja atau rapat daring kurang terdengar jelas, kalimat sopan mana yang terbaik?',
        sampleText: 'Situasi: Meminta lawan bicara mengulangi informasi',
        hint: 'Gunakan bentuk permintaan sopan "Could you..."',
        options: [
          { id: 'opt-en-repeat', label: 'Could you repeat that, please?', sub: 'Permintaan sopan' },
          { id: 'opt-en-now', label: 'Say it again now.', sub: 'Terlalu memerintah' },
          { id: 'opt-en-mean', label: 'What did you mean?', sub: 'Menanyakan maksud' },
          { id: 'opt-en-loud', label: 'Speak louder please.', sub: 'Meminta suara keras' },
        ],
        correctOptionId: 'opt-en-repeat',
        explanation:
          'Tepat! "Could you repeat that, please?" terdengar sopan dan profesional di rapat maupun interview.',
      },
      {
        id: 'quiz-en-thanks',
        prompt:
          'Ungkapan mana yang paling profesional untuk berterima kasih setelah rekan kerja membantu tugasmu?',
        sampleText: 'Situasi: Apresiasi setelah menerima bantuan kerja',
        hint: 'Pilih ungkapan terima kasih berstandar bisnis',
        options: [
          { id: 'opt-en-thanks', label: 'Thank you for your assistance', sub: 'Formal & sopan' },
          { id: 'opt-en-bye', label: 'See you tomorrow', sub: 'Pamitan' },
          { id: 'opt-en-np', label: 'No problem at all', sub: 'Balasan terima kasih' },
          { id: 'opt-en-later', label: 'Maybe later', sub: 'Menunda nanti' },
        ],
        correctOptionId: 'opt-en-thanks',
        explanation:
          'Benar! "Thank you for your assistance" menunjukkan apresiasi profesional yang rapi di dunia kerja.',
      },
    ],
  },
  {
    code: 'de',
    label: 'Jerman',
    speechLocale: 'de-DE',
    examLabel: 'Goethe A1 – C1',
    phraseSubtitle: 'Ungkapan esensial untuk perkuliahan, riset & kerja di Jerman',
    phrases: [
      {
        id: 'de-morgen',
        nativeText: 'Guten Morgen',
        phonetic: '/ˈɡuːtn̩ ˈmɔʁɡn̩/',
        meaning: 'Selamat pagi (formal & kerja)',
        contextTag: 'Sapaan Kerja',
      },
      {
        id: 'de-sorry',
        nativeText: 'Entschuldigung',
        phonetic: '/ɛntˈʃʊldɪɡʊŋ/',
        meaning: 'Permisi / Mohon maaf',
        contextTag: 'Etika Harian',
      },
      {
        id: 'de-dank',
        nativeText: 'Vielen Dank',
        phonetic: '/ˈfiːlən daŋk/',
        meaning: 'Terima kasih banyak',
        contextTag: 'Sopan Standar',
      },
      {
        id: 'de-verstehen',
        nativeText: 'Ich verstehe nicht',
        phonetic: '/ɪç fɛɐ̯ˈʃteːə nɪçt/',
        meaning: 'Saya belum mengerti',
        contextTag: 'Kampus & Kerja',
      },
    ],
    questions: [
      {
        id: 'quiz-de-sorry',
        prompt: 'Apa arti kata serbaguna "Entschuldigung" saat kamu bertanya arah stasiun di Jerman?',
        sampleText: 'Entschuldigung, wo ist der Bahnhof?',
        hint: 'Diucapkan sebelum meminta izin atau bertanya ke orang lain',
        options: [
          { id: 'opt-de-sorry', label: 'Permisi / Maaf', sub: 'Pembuka tanya sopan' },
          { id: 'opt-de-night', label: 'Selamat malam', sub: 'Guten Abend' },
          { id: 'opt-de-bye', label: 'Sampai jumpa', sub: 'Auf Wiedersehen' },
          { id: 'opt-de-welcome', label: 'Sama-sama', sub: 'Bitte sehr' },
        ],
        correctOptionId: 'opt-de-sorry',
        explanation:
          'Benar! "Entschuldigung" sangat sering dipakai di Jerman untuk mengatakan permisi atau maaf dengan sopan.',
      },
      {
        id: 'quiz-de-understand',
        prompt:
          'Jika instruksi kerja dari supervisor berbahasa Jerman belum jelas, kalimat mana yang tepat?',
        sampleText: 'Situasi: Mengonfirmasi pemahaman saat briefing',
        hint: 'Kata kerja "verstehen" berarti mengerti / memahami',
        options: [
          { id: 'opt-de-understand', label: 'Ich verstehe nicht', sub: 'Saya belum mengerti' },
          { id: 'opt-de-morning', label: 'Guten Morgen', sub: 'Selamat pagi' },
          { id: 'opt-de-thanks', label: 'Vielen Dank', sub: 'Terima kasih banyak' },
          { id: 'opt-de-goodbye', label: 'Auf Wiedersehen', sub: 'Sampai jumpa lagi' },
        ],
        correctOptionId: 'opt-de-understand',
        explanation:
          'Tepat! Mengatakan "Ich verstehe nicht" membantu rekan kerja menjelaskan ulang instruksi tanpa salah paham.',
      },
    ],
  },
  {
    code: 'zh',
    label: 'Mandarin',
    speechLocale: 'zh-CN',
    examLabel: 'HSK 1 – 6',
    phraseSubtitle: 'Ungkapan praktis bisnis, pabrik teknologi & komunikasi harian Mandarin',
    phrases: [
      {
        id: 'zh-nihao',
        nativeText: '你好',
        phonetic: 'Nǐ hǎo',
        meaning: 'Halo / Apa kabar',
        contextTag: 'Sapaan Dasar',
      },
      {
        id: 'zh-xiexie',
        nativeText: '谢谢',
        phonetic: 'Xièxie',
        meaning: 'Terima kasih',
        contextTag: 'Sopan Harian',
      },
      {
        id: 'zh-buhaoyisi',
        nativeText: '不好意思',
        phonetic: 'Bù hǎoyìsi',
        meaning: 'Permisi / Maaf (halus)',
        contextTag: 'Etika Publik',
      },
      {
        id: 'zh-repeat',
        nativeText: '请再说一遍',
        phonetic: 'Qǐng zài shuō yībiàn',
        meaning: 'Tolong ucapkan sekali lagi',
        contextTag: 'Komunikasi Kerja',
      },
    ],
    questions: [
      {
        id: 'quiz-zh-xiexie',
        prompt: 'Karakter Hanzi manakah yang dibaca "Xièxie" dan berarti terima kasih?',
        sampleText: 'Hanyu Pinyin: Xièxie',
        hint: 'Terdiri dari dua karakter kembar untuk berterima kasih',
        options: [
          { id: 'opt-zh-xiexie', label: '谢谢', sub: 'Xièxie' },
          { id: 'opt-zh-nihao', label: '你好', sub: 'Nǐ hǎo' },
          { id: 'opt-zh-zaijian', label: '再见', sub: 'Zàijiàn' },
          { id: 'opt-zh-qingwen', label: '请问', sub: 'Qǐngwèn' },
        ],
        correctOptionId: 'opt-zh-xiexie',
        explanation: 'Benar! 谢谢 (Xièxie) adalah ungkapan terima kasih paling umum dalam bahasa Mandarin.',
      },
      {
        id: 'quiz-zh-sorry',
        prompt:
          'Saat ingin melewati kerumunan atau menyela percakapan secara halus dalam Mandarin, apa ucapannya?',
        sampleText: 'Situasi: Meminta jalan atau izin bertanya dengan sopan',
        hint: 'Ungkapan permisi sopan sehari-hari (bukan maaf resmi yang berat)',
        options: [
          { id: 'opt-zh-sorry', label: '不好意思', sub: 'Bù hǎoyìsi' },
          { id: 'opt-zh-morning', label: '早上好', sub: 'Zǎoshang hǎo' },
          { id: 'opt-zh-meiguanxi', label: '没关系', sub: 'Méi guānxi' },
          { id: 'opt-zh-bukeqi', label: '不客气', sub: 'Bù kèqi' },
        ],
        correctOptionId: 'opt-zh-sorry',
        explanation:
          'Tepat! "Bù hǎoyìsi" sangat alami dipakai sebagai permisi atau maaf ringan di kantor maupun tempat umum.',
      },
    ],
  },
  {
    code: 'fr',
    label: 'Prancis',
    speechLocale: 'fr-FR',
    examLabel: 'DELF / DALF',
    phraseSubtitle: 'Ungkapan wajib etika pergaulan, kuliah & dunia kerja Prancis',
    phrases: [
      {
        id: 'fr-bonjour',
        nativeText: 'Bonjour',
        phonetic: '/bɔ̃.ʒuʁ/',
        meaning: 'Halo / Selamat pagi–siang',
        contextTag: 'Sapaan Wajib',
      },
      {
        id: 'fr-excuse',
        nativeText: 'Excusez-moi',
        phonetic: '/ɛk.sky.ze.mwa/',
        meaning: 'Permisi / Maaf (formal)',
        contextTag: 'Etika Harian',
      },
      {
        id: 'fr-merci',
        nativeText: 'Merci beaucoup',
        phonetic: '/mɛʁ.si bo.ku/',
        meaning: 'Terima kasih banyak',
        contextTag: 'Sopan Standar',
      },
      {
        id: 'fr-understand',
        nativeText: 'Je ne comprends pas',
        phonetic: '/ʒə nə kɔ̃.pʁɑ̃ pa/',
        meaning: 'Saya belum mengerti',
        contextTag: 'Kampus & Kerja',
      },
    ],
    questions: [
      {
        id: 'quiz-fr-bonjour',
        prompt:
          'Di Prancis, sapaan apa yang wajib diucapkan setiap masuk toko, kantor, atau memulai percakapan siang hari?',
        sampleText: 'Situasi: Pembuka percakapan sopan sebelum bertanya',
        hint: 'Tanpa sapaan pembuka ini, pertanyaan langsung bisa dianggap kurang sopan',
        options: [
          { id: 'opt-fr-bonjour', label: 'Bonjour', sub: 'Halo / Selamat pagi–siang' },
          { id: 'opt-fr-bonsoir', label: 'Bonsoir', sub: 'Selamat malam' },
          { id: 'opt-fr-aurevoir', label: 'Au revoir', sub: 'Sampai jumpa' },
          { id: 'opt-fr-derien', label: 'De rien', sub: 'Sama-sama' },
        ],
        correctOptionId: 'opt-fr-bonjour',
        explanation:
          'Benar! Mengucapkan "Bonjour" terlebih dahulu adalah kunci etika komunikasi di Prancis.',
      },
      {
        id: 'quiz-fr-excuse',
        prompt: 'Kalimat formal "Excusez-moi" paling tepat digunakan untuk situasi apa?',
        sampleText: 'Excusez-moi, parlez-vous anglais ?',
        hint: 'Menggunakan kata ganti formal "vous"',
        options: [
          { id: 'opt-fr-excuse', label: 'Permisi / Mohon maaf (formal)', sub: 'Menyela atau minta jalan' },
          { id: 'opt-fr-evening', label: 'Selamat malam', sub: 'Bonsoir' },
          { id: 'opt-fr-tomorrow', label: 'Sampai jumpa besok', sub: 'À demain' },
          { id: 'opt-fr-nice', label: 'Senang bertemu', sub: 'Enchanté(e)' },
        ],
        correctOptionId: 'opt-fr-excuse',
        explanation:
          'Tepat! "Excusez-moi" adalah bentuk sopan untuk meminta perhatian atau lewat di lingkungan formal dan publik.',
      },
    ],
  },
]

export const LANDING_FEATURES: ReadonlyArray<LandingFeatureItem> = [
  {
    id: 'feat-curriculum',
    badge: 'Unit 1 Terbuka Gratis',
    title: 'Peta Kurikulum Standar Sertifikasi Global',
    description:
      'Materi dipecah menjadi pelajaran singkat 3–5 menit dengan kartu pengantar sebelum latihan, mendukung jalur JLPT, IELTS, TOEFL, Goethe, HSK, hingga DELF.',
    href: '/curriculum',
    ctaLabel: 'Jelajahi Peta & Coba Unit 1',
    accent: 'blue',
  },
  {
    id: 'feat-flashcards',
    badge: 'Ulasan Terjadwal',
    title: 'Flashcard Kosakata & Audio Multi-Bahasa',
    description:
      'Balik kartu cepat lengkap dengan tulisan asli, cara baca, dan suara pengucapan. Saat masuk akun gratis, kartu otomatis dijadwalkan ulang supaya makin mudah diingat.',
    href: '/flashcards',
    ctaLabel: 'Coba Dek Flashcard',
    accent: 'sky',
  },
  {
    id: 'feat-grammar',
    badge: 'Panduan Tata Bahasa',
    title: 'Panduan Pola Kalimat & Tata Bahasa',
    description:
      'Pahami susunan kalimat lewat penjelasan warna per bagian kata, contoh situasi kerja dan keseharian di luar negeri, serta kuis singkat.',
    href: '/grammar',
    ctaLabel: 'Lihat Panduan Grammar',
    accent: 'amber',
  },
  {
    id: 'feat-kana',
    badge: 'Bahasa Beraksara',
    title: 'Papan Aksara & Latihan Tulis Interaktif',
    description:
      'Latihan menulis huruf langsung di layar, tips mengingat bentuk huruf untuk pemula, dan audio pengucapan asli (tersedia lengkap untuk Hiragana, Katakana & Kanji Jepang).',
    href: '/kana/hiragana',
    ctaLabel: 'Coba Papan Aksara Jepang',
    accent: 'emerald',
  },
]

export const GUEST_VS_ACCOUNT_ROWS: ReadonlyArray<GuestVsAccountRow> = [
  {
    feature: 'Jelajahi Peta Kurikulum, Tata Bahasa, Aksara & Kartu Kosakata',
    guestAccess: 'Terbuka Penuh',
    accountAccess: 'Terbuka Penuh',
  },
  {
    feature: 'Mengerjakan Pelajaran Unit 1 (Kuis & Audio Interaktif)',
    guestAccess: 'Bisa dicoba langsung',
    accountAccess: 'Bisa + tersimpan permanen',
    accountAdvantage: true,
  },
  {
    feature: 'Buka Seluruh Unit Lanjutan & Ujian Kesiapan Sertifikasi',
    guestAccess: 'Terkunci (Perlu Akun)',
    accountAccess: 'Terbuka Gratis Seumur Hidup',
    accountAdvantage: true,
  },
  {
    feature: 'Simpan XP, Level, Streak Harian & Pelindung Streak Lintas Bahasa',
    guestAccess: 'Sementara di perangkat ini',
    accountAccess: 'Tersimpan Permanen di Akun',
    accountAdvantage: true,
  },
  {
    feature: 'Misi Harian, Hadiah Gems, & Jadwal Ulang Otomatis',
    guestAccess: 'Perlu Akun',
    accountAccess: 'Aktif Otomatis',
    accountAdvantage: true,
  },
]
