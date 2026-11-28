import type { KanaScriptType } from '@/features/curriculum/types/curriculum'

export type KanaStrokeDir = 'right' | 'down' | 'down-left' | 'down-right' | 'curve' | 'loop'

export interface KanaStrokePoint {
  x: number
  y: number
  dir: KanaStrokeDir
}

export interface KanaStrokeGuide {
  strokes: number
  tips: string
  points: KanaStrokePoint[]
}

const DIR_ARROW: Record<KanaStrokeDir, string> = {
  right: '→',
  down: '↓',
  'down-left': '↙',
  'down-right': '↘',
  curve: '↷',
  loop: '↻',
}

export function getStrokeArrowGlyph(dir: KanaStrokeDir): string {
  return DIR_ARROW[dir]
}

const p = (x: number, y: number, dir: KanaStrokeDir): KanaStrokePoint => ({ x, y, dir })

const BASIC_KANA_GUIDES: Record<string, KanaStrokeGuide> = {
  // ── HIRAGANA 46 ──
  あ: { strokes: 3, tips: '1) Palang datar atas → 2) Tiang melengkung → 3) Lingkaran memutar silang dari tengah.', points: [p(28, 28, 'right'), p(48, 18, 'down'), p(58, 42, 'loop')] },
  い: { strokes: 2, tips: '1) Garis kiri turun + kait kecil naik → 2) Garis kanan lebih pendek melengkung turun.', points: [p(30, 26, 'down'), p(68, 30, 'down')] },
  う: { strokes: 2, tips: '1) Titik miring pendek di atas → 2) Lengkung lebar ke kanan lalu turun ke tengah bawah.', points: [p(44, 18, 'down-right'), p(32, 38, 'curve')] },
  え: { strokes: 2, tips: '1) Topi miring di atas → 2) Garis datar ke kanan, serong kiri bawah, lalu melengkung naik-turun.', points: [p(42, 18, 'down-right'), p(28, 38, 'right')] },
  お: { strokes: 3, tips: '1) Palang datar → 2) Tiang turun berputar ke kanan bawah → 3) Titik kecil terpisah di kanan atas.', points: [p(24, 30, 'right'), p(42, 18, 'loop'), p(72, 28, 'down-right')] },

  か: { strokes: 3, tips: '1) Garis mendatar berbelok turun kait → 2) Garis miring memotong kiri → 3) Titik pendek di kanan.', points: [p(22, 34, 'right'), p(44, 18, 'down-left'), p(74, 34, 'down-right')] },
  き: { strokes: 4, tips: '1–2) Dua garis miring naik kanan → 3) Batang miring silang → 4) Lengkungan dasar memisah.', points: [p(24, 30, 'right'), p(26, 46, 'right'), p(44, 18, 'down-right'), p(32, 68, 'curve')] },
  く: { strokes: 1, tips: 'Satu tarikan menyudut: miring kiri bawah lalu belok tajam ke kanan bawah.', points: [p(62, 18, 'down-left')] },
  け: { strokes: 3, tips: '1) Tiang kiri turun berkait → 2) Palang datar kanan → 3) Batang kanan memotong lengkung ke kiri.', points: [p(26, 22, 'down'), p(48, 34, 'right'), p(66, 18, 'down-left')] },
  こ: { strokes: 2, tips: '1) Garis datar atas berkait sedikit ke bawah → 2) Garis lengkung datar bawah.', points: [p(30, 28, 'right'), p(28, 66, 'right')] },

  さ: { strokes: 3, tips: '1) Palang datar atas → 2) Batang miring menyilang → 3) Lengkung dasar terbuka di bawah.', points: [p(24, 32, 'right'), p(44, 18, 'down-right'), p(30, 68, 'curve')] },
  し: { strokes: 1, tips: 'Satu tarikan tegak lurus ke bawah lalu melengkung mulus naik ke kanan.', points: [p(36, 20, 'down')] },
  す: { strokes: 2, tips: '1) Palang datar lebar → 2) Tiang memotong tengah, buat simpul kecil di tengah lalu turun ke kiri.', points: [p(22, 30, 'right'), p(54, 16, 'loop')] },
  せ: { strokes: 3, tips: '1) Palang datar → 2) Tiang kanan berkait masuk → 3) Tiang kiri turun belok mendatar ke kanan.', points: [p(20, 38, 'right'), p(68, 22, 'down'), p(36, 20, 'down')] },
  そ: { strokes: 1, tips: 'Satu tarikan zig-zag tanpa putus: datar pendek, miring kiri, datar panjang, lalu lengkung bawah.', points: [p(32, 22, 'right')] },

  た: { strokes: 4, tips: '1–2) Palang silang kiri (seperti t) → 3) Garis datar kanan → 4) Garis lengkung bawah kanan.', points: [p(22, 32, 'right'), p(38, 18, 'down-left'), p(56, 40, 'right'), p(52, 68, 'right')] },
  ち: { strokes: 2, tips: '1) Garis datar atas → 2) Batang miring ke kiri bawah lalu melengkung lebar ke kanan.', points: [p(26, 28, 'right'), p(48, 16, 'down-left')] },
  つ: { strokes: 1, tips: 'Satu tarikan lebar ke kanan lalu melengkung membulat ke kiri bawah.', points: [p(20, 36, 'curve')] },
  て: { strokes: 1, tips: 'Satu tarikan datar ke kanan lalu berbelok lengkung besar di bawah.', points: [p(22, 28, 'right')] },
  と: { strokes: 2, tips: '1) Garis miring kanan bawah → 2) Lengkungan dari kanan atas turun melingkar ke kanan.', points: [p(34, 22, 'down-right'), p(68, 32, 'curve')] },

  な: { strokes: 4, tips: '1–2) Palang silang kiri → 3) Titik kanan atas → 4) Tiang pendek kanan bersimpul di bawah.', points: [p(22, 30, 'right'), p(38, 18, 'down-left'), p(66, 28, 'down-right'), p(64, 44, 'loop')] },
  に: { strokes: 3, tips: '1) Tiang kiri tegak berkait → 2) Garis datar kanan atas → 3) Garis lengkung kanan bawah.', points: [p(26, 22, 'down'), p(50, 32, 'right'), p(48, 66, 'right')] },
  ぬ: { strokes: 2, tips: '1) Goresan miring ke bawah → 2) Lengkungan melintasi dari atas memutar besar + simpul ekor kecil.', points: [p(28, 26, 'down-right'), p(54, 20, 'loop')] },
  ね: { strokes: 2, tips: '1) Tiang tegak kiri → 2) Zig-zag memotong tiang lalu melengkung kanan dan berakhir simpul kecil.', points: [p(30, 18, 'down'), p(20, 38, 'loop')] },
  の: { strokes: 1, tips: 'Satu tarikan mulai tengah: turun serong kiri lalu naik memutar besar mengelilingi arah jarum jam.', points: [p(50, 26, 'loop')] },

  は: { strokes: 3, tips: '1) Tiang kiri tegak berkait → 2) Palang kanan atas → 3) Tiang kanan turun bersimpul di bawah.', points: [p(26, 22, 'down'), p(46, 32, 'right'), p(64, 20, 'loop')] },
  ひ: { strokes: 1, tips: 'Satu tarikan: pendek datar ke kanan, turun besar melengkung huruf U, lalu naik keluar ke kanan.', points: [p(22, 30, 'curve')] },
  ふ: { strokes: 4, tips: '1) Topi titik atas → 2) Kait tengah vertikal → 3) Titik kiri luar → 4) Titik kanan luar.', points: [p(46, 18, 'down-right'), p(46, 40, 'curve'), p(22, 56, 'down-left'), p(76, 54, 'down-right')] },
  へ: { strokes: 1, tips: 'Satu tarikan menanjak tajam dari kiri lalu turun landai memanjang ke kanan.', points: [p(18, 54, 'curve')] },
  ほ: { strokes: 4, tips: '1) Tiang kiri → 2) Palang kanan atas → 3) Palang kanan tengah → 4) Tiang kanan bersimpul.', points: [p(26, 22, 'down'), p(46, 26, 'right'), p(46, 44, 'right'), p(64, 26, 'loop')] },

  ま: { strokes: 3, tips: '1) Palang datar atas → 2) Palang datar bawah → 3) Tiang tengah turun menembus dan bersimpul.', points: [p(24, 28, 'right'), p(26, 46, 'right'), p(50, 16, 'loop')] },
  み: { strokes: 2, tips: '1) Datar ke kanan, turun silang ke kiri, buat simpul & datar ke kanan → 2) Goresan memotong sisi kanan.', points: [p(26, 24, 'loop'), p(74, 42, 'down-left')] },
  む: { strokes: 3, tips: '1) Palang datar pendek → 2) Tiang turun + simpul kecil memanjang kanan berkait → 3) Titik kanan atas.', points: [p(22, 34, 'right'), p(38, 18, 'loop'), p(76, 30, 'down-right')] },
  め: { strokes: 2, tips: '1) Lengkung serong turun kanan → 2) Lengkung atas kiri menyilang dan memutar lebar ke bawah.', points: [p(28, 28, 'down-right'), p(54, 20, 'loop')] },
  も: { strokes: 3, tips: '1) Tiang memanjang berbelok membulat ke kanan → 2) Palang datar atas → 3) Palang datar tengah.', points: [p(44, 18, 'down'), p(28, 34, 'right'), p(28, 52, 'right')] },

  や: { strokes: 3, tips: '1) Lengkung besar naik kanan memutar ke bawah → 2) Titik miring kanan atas → 3) Tiang miring kiri bawah.', points: [p(20, 44, 'curve'), p(62, 18, 'down-right'), p(36, 22, 'down-right')] },
  ゆ: { strokes: 2, tips: '1) Tiang kiri naik-putar lingkaran kanan lalu turun kiri → 2) Tiang tegak memotong tengah.', points: [p(28, 22, 'loop'), p(54, 18, 'down')] },
  よ: { strokes: 2, tips: '1) Garis datar pendek kanan tengah → 2) Tiang atas turun lurus membentuk simpul bawah.', points: [p(50, 30, 'right'), p(48, 18, 'loop')] },

  ら: { strokes: 2, tips: '1) Titik pendek miring di atas → 2) Garis kiri turun sebentar lalu melengkung besar memutar.', points: [p(44, 18, 'down-right'), p(34, 36, 'curve')] },
  り: { strokes: 2, tips: '1) Tiang kiri turun berkait naik → 2) Tiang kanan lebih tinggi melengkung ke kiri bawah.', points: [p(32, 24, 'down'), p(66, 20, 'down-left')] },
  る: { strokes: 1, tips: 'Satu tarikan zig-zag angka 3 yang memutar simpul tertutup rapat di ujung bawah.', points: [p(32, 24, 'loop')] },
  れ: { strokes: 2, tips: '1) Tiang kiri tegak → 2) Zig-zag memotong tiang lalu melenting ke kanan bawah.', points: [p(32, 18, 'down'), p(20, 38, 'curve')] },
  ろ: { strokes: 1, tips: 'Sama seperti る (angka 3), berhenti dengan lengkungan terbuka tanpa simpul penutup.', points: [p(32, 24, 'curve')] },

  わ: { strokes: 2, tips: '1) Tiang kiri tegak → 2) Zig-zag memotong tiang lalu melengkung lebar memutar turun.', points: [p(30, 18, 'down'), p(20, 38, 'curve')] },
  を: { strokes: 3, tips: '1) Palang datar atas → 2) Tiang tengah berbelok memeluk → 3) Lengkung huruf C dari kanan.', points: [p(26, 26, 'right'), p(48, 16, 'curve'), p(72, 46, 'down-left')] },
  ん: { strokes: 1, tips: 'Satu tarikan turun serong kiri lalu naik sebentar di punggung tengah dan melengkung ke kanan.', points: [p(50, 18, 'down-left')] },

  // ── KATAKANA 46 ──
  ア: { strokes: 2, tips: '1) Datar ke kanan lalu turun serong kiri → 2) Garis melengkung turun dari tengah.', points: [p(22, 26, 'right'), p(50, 38, 'down-left')] },
  イ: { strokes: 2, tips: '1) Goresan miring ke kiri bawah → 2) Tiang lurus turun dari tengah garis pertama.', points: [p(66, 20, 'down-left'), p(52, 44, 'down')] },
  ウ: { strokes: 3, tips: '1) Garis tegak pendek atas → 2) Tiang kiri pendek → 3) Palang datar belok turun tajam ke kiri.', points: [p(50, 16, 'down'), p(26, 32, 'down'), p(28, 32, 'right')] },
  エ: { strokes: 3, tips: '1) Datar atas → 2) Tiang tengah turun → 3) Datar bawah lebih panjang.', points: [p(26, 26, 'right'), p(50, 26, 'down'), p(18, 72, 'right')] },
  オ: { strokes: 3, tips: '1) Datar atas → 2) Tiang tegak berkait kiri → 3) Goresan miring kiri bawah dari persimpangan.', points: [p(22, 34, 'right'), p(58, 16, 'down'), p(56, 36, 'down-left')] },

  カ: { strokes: 2, tips: '1) Datar kanan berbelok turun kiri berkait → 2) Garis memotong tengah ke kiri bawah.', points: [p(22, 34, 'right'), p(50, 18, 'down-left')] },
  キ: { strokes: 3, tips: '1) Datar atas → 2) Datar bawah lebih lebar → 3) Satu batang miring menembus ke bawah.', points: [p(26, 32, 'right'), p(20, 52, 'right'), p(44, 18, 'down-right')] },
  ク: { strokes: 2, tips: '1) Goresan miring pendek kiri → 2) Sambung datar kanan lalu meluncur miring jauh ke kiri bawah.', points: [p(44, 18, 'down-left'), p(42, 28, 'right')] },
  ケ: { strokes: 3, tips: '1) Goresan miring kiri pendek → 2) Palang datar → 3) Garis miring kiri bawah dari palang.', points: [p(40, 18, 'down-left'), p(36, 36, 'right'), p(58, 36, 'down-left')] },
  コ: { strokes: 2, tips: '1) Datar atas + sudut kanan turun tegak → 2) Garis datar penutup alas menyentuh tiang kanan.', points: [p(26, 28, 'right'), p(26, 70, 'right')] },

  サ: { strokes: 3, tips: '1) Palang datar → 2) Tiang kiri pendek → 3) Tiang kanan lebih panjang melengkung ke kiri bawah.', points: [p(20, 36, 'right'), p(36, 22, 'down'), p(64, 18, 'down-left')] },
  シ: { strokes: 3, tips: '1–2) Dua titik miring disusun vertikal → 3) Sapuan panjang naik dari bawah kiri ke kanan atas!', points: [p(28, 22, 'down-right'), p(22, 42, 'down-right'), p(26, 76, 'right')] },
  ス: { strokes: 2, tips: '1) Datar kanan lalu miring tajam kiri bawah → 2) Cabang pendek memancar ke kanan bawah.', points: [p(26, 26, 'right'), p(54, 52, 'down-right')] },
  セ: { strokes: 2, tips: '1) Palang datar sedikit naik + belok sudut kiri → 2) Tiang kiri turun menyiku datar ke kanan.', points: [p(18, 42, 'right'), p(40, 20, 'down')] },
  ソ: { strokes: 2, tips: '1) Satu titik pendek di kiri atas → 2) Sapuan tajam turun dari kanan atas ke kiri bawah.', points: [p(30, 24, 'down-right'), p(74, 24, 'down-left')] },

  タ: { strokes: 3, tips: '1) Miring pendek kiri → 2) Datar kanan berbelok miring turun kiri → 3) Garis memotong di tengah.', points: [p(44, 18, 'down-left'), p(42, 28, 'right'), p(34, 44, 'down-right')] },
  チ: { strokes: 3, tips: '1) Goresan atas ke kiri → 2) Palang datar lebar → 3) Batang tengah tegak berbelok ke kiri.', points: [p(66, 20, 'down-left'), p(20, 44, 'right'), p(52, 28, 'down-left')] },
  ツ: { strokes: 3, tips: '1–2) Dua titik sejajar di atas kiri-tengah → 3) Sapuan turun dari kanan atas ke kiri bawah!', points: [p(24, 24, 'down-right'), p(48, 22, 'down-right'), p(78, 26, 'down-left')] },
  テ: { strokes: 3, tips: '1) Datar pendek atas → 2) Datar panjang tengah → 3) Tiang melengkung ke kiri bawah.', points: [p(28, 24, 'right'), p(18, 42, 'right'), p(54, 42, 'down-left')] },
  ト: { strokes: 2, tips: '1) Tiang tegak lurus → 2) Cabang miring ke kanan bawah mulai dari tengah tiang.', points: [p(40, 18, 'down'), p(42, 42, 'down-right')] },

  ナ: { strokes: 2, tips: '1) Palang datar lebar → 2) Tiang tegak menembus tengah lalu melengkung ke kiri bawah.', points: [p(20, 38, 'right'), p(52, 18, 'down-left')] },
  ニ: { strokes: 2, tips: '1) Datar pendek di atas → 2) Garis datar lebih panjang di bawah.', points: [p(28, 34, 'right'), p(18, 68, 'right')] },
  ヌ: { strokes: 2, tips: '1) Datar berbelok miring tajam kiri bawah → 2) Goresan silang pendek ke kanan bawah.', points: [p(24, 28, 'right'), p(34, 42, 'down-right')] },
  ネ: { strokes: 4, tips: '1) Titik atas → 2) Sudut datar turun kiri → 3) Tiang tegak ke bawah → 4) Cabang miring kanan.', points: [p(48, 16, 'down-right'), p(22, 34, 'right'), p(50, 46, 'down'), p(54, 52, 'down-right')] },
  ノ: { strokes: 1, tips: 'Satu tarikan diagonal panjang dari kanan atas melengkung ke kiri bawah.', points: [p(66, 20, 'down-left')] },

  ハ: { strokes: 2, tips: '1) Goresan miring ke kiri bawah → 2) Goresan simetris miring ke kanan bawah.', points: [p(36, 30, 'down-left'), p(62, 30, 'down-right')] },
  ヒ: { strokes: 2, tips: '1) Garis naik sedikit ke kanan di tengah tiang → 2) Tiang kiri turun belok datar ke kanan.', points: [p(32, 44, 'right'), p(30, 20, 'down')] },
  フ: { strokes: 1, tips: 'Satu tarikan datar tajam ke kanan lalu langsung meluncur miring ke kiri bawah.', points: [p(24, 26, 'right')] },
  ヘ: { strokes: 1, tips: 'Sama persis dengan へ: naik tajam di kiri lalu memanjang turun ke kanan.', points: [p(18, 54, 'curve')] },
  ホ: { strokes: 4, tips: '1) Datar → 2) Tiang tegak tengah berkait → 3) Titik kiri luar → 4) Titik kanan luar.', points: [p(22, 34, 'right'), p(50, 18, 'down'), p(28, 52, 'down-left'), p(72, 52, 'down-right')] },

  マ: { strokes: 2, tips: '1) Datar lebar lalu miring kiri bawah → 2) Garis pendek menyentuh pangkal bawah (tidak menembus).', points: [p(22, 30, 'right'), p(42, 54, 'down-right')] },
  ミ: { strokes: 3, tips: '1) Goresan atas miring turun → 2) Tengah lebih pendek → 3) Bawah paling panjang ke kanan.', points: [p(28, 24, 'down-right'), p(26, 46, 'down-right'), p(24, 68, 'down-right')] },
  ム: { strokes: 2, tips: '1) Miring ke kiri bawah lalu tarik datar panjang ke kanan → 2) Goresan miring penutup sudut kanan.', points: [p(50, 20, 'down-left'), p(66, 52, 'down-right')] },
  メ: { strokes: 2, tips: '1) Goresan panjang miring dari kanan atas ke kiri bawah → 2) Silang pendek ke kanan bawah.', points: [p(66, 20, 'down-left'), p(30, 38, 'down-right')] },
  モ: { strokes: 3, tips: '1) Datar atas pendek → 2) Datar bawah lebar → 3) Tiang tengah turun menembus lalu belok kanan.', points: [p(28, 28, 'right'), p(20, 48, 'right'), p(46, 28, 'down')] },

  ヤ: { strokes: 2, tips: '1) Garis datar sedikit naik + belok tajam turun kiri → 2) Tiang panjang menembus miring ke kanan bawah.', points: [p(18, 42, 'right'), p(38, 18, 'down-right')] },
  ユ: { strokes: 2, tips: '1) Datar pendek atas belok turun tegak → 2) Garis alas datar memanjang melewati sisi kanan.', points: [p(28, 28, 'right'), p(16, 70, 'right')] },
  ヨ: { strokes: 3, tips: '1) Datar atas + tiang kanan turun → 2) Palang tengah → 3) Palang dasar datar menutup.', points: [p(26, 26, 'right'), p(26, 48, 'right'), p(24, 72, 'right')] },

  ラ: { strokes: 2, tips: '1) Datar pendek atas → 2) Datar bawah lebih panjang lalu membelok tajam ke kiri bawah.', points: [p(30, 24, 'right'), p(24, 42, 'right')] },
  リ: { strokes: 2, tips: '1) Tiang kiri lurus pendek → 2) Tiang kanan lebih panjang melengkung halus ke kiri bawah.', points: [p(34, 24, 'down'), p(66, 20, 'down-left')] },
  ル: { strokes: 2, tips: '1) Tiang kiri turun melengkung ke kiri bawah → 2) Tiang kanan turun lalu melenting tajam ke kanan atas.', points: [p(36, 24, 'down-left'), p(60, 20, 'down')] },
  レ: { strokes: 1, tips: 'Satu tarikan lurus ke bawah lalu langsung melenting miring naik ke kanan atas.', points: [p(32, 22, 'down')] },
  ロ: { strokes: 3, tips: '1) Tiang kiri → 2) Atap atas menyambung tiang kanan → 3) Alas datar menghubungkan dasar kotak.', points: [p(24, 28, 'down'), p(24, 28, 'right'), p(26, 72, 'right')] },

  ワ: { strokes: 2, tips: '1) Tiang pendek di kiri atas → 2) Palang datar belok melengkung ke kiri bawah.', points: [p(26, 24, 'down'), p(28, 26, 'right')] },
  ヲ: { strokes: 3, tips: '1) Datar atas → 2) Datar tengah → 3) Lengkungan tajam ke kiri bawah dari sisi kanan garis atas.', points: [p(24, 26, 'right'), p(26, 46, 'right'), p(74, 26, 'down-left')] },
  ン: { strokes: 2, tips: '1) Satu titik miring kanan di kiri atas → 2) Sapuan panjang NAIK ke kanan atas (kebalikan ソ!).', points: [p(26, 26, 'down-right'), p(26, 76, 'right')] },
}

const DAKUTEN_BASE_MAP: Record<string, string> = {
  が: 'か', ぎ: 'き', ぐ: 'く', げ: 'け', ご: 'こ',
  ざ: 'さ', じ: 'し', ず: 'す', ぜ: 'せ', ぞ: 'そ',
  だ: 'た', ぢ: 'ち', づ: 'つ', で: 'て', ど: 'と',
  ば: 'は', び: 'ひ', ぶ: 'ふ', べ: 'へ', ぼ: 'ほ',
  ガ: 'カ', ギ: 'キ', グ: 'ク', ゲ: 'ケ', ゴ: 'コ',
  ザ: 'サ', ジ: 'シ', ズ: 'ス', ゼ: 'セ', ゾ: 'ソ',
  ダ: 'タ', ヂ: 'チ', ヅ: 'ツ', デ: 'テ', ド: 'ト',
  バ: 'ハ', ビ: 'ヒ', ブ: 'フ', ベ: 'ヘ', ボ: 'ホ',
}

const HANDAKUTEN_BASE_MAP: Record<string, string> = {
  ぱ: 'は', ぴ: 'ひ', ぷ: 'ふ', ぺ: 'へ', ぽ: 'ほ',
  パ: 'ハ', ピ: 'ヒ', プ: 'フ', ペ: 'ヘ', ポ: 'ホ',
}

const SMALL_YOON_STROKES: Record<string, number> = {
  ゃ: 3, ゅ: 2, ょ: 2,
  ャ: 2, ュ: 2, ョ: 3,
}

const KANJI_STROKE_COUNTS: Record<string, number> = {
  // N5 Core Kanji
  一: 1, 二: 2, 三: 3, 四: 5, 五: 4, 六: 4, 七: 2, 八: 2, 九: 2, 十: 2,
  日: 4, 月: 4, 火: 4, 水: 4, 木: 4, 金: 8, 土: 3, 山: 3, 川: 3, 田: 5,
  人: 2, 子: 3, 女: 3, 男: 7, 母: 5, 上: 3, 下: 3, 中: 4, 大: 3, 小: 3,
  学: 8, 生: 5, 先: 6, 年: 6, 本: 5, 国: 8, 外: 5, 駅: 14, 店: 8, 社: 7,
  行: 6, 来: 7, 食: 9, 飲: 12, 見: 7, 聞: 14, 読: 14, 書: 10, 話: 13, 休: 6,
  百: 6, 千: 3, 万: 3, 円: 4, 時: 10, 分: 4, 父: 4, 友: 4, 名: 6, 前: 9,
  後: 9, 右: 5, 左: 5, 校: 10, 高: 10, 安: 6, 新: 13, 古: 5,
  今: 4, 何: 7, 毎: 6, 週: 11, 午: 4, 半: 5, 間: 12, 語: 14, 電: 13, 車: 7,
  入: 2, 出: 5, 立: 5, 手: 4, 足: 7, 目: 5, 耳: 6, 口: 3, 天: 4, 気: 6,
  雨: 8, 花: 7, 白: 5, 長: 8, 多: 6, 少: 4, 東: 8, 西: 6, 南: 9, 北: 5,
  道: 12, 買: 12, 言: 7, 会: 6,
  // N4 Core Kanji
  仕: 5, 事: 8, 作: 7, 使: 8, 働: 13, 思: 9, 知: 8, 売: 7, 待: 9, 持: 9,
  帰: 10, 開: 12, 閉: 11, 始: 8, 終: 11, 心: 4, 体: 7, 空: 8, 海: 9, 森: 12,
  林: 8, 黒: 11, 赤: 7, 青: 8, 短: 12, 早: 6, 遅: 12, 近: 7, 遠: 13, 強: 11,
  弱: 10, 明: 8, 暗: 13, 広: 5, 重: 9, 軽: 12, 好: 6, 悪: 11, 正: 5, 同: 6,
  別: 7, 特: 10, 急: 9, 送: 9, 届: 8, 貸: 12, 借: 10, 教: 11, 習: 11, 勉: 10,
  試: 13, 験: 18, 問: 11, 題: 18, 答: 12, 意: 13, 味: 8, 文: 4, 字: 6, 音: 9,
  楽: 13, 映: 9, 画: 8, 写: 5, 真: 10, 旅: 10, 館: 16, 病: 10, 院: 10, 薬: 16,
  医: 7, 者: 8, 員: 10, 部: 11, 家: 10, 族: 11, 親: 16, 兄: 5, 弟: 7, 姉: 8,
  妹: 8, 犬: 4, 魚: 11, 肉: 6, 茶: 9, 飯: 12, 料: 10, 理: 11, 朝: 12, 昼: 9,
  夜: 8, 春: 9, 夏: 10, 秋: 9, 冬: 5, 町: 7, 村: 7, 市: 5, 都: 11, 京: 8,
  界: 9, 世: 5, 代: 5, 計: 9, 切: 4, 着: 12, 住: 7, 通: 10, 運: 12, 転: 11,
  動: 11, 止: 4, 歩: 8, 走: 7, 起: 10, 寝: 13, 洗: 9, 歌: 14, 遊: 12, 泳: 8,
  死: 6, 活: 9, 用: 5, 発: 9, 銀: 14, 紙: 10, 服: 8, 洋: 9, 品: 9, 物: 8,
  質: 15, 度: 9, 回: 6, 番: 12, 場: 12, 所: 8, 屋: 9, 室: 9, 堂: 11, 門: 8,
  戸: 4, 窓: 11, 光: 6, 色: 6, 声: 7, 力: 2, 工: 3, 業: 13, 建: 9, 研: 9,
  究: 7, 注: 8,
}

const KANJI_STROKE_POINTS: Record<string, KanaStrokePoint[]> = {
  一: [p(20, 50, 'right')],
  二: [p(26, 36, 'right'), p(18, 66, 'right')],
  三: [p(24, 28, 'right'), p(28, 50, 'right'), p(18, 72, 'right')],
  四: [p(22, 26, 'down'), p(24, 26, 'right'), p(42, 28, 'down-left'), p(58, 28, 'down'), p(24, 74, 'right')],
  五: [p(26, 24, 'right'), p(50, 24, 'down-left'), p(28, 48, 'right'), p(18, 74, 'right')],
  六: [p(50, 18, 'down'), p(20, 38, 'right'), p(38, 56, 'down-left'), p(62, 56, 'down-right')],
  七: [p(20, 48, 'right'), p(42, 18, 'down')],
  八: [p(38, 26, 'down-left'), p(58, 24, 'down-right')],
  九: [p(44, 18, 'down-left'), p(22, 42, 'right')],
  十: [p(20, 48, 'right'), p(50, 18, 'down')],
  日: [p(28, 22, 'down'), p(30, 22, 'right'), p(30, 48, 'right'), p(30, 74, 'right')],
  月: [p(32, 20, 'down'), p(34, 20, 'right'), p(34, 42, 'right'), p(34, 60, 'right')],
  火: [p(26, 36, 'down-right'), p(76, 32, 'down-left'), p(50, 18, 'down-left'), p(50, 48, 'down-right')],
  水: [p(50, 16, 'down'), p(22, 44, 'right'), p(76, 34, 'down-left'), p(52, 48, 'down-right')],
  木: [p(20, 38, 'right'), p(50, 16, 'down'), p(48, 40, 'down-left'), p(52, 42, 'down-right')],
  土: [p(26, 44, 'right'), p(50, 18, 'down'), p(18, 74, 'right')],
  山: [p(50, 18, 'down'), p(24, 42, 'down'), p(76, 40, 'down')],
  川: [p(28, 24, 'down-left'), p(50, 26, 'down'), p(72, 20, 'down')],
  田: [p(22, 24, 'down'), p(24, 24, 'right'), p(50, 26, 'down'), p(26, 48, 'right'), p(24, 74, 'right')],
  人: [p(52, 20, 'down-left'), p(50, 46, 'down-right')],
  口: [p(24, 28, 'down'), p(26, 28, 'right'), p(26, 72, 'right')],
  目: [p(28, 20, 'down'), p(30, 20, 'right'), p(30, 40, 'right'), p(30, 58, 'right'), p(30, 76, 'right')],
  手: [p(68, 20, 'down-left'), p(26, 38, 'right'), p(18, 56, 'right'), p(50, 28, 'down')],
  子: [p(26, 22, 'right'), p(50, 36, 'down'), p(18, 52, 'right')],
  女: [p(46, 18, 'down-left'), p(64, 34, 'down-left'), p(18, 40, 'right')],
  上: [p(50, 18, 'down'), p(52, 44, 'right'), p(18, 74, 'right')],
  下: [p(18, 24, 'right'), p(50, 26, 'down'), p(54, 44, 'down-right')],
  中: [p(22, 34, 'down'), p(24, 34, 'right'), p(26, 60, 'right'), p(50, 16, 'down')],
  大: [p(20, 42, 'right'), p(50, 18, 'down-left'), p(50, 44, 'down-right')],
  小: [p(50, 18, 'down'), p(28, 40, 'down-left'), p(72, 40, 'down-right')],
  左: [p(20, 34, 'right'), p(48, 18, 'down-left'), p(42, 50, 'right'), p(56, 52, 'down'), p(34, 74, 'right')],
  右: [p(48, 18, 'down-left'), p(20, 36, 'right'), p(38, 52, 'down'), p(40, 52, 'right'), p(40, 76, 'right')],
  円: [p(24, 22, 'down'), p(26, 22, 'right'), p(50, 24, 'down'), p(26, 48, 'right')],
  千: [p(68, 20, 'down-left'), p(18, 48, 'right'), p(50, 28, 'down')],
  万: [p(18, 26, 'right'), p(48, 44, 'right'), p(46, 28, 'down-left')],
  本: [p(20, 34, 'right'), p(50, 16, 'down'), p(48, 36, 'down-left'), p(52, 38, 'down-right'), p(32, 66, 'right')],
  入: [p(46, 36, 'down-left'), p(42, 22, 'down-right')],
  出: [p(50, 16, 'down'), p(26, 28, 'down'), p(74, 28, 'down'), p(22, 54, 'down'), p(78, 54, 'down')],
  立: [p(50, 18, 'down'), p(22, 36, 'right'), p(34, 42, 'down-right'), p(66, 40, 'down-left'), p(16, 76, 'right')],
  心: [p(20, 52, 'down-left'), p(34, 42, 'curve'), p(50, 26, 'down-right'), p(76, 42, 'down-right')],
  天: [p(24, 26, 'right'), p(18, 48, 'right'), p(50, 28, 'down-left'), p(50, 50, 'down-right')],
  力: [p(24, 34, 'right'), p(50, 18, 'down-left')],
  文: [p(50, 18, 'down'), p(20, 34, 'right'), p(66, 36, 'down-left'), p(32, 42, 'down-right')],
  今: [p(50, 18, 'down-left'), p(52, 20, 'down-right'), p(36, 44, 'right'), p(26, 60, 'right')],
  分: [p(38, 22, 'down-left'), p(60, 20, 'down-right'), p(28, 50, 'right'), p(48, 52, 'down-left')],
  半: [p(28, 22, 'down-right'), p(72, 22, 'down-left'), p(26, 42, 'right'), p(18, 60, 'right'), p(50, 16, 'down')],
  父: [p(38, 22, 'down-left'), p(62, 22, 'down-right'), p(62, 40, 'down-left'), p(34, 44, 'down-right')],
  友: [p(20, 32, 'right'), p(46, 18, 'down-left'), p(40, 48, 'right'), p(42, 56, 'down-right')],
  工: [p(24, 28, 'right'), p(50, 30, 'down'), p(18, 72, 'right')],
  止: [p(50, 18, 'down'), p(52, 44, 'right'), p(28, 38, 'down'), p(16, 74, 'right')],
  正: [p(22, 24, 'right'), p(50, 26, 'down'), p(52, 48, 'right'), p(28, 42, 'down'), p(16, 74, 'right')],
  生: [p(32, 22, 'down-left'), p(30, 36, 'right'), p(50, 16, 'down'), p(28, 54, 'right'), p(18, 74, 'right')],
  休: [p(30, 20, 'down-left'), p(26, 44, 'down'), p(42, 38, 'right'), p(64, 16, 'down'), p(62, 40, 'down-left')],
  会: [p(50, 16, 'down-left'), p(52, 18, 'down-right'), p(34, 44, 'right'), p(24, 58, 'right'), p(46, 60, 'down-left')],
  社: [p(26, 20, 'down-right'), p(18, 40, 'right'), p(28, 52, 'down'), p(50, 44, 'right'), p(68, 20, 'down')],
  見: [p(30, 18, 'down'), p(32, 18, 'right'), p(32, 32, 'right'), p(32, 44, 'right'), p(32, 56, 'right')],
  行: [p(34, 20, 'down-left'), p(36, 40, 'down-left'), p(28, 54, 'down'), p(56, 26, 'right'), p(50, 44, 'right')],
  来: [p(26, 28, 'right'), p(28, 38, 'down-right'), p(72, 36, 'down-left'), p(18, 52, 'right'), p(50, 16, 'down')],
  食: [p(50, 16, 'down-left'), p(52, 18, 'down-right'), p(50, 32, 'down'), p(34, 40, 'right'), p(34, 52, 'right')],
  学: [p(26, 20, 'down-right'), p(48, 18, 'down-right'), p(72, 20, 'down-left'), p(20, 36, 'down'), p(22, 36, 'right')],
  国: [p(20, 20, 'down'), p(22, 20, 'right'), p(34, 34, 'right'), p(50, 36, 'down'), p(22, 78, 'right')],
  車: [p(24, 24, 'right'), p(26, 38, 'down'), p(28, 38, 'right'), p(28, 50, 'right'), p(28, 62, 'right')],
  明: [p(22, 26, 'down'), p(24, 26, 'right'), p(54, 20, 'down'), p(56, 20, 'right'), p(56, 44, 'right')],
  早: [p(26, 20, 'down'), p(28, 20, 'right'), p(28, 34, 'right'), p(28, 48, 'right'), p(18, 64, 'right')],
  白: [p(50, 16, 'down-left'), p(26, 32, 'down'), p(28, 32, 'right'), p(28, 54, 'right'), p(28, 76, 'right')],
}

const KANJI_STROKE_TIPS: Record<string, string> = {
  一: 'Satu garis mendatar mantap dari kiri ke kanan.',
  二: '1) Garis datar atas lebih pendek → 2) Garis datar bawah lebih panjang.',
  三: '1) Atas sedang → 2) Tengah pendek → 3) Bawah paling panjang.',
  四: '1–2) Buat kerangka kotak kiri & atas-kanan → 3–4) Isi dua kaki di dalam → 5) Tutup alas paling akhir.',
  五: '1) Datar atas → 2) Tiang miring tengah → 3) Sudut kanan → 4) Alas datar panjang.',
  六: '1) Titik atas → 2) Palang datar → 3) Kaki kiri → 4) Kaki kanan.',
  七: '1) Garis miring naik ke kanan → 2) Tiang turun lalu belok datar ke kanan berkait.',
  八: '1) Kaki kiri pendek miring → 2) Kaki kanan mulai lebih tinggi melengkung ke kanan.',
  九: '1) Goresan miring turun kiri → 2) Garis datar belok turun lalu melenting ke atas.',
  十: '1) Garis datar dulu dari kiri ke kanan → 2) Garis tegak memotong tengah dari atas ke bawah.',
  日: '1) Tiang kiri → 2) Atap + tiang kanan → 3) Garis tengah → 4) Tutup alas paling akhir.',
  月: '1) Tiang kiri melengkung keluar → 2) Atap + tiang kanan berkait → 3–4) Dua garis datar di dalam.',
  火: '1–2) Dua titik api di kiri & kanan dulu → 3–4) Bentuk orang (人) di tengah.',
  水: '1) Tiang tengah berkait dulu → 2) Sayap kiri menyudut → 3–4) Dua goresan kanan.',
  木: '1) Datar atas → 2) Tiang tengah → 3) Akar kiri → 4) Akar kanan.',
  土: '1) Datar pendek atas → 2) Tiang tegak tengah → 3) Alas datar panjang bawah.',
  山: '1) Puncak tengah tegak dulu → 2) Sisi kiri + alas → 3) Sisi kanan penutup.',
  川: 'Tiga aliran sungai dari kiri ke kanan: kiri melengkung, tengah pendek, kanan paling panjang.',
  田: '1–2) Kerangka luar → 3–4) Tanda tambah (+) di dalam (tegak lalu datar) → 5) Tutup alas.',
  人: '1) Miring panjang ke kiri bawah → 2) Kaki kanan menopang dari tengah ke kanan bawah.',
  口: '1) Tiang kiri → 2) Atap + tiang kanan → 3) Garis alas penutup.',
  目: 'Sama seperti 日, tapi punya 2 garis datar di dalam sebelum ditutup alasnya.',
  手: '1) Goresan miring atas ke kiri → 2–3) Dua garis datar → 4) Tiang tengah berkait.',
  子: '1) Topi datar + turun miring → 2) Batang melengkung berkait → 3) Palang datar lebar.',
  女: '1) Tarikan menyudut く → 2) Goresan menyilang kanan ke kiri → 3) Garis datar lebar.',
  上: '1) Tiang tegak → 2) Cabang pendek ke kanan → 3) Alas datar bawah.',
  下: '1) Atap datar atas → 2) Tiang tegak → 3) Titik miring kanan.',
  中: '1–3) Buat kotak pipih 口 dulu → 4) Tiang tegak membelah tepat di tengah paling akhir.',
  大: '1) Palang datar → 2) Garis miring ke kiri bawah → 3) Garis miring ke kanan bawah.',
  小: '1) Tiang tengah berkait dulu → 2) Titik kiri → 3) Titik kanan.',
  本: 'Tulis pohon 木 dulu (4 goresan), lalu tambah 1 garis datar kecil di bagian akar.',
  心: '1) Titik kiri → 2) Lengkung besar berkait → 3) Titik tengah → 4) Titik kanan.',
  天: 'Dua garis datar dulu (atas lalu bawah), baru dua kaki miring kiri & kanan.',
  円: '1–2) Gerbang luar → 3) Tiang tengah atas → 4) Palang datar tengah.',
  国: '1–2) Kerangka luar 囗 → 3–7) Isi 玉 (permata) di dalam → 8) Tutup garis alas paling akhir.',
  学: '1–3) Tiga titik di atas → 4–5) Atap 冖 → 6–8) Tulis 子 di bawah.',
}

export function getKanaStrokeGuide(
  character: string,
  script?: KanaScriptType
): KanaStrokeGuide {
  const ch = character.trim()
  if (BASIC_KANA_GUIDES[ch]) {
    return BASIC_KANA_GUIDES[ch]
  }

  if (DAKUTEN_BASE_MAP[ch]) {
    const baseChar = DAKUTEN_BASE_MAP[ch]
    const base = BASIC_KANA_GUIDES[baseChar]
    if (base) {
      return {
        strokes: base.strokes + 2,
        tips: `${base.tips} + Tambah 2 titik tenten (゛) di kanan atas.`,
        points: [...base.points, p(78, 16, 'down-right'), p(87, 22, 'down-right')],
      }
    }
  }

  if (HANDAKUTEN_BASE_MAP[ch]) {
    const baseChar = HANDAKUTEN_BASE_MAP[ch]
    const base = BASIC_KANA_GUIDES[baseChar]
    if (base) {
      return {
        strokes: base.strokes + 1,
        tips: `${base.tips} + Tambah lingkaran kecil maru (゜) di kanan atas.`,
        points: [...base.points, p(82, 18, 'loop')],
      }
    }
  }

  const chars = Array.from(ch)
  if (chars.length === 2 && SMALL_YOON_STROKES[chars[1]] !== undefined) {
    const mainChar = chars[0]
    const smallChar = chars[1]
    const mainGuide = getKanaStrokeGuide(mainChar, script)
    const smallStrokes = SMALL_YOON_STROKES[smallChar]
    return {
      strokes: mainGuide.strokes + smallStrokes,
      tips: `1) Tulis huruf utama "${mainChar}" (${mainGuide.strokes} goresan) dulu. 2) Tambahkan "${smallChar}" berukuran 60% di kanan bawah (${smallStrokes} goresan).`,
      points: [
        ...mainGuide.points.slice(0, 3).map((pt) => p(Math.max(12, Math.round(pt.x * 0.68)), pt.y, pt.dir)),
        p(70, 56, 'curve'),
      ],
    }
  }

  const kanjiStrokes = KANJI_STROKE_COUNTS[ch]
  return {
    strokes: kanjiStrokes ?? (script === 'kanji' ? 4 : 2),
    tips:
      KANJI_STROKE_TIPS[ch] ??
      'Aturan baku Kanji: mulai dari atas ke bawah, kiri ke kanan, kerangka luar dulu, dan tutup kotak paling akhir.',
    points: KANJI_STROKE_POINTS[ch] ?? [],
  }
}
