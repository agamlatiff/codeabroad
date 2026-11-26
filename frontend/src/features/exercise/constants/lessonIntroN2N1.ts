import type { LessonIntroDeck } from './lessonIntroCards'

export interface LevelNodePreviewInfo {
  chips: string[]
  kanaScript?: 'hiragana' | 'katakana' | 'kanji'
  showGrammarLink?: boolean
  grammarCode?: string
}

export const LESSON_INTRO_DECKS_N2_N1: Record<string, LessonIntroDeck> = {
  // ============================================================================
  // JLPT N2 — UNIT 1: ～にあたって / ～にあたり (GP-JA-N2-001)
  // ============================================================================
  'n2-u1-kosakata': {
    headline: 'Kosakata Inti Peluncuran Proyek & Acara Resmi',
    subtitle:
      'Kuasai empat istilah kunci bisnis dan upacara formal Jepang yang sering muncul saat pembukaan proyek, rapat eksekutif, dan penandatanganan kontrak.',
    items: [
      {
        symbol: '実施',
        reading: 'jisshi',
        meaning: 'Pelaksanaan / implementasi resmi',
        mnemonic: 'Dipakai untuk proyek, kebijakan, atau survei berskala organisasi, bukan kegiatan santai sehari-hari.',
        speakText: '実施',
      },
      {
        symbol: '方針',
        reading: 'houshin',
        meaning: 'Arah kebijakan / pedoman strategis',
        mnemonic: 'Secara harfiah berarti "jarum kompas"; menunjukkan arah besar perusahaan atau tim.',
        speakText: '方針',
      },
      {
        symbol: '開会',
        reading: 'kaikai',
        meaning: 'Pembukaan rapat, seminar, atau upacara',
        mnemonic: 'Lawan katanya 閉会 (heikai: penutupan). Sering berpasangan dengan にあたり dalam sambutan MC.',
        speakText: '開会',
      },
      {
        symbol: '契約を結ぶ',
        reading: 'keiyaku o musubu',
        meaning: 'Menandatangani / mengikat kontrak resmi',
        mnemonic: 'Verba 結ぶ (mengikat) adalah kolokasi baku bisnis N2 untuk pengesahan perjanjian kerja atau dagang.',
        speakText: '契約を結ぶ',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 実施 (jisshi: pelaksanaan program resmi) dengan 実験 (jikken: eksperimen laboratorium) atau 実行 (jikkou: eksekusi rencana pribadi/sistem).',
  },
  'n2-u1-pola-utama': {
    headline: 'Pola Utama: ～にあたって / ～にあたり',
    subtitle:
      'Pahami struktur formal untuk menyatakan momen penting yang akan dimulai beserta persiapan atau ucapan resmi yang menyertainya.',
    items: [
      {
        symbol: '設立するにあたって',
        reading: 'setsuritsu suru ni atatte',
        meaning: 'Menjelang pendirian (kantor cabang/perusahaan)',
        mnemonic: 'Verba sebelum にあたって selalu memakai bentuk kamus (設立する), bukan bentuk lampau.',
        speakText: '設立するにあたって',
      },
      {
        symbol: '開会式を始めるにあたり',
        reading: 'kaikaishiki o hajimeru ni atari',
        meaning: 'Pada kesempatan dimulainya upacara pembukaan',
        mnemonic: '～にあたり adalah bentuk lebih ringkas dan lebih formal dari ～にあたって, lazim di pidato dan dokumen.',
        speakText: '開会式を始めるにあたり',
      },
      {
        symbol: '開始にあたって',
        reading: 'kaishi ni atatte',
        meaning: 'Menjelang dimulainya (suatu program/semester)',
        mnemonic: 'Kata benda peristiwa langsung diikuti にあたって tanpa partikel の.',
        speakText: '開始にあたって',
      },
      {
        symbol: '発売するにあたり',
        reading: 'hatsubai suru ni atari',
        meaning: 'Dalam rangka peluncuran produk baru',
        mnemonic: 'Selalu dipakai untuk momen khusus/positif yang direncanakan, bukan kejadian sepele harian.',
        speakText: '発売するにあたり',
      },
    ],
    contrastiveTip:
      'Jangan pakai ～にあたって untuk kejadian rutin sepele seperti makan siang atau tidur; gunakan hanya untuk titik awal yang bermakna besar atau formal.',
  },
  'n2-u1-dengar-baca': {
    headline: 'Pengumuman Kampus, Seminar & Memo Kantor',
    subtitle:
      'Kenali frasa formal yang sering terdengar dalam pengumuman sistem baru, sambutan wisuda, dan instruksi registrasi seminar.',
    items: [
      {
        symbol: '導入にあたり',
        reading: 'dounyuu ni atari',
        meaning: 'Menjelang adopsi / penerapan (sistem baru)',
        mnemonic: '導入 (dounyuu) adalah kata kunci korporat saat memperkenalkan perangkat lunak atau aturan baru.',
        speakText: '導入にあたり',
      },
      {
        symbol: '卒業式にあたり',
        reading: 'sotsugyoushiki ni atari',
        meaning: 'Pada kesempatan upacara kelulusan',
        mnemonic: 'Sering diikuti ungkapan syukur formal seperti 深く御礼申し上げます.',
        speakText: '卒業式にあたり',
      },
      {
        symbol: '参加にあたっては',
        reading: 'sanka ni atatte wa',
        meaning: 'Khususnya dalam rangka keikutsertaan',
        mnemonic: 'Tambahan partikel は menegaskan syarat wajib yang harus dipenuhi peserta sebelum acara.',
        speakText: '参加にあたっては',
      },
      {
        symbol: '監査を迎えるにあたり',
        reading: 'kansa o mukaeru ni atari',
        meaning: 'Menjelang menghadapi audit resmi',
        mnemonic: '迎える (mukaeru: menyambut/menghadapi) wajib tetap dalam bentuk kamus sebelum にあたり.',
        speakText: '監査を迎えるにあたり',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～にあたって (menjelang momen positif/penting) dengan ～に際して (pada saat kejadian, bisa netral maupun formal seperti keberangkatan atau musibah).',
  },
  'n2-u1-bicara-rakit': {
    headline: 'Pidato Sambutan & Persiapan Profesional',
    subtitle:
      'Latih kolokasi lisan dan tulisan bisnis untuk menjelaskan jadwal kerja sama, ekspansi pasar, dan salam perpisahan mutasi kerja.',
    items: [
      {
        symbol: '契約の締結にあたって',
        reading: 'keiyaku no teiketsu ni atatte',
        meaning: 'Menjelang penandatanganan resmi kontrak',
        mnemonic: '締結 (teiketsu) lebih resmi daripada 結ぶ, lazim untuk perjanjian antarperusahaan atau antarnegara.',
        speakText: '契約の締結にあたって',
      },
      {
        symbol: '海外へ進出するにあたり',
        reading: 'kaigai e shinshutsu suru ni atari',
        meaning: 'Dalam rangka ekspansi ke pasar luar negeri',
        mnemonic: '進出する berarti merambah pasar baru; sangat sering muncul di presentasi strategi bisnis.',
        speakText: '海外へ進出するにあたり',
      },
      {
        symbol: '今回の提携にあたって',
        reading: 'konkai no teikei ni atatte',
        meaning: 'Menjelang kerja sama/aliansi kali ini',
        mnemonic: '提携 (teikei) merujuk pada kemitraan strategis dua lembaga atau perusahaan.',
        speakText: '今回の提携にあたって',
      },
      {
        symbol: '転勤にあたり',
        reading: 'tenkin ni atari',
        meaning: 'Pada kesempatan pindah tugas (mutasi)',
        mnemonic: 'Ungkapan standar dalam email perpisahan kantor Jepang sebelum pindah ke cabang kota lain.',
        speakText: '転勤にあたり',
      },
    ],
    contrastiveTip:
      'Saat menyusun kalimat dengan ～にあたって, hindari menggunakan kata kerja bentuk lampau (-た) di depannya; selalu gunakan bentuk kamus atau nomina.',
  },

  // ============================================================================
  // JLPT N2 — UNIT 2: ～に伴って / ～に伴い / ～に伴う (GP-JA-N2-002)
  // ============================================================================
  'n2-u2-kosakata': {
    headline: 'Kosakata Tren Ekonomi & Perubahan Sosial',
    subtitle:
      'Pelajari istilah berita ekonomi dan demografi yang menjadi fondasi wacana perubahan masyarakat Jepang modern.',
    items: [
      {
        symbol: '物価',
        reading: 'bukka',
        meaning: 'Tingkat harga barang kebutuhan secara umum',
        mnemonic: 'Berbeda dari 値段 (harga satu barang); 物価 merujuk pada indeks harga ekonomi nasional.',
        speakText: '物価',
      },
      {
        symbol: '普及',
        reading: 'fukyuu',
        meaning: 'Penyebaran luas (teknologi/kebiasaan)',
        mnemonic: 'Sering dipasangkan dengan スマートフォン, AI, atau リモートワーク.',
        speakText: '普及',
      },
      {
        symbol: '少子高齢化',
        reading: 'shoushi koureika',
        meaning: 'Penurunan angka kelahiran dan penuaan penduduk',
        mnemonic: 'Gabungan 少子 (sedikit anak) + 高齢化 (menua); topik utama berita demografi N2.',
        speakText: '少子高齢化',
      },
      {
        symbol: '需要が高まる',
        reading: 'juyou ga takamaru',
        meaning: 'Permintaan pasar meningkat',
        mnemonic: '需要 (permintaan) berpasangan dengan 供給 (kyoukyuu: pasokan) dalam analisis ekonomi.',
        speakText: '需要が高まる',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 物価 (bukka: tingkat harga barang di ekonomi makro) dengan 価値 (kachi: nilai intrinsik suatu hal).',
  },
  'n2-u2-pola-utama': {
    headline: 'Pola Utama: ～に伴って / ～に伴い / ～に伴う',
    subtitle:
      'Kuasai tiga varian bentuk untuk menghubungkan dua perubahan yang bergerak beriringan secara objektif.',
    items: [
      {
        symbol: '発展に伴って',
        reading: 'hatten ni tomonatte',
        meaning: 'Seiring dengan perkembangan',
        mnemonic: 'Menghubungkan perubahan A dengan perubahan B yang terjadi secara paralel.',
        speakText: '発展に伴って',
      },
      {
        symbol: '変化に伴い',
        reading: 'henka ni tomonai',
        meaning: 'Seiring perubahan (gaya tulisan resmi)',
        mnemonic: '～に伴い adalah bentuk tulis lebih ringkas dari ～に伴って, dominan di artikel koran.',
        speakText: '変化に伴い',
      },
      {
        symbol: '拡大に伴う課題',
        reading: 'kakudai ni tomonau kadai',
        meaning: 'Tantangan yang menyertai ekspansi',
        mnemonic: 'Gunakan ～に伴う (tanpa て) saat pola ini langsung menerangkan kata benda di belakangnya.',
        speakText: '拡大に伴う課題',
      },
      {
        symbol: '景気の回復に伴って',
        reading: 'keiki no kaifuku ni tomonatte',
        meaning: 'Seiring pemulihan kondisi ekonomi',
        mnemonic: '景気 (keiki: iklim ekonomi) + 回復 (pemulihan) lazim diikuti meningkatnya rekrutmen.',
        speakText: '景気の回復に伴って',
      },
    ],
    contrastiveTip:
      'Jangan salah sambung bentuk modifikator: sebelum kata benda wajib memakai ～に伴う + N, bukan ～に伴っての + N.',
  },
  'n2-u2-dengar-baca': {
    headline: 'Berita Ekonomi, Infrastruktur & Inovasi',
    subtitle:
      'Cermati bagaimana media Jepang melaporkan dampak pembukaan infrastruktur baru dan ekspansi pasar regional.',
    items: [
      {
        symbol: '新駅の開業に伴い',
        reading: 'shin-eki no kaigyou ni tomonai',
        meaning: 'Seiring dibukanya stasiun baru',
        mnemonic: '開業 (kaigyou) dipakai untuk mulai beroperasinya stasiun, jalur kereta, atau praktik bisnis.',
        speakText: '新駅の開業に伴い',
      },
      {
        symbol: '周辺の地価',
        reading: 'shuuhen no chika',
        meaning: 'Harga tanah di area sekitar',
        mnemonic: '地価 (chika) berarti nilai jual tanah; sering naik seiring pembangunan fasilitas publik.',
        speakText: '周辺の地価',
      },
      {
        symbol: '市場の拡大に伴い',
        reading: 'shijou no kakudai ni tomonai',
        meaning: 'Seiring meluasnya pasar',
        mnemonic: '市場 dibaca shijou dalam konteks ekonomi/pasar global (bukan ichiba yang berarti pasar tradisional).',
        speakText: '市場の拡大に伴い',
      },
      {
        symbol: '語学力のある人材',
        reading: 'gogakuryoku no aru jinzai',
        meaning: 'SDM yang memiliki kemampuan bahasa asing',
        mnemonic: '人材 (jinzai) adalah istilah korporat untuk talenta atau sumber daya manusia berkualitas.',
        speakText: '語学力のある人材',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～に伴って (dua perubahan nyata yang paralel, bisa besar/skala makro) dengan ～につれて (perubahan satu arah yang bertahap dan alami seperti bertambah tua).',
  },
  'n2-u2-bicara-rakit': {
    headline: 'Analisis Perubahan & Dampak Sosial',
    subtitle:
      'Rangkai kalimat analitis untuk menjelaskan efek samping tren digitalisasi, perubahan iklim, dan pola konsumsi.',
    items: [
      {
        symbol: 'ネット通販の普及に伴って',
        reading: 'netto tsuuhan no fukyuu ni tomonatte',
        meaning: 'Seiring meluasnya belanja daring',
        mnemonic: '通販 (tsuuhan) adalah singkatan 通信販売 (penjualan jarak jauh/e-commerce).',
        speakText: 'ネット通販の普及に伴って',
      },
      {
        symbol: '配達員の負担',
        reading: 'haitatsuin no futan',
        meaning: 'Beban kerja kurir pengantar',
        mnemonic: '負担が増える (beban bertambah) adalah pasangan alami dalam wacana dampak sosial.',
        speakText: '配達員の負担',
      },
      {
        symbol: '気温の上昇に伴い',
        reading: 'kion no joushou ni tomonai',
        meaning: 'Seiring naiknya suhu udara',
        mnemonic: '上昇 (joushou: kenaikan) digunakan untuk angka, suhu, harga, dan statistik.',
        speakText: '気温の上昇に伴い',
      },
      {
        symbol: '異常気象',
        reading: 'ijou kishou',
        meaning: 'Cuaca ekstrem / anomali iklim',
        mnemonic: 'Istilah berita cuaca dan lingkungan yang sangat sering diujikan di pemahaman bacaan N2.',
        speakText: '異常気象',
      },
    ],
    contrastiveTip:
      'Dalam ～に伴って, kedua klausa harus menunjukkan perubahan atau dampak langsung; hindari memasangkannya dengan kalimat perintah atau ajakan pribadi.',
  },

  // ============================================================================
  // JLPT N2 — UNIT 3: ～に限らず (GP-JA-N2-003)
  // ============================================================================
  'n2-u3-kosakata': {
    headline: 'Kosakata Analisis Pasar & Keragaman Global',
    subtitle:
      'Kuasai kata benda kunci untuk membahas segmentasi konsumen, lintas generasi, dan inklusivitas layanan.',
    items: [
      {
        symbol: '世代',
        reading: 'sedai',
        meaning: 'Generasi / kelompok usia',
        mnemonic: 'Sering dipakai dalam ungkapan 世代を問わず atau 若い世代に限らず.',
        speakText: '世代',
      },
      {
        symbol: '顧客',
        reading: 'kokyaku',
        meaning: 'Pelanggan / klien bisnis',
        mnemonic: 'Lebih formal dan analitis daripada お客さん; umum dalam laporan pemasaran.',
        speakText: '顧客',
      },
      {
        symbol: '多様性',
        reading: 'tayousei',
        meaning: 'Keragaman / diversitas',
        mnemonic: 'Padanan resmi "diversity" dalam wacana bisnis, budaya, dan kebijakan publik Jepang.',
        speakText: '多様性',
      },
      {
        symbol: '学び直し',
        reading: 'manabinaoshi',
        meaning: 'Belajar ulang / reskilling bagi pekerja dewasa',
        mnemonic: 'Istilah tren pendidikan modern (recurrent education) bagi kalangan 社会人.',
        speakText: '学び直し',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 世代 (sedai: generasi usia) dengan 時代 (jidai: era/zaman sejarah).',
  },
  'n2-u3-pola-utama': {
    headline: 'Pola Utama: ～に限らず',
    subtitle:
      'Pelajari cara memperluas cakupan pernyataan dari satu contoh spesifik ke lingkup yang jauh lebih luas.',
    items: [
      {
        symbol: '国内に限らず',
        reading: 'kokunai ni kagirazu',
        meaning: 'Tidak terbatas di dalam negeri saja',
        mnemonic: 'Langsung menempel pada kata benda (N + に限らず), lalu klausa berikutnya biasanya memakai も.',
        speakText: '国内に限らず',
      },
      {
        symbol: '食品に限らず、衣類にも',
        reading: 'shokuhin ni kagirazu, irui ni mo',
        meaning: 'Tidak terbatas pada makanan, meluas ke pakaian juga',
        mnemonic: 'Pola pasangan klasik: Aに限らず、Bも (tidak hanya A, tetapi juga B).',
        speakText: '食品に限らず、衣類にも',
      },
      {
        symbol: '学生に限らず',
        reading: 'gakusei ni kagirazu',
        meaning: 'Tidak terbatas pada mahasiswa/pelajar saja',
        mnemonic: 'Dipakai untuk menegaskan bahwa suatu layanan terbuka bagi kalangan yang lebih luas.',
        speakText: '学生に限らず',
      },
      {
        symbol: 'IT分野に限らず',
        reading: 'ai-tii bunya ni kagirazu',
        meaning: 'Tidak terbatas pada bidang TI saja',
        mnemonic: '分野 (bunya: bidang/sektor) sangat produktif dipasangkan dengan ～に限らず.',
        speakText: 'IT分野に限らず',
      },
    ],
    contrastiveTip:
      'Jangan pasang ～に限らず setelah kata kerja langsung; pola ini hanya menempel pada kata benda (N + に限らず).',
  },
  'n2-u3-dengar-baca': {
    headline: 'Layanan Inklusif & Dinamika Pasar Global',
    subtitle:
      'Simak penggunaan ～に限らず dalam ulasan bisnis kuliner, tren kafe perkotaan, dan jangkauan layanan pelanggan.',
    items: [
      {
        symbol: '平日に限らず、週末も',
        reading: 'heijitsu ni kagirazu, shuumatsu mo',
        meaning: 'Tidak terbatas pada hari kerja, akhir pekan juga',
        mnemonic: 'Menunjukkan konsistensi keramaian atau ketersediaan layanan sepanjang minggu.',
        speakText: '平日に限らず、週末も',
      },
      {
        symbol: '和食に限らず',
        reading: 'washoku ni kagirazu',
        meaning: 'Tidak terbatas pada masakan Jepang saja',
        mnemonic: '和食 (washoku) merujuk pada kuliner tradisional Jepang secara keseluruhan.',
        speakText: '和食に限らず',
      },
      {
        symbol: 'ビジネス客で賑わう',
        reading: 'bijinesukyaku de nigiwau',
        meaning: 'Ramai oleh pengunjung pebisnis',
        mnemonic: '賑わう (nigiwau) menggambarkan suasana tempat yang ramai dan hidup secara positif.',
        speakText: 'ビジネス客で賑わう',
      },
      {
        symbol: '広く活用されている',
        reading: 'hiroku katsuyou sarete iru',
        meaning: 'Dimanfaatkan secara luas',
        mnemonic: '活用する (memanfaatkan secara optimal) sering mengiringi kalimat dengan ～に限らず.',
        speakText: '広く活用されている',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～に限らず (tidak terbatas pada A, B juga termasuk) dengan ～に限って (justru khusus pada A saja, sering bernuansa kebetulan buruk).',
  },
  'n2-u3-bicara-rakit': {
    headline: 'Presentasi Cakupan & Keragaman',
    subtitle:
      'Susun argumen presentasi yang menegaskan inklusivitas gender, kesehatan sepanjang tahun, dan jangkauan pasar.',
    items: [
      {
        symbol: '男性に限らず、女性も',
        reading: 'dansei ni kagirazu, josei mo',
        meaning: 'Tidak terbatas pada pria, wanita juga',
        mnemonic: 'Struktur tegas untuk menyajikan kesetaraan peran di dunia kerja dan teknologi.',
        speakText: '男性に限らず、女性も',
      },
      {
        symbol: '技術分野で活躍する',
        reading: 'gijutsu bunya de katsuyaku suru',
        meaning: 'Berperan aktif / berkiprah di bidang teknologi',
        mnemonic: '活躍する (katsuyaku suru) bermakna berkontribusi menonjol dan sukses di suatu bidang.',
        speakText: '技術分野で活躍する',
      },
      {
        symbol: '夏に限らず、一年中',
        reading: 'natsu ni kagirazu, ichinenjuu',
        meaning: 'Tidak terbatas pada musim panas, sepanjang tahun',
        mnemonic: '一年中 (ichinenjuu) memperluas rentang waktu dari satu musim ke seluruh tahun.',
        speakText: '夏に限らず、一年中',
      },
      {
        symbol: 'こまめな水分補給',
        reading: 'komame na suibun hokyuu',
        meaning: 'Asupan cairan secara rutin dan berkala',
        mnemonic: 'こまめな berarti telaten/sedikit demi sedikit tetapi sering; umum di imbauan kesehatan Jepang.',
        speakText: 'こまめな水分補給',
      },
    ],
    contrastiveTip:
      'Selalu cek apakah klausa kedua memakai partikel も atau kata perluasan seperti 広く/一年中 agar nuansa ～に限らず tersampaikan utuh.',
  },

  // ============================================================================
  // JLPT N2 — UNIT 4: ～わけにはいかない (GP-JA-N2-004)
  // ============================================================================
  'n2-u4-kosakata': {
    headline: 'Kosakata Etika Kerja & Komitmen Profesional',
    subtitle:
      'Pahami kosakata kunci seputar kerahasiaan data, tenggat proyek, dan tanggung jawab posisi kerja di perusahaan Jepang.',
    items: [
      {
        symbol: '機密',
        reading: 'kimitsu',
        meaning: 'Rahasia penting / informasi konfidensial',
        mnemonic: 'Sering muncul dalam bentuk 機密情報 (informasi rahasia perusahaan) yang tidak boleh bocor.',
        speakText: '機密',
      },
      {
        symbol: '納期',
        reading: 'nouki',
        meaning: 'Tenggat penyerahan barang atau proyek',
        mnemonic: '納期を守る (mematuhi tenggat) adalah salah satu prinsip etika kerja terketat di Jepang.',
        speakText: '納期',
      },
      {
        symbol: '立場',
        reading: 'tachiba',
        meaning: 'Posisi / kedudukan / sudut pandang peran',
        mnemonic: 'Menunjukkan tanggung jawab sosial atau jabatan seseorang dalam organisasi.',
        speakText: '立場',
      },
      {
        symbol: '約束を破る',
        reading: 'yakusoku o yaburu',
        meaning: 'Mengingkari janji',
        mnemonic: 'Sering dipadukan dengan わけにはいかない untuk menegaskan integritas pribadi.',
        speakText: '約束を破る',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 納期 (nouki: tenggat pengiriman/penyelesaian proyek klien) dengan 締め切り (shimekiri: batas akhir pendaftaran/pengumpulan umum).',
  },
  'n2-u4-pola-utama': {
    headline: 'Pola Utama: ～わけにはいかない / ～ないわけにはいかない',
    subtitle:
      'Bedakan dua sisi pola etika N2: "tidak mungkin / tidak pantas melakukan" versus "mau tidak mau harus melakukan".',
    items: [
      {
        symbol: '休むわけにはいかない',
        reading: 'yasumu wake ni wa ikanai',
        meaning: 'Tidak bisa begitu saja mengambil libur/absen',
        mnemonic: 'V-dict + わけにはいかない menyatakan larangan moral, etika, atau akal sehat, bukan ketidakmampuan fisik.',
        speakText: '休むわけにはいかない',
      },
      {
        symbol: '途中で諦めるわけにはいかない',
        reading: 'tochuu de akirameru wake ni wa ikanai',
        meaning: 'Tidak bisa menyerah di tengah jalan',
        mnemonic: 'Menegaskan komitmen kuat karena sudah berjanji atau melibatkan banyak pihak.',
        speakText: '途中で諦めるわけにはいかない',
      },
      {
        symbol: '引き受けないわけにはいかない',
        reading: 'hikiukenai wake ni wa ikanai',
        meaning: 'Mau tidak mau harus menerima (tawaran/tugas)',
        mnemonic: 'Negasi ganda (V-ない + わけにはいかない) artinya secara etika tidak bisa menolak sehingga harus dilakukan.',
        speakText: '引き受けないわけにはいかない',
      },
      {
        symbol: '帰るわけにはいかない',
        reading: 'kaeru wake ni wa ikanai',
        meaning: 'Tidak bisa pulang begitu saja',
        mnemonic: 'Secara fisik bisa pulang, tetapi rasa tanggung jawab menahan pembicara tetap menyelesaikan tugas.',
        speakText: '帰るわけにはいかない',
      },
    ],
    contrastiveTip:
      'Hati-hati membalik makna! V-dict + わけにはいかない = tidak bisa melakukan; V-ない + わけにはいかない = tidak bisa tidak melakukan (harus melakukan).',
  },
  'n2-u4-dengar-baca': {
    headline: 'Dilema Etika & Keputusan Kerja Sehari-hari',
    subtitle:
      'Amati situasi nyata di kantor dan kehidupan sosial Jepang ketika norma dan empati membatasi pilihan seseorang.',
    items: [
      {
        symbol: 'お酒を飲むわけにはいかない',
        reading: 'osake o nomu wake ni wa ikanai',
        meaning: 'Tidak boleh minum alkohol (karena harus menyetir)',
        mnemonic: 'Contoh klasik alasan hukum dan keselamatan yang melarang suatu tindakan.',
        speakText: 'お酒を飲むわけにはいかない',
      },
      {
        symbol: '黙って見ているわけにはいかない',
        reading: 'damatte mite iru wake ni wa ikanai',
        meaning: 'Tidak bisa hanya diam melihat saja',
        mnemonic: 'Dipakai saat rekan kerja kesulitan dan empati mendorong kita untuk ikut membantu.',
        speakText: '黙って見ているわけにはいかない',
      },
      {
        symbol: '対応しないわけにはいかない',
        reading: 'taiou shinai wake ni wa ikanai',
        meaning: 'Mau tidak mau harus menanggapi/menangani',
        mnemonic: '対応する (taiou suru) adalah verba bisnis penting untuk merespons keluhan atau permintaan klien.',
        speakText: '対応しないわけにはいかない',
      },
      {
        symbol: '最終確認',
        reading: 'saishuu kakunin',
        meaning: 'Pemeriksaan terakhir sebelum eksekusi',
        mnemonic: 'Sangat lazim sebelum presentasi, pengiriman barang, atau rilis sistem.',
        speakText: '最終確認',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～わけにはいかない (terikat etika/tanggung jawab) dengan ～わけがない (mustahil secara logika/fakta).',
  },
  'n2-u4-bicara-rakit': {
    headline: 'Menegaskan Komitmen & Batasan Profesional',
    subtitle:
      'Latih ungkapan tegas namun sopan untuk menjelaskan mengapa permintaan klien harus dijaga dan laporan tidak boleh ditelantarkan.',
    items: [
      {
        symbol: 'お取引先からのご依頼',
        reading: 'otorihikisaki kara no go-irai',
        meaning: 'Permintaan dari mitra bisnis/klien lama',
        mnemonic: '取引先 (torihikisaki) adalah sebutan hormat untuk perusahaan rekanan bisnis.',
        speakText: 'お取引先からのご依頼',
      },
      {
        symbol: '断るわけにはいきません',
        reading: 'kotowaru wake ni wa ikimasen',
        meaning: 'Tidak mungkin menolaknya',
        mnemonic: 'Bentuk sopan ～ません dipakai saat berbicara dengan atasan atau klien.',
        speakText: '断るわけにはいきません',
      },
      {
        symbol: '放っておくわけにはいかない',
        reading: 'houtte oku wake ni wa ikanai',
        meaning: 'Tidak bisa membiarkannya terbengkalai',
        mnemonic: '放っておく (houtte oku) berarti membiarkan masalah tanpa penanganan.',
        speakText: '放っておくわけにはいかない',
      },
      {
        symbol: '一度約束した以上',
        reading: 'ichido yakusoku shita ijou',
        meaning: 'Karena sudah terlanjur berjanji sekali',
        mnemonic: 'Pola ～た以上 sering menjadi pembuka alasan kuat sebelum ～わけにはいかない.',
        speakText: '一度約束した以上',
      },
    ],
    contrastiveTip:
      'Jika ingin terdengar profesional di rapat, padukan alasan objektif (seperti 責任 atau 取引先) dengan ～わけにはいきません.',
  },

  // ============================================================================
  // JLPT N2 — UNIT 5: ～ざるを得ない (GP-JA-N2-005)
  // ============================================================================
  'n2-u5-kosakata': {
    headline: 'Kosakata Manajemen Krisis & Negosiasi',
    subtitle:
      'Siapkan kosakata inti korporat saat perusahaan menghadapi pembatalan proyek, penarikan pasar, dan keterbatasan anggaran.',
    items: [
      {
        symbol: '中止',
        reading: 'chuushi',
        meaning: 'Pembatalan / penghentian total',
        mnemonic: 'Berbeda dengan 延期 (enki: penundaan); 中止 berarti acara atau proyek tidak jadi dilaksanakan.',
        speakText: '中止',
      },
      {
        symbol: '撤退',
        reading: 'tettai',
        meaning: 'Penarikan diri / mundur dari pasar atau bisnis',
        mnemonic: 'Sering dipakai dalam berita ekonomi saat cabang atau lini produk dihentikan.',
        speakText: '撤退',
      },
      {
        symbol: '予算',
        reading: 'yosan',
        meaning: 'Anggaran biaya',
        mnemonic: '予算を削る (memangkas anggaran) adalah kolokasi yang sangat sering muncul di N2.',
        speakText: '予算',
      },
      {
        symbol: '部品の供給',
        reading: 'buhin no kyoukyuu',
        meaning: 'Pasokan suku cadang/komponen',
        mnemonic: 'Gangguan rantai pasok (供給の遅れ) sering menjadi penyebab keputusan darurat.',
        speakText: '部品の供給',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 中止 (chuushi: dibatalkan) dengan 延期 (enki: ditunda ke waktu lain) atau 中断 (chuudan: dihentikan sementara).',
  },
  'n2-u5-pola-utama': {
    headline: 'Pola Utama: ～ざるを得ない & Pengecualian せざるを得ない',
    subtitle:
      'Pelajari cara membentuk pola formal "terpaksa harus melakukan karena tidak ada pilihan lain", termasuk pengecualian verba する.',
    items: [
      {
        symbol: '変更せざるを得ない',
        reading: 'henkou sezaru o enai',
        meaning: 'Terpaksa harus mengubah (rencana)',
        mnemonic: 'Pengecualian wajib hapal: する berubah menjadi せざるを得ない (bukan しざるを得ない).',
        speakText: '変更せざるを得ない',
      },
      {
        symbol: '削らざるを得ない',
        reading: 'kezurazaru o enai',
        meaning: 'Terpaksa harus memangkas (anggaran/biaya)',
        mnemonic: 'Ambil bentuk ない (削らない), ganti ない menjadi ざるを得ない.',
        speakText: '削らざるを得ない',
      },
      {
        symbol: '認めざるを得ない',
        reading: 'mitomezaru o enai',
        meaning: 'Terpaksa harus mengakui (fakta/kesalahan)',
        mnemonic: 'Verba ichidan 認める menjadi 認め + ざるを得ない; lazim saat bukti tidak terbantahkan.',
        speakText: '認めざるを得ない',
      },
      {
        symbol: '引き上げざるを得ない',
        reading: 'hikiagezaru o enai',
        meaning: 'Terpaksa harus menaikkan (harga jual)',
        mnemonic: '引き上げる berarti menaikkan tarif atau harga; sering diikuti なくなりました untuk situasi baru.',
        speakText: '引き上げざるを得ない',
      },
    ],
    contrastiveTip:
      'Jebakan paling sering di JLPT N2: する + ざるを得ない WAJIB menjadi せざるを得ない, bukan しざるを得ない!',
  },
  'n2-u5-dengar-baca': {
    headline: 'Berita Krisis & Negosiasi Bisnis',
    subtitle:
      'Pahami nuansa keterpaksaan dalam perundingan kontrak, pengunduran diri dari panitia, dan pembatalan rencana.',
    items: [
      {
        symbol: '妥協せざるを得ない',
        reading: 'dakyou sezaru o enai',
        meaning: 'Terpaksa harus berkompromi',
        mnemonic: '妥協する (berkompromi) sering muncul saat tenggat ketat memaksa kedua pihak mengalah.',
        speakText: '妥協せざるを得ない',
      },
      {
        symbol: '断念せざるを得ない',
        reading: 'dannen sezaru o enai',
        meaning: 'Terpaksa harus mengurungkan/menyerah pada rencana',
        mnemonic: '断念する adalah padanan formal dari 諦める dalam konteks bisnis dan proyek.',
        speakText: '断念せざるを得ない',
      },
      {
        symbol: '同意せざるを得ない',
        reading: 'doui sezaru o enai',
        meaning: 'Terpaksa harus menyetujui',
        mnemonic: 'Menunjukkan persetujuan berat hati karena kondisi atau argumen lawan tidak terbantahkan.',
        speakText: '同意せざるを得ない',
      },
      {
        symbol: '辞退せざるを得なくなった',
        reading: 'jitai sezaru o enakunatta',
        meaning: 'Menjadi terpaksa mengundurkan diri/menolak peran',
        mnemonic: '辞退する berarti menolak atau mundur dengan sopan dari jabatan, undangan, atau tawaran.',
        speakText: '辞退せざるを得なくなった',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～ざるを得ない (terpaksa oleh keadaan di luar kehendak pribadi, bernuansa berat hati) dengan ～ないわけにはいかない (terdorong rasa kewajiban atau etika sosial).',
  },
  'n2-u5-bicara-rakit': {
    headline: 'Menyampaikan Keputusan Berat secara Profesional',
    subtitle:
      'Rakit kalimat sopan dan lugas untuk mengabarkan pembatalan perjalanan dinas dan peninjauan ulang strategi penjualan.',
    items: [
      {
        symbol: '取りやめざるを得ない',
        reading: 'toriyamezaru o enai',
        meaning: 'Terpaksa harus membatalkan (rencana/dinas)',
        mnemonic: '取りやめる adalah kata kerja halus untuk membatalkan jadwal yang sudah direncanakan.',
        speakText: '取りやめざるを得ない',
      },
      {
        symbol: '見直さざるを得ない',
        reading: 'minaosa-zaru o enai',
        meaning: 'Terpaksa harus meninjau ulang (strategi)',
        mnemonic: '見直す (minaosu: meninjau ulang) berubah menjadi 見直さ + ざるを得ない.',
        speakText: '見直さざるを得ない',
      },
      {
        symbol: '日程が重なる',
        reading: 'nittei ga kasanaru',
        meaning: 'Jadwal saling bertabrakan/berbenturan',
        mnemonic: 'Alasan profesional yang paling sering dipakai saat harus membatalkan rapat atau perjalanan.',
        speakText: '日程が重なる',
      },
      {
        symbol: '当初の計画',
        reading: 'tousho no keikaku',
        meaning: 'Rencana awal semula',
        mnemonic: '当初 (tousho) merujuk pada titik awal proyek sebelum terjadi perubahan situasi.',
        speakText: '当初の計画',
      },
    ],
    contrastiveTip:
      'Perhatikan bacaan 得ない pada ～ざるを得ない: selalu dibaca "enai" (dari 得る = eru), bukan "unai".',
  },

  // ============================================================================
  // JLPT N2 — UNIT 6: ～にもかかわらず (GP-JA-N2-006)
  // ============================================================================
  'n2-u6-kosakata': {
    headline: 'Kosakata Laporan Berita & Evaluasi Kontras',
    subtitle:
      'Kuasai istilah berita dan administrasi yang sering muncul dalam laporan hasil tak terduga atau cuaca ekstrem.',
    items: [
      {
        symbol: '悪天候',
        reading: 'akutenkou',
        meaning: 'Cuaca buruk / cuaca ekstrem',
        mnemonic: 'Bentuk formal berita untuk 悪い天気; sangat sering diikuti にもかかわらず.',
        speakText: '悪天候',
      },
      {
        symbol: '検証',
        reading: 'kenshou',
        meaning: 'Verifikasi / pengujian kebenaran',
        mnemonic: 'Dipakai untuk memeriksa keabsahan data, hipotesis, atau penyebab suatu masalah.',
        speakText: '検証',
      },
      {
        symbol: '費用',
        reading: 'hiyou',
        meaning: 'Biaya / ongkos pengeluaran',
        mnemonic: 'Lebih formal daripada お金; mencakup biaya produksi, perawatan, maupun penyelenggaraan.',
        speakText: '費用',
      },
      {
        symbol: '時間通りに到着する',
        reading: 'jikandoori ni touchaku suru',
        meaning: 'Tiba tepat sesuai jadwal',
        mnemonic: 'Sering menjadi fakta kontras setelah kondisi sulit seperti hujan lebat atau kemacetan.',
        speakText: '時間通りに到着する',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 検証 (kenshou: verifikasi/pembuktian menyeluruh) dengan 検査 (kensa: inspeksi fisik/medis/kualitas rutin).',
  },
  'n2-u6-pola-utama': {
    headline: 'Pola Utama: ～にもかかわらず (Verba, Adjektiva, Nomina)',
    subtitle:
      'Pelajari aturan penyambungan pola formal "meskipun / terlepas dari" yang menyatakan hasil bertolak belakang dari ekspektasi.',
    items: [
      {
        symbol: '激しい雨にもかかわらず',
        reading: 'hageshii ame ni mo kakawarazu',
        meaning: 'Meskipun hujan lebat',
        mnemonic: 'Kata benda dapat langsung diikuti にもかかわらず (atau memakai であるにもかかわらず).',
        speakText: '激しい雨にもかかわらず',
      },
      {
        symbol: '不便であるにもかかわらず',
        reading: 'fuben de aru ni mo kakawarazu',
        meaning: 'Meskipun tidak praktis/lokasinya sulit',
        mnemonic: 'Untuk adjektiva-na dan nomina, bentuk formalnya memakai ～である + にもかかわらず.',
        speakText: '不便であるにもかかわらず',
      },
      {
        symbol: '勉強したにもかかわらず',
        reading: 'benkyou shita ni mo kakawarazu',
        meaning: 'Meskipun sudah belajar dengan giat',
        mnemonic: 'Verba memakai bentuk biasa (biasanya lampau -た) di depan にもかかわらず.',
        speakText: '勉強したにもかかわらず',
      },
      {
        symbol: 'お忙しい中にもかかわらず',
        reading: 'oisogashii naka ni mo kakawarazu',
        meaning: 'Meskipun di tengah kesibukan Anda',
        mnemonic: 'Ungkapan sopan baku untuk berterima kasih atas kehadiran tamu atau klien.',
        speakText: 'お忙しい中にもかかわらず',
      },
    ],
    contrastiveTip:
      'Hati-hati pada penyambungan kata benda dan adjektiva-na: jangan selipkan な atau だ sebelum にもかかわらず (pakai langsung N/Na-adj + にもかかわらず atau ～であるにもかかわらず).',
  },
  'n2-u6-dengar-baca': {
    headline: 'Fakta Mengejutkan dalam Berita & Laporan',
    subtitle:
      'Pahami cara artikel berita dan penutur bisnis menyoroti kontras antara kondisi makro yang lemah dan performa yang kuat.',
    items: [
      {
        symbol: '景気が低迷しているにもかかわらず',
        reading: 'keiki ga teimei shite iru ni mo kakawarazu',
        meaning: 'Meskipun kondisi ekonomi sedang lesu',
        mnemonic: '低迷する (teimei suru: stagnan/lesu) sering muncul di berita ekonomi N2.',
        speakText: '景気が低迷しているにもかかわらず',
      },
      {
        symbol: '前年を上回る',
        reading: 'zennen o uwamawaru',
        meaning: 'Melampaui angka tahun sebelumnya',
        mnemonic: 'Lawan katanya 下回る (shitamawaru: di bawah target/tahun lalu).',
        speakText: '前年を上回る',
      },
      {
        symbol: 'それにもかかわらず',
        reading: 'sore ni mo kakawarazu',
        meaning: 'Meskipun demikian / kendati begitu',
        mnemonic: 'Dipakai sebagai konjungsi awal kalimat baru untuk menegaskan kontras kuat dengan kalimat sebelumnya.',
        speakText: 'それにもかかわらず',
      },
      {
        symbol: '未経験であるにもかかわらず',
        reading: 'mikeiken de aru ni mo kakawarazu',
        meaning: 'Meskipun belum memiliki pengalaman',
        mnemonic: '未経験 (mikeiken: tanpa pengalaman) sering muncul dalam evaluasi kinerja staf baru.',
        speakText: '未経験であるにもかかわらず',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～にもかかわらず (meskipun faktanya A, terjadi B yang kontras) dengan ～にかかわらず (terlepas dari A atau tidak, berlaku aturan yang sama).',
  },
  'n2-u6-bicara-rakit': {
    headline: 'Menyampaikan Kontras & Apresiasi Formal',
    subtitle:
      'Rangkai kalimat bisnis untuk mengapresiasi kehadiran tamu dari jauh serta menyampaikan ketidakpahaman secara sopan.',
    items: [
      {
        symbol: 'ご多忙にもかかわらず',
        reading: 'gotabou ni mo kakawarazu',
        meaning: 'Meskipun Anda sangat sibuk',
        mnemonic: 'ご多忙 adalah bentuk lebih ringkas dan sangat resmi dari お忙しい中 dalam surat/pidato.',
        speakText: 'ご多忙にもかかわらず',
      },
      {
        symbol: '遠方よりお越しいただく',
        reading: 'enpou yori okoshi itadaku',
        meaning: 'Berkenan datang dari tempat yang jauh',
        mnemonic: '遠方より (dari tempat jauh) + お越しいただく adalah salam sambutan eksekutif.',
        speakText: '遠方よりお越しいただく',
      },
      {
        symbol: '何度も説明を受けたにもかかわらず',
        reading: 'nando mo setsumei o uketa ni mo kakawarazu',
        meaning: 'Meskipun sudah menerima penjelasan berkali-kali',
        mnemonic: 'Menunjukkan rasa heran atau pengakuan jujur bahwa materi masih belum dipahami.',
        speakText: '何度も説明を受けたにもかかわらず',
      },
      {
        symbol: '満足できない結果',
        reading: 'manzoku dekinai kekka',
        meaning: 'Hasil yang belum memuaskan',
        mnemonic: 'Sering menjadi klausa penutup setelah upaya keras di klausa ～にもかかわらず.',
        speakText: '満足できない結果',
      },
    ],
    contrastiveTip:
      '～にもかかわらず lebih formal dan berjarak daripada ～のに; gunakan di rapat, email resmi, dan esai, bukan untuk keluhan emosional santai ke teman akrab.',
  },

  // ============================================================================
  // JLPT N2 — UNIT 7: ～上で (GP-JA-N2-007)
  // ============================================================================
  'n2-u7-kosakata': {
    headline: 'Kosakata Rapat Strategi & Pengambilan Keputusan',
    subtitle:
      'Kuasai kata kerja dan nomina kunci yang menjadi tahap persiapan sebelum keputusan bisnis atau kontrak diambil.',
    items: [
      {
        symbol: '検討',
        reading: 'kentou',
        meaning: 'Pertimbangan / kajian mendalam',
        mnemonic: '検討する berarti menelaah opsi secara serius sebelum memberi keputusan resmi.',
        speakText: '検討',
      },
      {
        symbol: '確認',
        reading: 'kakunin',
        meaning: 'Konfirmasi / pemeriksaan kepastian',
        mnemonic: '確認した上で (setelah memastikan) adalah frasa paling produktif di email kantor Jepang.',
        speakText: '確認',
      },
      {
        symbol: '理解',
        reading: 'rikai',
        meaning: 'Pemahaman menyeluruh',
        mnemonic: 'Sering dipasangkan dengan メリットとデメリット (kelebihan dan kekurangan).',
        speakText: '理解',
      },
      {
        symbol: '正式なスケジュール',
        reading: 'seishiki na sukejuuru',
        meaning: 'Jadwal resmi yang sudah ditetapkan',
        mnemonic: '正式な (seishiki na: resmi/sah) kontras dengan 仮の (kari no: sementara/tentatif).',
        speakText: '正式なスケジュール',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 検討 (kentou: menimbang opsi/kajian) dengan 検索 (kensaku: pencarian data di mesin pencari).',
  },
  'n2-u7-pola-utama': {
    headline: 'Pola Utama: V-た上で vs V-る / Nの上で',
    subtitle:
      'Bedakan dua fungsi besar ～上で: urutan tindakan "setelah melakukan A, barulah B" dan lingkup "dalam hal melakukan A".',
    items: [
      {
        symbol: '把握した上で',
        reading: 'haaku shita ue de',
        meaning: 'Setelah memahami/menguasai (situasi sepenuhnya)',
        mnemonic: 'V-た + 上で berarti "setelah menyelesaikan tahap A terlebih dahulu, barulah melakukan B".',
        speakText: '把握した上で',
      },
      {
        symbol: '確認した上で',
        reading: 'kakunin shita ue de',
        meaning: 'Setelah memeriksa dan memastikan',
        mnemonic: 'Menekankan bahwa tahap pertama adalah fondasi penting sebelum melangkah ke tahap kedua.',
        speakText: '確認した上で',
      },
      {
        symbol: '進める上で',
        reading: 'susumeru ue de',
        meaning: 'Dalam hal menjalankan / memajukan (proyek)',
        mnemonic: 'V-dict (bentuk kamus) + 上で berarti "dalam proses / ketika melakukan A, diperlukan B".',
        speakText: '進める上で',
      },
      {
        symbol: '仕事の上で',
        reading: 'shigoto no ue de',
        meaning: 'Dalam hal / berkaitan dengan pekerjaan',
        mnemonic: 'Kata benda + の上で menunjukkan bidang atau konteks tempat suatu hal penting berlaku.',
        speakText: '仕事の上で',
      },
    ],
    contrastiveTip:
      'Ingat beda bentuk verba! V-た + 上で = "setelah melakukan A, lalu B"; sedangkan V-dict + 上で = "dalam hal / untuk tujuan melakukan A".',
  },
  'n2-u7-dengar-baca': {
    headline: 'Kontrak, Riset & Pertimbangan Kerja',
    subtitle:
      'Simak cara penutur Jepang menyampaikan syarat keputusan sewa properti, perbandingan produk, dan analisis untung-rugi.',
    items: [
      {
        symbol: '比較した上で',
        reading: 'hikaku shita ue de',
        meaning: 'Setelah membandingkan (beberapa opsi)',
        mnemonic: '比較する (hikaku suru) berarti membandingkan secara objektif sebelum memutuskan.',
        speakText: '比較した上で',
      },
      {
        symbol: '部屋を見学した上で',
        reading: 'heya o kengaku shita ue de',
        meaning: 'Setelah meninjau langsung kondisi kamar',
        mnemonic: '見学する (meninjau/survei langsung) penting dilakukan sebelum menandatangani kontrak sewa.',
        speakText: '部屋を見学した上で',
      },
      {
        symbol: '理解した上で判断する',
        reading: 'rikai shita ue de handan suru',
        meaning: 'Mengambil keputusan setelah memahami (risikonya)',
        mnemonic: '判断する (handan suru: menilai/memutuskan) sangat sering menutup kalimat V-た上で.',
        speakText: '理解した上で判断する',
      },
      {
        symbol: '正式なお見積書',
        reading: 'seishiki na omitsumorisho',
        meaning: 'Dokumen penawaran harga resmi (quotation)',
        mnemonic: '見積書 (mitsumorisho) adalah dokumen wajib dalam transaksi B2B di Jepang.',
        speakText: '正式なお見積書',
      },
    ],
    contrastiveTip:
      'Jangan pakai V-た上で untuk urutan kejadian otomatis tanpa niat (seperti hujan turun lalu jalan basah); subjeknya harus melakukan tindakan sadar.',
  },
  'n2-u7-bicara-rakit': {
    headline: 'Diskusi Strategi & Syarat Kerja',
    subtitle:
      'Latih ungkapan konsultasi proposal dan prinsip belajar bahasa agar kalimat Anda terdengar runtut dan terukur.',
    items: [
      {
        symbol: '外国語を学ぶ上で',
        reading: 'gaikokugo o manabu ue de',
        meaning: 'Dalam hal mempelajari bahasa asing',
        mnemonic: 'V-dict + 上で diikuti hal yang dinilai penting (～が大切です / ～が必要です).',
        speakText: '外国語を学ぶ上で',
      },
      {
        symbol: '内容を精査した上で',
        reading: 'naiyou o seisa shita ue de',
        meaning: 'Setelah meneliti isi (proposal) secara saksama',
        mnemonic: '精査する (seisa suru: memeriksa rinci) adalah kosakata formal rapat bisnis N2.',
        speakText: '内容を精査した上で',
      },
      {
        symbol: '改めてご連絡いたします',
        reading: 'aratamete gorenraku itashimasu',
        meaning: 'Saya akan menghubungi Anda kembali',
        mnemonic: 'Penutup standar email bisnis setelah menyatakan akan meninjau dokumen terlebih dahulu.',
        speakText: '改めてご連絡いたします',
      },
      {
        symbol: '相談した上で',
        reading: 'soudan shita ue de',
        meaning: 'Setelah berdiskusi / berkonsultasi',
        mnemonic: 'Dipakai untuk menunjukkan bahwa keputusan tidak diambil sepihak melainkan lewat musyawarah.',
        speakText: '相談した上で',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～上で (setelah / dalam hal) dengan ～上に (selain A, ditambah lagi B yang sifatnya menumpuk).',
  },

  // ============================================================================
  // JLPT N2 — UNIT 8: ～つつある (GP-JA-N2-008)
  // ============================================================================
  'n2-u8-kosakata': {
    headline: 'Kosakata Transformasi Industri & Lingkungan',
    subtitle:
      'Kenali kata benda perubahan yang menjadi tulang punggung artikel tren teknologi, pemulihan pasar, dan pergeseran budaya.',
    items: [
      {
        symbol: '移行',
        reading: 'ikou',
        meaning: 'Transisi / peralihan ke sistem baru',
        mnemonic: 'Dipakai untuk peralihan energi terbarukan, sistem digital, atau pola kerja baru.',
        speakText: '移行',
      },
      {
        symbol: '回復',
        reading: 'kaifuku',
        meaning: 'Pemulihan (ekonomi, kepercayaan, kesehatan)',
        mnemonic: 'Sering berpasangan dengan 着実に (chakujitsu ni: secara mantap/bertahap).',
        speakText: '回復',
      },
      {
        symbol: '衰退',
        reading: 'suitai',
        meaning: 'Kemunduran / penurunan (industri atau tradisi)',
        mnemonic: 'Lawan kata dari 発展 (perkembangan); menggambarkan tren penurunan jangka panjang.',
        speakText: '衰退',
      },
      {
        symbol: '定着する',
        reading: 'teichaku suru',
        meaning: 'Mengakar / menjadi kebiasaan yang mapan',
        mnemonic: 'Menunjukkan bahwa tren baru seperti pembayaran nontunai mulai permanen di masyarakat.',
        speakText: '定着する',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 移行 (ikou: transisi ke sistem/tahap lain) dengan 移動 (idou: perpindahan lokasi fisik).',
  },
  'n2-u8-pola-utama': {
    headline: 'Pola Utama: V-ます stem + つつある',
    subtitle:
      'Kuasai bentuk bahasa tulis dan berita untuk menggambarkan perubahan yang sedang terus berlangsung menuju arah tertentu.',
    items: [
      {
        symbol: '変わりつつある',
        reading: 'kawaritsutsu aru',
        meaning: 'Sedang terus berubah (sedikit demi sedikit)',
        mnemonic: 'Ambil akar bentuk ます (変わります menjadi 変わり) lalu tempelkan つつある.',
        speakText: '変わりつつある',
      },
      {
        symbol: '進みつつある',
        reading: 'susumitsutsu aru',
        meaning: 'Sedang terus mengalami kemajuan/perkembangan',
        mnemonic: 'Sering dipakai untuk otomatisasi, reformasi, atau urbanisasi yang sedang berjalan.',
        speakText: '進みつつある',
      },
      {
        symbol: '回復しつつある',
        reading: 'kaifuku shitsutsu aru',
        meaning: 'Sedang berangsur-angsur pulih',
        mnemonic: 'Untuk verba する, akar ます-nya adalah し, sehingga menjadi ～しつつある.',
        speakText: '回復しつつある',
      },
      {
        symbol: '改善されつつある',
        reading: 'kaizen saretsutsu aru',
        meaning: 'Sedang terus diperbaiki / ditingkatkan',
        mnemonic: 'Bentuk pasif される menjadi され + つつある; sangat umum dalam laporan kemajuan objektif.',
        speakText: '改善されつつある',
      },
    ],
    contrastiveTip:
      '～つつある hanya dipakai dengan verba yang menunjukkan perubahan (berubah, naik, pulih, hilang), BUKAN aksi harian sesaat seperti 食べつつある untuk makan siang biasa.',
  },
  'n2-u8-dengar-baca': {
    headline: 'Artikel Perubahan Zaman & Otomatisasi',
    subtitle:
      'Baca dan dengarkan laporan tentang ketepatan terjemahan otomatis, robotisasi pabrik, dan perluasan transaksi digital.',
    items: [
      {
        symbol: '精度が向上しつつある',
        reading: 'seido ga koujou shitsutsu aru',
        meaning: 'Tingkat akurasinya sedang terus meningkat',
        mnemonic: '精度 (seido: presisi/akurasi) + 向上する (meningkat mutunya) adalah kolokasi berita teknologi.',
        speakText: '精度が向上しつつある',
      },
      {
        symbol: '自動化が進みつつある',
        reading: 'jidouka ga susumitsutsu aru',
        meaning: 'Otomatisasi sedang terus melaju',
        mnemonic: '自動化 (jidouka) dipakai saat membahas penggunaan robot atau perangkat lunak di pabrik.',
        speakText: '自動化が進みつつある',
      },
      {
        symbol: '定着しつつある',
        reading: 'teichaku shitsutsu aru',
        meaning: 'Sedang mulai mengakar kuat di masyarakat',
        mnemonic: 'Menandakan suatu kebiasaan baru bukan lagi sekadar tren sesaat.',
        speakText: '定着しつつある',
      },
      {
        symbol: '人手不足を補う',
        reading: 'hitode busoku o oginau',
        meaning: 'Menutupi kekurangan tenaga kerja',
        mnemonic: '補う (oginau: menutupi/melengkapi kekurangan) adalah kata kerja kunci di artikel industri N2.',
        speakText: '人手不足を補う',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～つつある (sedang berproses berubah) dengan ～つつ (sambil melakukan A, juga melakukan B — makna berbeda meski memakai kata つつ yang sama).',
  },
  'n2-u8-bicara-rakit': {
    headline: 'Mendeskripsikan Tren & Kemajuan Proyek',
    subtitle:
      'Susun laporan formal mengenai proyek konstruksi yang hampir rampung dan batas kerja kantor-rumah yang makin cair.',
    items: [
      {
        symbol: '完成に近づきつつある',
        reading: 'kansei ni chikazukitsutsu aru',
        meaning: 'Sedang semakin mendekati penyelesaian',
        mnemonic: '近づく (mendekat) menjadi 近づき + つつある; cocok untuk pembaruan progres proyek.',
        speakText: '完成に近づきつつある',
      },
      {
        symbol: '次第に曖昧になりつつある',
        reading: 'shidai ni aimai ni naritsutsu aru',
        meaning: 'Berangsur-angsur menjadi semakin kabur/samar',
        mnemonic: '次第に (berangsur-angsur) atau 徐々に (perlahan) adalah adverbia pasangan alami ～つつある.',
        speakText: '次第に曖昧になりつつある',
      },
      {
        symbol: '価値観が変わりつつある',
        reading: 'kachikan ga kawaritsutsu aru',
        meaning: 'Nilai-nilai/cara pandang sedang terus berubah',
        mnemonic: '価値観 (kachikan) berarti sistem nilai atau pandangan hidup seseorang/masyarakat.',
        speakText: '価値観が変わりつつある',
      },
      {
        symbol: '在宅勤務',
        reading: 'zaitaku kinmu',
        meaning: 'Kerja dari rumah (WFH)',
        mnemonic: 'Padanan formal Jepang untuk リモートワーク dalam dokumen kepegawaian.',
        speakText: '在宅勤務',
      },
    ],
    contrastiveTip:
      'Karena ～つつある bernuansa agak formal, gunakan bentuk sopan ～つつあります saat presentasi bisnis, bukan percakapan santai sehari-hari.',
  },

  // ============================================================================
  // JLPT N2 — UNIT 9: ～かねない (GP-JA-N2-009)
  // ============================================================================
  'n2-u9-kosakata': {
    headline: 'Kosakata Manajemen Risiko & Peringatan',
    subtitle:
      'Pelajari istilah kunci keselamatan kerja, reputasi perusahaan, dan keamanan informasi yang sering disertai peringatan risiko.',
    items: [
      {
        symbol: '事故',
        reading: 'jiko',
        meaning: 'Kecelakaan / insiden berbahaya',
        mnemonic: 'Sering dipasangkan dengan 起こす (menyebabkan) atau 防ぐ (mencegah).',
        speakText: '事故',
      },
      {
        symbol: '信用',
        reading: 'shinyou',
        meaning: 'Kepercayaan / kredibilitas bisnis',
        mnemonic: '信用を失う (kehilangan kredibilitas) adalah risiko terbesar dalam komunikasi korporat.',
        speakText: '信用',
      },
      {
        symbol: '漏洩',
        reading: 'rouei',
        meaning: 'Kebocoran (data rahasia atau informasi)',
        mnemonic: '情報漏洩 (jouhou roue) adalah istilah wajib di dunia TI dan kepatuhan perusahaan Jepang.',
        speakText: '漏洩',
      },
      {
        symbol: '点検を怠る',
        reading: 'tenken o okotaru',
        meaning: 'Melalaikan pemeriksaan/inspeksi berkala',
        mnemonic: '怠る (okotaru: melalaikan kewajiban) sering menjadi pemicu bahaya sebelum ～かねない.',
        speakText: '点検を怠る',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 信用 (shinyou: kredibilitas/kepercayaan berbasis rekam jejak bisnis) dengan 信頼 (shinrai: rasa percaya dan ketergantungan emosional/personal).',
  },
  'n2-u9-pola-utama': {
    headline: 'Pola Utama: V-ます stem + かねない',
    subtitle:
      'Kuasai pola peringatan N2 untuk menyatakan bahwa suatu kelalaian atau tindakan "bisa saja berakibat buruk".',
    items: [
      {
        symbol: '体調を崩しかねない',
        reading: 'taichou o kuzushikanenai',
        meaning: 'Bisa saja membuat kondisi tubuh ambruk/sakit',
        mnemonic: 'V-ます stem (崩し) + かねない selalu dipakai untuk memprediksi dampak NEGATIF.',
        speakText: '体調を崩しかねない',
      },
      {
        symbol: '大けがをしかねない',
        reading: 'ookega o shikanenai',
        meaning: 'Bisa saja menyebabkan cedera parah',
        mnemonic: 'Verba する memakai bentuk akar し + かねない menjadi しかねない.',
        speakText: '大けがをしかねない',
      },
      {
        symbol: 'データが消えかねない',
        reading: 'deeta ga kiekanenai',
        meaning: 'Data penting bisa saja terhapus semuanya',
        mnemonic: 'Menekankan urgensi tindakan pencegahan seperti mencadangkan data (バックアップ).',
        speakText: 'データが消えかねない',
      },
      {
        symbol: '恥をかきかねない',
        reading: 'haji o kakikanenai',
        meaning: 'Bisa saja mempermalukan diri sendiri',
        mnemonic: '恥をかく (menanggung malu) menjadi 恥をかき + かねない.',
        speakText: '恥をかきかねない',
      },
    ],
    contrastiveTip:
      'Jangan pernah gunakan ～かねない untuk kejadian positif (seperti menang undian atau naik gaji)! Pola ini khusus untuk kekhawatiran dan risiko buruk.',
  },
  'n2-u9-dengar-baca': {
    headline: 'Peringatan Keamanan & Analisis Risiko Ekonomi',
    subtitle:
      'Cermati bagaimana analis dan manajemen menyampaikan potensi kerugian, tekanan bisnis, dan kekacauan pasar.',
    items: [
      {
        symbol: '混乱を招きかねない',
        reading: 'konran o manekikanenai',
        meaning: 'Bisa saja memicu kekacauan/kebingungan',
        mnemonic: '招く (maneku) dalam konteks negatif berarti "mengundang/memicu masalah".',
        speakText: '混乱を招きかねない',
      },
      {
        symbol: '経営を圧迫しかねない',
        reading: 'keiei o appaku shikanenai',
        meaning: 'Bisa saja menekan/membebani manajemen keuangan',
        mnemonic: '圧迫する (appaku suru: menekan) sering muncul dalam berita dampak kenaikan suku bunga.',
        speakText: '経営を圧迫しかねない',
      },
      {
        symbol: '大きな損失を生みかねない',
        reading: 'ookina sonshitsu o umikanenai',
        meaning: 'Bisa saja menimbulkan kerugian besar',
        mnemonic: '損失を生む (melahirkan kerugian) sering dikaitkan dengan 性急な判断 (keputusan tergesa-gesa).',
        speakText: '大きな損失を生みかねない',
      },
      {
        symbol: '弱音を吐きかねない',
        reading: 'yowane o hakikanenai',
        meaning: 'Bisa saja mulai mengeluh/menyerah',
        mnemonic: '弱音を吐く adalah ungkapan idiomatik N2 yang berarti melontarkan keluhan putus asa.',
        speakText: '弱音を吐きかねない',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～かねない (bisa saja berakibat buruk) dengan ～かねる (sulit/tidak sanggup melakukan — penolakan halus bisnis seperti お答えしかねます).',
  },
  'n2-u9-bicara-rakit': {
    headline: 'Menyampaikan Peringatan Profesional',
    subtitle:
      'Rangkai kalimat peringatan yang objektif dan meyakinkan tentang perbaikan teknis dini serta akurasi pengumuman publik.',
    items: [
      {
        symbol: '故障が広がりかねない',
        reading: 'koshou ga hirogarikanenai',
        meaning: 'Kerusakan kecil bisa saja meluas',
        mnemonic: '早めに修理しないと (jika tidak segera diperbaiki) adalah syarat pengantar yang sangat alami.',
        speakText: '故障が広がりかねない',
      },
      {
        symbol: '不正確な発表',
        reading: 'fuseikaku na happyou',
        meaning: 'Pengumuman yang tidak akurat',
        mnemonic: '不正確 (tidak tepat) + 発表 (pengumuman) menjadi sumber risiko reputasi dan pasar.',
        speakText: '不正確な発表',
      },
      {
        symbol: '性急な判断',
        reading: 'seikyuu na handan',
        meaning: 'Keputusan yang terlalu tergesa-gesa',
        mnemonic: '性急 (seikyuu) bermakna terburu-buru tanpa pertimbangan matang.',
        speakText: '性急な判断',
      },
      {
        symbol: '懸念が広がっている',
        reading: 'kenen ga hirogatte iru',
        meaning: 'Kekhawatiran sedang meluas',
        mnemonic: '懸念 (kenen: kekhawatiran) sering menutup kutipan kalimat ～かねないという懸念.',
        speakText: '懸念が広がっている',
      },
    ],
    contrastiveTip:
      'Dalam kalimat peringatan sopan ke rekan atau atasan, gunakan bentuk ～かねません (misalnya 消えかねません) agar tetap santun namun tegas.',
  },

  // ============================================================================
  // JLPT N2 — UNIT 10: Sonkeigo Baku (GP-JA-N2-010)
  // ============================================================================
  'n2-u10-kosakata': {
    headline: 'Kosakata & Bentuk Khusus Sonkeigo Bisnis',
    subtitle:
      'Hafalkan bentuk hormat peninggi khusus (tokushu sonkeigo) untuk tindakan atasan, tamu, dan klien perusahaan Jepang.',
    items: [
      {
        symbol: 'ご覧になる',
        reading: 'goran ni naru',
        meaning: 'Melihat / membaca (hormat untuk lawan bicara)',
        mnemonic: 'Bentuk sonkeigo khusus dari 見る. Jangan pernah dipakai untuk tindakan diri sendiri!',
        speakText: 'ご覧になる',
      },
      {
        symbol: 'おっしゃる',
        reading: 'ossharu',
        meaning: 'Mengatakan / menyampaikan (hormat)',
        mnemonic: 'Bentuk sonkeigo khusus dari 言う. Bentuk sopan ます-nya adalah おっしゃいます (bukan おっしゃります).',
        speakText: 'おっしゃる',
      },
      {
        symbol: 'いらっしゃる',
        reading: 'irassharu',
        meaning: 'Ada / pergi / datang (hormat)',
        mnemonic: 'Mewakili tiga verba sekaligus: いる, 行く, dan 来る. Bentuk ～ている menjadi ～ていらっしゃる.',
        speakText: 'いらっしゃる',
      },
      {
        symbol: 'お越しになる',
        reading: 'okoshi ni naru',
        meaning: 'Datang / berkunjung (hormat)',
        mnemonic: 'Sangat lazim saat menanyakan jadwal kedatangan klien ke kantor kita.',
        speakText: 'お越しになる',
      },
    ],
    contrastiveTip:
      'Jangan tertukar Sonkeigo (meninggikan tindakan ORANG LAIN seperti ご覧になる) dengan Kenjougo (merendahkan tindakan DIRI SENDIRI seperti 拝見する).',
  },
  'n2-u10-pola-utama': {
    headline: 'Pola Utama: お～になる・ご～になる・なさる',
    subtitle:
      'Pahami rumus produktif membentuk sonkeigo reguler untuk kata kerja asli Jepang (wago) dan kata kerja serapan Sino-Jepang (kango).',
    items: [
      {
        symbol: 'お着きになる',
        reading: 'otsuki ni naru',
        meaning: 'Tiba / sampai (hormat)',
        mnemonic: 'Rumus wago: お + V-ます stem + になる (着きます menjadi お着きになる).',
        speakText: 'お着きになる',
      },
      {
        symbol: 'ご確認なさる',
        reading: 'gokakunin nasaru',
        meaning: 'Memeriksa / mengonfirmasi (hormat)',
        mnemonic: 'Rumus kango (kata benda する): ご + Kango + なさる (atau ご～になる).',
        speakText: 'ご確認なさる',
      },
      {
        symbol: 'ご存じですか',
        reading: 'gozonji desu ka',
        meaning: 'Apakah Anda mengetahui...?',
        mnemonic: 'Bentuk hormat khusus dari 知っていますか. Jangan bilang お知りになりますか.',
        speakText: 'ご存じですか',
      },
      {
        symbol: 'お尋ねください',
        reading: 'otazune kudasai',
        meaning: 'Silakan bertanya / menghubungi kami',
        mnemonic: 'Rumus permintaan sopan ke tamu: お + V-ます stem + ください.',
        speakText: 'お尋ねください',
      },
    ],
    contrastiveTip:
      'Hindari "keigo ganda" (nijuu keigo) yang salah seperti おっしゃられる atau ご覧になられる! Cukup おっしゃる dan ご覧になる.',
  },
  'n2-u10-dengar-baca': {
    headline: 'Komunikasi Eksekutif & Penerimaan Klien',
    subtitle:
      'Perhatikan perpindahan halus antara kenjougo (untuk rekan internal di hadapan tamu) dan sonkeigo (untuk klien eksternal).',
    items: [
      {
        symbol: '席を外しております',
        reading: 'seki o hazushite orimasu',
        meaning: 'Sedang tidak berada di meja kerjanya (kenjougo)',
        mnemonic: 'Saat berbicara dengan klien luar, gunakan kenjougo untuk rekan sekantor (uchi), bukan sonkeigo.',
        speakText: '席を外しております',
      },
      {
        symbol: 'まもなくお戻りになる',
        reading: 'mamonaku omodori ni naru',
        meaning: 'Sebentar lagi akan kembali (sonkeigo internal)',
        mnemonic: 'Dipakai saat berbicara antar-rekan internal mengenai atasan sendiri.',
        speakText: 'まもなくお戻りになる',
      },
      {
        symbol: 'ご相談ください',
        reading: 'gosoudan kudasai',
        meaning: 'Silakan berkonsultasi dengan kami',
        mnemonic: 'ご + kango + ください adalah ajakan yang ramah namun tetap profesional untuk klien.',
        speakText: 'ご相談ください',
      },
      {
        symbol: 'ご不明な点',
        reading: 'gofumei na ten',
        meaning: 'Hal-hal yang belum jelas / perlu ditanyakan',
        mnemonic: 'Frasa standar penutup presentasi atau email layanan pelanggan: ご不明な点がございましたら.',
        speakText: 'ご不明な点',
      },
    ],
    contrastiveTip:
      'Ingat konsep uchi-soto (dalam-luar): saat melapor ke klien luar tentang direktur perusahaan sendiri, turunkan bahasa ke kenjougo (社長は外出しております), bukan いらっしゃいます.',
  },
  'n2-u10-bicara-rakit': {
    headline: 'Etika Rapat & Bahasa Hormat Terpadu',
    subtitle:
      'Latih ungkapan penyambutan tamu VIP, permohonan maaf karena menunggu, dan ucapan terima kasih penutup rapat.',
    items: [
      {
        symbol: '大変お待たせいたしました',
        reading: 'taihen omatase itashimashita',
        meaning: 'Mohon maaf telah membuat Anda menunggu lama',
        mnemonic: 'Ungkapan wajib saat menemui klien di ruang tamu atau mengangkat telepon setelah hold.',
        speakText: '大変お待たせいたしました',
      },
      {
        symbol: 'どうぞ中へお入りください',
        reading: 'douzo naka e ohairi kudasai',
        meaning: 'Silakan masuk ke dalam',
        mnemonic: 'お入りください jauh lebih sopan daripada 入ってください saat mempersilakan tamu masuk ruang rapat.',
        speakText: 'どうぞ中へお入りください',
      },
      {
        symbol: 'お越しくださりありがとうございます',
        reading: 'okoshi kudasari arigatou gozaimasu',
        meaning: 'Terima kasih telah berkenan hadir',
        mnemonic: '～くださり adalah bentuk sambung formal dari ～くださって untuk pidato sambutan.',
        speakText: 'お越しくださりありがとうございます',
      },
      {
        symbol: 'ご覧になりましたでしょうか',
        reading: 'goran ni narimashita deshou ka',
        meaning: 'Apakah Anda sudah berkenan membaca/melihatnya?',
        mnemonic: 'Akhiran ～でしょうか melembutkan pertanyaan agar terdengar lebih hormat kepada atasan/klien.',
        speakText: 'ご覧になりましたでしょうか',
      },
    ],
    contrastiveTip:
      'Jangan pakai ご苦労様です (gokurousama desu) kepada atasan atau klien; ungkapan itu hanya dari atasan ke bawahan. Gunakan お疲れ様です atau terima kasih formal.',
  },

  // ============================================================================
  // JLPT N1 — UNIT 1: ～に至って (GP-JA-N1-001)
  // ============================================================================
  'n1-u1-kosakata': {
    headline: 'Kosakata Krisis, Skandal & Eskalasi N1',
    subtitle:
      'Kuasai kosakata editorial dan manajemen krisis tingkat lanjut yang sering muncul di berita ekonomi dan investigasi korporasi.',
    items: [
      {
        symbol: '深刻化',
        reading: 'shinkokuka',
        meaning: 'Menjadi semakin serius / kritis',
        mnemonic: '深刻 (serius) + 化 (proses menjadi); lazim untuk krisis ekonomi, iklim, atau kekurangan tenaga kerja.',
        speakText: '深刻化',
      },
      {
        symbol: '発覚',
        reading: 'hakkaku',
        meaning: 'Terbongkarnya (skandal / pelanggaran tersembunyi)',
        mnemonic: 'Selalu bernuansa negatif, misalnya 不正会計が発覚する (kecurangan akuntansi terbongkar).',
        speakText: '発覚',
      },
      {
        symbol: '抜本的',
        reading: 'bapponteki',
        meaning: 'Mendasar / radikal hingga ke akar masalah',
        mnemonic: 'Kontras langsung dengan 表面的 (hyoumenteki: hanya di permukaan saja).',
        speakText: '抜本的',
      },
      {
        symbol: '再発防止策',
        reading: 'saihatsu boushisaku',
        meaning: 'Langkah pencegahan terulangnya insiden',
        mnemonic: 'Istilah baku konferensi pers perusahaan Jepang setiap kali menanggapi skandal atau kecelakaan.',
        speakText: '再発防止策',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 発覚 (hakkaku: terbongkarnya hal buruk/rahasia) dengan 発見 (hakken: penemuan ilmiah atau benda hilang yang netral/positif).',
  },
  'n1-u1-pola-utama': {
    headline: 'Pola Utama: ～に至って & Variannya',
    subtitle:
      'Pelajari cara menyatakan titik balik ekstrem (～に至って), kondisi sudah terlambat (～に至っては), dan cakupan menyeluruh (～に至るまで).',
    items: [
      {
        symbol: '悪化するに至って',
        reading: 'akka suru ni itatte',
        meaning: 'Hingga memburuk sampai titik ini (barulah...)',
        mnemonic: 'Sering berpasangan dengan ようやく atau 初めて untuk mengkritik reaksi yang baru muncul saat kritis.',
        speakText: '悪化するに至って',
      },
      {
        symbol: '今に至っては',
        reading: 'ima ni itatte wa',
        meaning: 'Kalau sudah sampai saat sekarang ini',
        mnemonic: 'Menegaskan bahwa keadaan sudah terlanjur terjadi sehingga penyesalan atau perbaikan terlambat.',
        speakText: '今に至っては',
      },
      {
        symbol: '新入社員に至るまで',
        reading: 'shinnyuu shain ni itaru made',
        meaning: 'Hingga sampai ke karyawan baru sekalipun',
        mnemonic: 'Pola AからBに至るまで menyoroti jangkauan ekstrem dari tingkat tertinggi sampai detail terkecil.',
        speakText: '新入社員に至るまで',
      },
      {
        symbol: '決定に至った経緯',
        reading: 'kettei ni itatta keii',
        meaning: 'Kronologi hingga tercapainya keputusan',
        mnemonic: '～に至った + N adalah frasa sangat formal untuk menjelaskan proses panjang di balik suatu hasil.',
        speakText: '決定に至った経緯',
      },
    ],
    contrastiveTip:
      'Bedakan fungsinya: ～に至って = mencapai titik krisis/ekstrem; ～に至っては = menyoroti kasus terparah atau kondisi sudah terlambat; ～に至るまで = rentang menyeluruh sampai detail terkecil.',
  },
  'n1-u1-dengar-baca': {
    headline: 'Wacana Editorial: Krisis & Titik Balik',
    subtitle:
      'Cermati nuansa kritik media Jepang dalam laporan kebuntuan negosiasi, evaluasi keselamatan, dan reformasi menyeluruh.',
    items: [
      {
        symbol: '合意に至らず',
        reading: 'goui ni itarazu',
        meaning: 'Tidak mencapai kata sepakat',
        mnemonic: 'Bentuk negatif tulis dari 合意に至る; lazim diikuti 白紙に戻された (kembali ke titik nol).',
        speakText: '合意に至らず',
      },
      {
        symbol: '決裂するに至り',
        reading: 'ketsuretsu suru ni itari',
        meaning: 'Hingga mencapai kebuntuan total (negosiasi)',
        mnemonic: '～に至り adalah bentuk bahasa tulis ringkas dari ～に至って yang dominan di surat kabar.',
        speakText: '決裂するに至り',
      },
      {
        symbol: '全面的な刷新',
        reading: 'zenmenteki na sasshin',
        meaning: 'Pembaruan menyeluruh total',
        mnemonic: '刷新 (sasshin) berarti merombak sistem lama secara total agar menjadi baru dan segar.',
        speakText: '全面的な刷新',
      },
      {
        symbol: '細部に至るまで',
        reading: 'saibu ni itaru made',
        meaning: 'Hingga ke detail-detail terkecil sekalipun',
        mnemonic: 'Menekankan ketelitian absolut pada cetak biru, kontrak hukum, atau standar desain.',
        speakText: '細部に至るまで',
      },
    ],
    contrastiveTip:
      'Jangan pakai ～に至って untuk perkembangan biasa yang ringan; pola ini selalu memuat bobot proses panjang yang berujung pada titik kritis.',
  },
  'n1-u1-bicara-rakit': {
    headline: 'Bicara & Rakit Analisis Krisis Eksekutif',
    subtitle:
      'Latih penyusunan pernyataan resmi tentang langkah penanganan krisis, pengawasan proyek dari hulu ke hilir, dan audit organisasi.',
    items: [
      {
        symbol: '対応に乗り出す',
        reading: 'taiou ni noridasu',
        meaning: 'Mulai turun tangan menangani secara aktif',
        mnemonic: '乗り出す (noridasu) memberi kesan langkah nyata setelah sebelumnya hanya diam atau pasif.',
        speakText: '対応に乗り出す',
      },
      {
        symbol: '立案から運用に至るまで',
        reading: 'ritsuan kara unyou ni itaru made',
        meaning: 'Dari penyusunan rencana hingga operasional lapangan',
        mnemonic: 'Pasangan kata formal yang sering dipakai dalam profil proyek atau portofolio eksekutif.',
        speakText: '立案から運用に至るまで',
      },
      {
        symbol: '拡大するに至ったのか',
        reading: 'kakudai suru ni itatta no ka',
        meaning: 'Mengapa sampai berkembang meluas sejauh ini',
        mnemonic: 'Struktur pertanyaan investigatif dalam laporan audit atau rapat evaluasi kegagalan.',
        speakText: '拡大するに至ったのか',
      },
      {
        symbol: '世論の信頼を失う',
        reading: 'seron no shinrai o ushinau',
        meaning: 'Kehilangan kepercayaan opini publik',
        mnemonic: '世論 dibaca seron (atau yoron); sering menjadi titik balik pengunduran diri pejabat.',
        speakText: '世論の信頼を失う',
      },
    ],
    contrastiveTip:
      'Saat merakit kalimat dengan 今に至っては, klausa penutupnya hampir selalu bermakna pasrah, terlambat, atau tidak ada pilihan lain (仕方がない / ほかない).',
  },

  // ============================================================================
  // JLPT N1 — UNIT 2: ～を余儀なくされる (GP-JA-N1-002)
  // ============================================================================
  'n1-u2-kosakata': {
    headline: 'Kosakata Kebijakan, Bencana & Restrukturisasi',
    subtitle:
      'Kuasai istilah ekonomi dan pemerintahan yang melatarbelakangi keputusan berat di luar kendali perusahaan.',
    items: [
      {
        symbol: '操業停止',
        reading: 'sougyou teishi',
        meaning: 'Penghentian operasional pabrik/produksi',
        mnemonic: '操業 (sougyou) khusus merujuk pada pengoperasian fasilitas produksi atau manufaktur.',
        speakText: '操業停止',
      },
      {
        symbol: '財政難',
        reading: 'zaiseinan',
        meaning: 'Kesulitan fiskal / krisis keuangan lembaga',
        mnemonic: 'Akhiran 難 (nan: kesulitan) juga muncul di 就職難 (sulit kerja) dan 人材難 (sulit cari SDM).',
        speakText: '財政難',
      },
      {
        symbol: '経営再建',
        reading: 'keiei saiken',
        meaning: 'Restrukturisasi / pemulihan manajemen bisnis',
        mnemonic: 'Sering disertai 不採算部門の整理 (penataan divisi yang terus merugi).',
        speakText: '経営再建',
      },
      {
        symbol: '方針転換',
        reading: 'houshin tenkan',
        meaning: 'Perubahan haluan / arah kebijakan secara drastis',
        mnemonic: '転換 (tenkan) berarti berbalik arah atau bertransformasi ke strategi baru.',
        speakText: '方針転換',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 操業 (sougyou: operasional pabrik) dengan 創業 (sougyou: pendirian perusahaan pertama kali — bunyinya sama, kanjinya berbeda!).',
  },
  'n1-u2-pola-utama': {
    headline: 'Pola Utama: ～を余儀なくされる & Bentuk Kausatifnya',
    subtitle:
      'Pahami struktur N1 untuk menyatakan keterpaksaan akibat faktor eksternal (bencana, regulasi, pasar) dalam bentuk pasif maupun kausatif.',
    items: [
      {
        symbol: '変更を余儀なくされた',
        reading: 'henkou o yoginaku sareta',
        meaning: 'Terpaksa melakukan perubahan (jadwal/rencana)',
        mnemonic: 'Selalu menempel pada KATA BENDA (N + を余儀なくされる), bukan kata kerja langsung.',
        speakText: '変更を余儀なくされた',
      },
      {
        symbol: '値上げを余儀なくさせている',
        reading: 'neage o yoginaku sasete iru',
        meaning: 'Memaksa (perusahaan) untuk menaikkan harga',
        mnemonic: 'Jika subjek kalimat adalah PENYEBAB eksternal, gunakan bentuk kausatif ～に N を余儀なくさせる.',
        speakText: '値上げを余儀なくさせている',
      },
      {
        symbol: '避難生活を余儀なくされている',
        reading: 'hinan seikatsu o yoginaku sarete iru',
        meaning: 'Terpaksa menjalani kehidupan pengungsian',
        mnemonic: 'Bentuk ～されている menunjukkan kondisi keterpaksaan yang masih terus berlangsung.',
        speakText: '避難生活を余儀なくされている',
      },
      {
        symbol: '棄権を余儀なくされた',
        reading: 'kiken o yoginaku sareta',
        meaning: 'Terpaksa mundur / walkover dari kompetisi',
        mnemonic: 'Kolokasi berita olahraga yang sangat khas ketika atlet cedera sebelum bertanding.',
        speakText: '棄権を余儀なくされた',
      },
    ],
    contrastiveTip:
      'Cek subjek kalimat! Korban/pihak yang terpaksa memakai ～を余儀なくされる (pasif); sedangkan penyebab eksternal (cuaca/regulasi) memakai ～に...を余儀なくさせる (kausatif).',
  },
  'n1-u2-dengar-baca': {
    headline: 'Berita Bencana, Transportasi & Kebijakan Publik',
    subtitle:
      'Kenali kolokasi berita Jepang saat melaporkan kelangkaan semikonduktor, pembatalan penerbangan, dan revisi hukum.',
    items: [
      {
        symbol: '大幅な減産を余儀なくされる',
        reading: 'oohaba na gensan o yoginaku sareru',
        meaning: 'Terpaksa memangkas produksi secara besar-besaran',
        mnemonic: '減産 (gensan) adalah singkatan 生産減少; lawan katanya 増産 (zousan: peningkatan produksi).',
        speakText: '大幅な減産を余儀なくされる',
      },
      {
        symbol: '欠航や遅延を余儀なくされる',
        reading: 'kekkou ya chien o yoginaku sareru',
        meaning: 'Terpaksa mengalami pembatalan atau penundaan penerbangan',
        mnemonic: '欠航 (kekkou) khusus untuk pembatalan jadwal pesawat atau kapal laut.',
        speakText: '欠航や遅延を余儀なくされる',
      },
      {
        symbol: '一時閉館を余儀なくされた',
        reading: 'ichiji heikan o yoginaku sareta',
        meaning: 'Terpaksa ditutup sementara (museum/perpustakaan)',
        mnemonic: '老朽化 (roukyuuka: penuaan bangunan) sering menjadi alasan penutupan fasilitas publik.',
        speakText: '一時閉館を余儀なくされた',
      },
      {
        symbol: '営業時間の短縮',
        reading: 'eigyou jikan no tanshuku',
        meaning: 'Pemendekan jam operasional usaha',
        mnemonic: 'Frasa sangat lazim di pengumuman restoran dan pusat perbelanjaan saat keadaan darurat.',
        speakText: '営業時間の短縮',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～を余儀なくされる (N1, hanya menempel pada nomina, bernuansa sangat resmi/berita) dengan ～ざるを得ない (N2, menempel pada verba).',
  },
  'n1-u2-bicara-rakit': {
    headline: 'Bicara & Rakit Laporan Keterpaksaan Operasional',
    subtitle:
      'Susun laporan resmi untuk mengabarkan pengurangan layanan, penghentian kereta, dan evakuasi bencana secara akurat.',
    items: [
      {
        symbol: 'サービスの縮小を余儀なくされる',
        reading: 'saabisu no shukushou o yoginaku sareru',
        meaning: 'Terpaksa memperkecil/mengurangi skala layanan',
        mnemonic: '縮小 (shukushou: penyusutan skala) adalah lawan kata 拡大 (kakudai: perluasan).',
        speakText: 'サービスの縮小を余儀なくされる',
      },
      {
        symbol: '運転見合わせを余儀なくされた',
        reading: 'unten miawase o yoginaku sareta',
        meaning: 'Terpaksa menangguhkan operasional kereta sementara',
        mnemonic: '運転見合わせ adalah istilah standar perkeretaapian Jepang saat terjadi gangguan cuaca/listrik.',
        speakText: '運転見合わせを余儀なくされた',
      },
      {
        symbol: '避難所への移動',
        reading: 'hinanjo e no idou',
        meaning: 'Perpindahan/evakuasi menuju tempat pengungsian',
        mnemonic: '避難所 (hinanjo) adalah posko evakuasi resmi di sekolah atau balai warga Jepang.',
        speakText: '避難所への移動',
      },
      {
        symbol: 'システム改修',
        reading: 'shisutemu kaishuu',
        meaning: 'Perombakan / perbaikan besar sistem TI',
        mnemonic: '改修 (kaishuu) dipakai untuk renovasi besar bangunan maupun pembaruan arsitektur perangkat lunak.',
        speakText: 'システム改修',
      },
    ],
    contrastiveTip:
      'Hindari memakai ～を余儀なくされる untuk pilihan pribadi yang masih bisa dihindari; kata 余儀なく secara harfiah berarti "tanpa ada ruang pilihan lain".',
  },

  // ============================================================================
  // JLPT N1 — UNIT 3: ～とはいえ (GP-JA-N1-003)
  // ============================================================================
  'n1-u3-kosakata': {
    headline: 'Kosakata Opini, Tajuk Rencana & Evaluasi Publik',
    subtitle:
      'Kuasai istilah analitis untuk membahas pro-kontra kebijakan, efektivitas program, dan keberlanjutan jangka panjang.',
    items: [
      {
        symbol: '賛否',
        reading: 'sanpi',
        meaning: 'Pro dan kontra / setuju dan tidak setuju',
        mnemonic: 'Gabungan 賛成 (setuju) + 反対/否定 (menolak); sering muncul dalam 賛否両論 (ada dua kubu pendapat).',
        speakText: '賛否',
      },
      {
        symbol: '実効性',
        reading: 'jikkousei',
        meaning: 'Efektivitas nyata dalam pelaksanaan',
        mnemonic: 'Menilai apakah suatu aturan benar-benar berdampak di lapangan, bukan sekadar di atas kertas.',
        speakText: '実効性',
      },
      {
        symbol: '持続可能性',
        reading: 'jizoku kanousei',
        meaning: 'Keberlanjutan (sustainability)',
        mnemonic: 'Padanan resmi istilah "sustainability" dalam laporan ESG, lingkungan, dan ekonomi Jepang.',
        speakText: '持続可能性',
      },
      {
        symbol: '暫定措置',
        reading: 'zantei sochi',
        meaning: 'Langkah / kebijakan sementara (interim)',
        mnemonic: '暫定 (sementara menunggu keputusan tetap) + 措置 (tindakan resmi pemerintah/lembaga).',
        speakText: '暫定措置',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 実効性 (jikkousei: daya guna/efektivitas kebijakan) dengan 実現性 (jitsugensei: kelayakan untuk diwujudkan/feasibility).',
  },
  'n1-u3-pola-utama': {
    headline: 'Pola Utama: ～とはいえ & ～とはいうものの',
    subtitle:
      'Pelajari cara mengakui kebenaran fakta A terlebih dahulu, lalu menghadirkan kenyataan atau batasan B yang tetap berlaku.',
    items: [
      {
        symbol: '慣れた作業とはいえ',
        reading: 'nareta sagyou to wa ie',
        meaning: 'Meskipun itu pekerjaan yang sudah biasa dikerjakan',
        mnemonic: 'Kata benda dapat langsung diikuti とはいえ tanpa だ, lalu disusul peringatan atau fakta kontras.',
        speakText: '慣れた作業とはいえ',
      },
      {
        symbol: '春になったとはいえ',
        reading: 'haru ni natta to wa ie',
        meaning: 'Meskipun memang sudah masuk musim semi',
        mnemonic: 'Mengakui fakta A (secara kalender sudah musim semi), tetapi realitas B (udara masih dingin).',
        speakText: '春になったとはいえ',
      },
      {
        symbol: 'とはいうものの',
        reading: 'to wa iu mono no',
        meaning: 'Meskipun dikatakan demikian / kendati begitu',
        mnemonic: 'Varian sedikit lebih lunak dan bisa dipakai di awal kalimat sebagai konjungsi penyeimbang opini.',
        speakText: 'とはいうものの',
      },
      {
        symbol: '一瞬の油断も許されない',
        reading: 'isshun no yudan mo yurusarenai',
        meaning: 'Kelengahan sesaat pun tidak dapat ditoleransi',
        mnemonic: '油断 (yudan: lengah); ungkapan klasik yang sering menutup kalimat peringatan ～とはいえ.',
        speakText: '一瞬の油断も許されない',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～とはいえ (mengakui fakta A sebagai benar, lalu membatasi kesimpulannya dengan B) dengan ～にもかかわらず (kontras mengejutkan yang melampaui ekspektasi).',
  },
  'n1-u3-dengar-baca': {
    headline: 'Tajuk Rencana & Evaluasi Berimbang',
    subtitle:
      'Simak cara kolomnis dan analis menyajikan pandangan objektif mengenai perkembangan AI generatif dan kebijakan publik.',
    items: [
      {
        symbol: '精度が飛躍的に高まったとはいえ',
        reading: 'seido ga hiyakuteki ni takamatta to wa ie',
        meaning: 'Meskipun akurasinya telah melonjak pesat',
        mnemonic: '飛躍的 (hiyakuteki) berarti melompat jauh/dramatis, sangat umum dalam wacana inovasi.',
        speakText: '精度が飛躍的に高まったとはいえ',
      },
      {
        symbol: '情報の真偽',
        reading: 'jouhou no shingi',
        meaning: 'Benar atau salahnya suatu informasi',
        mnemonic: '真 (benar) + 偽 (palsu); istilah kunci literasi media dan verifikasi data N1.',
        speakText: '情報の真偽',
      },
      {
        symbol: '多角的な視点',
        reading: 'takakuteki na shiten',
        meaning: 'Sudut pandang dari berbagai sisi',
        mnemonic: '多角的 (multidimensi) menunjukkan analisis yang tidak berat sebelah.',
        speakText: '多角的な視点',
      },
      {
        symbol: '最終的に判断する',
        reading: 'saishuuteki ni handan suru',
        meaning: 'Membuat penilaian akhir',
        mnemonic: 'Menegaskan peran tanggung jawab manusia sebagai pengambil keputusan terakhir.',
        speakText: '最終的に判断する',
      },
    ],
    contrastiveTip:
      'Di depan とはいえ, kata benda dan adjektiva-na tidak perlu memakai な; pakai langsung N/Na-adj + とはいえ atau bentuk biasa + とはいえ.',
  },
  'n1-u3-bicara-rakit': {
    headline: 'Bicara & Rakit Argumen Berimbang',
    subtitle:
      'Latih penyampaian argumen bisnis yang mengakui keterbatasan anggaran atau skala kecil namun tetap menegaskan kualitas dan dampak.',
    items: [
      {
        symbol: '予算が限られているとはいえ',
        reading: 'yosan ga kagirarete iru to wa ie',
        meaning: 'Meskipun anggaran memang terbatas',
        mnemonic: 'Pola diplomasi rapat yang mengakui kendala tanpa mengorbankan standar kualitas.',
        speakText: '予算が限られているとはいえ',
      },
      {
        symbol: '品質を落とすわけにはいかない',
        reading: 'hinshitsu o otosu wake ni wa ikanai',
        meaning: 'Tidak mungkin menurunkan standar kualitas',
        mnemonic: 'Perpaduan efektif pola N1 (～とはいえ) dan N2 (～わけにはいかない) dalam satu argumen.',
        speakText: '品質を落とすわけにはいかない',
      },
      {
        symbol: '小規模な事業とはいえ',
        reading: 'shoukibo na jigyou to wa ie',
        meaning: 'Meskipun merupakan usaha berskala kecil',
        mnemonic: '小規模 (skala kecil) kontras dengan 大規模 (skala besar).',
        speakText: '小規模な事業とはいえ',
      },
      {
        symbol: '地域社会への波及効果',
        reading: 'chiiki shakai e no hakyuu kouka',
        meaning: 'Efek berantai / dampak meluas bagi masyarakat lokal',
        mnemonic: '波及効果 (hakyuu kouka: ripple effect) adalah kosakata emas untuk esai ekonomi N1.',
        speakText: '地域社会への波及効果',
      },
    ],
    contrastiveTip:
      'Gunakan ～とはいえ ketika Anda ingin terdengar dewasa dan objektif: akui dulu poin lawan bicara atau realitas yang ada, baru sampaikan argumen utama Anda.',
  },

  // ============================================================================
  // JLPT N1 — UNIT 4: ～をもって (GP-JA-N1-004)
  // ============================================================================
  'n1-u4-kosakata': {
    headline: 'Kosakata Pengumuman, Kontrak & Surat Resmi',
    subtitle:
      'Kuasai istilah administratif dan hukum yang hampir selalu hadir dalam surat edaran, SK jabatan, dan upacara penutupan.',
    items: [
      {
        symbol: '書面',
        reading: 'shomen',
        meaning: 'Dokumen tertulis resmi',
        mnemonic: '書面をもって通知する (memberitahukan melalui dokumen tertulis) adalah kalimat baku hukum/HR.',
        speakText: '書面',
      },
      {
        symbol: '任期満了',
        reading: 'ninki manryou',
        meaning: 'Berakhirnya masa jabatan secara penuh',
        mnemonic: '任期 (masa tugas) + 満了 (selesai penuh); dipakai dalam pengumuman pergantian direksi atau pejabat.',
        speakText: '任期満了',
      },
      {
        symbol: '施行',
        reading: 'shikou',
        meaning: 'Mulai diberlakukannya (undang-undang/peraturan)',
        mnemonic: 'Bacaan hukum baku adalah shikou (bukan sekou yang berarti pelaksanaan konstruksi).',
        speakText: '施行',
      },
      {
        symbol: '滞りなく',
        reading: 'todokoorinaku',
        meaning: 'Dengan lancar tanpa hambatan sedikit pun',
        mnemonic: 'Ungkapan resmi pidato penutupan acara: 滞りなく閉会とさせていただきます.',
        speakText: '滞りなく',
      },
    ],
    contrastiveTip:
      'Perhatikan bacaan 施行: untuk pemberlakuan hukum/aturan dibaca "shikou", sedangkan untuk pengerjaan proyek konstruksi (施工) dibaca "sekou".',
  },
  'n1-u4-pola-utama': {
    headline: 'Pola Utama: ～をもって / ～をもちまして',
    subtitle:
      'Pahami dua fungsi utama ～をもって: sebagai sarana/sikap resmi ("dengan melalui...") dan penanda batas waktu/akhir acara ("per tanggal... / dengan ini...").',
    items: [
      {
        symbol: '誠意をもって対応する',
        reading: 'seii o motte taiou suru',
        meaning: 'Menanggapi dengan penuh ketulusan/iktikad baik',
        mnemonic: 'Fungsi sarana/sikap: N (sikap/dokumen/metode resmi) + をもって.',
        speakText: '誠意をもって対応する',
      },
      {
        symbol: '強い責任感をもって',
        reading: 'tsuyoi sekininkan o motte',
        meaning: 'Dengan rasa tanggung jawab yang kuat',
        mnemonic: 'Sering diikuti verba formal seperti 遂行する (suikou suru: melaksanakan tugas hingga tuntas).',
        speakText: '強い責任感をもって',
      },
      {
        symbol: '以上をもちまして',
        reading: 'ijou o mochimashite',
        meaning: 'Dengan berakhirnya hal di atas (dengan ini...)',
        mnemonic: 'Bentuk sangat sopan dari ～をもって yang menjadi kalimat penutup baku presentasi dan upacara.',
        speakText: '以上をもちまして',
      },
      {
        symbol: '書面をもって通知する',
        reading: 'shomen o motte tsuuchi suru',
        meaning: 'Memberitahukan secara resmi melalui surat tertulis',
        mnemonic: 'Padanan sangat formal dari partikel で ketika merujuk pada sarana administratif resmi.',
        speakText: '書面をもって通知する',
      },
    ],
    contrastiveTip:
      'Jangan gunakan ～をもって untuk alat sehari-hari seperti makan dengan sumpit (箸をもって食べる salah secara pola ini); gunakan hanya untuk sarana abstrak, dokumen resmi, atau batas waktu.',
  },
  'n1-u4-dengar-baca': {
    headline: 'Surat Korporasi & Pengumuman Batas Waktu',
    subtitle:
      'Kenali format pengumuman resmi penghentian layanan pelanggan, penutupan cabang, dan penutupan upacara perusahaan Jepang.',
    items: [
      {
        symbol: '三月三十一日をもちまして',
        reading: 'sangatsu sanjuuichinichi o mochimashite',
        meaning: 'Terhitung per tanggal 31 Maret (berakhir)',
        mnemonic: 'Fungsi penanda batas akhir resmi: [Tanggal/Jam] + をもって / をもちまして.',
        speakText: '三月三十一日をもちまして',
      },
      {
        symbol: 'お問い合わせ窓口',
        reading: 'otoiawase madoguchi',
        meaning: 'Loket / kanal layanan pertanyaan pelanggan',
        mnemonic: '窓口 (madoguchi) berarti konter layanan, baik fisik maupun saluran telepon/email.',
        speakText: 'お問い合わせ窓口',
      },
      {
        symbol: '誠に勝手ながら',
        reading: 'makoto ni katte nagara',
        meaning: 'Mohon maaf atas ketidaknyamanan sepihak ini',
        mnemonic: 'Frasa pembuka wajib dalam surat pengumuman penutupan layanan atau libur perusahaan di Jepang.',
        speakText: '誠に勝手ながら',
      },
      {
        symbol: '廃止させていただきます',
        reading: 'haishi sasete itadakimasu',
        meaning: 'Dengan hormat kami hentikan/hapuskan (layanan)',
        mnemonic: '廃止 (haishi: penghapusan aturan/layanan) diperhalus dengan ～させていただきます.',
        speakText: '廃止させていただきます',
      },
    ],
    contrastiveTip:
      'Bentuk ～をもちまして khusus dipakai dalam pengumuman langsung kepada audiens/pelanggan (pidato, surat edaran), sedangkan ～をもって lazim di dokumen hukum atau laporan netral.',
  },
  'n1-u4-bicara-rakit': {
    headline: 'Bicara & Rakit Pernyataan Resmi Eksekutif',
    subtitle:
      'Latih penutupan presentasi profesional, penetapan tenggat pendaftaran, dan komitmen pelaksanaan tugas secara berwibawa.',
    items: [
      {
        symbol: '発表を終了させていただきます',
        reading: 'happyou o shuuryou sasete itadakimasu',
        meaning: 'Izinkan saya mengakhiri presentasi ini',
        mnemonic: 'Pasangan ideal setelah 以上をもちまして untuk menutup presentasi bisnis atau sidang skripsi.',
        speakText: '発表を終了させていただきます',
      },
      {
        symbol: '午後五時をもって締め切る',
        reading: 'gogo goji o motte shimekiru',
        meaning: 'Menutup pendaftaran tepat pukul lima sore',
        mnemonic: '締め切る (shimekiru) berarti menutup penerimaan lamaran, pemesanan, atau pendaftaran.',
        speakText: '午後五時をもって締め切る',
      },
      {
        symbol: '任務を遂行する',
        reading: 'ninmu o suikou suru',
        meaning: 'Menjalankan dan menuntaskan misi/tugas',
        mnemonic: '遂行する (suikou suru) lebih formal daripada 実行する; lazim untuk mandat penting.',
        speakText: '任務を遂行する',
      },
      {
        symbol: '閉会とさせていただきます',
        reading: 'heikai to sasete itadakimasu',
        meaning: 'Dengan ini acara kami nyatakan resmi ditutup',
        mnemonic: 'Kalimat pamungkas pembawa acara dalam seminar, konferensi, dan upacara resmi Jepang.',
        speakText: '閉会とさせていただきます',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～をもって (dengan sarana resmi / per tanggal berakhir) dengan ～において (di tempat / dalam bidang atau situasi tertentu).',
  },

  // ============================================================================
  // JLPT N1 — UNIT 5: ～極まりない (GP-JA-N1-005)
  // ============================================================================
  'n1-u5-kosakata': {
    headline: 'Kosakata Kritik Tajam & Etika Publik',
    subtitle:
      'Kuasai kosakata evaluatif yang sering dipakai diplomat, jurnalis, dan tajuk rencana untuk mengecam tindakan tidak pantas.',
    items: [
      {
        symbol: '遺憾',
        reading: 'ikan',
        meaning: 'Sangat disayangkan / disesalkan (bahasa diplomatik)',
        mnemonic: '遺憾の意を表す (menyatakan penyesalan mendalam) adalah ungkapan khas pernyataan resmi pemerintah.',
        speakText: '遺憾',
      },
      {
        symbol: '非常識',
        reading: 'hijoushiki',
        meaning: 'Tidak masuk akal / melanggar norma kepatutan',
        mnemonic: '非 (bukan/tanpa) + 常識 (akal sehat/norma sosial); sangat sering berkolokasi dengan 極まりない.',
        speakText: '非常識',
      },
      {
        symbol: '無責任',
        reading: 'musekinin',
        meaning: 'Tidak bertanggung jawab sama sekali',
        mnemonic: 'Dipakai untuk mengecam sikap lepas tangan pejabat, perusahaan, atau pihak berwenang.',
        speakText: '無責任',
      },
      {
        symbol: '極めて不適切',
        reading: 'kiwamete futekisetsu',
        meaning: 'Sangat / teramat tidak pantas',
        mnemonic: '極めて (kiwamete: teramat sangat) berbagi kanji yang sama dengan 極まりない.',
        speakText: '極めて不適切',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 遺憾 (ikan: penyesalan/kecaman resmi atas situasi yang mengecewakan) dengan 残念 (zannen: sayang sekali dalam percakapan sehari-hari).',
  },
  'n1-u5-pola-utama': {
    headline: 'Pola Utama: ～極まりない・～極まる・～の極み',
    subtitle:
      'Pelajari tiga pola penekanan tingkat ekstrem tertinggi dalam bahasa tulis N1 untuk mengungkapkan pujian puncak atau kecaman keras.',
    items: [
      {
        symbol: '非常識極まりない',
        reading: 'hijoushiki kiwamarinai',
        meaning: 'Sangat tidak masuk akal / kelewat batas',
        mnemonic: 'Adjektiva-na (tanpa な) + 極まりない menyatakan tingkat ekstrem yang tak terhingga.',
        speakText: '非常識極まりない',
      },
      {
        symbol: '失礼極まる',
        reading: 'shitsurei kiwamaru',
        meaning: 'Teramat sangat tidak sopan',
        mnemonic: '～極まる memiliki makna setara dengan ～極まりない, sering dipakai langsung di depan kata benda (失礼極まる態度).',
        speakText: '失礼極まる',
      },
      {
        symbol: '光栄の極みである',
        reading: 'kouei no kiwami de aru',
        meaning: 'Merupakan kehormatan yang setinggi-tingginya',
        mnemonic: 'Pola N + の極み dipakai untuk kata benda puncak emosi positif maupun negatif (痛恨の極み / 感激の極み).',
        speakText: '光栄の極みである',
      },
      {
        symbol: '危険極まりない',
        reading: 'kiken kiwamarinai',
        meaning: 'Sangat teramat berbahaya',
        mnemonic: 'Sangat sering muncul dalam artikel keselamatan kerja, keamanan siber, dan hukum.',
        speakText: '危険極まりない',
      },
    ],
    contrastiveTip:
      'Perhatikan kelas katanya: ～極まりない dan ～極まる terutama menempel pada akar adjektiva-na (危険 / 失礼 / 退屈), bukan pada adjektiva-i biasa seperti 高い atau 大きい.',
  },
  'n1-u5-dengar-baca': {
    headline: 'Kecaman Tajuk Rencana & Apresiasi Formal',
    subtitle:
      'Kenali kata sifat bernuansa tajam dan halus yang sering dipadukan dengan ～極まりない dalam ulasan buku, kebijakan, dan birokrasi.',
    items: [
      {
        symbol: '無謀極まりない判断',
        reading: 'mubou kiwamarinai handan',
        meaning: 'Keputusan yang teramat gegabah/nekat',
        mnemonic: '無謀 (mubou: nekat tanpa perhitungan risiko) lazim dalam kritik proyek tanpa kajian dampak.',
        speakText: '無謀極まりない判断',
      },
      {
        symbol: '煩雑極まりない手続き',
        reading: 'hanzatsu kiwamarinai tetsuzuki',
        meaning: 'Prosedur yang teramat berbelit-belit',
        mnemonic: '煩雑 (hanzatsu) menggambarkan birokrasi atau dokumen yang ruwet dan melelahkan.',
        speakText: '煩雑極まりない手続き',
      },
      {
        symbol: '精緻極まりない作り',
        reading: 'seichi kiwamarinai tsukuri',
        meaning: 'Garapan/rancangan yang teramat presisi dan halus',
        mnemonic: '精緻 (seichi: sangat halus/teliti) menunjukkan bahwa ～極まりない juga bisa dipakai untuk pujian tinggi.',
        speakText: '精緻極まりない作り',
      },
      {
        symbol: '強く抗議する',
        reading: 'tsuyoku kougi suru',
        meaning: 'Melayangkan protes keras',
        mnemonic: '抗議 (kougi: protes resmi) sering menyertai pernyataan sikap atas tindakan yang 遺憾.',
        speakText: '強く抗議する',
      },
    ],
    contrastiveTip:
      'Meski banyak dipakai untuk kritik negatif (失礼 / 危険 / 無謀), ～極まりない juga sah untuk pujian formal seperti 精緻極まりない atau 親切極まりない.',
  },
  'n1-u5-bicara-rakit': {
    headline: 'Bicara & Rakit Kritik Tajam Berbobot',
    subtitle:
      'Rangkai kalimat kritis yang tegas terhadap penyebaran hoaks, pembatalan sepihak mendadak, dan perilaku mengganggu publik.',
    items: [
      {
        symbol: '未確認の情報を拡散する',
        reading: 'mikakunin no jouhou o kakusan suru',
        meaning: 'Menyebarluaskan informasi yang belum terverifikasi',
        mnemonic: '拡散する (kakusan suru) adalah istilah media sosial untuk penyebaran viral/massif.',
        speakText: '未確認の情報を拡散する',
      },
      {
        symbol: '直前にキャンセルする',
        reading: 'chokuzen ni kyanseru suru',
        meaning: 'Membatalkan tepat sesaat sebelum acara',
        mnemonic: '直前 (chokuzen: sesaat sebelum) tanpa pemberitahuan sering dikritik sebagai 失礼極まりない.',
        speakText: '直前にキャンセルする',
      },
      {
        symbol: '多大な迷惑をかける',
        reading: 'tadai na meiwaku o kakeru',
        meaning: 'Menimbulkan kerepotan/kerugian yang sangat besar',
        mnemonic: '多大な (tadai na) adalah bentuk formal dari 大きな untuk dampak, kerugian, atau bantuan.',
        speakText: '多大な迷惑をかける',
      },
      {
        symbol: '大変失礼にあたる',
        reading: 'taihen shitsurei ni ataru',
        meaning: 'Tergolong tindakan yang sangat tidak sopan',
        mnemonic: '～にあたる berarti "termasuk/tergolong sebagai", cocok untuk penilaian etika formal.',
        speakText: '大変失礼にあたる',
      },
    ],
    contrastiveTip:
      'Karena ～極まりない bernada sangat kuat dan emosional-formal, hindari memakainya langsung ke atasan atau klien dalam percakapan kerja biasa.',
  },

  // ============================================================================
  // JLPT N1 — UNIT 6: ～なりに (GP-JA-N1-006)
  // ============================================================================
  'n1-u6-kosakata': {
    headline: 'Kosakata Refleksi, Empati & Kepemimpinan',
    subtitle:
      'Kuasai istilah bernuansa psikologis dan manajerial yang dipakai saat membahas upaya pribadi, inovasi tim, dan saling menghargai.',
    items: [
      {
        symbol: '模索',
        reading: 'mosaku',
        meaning: 'Pencarian jalan keluar dengan meraba/menjajaki berbagai cara',
        mnemonic: 'Sering dipakai dalam 解決策を模索する (berupaya mencari solusi di tengah ketidakpastian).',
        speakText: '模索',
      },
      {
        symbol: '創意工夫',
        reading: 'soui kufuu',
        meaning: 'Kreativitas dan ikhtiar perbaikan orisinal',
        mnemonic: 'Empat kanji (yojijukugo) populer di dunia kerja Jepang untuk inovasi dari inisiatif sendiri.',
        speakText: '創意工夫',
      },
      {
        symbol: '葛藤',
        reading: 'kattou',
        meaning: 'Konflik batin / pergulatan dilematis',
        mnemonic: 'Menggambarkan pertentangan dua nilai atau perasaan di dalam hati seseorang.',
        speakText: '葛藤',
      },
      {
        symbol: '誠実に向き合う',
        reading: 'seijitsu ni mukiau',
        meaning: 'Menghadapi (pekerjaan/masalah) dengan tulus dan sungguh-sungguh',
        mnemonic: '誠実 (seijitsu: tulus/berintegritas) + 向き合う (berhadapan langsung) adalah nilai kepemimpinan utama.',
        speakText: '誠実に向き合う',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 模索 (mosaku: menjajaki solusi di situasi yang belum jelas jalannya) dengan 検索 (kensaku: mencari data/informasi yang sudah ada).',
  },
  'n1-u6-pola-utama': {
    headline: 'Pola Utama: ～なりに & ～なりの',
    subtitle:
      'Pelajari cara menyatakan "sesuai kemampuan/kapasitas atau dengan caranya sendiri" secara rendah hati maupun empatik.',
    items: [
      {
        symbol: '自分なりにまとめる',
        reading: 'jibun nari ni matomeru',
        meaning: 'Merangkum dengan cara/kemampuan saya sendiri',
        mnemonic: 'N + なりに (adverbia) menerangkan kata kerja; sering dipakai dengan nada rendah hati saat mengajukan proposal.',
        speakText: '自分なりにまとめる',
      },
      {
        symbol: '世代なりの価値観',
        reading: 'sedai nari no kachikan',
        meaning: 'Nilai-nilai khas yang sesuai dengan generasinya',
        mnemonic: 'Gunakan ～なりの (dengan の) ketika pola ini langsung menerangkan kata benda di belakangnya.',
        speakText: '世代なりの価値観',
      },
      {
        symbol: '彼なりに努力している',
        reading: 'kare nari ni doryoku shite iru',
        meaning: 'Dia pun sedang berusaha dengan caranya sendiri',
        mnemonic: 'Menunjukkan empati bahwa meski hasilnya belum sempurna, orang tersebut sudah berupaya sesuai kapasitasnya.',
        speakText: '彼なりに努力している',
      },
      {
        symbol: '初心者なりに',
        reading: 'shoshinsha nari ni',
        meaning: 'Sesuai level/kapasitas seorang pemula',
        mnemonic: 'Sering dipakai untuk menghargai progres yang pantas bagi tahap kemampuan seseorang.',
        speakText: '初心者なりに',
      },
    ],
    contrastiveTip:
      'Hati-hati nuansa sopan santun: hindari memakai 社長なりに atau 先生なりに kepada atasan/guru secara langsung, karena ～なりに menyiratkan keterbatasan kapasitas ("lumayan untuk level dia").',
  },
  'n1-u6-dengar-baca': {
    headline: 'Wacana Empati & Pengelolaan Tim',
    subtitle:
      'Simak cara pemimpin tim menghargai inisiatif bawahan serta menyikapi keterbatasan waktu atau sumber daya dengan bijak.',
    items: [
      {
        symbol: '相手なりに考えた工夫',
        reading: 'aite nari ni kangaeta kufuu',
        meaning: 'Inisiatif/upaya yang dipikirkan lawan bicara dengan caranya sendiri',
        mnemonic: 'Mengakui usaha pihak lain terlebih dahulu sebelum memberi masukan adalah kunci manajemen tim di Jepang.',
        speakText: '相手なりに考えた工夫',
      },
      {
        symbol: '立場を尊重し合う',
        reading: 'tachiba o sonchou shiau',
        meaning: 'Saling menghormati posisi masing-masing',
        mnemonic: '尊重する (sonchou suru) berarti menghargai secara mendalam pendapat atau peran orang lain.',
        speakText: '立場を尊重し合う',
      },
      {
        symbol: '周囲への配慮',
        reading: 'shuui e no hairyo',
        meaning: 'Kepedulian dan tenggang rasa terhadap orang sekitar',
        mnemonic: '配慮 (hairyo) adalah kosakata kunci penilaian sikap kerja (jinji hyouka) di perusahaan Jepang.',
        speakText: '周囲への配慮',
      },
      {
        symbol: '不十分な点もありますが',
        reading: 'fujuubun na ten mo arimasu ga',
        meaning: 'Meskipun masih ada bagian yang belum sempurna...',
        mnemonic: 'Kalimat pembuka rendah hati yang sangat alami sebelum 自分なりに提案をまとめてみました.',
        speakText: '不十分な点もありますが',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～なりに (dengan caranya sendiri meski belum sempurna) dengan ～なりに vs ～なりに (pengulangan pola "jika terbatas, ya sesuai keterbatasannya").',
  },
  'n1-u6-bicara-rakit': {
    headline: 'Bicara & Rakit Refleksi Diri yang Matang',
    subtitle:
      'Latih struktur pengulangan AならAなりに dan ungkapan apresiasi keberagaman nilai antargenerasi.',
    items: [
      {
        symbol: '限られているなら限られているなりに',
        reading: 'kagirarete iru nara kagirarete iru nari ni',
        meaning: 'Jika memang terbatas, ya sesuai keterbatasan itu',
        mnemonic: 'Pola AならAなりに menekankan sikap adaptif: mengoptimalkan apa pun kondisi yang ada.',
        speakText: '限られているなら限られているなりに',
      },
      {
        symbol: '優先順位を明確にする',
        reading: 'yuusen jun-i o meikaku ni suru',
        meaning: 'Memperjelas urutan prioritas',
        mnemonic: '優先順位 (yuusen jun-i) adalah kata wajib manajemen waktu dan manajemen proyek.',
        speakText: '優先順位を明確にする',
      },
      {
        symbol: 'それぞれなりの価値観',
        reading: 'sorezore nari no kachikan',
        meaning: 'Pandangan nilai khas masing-masing pihak',
        mnemonic: 'Gunakan ～なりの sebelum kata benda 価値観 untuk mengakui perspektif tiap kelompok.',
        speakText: 'それぞれなりの価値観',
      },
      {
        symbol: '信頼関係の基盤',
        reading: 'shinrai kankei no kiban',
        meaning: 'Fondasi hubungan saling percaya',
        mnemonic: '基盤 (kiban: fondasi/basis) sering muncul dalam esai organisasi dan sosiologi N1.',
        speakText: '信頼関係の基盤',
      },
    ],
    contrastiveTip:
      'Pastikan kata sebelum なりに adalah bentuk biasa (V-biasa / Adj-biasa / N), bukan bentuk sopan ます/です.',
  },

  // ============================================================================
  // JLPT N1 — UNIT 7: ～ずにはおかない (GP-JA-N1-007)
  // ============================================================================
  'n1-u7-kosakata': {
    headline: 'Kosakata Dampak Sosial & Psikologi Publik',
    subtitle:
      'Kuasai istilah untuk menggambarkan reaksi kuat masyarakat, daya tarik karya seni, dan gelombang pujian maupun kritik.',
    items: [
      {
        symbol: '反発',
        reading: 'hanpatsu',
        meaning: 'Penolakan keras / reaksi perlawanan balik',
        mnemonic: '反発を招く (memicu penolakan keras) sering muncul dalam berita kebijakan publik kontroversial.',
        speakText: '反発',
      },
      {
        symbol: '魅了',
        reading: 'miryou',
        meaning: 'Memikat / mempesona secara mendalam',
        mnemonic: '人々を魅了する (memikat hati banyak orang) lazim dalam resensi film, musik, dan sastra.',
        speakText: '魅了',
      },
      {
        symbol: '懸念',
        reading: 'kenen',
        meaning: 'Kekhawatiran mendalam terhadap potensi masalah',
        mnemonic: 'Lebih formal dan analitis daripada 心配; sering dipakai diplomat dan analis kebijakan.',
        speakText: '懸念',
      },
      {
        symbol: '称賛を浴びる',
        reading: 'shousan o abiru',
        meaning: 'Menuai / dibanjiri pujian luas',
        mnemonic: '浴びる (bermandikan) secara kiasan berarti menerima pujian (称賛) atau kritik (批判) bertubi-tubi.',
        speakText: '称賛を浴びる',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 称賛 (shousan: pujian tinggi) dengan 賛成 (sansei: persetujuan atas usulan/pendapat).',
  },
  'n1-u7-pola-utama': {
    headline: 'Pola Utama: ～ずにはおかない / ～ないではおかない',
    subtitle:
      'Pahami pola penegasan kuat N1 bahwa suatu hal "pasti akan menimbulkan efek emosional/sosial tertentu, tanpa terkecuali".',
    items: [
      {
        symbol: '変えずにはおかない',
        reading: 'kaezu ni wa okanai',
        meaning: 'Pasti akan mengubah (cara pandang/kebiasaan)',
        mnemonic: 'Ambil bentuk ない (変えない), ganti ない menjadi ずにはおかない. Menunjukkan dampak yang tak terbendung.',
        speakText: '変えずにはおかない',
      },
      {
        symbol: '感動させずにはおかない',
        reading: 'kandou sasezu ni wa okanai',
        meaning: 'Pasti akan menggugah/membuat terharu (penonton)',
        mnemonic: 'Pengecualian する: する menjadi せずにはおかない; bentuk kausatif させる menjadi させずにはおかない.',
        speakText: '感動させずにはおかない',
      },
      {
        symbol: 'ないではおかない',
        reading: 'naide wa okanai',
        meaning: 'Pasti akan melakukan / menimbulkan efek (varian)',
        mnemonic: 'Memiliki makna setara dengan ～ずにはおかない; kadang juga dipakai untuk tekad kuat subjek.',
        speakText: 'ないではおかない',
      },
      {
        symbol: '促さずにはおかない',
        reading: 'unagasazu ni wa okanai',
        meaning: 'Pasti akan mendorong/memicu (perenungan mendalam)',
        mnemonic: '促す (unagasu: mendorong/memacu) menjadi 促さ + ずにはおかない.',
        speakText: '促さずにはおかない',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～ずにはおかない (subjek luar PASTI memicu reaksi/dampak pada orang lain) dengan ～ずにはいられない (pembicara sendiri TIDAK TAHAN ingin melakukan sesuatu).',
  },
  'n1-u7-dengar-baca': {
    headline: 'Dampak Karya Seni, Media & Kebijakan Publik',
    subtitle:
      'Cermati kolokasi khas resensi sastra, film dokumenter, dan opini publik yang menggunakan ～ずにはおかない.',
    items: [
      {
        symbol: '深い思索を促す',
        reading: 'fukai shisaku o unagasu',
        meaning: 'Mendorong perenungan yang mendalam',
        mnemonic: '思索 (shisaku: pemikiran/kontemplasi filosofis) adalah kosakata khas resensi buku dan film N1.',
        speakText: '深い思索を促す',
      },
      {
        symbol: '共感と議論を呼び起こす',
        reading: 'kyoukan to giron o yobiokosu',
        meaning: 'Membangkitkan empati sekaligus perdebatan',
        mnemonic: '呼び起こす (yobiokosu: membangkitkan/memicu) sering dipasangkan dengan reaksi publik.',
        speakText: '共感と議論を呼び起こす',
      },
      {
        symbol: '世論の認識を変える',
        reading: 'seron no ninshiki o kaeru',
        meaning: 'Mengubah persepsi/kesadaran publik',
        mnemonic: '認識 (ninshiki: kesadaran/persepsi) adalah kata kunci analisis media dan politik.',
        speakText: '世論の認識を変える',
      },
      {
        symbol: '傑作',
        reading: 'kessaku',
        meaning: 'Mahakarya / karya luar biasa',
        mnemonic: 'Sering menjadi penutup kalimat pujian karya seni yang memakai ～ずにはおかない.',
        speakText: '傑作',
      },
    ],
    contrastiveTip:
      'Ingat pengecualian する pada ～ずにはおかない: WAJIB menjadi せずにはおかない (bukan しずにはおかない).',
  },
  'n1-u7-bicara-rakit': {
    headline: 'Bicara & Rakit Analisis Dampak yang Meyakinkan',
    subtitle:
      'Rangkai kalimat retoris yang kuat untuk menggambarkan kekuatan pidato inspiratif dan dampak disrupsi inovasi teknologi.',
    items: [
      {
        symbol: '聴衆の胸を打たずにはおかない',
        reading: 'choushuu no mune o utazu ni wa okanai',
        meaning: 'Pasti akan menyentuh lubuk hati para hadirin',
        mnemonic: '胸を打つ (mune o utsu) adalah idiom bernuansa sastra untuk "sangat mengharukan/menggugah hati".',
        speakText: '聴衆の胸を打たずにはおかない',
      },
      {
        symbol: '根本から変えずにはおかない',
        reading: 'konpon kara kaezu ni wa okanai',
        meaning: 'Pasti akan mengubah secara mendasar dari akarnya',
        mnemonic: '根本から (konpon kara: dari akarnya) memperkuat dampak transformatif teknologi baru.',
        speakText: '根本から変えずにはおかない',
      },
      {
        symbol: '心のこもった演説',
        reading: 'kokoro no komotta enzetsu',
        meaning: 'Pidato yang penuh ketulusan hati',
        mnemonic: '演説 (enzetsu) berarti pidato resmi di hadapan publik luas.',
        speakText: '心のこもった演説',
      },
      {
        symbol: '技術革新',
        reading: 'gijutsu kakushin',
        meaning: 'Inovasi / terobosan teknologi',
        mnemonic: 'Padanan kango formal dari イノベーション dalam berita ekonomi dan jurnal ilmiah Jepang.',
        speakText: '技術革新',
      },
    ],
    contrastiveTip:
      '～ずにはおかない sering menggunakan kata kerja transitif/kausatif yang menyasar perasaan orang lain (mengubah, menyentuh, membuat kagum, memicu amarah).',
  },

  // ============================================================================
  // JLPT N1 — UNIT 8: ～ともなると (GP-JA-N1-008)
  // ============================================================================
  'n1-u8-kosakata': {
    headline: 'Kosakata Eksekutif, Korporasi & Skala Besar',
    subtitle:
      'Kuasai istilah tingkat tinggi seputar perusahaan terbuka, dewan direksi, anggaran negara, dan standar global.',
    items: [
      {
        symbol: '上場企業',
        reading: 'joujou kigyou',
        meaning: 'Perusahaan terbuka yang tercatat di bursa saham',
        mnemonic: '上場 (listing di bursa) menandakan skala besar, reputasi tinggi, dan pengawasan ketat.',
        speakText: '上場企業',
      },
      {
        symbol: '取締役会',
        reading: 'torishimariyakukai',
        meaning: 'Rapat dewan direksi',
        mnemonic: '取締役 (torishimariyaku) adalah anggota direksi/board of directors perusahaan Jepang.',
        speakText: '取締役会',
      },
      {
        symbol: '国家予算',
        reading: 'kokka yosan',
        meaning: 'Anggaran belanja negara (APBN)',
        mnemonic: 'Dipakai untuk menggambarkan proyek berskala nasional yang diawasi ketat oleh publik.',
        speakText: '国家予算',
      },
      {
        symbol: '厳重な警備体制',
        reading: 'genjuu na keibi taisei',
        meaning: 'Sistem pengamanan super ketat',
        mnemonic: '厳重 (genjuu: ketat/berlapis) sering muncul saat KTT atau pertemuan kepala negara.',
        speakText: '厳重な警備体制',
      },
    ],
    contrastiveTip:
      'Perhatikan bacaan 取締役: dibaca "torishimariyaku" (bukan torishimari-shoku). Kata ini wajib dikenal untuk membaca berita bisnis Jepang.',
  },
  'n1-u8-pola-utama': {
    headline: 'Pola Utama: ～ともなると & ～ともなれば',
    subtitle:
      'Pelajari pola N1 untuk menyatakan bahwa ketika seseorang/sesuatu sudah mencapai level tinggi atau tahap tertentu, tuntutan dan skalanya ikut jauh berbeda.',
    items: [
      {
        symbol: '事業部長ともなると',
        reading: 'jigyoubuchou to mo naru to',
        meaning: 'Jika sudah sampai level kepala divisi bisnis',
        mnemonic: 'N + ともなると menyoroti status/tahap yang tinggi atau khusus, diikuti konsekuensi yang sepadan.',
        speakText: '事業部長ともなると',
      },
      {
        symbol: '世界一流ともなれば',
        reading: 'sekai ichiryuu to mo nareba',
        meaning: 'Kalau sudah sekelas bintang satu dunia',
        mnemonic: '～ともなれば sedikit lebih menekankan pengandaian/penegasan daripada ～ともなると, namun maknanya setara.',
        speakText: '世界一流ともなれば',
      },
      {
        symbol: '旗艦店ともなると',
        reading: 'kikanten to mo naru to',
        meaning: 'Kalau sudah sekelas toko utama (flagship store)',
        mnemonic: '旗艦店 (kikanten: flagship store) di pusat kota menunjukkan skala pengunjung puluhan ribu per hari.',
        speakText: '旗艦店ともなると',
      },
      {
        symbol: '数万人に及ぶ',
        reading: 'suumannin ni oyobu',
        meaning: 'Mencapai / menyentuh angka puluhan ribu orang',
        mnemonic: '～に及ぶ (ni oyobu) adalah pasangan formal untuk menyatakan skala jumlah atau jangkauan besar.',
        speakText: '数万人に及ぶ',
      },
    ],
    contrastiveTip:
      'Jangan pakai ～ともなると untuk level rendah atau situasi biasa (misalnya 新入社員ともなると terasa janggal kecuali ada konteks ironi); gunakan untuk tingkat tinggi, skala besar, atau musim/tahap tertentu.',
  },
  'n1-u8-dengar-baca': {
    headline: 'Standar Global & Ekspektasi Kepemimpinan',
    subtitle:
      'Simak bagaimana media dan eksekutif membahas visi jangka panjang pemimpin divisi serta ketatnya standar internasional.',
    items: [
      {
        symbol: '五年先を見据える',
        reading: 'gonen saki o misueru',
        meaning: 'Memandang jauh lima tahun ke depan',
        mnemonic: '見据える (misueru) berarti menatap tajam masa depan dengan perencanaan strategis.',
        speakText: '五年先を見据える',
      },
      {
        symbol: '目先の業績',
        reading: 'mesaki no gyouseki',
        meaning: 'Kinerja jangka pendek di depan mata saja',
        mnemonic: '目先 (mesaki) sering dikontraskan dengan visi jangka panjang seorang pemimpin senior.',
        speakText: '目先の業績',
      },
      {
        symbol: '戦略立案',
        reading: 'senryaku ritsuan',
        meaning: 'Perumusan / penyusunan strategi',
        mnemonic: 'Istilah korporat tingkat manajerial yang melampaui sekadar eksekusi harian.',
        speakText: '戦略立案',
      },
      {
        symbol: '社会的な責任',
        reading: 'shakaiteki na sekinin',
        meaning: 'Tanggung jawab sosial (CSR / akuntabilitas publik)',
        mnemonic: 'Semakin tinggi jabatan (役職が上がるほど), semakin berat tanggung jawab sosial yang diemban.',
        speakText: '社会的な責任',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～ともなると (kalau sudah mencapai level tinggi/tahap khusus, wajar tuntutannya besar) dengan ～になると (sekadar perubahan waktu/kondisi netral seperti "saat masuk musim dingin").',
  },
  'n1-u8-bicara-rakit': {
    headline: 'Bicara & Rakit Standar Profesional Tinggi',
    subtitle:
      'Susun kalimat berwibawa untuk menjelaskan pengawasan publik pada proyek negara dan daya tarik institusi kelas dunia.',
    items: [
      {
        symbol: '国家的な事業ともなると',
        reading: 'kokkateki na jigyou to mo naru to',
        meaning: 'Jika sudah merupakan proyek berskala nasional',
        mnemonic: '国家的な (berskala negara) langsung menaikkan bobot kalimat menuju pengawasan ketat.',
        speakText: '国家的な事業ともなると',
      },
      {
        symbol: '国民の監視の目',
        reading: 'kokumin no kanshi no me',
        meaning: 'Sorotan / pengawasan mata publik',
        mnemonic: '監視の目が厳しい berarti diawasi dengan sangat ketat oleh masyarakat dan media.',
        speakText: '国民の監視の目',
      },
      {
        symbol: '発売と同時に完売する',
        reading: 'hatsubai to douji ni kanbai suru',
        meaning: 'Langsung ludes terjual begitu dirilis',
        mnemonic: '完売 (kanbai: terjual habis/sold out) menunjukkan antusiasme luar biasa pada kelas papan atas.',
        speakText: '発売と同時に完売する',
      },
      {
        symbol: '例年にない規模',
        reading: 'reinen ni nai kibo',
        meaning: 'Skala yang belum pernah ada di tahun-tahun biasa',
        mnemonic: '例年にない (tidak seperti tahun-tahun lazimnya) menegaskan tingkat luar biasa suatu peristiwa.',
        speakText: '例年にない規模',
      },
    ],
    contrastiveTip:
      'Di depan ともなると / ともなれば, kata benda dan verba bentuk kamus sama-sama dapat menempel langsung (contoh: 社長ともなると / 独立するともなれば).',
  },

  // ============================================================================
  // JLPT N1 — UNIT 9: ～いかんによらず (GP-JA-N1-009)
  // ============================================================================
  'n1-u9-kosakata': {
    headline: 'Kosakata Regulasi, Hukum & Kepatuhan',
    subtitle:
      'Kuasai istilah legal dan tata kelola perusahaan yang muncul dalam kontrak kerja, syarat layanan, dan aturan kepatuhan.',
    items: [
      {
        symbol: '規約',
        reading: 'kiyaku',
        meaning: 'Peraturan / syarat dan ketentuan resmi (terms)',
        mnemonic: '利用規約 (riyou kiyaku: syarat penggunaan layanan) wajib dipahami saat hidup dan bekerja di Jepang.',
        speakText: '規約',
      },
      {
        symbol: '処分',
        reading: 'shobun',
        meaning: 'Sanksi disiplin / tindakan tegas (atau pembuangan)',
        mnemonic: 'Dalam konteks kepatuhan (懲戒処分), berarti sanksi disipliner bagi pelanggar aturan.',
        speakText: '処分',
      },
      {
        symbol: '公平',
        reading: 'kouhei',
        meaning: 'Adil dan tidak memihak (impartial)',
        mnemonic: '公平な審査 (penilaian yang adil tanpa bias) berpasangan erat dengan ～いかんによらず.',
        speakText: '公平',
      },
      {
        symbol: '守秘義務',
        reading: 'shuhi gimu',
        meaning: 'Kewajiban menjaga kerahasiaan (NDA / confidentiality)',
        mnemonic: '守秘義務を負う (memikul kewajiban kerahasiaan) adalah klausul baku di setiap kontrak kerja Jepang.',
        speakText: '守秘義務',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 公平 (kouhei: adil tanpa berat sebelah dalam aturan/penilaian) dengan 平等 (byoudou: setara/sama rata dalam hak dan perlakuan).',
  },
  'n1-u9-pola-utama': {
    headline: 'Pola Utama: ～いかんによらず・～いかんにかかわらず・～いかんによっては',
    subtitle:
      'Bedakan dua kelompok pola いかん (bagaimana keadaannya): "tanpa memandang kondisi A" versus "tergantung pada kondisi A".',
    items: [
      {
        symbol: '経歴のいかんによらず',
        reading: 'keireki no ikan ni yorazu',
        meaning: 'Tanpa memandang latar belakang riwayat karier',
        mnemonic: 'N + (の) いかんによらず berarti "tidak peduli bagaimana pun keadaan N, aturannya tetap sama".',
        speakText: '経歴のいかんによらず',
      },
      {
        symbol: '理由のいかんにかかわらず',
        reading: 'riyuu no ikan ni kakawarazu',
        meaning: 'Terlepas dari apa pun alasannya',
        mnemonic: 'Sinonim sangat resmi dari ～いかんによらず; sangat sering dipakai dalam klausul larangan atau kebijakan tiket.',
        speakText: '理由のいかんにかかわらず',
      },
      {
        symbol: '結果のいかんによっては',
        reading: 'kekka no ikan ni yotte wa',
        meaning: 'Bergantung pada bagaimana hasilnya nanti',
        mnemonic: 'Hati-hati! いかんによっては dan いかんで maknanya BERLAWANAN: artinya "tergantung pada N", bukan "tanpa memandang N".',
        speakText: '結果のいかんによっては',
      },
      {
        symbol: 'どなたでもご応募いただけます',
        reading: 'donata demo go-oubo itadakemasu',
        meaning: 'Siapa pun dipersilakan untuk mendaftar/melamar',
        mnemonic: 'Kalimat inklusif lowongan kerja yang sering menutup klausa 年齢や経歴のいかんによらず.',
        speakText: 'どなたでもご応募いただけます',
      },
    ],
    contrastiveTip:
      'Jangan sampai terbalik! いかんによらず / いかんにかかわらず = TANPA memandang kondisi; sedangkan いかんで / いかんによっては = TERGANTUNG pada kondisi!',
  },
  'n1-u9-dengar-baca': {
    headline: 'Klausul Hukum, Kebijakan Tiket & Kepatuhan Publik',
    subtitle:
      'Kenali bahasa formal syarat transaksi dan penolakan halus berbasis kebijakan yang sering terdengar di pengumuman resmi.',
    items: [
      {
        symbol: 'ご都合のいかんによらず',
        reading: 'gotsugou no ikan ni yorazu',
        meaning: 'Tanpa memandang alasan atau keperluan pribadi Anda',
        mnemonic: 'Frasa baku dalam syarat pembelian tiket konser, pesawat, dan reservasi hotel Jepang.',
        speakText: 'ご都合のいかんによらず',
      },
      {
        symbol: '払い戻しには応じかねます',
        reading: 'haraimodoshi ni wa oujikanemasu',
        meaning: 'Kami tidak dapat melayani pengembalian dana (refund)',
        mnemonic: '払い戻し (refund) + 応じかねます (penolakan halus resmi) wajib dikenal untuk urusan konsumen di Jepang.',
        speakText: '払い戻しには応じかねます',
      },
      {
        symbol: '努力いかんで決まる',
        reading: 'doryoku ikan de kimaru',
        meaning: 'Ditentukan sepenuhnya oleh seberapa besar usahanya',
        mnemonic: 'N + (の) いかんで menyatakan bahwa hasil akhir bergantung langsung pada faktor N tersebut.',
        speakText: '努力いかんで決まる',
      },
      {
        symbol: '法の下において',
        reading: 'hou no moto ni oite',
        meaning: 'Di hadapan / di bawah naungan hukum',
        mnemonic: 'Ungkapan konstitusional baku untuk menegaskan prinsip kesetaraan di depan hukum.',
        speakText: '法の下において',
      },
    ],
    contrastiveTip:
      'いかん berasal dari bahasa klasik 如何 (bagaimana). Karena itu, jangan pakai kata tanya lain (seperti どんな) secara berlebihan di depannya kecuali pola penegas いかなる理由のいかんによらず.',
  },
  'n1-u9-bicara-rakit': {
    headline: 'Bicara & Rakit Prinsip Kepatuhan & Kesetaraan',
    subtitle:
      'Susun pernyataan prinsip organisasi mengenai kesetaraan hak anggota dan toleransi nol terhadap kekerasan atau pelanggaran.',
    items: [
      {
        symbol: '平等の権利を有する',
        reading: 'byoudou no kenri o yuusuru',
        meaning: 'Memiliki hak yang setara',
        mnemonic: '有する (yuusuru) adalah padanan bahasa hukum dari 持つ (memiliki hak/kewenangan).',
        speakText: '平等の権利を有する',
      },
      {
        symbol: '決して容認されない',
        reading: 'kesshite younin sarenai',
        meaning: 'Sama sekali tidak dapat ditoleransi/dibenarkan',
        mnemonic: '容認する (younin suru: memaklumi/membenarkan) dalam bentuk negatif menegaskan prinsip zero tolerance.',
        speakText: '決して容認されない',
      },
      {
        symbol: 'いかなる理由のいかんによらず',
        reading: 'ikanaru riyuu no ikan ni yorazu',
        meaning: 'Apa pun alasannya tanpa pengecualian',
        mnemonic: 'いかなる (apa pun) memberi penegasan hukum terkuat untuk larangan mutlak.',
        speakText: 'いかなる理由のいかんによらず',
      },
      {
        symbol: '出身や経歴',
        reading: 'shusshin ya keireki',
        meaning: 'Asal-usul maupun riwayat karier/pendidikan',
        mnemonic: 'Pasangan kata standar dalam kebijakan non-diskriminasi dan perekrutan terbuka.',
        speakText: '出身や経歴',
      },
    ],
    contrastiveTip:
      'Karena ～いかんによらず sangat kaku dan bergaya hukum/peraturan, gunakan di dokumen resmi, kontrak, atau pidato formal, bukan obrolan santai.',
  },

  // ============================================================================
  // JLPT N1 — UNIT 10: ～に足る (GP-JA-N1-010)
  // ============================================================================
  'n1-u10-kosakata': {
    headline: 'Kosakata Penilaian, Kredibilitas & Bukti Ilmiah',
    subtitle:
      'Kuasai istilah akademik dan evaluatif untuk menilai bobot riset, kelayakan proposal investasi, dan reputasi profesional.',
    items: [
      {
        symbol: '根拠',
        reading: 'konkyo',
        meaning: 'Dasar argumen / landasan bukti yang sahih',
        mnemonic: '明確な根拠がある (memiliki landasan bukti jelas) kontras dengan 憶測 (okusoku: spekulasi semata).',
        speakText: '根拠',
      },
      {
        symbol: '実績',
        reading: 'jisseki',
        meaning: 'Rekam jejak / capaian nyata yang telah terbukti',
        mnemonic: 'Kata kunci dalam wawancara kerja dan presentasi kredibilitas perusahaan di Jepang.',
        speakText: '実績',
      },
      {
        symbol: '新規性と社会的意義',
        reading: 'shinkisei to shakaiteki igi',
        meaning: 'Kebaruan (novelty) dan signifikansi sosial',
        mnemonic: 'Dua kriteria utama penilaian proposal penelitian atau hibah akademik di universitas Jepang.',
        speakText: '新規性と社会的意義',
      },
      {
        symbol: '評価に値する',
        reading: 'hyouka ni ataisuru',
        meaning: 'Layak / pantas mendapatkan penghargaan atau penilaian tinggi',
        mnemonic: 'Sinonim dekat dari ～に足る yang juga sangat sering muncul di bacaan N1.',
        speakText: '評価に値する',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 実績 (jisseki: prestasi/rekam jejak yang sudah dicapai) dengan 実験 (jikken: percobaan) atau 実践 (jissen: praktik nyata).',
  },
  'n1-u10-pola-utama': {
    headline: 'Pola Utama: ～に足る & ～に足りない',
    subtitle:
      'Pelajari pola evaluatif puncak N1 untuk menyatakan apakah suatu hal "cukup berbobot / layak untuk..." atau "terlalu sepele / tidak layak untuk...".',
    items: [
      {
        symbol: '注目に足る成果',
        reading: 'chuumoku ni taru seika',
        meaning: 'Capaian yang layak mendapatkan perhatian dunia',
        mnemonic: 'N (kata benda aksi) / V-dict + に足る menyatakan bobot atau nilai yang memadai.',
        speakText: '注目に足る成果',
      },
      {
        symbol: '信頼するに足る人物',
        reading: 'shinrai suru ni taru jinbutsu',
        meaning: 'Sosok yang benar-benar layak dipercaya',
        mnemonic: 'Verba bentuk kamus langsung diikuti に足る (atau bentuk tertulisnya に足りる).',
        speakText: '信頼するに足る人物',
      },
      {
        symbol: '恐れるに足りない',
        reading: 'osoreru ni tarinai',
        meaning: 'Tidak layak / tidak perlu ditakuti (terlalu kecil)',
        mnemonic: 'Bentuk negatif WAJIB memakai に足りない (bukan にたらない dalam bentuk baku N1 ini).',
        speakText: '恐れるに足りない',
      },
      {
        symbol: '取るに足りない問題',
        reading: 'toru ni tarinai mondai',
        meaning: 'Masalah yang teramat sepele / tidak berarti',
        mnemonic: 'Idiom tetap N1: 取るに足りない berarti tidak pantas diambil pusing.',
        speakText: '取るに足りない問題',
      },
    ],
    contrastiveTip:
      'Perhatikan perbedaan positif dan negatifnya: positif biasanya memakai ～に足る (terutama di depan nomina), sedangkan negatifnya memakai ～に足りない (misalnya 反論するに足りない).',
  },
  'n1-u10-dengar-baca': {
    headline: 'Evaluasi Kualitas, Kritik & Reputasi',
    subtitle:
      'Cermati bagaimana teks editorial dan akademik membedakan argumen yang layak ditanggapi dari rumor tak berdasar.',
    items: [
      {
        symbol: '反論するに足りない',
        reading: 'hanron suru ni tarinai',
        meaning: 'Tidak layak untuk dibantah sekalipun',
        mnemonic: 'Dipakai untuk menepis kritik berbasis rumor (出所不明の憶測) secara elegan namun tajam.',
        speakText: '反論するに足りない',
      },
      {
        symbol: '出所不明の憶測',
        reading: 'shussho fumei no okusoku',
        meaning: 'Spekulasi yang tidak jelas sumber asalnya',
        mnemonic: '憶測 (okusoku: dugaan tanpa bukti) kontras tegas dengan 客観的な証拠 (bukti objektif).',
        speakText: '出所不明の憶測',
      },
      {
        symbol: '画期的な成果',
        reading: 'kakkiteki na seika',
        meaning: 'Hasil terobosan yang membuka babak baru',
        mnemonic: '画期的 (kakkiteki: groundbreaking/revolusioner) lazim dalam berita sains dan inovasi.',
        speakText: '画期的な成果',
      },
      {
        symbol: '検討する価値がある',
        reading: 'kentou suru kachi ga aru',
        meaning: 'Memiliki nilai yang layak untuk dikaji',
        mnemonic: 'Padanan parafrase alami dari 検討に足る dalam penjelasan atau soal kesamaan makna JLPT N1.',
        speakText: '検討する価値がある',
      },
    ],
    contrastiveTip:
      'Jangan pakai ～に足る untuk urusan fisik sederhana seperti "cukup untuk dimakan" (食べるに足る tidak alami); pola ini khusus untuk penilaian abstrak seperti percaya, menghormati, khawatir, atau memperhatikan.',
  },
  'n1-u10-bicara-rakit': {
    headline: 'Bicara & Rakit Evaluasi Tingkat N1',
    subtitle:
      'Rangkai pernyataan evaluasi akhir tentang kelayakan investasi jangka panjang dan penyikapan bijak atas perbedaan sepele.',
    items: [
      {
        symbol: '長期的な投資に足る',
        reading: 'choukiteki na toushi ni taru',
        meaning: 'Layak untuk mendapatkan investasi jangka panjang',
        mnemonic: '投資に足る将来性 (prospek masa depan yang layak diinvestasikan) adalah frasa puncak presentasi bisnis.',
        speakText: '長期的な投資に足る',
      },
      {
        symbol: '将来性を備えている',
        reading: 'shouraisei o sonaete iru',
        meaning: 'Memiliki / dibekali potensi masa depan yang cerah',
        mnemonic: '備える (sonaeru) dalam konteks evaluasi berarti "memiliki kualitas/atribut yang mumpuni".',
        speakText: '将来性を備えている',
      },
      {
        symbol: '些細な問題',
        reading: 'sasai na mondai',
        meaning: 'Masalah kecil yang sepele',
        mnemonic: '些細 (sasai) adalah pasangan alami untuk 恐れるに足りない atau 気にするに足りない.',
        speakText: '些細な問題',
      },
      {
        symbol: '尊敬に足る人物',
        reading: 'sonkei ni taru jinbutsu',
        meaning: 'Sosok yang patut dihormati dan diteladani',
        mnemonic: 'Mengakhiri perjalanan JLPT N1 dengan ungkapan apresiasi paling berwibawa dalam bahasa Jepang.',
        speakText: '尊敬に足る人物',
      },
    ],
    contrastiveTip:
      'Di ujian JLPT N1, ～に足る sering diuji berdampingan dengan ～に値する (layak mendapat penilaian) dan ～に堪える (tahan diuji/layak dinikmati, seperti 鑑賞に堪える). Perhatikan kolokasi kata benda di depannya!',
  },
}

export const NODE_PREVIEWS_N2_N1: Record<string, LevelNodePreviewInfo> = {
  // ============================================================================
  // JLPT N2 NODE PREVIEWS (50 LESSONS)
  // ============================================================================
  // Unit 1: GP-JA-N2-001 (～にあたって)
  'n2-u1-kosakata': {
    chips: ['実施', '方針', '開会', '契約を結ぶ'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-001',
  },
  'n2-u1-pola-utama': {
    chips: ['～にあたって', '～にあたり', '開始にあたって', 'V-dict + にあたり'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-001',
  },
  'n2-u1-dengar-baca': {
    chips: ['導入にあたり', '卒業式にあたり', '参加にあたっては', '監査を迎える'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-001',
  },
  'n2-u1-bicara-rakit': {
    chips: ['契約の締結', '海外進出', '業務提携', '転勤にあたり'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-001',
  },
  'n2-u1-tes-akhir': {
    chips: ['Uji ～にあたって', 'Pidato Resmi', 'Kontrak Bisnis', '4 Pilar N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-001',
  },

  // Unit 2: GP-JA-N2-002 (～に伴って)
  'n2-u2-kosakata': {
    chips: ['物価', '普及', '少子高齢化', '需要'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-002',
  },
  'n2-u2-pola-utama': {
    chips: ['～に伴って', '～に伴い', '～に伴う + N', '景気回復'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-002',
  },
  'n2-u2-dengar-baca': {
    chips: ['新駅開業に伴い', '地価上昇', '市場拡大', '人材需要'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-002',
  },
  'n2-u2-bicara-rakit': {
    chips: ['ネット通販', '配達員の負担', '気温上昇', '異常気象'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-002',
  },
  'n2-u2-tes-akhir': {
    chips: ['Uji ～に伴って', 'Berita Ekonomi', 'Tren Sosial', '4 Pilar N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-002',
  },

  // Unit 3: GP-JA-N2-003 (～に限らず)
  'n2-u3-kosakata': {
    chips: ['世代', '顧客', '多様性', '学び直し'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-003',
  },
  'n2-u3-pola-utama': {
    chips: ['～に限らず', 'Aに限らずBも', '国内に限らず', 'IT分野'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-003',
  },
  'n2-u3-dengar-baca': {
    chips: ['平日に限らず', '和食に限らず', '賑わう', '広く活用'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-003',
  },
  'n2-u3-bicara-rakit': {
    chips: ['男性に限らず', '技術分野で活躍', '一年中', '水分補給'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-003',
  },
  'n2-u3-tes-akhir': {
    chips: ['Uji ～に限らず', 'Pasar Global', 'Keragaman', '4 Pilar N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-003',
  },

  // Unit 4: GP-JA-N2-004 (～わけにはいかない)
  'n2-u4-kosakata': {
    chips: ['機密', '納期', '立場', '約束を破る'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-004',
  },
  'n2-u4-pola-utama': {
    chips: ['～わけにはいかない', '～ないわけにはいかない', '休むわけには', '引き受けない'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-004',
  },
  'n2-u4-dengar-baca': {
    chips: ['飲むわけには', '黙って見ている', '対応しない', '最終確認'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-004',
  },
  'n2-u4-bicara-rakit': {
    chips: ['取引先のご依頼', '断るわけには', '放っておく', '約束した以上'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-004',
  },
  'n2-u4-tes-akhir': {
    chips: ['Uji わけにはいかない', 'Etika Kerja', 'Komitmen', '4 Pilar N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-004',
  },

  // Unit 5: GP-JA-N2-005 (～ざるを得ない)
  'n2-u5-kosakata': {
    chips: ['中止', '撤退', '予算', '部品の供給'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-005',
  },
  'n2-u5-pola-utama': {
    chips: ['～ざるを得ない', 'せざるを得ない', '削らざるを得ない', '認めざるを得ない'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-005',
  },
  'n2-u5-dengar-baca': {
    chips: ['妥協せざるを得ない', '断念する', '同意する', '辞退する'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-005',
  },
  'n2-u5-bicara-rakit': {
    chips: ['取りやめる', '見直さざるを得ない', '日程が重なる', '当初の計画'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-005',
  },
  'n2-u5-tes-akhir': {
    chips: ['Uji ざるを得ない', 'Manajemen Krisis', 'Negosiasi', '4 Pilar N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-005',
  },

  // Unit 6: GP-JA-N2-006 (～にもかかわらず)
  'n2-u6-kosakata': {
    chips: ['悪天候', '検証', '費用', '時間通り'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-006',
  },
  'n2-u6-pola-utama': {
    chips: ['～にもかかわらず', 'N + である', 'V-た + にもかかわらず', 'お忙しい中'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-006',
  },
  'n2-u6-dengar-baca': {
    chips: ['景気低迷', '前年を上回る', 'それにもかかわらず', '未経験'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-006',
  },
  'n2-u6-bicara-rakit': {
    chips: ['ご多忙にもかかわらず', '遠方より', '説明を受けた', '結果 kontras'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-006',
  },
  'n2-u6-tes-akhir': {
    chips: ['Uji にもかかわらず', 'Laporan Berita', 'Kontras', '4 Pilar N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-006',
  },

  // Unit 7: GP-JA-N2-007 (～上で)
  'n2-u7-kosakata': {
    chips: ['検討', '確認', '理解', '正式なスケジュール'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-007',
  },
  'n2-u7-pola-utama': {
    chips: ['V-た上で', 'V-る上で', 'Nの上で', '把握した上で'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-007',
  },
  'n2-u7-dengar-baca': {
    chips: ['比較した上で', '見学した上で', '判断する', 'お見積書'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-007',
  },
  'n2-u7-bicara-rakit': {
    chips: ['学ぶ上で', '内容を精査', '改めてご連絡', '相談した上で'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-007',
  },
  'n2-u7-tes-akhir': {
    chips: ['Uji ～上で', 'Rapat Strategi', 'Kontrak', '4 Pilar N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-007',
  },

  // Unit 8: GP-JA-N2-008 (～つつある)
  'n2-u8-kosakata': {
    chips: ['移行', '回復', '衰退', '定着する'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-008',
  },
  'n2-u8-pola-utama': {
    chips: ['～つつある', '変わりつつある', '進みつつある', '改善されつつある'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-008',
  },
  'n2-u8-dengar-baca': {
    chips: ['精度向上', '自動化が進む', '定着しつつある', '人手不足を補う'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-008',
  },
  'n2-u8-bicara-rakit': {
    chips: ['完成に近づく', '次第に曖昧に', '価値観', '在宅勤務'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-008',
  },
  'n2-u8-tes-akhir': {
    chips: ['Uji ～つつある', 'Transformasi', 'Tren Zaman', '4 Pilar N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-008',
  },

  // Unit 9: GP-JA-N2-009 (～かねない)
  'n2-u9-kosakata': {
    chips: ['事故', '信用', '漏洩', '点検を怠る'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-009',
  },
  'n2-u9-pola-utama': {
    chips: ['～かねない', '体調を崩し', '大けがをし', '消えかねない'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-009',
  },
  'n2-u9-dengar-baca': {
    chips: ['混乱を招く', '経営を圧迫', '損失を生む', '弱音を吐く'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-009',
  },
  'n2-u9-bicara-rakit': {
    chips: ['故障が広がる', '不正確な発表', '性急な判断', '懸念'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-009',
  },
  'n2-u9-tes-akhir': {
    chips: ['Uji ～かねない', 'Analisis Risiko', 'Peringatan', '4 Pilar N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-009',
  },

  // Unit 10: GP-JA-N2-010 (Sonkeigo Baku)
  'n2-u10-kosakata': {
    chips: ['ご覧になる', 'おっしゃる', 'いらっしゃる', 'お越しになる'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-010',
  },
  'n2-u10-pola-utama': {
    chips: ['お～になる', 'ご～なさる', 'ご存じですか', 'お尋ねください'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-010',
  },
  'n2-u10-dengar-baca': {
    chips: ['席を外す', 'お戻りになる', 'ご相談ください', 'ご不明な点'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-010',
  },
  'n2-u10-bicara-rakit': {
    chips: ['お待たせいたしました', 'お入りください', 'お越しくださり', 'ご覧になりましたか'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-010',
  },
  'n2-u10-tes-akhir': {
    chips: ['Simulasi JLPT N2', 'Sonkeigo', 'Bisnis & Berita', 'Ujian Akhir N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-010',
  },

  // ============================================================================
  // JLPT N1 NODE PREVIEWS (50 LESSONS)
  // ============================================================================
  // Unit 1: GP-JA-N1-001 (～に至って)
  'n1-u1-kosakata': {
    chips: ['深刻化', '発覚', '抜本的', '再発防止策'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-001',
  },
  'n1-u1-pola-utama': {
    chips: ['～に至って', '～に至っては', '～に至るまで', '決定に至った経緯'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-001',
  },
  'n1-u1-dengar-baca': {
    chips: ['合意に至らず', '決裂するに至り', '全面的刷新', '細部に至るまで'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-001',
  },
  'n1-u1-bicara-rakit': {
    chips: ['対応に乗り出す', '立案から運用', '拡大するに至った', '世論の信頼'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-001',
  },
  'n1-u1-tes-akhir': {
    chips: ['Uji ～に至って', 'Analisis Krisis', 'Editorial N1', '4 Pilar N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-001',
  },

  // Unit 2: GP-JA-N1-002 (～を余儀なくされる)
  'n1-u2-kosakata': {
    chips: ['操業停止', '財政難', '経営再建', '方針転換'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-002',
  },
  'n1-u2-pola-utama': {
    chips: ['～を余儀なくされる', '～を余儀なくさせる', '避難生活', '棄権'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-002',
  },
  'n1-u2-dengar-baca': {
    chips: ['大幅な減産', '欠航・遅延', '一時閉館', '営業時間短縮'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-002',
  },
  'n1-u2-bicara-rakit': {
    chips: ['サービス縮小', '運転見合わせ', '避難所移動', 'システム改修'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-002',
  },
  'n1-u2-tes-akhir': {
    chips: ['Uji 余儀なくされる', 'Restrukturisasi', 'Berita Bencana', '4 Pilar N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-002',
  },

  // Unit 3: GP-JA-N1-003 (～とはいえ)
  'n1-u3-kosakata': {
    chips: ['賛否', '実効性', '持続可能性', '暫定措置'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-003',
  },
  'n1-u3-pola-utama': {
    chips: ['～とはいえ', '～とはいうものの', '慣れた作業', '油断も許されない'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-003',
  },
  'n1-u3-dengar-baca': {
    chips: ['飛躍的に高まる', '情報の真偽', '多角的な視点', '最終判断'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-003',
  },
  'n1-u3-bicara-rakit': {
    chips: ['予算が限られる', '品質を落とす', '小規模事業', '波及効果'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-003',
  },
  'n1-u3-tes-akhir': {
    chips: ['Uji ～とはいえ', 'Tajuk Rencana', 'Argumen Berimbang', '4 Pilar N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-003',
  },

  // Unit 4: GP-JA-N1-004 (～をもって)
  'n1-u4-kosakata': {
    chips: ['書面', '任期満了', '施行', '滞りなく'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-004',
  },
  'n1-u4-pola-utama': {
    chips: ['～をもって', '～をもちまして', '誠意をもって', '責任感をもって'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-004',
  },
  'n1-u4-dengar-baca': {
    chips: ['月末をもちまして', 'お問い合わせ窓口', '誠に勝手ながら', '廃止'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-004',
  },
  'n1-u4-bicara-rakit': {
    chips: ['以上をもちまして', '午後五時をもって', '任務を遂行', '閉会'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-004',
  },
  'n1-u4-tes-akhir': {
    chips: ['Uji ～をもって', 'Surat Resmi', 'Pengumuman', '4 Pilar N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-004',
  },

  // Unit 5: GP-JA-N1-005 (～極まりない)
  'n1-u5-kosakata': {
    chips: ['遺憾', '非常識', '無責任', '極めて不適切'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-005',
  },
  'n1-u5-pola-utama': {
    chips: ['～極まりない', '～極まる', '～の極み', '危険極まりない'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-005',
  },
  'n1-u5-dengar-baca': {
    chips: ['無謀極まりない', '煩雑', '精緻', '強く抗議'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-005',
  },
  'n1-u5-bicara-rakit': {
    chips: ['未確認情報拡散', '直前キャンセル', '多大な迷惑', '失礼にあたる'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-005',
  },
  'n1-u5-tes-akhir': {
    chips: ['Uji ～極まりない', 'Kritik Publik', 'Etika Formal', '4 Pilar N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-005',
  },

  // Unit 6: GP-JA-N1-006 (～なりに)
  'n1-u6-kosakata': {
    chips: ['模索', '創意工夫', '葛藤', '誠実に向き合う'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-006',
  },
  'n1-u6-pola-utama': {
    chips: ['～なりに', '～なりの', '自分なりに', '世代なりの価値観'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-006',
  },
  'n1-u6-dengar-baca': {
    chips: ['相手なりの工夫', '立場を尊重', '周囲への配慮', '不十分な点'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-006',
  },
  'n1-u6-bicara-rakit': {
    chips: ['AならAなりに', '優先順位', 'それぞれなり', '信頼関係の基盤'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-006',
  },
  'n1-u6-tes-akhir': {
    chips: ['Uji ～なりに', 'Empati Tim', 'Kepemimpinan', '4 Pilar N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-006',
  },

  // Unit 7: GP-JA-N1-007 (～ずにはおかない)
  'n1-u7-kosakata': {
    chips: ['反発', '魅了', '懸念', '称賛を浴びる'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-007',
  },
  'n1-u7-pola-utama': {
    chips: ['～ずにはおかない', '～ないではおかない', '変えずには', '感動させずには'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-007',
  },
  'n1-u7-dengar-baca': {
    chips: ['思索を促す', '共感と議論', '世論の認識', '傑作'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-007',
  },
  'n1-u7-bicara-rakit': {
    chips: ['胸を打つ', '根本から変える', '演説', '技術革新'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-007',
  },
  'n1-u7-tes-akhir': {
    chips: ['Uji ずにはおかない', 'Dampak Sosial', 'Resensi Karya', '4 Pilar N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-007',
  },

  // Unit 8: GP-JA-N1-008 (～ともなると)
  'n1-u8-kosakata': {
    chips: ['上場企業', '取締役会', '国家予算', '厳重な警備'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-008',
  },
  'n1-u8-pola-utama': {
    chips: ['～ともなると', '～ともなれば', '旗艦店', '数万人に及ぶ'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-008',
  },
  'n1-u8-dengar-baca': {
    chips: ['五年先を見据える', '目先の業績', '戦略立案', '社会的責任'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-008',
  },
  'n1-u8-bicara-rakit': {
    chips: ['国家的事業', '監視の目', '即完売', '例年にない規模'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-008',
  },
  'n1-u8-tes-akhir': {
    chips: ['Uji ～ともなると', 'Skala Eksekutif', 'Standar Global', '4 Pilar N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-008',
  },

  // Unit 9: GP-JA-N1-009 (～いかんによらず)
  'n1-u9-kosakata': {
    chips: ['規約', '処分', '公平', '守秘義務'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-009',
  },
  'n1-u9-pola-utama': {
    chips: ['～いかんによらず', '～いかんにかかわらず', '～いかんによっては', 'ご応募'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-009',
  },
  'n1-u9-dengar-baca': {
    chips: ['ご都合のいかん', '払い戻し不可', '努力いかんで', '法の下'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-009',
  },
  'n1-u9-bicara-rakit': {
    chips: ['平等の権利', '決して容認されない', 'いかなる理由', '出身や経歴'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-009',
  },
  'n1-u9-tes-akhir': {
    chips: ['Uji いかんによらず', 'Klausul Hukum', 'Kepatuhan', '4 Pilar N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-009',
  },

  // Unit 10: GP-JA-N1-010 (～に足る)
  'n1-u10-kosakata': {
    chips: ['根拠', '実績', '新規性・意義', '評価に値する'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-010',
  },
  'n1-u10-pola-utama': {
    chips: ['～に足る', '～に足りない', '注目に足る', '取るに足りない'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-010',
  },
  'n1-u10-dengar-baca': {
    chips: ['反論するに足りない', '出所不明の憶測', '画期的な成果', '検討する価値'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-010',
  },
  'n1-u10-bicara-rakit': {
    chips: ['投資に足る', '将来性を備える', '些細な問題', '尊敬に足る'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-010',
  },
  'n1-u10-tes-akhir': {
    chips: ['Ujian Kesiapan N1', 'Evaluasi Akademik', 'Kredibilitas', 'Mastery JLPT N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-010',
  },
}
