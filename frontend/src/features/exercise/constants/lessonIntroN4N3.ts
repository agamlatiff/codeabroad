import type { LessonIntroDeck } from './lessonIntroCards'

export interface LevelNodePreviewInfo {
  chips: string[]
  kanaScript?: 'hiragana' | 'katakana' | 'kanji'
  showGrammarLink?: boolean
  grammarCode?: string
}

export const LESSON_INTRO_DECKS_N4_N3: Record<string, LessonIntroDeck> = {
  // =========================================================================
  // JLPT N4 — UNIT 1: Permohonan Sangat Sopan di Kantor (GP-JA-N4-001)
  // =========================================================================
  'n4-u1-kosakata': {
    headline: 'Kenali Kosakata Kantor & Layanan',
    subtitle:
      'Sebelum meminta bantuan secara sopan di kantor Jepang, hafalkan dulu kata benda dan kata kerja layanan yang paling sering dipakai.',
    items: [
      {
        symbol: '資料',
        reading: 'shiryou',
        meaning: 'Dokumen / materi rapat',
        mnemonic: 'Dipakai untuk berkas presentasi, salinan rapat, atau bahan kerja.',
        speakText: '資料',
      },
      {
        symbol: '説明',
        reading: 'setsumei',
        meaning: 'Penjelasan',
        mnemonic: 'Sering digabung dengan する (setsumei suru) untuk meminta atau memberi penjelasan.',
        speakText: '説明',
      },
      {
        symbol: '受付',
        reading: 'uketsuke',
        meaning: 'Meja resepsionis / pendaftaran',
        mnemonic: 'Tempat pertama saat tamu datang melapor atau mengisi buku tamu.',
        speakText: '受付',
      },
      {
        symbol: '確認',
        reading: 'kakunin',
        meaning: 'Konfirmasi / pengecekan',
        mnemonic: 'Kata wajib di kantor Jepang saat mengecek laporan, email, atau jadwal.',
        speakText: '確認',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 資料 (shiryou = materi/bahan rapat) dengan 書類 (shorui = dokumen resmi/formulir administrasi).',
  },
  'n4-u1-pola-utama': {
    headline: 'Kuasai Pola Permohonan ～ていただけませんか',
    subtitle:
      'Pola ini jauh lebih sopan daripada ～てください, cocok saat berbicara dengan atasan, klien, atau staf layanan.',
    items: [
      {
        symbol: '説明していただけませんか',
        reading: 'setsumei shite itadakemasen ka',
        meaning: 'Bersediakah Anda menjelaskannya?',
        mnemonic: 'Rumus: Kata Kerja bentuk-て + いただけませんか (bentuk negatif sopan agar terdengar halus).',
        speakText: '説明していただけませんか',
      },
      {
        symbol: '見ていただけませんか',
        reading: 'mite itadakemasen ka',
        meaning: 'Bersediakah Anda melihat/memeriksanya?',
        mnemonic: 'Dari 見ます diubah menjadi 見て sebelum disambung いただけませんか.',
        speakText: '見ていただけませんか',
      },
      {
        symbol: '待っていただけませんか',
        reading: 'matte itadakemasen ka',
        meaning: 'Bersediakah Anda menunggu sebentar?',
        mnemonic: 'Perhatikan perubahan bentuk-て: 待ちます (machimasu) berubah menjadi 待って (matte).',
        speakText: '待っていただけませんか',
      },
      {
        symbol: '話していただけませんか',
        reading: 'hanashite itadakemasen ka',
        meaning: 'Bersediakah Anda berbicara (lebih pelan)?',
        mnemonic: 'Tambahkan もう少しゆっくり di depan untuk meminta lawan bicara memperlambat tempo.',
        speakText: 'もう少しゆっくり話していただけませんか',
      },
    ],
    contrastiveTip:
      'Jangan pakai bentuk ます sebelum いただけませんか (salah: 見ますいただけませんか). Selalu ubah kata kerja ke bentuk-て terlebih dahulu.',
  },
  'n4-u1-dengar-baca': {
    headline: 'Pahami Permohonan di Situasi Kantor',
    subtitle:
      'Perhatikan ungkapan pembuka sopan dan inti permintaan yang muncul dalam percakapan nyata di kantor dan resepsionis.',
    items: [
      {
        symbol: '教えていただけませんか',
        reading: 'oshiete itadakemasen ka',
        meaning: 'Bersediakah Anda memberi tahu saya?',
        mnemonic: 'Cocok saat menanyakan cara baca kanji, prosedur kerja, atau alamat.',
        speakText: '教えていただけませんか',
      },
      {
        symbol: '恐れ入りますが',
        reading: 'osoreirimasu ga',
        meaning: 'Mohon maaf mengganggu (sangat formal)',
        mnemonic: 'Pembuka ekstra sopan dari staf layanan atau resepsionis sebelum meminta tamu mengisi data.',
        speakText: '恐れ入りますが',
      },
      {
        symbol: 'ご記入いただけませんか',
        reading: 'go-kinyuu itadakemasen ka',
        meaning: 'Bersediakah Anda menuliskannya/mengisinya?',
        mnemonic: 'Versi sangat sopan dari 書いていただけませんか saat mengisi formulir nama atau perusahaan.',
        speakText: 'ご記入いただけませんか',
      },
      {
        symbol: '温度を上げていただけませんか',
        reading: 'ondo o agete itadakemasen ka',
        meaning: 'Bersediakah Anda menaikkan suhunya?',
        mnemonic: 'Dipakai saat meminta penyesuaian suhu AC di ruang rapat dengan sopan.',
        speakText: 'エアコンの温度を上げていただけませんか',
      },
    ],
    contrastiveTip:
      'Bedakan すみませんが (sopan standar ke rekan/atasan) dengan 恐れ入りますが (sangat formal ke tamu/klien).',
  },
  'n4-u1-bicara-rakit': {
    headline: 'Latih Merangkai & Mengucapkan Permohonan',
    subtitle:
      'Gabungkan pembuka sopan, objek dengan partikel を, dan penutup ～ていただけませんか agar kalimatmu terdengar natural.',
    items: [
      {
        symbol: 'チェックしていただけませんか',
        reading: 'chekku shite itadakemasen ka',
        meaning: 'Bersediakah Anda mengeceknya?',
        mnemonic: 'Gunakan saat meminta senior atau atasan meninjau dokumen sebelum dikirim.',
        speakText: 'この資料をチェックしていただけませんか',
      },
      {
        symbol: '写真を撮っていただけませんか',
        reading: 'shashin o totte itadakemasen ka',
        meaning: 'Bersediakah Anda mengambilkan foto?',
        mnemonic: '撮ります (torimasu) berubah menjadi 撮って (totte), berguna saat meminta bantuan orang asing.',
        speakText: 'すみませんが、写真を撮っていただけませんか',
      },
      {
        symbol: '使い方を教えていただけませんか',
        reading: 'tsukaikata o oshiete itadakemasen ka',
        meaning: 'Bersediakah Anda mengajarkan cara pakainya?',
        mnemonic: 'Pola [Kata Kerja stem + 方 (kata)] berarti "cara melakukan sesuatu".',
        speakText: 'この機械の使い方を教えていただけませんか',
      },
      {
        symbol: '貸していただけませんか',
        reading: 'kashite itadakemasen ka',
        meaning: 'Bersediakah Anda meminjamkannya?',
        mnemonic: 'Pakai 貸す (meminjamkan) karena lawan bicara yang memberi pinjaman kepada kita.',
        speakText: 'ペンを貸していただけませんか',
      },
    ],
    contrastiveTip:
      'Jangan tertukar 貸して (kashite = tolong pinjamkan ke saya) dengan 借りて (karite = meminjam). Untuk meminta pinjaman selalu pakai 貸していただけませんか.',
  },

  // =========================================================================
  // JLPT N4 — UNIT 2: Keadaan Hasil Aksi Disengaja (GP-JA-N4-002)
  // =========================================================================
  'n4-u2-kosakata': {
    headline: 'Kenali Kosakata Ruang & Pengumuman',
    subtitle:
      'Pelajari kosakata ruangan, penyimpanan, dan perlengkapan kantor yang sering muncul saat melaporkan hasil persiapan.',
    items: [
      {
        symbol: '倉庫',
        reading: 'souko',
        meaning: 'Gudang penyimpanan',
        mnemonic: 'Tempat menyimpan stok barang, kunci, atau peralatan kerja.',
        speakText: '倉庫',
      },
      {
        symbol: '引き出し',
        reading: 'hikidashi',
        meaning: 'Laci meja',
        mnemonic: 'Dari kata 引く (menarik) + 出す (mengeluarkan), tempat menyimpan kunci atau berkas.',
        speakText: '引き出し',
      },
      {
        symbol: '貼る',
        reading: 'haru',
        meaning: 'Menempelkan (poster/memo)',
        mnemonic: 'Bentuk-て nya adalah 貼って (hatte), sering dipakai untuk poster aturan di dinding.',
        speakText: '貼る',
      },
      {
        symbol: '会議室の準備',
        reading: 'kaigishitsu no junbi',
        meaning: 'Persiapan ruang rapat',
        mnemonic: 'Gabungan 会議室 (ruang rapat) + 準備 (persiapan).',
        speakText: '会議室の準備',
      },
    ],
    contrastiveTip:
      'Perhatikan partikel tempat saat benda ditaruh/ditempel: gunakan に (contoh: 壁に貼ってあります = tertempel di dinding), bukan で.',
  },
  'n4-u2-pola-utama': {
    headline: 'Kuasai Pola Keadaan ～てあります',
    subtitle:
      'Gunakan ～てあります dengan kata kerja transitif untuk menyatakan kondisi yang sengaja disiapkan seseorang dan hasilnya masih ada.',
    items: [
      {
        symbol: '書いてあります',
        reading: 'kaite arimasu',
        meaning: 'Tertulis (sengaja ditulis)',
        mnemonic: 'Objek memakai partikel が: 名前が書いてあります (nama sudah tertulis di sana).',
        speakText: 'この箱に持ち主の名前が書いてあります',
      },
      {
        symbol: '入れてあります',
        reading: 'irete arimasu',
        meaning: 'Sudah dimasukkan / disimpan di dalam',
        mnemonic: 'Menunjukkan seseorang sengaja menaruh benda itu di tempat aman.',
        speakText: '引き出しの中に入れてあります',
      },
      {
        symbol: '並べてあります',
        reading: 'narabete arimasu',
        meaning: 'Sudah ditata rapi',
        mnemonic: 'Dari 並べる (menata), sering dipakai untuk kursi atau dokumen rapat.',
        speakText: '資料が並べてあります',
      },
      {
        symbol: '予約してあります',
        reading: 'yoyaku shite arimasu',
        meaning: 'Sudah dipesan / direservasi',
        mnemonic: 'Memberi rasa tenang kepada lawan bicara bahwa persiapan sudah beres.',
        speakText: 'ホテルはもう予約してあります',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～てあります (kata kerja transitif, ada kesengajaan manusia, pakai が) dengan ～ています (keadaan alami/intransitif, contoh: ドアが開いています).',
  },
  'n4-u2-dengar-baca': {
    headline: 'Simak & Baca Laporan Persiapan Ruang',
    subtitle:
      'Kenali frasa laporan kesiapan fasilitas kantor, hotel dinas, hingga jamuan tamu dalam percakapan kerja.',
    items: [
      {
        symbol: 'エアコンがつけてあります',
        reading: 'eakon ga tsukete arimasu',
        meaning: 'AC sudah dinyalakan (sengaja)',
        mnemonic: 'Menunjukkan ruang rapat sudah didinginkan sebelum peserta masuk.',
        speakText: 'エアコンもつけてあります',
      },
      {
        symbol: '全員分',
        reading: 'zen-inbun',
        meaning: 'Porsi/jumlah untuk semua orang',
        mnemonic: 'Kata praktis di kantor saat memastikan dokumen atau minuman cukup untuk seluruh peserta.',
        speakText: '全員分',
      },
      {
        symbol: '出張',
        reading: 'shucchou',
        meaning: 'Perjalanan dinas',
        mnemonic: 'Sering muncul bersama reservasi hotel atau tiket kereta kerja.',
        speakText: '出張',
      },
      {
        symbol: '作ってあります',
        reading: 'tsukutte arimasu',
        meaning: 'Sudah dibuatkan (siap disajikan)',
        mnemonic: 'Contoh: お客様用のコーヒーはポットに作ってあります (kopi untuk tamu sudah dibuat di teko).',
        speakText: 'コーヒーはポットに作ってあります',
      },
    ],
    contrastiveTip:
      'Saat memakai ～てあります dengan は sebagai topik (例: ホテルは予約してあります), partikel が boleh digantikan は untuk penekanan topik.',
  },
  'n4-u2-bicara-rakit': {
    headline: 'Latih Melaporkan Kondisi dengan ～てあります',
    subtitle:
      'Ucapkan dan susun kalimat pelaporan barang yang sudah diletakkan, dihias, atau dibeli sebelumnya.',
    items: [
      {
        symbol: '花が飾ってあります',
        reading: 'hana ga kazatte arimasu',
        meaning: 'Bunga sudah terpajang/dihias',
        mnemonic: '飾る (kazaru = menghias) berubah menjadi 飾って (kazatte).',
        speakText: '玄関の前にきれいな花が飾ってあります',
      },
      {
        symbol: '切符はもう買ってあります',
        reading: 'kippu wa mou katte arimasu',
        meaning: 'Tiketnya sudah dibeli sebelumnya',
        mnemonic: 'Kata もう (sudah) mempertegas bahwa persiapan selesai jauh sebelum berangkat.',
        speakText: '電車の切符は昨日もう買ってあります',
      },
      {
        symbol: '地図が置いてあります',
        reading: 'chizu ga oite arimasu',
        meaning: 'Peta sudah diletakkan (tersedia)',
        mnemonic: '置く (oku = meletakkan) berubah menjadi 置いて (oite).',
        speakText: '受付に建物の地図が置いてあります',
      },
      {
        symbol: '玄関',
        reading: 'genkan',
        meaning: 'Pintu masuk utama / beranda',
        mnemonic: 'Area depan rumah, kantor, atau gedung tempat melepas sepatu atau menyambut tamu.',
        speakText: '玄関',
      },
    ],
    contrastiveTip:
      'Ingat partikel objek pada ～てあります: benda yang diletakkan memakai が atau は, BUKAN を (salah: 地図を置いてあります).',
  },

  // =========================================================================
  // JLPT N4 — UNIT 3: Bentuk Keharusan & Aturan Kerja (GP-JA-N4-003)
  // =========================================================================
  'n4-u3-kosakata': {
    headline: 'Kenali Kosakata Keselamatan & Jadwal',
    subtitle:
      'Pahami istilah aturan keselamatan pabrik, keterlambatan, dan dokumen wajib sebelum mempelajari pola keharusan.',
    items: [
      {
        symbol: '遅刻',
        reading: 'chikoku',
        meaning: 'Terlambat (datang)',
        mnemonic: 'Di Jepang, jika akan 遅刻, wajib melapor ke atasan sebelum jam mulai.',
        speakText: '遅刻',
      },
      {
        symbol: '必ず',
        reading: 'kanarazu',
        meaning: 'Pasti / wajib tanpa kecuali',
        mnemonic: 'Kata keterangan penguat yang sering berpasangan dengan aturan atau keharusan.',
        speakText: '必ず',
      },
      {
        symbol: '健康保険証',
        reading: 'kenkou hokenshou',
        meaning: 'Kartu asuransi kesehatan',
        mnemonic: 'Dokumen wajib dibawa setiap kali berobat ke klinik atau rumah sakit di Jepang.',
        speakText: '健康保険証',
      },
      {
        symbol: '安全ルールを守る',
        reading: 'anzen ruuru o mamoru',
        meaning: 'Mematuhi aturan keselamatan',
        mnemonic: '守る (mamoru) artinya menjaga atau mematuhi peraturan dan janji.',
        speakText: '安全ルールは必ず守ります',
      },
    ],
    contrastiveTip:
      'Bedakan 必ず (kanarazu = pasti/wajib) dengan 絶対に (zettai ni = mutlak, sering dipakai dalam larangan keras atau tekad pribadi).',
  },
  'n4-u3-pola-utama': {
    headline: 'Kuasai Pola Keharusan ～なければなりません',
    subtitle:
      'Pola ini berarti "harus / wajib". Kuncinya adalah mengubah kata kerja ke bentuk ない terlebih dahulu.',
    items: [
      {
        symbol: '飲まなければなりません',
        reading: 'nomanakereba narimasen',
        meaning: 'Harus minum',
        mnemonic: 'Rumus: 飲まない (nomanai) -> buang い -> tambah ければなりません.',
        speakText: '食後にこの薬を飲まなければなりません',
      },
      {
        symbol: '行かなければなりません',
        reading: 'ikanakereba narimasen',
        meaning: 'Harus pergi',
        mnemonic: 'Dari 行かない (ikanai) berubah menjadi 行かなければなりません.',
        speakText: '市役所へ行かなければなりません',
      },
      {
        symbol: '出さなければなりません',
        reading: 'dasanakereba narimasen',
        meaning: 'Harus mengumpulkan / membuang (sampah)',
        mnemonic: 'Dipakai untuk batas waktu pengumpulan laporan atau jadwal buang sampah.',
        speakText: '朝八時までに出さなければなりません',
      },
      {
        symbol: 'つけなければなりません',
        reading: 'tsukenakereba narimasen',
        meaning: 'Harus mengenakan (masker/sarung tangan)',
        mnemonic: 'Kata kerja kelompok 2 (つける): cukup ganti る menjadi なければなりません.',
        speakText: '手袋とマスクをつけなければなりません',
      },
    ],
    contrastiveTip:
      'Jangan lupa membuang huruf い di akhir bentuk ない! Salah: 飲まないければなりません. Benar: 飲まなければなりません.',
  },
  'n4-u3-dengar-baca': {
    headline: 'Pahami Prosedur Kerja & Aturan Harian',
    subtitle:
      'Latih menangkap detail waktu, tempat, dan perlengkapan wajib dalam pengumuman pabrik serta kehidupan di Jepang.',
    items: [
      {
        symbol: '作業中',
        reading: 'sagyouchuu',
        meaning: 'Selama jam kerja / sedang bekerja',
        mnemonic: 'Akhiran 中 (chuu) setelah kata benda aktivitas berarti "sedang berlangsung".',
        speakText: '作業中',
      },
      {
        symbol: '市役所',
        reading: 'shiyakusho',
        meaning: 'Kantor balai kota',
        mnemonic: 'Tempat mengurus kartu penduduk, asuransi, dan pajak saat tinggal di Jepang.',
        speakText: '市役所',
      },
      {
        symbol: '先に失礼します',
        reading: 'saki ni shitsurei shimasu',
        meaning: 'Permisi, saya pulang duluan',
        mnemonic: 'Etika wajib di kantor Jepang saat meninggalkan tempat kerja lebih awal dari rekan lain.',
        speakText: '先に失礼します',
      },
      {
        symbol: 'プラスチックごみ',
        reading: 'purasuchikku gomi',
        meaning: 'Sampah plastik',
        mnemonic: 'Di Jepang, jenis sampah harus dipilah dan dibuang tepat pada hari yang ditentukan.',
        speakText: 'プラスチックごみ',
      },
    ],
    contrastiveTip:
      'Bedakan ～なければなりません (wajib dilakukan) dengan ～なくてもいいです (tidak perlu / tidak wajib dilakukan).',
  },
  'n4-u3-bicara-rakit': {
    headline: 'Latih Mengucapkan Kewajiban Tim',
    subtitle:
      'Rangkai kalimat keharusan untuk perlengkapan kerja, mematikan listrik, hingga jadwal bangun pagi.',
    items: [
      {
        symbol: '作業靴を履かなければなりません',
        reading: 'sagyougutsu o hakanakereba narimasen',
        meaning: 'Harus memakai sepatu kerja',
        mnemonic: 'Untuk sepatu dan celana, kata kerja "memakai" selalu 履く (haku -> hakanai).',
        speakText: 'ここでは専用の作業靴を履かなければなりません',
      },
      {
        symbol: '電源を切らなければなりません',
        reading: 'dengen o kiranakereba narimasen',
        meaning: 'Harus mematikan daya/listrik',
        mnemonic: '切る (kiru) termasuk kelompok 1 (Godan), sehingga bentuk ない nya 切らない (kiranai).',
        speakText: '帰る前に、パソコンの電源を全部切らなければなりません',
      },
      {
        symbol: '起きなければなりません',
        reading: 'okinakereba narimasen',
        meaning: 'Harus bangun (tidur)',
        mnemonic: '起きる (okiru) termasuk kelompok 2 (Ichidan), bentuk ない nya 起きない (okinai).',
        speakText: '明日の朝は五時に起きなければなりません',
      },
      {
        symbol: '専用',
        reading: 'sen-you',
        meaning: 'Khusus untuk / khusus pakai',
        mnemonic: 'Contoh: 専用の作業靴 (sepatu kerja khusus), 社員専用 (khusus karyawan).',
        speakText: '専用',
      },
    ],
    contrastiveTip:
      'Hati-hati pada 切る (kiru = memotong/mematikan daya) dan 起きる (okiru = bangun). 切る adalah kelompok 1 (切らない), sedangkan 起きる kelompok 2 (起きない).',
  },

  // =========================================================================
  // JLPT N4 — UNIT 4: Bentuk Potensial: Kemampuan & Fasilitas (GP-JA-N4-004)
  // =========================================================================
  'n4-u4-kosakata': {
    headline: 'Kenali Kosakata Keahlian & Fasilitas',
    subtitle:
      'Kuasai kosakata keahlian kerja, perangkat komputer, dan fasilitas tempat tinggal sebelum belajar bentuk potensial.',
    items: [
      {
        symbol: '操作',
        reading: 'sousa',
        meaning: 'Pengoperasian (mesin/komputer)',
        mnemonic: 'Sering muncul dalam wawancara kerja: パソコンの操作ができます.',
        speakText: 'パソコンの操作ができます',
      },
      {
        symbol: '無料',
        reading: 'muryou',
        meaning: 'Gratis / tanpa biaya',
        mnemonic: 'Kebalikan dari 有料 (yuuryou = berbayar). Sering tertulis di fasilitas apartemen atau hotel.',
        speakText: '無料',
      },
      {
        symbol: '話せます',
        reading: 'hanasemasu',
        meaning: 'Bisa berbicara',
        mnemonic: 'Bentuk potensial dari 話します (hanashimasu). Objek bahasanya memakai partikel が.',
        speakText: '私は英語とインドネシア語が話せます',
      },
      {
        symbol: '使えます',
        reading: 'tsukaemasu',
        meaning: 'Bisa menggunakan / bisa dipakai',
        mnemonic: 'Bentuk potensial dari 使います (tsukaimasu), cocok untuk software, Wi-Fi, atau kartu.',
        speakText: '高速のワイファイが無料で使えます',
      },
    ],
    contrastiveTip:
      'Pada bentuk potensial (話せます, 使えます), partikel objek yang paling umum dan benar secara tata bahasa adalah が, bukan を.',
  },
  'n4-u4-pola-utama': {
    headline: 'Kuasai Pola Potensial ～られる / ～える',
    subtitle:
      'Pelajari cara mengubah kata kerja kelompok 1, 2, dan 3 menjadi bentuk "bisa" (potensial) untuk menyatakan kemampuan atau izin fasilitas.',
    items: [
      {
        symbol: '払えません',
        reading: 'haraemasen',
        meaning: 'Tidak bisa membayar',
        mnemonic: 'Kelompok 1: ubah vokal i ke e (払います haraimasu -> 払えます haraemasu).',
        speakText: 'ここでは現金で払えません',
      },
      {
        symbol: '食べられます',
        reading: 'taberaremasu',
        meaning: 'Bisa makan',
        mnemonic: 'Kelompok 2: ganti ます dengan られます (食べます -> 食べられます).',
        speakText: '食べられます',
      },
      {
        symbol: '運転できます',
        reading: 'unten dekimasu',
        meaning: 'Bisa menyetir',
        mnemonic: 'Kelompok 3: する selalu berubah menjadi できる (運転する -> 運転できる).',
        speakText: '運転できます',
      },
      {
        symbol: '入れます',
        reading: 'hairemasu',
        meaning: 'Bisa masuk',
        mnemonic: '入る (hairu) adalah kelompok 1, sehingga bentuk potensialnya 入れる (haireru / hairemasu).',
        speakText: '大浴場は夜の十一時まで入れます',
      },
    ],
    contrastiveTip:
      'Jangan keliru pada します (shimasu): bentuk potensialnya bukan しられます, melainkan できます (dekimasu).',
  },
  'n4-u4-dengar-baca': {
    headline: 'Simak & Baca Informasi Kemampuan & Layanan',
    subtitle:
      'Kenali pengumuman jam operasional pemandian umum, ATM, hingga syarat berkendara di musim salju.',
    items: [
      {
        symbol: '大浴場',
        reading: 'daiyokujou',
        meaning: 'Pemandian umum besar (di hotel/onsen)',
        mnemonic: 'Fasilitas khas hotel di Jepang yang punya jam buka tertentu.',
        speakText: '大浴場',
      },
      {
        symbol: '免許',
        reading: 'menkyo',
        meaning: 'SIM / surat izin mengemudi',
        mnemonic: 'Lengkapnya 運転免許証 (unten menkyoshou). Sering dipakai bersama 持っています.',
        speakText: '免許',
      },
      {
        symbol: 'お金がおろせます',
        reading: 'okane ga orosemasu',
        meaning: 'Bisa menarik uang tunai',
        mnemonic: 'おろす (orosu = menarik uang di ATM) berubah menjadi おろせます.',
        speakText: '二十四時間いつでもお金がおろせます',
      },
      {
        symbol: '現金',
        reading: 'genkin',
        meaning: 'Uang tunai',
        mnemonic: 'Penting saat bertransaksi di toko Jepang yang kadang hanya menerima tunai atau kartu.',
        speakText: '現金',
      },
    ],
    contrastiveTip:
      'Perhatikan konteks: ～えます/～られます bisa berarti kemampuan pribadi ("saya bisa") atau kemungkinan fasilitas ("di sini tersedia/bisa").',
  },
  'n4-u4-bicara-rakit': {
    headline: 'Latih Unjuk Keahlian & Bertanya Fasilitas',
    subtitle:
      'Susun kalimat untuk menceritakan keahlian memasak, menanyakan pembayaran kartu IC, dan menjelaskan kendala waktu.',
    items: [
      {
        symbol: '料理が作れます',
        reading: 'ryouri ga tsukuremasu',
        meaning: 'Bisa memasak masakan',
        mnemonic: '作ります (tsukurimasu) berubah menjadi 作れます (tsukuremasu).',
        speakText: '私はインドネシア料理が作れます',
      },
      {
        symbol: 'ICカードが使えますか',
        reading: 'ai-shii kaado ga tsukaemasu ka',
        meaning: 'Apakah kartu IC bisa dipakai?',
        mnemonic: 'Pertanyaan praktis di toko, bus, atau mesin penjual otomatis di Jepang.',
        speakText: 'ここではICカードが使えますか',
      },
      {
        symbol: '休めません',
        reading: 'yasumemasen',
        meaning: 'Tidak bisa beristirahat / libur',
        mnemonic: '休みます (yasumimasu) berubah menjadi 休めます -> negatif 休めません.',
        speakText: '忙しすぎて、今日は休めません',
      },
      {
        symbol: '忙しすぎて',
        reading: 'isogashisugite',
        meaning: 'Karena terlalu sibuk',
        mnemonic: 'Kata sifat-い (buang い) + すぎる berarti "terlalu...".',
        speakText: '忙しすぎて',
      },
    ],
    contrastiveTip:
      'Jangan pakai を pada kalimat seperti 料理を作れます; di ujian JLPT N4 bentuk bakunya memakai partikel が (料理が作れます).',
  },

  // =========================================================================
  // JLPT N4 — UNIT 5: Memberi & Menerima Bantuan (GP-JA-N4-005)
  // =========================================================================
  'n4-u5-kosakata': {
    headline: 'Kenali Kosakata Kerja Sama Tim',
    subtitle:
      'Pelajari kata kerja bantuan sehari-hari seperti mengangkut barang, memandu jalan, dan membantu rekan.',
    items: [
      {
        symbol: '引っ越し',
        reading: 'hikkoshi',
        meaning: 'Pindahan rumah',
        mnemonic: 'Momen penting di Jepang yang sering melibatkan bantuan teman atau rekan kerja.',
        speakText: '引っ越し',
      },
      {
        symbol: '運ぶ',
        reading: 'hakobu',
        meaning: 'Mengangkut / membawakan barang',
        mnemonic: 'Bentuk-て nya 運んで (hakonde), sering dipakai untuk koper atau kardus berat.',
        speakText: '荷物を運ぶ',
      },
      {
        symbol: '案内する',
        reading: 'annai suru',
        meaning: 'Memandu / mengantar menunjukkan jalan',
        mnemonic: 'Dipakai saat menemani tamu keliling kantor atau mengantar orang ke stasiun.',
        speakText: '駅まで案内する',
      },
      {
        symbol: '手伝う',
        reading: 'tetsudau',
        meaning: 'Membantu (pekerjaan/tugas)',
        mnemonic: 'Bentuk-て nya 手伝って (tetsudatte): いつも手伝ってくれてありがとう.',
        speakText: 'いつも手伝ってくれて、本当にありがとう',
      },
    ],
    contrastiveTip:
      'Bedakan 手伝う (tetsudau = ikut membantu tugas/kerjaan) dengan 助ける (tasukeru = menolong dari bahaya atau kesulitan besar).',
  },
  'n4-u5-pola-utama': {
    headline: 'Kuasai Pola ～てあげる・くれる・もらう',
    subtitle:
      'Tiga pola ini ditentukan oleh arah bantuan dan siapa yang menjadi subjek kalimat. Pahami sudut pandangnya agar tidak terbalik.',
    items: [
      {
        symbol: '案内してあげました',
        reading: 'annai shite agemashita',
        meaning: 'Saya memandukan (untuk orang lain)',
        mnemonic: '～てあげる: Saya (atau pihak saya) melakukan kebaikan UNTUK orang lain.',
        speakText: '駅まで案内してあげました',
      },
      {
        symbol: '運んでくれました',
        reading: 'hakonde kuremashita',
        meaning: '(Dia) membawakan untuk saya',
        mnemonic: '～てくれる: Orang lain (subjek は/が) berbuat baik KEPADA saya.',
        speakText: '先輩が荷物を運んでくれました',
      },
      {
        symbol: '直してもらいました',
        reading: 'naoshite moraimashita',
        meaning: 'Saya dibetulkan / diperbaiki oleh...',
        mnemonic: '～てもらう: Saya sebagai subjek MENERIMA bantuan dari orang lain (pakai partikel に).',
        speakText: '日本人の友達に日本語を直してもらいました',
      },
      {
        symbol: '教えてもらいました',
        reading: 'oshiete moraimashita',
        meaning: 'Saya diajari oleh...',
        mnemonic: 'Subjeknya "saya", sedangkan pemberi bantuan ditandai partikel に (鈴木さんに).',
        speakText: '鈴木さんに教えてもらいました',
      },
    ],
    contrastiveTip:
      'Jangan pernah memakai ～てあげます langsung di depan atasan (terkesan menggurui). Dan ingat: pemberi bantuan pada ～てもらう memakai に, sedangkan pada ～てくれる memakai が/は.',
  },
  'n4-u5-dengar-baca': {
    headline: 'Simak & Baca Cerita Bantuan Rekan',
    subtitle:
      'Perhatikan siapa yang membantu dan siapa yang dibantu dalam cerita keseharian di asrama maupun tempat kerja.',
    items: [
      {
        symbol: 'おかゆを作ってくれました',
        reading: 'okayu o tsukutte kuremashita',
        meaning: 'Membuatkan bubur untuk saya',
        mnemonic: 'おかゆ (bubur nasi) adalah makanan khas saat sedang masuk angin di Jepang.',
        speakText: 'ルームメイトがおかゆを作ってくれました',
      },
      {
        symbol: '入力方法',
        reading: 'nyuuryoku houhou',
        meaning: 'Cara menginput data',
        mnemonic: 'Sering muncul di kantor saat belajar memasukkan jadwal shift ke sistem.',
        speakText: 'シフトの入力方法',
      },
      {
        symbol: '新入社員',
        reading: 'shinnyuu shain',
        meaning: 'Karyawan baru',
        mnemonic: 'Gabungan 新入 (baru masuk) + 社員 (karyawan perusahaan).',
        speakText: '新入社員',
      },
      {
        symbol: '説明してあげました',
        reading: 'setsumei shite agemashita',
        meaning: 'Saya jelaskan untuknya',
        mnemonic: 'Wajar dipakai saat berbicara tentang membantu junior atau rekan yang sedang kebingungan.',
        speakText: 'コピー機の使い方を説明してあげました',
      },
    ],
    contrastiveTip:
      'Periksa partikel pemberi aksi: jika kalimat menyebut "Aさんが...", pasangannya ～てくれました; jika menyebut "Aさんに...", pasangannya ～てもらいました.',
  },
  'n4-u5-bicara-rakit': {
    headline: 'Latih Menceritakan Saling Membantu',
    subtitle:
      'Susun dan ucapkan kalimat terima kasih serta cerita bantuan dengan memilih あげる, くれる, atau もらう secara tepat.',
    items: [
      {
        symbol: '翻訳してもらいました',
        reading: 'hon-yaku shite moraimashita',
        meaning: 'Saya minta diterjemahkan oleh...',
        mnemonic: '翻訳 (hon-yaku) adalah penerjemahan teks tertulis, berbeda dengan 通訳 (lisan).',
        speakText: '先輩にこの書類を翻訳してもらいました',
      },
      {
        symbol: '送ってくれました',
        reading: 'okutte kuremashita',
        meaning: '(Ibu) mengirimkan kepada saya',
        mnemonic: 'Subjeknya 母が (Ibu) yang berbuat baik untuk saya, jadi wajib pakai くれました.',
        speakText: '母がインドネシアの食べ物を送ってくれました',
      },
      {
        symbol: '写真を撮ってあげました',
        reading: 'shashin o totte agemashita',
        meaning: 'Saya memotretkan untuk (wisatawan)',
        mnemonic: 'Subjeknya 私は (saya) membantu pihak luar, jadi gunakan あげました.',
        speakText: '私は観光客の写真を撮ってあげました',
      },
      {
        symbol: '観光客',
        reading: 'kankoukyaku',
        meaning: 'Wisatawan / turis',
        mnemonic: 'Gabungan 観光 (wisata) + 客 (tamu/pengunjung).',
        speakText: '観光客',
      },
    ],
    contrastiveTip:
      'Jika subjek kalimat adalah "orang lain" dan penerimanya "saya", JANGAN pakai あげました. Selalu pakai くれました.',
  },

  // =========================================================================
  // JLPT N4 — UNIT 6: Saran Sebaiknya: Kesehatan & Harian (GP-JA-N4-006)
  // =========================================================================
  'n4-u6-kosakata': {
    headline: 'Kenali Kosakata Kesehatan & Klinik',
    subtitle:
      'Hafalkan ungkapan keluhan sakit, aturan minum obat, dan perawatan diri sebelum mempraktikkan pola memberi saran.',
    items: [
      {
        symbol: 'お腹が痛い',
        reading: 'onaka ga itai',
        meaning: 'Sakit perut',
        mnemonic: 'Pola keluhan tubuh: [Bagian tubuh] + が + 痛い (itai = sakit).',
        speakText: '朝からずっとお腹が痛いんです',
      },
      {
        symbol: '食べすぎました',
        reading: 'tabesugimashita',
        meaning: 'Makan terlalu banyak',
        mnemonic: 'Kata kerja stem (食べ) + すぎる berarti melakukan sesuatu secara berlebihan.',
        speakText: '冷たいものを食べすぎました',
      },
      {
        symbol: '一日に三回',
        reading: 'ichinichi ni sankai',
        meaning: 'Tiga kali dalam sehari',
        mnemonic: 'Frasa wajib pada resep dokter atau bungkus obat di Jepang.',
        speakText: '一日に三回',
      },
      {
        symbol: '温かい水',
        reading: 'atatakai mizu',
        meaning: 'Air hangat',
        mnemonic: '温かい dipakai untuk suhu makanan, minuman, dan benda saat disentuh.',
        speakText: 'ゆっくり休んで、温かい水をたくさん飲みます',
      },
    ],
    contrastiveTip:
      'Bedakan 食べすぎました (makan berlebihan) dengan たくさん食べました (makan banyak, bernada netral tanpa konotasi negatif).',
  },
  'n4-u6-pola-utama': {
    headline: 'Kuasai Pola Saran ～たほうがいい',
    subtitle:
      'Pola ini berarti "sebaiknya...". Gunakan bentuk-た untuk saran positif dan bentuk-ない untuk saran larangan.',
    items: [
      {
        symbol: '飲んだほうがいいですよ',
        reading: 'nonda hou ga ii desu yo',
        meaning: 'Sebaiknya segera minum (obat)',
        mnemonic: 'Rumus positif: Kata Kerja bentuk-た + ほうがいいです (tambahkan よ agar terdengar peduli).',
        speakText: 'すぐにこの薬を飲んだほうがいいですよ',
      },
      {
        symbol: '寝たほうがいいですよ',
        reading: 'neta hou ga ii desu yo',
        meaning: 'Sebaiknya tidur yang cukup',
        mnemonic: '寝る (neru) adalah kelompok 2, sehingga bentuk-た nya 寝た (neta).',
        speakText: 'よく寝たほうがいいですよ',
      },
      {
        symbol: '行かないほうがいいです',
        reading: 'ikanai hou ga ii desu',
        meaning: 'Sebaiknya tidak pergi',
        mnemonic: 'Rumus negatif: Kata Kerja bentuk-ない + ほうがいいです (BUKAN bentuk lampau なかった).',
        speakText: '無理して行かないほうがいいです',
      },
      {
        symbol: '飲まないほうがいいですよ',
        reading: 'nomanai hou ga ii desu yo',
        meaning: 'Sebaiknya tidak minum',
        mnemonic: 'Contoh: 夜遅くコーヒーを飲まないほうがいいですよ (sebaiknya jangan minum kopi larut malam).',
        speakText: '夜遅くコーヒーを飲まないほうがいいですよ',
      },
    ],
    contrastiveTip:
      'Untuk saran positif, SELALU pakai bentuk-た (飲んだほうがいい), bukan bentuk kamus. Sedangkan untuk saran negatif, pakai bentuk-ない (飲まないほうがいい).',
  },
  'n4-u6-dengar-baca': {
    headline: 'Simak & Baca Saran Dokter & Keseharian',
    subtitle:
      'Tangkap saran medis, persiapan musim dingin, dan pilihan transportasi yang sering diucapkan dalam percakapan sehari-hari.',
    items: [
      {
        symbol: '激しい運動',
        reading: 'hageshii undou',
        meaning: 'Olahraga berat',
        mnemonic: 'Dokter sering melarang 激しい運動 selama beberapa hari saat pasien baru pulih.',
        speakText: '激しい運動',
      },
      {
        symbol: '急に寒くなります',
        reading: 'kyuu ni samuku narimasu',
        meaning: 'Mendadak menjadi dingin',
        mnemonic: '急に (kyuu ni) artinya tiba-tiba/mendadak; sangat sering dipakai untuk perubahan cuaca.',
        speakText: '来月から急に寒くなります',
      },
      {
        symbol: '買っておいたほうがいい',
        reading: 'katte oita hou ga ii',
        meaning: 'Sebaiknya dibeli terlebih dahulu',
        mnemonic: 'Gabungan ～ておく (persiapan) + ～たほうがいい (saran) untuk menyarankan persiapan awal.',
        speakText: '暖かいコートを買っておいたほうがいいですよ',
      },
      {
        symbol: '道路が混みます',
        reading: 'douro ga komimasu',
        meaning: 'Jalanan macet / padat',
        mnemonic: '混む (komu) artinya padat/penuh sesak, dipakai untuk jalan raya, kereta, atau restoran.',
        speakText: '夕方は道路がとても混みます',
      },
    ],
    contrastiveTip:
      'Pola ～たほうがいい bernada cukup tegas (seperti nasihat dokter atau teman akrab). Hindari memakainya ke atasan agar tidak terkesan memerintah.',
  },
  'n4-u6-bicara-rakit': {
    headline: 'Latih Memberi Nasihat yang Natural',
    subtitle:
      'Susun alasan singkat lalu berikan saran menggunakan ～たほうがいいですよ atau ～ないほうがいいですよ.',
    items: [
      {
        symbol: '傘を持って行ったほうがいい',
        reading: 'kasa o motte itta hou ga ii',
        meaning: 'Sebaiknya membawa pergi payung',
        mnemonic: '持って行く (motte iku = membawa pergi) berubah menjadi bentuk-た: 持って行った.',
        speakText: '外は雨ですから、傘を持って行ったほうがいいですよ',
      },
      {
        symbol: 'メモに書いたほうがいい',
        reading: 'memo ni kaita hou ga ii',
        meaning: 'Sebaiknya dicatat di memo',
        mnemonic: '書く (kaku) -> 書いた (kaita). Tips jitu agar tidak lupa instruksi kerja.',
        speakText: '大事なことはメモに書いたほうがいいです',
      },
      {
        symbol: '大事なこと',
        reading: 'daiji na koto',
        meaning: 'Hal yang penting',
        mnemonic: '大事 (daiji) adalah kata sifat-な, sehingga sebelum kata benda memakai な.',
        speakText: '大事なこと',
      },
      {
        symbol: '夜遅く',
        reading: 'yoru osoku',
        meaning: 'Larut malam',
        mnemonic: '遅い (osoi) diubah menjadi kata keterangan 遅く (osoku) untuk menerangkan waktu.',
        speakText: '夜遅く',
      },
    ],
    contrastiveTip:
      'Bedakan 持って行く (membawa pergi dari sini) dengan 持って来る (membawa datang ke sini). Saat keluar rumah saat hujan, pakai 持って行ったほうがいい.',
  },

  // =========================================================================
  // JLPT N4 — UNIT 7: Menyatakan Alasan Halus & Izin Sopan (GP-JA-N4-007)
  // =========================================================================
  'n4-u7-kosakata': {
    headline: 'Kenali Kosakata Izin & Transportasi',
    subtitle:
      'Kuasai kosakata izin cuti, urusan keluarga, dan gangguan kereta sebelum melatih alasan halus dengan ～ので.',
    items: [
      {
        symbol: '熱がある',
        reading: 'netsu ga aru',
        meaning: 'Sedang demam',
        mnemonic: 'Ungkapan standar saat izin sakit: 朝から熱があるので (karena demam sejak pagi).',
        speakText: '朝から熱があります',
      },
      {
        symbol: '運休',
        reading: 'unkyuu',
        meaning: 'Layanan kereta dihentikan sementara',
        mnemonic: 'Sering muncul di pengumuman stasiun saat topan (台風) atau salju lebat.',
        speakText: '午後の特急電車は運休になります',
      },
      {
        symbol: '家族の用事',
        reading: 'kazoku no youji',
        meaning: 'Urusan keluarga',
        mnemonic: '用事 (youji) adalah kata sopan dan aman untuk menyatakan ada keperluan pribadi.',
        speakText: '家族の用事があるので、明日休みをいただきたいです',
      },
      {
        symbol: '休ませていただけますか',
        reading: 'yasumasete itadakemasu ka',
        meaning: 'Bolehkah saya diizinkan libur/cuti?',
        mnemonic: 'Ungkapan izin kerja paling sopan saat tidak bisa masuk kantor.',
        speakText: '今日は会社を休ませていただけますか',
      },
    ],
    contrastiveTip:
      'Dalam bahasa Jepang, 熱がある berarti "ada demam", bukan 熱い (atsui = panas cuaca/benda).',
  },
  'n4-u7-pola-utama': {
    headline: 'Kuasai Pola Alasan Halus ～ので',
    subtitle:
      'Pola ～ので menyatakan sebab-akibat secara objektif dan lembut, sangat disukai dalam bahasa formal dan saat meminta izin.',
    items: [
      {
        symbol: '試験があるので',
        reading: 'shiken ga aru node',
        meaning: 'Karena ada ujian',
        mnemonic: 'Kata kerja bentuk biasa (kamus/ない/た) langsung disambung ので.',
        speakText: '明日は試験があるので、今夜は勉強しなければなりません',
      },
      {
        symbol: '初めてなので',
        reading: 'hajimete na node',
        meaning: 'Karena ini pertama kalinya',
        mnemonic: 'PENTING: Kata benda dan kata sifat-な wajib ditambah な sebelum ので!',
        speakText: '初めてなので、どうぞよろしくお願いします',
      },
      {
        symbol: '食べなかったので',
        reading: 'tabenakatta node',
        meaning: 'Karena tidak makan (tadi)',
        mnemonic: 'Bentuk lampau negatif (～なかった) langsung disambung ので tanpa な.',
        speakText: '朝ご飯を食べなかったので、今とてもお腹が空いています',
      },
      {
        symbol: '混み合っておりますので',
        reading: 'komiatte orimasu node',
        meaning: 'Karena saat ini sedang sangat ramai',
        mnemonic: 'Bentuk ます juga boleh dipakai sebelum ので untuk kesan ekstra sopan kepada pelanggan.',
        speakText: 'ただいま大変混み合っておりますので、三十分ほどお待ちください',
      },
    ],
    contrastiveTip:
      'Jangan pernah menulis 初めてので atau 雨ので! Kata benda dan kata sifat-な WAJIB memakai な sebelum ので (初めてなので, 雨なので).',
  },
  'n4-u7-dengar-baca': {
    headline: 'Simak & Baca Pengumuman & Alasan Sopan',
    subtitle:
      'Perhatikan bagaimana ～ので digunakan dalam pengumuman toko, laporan kerusakan IT, dan layanan pelanggan.',
    items: [
      {
        symbol: '棚卸し作業',
        reading: 'tanaoroshi sagyou',
        meaning: 'Pekerjaan inventarisasi / cek stok',
        mnemonic: 'Istilah yang sering muncul di pemberitahuan tutup toko lebih awal di Jepang.',
        speakText: '本日は棚卸し作業があるので、午後六時に閉店いたします',
      },
      {
        symbol: '動かなくなった',
        reading: 'ugokanaku natta',
        meaning: 'Menjadi tidak berfungsi / macet',
        mnemonic: '動かない (tidak bergerak) -> 動かなくなる (menjadi berhenti bekerja).',
        speakText: 'パソコンが急に動かなくなりました',
      },
      {
        symbol: 'IT担当の方',
        reading: 'ai-tii tantou no kata',
        meaning: 'Petugas penanggung jawab IT',
        mnemonic: '担当 (tantou = penanggung jawab), 方 (kata) adalah sebutan sopan untuk orang.',
        speakText: 'IT担当の方を呼んでいただけませんか',
      },
      {
        symbol: '閉店いたします',
        reading: 'heiten itashimasu',
        meaning: 'Kami menutup toko (sangat sopan)',
        mnemonic: '閉店 (heiten = tutup toko) + いたします (bentuk rendah hati dari します).',
        speakText: '午後六時に閉店いたします',
      },
    ],
    contrastiveTip:
      'Bedakan ～から (alasan subjektif/kasual, sering diikuti perintah) dengan ～ので (alasan objektif/halus, ideal untuk pengumuman dan izin sopan).',
  },
  'n4-u7-bicara-rakit': {
    headline: 'Latih Meminta Izin & Menjelaskan Alasan',
    subtitle:
      'Rangkai alasan yang sopan menggunakan ～ので sebelum menyampaikan permintaan atau kondisi dirimu.',
    items: [
      {
        symbol: 'お腹が空いています',
        reading: 'onaka ga suite imasu',
        meaning: 'Perut sedang lapar',
        mnemonic: '空く (suku = kosong) dalam bentuk ～ています menyatakan keadaan sedang lapar.',
        speakText: '今とてもお腹が空いています',
      },
      {
        symbol: '聞こえにくいので',
        reading: 'kikoenikui node',
        meaning: 'Karena agak sulit terdengar',
        mnemonic: 'Kata kerja stem + にくい berarti "sulit untuk di-...". Cara halus meminta lawan bicara mengeraskan suara.',
        speakText: '少し聞こえにくいので、もう少し大きく話してください',
      },
      {
        symbol: '大きく話してください',
        reading: 'ookiku hanashite kudasai',
        meaning: 'Tolong bicara lebih keras',
        mnemonic: '大きい (besar) diubah menjadi 大きく (dengan keras/besar) untuk menerangkan kata kerja.',
        speakText: 'もう少し大きく話してください',
      },
      {
        symbol: 'どうぞよろしくお願いします',
        reading: 'douzo yoroshiku onegai shimasu',
        meaning: 'Mohon bimbingan dan kerja samanya',
        mnemonic: 'Sangat natural digabung dengan 初めてなので saat baru mulai bekerja di tempat baru.',
        speakText: '初めてなので、どうぞよろしくお願いします',
      },
    ],
    contrastiveTip:
      'Saat meminta orang berbicara lebih keras, pakai 大きく話す (bukan 強く話す), dan awali dengan alasan halus 少し聞こえにくいので.',
  },

  // =========================================================================
  // JLPT N4 — UNIT 8: Syarat & Pengandaian (～たら) (GP-JA-N4-008)
  // =========================================================================
  'n4-u8-kosakata': {
    headline: 'Kenali Kosakata Cuaca & Rencana',
    subtitle:
      'Pelajari kata-kata tentang cuaca, prosedur kerja, dan rencana akhir pekan sebelum menyusun kalimat syarat ～たら.',
    items: [
      {
        symbol: '天気がよかったら',
        reading: 'tenki ga yokattara',
        meaning: 'Kalau cuacanya bagus',
        mnemonic: 'いい (bagus) bentuk lampaunya よかった -> tambah ら menjadi よかったら.',
        speakText: '日曜日、天気がよかったら、バーベキューをしませんか',
      },
      {
        symbol: '掃除が終わったら',
        reading: 'souji ga owattara',
        meaning: 'Setelah pembersihan selesai',
        mnemonic: 'Selain "jika", ～たら juga berarti "setelah..." untuk kejadian yang pasti terjadi.',
        speakText: '機械の掃除が終わったら、スイッチを切ってください',
      },
      {
        symbol: '報告する',
        reading: 'houkoku suru',
        meaning: 'Melaporkan (hasil kerja)',
        mnemonic: 'Bagian utama budaya kerja Jepang Hou-Ren-Sou (報告・連絡・相談).',
        speakText: '報告してください',
      },
      {
        symbol: '時間があったら',
        reading: 'jikan ga attara',
        meaning: 'Kalau ada waktu',
        mnemonic: 'ある (ada) bentuk-た nya あった -> tambah ら menjadi あったら.',
        speakText: '時間があったら、温泉へ行きたいです',
      },
    ],
    contrastiveTip:
      'Perhatikan bentuk tidak beraturan dari いい (baik): bentuk syaratnya adalah よかったら (BUKAN いいたら).',
  },
  'n4-u8-pola-utama': {
    headline: 'Kuasai Pola Syarat ～たら',
    subtitle:
      'Pola ～たら adalah bentuk pengandaian paling serbaguna di bahasa Jepang: cukup ubah ke bentuk lampau (～た) lalu tambahkan ら.',
    items: [
      {
        symbol: '家に着いたら',
        reading: 'ie ni tsuitara',
        meaning: 'Kalau / setelah sampai di rumah',
        mnemonic: '着く (tsuku = tiba) -> 着いた (tsuita) + ら = 着いたら.',
        speakText: '家に着いたら、メッセージを送ってくださいね',
      },
      {
        symbol: '合格したら',
        reading: 'goukaku shitara',
        meaning: 'Kalau lulus (ujian)',
        mnemonic: '合格する -> 合格した + ら. Bisa diikuti keinginan (～たい) atau rencana.',
        speakText: 'N4に合格したら、次は特定技能試験に挑戦したいです',
      },
      {
        symbol: '五時になったら',
        reading: 'goji ni nattara',
        meaning: 'Kalau sudah pukul lima',
        mnemonic: 'なる (menjadi) -> なった + ら. Menyatakan titik waktu dimulainya aksi berikutnya.',
        speakText: '五時になったら、帰ってもいいですよ',
      },
      {
        symbol: '間違いがあったら',
        reading: 'machigai ga attara',
        meaning: 'Jika ada kesalahan',
        mnemonic: 'Frasa andalan saat menyerahkan laporan atau latihan agar dikoreksi.',
        speakText: '間違いがあったら、すぐ教えてください',
      },
    ],
    contrastiveTip:
      'Kelebihan ～たら dibanding ～と: klausa belakang ～たら BEBAS diisi ajakan (～ませんか), perintah (～てください), maupun keinginan (～たい).',
  },
  'n4-u8-dengar-baca': {
    headline: 'Simak & Baca Prosedur Kerja & Arah Jalan',
    subtitle:
      'Tangkap instruksi darurat mesin, target karier di Jepang, dan petunjuk arah stasiun yang memakai ～たら.',
    items: [
      {
        symbol: '赤いランプがついたら',
        reading: 'akai ranpu ga tsuitara',
        meaning: 'Jika lampu merah menyala',
        mnemonic: 'つく (tsuku = menyala) -> ついた + ら. Sering muncul di SOP keselamatan pabrik.',
        speakText: 'もし赤いランプがついたら、すぐに機械を止めてください',
      },
      {
        symbol: '責任者',
        reading: 'sekininsha',
        meaning: 'Penanggung jawab / supervisor',
        mnemonic: 'Orang yang wajib segera dipanggil saat terjadi kendala di tempat kerja.',
        speakText: '責任者を呼んでください',
      },
      {
        symbol: '特定技能試験',
        reading: 'tokutei ginou shiken',
        meaning: 'Ujian keterampilan khusus (SSW)',
        mnemonic: 'Jalur resmi bekerja di Jepang untuk bidang seperti 介護 (perawatan lansia).',
        speakText: '介護の特定技能試験に挑戦したいです',
      },
      {
        symbol: '東口を出たら',
        reading: 'higashiguchi o detara',
        meaning: 'Setelah keluar dari pintu timur',
        mnemonic: '出る (keluar) memakai partikel を untuk titik keluar (東口を出る).',
        speakText: '東口を出たら、すぐ右へ曲がってください',
      },
    ],
    contrastiveTip:
      'Kata もし di awal kalimat (もし～たら) berfungsi sebagai penanda pengandaian ("seandainya/kalau") dan opsional, sedangkan ～たら di tengah kalimat adalah bagian wajibnya.',
  },
  'n4-u8-bicara-rakit': {
    headline: 'Latih Kalimat "Jika" & "Setelah" dengan ～たら',
    subtitle:
      'Ucapkan rencana masa depan, izin pulang sesuai jam, dan permohonan koreksi secara lancar.',
    items: [
      {
        symbol: '帰ったら',
        reading: 'kaettara',
        meaning: 'Setelah pulang / kembali',
        mnemonic: '帰る (kaeru) adalah kelompok 1, jadi bentuk-た nya 帰った -> 帰ったら.',
        speakText: 'インドネシアへ帰ったら、日本料理の店を開きたいです',
      },
      {
        symbol: '店を開きたい',
        reading: 'mise o hirakitai',
        meaning: 'Ingin membuka toko/restoran',
        mnemonic: '開く (hiraku = membuka usaha/acara) + たい (ingin).',
        speakText: '日本料理の店を開きたいです',
      },
      {
        symbol: '帰ってもいいですよ',
        reading: 'kaette mo ii desu yo',
        meaning: 'Boleh pulang kok',
        mnemonic: 'Pola izin ～てもいいです yang sering dipasangkan setelah syarat waktu (五時になったら).',
        speakText: '五時になったら、帰ってもいいですよ',
      },
      {
        symbol: 'すぐ教えてください',
        reading: 'sugu oshiete kudasai',
        meaning: 'Tolong segera beri tahu saya',
        mnemonic: 'すぐ (sugu = segera) menunjukkan respons cepat saat ada masalah atau kesalahan.',
        speakText: '間違いがあったら、すぐ教えてください',
      },
    ],
    contrastiveTip:
      'Hati-hati mengubah 帰る (pulang): meskipun berakhiran る, 帰る adalah kelompok 1 (Godan), jadi bentuknya 帰ったら (BUKAN 帰たら).',
  },

  // =========================================================================
  // JLPT N4 — UNIT 9: Persiapan Sebelumnya (～ておく) (GP-JA-N4-009)
  // =========================================================================
  'n4-u9-kosakata': {
    headline: 'Kenali Kosakata Perjalanan & Rapat',
    subtitle:
      'Pelajari kata kerja persiapan sehari-hari seperti mengecek transit, menyiapkan teh tamu, dan mengisi daya ponsel.',
    items: [
      {
        symbol: '乗り換え時間',
        reading: 'norikae jikan',
        meaning: 'Waktu transit / pindah kereta',
        mnemonic: '乗り換え (norikae) sangat penting saat bepergian dengan jaringan kereta Jepang.',
        speakText: '電車の乗り換え時間を調べておきました',
      },
      {
        symbol: '用意する',
        reading: 'youi suru',
        meaning: 'Menyiapkan (barang/keperluan)',
        mnemonic: 'Lebih fokus pada menyediakan benda fisik seperti minuman, paspor, atau dokumen.',
        speakText: '冷たいお茶を用意しておきますね',
      },
      {
        symbol: '充電する',
        reading: 'juuden suru',
        meaning: 'Mengisi daya / mengecas baterai',
        mnemonic: 'Kebiasaan wajib sebelum tidur agar ponsel siap dipakai keesokan harinya.',
        speakText: '今夜寝る前に、スマホを充電しておきます',
      },
      {
        symbol: '出発前',
        reading: 'shuppatsu mae',
        meaning: 'Sebelum keberangkatan',
        mnemonic: '出発 (shuppatsu = berangkat) sering dipasangkan dengan 前に untuk persiapan perjalanan.',
        speakText: '明日の出発前',
      },
    ],
    contrastiveTip:
      'Bedakan 用意する (menyiapkan barang konkret seperti teh/dokumen) dengan 準備する (persiapan umum termasuk mental, jadwal, atau acara).',
  },
  'n4-u9-pola-utama': {
    headline: 'Kuasai Pola Persiapan ～ておく',
    subtitle:
      'Tambahkan おく setelah bentuk-て untuk menyatakan tindakan yang dilakukan LEBIH AWAL sebagai persiapan untuk tujuan nanti.',
    items: [
      {
        symbol: '調べておきました',
        reading: 'shirabete okimashita',
        meaning: 'Sudah saya cek terlebih dahulu',
        mnemonic: '～ておきました (lampau) menegaskan persiapan sudah tuntas dilakukan sebelumnya.',
        speakText: '乗り換え時間を調べておきました',
      },
      {
        symbol: '片付けておいてください',
        reading: 'katazukete oite kudasai',
        meaning: 'Tolong bereskan dulu (agar siap dipakai)',
        mnemonic: '片付ける (merapikan) + ておいてください untuk instruksi merapikan meja setelah dipakai.',
        speakText: '使い終わったら、この机を片付けておいてください',
      },
      {
        symbol: 'そのままにしておいて',
        reading: 'sono mama ni shite oite',
        meaning: 'Biarkan saja seperti itu dulu',
        mnemonic: 'Fungsi kedua ～ておく: membiarkan suatu kondisi tetap seperti semula karena masih akan dipakai.',
        speakText: '机の上にそのままにしておいてください',
      },
      {
        symbol: '買っておきました',
        reading: 'katte okimashita',
        meaning: 'Sudah saya beli duluan',
        mnemonic: 'Dipakai saat membeli oleh-oleh atau tiket jauh-jauh hari sebelum hari-H.',
        speakText: 'お土産をもう買っておきました',
      },
    ],
    contrastiveTip:
      'Bedakan ～てあります (fokus pada KEADAAN hasil sekarang: 置いてあります = tergeletak di sana) dengan ～ておきます (fokus pada AKSI persiapan oleh pelaku: 置いておきます = saya taruh dulu untuk nanti).',
  },
  'n4-u9-dengar-baca': {
    headline: 'Simak & Baca Rencana Matang di Kantor',
    subtitle:
      'Kenali penggunaan ～ておく saat menyiapkan ruang rapat, membiarkan dokumen tetap di meja, dan rencana kepulangan.',
    items: [
      {
        symbol: 'きれいにしておいてくれますか',
        reading: 'kirei ni shite oite kuremasu ka',
        meaning: 'Maukah kamu membersihkan dulu?',
        mnemonic: 'Gabungan きれいにする (membersihkan) + ～ておく + ～てくれますか (permintaan halus ke rekan).',
        speakText: 'ホワイトボードをきれいにしておいてくれますか',
      },
      {
        symbol: 'まだ使いますから',
        reading: 'mada tsukaimasu kara',
        meaning: 'Karena masih akan dipakai',
        mnemonic: 'Alasan umum saat meminta orang lain tidak membereskan dokumen (そのままにしておいて).',
        speakText: 'その資料はまだ使いますから、そのままにしておいてください',
      },
      {
        symbol: '帰国する',
        reading: 'kikoku suru',
        meaning: 'Pulang ke negara asal',
        mnemonic: 'Gabungan 帰 (kembali) + 国 (negara). Sangat sering muncul dalam percakapan pekerja asing di Jepang.',
        speakText: '来週帰国します',
      },
      {
        symbol: 'お土産',
        reading: 'omiyage',
        meaning: 'Oleh-oleh / buah tangan',
        mnemonic: 'Tradisi penting di Jepang saat bepergian atau pulang kampung untuk dibagikan ke rekan/teman.',
        speakText: '友達へのお土産をもう買っておきました',
      },
    ],
    contrastiveTip:
      'Dalam percakapan kasual, ～ておく sering disingkat menjadi ～とく (contoh: 買っておく -> 買っとく), namun di JLPT N4 selalu kuasai bentuk penuh ～ておく.',
  },
  'n4-u9-bicara-rakit': {
    headline: 'Latih Menyampaikan Aksi Persiapan',
    subtitle:
      'Rangkai kalimat persiapan sebelum bepergian, sebelum lupa, dan sebelum keluar rumah dengan ～ておく.',
    items: [
      {
        symbol: 'メモに書いておきます',
        reading: 'memo ni kaite okimasu',
        meaning: 'Saya catat dulu di memo (agar tidak lupa)',
        mnemonic: 'Sering diawali 忘れないように (supaya tidak lupa).',
        speakText: '忘れないように、メモに書いておきます',
      },
      {
        symbol: '窓を全部閉めておきました',
        reading: 'mado o zenbu shimete okimashita',
        meaning: 'Saya sudah menutup semua jendela dulu',
        mnemonic: '閉める (menutup) + ておきました untuk persiapan keamanan sebelum bepergian.',
        speakText: '出かける前に、窓を全部閉めておきました',
      },
      {
        symbol: '今夜のうちに',
        reading: 'kon-ya no uchi ni',
        meaning: 'Mumpung masih malam ini / sebelum malam berakhir',
        mnemonic: 'Batas waktu persiapan agar besok pagi tidak terburu-buru.',
        speakText: '今夜のうちに、パスポートと航空券を用意しておいてください',
      },
      {
        symbol: '航空券',
        reading: 'koukuuken',
        meaning: 'Tiket pesawat',
        mnemonic: 'Gabungan 航空 (penerbangan) + 券 (tiket/kupon).',
        speakText: 'パスポートと航空券',
      },
    ],
    contrastiveTip:
      'Ingat partikel objek pada ～ておく tetap memakai を (窓を閉めておきました), karena fokusnya pada tindakan pelaku, bukan keadaan benda.',
  },

  // =========================================================================
  // JLPT N4 — UNIT 10: Kenjougo Dasar & Kesiapan JLPT N4 (GP-JA-N4-010)
  // =========================================================================
  'n4-u10-kosakata': {
    headline: 'Kenali Kosakata Etika Bisnis & Tamu',
    subtitle:
      'Pelajari kata kerja rendah hati (Kenjougo) paling esensial untuk wawancara kerja, perkenalan formal, dan menyambut tamu.',
    items: [
      {
        symbol: 'まいります',
        reading: 'mairimasu',
        meaning: 'Datang / pergi (Kenjougo dari 来ます・行きます)',
        mnemonic: 'Wajib saat perkenalan formal: インドネシアからまいりました (Saya datang dari Indonesia).',
        speakText: 'インドネシアからまいりました、アリと申します',
      },
      {
        symbol: '申します',
        reading: 'moushimasu',
        meaning: 'Bernama / berkata (Kenjougo dari 言います)',
        mnemonic: 'Dipakai untuk menyebut nama diri sendiri secara rendah hati di depan pewawancara atau klien.',
        speakText: 'アリと申します',
      },
      {
        symbol: '伺います',
        reading: 'ukagaimasu',
        meaning: 'Bertanya / mendengar / berkunjung (Kenjougo)',
        mnemonic: 'Contoh di hotel/resepsionis: お名前を伺ってもよろしいでしょうか (Boleh saya menanyakan nama Anda?).',
        speakText: 'ご予約のお名前を伺ってもよろしいでしょうか',
      },
      {
        symbol: 'かしこまりました',
        reading: 'kashikomarimashita',
        meaning: 'Baik, saya mengerti (sangat sopan)',
        mnemonic: 'Versi formal dari わかりました saat menerima instruksi dari atasan atau permintaan tamu.',
        speakText: 'かしこまりました。すぐに対応いたします',
      },
    ],
    contrastiveTip:
      'Kenjougo (bahasa rendah hati) HANYA dipakai untuk tindakan DIRI SENDIRI atau pihak perusahaan sendiri, JANGAN pernah dipakai untuk tindakan atasan atau tamu!',
  },
  'n4-u10-pola-utama': {
    headline: 'Kuasai Pola Kenjougo Dasar お～します',
    subtitle:
      'Selain kata kerja khusus, kamu bisa merendahkan tindakanmu terhadap tamu/atasan dengan pola お + stem + します/いたします dan ご + kata benda + いたします.',
    items: [
      {
        symbol: '確認いたします',
        reading: 'kakunin itashimasu',
        meaning: 'Saya akan mengeceknya (sangat sopan)',
        mnemonic: 'いたす adalah Kenjougo dari する. Tambahkan di belakang kata benda aksi seperti 確認 atau 対応.',
        speakText: 'ただいまスケジュールを確認いたします',
      },
      {
        symbol: 'お運びいたします',
        reading: 'ohakobi itashimasu',
        meaning: 'Biar saya bawakan (untuk Anda)',
        mnemonic: 'Rumus: お + Kata Kerja stem (運び) + いたします. Dipakai saat menawarkan bantuan ke tamu.',
        speakText: 'お部屋までお荷物をお運びいたします',
      },
      {
        symbol: 'ご連絡いたします',
        reading: 'go-renraku itashimasu',
        meaning: 'Kami akan menghubungi Anda',
        mnemonic: 'Untuk kata benda serapan kanji (連絡, 案内, 説明), pakai awalan ご + いたします.',
        speakText: 'こちらからご連絡いたします',
      },
      {
        symbol: '席を外しております',
        reading: 'seki o hazushite orimasu',
        meaning: 'Sedang tidak ada di tempat duduknya',
        mnemonic: 'おります adalah Kenjougo dari います, dipakai saat menjelaskan kondisi rekan sekantor kepada tamu luar.',
        speakText: '山田は席を外しております',
      },
    ],
    contrastiveTip:
      'Saat berbicara dengan tamu dari luar perusahaan, rekan atau atasan di perusahaan sendiri dianggap "pihak dalam" (uchi), jadi sebut tanpa さん (山田は) dan gunakan Kenjougo.',
  },
  'n4-u10-dengar-baca': {
    headline: 'Simak & Baca Etika Menyambut Tamu',
    subtitle:
      'Pahami alur percakapan resepsionis, permintaan maaf formal, dan kalimat penutup wawancara kerja di Jepang.',
    items: [
      {
        symbol: '申し訳ございません',
        reading: 'moushiwake gozaimasen',
        meaning: 'Mohon maaf yang sebesar-besarnya',
        mnemonic: 'Permintaan maaf tingkat bisnis, jauh lebih formal daripada すみません.',
        speakText: '申し訳ございません、山田は席を外しております',
      },
      {
        symbol: '戻りましたら',
        reading: 'modorimashitara',
        meaning: 'Begitu beliau kembali',
        mnemonic: 'Gabungan bentuk sopan 戻りました + ら untuk menyampaikan tindak lanjut kepada tamu.',
        speakText: '戻りましたら、こちらからご連絡いたします',
      },
      {
        symbol: 'お忙しい中',
        reading: 'oisogashii naka',
        meaning: 'Di tengah kesibukan Anda',
        mnemonic: 'Kalimat apresiasi wajib saat membuka atau menutup wawancara dan rapat bisnis.',
        speakText: '本日はお忙しい中、お時間をいただきありがとうございます',
      },
      {
        symbol: '精一杯頑張ります',
        reading: 'seiippai ganbarimasu',
        meaning: 'Saya akan berusaha sekuat tenaga',
        mnemonic: 'Ungkapan tekad yang sangat disukai pewawancara kerja di Jepang.',
        speakText: '精一杯頑張ります',
      },
    ],
    contrastiveTip:
      'Bedakan いただいております / ありがとうございます: untuk berterima kasih atas waktu tamu, gunakan お時間をいただきありがとうございます.',
  },
  'n4-u10-bicara-rakit': {
    headline: 'Latih Bahasa Hormat Siap Kerja & JLPT N4',
    subtitle:
      'Rangkai dan ucapkan kalimat layanan tamu seperti mengirim dokumen, menerima hadiah, dan memanggilkan taksi.',
    items: [
      {
        symbol: 'お送りいたします',
        reading: 'ookuri itashimasu',
        meaning: 'Saya akan mengirimkannya (kepada Anda)',
        mnemonic: '送る (mengirim) -> お + 送り + いたします.',
        speakText: '本日中に資料をメールでお送りいたします',
      },
      {
        symbol: '頂戴いたします',
        reading: 'choudai itashimasu',
        meaning: 'Saya terima dengan penuh hormat',
        mnemonic: 'Versi sangat sopan dari もらいます saat menerima kartu nama, dokumen, atau pemberian tamu.',
        speakText: '頂戴いたします。ありがとうございます',
      },
      {
        symbol: 'お呼びいたします',
        reading: 'oyobi itashimasu',
        meaning: 'Saya akan memanggilkan (taksi)',
        mnemonic: '呼ぶ (memanggil) -> お + 呼び + いたします.',
        speakText: '私がタクシーをお呼びいたします',
      },
      {
        symbol: '本日中に',
        reading: 'honjitsuchuu ni',
        meaning: 'Dalam hari ini juga (paling lambat hari ini)',
        mnemonic: '本日 adalah bentuk formal dari 今日. Sangat sering dipakai dalam email bisnis Jepang.',
        speakText: '本日中に',
      },
    ],
    contrastiveTip:
      'Jangan menggabungkan お + stem + になります (Sonkeigo/meninggikan lawan bicara) untuk aksi dirimu sendiri! Untuk aksimu sendiri, selalu pakai お + stem + します / いたします.',
  },

  // =========================================================================
  // JLPT N3 — UNIT 1: Membiasakan Diri (～ようにする) (GP-JA-N3-001)
  // =========================================================================
  'n3-u1-kosakata': {
    headline: 'Kenali Kosakata Kebiasaan Sehat & Target Belajar',
    subtitle:
      'Kuasai kosakata penetapan target, pemeriksaan kesehatan, dan pengendalian pola makan sebelum masuk ke pola ～ようにする.',
    items: [
      {
        symbol: '目標を立てる',
        reading: 'mokuhyou o tateru',
        meaning: 'Menetapkan target / tujuan',
        mnemonic: 'Kolokasi wajib JLPT N3: kata kerja untuk "membuat target" adalah 立てる (tateru), bukan 作る.',
        speakText: '毎日新しい漢字を十個覚える目標を立てました',
      },
      {
        symbol: '健康診断',
        reading: 'kenkou shindan',
        meaning: 'Pemeriksaan kesehatan rutin (medical check-up)',
        mnemonic: 'Agenda tahunan wajib bagi karyawan dan mahasiswa di Jepang.',
        speakText: '健康診断の結果を見ました',
      },
      {
        symbol: '控える',
        reading: 'hikaeru',
        meaning: 'Mengurangi / menahan diri dari (gula, kopi, dll.)',
        mnemonic: 'Contoh: 甘い飲み物を控える (mengurangi minuman manis).',
        speakText: '甘い飲み物を控えて水を多く飲みます',
      },
      {
        symbol: '通勤',
        reading: 'tsuukin',
        meaning: 'Perjalanan pergi-pulang kerja',
        mnemonic: 'Kebalikan dari 通学 (tsuugaku = pergi-pulang sekolah/kampus).',
        speakText: '通勤の電車の中',
      },
    ],
    contrastiveTip:
      'Gunakan 控える (hikaeru) untuk "mengurangi/membatasi" konsumsi demi kesehatan, bukan 止める yang berarti berhenti total.',
  },
  'n3-u1-pola-utama': {
    headline: 'Kuasai Pola ～ようにする & ～ようにしている',
    subtitle:
      'Gunakan ～ようにする untuk menyatakan usaha sadar membiasakan diri, dan ～ようにしている untuk kebiasaan yang sedang rutin dijalani.',
    items: [
      {
        symbol: '聞くようにしています',
        reading: 'kiku you ni shite imasu',
        meaning: 'Saya membiasakan diri mendengarkan',
        mnemonic: 'Rumus: Kata Kerja bentuk kamus + ようにしている (rutinitas aktif yang terus dijaga).',
        speakText: '通勤の電車の中では、必ず日本のニュースを聞くようにしています',
      },
      {
        symbol: '確認するようにしています',
        reading: 'kakunin suru you ni shite imasu',
        meaning: 'Saya selalu berusaha mengecek',
        mnemonic: 'Menunjukkan usaha konsisten yang dilakukan berulang kali setiap hari.',
        speakText: '必ずカロリーと塩分を確認するようにしています',
      },
      {
        symbol: '質問するようにしてください',
        reading: 'shitsumon suru you ni shite kudasai',
        meaning: 'Usahakan / biasakanlah untuk bertanya',
        mnemonic: 'Bentuk instruksi ～ようにしてください terdengar lebih halus dan mendidik daripada ～てください.',
        speakText: '早めに質問するようにしてください',
      },
      {
        symbol: '忘れないようにしてください',
        reading: 'wasurenai you ni shite kudasai',
        meaning: 'Usahakan agar jangan sampai lupa',
        mnemonic: 'Rumus negatif: Kata Kerja bentuk-ない + ようにする (berusaha agar tidak terjadi).',
        speakText: '社員証を忘れないようにしてください',
      },
    ],
    contrastiveTip:
      'Bedakan ～ことにする (keputusan satu kali yang tegas) dengan ～ようにする (usaha bertahap atau pembiasaan rutin agar terbiasa melakukannya).',
  },
  'n3-u1-dengar-baca': {
    headline: 'Simak & Baca Gaya Hidup Sehat di Jepang',
    subtitle:
      'Tangkap detail kebiasaan ramah lingkungan, pengecekan nutrisi bento konbini, dan etika bertanya di tempat kerja.',
    items: [
      {
        symbol: '塩分',
        reading: 'enbun',
        meaning: 'Kadar garam',
        mnemonic: 'Sering dicek bersama カロリー (kalori) di label kemasan makanan Jepang.',
        speakText: 'カロリーと塩分を確認します',
      },
      {
        symbol: 'ゴミを減らす',
        reading: 'gomi o herasu',
        meaning: 'Mengurangi sampah',
        mnemonic: '減らす (herasu = mengurangi, transitif) vs 減る (heru = berkurang, intransitif).',
        speakText: 'ゴミを減らすために、マイボトルを持っていくようにしています',
      },
      {
        symbol: 'そのままにしないで',
        reading: 'sono mama ni shinaide',
        meaning: 'Jangan dibiarkan begitu saja',
        mnemonic: 'Peringatan penting di kantor Jepang: jika tidak paham, jangan didiamkan tanpa bertanya.',
        speakText: 'わからないことがあったら、そのままにしないでください',
      },
      {
        symbol: '早めに',
        reading: 'hayame ni',
        meaning: 'Lebih awal / sedini mungkin',
        mnemonic: 'Akhiran ～め pada kata sifat-い memberi nuansa "agak lebih..." (早い -> 早め).',
        speakText: '早めに質問するようにしてください',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～ようになる (perubahan kemampuan/keadaan yang terjadi secara alami) dengan ～ようにする (usaha sadar dari diri sendiri).',
  },
  'n3-u1-bicara-rakit': {
    headline: 'Latih Merangkai Kalimat Kebiasaan Harian',
    subtitle:
      'Ucapkan target minum air, kebiasaan memakai bahasa Jepang di kantor, dan pengingat penting dengan lancar.',
    items: [
      {
        symbol: '水を二リットル飲むようにしています',
        reading: 'mizu o ni-rittoru nomu you ni shite imasu',
        meaning: 'Saya membiasakan diri minum dua liter air',
        mnemonic: 'Gabungkan frekuensi (毎日) + jumlah + kata kerja kamus + ようにしています.',
        speakText: '毎日水を二リットル飲むようにしています',
      },
      {
        symbol: '社員証',
        reading: 'shainshou',
        meaning: 'Kartu identitas karyawan (ID card)',
        mnemonic: 'Wajib dibawa setiap hari kerja untuk masuk gedung kantor.',
        speakText: '社員証を忘れないようにしてください',
      },
      {
        symbol: '職場で日本語を使うようにしています',
        reading: 'shokuba de nihongo o tsukau you ni shite imasu',
        meaning: 'Saya berusaha memakai bahasa Jepang di tempat kerja',
        mnemonic: '職場 (shokuba) adalah tempat kerja secara umum (kantor, pabrik, toko, rumah sakit).',
        speakText: '今月から職場で日本語を使うようにしています',
      },
      {
        symbol: '今月から',
        reading: 'kongetsu kara',
        meaning: 'Mulai bulan ini',
        mnemonic: 'Penanda titik awal memulai kebiasaan baru.',
        speakText: '今月から',
      },
    ],
    contrastiveTip:
      'Untuk kebiasaan yang sedang berlangsung saat ini, pakai ～ようにしています (bukan ～ようにします yang artinya "mulai sekarang saya akan berusaha").',
  },

  // =========================================================================
  // JLPT N3 — UNIT 2: Keputusan Resmi (～ことになる) (GP-JA-N3-002)
  // =========================================================================
  'n3-u2-kosakata': {
    headline: 'Kenali Kosakata Kantor, Penugasan & Pengumuman',
    subtitle:
      'Pelajari istilah kantor pusat, pelatihan internal, dan penugasan tim yang sering diumumkan menggunakan ～ことになる.',
    items: [
      {
        symbol: '本社',
        reading: 'honsha',
        meaning: 'Kantor pusat',
        mnemonic: 'Kebalikan dari 支社 (shisha = kantor cabang).',
        speakText: '四月から東京の本社で新しいプロジェクトを担当します',
      },
      {
        symbol: '担当する',
        reading: 'tantou suru',
        meaning: 'Bertanggung jawab atas / menangani',
        mnemonic: 'Dipakai untuk proyek, klien, atau divisi yang menjadi tanggung jawabmu.',
        speakText: '新しいプロジェクトを担当します',
      },
      {
        symbol: '社内研修',
        reading: 'shanai kenshuu',
        meaning: 'Pelatihan internal perusahaan',
        mnemonic: '社内 (di dalam perusahaan) + 研修 (pelatihan/training).',
        speakText: '今週の金曜日は社内研修があります',
      },
      {
        symbol: '業務を終了する',
        reading: 'gyoumu o shuuryou suru',
        meaning: 'Mengakhiri jam operasional / tugas kerja',
        mnemonic: '業務 (gyoumu) adalah istilah formal untuk pekerjaan/tugas bisnis.',
        speakText: '通常より一時間早く業務を終了します',
      },
    ],
    contrastiveTip:
      'Bedakan 仕事 (shigoto = pekerjaan secara umum) dengan 業務 (gyoumu = tugas resmi perusahaan/operasional kantor).',
  },
  'n3-u2-pola-utama': {
    headline: 'Kuasai Pola ～ことになる & ～ことになっている',
    subtitle:
      'Pola ～ことになる menyatakan keputusan dari luar diri kita (perusahaan/keadaan), sedangkan ～ことになっている menyatakan aturan atau jadwal tetap.',
    items: [
      {
        symbol: '任されることになりました',
        reading: 'makasareru koto ni narimashita',
        meaning: 'Diputuskan saya dipercaya memegang...',
        mnemonic: '任される (dipercayakan) + ことになりました menekankan bahwa itu keputusan manajemen.',
        speakText: '来週から新しいチームのリーダーを任されることになりました',
      },
      {
        symbol: '申請することになっています',
        reading: 'shinsei suru koto ni natte imasu',
        meaning: 'Aturannya adalah mengajukan permohonan...',
        mnemonic: '～ことになっている sangat umum untuk SOP, peraturan kantor, dan jadwal resmi.',
        speakText: '一週間前までにシステムから申請することになっています',
      },
      {
        symbol: '変更することになりました',
        reading: 'henkou suru koto ni narimashita',
        meaning: 'Diputuskan untuk diubah (jadwalnya)',
        mnemonic: 'Dipakai saat mengumumkan perubahan jadwal rapat atau kunjungan klien.',
        speakText: '明日の訪問は来週の水曜日に変更することになりました',
      },
      {
        symbol: '記入することになっています',
        reading: 'kinyuu suru koto ni natte imasu',
        meaning: 'Sesuai aturan harus menuliskan/mengisi...',
        mnemonic: 'Menjelaskan prosedur keamanan kantor secara objektif dan sopan.',
        speakText: '入室の際は受付で名前を記入することになっています',
      },
    ],
    contrastiveTip:
      'Bedakan ～ことにした (keputusan pribadi saya sendiri) dengan ～ことになった (keputusan organisasi, keadaan, atau kesepakatan bersama yang disampaikan secara rendah hati).',
  },
  'n3-u2-dengar-baca': {
    headline: 'Simak & Baca Prosedur & Perubahan Jadwal',
    subtitle:
      'Kenali kosakata cuti berbayar, jadwal kunjungan klien, dan prosedur keamanan gedung di tempat kerja Jepang.',
    items: [
      {
        symbol: '有給休暇',
        reading: 'yuukyuu kyuuka',
        meaning: 'Cuti tahunan berbayar',
        mnemonic: 'Sering disingkat 有給 (yuukyuu). Di Jepang biasanya diajukan jauh hari sebelumnya.',
        speakText: '有給休暇を取る場合は、一週間前までに申請することになっています',
      },
      {
        symbol: '先方の都合により',
        reading: 'senpou no tsugou ni yori',
        meaning: 'Dikarenakan kondisi/jadwal pihak lawan (klien)',
        mnemonic: '先方 (senpou) adalah sebutan bisnis sopan untuk pihak mitra atau klien.',
        speakText: '先方の都合により、訪問は変更することになりました',
      },
      {
        symbol: '入室の際',
        reading: 'nyuushitsu no sai',
        meaning: 'Pada saat memasuki ruangan',
        mnemonic: '際 (sai) adalah bentuk formal dari 時 (toki = saat/ketika).',
        speakText: 'セキュリティのため、入室の際は受付で名前を記入することになっています',
      },
      {
        symbol: '急な話ですが',
        reading: 'kyuu na hanashi desu ga',
        meaning: 'Memang ini kabar mendadak, tetapi...',
        mnemonic: 'Pembuka sopan sebelum menyampaikan pengumuman mutasi atau perubahan mendadak.',
        speakText: '急な話ですが、リーダーを任されることになりました',
      },
    ],
    contrastiveTip:
      'Di bahasa Jepang, bahkan keputusan pribadi seperti pernikahan sering diumumkan memakai ～ことになりました (結婚することになりました) agar terdengar rendah hati dan halus.',
  },
  'n3-u2-bicara-rakit': {
    headline: 'Latih Menyampaikan Pengumuman Kerja & Kabar Resmi',
    subtitle:
      'Susun dan ucapkan pengumuman pernikahan, jadwal rapat tetap, serta penunjukan penanggung jawab klien.',
    items: [
      {
        symbol: '結婚することになりました',
        reading: 'kekkon suru koto ni narimashita',
        meaning: 'Sudah diputuskan kami akan menikah',
        mnemonic: 'Nuansa sopan dan natural saat mengabari rekan kantor tentang rencana pernikahan.',
        speakText: '来月結婚することになりました',
      },
      {
        symbol: '二時から始まることになっています',
        reading: 'niji kara hajimaru koto ni natte imasu',
        meaning: 'Sesuai jadwal dimulai pukul dua',
        mnemonic: 'Menyatakan agenda yang sudah ditetapkan dalam jadwal resmi.',
        speakText: '会議は二時から始まることになっています',
      },
      {
        symbol: '担当することになりました',
        reading: 'tantou suru koto ni narimashita',
        meaning: 'Saya ditugaskan untuk menangani...',
        mnemonic: 'Perkenalan profesional saat mengambil alih penanganan klien baru.',
        speakText: '私がこちらのお客様を担当することになりました',
      },
      {
        symbol: 'こちらのお客様',
        reading: 'kochira no okyakusama',
        meaning: 'Pelanggan/klien ini (sangat sopan)',
        mnemonic: 'こちら jauh lebih sopan daripada この saat merujuk kepada tamu atau klien.',
        speakText: 'こちらのお客様',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～ことになりました (baru saja diputuskan) dengan ～ことになっています (aturan atau jadwal yang sudah berlaku tetap).',
  },

  // =========================================================================
  // JLPT N3 — UNIT 3: Berkat Dukungan (～おかげで) (GP-JA-N3-003)
  // =========================================================================
  'n3-u3-kosakata': {
    headline: 'Kenali Kosakata Pencapaian, Bantuan & Kerja Tim',
    subtitle:
      'Hafalkan kosakata tenggat waktu, penyelesaian dokumen, dan bantuan tetangga sebelum mempelajari pola ～おかげで.',
    items: [
      {
        symbol: '同僚',
        reading: 'douryou',
        meaning: 'Rekan kerja (setara/sekantor)',
        mnemonic: 'Berbeda dengan 先輩 (senior) dan 上司 (atasan).',
        speakText: '同僚に手伝ってもらいました',
      },
      {
        symbol: '期限',
        reading: 'kigen',
        meaning: 'Tenggat waktu / batas akhir (deadline)',
        mnemonic: 'Contoh: 期限より二日早く (dua hari lebih cepat dari tenggat waktu).',
        speakText: '期限より二日早く資料を完成させることができました',
      },
      {
        symbol: '完成させる',
        reading: 'kansei saseru',
        meaning: 'Menyelesaikan hingga tuntas (proyek/dokumen)',
        mnemonic: 'Dipakai untuk hasil karya, laporan, atau proyek besar yang rampung.',
        speakText: '資料を完成させることができました',
      },
      {
        symbol: 'ゴミの分別',
        reading: 'gomi no bunbetsu',
        meaning: 'Pemilahan sampah',
        mnemonic: 'Hal pertama yang biasanya diajarkan tetangga saat baru pindah ke apartemen di Jepang.',
        speakText: '隣の方にゴミの分別を親切に教えていただきました',
      },
    ],
    contrastiveTip:
      'Bedakan 終わる (selesai secara umum) dengan 完成する (rampung/selesai dibuat secara utuh, seperti laporan atau produk).',
  },
  'n3-u3-pola-utama': {
    headline: 'Kuasai Pola ～おかげで & ～おかげだ',
    subtitle:
      'Gunakan ～おかげで ("berkat...") untuk menyatakan sebab dari suatu hasil yang POSITIF disertai rasa syukur.',
    items: [
      {
        symbol: 'ご協力のおかげで',
        reading: 'go-kyouryoku no okage de',
        meaning: 'Berkat kerja sama Anda sekalian',
        mnemonic: 'Kata Benda + の + おかげで. Ungkapan wajib saat menutup acara atau proyek kantor.',
        speakText: '皆さんのご協力のおかげで、歓迎会を無事に終えることができました',
      },
      {
        symbol: '家を出たおかげで',
        reading: 'ie o deta okage de',
        meaning: 'Berkat berangkat dari rumah (lebih awal)',
        mnemonic: 'Kata Kerja bentuk biasa (biasanya lampau ～た) langsung disambung おかげで.',
        speakText: '十五分早く家を出たおかげで、間に合いました',
      },
      {
        symbol: '近いおかげで',
        reading: 'chikai okage de',
        meaning: 'Berkat dekat (dengan stasiun)',
        mnemonic: 'Kata Sifat-い langsung disambung おかげで (近いおかげで).',
        speakText: '駅から近いおかげで、通勤がとても楽です',
      },
      {
        symbol: 'おかげさまで',
        reading: 'okagesama de',
        meaning: 'Berkat doa dan dukungan Anda / syukurlah',
        mnemonic: 'Ungkapan mandiri penuh rasa syukur saat mengabarkan berita baik seperti lulus ujian.',
        speakText: 'おかげさまで、試験に合格しました',
      },
    ],
    contrastiveTip:
      'Perhatikan sambungan: Kata Benda + のおかげで, Kata Sifat-な + なおかげで, Kata Sifat-い / Kata Kerja biasa + おかげで. Dan selalu untuk hasil POSITIF!',
  },
  'n3-u3-dengar-baca': {
    headline: 'Simak & Baca Ungkapan Apresiasi & Rasa Syukur',
    subtitle:
      'Tangkap contoh hasil positif dari berangkat lebih awal, memakai aplikasi kamus, hingga bantuan petugas stasiun.',
    items: [
      {
        symbol: '電車の遅延',
        reading: 'densha no chien',
        meaning: 'Keterlambatan kereta',
        mnemonic: '遅延 (chien) adalah istilah resmi yang muncul di papan informasi dan pengumuman stasiun.',
        speakText: '電車の遅延があっても間に合いました',
      },
      {
        symbol: '無事に終える',
        reading: 'buji ni oeru',
        meaning: 'Menyelesaikan dengan selamat dan lancar',
        mnemonic: '無事に (buji ni = tanpa hambatan/selamat) sering muncul dalam laporan selesainya acara.',
        speakText: '歓迎会を無事に終えることができました',
      },
      {
        symbol: '駅の係員',
        reading: 'eki no kakariin',
        meaning: 'Petugas stasiun',
        mnemonic: '係員 (kakariin) merujuk pada staf bertugas di stasiun, loket, atau gedung acara.',
        speakText: '駅の係員の方がすぐ調べてくださったおかげで、財布が見つかりました',
      },
      {
        symbol: '調べてくださった',
        reading: 'shirabete kudasatta',
        meaning: 'Berkenan memeriksa/mencarikan (sangat sopan)',
        mnemonic: 'くださった adalah bentuk hormat (Sonkeigo) dari くれた untuk menghargai bantuan orang lain.',
        speakText: 'すぐ調べてくださったおかげで',
      },
    ],
    contrastiveTip:
      'Jangan pakai ～おかげで untuk hasil negatif (misalnya telat karena hujan), kecuali dalam sindiran tajam. Untuk penyebab masalah, gunakan ～せいで di Unit 4.',
  },
  'n3-u3-bicara-rakit': {
    headline: 'Latih Mengucapkan Terima Kasih dengan ～おかげで',
    subtitle:
      'Rangkai kalimat apresiasi atas kelulusan ujian, bantuan rekan kerja, dan kemudahan lokasi tempat tinggal.',
    items: [
      {
        symbol: '手伝ってくれたおかげで',
        reading: 'tetsudatte kureta okage de',
        meaning: 'Berkat bantuan (yang kamu/dia berikan)',
        mnemonic: 'Kombinasi emas: [Nama]さんが～てくれたおかげで untuk memuji kontribusi rekan.',
        speakText: '田中さんが手伝ってくれたおかげで、間に合いました',
      },
      {
        symbol: '間に合いました',
        reading: 'maniaimashita',
        meaning: 'Sempat / tepat waktu',
        mnemonic: '間に合う (maniau) berarti berhasil mengejar jadwal, kereta, atau tenggat waktu.',
        speakText: '間に合いました',
      },
      {
        symbol: '通勤がとても楽です',
        reading: 'tsuukin ga totemo raku desu',
        meaning: 'Perjalanan ke kantor sangat nyaman/ringan',
        mnemonic: '楽 (raku = mudah/nyaman tanpa lelah) adalah kata sifat-な.',
        speakText: '駅から近いおかげで、通勤がとても楽です',
      },
      {
        symbol: '試験に合格しました',
        reading: 'shiken ni goukaku shimashita',
        meaning: 'Saya lulus ujian',
        mnemonic: 'Perhatikan partikel untuk 合格する selalu に (試験に合格する), bukan を.',
        speakText: 'おかげさまで、試験に合格しました',
      },
    ],
    contrastiveTip:
      'Jika ingin meletakkan "berkat..." di akhir kalimat sebagai predikat, ubah で menjadi だ/です (例: 合格できたのは先生のおかげです).',
  },

  // =========================================================================
  // JLPT N3 — UNIT 4: Akibat & Kendala (～せいで) (GP-JA-N3-004)
  // =========================================================================
  'n3-u4-kosakata': {
    headline: 'Kenali Kosakata Kendala Transportasi & Cuaca',
    subtitle:
      'Pelajari kosakata gangguan jaringan, kebisingan konstruksi, dan masalah teknis sebelum melatih pola ～せいで.',
    items: [
      {
        symbol: '障害が発生する',
        reading: 'shougai ga hassei suru',
        meaning: 'Terjadi gangguan (sistem/jaringan)',
        mnemonic: 'Istilah IT dan perkantoran saat jaringan internet atau server mengalami error.',
        speakText: '社内のネットワークに障害が発生しました',
      },
      {
        symbol: '工事の騒音',
        reading: 'kouji no souon',
        meaning: 'Suara bising proyek konstruksi',
        mnemonic: '騒音 (souon) artinya polusi suara atau kebisingan yang mengganggu tidur/kerja.',
        speakText: '夜中に外で工事の騒音がひどかったです',
      },
      {
        symbol: '通信が不安定',
        reading: 'tsuushin ga fuantei',
        meaning: 'Koneksi/komunikasi tidak stabil',
        mnemonic: '不安定 (tidak stabil) adalah kata sifat-な, kebalikan dari 安定 (stabil).',
        speakText: '通信が不安定だったせいで、添付ファイルが止まってしまいました',
      },
      {
        symbol: 'システムの不具合',
        reading: 'shisutemu no fuguai',
        meaning: 'Malfungsi / bug pada sistem',
        mnemonic: '不具合 (fuguai) adalah kata sopan dan teknis untuk kerusakan atau error.',
        speakText: 'システムの不具合のせいで、画面が開けなくなってしまいました',
      },
    ],
    contrastiveTip:
      'Bedakan 障害 (gangguan sistem/layanan berskala luas) dengan 不具合 (malfungsi/ketidakberesan teknis pada fitur atau perangkat).',
  },
  'n3-u4-pola-utama': {
    headline: 'Kuasai Pola ～せいで & ～せいか',
    subtitle:
      'Kebalikan dari ～おかげで, pola ～せいで ("gara-gara / akibat...") dipakai khusus untuk penyebab hasil NEGATIF, dan ～せいか berarti "mungkin karena...".',
    items: [
      {
        symbol: '遅れたせいで',
        reading: 'okureta sei de',
        meaning: 'Gara-gara terlambat',
        mnemonic: 'Kata Kerja bentuk biasa + せいで. Contoh: 電車が遅れたせいで、遅刻しました.',
        speakText: '電車が遅れたせいで、遅刻してしまいました',
      },
      {
        symbol: '運動不足のせいで',
        reading: 'undou busoku no sei de',
        meaning: 'Akibat kurang olahraga',
        mnemonic: 'Kata Benda + の + せいで (sama persis dengan aturan sambungan おかげで).',
        speakText: '運動不足のせいで、体重が増えました',
      },
      {
        symbol: '不安定だったせいで',
        reading: 'fuantei datta sei de',
        meaning: 'Akibat sebelumnya tidak stabil',
        mnemonic: 'Kata Sifat-な bentuk lampau (だった) langsung disambung せいで.',
        speakText: '通信が不安定だったせいで、途中で止まってしまいました',
      },
      {
        symbol: '疲れていたせいか',
        reading: 'tsukarete ita sei ka',
        meaning: 'Mungkin karena kelelahan...',
        mnemonic: 'Tambahkan か (せいか) jika kamu tidak 100% yakin dan hanya menduga penyebabnya.',
        speakText: '疲れていたせいか、すぐ眠ってしまいました',
      },
    ],
    contrastiveTip:
      'Hati-hati nuansa sosial: hindari memakai あなたのせいで ("gara-gara kamu!") di tempat kerja karena terdengar menyalahkan secara keras. Gunakan untuk faktor eksternal atau refleksi diri.',
  },
  'n3-u4-dengar-baca': {
    headline: 'Simak & Baca Masalah Sehari-hari di Jepang',
    subtitle:
      'Perhatikan penyebab dan akibat negatif dalam cerita sakit tenggorokan, kenaikan harga, dan kendala wawancara daring.',
    items: [
      {
        symbol: 'つけたまま寝てしまった',
        reading: 'tsuketa mama nete shimatta',
        meaning: 'Ketiduran dalam kondisi (AC) tetap menyala',
        mnemonic: '～たまま berarti "dibiarkan dalam kondisi tersebut" (AC tidak dimatikan).',
        speakText: 'エアコンをつけたまま寝てしまったせいで、喉が痛いです',
      },
      {
        symbol: '物価が上がった',
        reading: 'bukka ga agatta',
        meaning: 'Harga barang kebutuhan naik (inflasi)',
        mnemonic: '物価 (bukka = harga komoditas/biaya hidup) sering muncul di berita N3.',
        speakText: '最近物価が上がったせいで、毎月の食費が増えました',
      },
      {
        symbol: '食費',
        reading: 'shokuhi',
        meaning: 'Biaya makan bulanan',
        mnemonic: 'Akhiran 費 (hi = biaya): 食費 (biaya makan), 交通費 (biaya transportasi).',
        speakText: '毎月の食費',
      },
      {
        symbol: 'オンライン面接',
        reading: 'onrain mensetsu',
        meaning: 'Wawancara kerja daring (online)',
        mnemonic: '面接 (mensetsu = wawancara), sering menjadi konteks kendala teknis jaringan.',
        speakText: 'オンライン面接の画面が開けなくなってしまいました',
      },
    ],
    contrastiveTip:
      'Bentuk ～せいで sangat sering dipasangkan dengan ～てしまいました di akhir kalimat untuk menegaskan rasa menyesal atau kecewa.',
  },
  'n3-u4-bicara-rakit': {
    headline: 'Latih Melaporkan Kendala dengan ～せいで',
    subtitle:
      'Susun kalimat laporan keterlambatan, kenaikan berat badan, dan dugaan penyebab rasa kantuk secara tepat.',
    items: [
      {
        symbol: '遅刻してしまいました',
        reading: 'chikoku shite shimaimashita',
        meaning: 'Saya jadi terlambat (menyesal)',
        mnemonic: 'Gabungkan alasan (電車が遅れたせいで) + akibat menyesal (遅刻してしまいました).',
        speakText: '電車が遅れたせいで、遅刻してしまいました',
      },
      {
        symbol: '体重が増えました',
        reading: 'taijuu ga fuemashita',
        meaning: 'Berat badan bertambah',
        mnemonic: '増える (fueru = bertambah, intransitif) memakai partikel が.',
        speakText: '運動不足のせいで、体重が増えました',
      },
      {
        symbol: 'すぐ眠ってしまいました',
        reading: 'sugu nemutte shimaimashita',
        meaning: 'Langsung tertidur pulas tanpa sadar',
        mnemonic: '眠る (nemuru = tertidur) -> bentuk-て 眠って.',
        speakText: '疲れていたせいか、すぐ眠ってしまいました',
      },
      {
        symbol: '運動不足',
        reading: 'undou busoku',
        meaning: 'Kurang olahraga',
        mnemonic: 'Akhiran 不足 (busoku = kekurangan): 睡眠不足 (kurang tidur), 運動不足 (kurang olahraga).',
        speakText: '運動不足',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～せいで (penyebab sudah pasti) dengan ～せいか (dugaan penyebab yang belum pasti, artinya "entah karena / mungkin karena").',
  },

  // =========================================================================
  // JLPT N3 — UNIT 5: Sikap & Perbandingan (～に対して) (GP-JA-N3-005)
  // =========================================================================
  'n3-u5-kosakata': {
    headline: 'Kenali Kosakata Layanan Pelanggan & Sikap',
    subtitle:
      'Kuasai kosakata kualitas produk, masukan pelanggan, dan sikap profesional sebelum mempelajari pola ～に対して.',
    items: [
      {
        symbol: '心がける',
        reading: 'kokorogakeru',
        meaning: 'Selalu memperhatikan / menanamkan dalam pikiran',
        mnemonic: 'Sering dipakai dalam pedoman pelayanan: 笑顔でご案内するよう心がけてください.',
        speakText: 'わかりやすく笑顔でご案内するよう心がけてください',
      },
      {
        symbol: '商品の品質',
        reading: 'shouhin no hinshitsu',
        meaning: 'Kualitas produk',
        mnemonic: '品質 (hinshitsu = mutu/kualitas), kata kunci dunia bisnis dan manufaktur Jepang.',
        speakText: '商品の品質には満足という声が多いです',
      },
      {
        symbol: '改善策',
        reading: 'kaizensaku',
        meaning: 'Langkah / rencana perbaikan',
        mnemonic: '改善 (kaizen = perbaikan berkelanjutan) + 策 (saku = strategi/langkah).',
        speakText: '社内で改善策を話し合う予定です',
      },
      {
        symbol: 'ご意見',
        reading: 'go-iken',
        meaning: 'Pendapat / masukan (sopan)',
        mnemonic: 'Tambahkan ご untuk menghormati masukan dari pelanggan atau atasan.',
        speakText: 'お客様からのご意見に対して話し合います',
      },
    ],
    contrastiveTip:
      'Perhatikan: 意見 (iken) memakai awalan hormat ご (ご意見), bukan お.',
  },
  'n3-u5-pola-utama': {
    headline: 'Kuasai Pola ～に対して & ～に対する',
    subtitle:
      'Pola ～に対して punya 2 fungsi penting di JLPT N3: menyatakan sasaran sikap ("terhadap...") dan perbandingan kontras ("sedangkan / sebaliknya...").',
    items: [
      {
        symbol: 'ミスに対して',
        reading: 'misu ni taishite',
        meaning: 'Terhadap kesalahan',
        mnemonic: 'Fungsi 1 (Sikap): Kata Benda + に対して (sikap/tindakan yang diarahkan kepada objek).',
        speakText: '部長は新人のミスに対して原因を一緒に考えてくれます',
      },
      {
        symbol: '企画に対するご支援',
        reading: 'kikaku ni taisuru go-shien',
        meaning: 'Dukungan terhadap proyek/rencana',
        mnemonic: 'Jika langsung menerangkan KATA BENDA di belakangnya, ubah に対して menjadi に対する.',
        speakText: '弊社の企画に対するご支援、ありがとうございます',
      },
      {
        symbol: '便利なに対して',
        reading: 'benri na no ni taishite',
        meaning: 'Sedangkan (di sisi lain) ... nyaman',
        mnemonic: 'Fungsi 2 (Kontras): [Kalimat A bentuk biasa + の] + に対して + [Kalimat B berlawanan].',
        speakText: '都心は交通が便利なに対して、郊外は自然が豊かです',
      },
      {
        symbol: '多いのに対して',
        reading: 'ooi no ni taishite',
        meaning: 'Sedangkan ... banyak (berbanding terbalik)',
        mnemonic: 'Membandingkan dua hal kontras seperti divisi sales yang sering di luar vs divisi IT di kantor.',
        speakText: '営業部は外出が多いのに対して、開発部は社内で作業をしています',
      },
    ],
    contrastiveTip:
      'Jangan keliru memilih に対して vs に対する: jika di belakangnya kata kerja (考える, 話す, 持つ), pakai に対して; jika di belakangnya kata benda (ご支援, 意見, 態度), pakai に対する.',
  },
  'n3-u5-dengar-baca': {
    headline: 'Simak & Baca Perbandingan & Tanggapan Bisnis',
    subtitle:
      'Kenali kontras gaya kerja antardivisi, perbedaan pusat kota vs pinggiran, dan cara atasan menanggapi kesalahan staf baru.',
    items: [
      {
        symbol: '都心と郊外',
        reading: 'toshin to kougai',
        meaning: 'Pusat kota dan daerah pinggiran',
        mnemonic: 'Pasangan kata kontras favorit soal perbandingan JLPT N3.',
        speakText: '都心は交通が便利で、郊外は家賃が安いです',
      },
      {
        symbol: '厳しく叱る',
        reading: 'kibishiku shikaru',
        meaning: 'Memarahi dengan keras',
        mnemonic: '叱る (shikaru = menegur/memarahi demi kebaikan, biasanya oleh atasan/orang tua).',
        speakText: '厳しく叱るのではなく、原因を一緒に考えてくれます',
      },
      {
        symbol: '営業部と開発部',
        reading: 'eigyoubu to kaihatsubu',
        meaning: 'Divisi penjualan (sales) dan divisi pengembangan',
        mnemonic: 'Kosakata struktur organisasi perusahaan yang wajib dikenal untuk kerja di Jepang.',
        speakText: '営業部は外出が多いのに対して、開発部は社内でパソコン作業をしています',
      },
      {
        symbol: '自然が豊か',
        reading: 'shizen ga yutaka',
        meaning: 'Kaya akan alam / alamnya asri',
        mnemonic: '豊か (yutaka = kaya/melimpah) adalah kata sifat-な.',
        speakText: '郊外は家賃が安くて自然が豊かです',
      },
    ],
    contrastiveTip:
      'Pada fungsi perbandingan, jangan lupa menyelipkan の sebelum に対して jika di depannya klausa (例: 外出が多いのに対して, 都会がにぎやかなのに対して).',
  },
  'n3-u5-bicara-rakit': {
    headline: 'Latih Mengungkapkan Sikap Profesional',
    subtitle:
      'Ucapkan apresiasi bisnis dengan に対する, perbandingan kota vs desa, serta komitmen tanggung jawab terhadap pekerjaan.',
    items: [
      {
        symbol: '弊社',
        reading: 'heisha',
        meaning: 'Perusahaan kami (bahasa bisnis rendah hati)',
        mnemonic: 'Dipakai saat berbicara kepada klien atau mitra luar untuk menyebut perusahaan sendiri.',
        speakText: '弊社の企画に対するご支援、ありがとうございます',
      },
      {
        symbol: '仕事に対して責任を持つ',
        reading: 'shigoto ni taishite sekinin o motsu',
        meaning: 'Memiliki tanggung jawab terhadap pekerjaan',
        mnemonic: 'Kalimat kuat untuk wawancara kerja dan evaluasi kinerja di Jepang.',
        speakText: '自分の仕事に対して責任を持っています',
      },
      {
        symbol: 'にぎやかなのに対して',
        reading: 'nigiyaka na no ni taishite',
        meaning: 'Sedangkan (kota) ramai, sebaliknya...',
        mnemonic: 'Kata sifat-な sebelum のに対して wajib memakai な (にぎやかなのに対して).',
        speakText: '都会がにぎやかなのに対して、その村は静かです',
      },
      {
        symbol: 'ご支援',
        reading: 'go-shien',
        meaning: 'Dukungan / bantuan (formal)',
        mnemonic: 'Lebih formal daripada 応援 (dukungan semangat), dipakai untuk dukungan bisnis atau proyek.',
        speakText: 'ご支援、ありがとうございます',
      },
    ],
    contrastiveTip:
      'Bedakan に対して (sikap/tindakan terarah ke suatu objek, atau kontras dua hal) dengan について ("mengenai/tentang" topik pembicaraan).',
  },

  // =========================================================================
  // JLPT N3 — UNIT 6: Mumpung & Selagi (～うちに) (GP-JA-N3-006)
  // =========================================================================
  'n3-u6-kosakata': {
    headline: 'Kenali Kosakata Waktu, Kesempatan & Perubahan',
    subtitle:
      'Pelajari kosakata memanfaatkan waktu luang, kunjungan daerah, dan menguasai etika bisnis sebelum mempelajari pola ～うちに.',
    items: [
      {
        symbol: '済ませる',
        reading: 'sumaseru',
        meaning: 'Menyelesaikan / membereskan (urusan)',
        mnemonic: 'Contoh: 買い物を済ませる (membereskan belanjaan sebelum toko ramai).',
        speakText: '空いている昼間のうちに買い物を済ませたほうがいいですよ',
      },
      {
        symbol: '訪れる',
        reading: 'otozureru',
        meaning: 'Mengunjungi (tempat/daerah)',
        mnemonic: 'Lebih halus dan bernuansa sastra/resmi daripada 行く.',
        speakText: 'できるだけ多くの地方を訪れておきたいと思っています',
      },
      {
        symbol: '身につける',
        reading: 'mi ni tsukeru',
        meaning: 'Menguasai / menyerap (keahlian, etika)',
        mnemonic: 'Idiom wajib N3: secara harfiah "menempelkan ke tubuh", artinya keahlian benar-benar dikuasai.',
        speakText: '敬語やビジネスマナーをしっかり身につけておきたいですね',
      },
      {
        symbol: '時間が経つ',
        reading: 'jikan ga tatsu',
        meaning: 'Waktu berlalu',
        mnemonic: '経つ (tatsu = berlalu) selalu dipakai untuk jalannya waktu.',
        speakText: '時間が経つと落ちにくくなります',
      },
    ],
    contrastiveTip:
      'Bedakan 間に (aida ni = rentang waktu biasa) dengan うちに (uchi ni = mumpung kondisi masih bagus sebelum berubah menjadi terlambat).',
  },
  'n3-u6-pola-utama': {
    headline: 'Kuasai Pola ～うちに (Mumpung & Tanpa Disadari)',
    subtitle:
      'Pola ～うちに memiliki dua makna utama: "mumpung/selagi belum berubah" dan "tanpa disadari saat sedang melakukan sesuatu".',
    items: [
      {
        symbol: '温かいうちに',
        reading: 'atatakai uchi ni',
        meaning: 'Mumpung masih hangat',
        mnemonic: 'Kata Sifat-い langsung disambung うちに (sebelum makanan menjadi dingin).',
        speakText: '温かいうちに食べましょう',
      },
      {
        symbol: '降らないうちに',
        reading: 'furanai uchi ni',
        meaning: 'Mumpung belum turun (salju/hujan)',
        mnemonic: 'Bentuk-ない + うちに sangat sering dipakai untuk arti "sebelum ... terjadi".',
        speakText: '雪が降らないうちに帰ったほうがいいです',
      },
      {
        symbol: '見ているうちに',
        reading: 'mite iru uchi ni',
        meaning: 'Sambil terus menonton, lama-lama...',
        mnemonic: 'Fungsi 2: ～ている + うちに diikuti perubahan alami tanpa disengaja (わかるようになった).',
        speakText: '日本のドラマを毎日見ているうちに、自然な会話表現がわかるようになりました',
      },
      {
        symbol: '昼間のうちに',
        reading: 'hiruma no uchi ni',
        meaning: 'Selagi masih siang hari',
        mnemonic: 'Kata Benda + の + うちに. Contoh lain: 今のうちに (mumpung sekarang).',
        speakText: '空いている昼間のうちに買い物を済ませましょう',
      },
    ],
    contrastiveTip:
      'Perhatikan sambungannya: Kata Benda + のうちに, Kata Sifat-な + なうちに, Kata Sifat-い / Kata Kerja (kamus, ている, ない) + うちに.',
  },
  'n3-u6-dengar-baca': {
    headline: 'Simak & Baca Cara Memanfaatkan Momen',
    subtitle:
      'Tangkap contoh praktis mencuci noda sebelum dingin, ketiduran di kereta, dan target belajar selama tinggal di Jepang.',
    items: [
      {
        symbol: '冷めないうちに',
        reading: 'samenai uchi ni',
        meaning: 'Selagi belum dingin',
        mnemonic: '冷める (sameru = menjadi dingin untuk makanan/minuman) + ないうちに.',
        speakText: '油汚れは冷めないうちに洗ってしまいます',
      },
      {
        symbol: '乗り過ごしてしまいました',
        reading: 'norisugoshite shimaimashita',
        meaning: 'Kebablasan melewati stasiun tujuan',
        mnemonic: '乗り過ごす (norisugosu) adalah kejadian klasik saat ketiduran di kereta Jepang.',
        speakText: '本を読んでいるうちに眠くなって、降りる駅を乗り過ごしてしまいました',
      },
      {
        symbol: '油汚れ',
        reading: 'abura yogore',
        meaning: 'Noda minyak',
        mnemonic: '油 (minyak) + 汚れ (kotoran/noda). Lebih mudah dibersihkan sebelum dingin.',
        speakText: '油汚れは時間が経つと落ちにくくなります',
      },
      {
        symbol: '日本にいるうちに',
        reading: 'nihon ni iru uchi ni',
        meaning: 'Mumpung masih berada di Jepang',
        mnemonic: 'Ungkapan yang memotivasi untuk memaksimalkan pengalaman selama masa tinggal di Jepang.',
        speakText: '日本にいるうちに、敬語をしっかり身につけておきたいですね',
      },
    ],
    contrastiveTip:
      'Pada makna "tanpa disadari" (～ているうちに), klausa belakangnya harus berupa perubahan non-kehendak (眠くなった, わかった, 暗くなった), bukan aksi sengaja.',
  },
  'n3-u6-bicara-rakit': {
    headline: 'Latih Menyusun Kalimat Kesempatan & Perubahan',
    subtitle:
      'Ucapkan ajakan makan selagi hangat, saran pulang sebelum salju turun, dan pengalaman rasa gugup yang mencair saat mengobrol.',
    items: [
      {
        symbol: '緊張がほぐれました',
        reading: 'kinchou ga hoguremashita',
        meaning: 'Rasa tegang/gugupnya mencair',
        mnemonic: 'ほぐれる (hogureru = mengendur/mencair) adalah kolokasi alami untuk 緊張 (ketegangan).',
        speakText: '話しているうちに緊張がほぐれました',
      },
      {
        symbol: '話しているうちに',
        reading: 'hanashite iru uchi ni',
        meaning: 'Sambil mengobrol, tanpa terasa...',
        mnemonic: 'Menjelaskan perubahan suasana hati yang terjadi secara alami selama percakapan.',
        speakText: '話しているうちに',
      },
      {
        symbol: '食べましょう',
        reading: 'tabemashou',
        meaning: 'Ayo kita makan',
        mnemonic: 'Sangat natural dipasangkan dengan 温かいうちに (mumpung masih hangat).',
        speakText: '温かいうちに食べましょう',
      },
      {
        symbol: '帰ったほうがいいです',
        reading: 'kaetta hou ga ii desu',
        meaning: 'Sebaiknya pulang',
        mnemonic: 'Dipasangkan dengan 雪が降らないうちに untuk mengingatkan sebelum cuaca memburuk.',
        speakText: '雪が降らないうちに帰ったほうがいいです',
      },
    ],
    contrastiveTip:
      'Ingat: ～ないうちに (sebelum ...) selalu memakai bentuk negatif ない, tetapi artinya dalam bahasa Indonesia justru positif "sebelum terjadi" (降らないうちに = sebelum turun salju).',
  },

  // =========================================================================
  // JLPT N3 — UNIT 7: Dugaan Logis (～はずだ) (GP-JA-N3-007)
  // =========================================================================
  'n3-u7-kosakata': {
    headline: 'Kenali Kosakata Verifikasi, Jadwal & Pengiriman',
    subtitle:
      'Pelajari kosakata pengiriman ekspres, stok barang, dan hari libur toko sebelum mempelajari pola dugaan logis ～はずだ.',
    items: [
      {
        symbol: '速達',
        reading: 'sokutatsu',
        meaning: 'Pengiriman kilat / ekspres (pos)',
        mnemonic: 'Layanan pos Jepang agar dokumen sampai lebih cepat ke pihak penerima (先方).',
        speakText: '昨日の夕方に速達で送りました',
      },
      {
        symbol: '問い合わせる',
        reading: 'toiawaseru',
        meaning: 'Menghubungi untuk menanyakan / konfirmasi',
        mnemonic: 'Dipakai saat menelepon toko atau kantor untuk mengecek ketersediaan stok atau status.',
        speakText: 'さっき電話で問い合わせたばかりです',
      },
      {
        symbol: '在庫',
        reading: 'zaiko',
        meaning: 'Stok / persediaan barang',
        mnemonic: '在庫がある (stok tersedia) vs 在庫切れ (stok habis).',
        speakText: 'まだ在庫があるはずです',
      },
      {
        symbol: '定休日',
        reading: 'teikyuubi',
        meaning: 'Hari libur rutin (toko/restoran)',
        mnemonic: 'Setiap toko di Jepang biasanya mencantumkan 定休日 tetap, misalnya setiap Selasa.',
        speakText: '火曜日が定休日です',
      },
    ],
    contrastiveTip:
      'Bedakan 届く (todoku = barang sampai/diterima, intransitif) dengan 届ける (todokeru = mengantarkan barang, transitif).',
  },
  'n3-u7-pola-utama': {
    headline: 'Kuasai Pola ～はずだ & ～はずがない',
    subtitle:
      'Gunakan ～はずだ ("seharusnya / pasti berdasarkan bukti logis") dan ～はずがない ("tidak mungkin...") saat menyimpulkan dari fakta yang jelas.',
    items: [
      {
        symbol: '在庫があるはずです',
        reading: 'zaiko ga aru hazu desu',
        meaning: 'Seharusnya stoknya masih ada',
        mnemonic: 'Kata Kerja bentuk biasa + はずです. Keyakinan tinggi karena baru saja dicek lewat telepon.',
        speakText: 'さっき電話で問い合わせたばかりなので、まだ在庫があるはずです',
      },
      {
        symbol: '満席になるはずです',
        reading: 'manseki ni naru hazu desu',
        meaning: 'Seharusnya / pasti akan penuh (kursi)',
        mnemonic: '満席 (manseki = kursi penuh). Dugaan logis karena pendaftar melebihi 200 orang.',
        speakText: '事前申し込みが二百人を超えていたので、会場は満席になるはずです',
      },
      {
        symbol: '閉まっているはずがありません',
        reading: 'shimatte iru hazu ga arimasen',
        meaning: 'Tidak mungkin sedang tutup',
        mnemonic: '～はずがない / ～はずがありません menyangkal keras berdasarkan bukti (hari ini bukan hari libur).',
        speakText: '今日の水曜日に閉まっているはずがありませんよ',
      },
      {
        symbol: '入れたはずなのに',
        reading: 'ireta hazu na noni',
        meaning: 'Padahal seharusnya sudah saya masukkan...',
        mnemonic: '～はずなのに dipakai saat kenyataan bertolak belakang dengan ingatan atau perhitungan kita.',
        speakText: '確かにかばんのポケットに入れたはずなのに、見つかりません',
      },
    ],
    contrastiveTip:
      'Bedakan ～はずだ (dugaan logis berdasarkan bukti/jadwal) dengan ～べきだ (kewajiban moral/saran keras). Jangan pakai ～はずだ untuk menebak tanpa dasar!',
  },
  'n3-u7-dengar-baca': {
    headline: 'Simak & Baca Dugaan vs Kenyataan Berbeda',
    subtitle:
      'Latih membedakan kesimpulan logis (～はずだ), sangkalan tegas (～はずがない), dan kekecewaan tak terduga (～はずなのに).',
    items: [
      {
        symbol: '確かに',
        reading: 'tashika ni',
        meaning: 'Memang benar / seingat saya pasti...',
        mnemonic: 'Sering mengawali kalimat ～はずなのに saat merasa yakin sudah menyimpan sesuatu.',
        speakText: '確かにかばんのポケットに入れたはずです',
      },
      {
        symbol: '事前申し込み',
        reading: 'jizen moushikomi',
        meaning: 'Pendaftaran di muka / pra-registrasi',
        mnemonic: '事前 (sebelumnya) + 申し込み (pendaftaran). Istilah umum untuk seminar dan acara di Jepang.',
        speakText: '事前申し込みが二百人を超えていました',
      },
      {
        symbol: '予約カレンダーを確認したところ',
        reading: 'yoyaku karendaa o kakunin shita tokoro',
        meaning: 'Ketika saya cek kalender reservasi, ternyata...',
        mnemonic: '～たところ menjelaskan hasil temuan setelah melakukan pengecekan.',
        speakText: '予約カレンダーを確認したところ、誰も使っていませんでした',
      },
      {
        symbol: 'どこを探しても見つかりません',
        reading: 'doko o sagashite mo mitsukarimasen',
        meaning: 'Dicari ke mana pun tidak ketemu',
        mnemonic: 'Kata tanya + ても + negatif berarti "meskipun ... pun tidak".',
        speakText: 'どこを探しても見つかりません',
      },
    ],
    contrastiveTip:
      'Perhatikan sambungan ～はずだ untuk Kata Benda dan Kata Sifat-な: wajib pakai の / な (例: 明日が休みの はずだ, 便利なはずだ).',
  },
  'n3-u7-bicara-rakit': {
    headline: 'Latih Menyampaikan Pernyataan Logis & Verifikasi',
    subtitle:
      'Ucapkan perkiraan tiba kereta, keyakinan akurasi data, dan keheranan saat file yang sudah disimpan hilang.',
    items: [
      {
        symbol: '五分後に着くはずです',
        reading: 'gofungo ni tsuku hazu desu',
        meaning: 'Seharusnya tiba lima menit lagi',
        mnemonic: 'Dugaan logis berdasarkan jadwal kereta (時刻表) yang sangat tepat waktu di Jepang.',
        speakText: '次の電車は五分後に着くはずです',
      },
      {
        symbol: '間違いがあるはずがありません',
        reading: 'machigai ga aru hazu ga arimasen',
        meaning: 'Tidak mungkin ada kesalahan',
        mnemonic: 'Keyakinan penuh karena data sudah diverifikasi berkali-kali.',
        speakText: 'このデータに間違いがあるはずがありません',
      },
      {
        symbol: '保存したはずなのに',
        reading: 'hozon shita hazu na noni',
        meaning: 'Padahal seharusnya sudah saya simpan...',
        mnemonic: '保存する (hozon suru = menyimpan file di komputer).',
        speakText: '保存したはずなのに、ファイルが消えています',
      },
      {
        symbol: 'ファイルが消えています',
        reading: 'fairu ga kiete imasu',
        meaning: 'Filenya hilang / terhapus',
        mnemonic: '消える (kieru = menghilang/padam, intransitif) + ている untuk kondisi hasil sekarang.',
        speakText: 'ファイルが消えています',
      },
    ],
    contrastiveTip:
      'Jangan pakai ～はずがありません untuk kejadian yang sekadar tidak kamu inginkan; pola ini hanya untuk hal yang secara logika MUSTAHIL terjadi.',
  },

  // =========================================================================
  // JLPT N3 — UNIT 8: Bentuk Pasif (～られる) (GP-JA-N3-008)
  // =========================================================================
  'n3-u8-kosakata': {
    headline: 'Kenali Kosakata Berita, Evaluasi & Pengalaman',
    subtitle:
      'Pelajari kosakata bangunan bersejarah, pengumuman rapat, dan kejadian tak menyenangkan sebelum masuk ke kalimat pasif.',
    items: [
      {
        symbol: '建てられる',
        reading: 'taterareru',
        meaning: 'Dibangun (gedung/kastil)',
        mnemonic: 'Bentuk pasif dari 建てる (membangun), sangat sering muncul di berita dan teks wisata.',
        speakText: 'このお城はおよそ四百年前に建てられました',
      },
      {
        symbol: '親しまれている',
        reading: 'shitashimarete iru',
        meaning: 'Dicintai / akrab di hati (masyarakat)',
        mnemonic: '親しむ (akrab) dalam bentuk pasif ～られている menyatakan kondisi yang dicintai banyak orang.',
        speakText: '今でも多くの観光客に親しまれています',
      },
      {
        symbol: 'びしょ濡れ',
        reading: 'bishonure',
        meaning: 'Basah kuyup',
        mnemonic: 'Sering muncul bersama pasif penderitaan 雨に降られる (kehujanan).',
        speakText: '急に雨に降られて、新しい靴がびしょ濡れになってしまいました',
      },
      {
        symbol: '承認される',
        reading: 'shounin sareru',
        meaning: 'Disetujui (secara resmi)',
        mnemonic: '承認する (menyetujui proposal/anggaran) -> pasif 承認される.',
        speakText: '企画案が役員会議で承認されました',
      },
    ],
    contrastiveTip:
      'Untuk kata kerja する (kelompok 3), bentuk pasifnya selalu される (例: 発表する -> 発表される, 承認する -> 承認される).',
  },
  'n3-u8-pola-utama': {
    headline: 'Kuasai Pola Pasif Langsung & Pasif Penderitaan',
    subtitle:
      'Bahasa Jepang mengenal pasif langsung (seperti berita/evaluasi) dan pasif penderitaan/meiwaku ketika kamu dirugikan oleh aksi pihak lain atau cuaca.',
    items: [
      {
        symbol: '盗まれてしまいました',
        reading: 'nusumarete shimaimashita',
        meaning: 'Dicuri (saya mengalami kerugian dicuri)',
        mnemonic: 'Kelompok 1: ubah vokal u ke a + れる (盗む nusumu -> 盗まれる nusumareru).',
        speakText: '自転車が誰かに盗まれてしまいました',
      },
      {
        symbol: '雨に降られました',
        reading: 'ame ni furaremashita',
        meaning: 'Saya kehujanan (merasa terganggu)',
        mnemonic: 'Pasif penderitaan bisa memakai kata kerja intransitif (降る -> 降られる) dengan pelaku berpartikel に.',
        speakText: '帰る途中で雨に降られました',
      },
      {
        symbol: '椅子を蹴られて',
        reading: 'isu o kerarete',
        meaning: 'Kursi saya ditendang (sehingga terganggu)',
        mnemonic: 'Pasif pemilik: [Pelaku]に + [Milik saya]を + Pasif. Contoh: 後ろの人に椅子を蹴られた.',
        speakText: '後ろの人に何度も椅子を蹴られて集中できませんでした',
      },
      {
        symbol: '正式に発表されました',
        reading: 'seishiki ni happyou saremashita',
        meaning: 'Diumumkan secara resmi',
        mnemonic: 'Pasif berita/resmi: objek aturan menjadi subjek は/が dan tidak perlu menyebut siapa pelakunya.',
        speakText: '新しい勤務ルールは正式に発表されました',
      },
    ],
    contrastiveTip:
      'Jangan tertukar bentuk pasif dan potensial pada kata kerja kelompok 2 (keduanya memakai ～られる)! Bedakan lewat partikel pelaku に (pasif: 先生に褒められた) vs objek が (potensial).',
  },
  'n3-u8-dengar-baca': {
    headline: 'Simak & Baca Kalimat Pasif di Berita & Kantor',
    subtitle:
      'Tangkap inti informasi dalam pengumuman kebijakan perusahaan, persetujuan rapat direksi, dan keluhan di bioskop.',
    items: [
      {
        symbol: '全社ミーティング',
        reading: 'zensha miitingu',
        meaning: 'Rapat seluruh perusahaan',
        mnemonic: '全社 (seluruh perusahaan) + ミーティング (meeting).',
        speakText: '昨日の全社ミーティングで正式に発表されました',
      },
      {
        symbol: '企画案',
        reading: 'kikakuan',
        meaning: 'Draf proposal / rancangan proyek',
        mnemonic: '企画 (perencanaan/proyek) + 案 (draf/usulan).',
        speakText: '先月提出した企画案が役員会議で承認されました',
      },
      {
        symbol: '実行に移される',
        reading: 'jikkou ni utsusareru',
        meaning: 'Mulai dilaksanakan / dieksekusi',
        mnemonic: 'Idiom bisnis N3: 実行に移す (melaksanakan rencana) dalam bentuk pasif.',
        speakText: '来月から実行に移されます',
      },
      {
        symbol: '集中できませんでした',
        reading: 'shuuchuu dekimasen deshita',
        meaning: 'Tidak bisa berkonsentrasi',
        mnemonic: '集中する (berkonsentrasi) sering menjadi akibat dari pasif penderitaan.',
        speakText: '何度も椅子を蹴られて集中できませんでした',
      },
    ],
    contrastiveTip:
      'Pada pasif yang menjelaskan karya cipta atau penemuan besar (buku, gedung, teori), penanda pelakunya memakai によって, bukan sekadar に.',
  },
  'n3-u8-bicara-rakit': {
    headline: 'Latih Menceritakan Pengalaman dengan Kalimat Pasif',
    subtitle:
      'Ucapkan dan rangkai kalimat saat diminta tolong senior, kehujanan di jalan pulang, dan jadwal rapat tahunan.',
    items: [
      {
        symbol: '仕事を頼まれました',
        reading: 'shigoto o tanomaremashita',
        meaning: 'Saya diminta mengerjakan tugas (oleh senior)',
        mnemonic: '頼む (meminta tolong) -> 頼まれる (dimintai tolong). Pemberi tugas ditandai に.',
        speakText: '先輩に仕事を頼まれました',
      },
      {
        symbol: '帰る途中で',
        reading: 'kaeru tochuu de',
        meaning: 'Di tengah perjalanan pulang',
        mnemonic: '途中 (tochuu = di tengah jalan/proses) sangat sering muncul dengan kejadian tak terduga.',
        speakText: '帰る途中で雨に降られました',
      },
      {
        symbol: '毎年三月に開催されます',
        reading: 'maitoshi sangatsu ni kaisai saremasu',
        meaning: 'Diselenggarakan setiap bulan Maret',
        mnemonic: '開催する (menyelenggarakan acara/rapat besar) -> pasif 開催される.',
        speakText: '年次会議は毎年三月に開催されます',
      },
      {
        symbol: '年次会議',
        reading: 'nenji kaigi',
        meaning: 'Rapat tahunan',
        mnemonic: '年次 (nenji = tahunan) + 会議 (rapat).',
        speakText: '年次会議',
      },
    ],
    contrastiveTip:
      'Saat ingin menceritakan pengalaman dirugikan atau mendapat permintaan secara netral dari sudut pandang dirimu sebagai subjek ("Saya..."), bentuk pasif jauh lebih natural dalam bahasa Jepang daripada kalimat aktif.',
  },

  // =========================================================================
  // JLPT N3 — UNIT 9: Baru Saja (～たばかり) (GP-JA-N3-009)
  // =========================================================================
  'n3-u9-kosakata': {
    headline: 'Kenali Kosakata Pindah, Masuk Kerja & Adaptasi',
    subtitle:
      'Pelajari kosakata pindahan apartemen, penempatan divisi baru, dan istilah kerja sebelum melatih pola ～たばかり.',
    items: [
      {
        symbol: '段ボール',
        reading: 'danbooru',
        meaning: 'Kardus (pindahan)',
        mnemonic: 'Benda identik saat baru pindah rumah (引っ越し) di Jepang.',
        speakText: '部屋にはまだ開けていない段ボールがたくさん残っています',
      },
      {
        symbol: '配属される',
        reading: 'haizoku sareru',
        meaning: 'Ditempatkan (di suatu divisi/cabang)',
        mnemonic: 'Tahap setelah masa orientasi karyawan baru di perusahaan Jepang.',
        speakText: '配属されて間もないので、手続きを覚えるのに苦労しています',
      },
      {
        symbol: '専門用語',
        reading: 'senmon yougo',
        meaning: 'Istilah teknis / kosakata khusus bidang',
        mnemonic: '専門 (spesialisasi) + 用語 (istilah). Tantangan utama pekerja baru di Jepang.',
        speakText: '社内の専門用語',
      },
      {
        symbol: '苦労する',
        reading: 'kurou suru',
        meaning: 'Mengalami kesulitan / bersusah payah',
        mnemonic: 'Dipakai untuk proses adaptasi di lingkungan atau pekerjaan baru.',
        speakText: '手続きの流れを覚えるのに苦労しています',
      },
    ],
    contrastiveTip:
      'Bedakan 引っ越す (pindah rumah secara umum) dengan 引っ越してくる (pindah datang ke tempat tinggal yang sekarang ini).',
  },
  'n3-u9-pola-utama': {
    headline: 'Kuasai Pola ～たばかり & ～たばかりの',
    subtitle:
      'Gunakan ～たばかり ("baru saja...") untuk menekankan perasaan pembicara bahwa waktu berlalu masih sangat singkat — entah 5 menit lalu atau bulan lalu.',
    items: [
      {
        symbol: '飲んだばかりなんです',
        reading: 'nonda bakari nan desu',
        meaning: 'Saya baru saja minum (kopi)',
        mnemonic: 'Rumus: Kata Kerja bentuk-た + ばかりだ. Cocok untuk menolak tawaran minum secara sopan.',
        speakText: 'すみません、さっき食堂でコーヒーを飲んだばかりなんです',
      },
      {
        symbol: '取ったばかりなので',
        reading: 'totta bakari na node',
        meaning: 'Karena baru saja mendapatkan (SIM)',
        mnemonic: 'PERHATIKAN: ばかり berperilaku seperti Kata Sifat-な, jadi sebelum ので wajib memakai な!',
        speakText: '先月運転免許を取ったばかりなので、まだ高速道路を走るのは怖いです',
      },
      {
        symbol: '買ったばかりのスマホ',
        reading: 'katta bakari no sumaho',
        meaning: 'Ponsel yang baru saja dibeli',
        mnemonic: 'Jika menerangkan KATA BENDA di belakangnya, sambungkan dengan の (～たばかりの + KB).',
        speakText: '先週買ったばかりのスマホを落としてしまいました',
      },
      {
        symbol: '始まったばかりですが',
        reading: 'hajimatta bakari desu ga',
        meaning: 'Meskipun baru saja dimulai...',
        mnemonic: 'Bisa dipakai untuk proyek yang baru berjalan beberapa hari atau minggu.',
        speakText: 'このプロジェクトはまだ始まったばかりですが、雰囲気はとてもいいです',
      },
    ],
    contrastiveTip:
      'Bedakan ～たばかり (subjektif: boleh untuk bulan lalu atau tahun lalu asal terasa "masih baru") dengan ～たところだ (objektif: benar-benar baru detik/menit ini selesai).',
  },
  'n3-u9-dengar-baca': {
    headline: 'Simak & Baca Pengalaman Awal di Jepang',
    subtitle:
      'Tangkap cerita baru dapat SIM, layar ponsel retak padahal baru beli, dan suasana tim di awal proyek baru.',
    items: [
      {
        symbol: '高速道路',
        reading: 'kousoku douro',
        meaning: 'Jalan tol / jalan bebas hambatan',
        mnemonic: '高速 (kecepatan tinggi) + 道路 (jalan raya).',
        speakText: 'まだ高速道路を走るのは怖いです',
      },
      {
        symbol: '画面にひびが入る',
        reading: 'gamen ni hibi ga hairu',
        meaning: 'Layar menjadi retak',
        mnemonic: 'Idiom alami: "retak" memakai kata kerja 入る (ひびが入る).',
        speakText: 'スマホを落として、画面にひびが入ってしまいました',
      },
      {
        symbol: '雰囲気',
        reading: 'fun-iki',
        meaning: 'Suasana / atmosfer (lingkungan kerja/tim)',
        mnemonic: 'Perhatikan bacaannya yang sering keliru: dibaca fun-iki, BUKAN fuin-ki.',
        speakText: 'チームの雰囲気はとてもいいです',
      },
      {
        symbol: 'たった今',
        reading: 'tatta ima',
        meaning: 'Baru saja barusan ini (detik ini)',
        mnemonic: 'Penguat waktu yang sangat cocok dipasangkan dengan ～たばかり.',
        speakText: '会議はたった今終わったばかりです',
      },
    ],
    contrastiveTip:
      'Ingat cara menyambung ～たばかり ke kata lain: di depan ので/のに pakai な (取ったばかりなので), sedangkan di depan kata benda pakai の (買ったばかりのスマホ).',
  },
  'n3-u9-bicara-rakit': {
    headline: 'Latih Menceritakan Kisah Awal Baru',
    subtitle:
      'Rangkai dan ucapkan kalimat tentang baru pindah lingkungan, rapat yang barusan selesai, dan baru mulai belajar bahasa Jepang.',
    items: [
      {
        symbol: '引っ越したばかりなので',
        reading: 'hikkoshita bakari na node',
        meaning: 'Karena baru saja pindah rumah',
        mnemonic: 'Alasan sopan saat belum hafal jalan atau toko di lingkungan sekitar (近所).',
        speakText: '引っ越したばかりなので、近所のことがわかりません',
      },
      {
        symbol: '近所',
        reading: 'kinjo',
        meaning: 'Lingkungan sekitar rumah / tetangga dekat',
        mnemonic: 'Contoh: 近所のスーパー (supermarket di sekitar rumah).',
        speakText: '近所のことがわかりません',
      },
      {
        symbol: 'たった今終わったばかりです',
        reading: 'tatta ima owatta bakari desu',
        meaning: 'Benar-benar baru saja selesai barusan',
        mnemonic: 'Berguna saat melaporkan status rapat atau tugas yang baru tuntas.',
        speakText: '会議はたった今終わったばかりです',
      },
      {
        symbol: '勉強を始めたばかりです',
        reading: 'benkyou o hajimeta bakari desu',
        meaning: 'Baru saja mulai belajar',
        mnemonic: 'Meski 去年 (tahun lalu), tetap sah memakai ～たばかり jika pembicara merasa dirinya masih pemula.',
        speakText: '去年日本語の勉強を始めたばかりです',
      },
    ],
    contrastiveTip:
      'Jangan pernah menggunakan bentuk kamus atau bentuk-て sebelum ばかり untuk arti "baru saja". Selalu wajib bentuk lampau-た (終わったばかり, 始めたばかり).',
  },

  // =========================================================================
  // JLPT N3 — UNIT 10: Ragam & Penyebab (～によって) (GP-JA-N3-010)
  // =========================================================================
  'n3-u10-kosakata': {
    headline: 'Kenali Kosakata Budaya, Metode & Kesiapan N3',
    subtitle:
      'Pelajari kosakata penginapan tradisional, bahan musiman, dan produktivitas kerja sebelum menuntaskan pola serbaguna ～によって.',
    items: [
      {
        symbol: '旬の食材',
        reading: 'shun no shokuzai',
        meaning: 'Bahan makanan musiman terbaik',
        mnemonic: '旬 (shun) adalah puncak musim panen bahan makanan yang paling segar dan lezat di Jepang.',
        speakText: '季節ごとに旬の食材を使った特別な料理が用意されています',
      },
      {
        symbol: '自治体',
        reading: 'jichitai',
        meaning: 'Pemerintah daerah (kota/distrik)',
        mnemonic: 'Di Jepang, aturan pemilahan sampah berbeda-beda tergantung 自治体 tempat tinggalmu.',
        speakText: '日本では自治体によってゴミの分別ルールが異なります',
      },
      {
        symbol: 'テレワークの導入',
        reading: 'terewaaku no dounyuu',
        meaning: 'Penerapan kerja jarak jauh (remote work)',
        mnemonic: '導入 (dounyuu = pengenalan/implementasi sistem atau kebijakan baru).',
        speakText: 'テレワークの導入によって、生産性が向上しました',
      },
      {
        symbol: '生産性が向上する',
        reading: 'seisansei ga koujou suru',
        meaning: 'Produktivitas meningkat',
        mnemonic: '向上 (koujou = peningkatan mutu/kemampuan), kata kunci artikel bisnis N3.',
        speakText: '生産性が向上しました',
      },
    ],
    contrastiveTip:
      'Bedakan 違う (chigau = berbeda, umum/lisan) dengan 異なる (kotonaru = berbeda, lebih formal dan sering dipakai di teks berita/aturan bersama ～によって).',
  },
  'n3-u10-pola-utama': {
    headline: 'Kuasai Pola ～によって & ～による',
    subtitle:
      'Pola ～によって adalah salah satu tata bahasa tersering di JLPT N3: bisa berarti "tergantung pada...", "melalui cara/metode...", atau "disebabkan oleh...".',
    items: [
      {
        symbol: '季節や曜日によって',
        reading: 'kisetsu ya youbi ni yotte',
        meaning: 'Tergantung pada musim dan hari',
        mnemonic: 'Makna 1 (Keragaman): Kata Benda + によって + 変わる / 違う / 異なる.',
        speakText: 'このホテルの宿泊料金は、季節や曜日によって大きく変わります',
      },
      {
        symbol: '話し合いによって',
        reading: 'hanashiai ni yotte',
        meaning: 'Melalui diskusi / musyawarah',
        mnemonic: 'Makna 2 (Cara/Metode): menjelaskan sarana atau proses hingga tercapainya solusi.',
        speakText: '話し合いによって問題が解決しました',
      },
      {
        symbol: '導入によって',
        reading: 'dounyuu ni yotte',
        meaning: 'Berkat / disebabkan oleh penerapan...',
        mnemonic: 'Makna 3 (Penyebab/Faktor pemicu): sering muncul di berita ekonomi dan laporan kerja.',
        speakText: 'テレワークの導入によって、社員の通勤時間が減りました',
      },
      {
        symbol: '投票による決定',
        reading: 'touhyou ni yoru kettei',
        meaning: 'Keputusan melalui pemungutan suara',
        mnemonic: 'Jika langsung menerangkan KATA BENDA di belakangnya, ubah によって menjadi による.',
        speakText: '審査員の評価と一般の方々による投票で決定されます',
      },
    ],
    contrastiveTip:
      'Ingat variasi bentuknya: によって (sebelum kata kerja/predikat), による (sebelum kata benda), dan によっては ("tergantung kasusnya, ada kalanya...").',
  },
  'n3-u10-dengar-baca': {
    headline: 'Simak & Baca Perbedaan Budaya & Fakta Resmi',
    subtitle:
      'Latih membedakan nuansa によって (perbedaan aturan daerah, hasil voting juri, dan dampak kebijakan kerja) dalam teks formal.',
    items: [
      {
        symbol: '宿泊料金',
        reading: 'shukuhaku ryoukin',
        meaning: 'Tarif menginap (hotel/ryokan)',
        mnemonic: '宿泊 (menginap) + 料金 (biaya/tarif). Di Jepang tarif naik saat akhir pekan dan musim liburan.',
        speakText: '宿泊料金は季節や曜日によって大きく変わります',
      },
      {
        symbol: '最優秀作品',
        reading: 'saiyuushuu sakuhin',
        meaning: 'Karya terbaik / pemenang utama',
        mnemonic: '最 (paling) + 優秀 (unggul) + 作品 (karya).',
        speakText: '最優秀作品は投票で決定されます',
      },
      {
        symbol: '審査員の評価',
        reading: 'shinsain no hyouka',
        meaning: 'Penilaian dari dewan juri',
        mnemonic: '評価 (hyouka = evaluasi/penilaian), juga dipakai untuk penilaian kinerja karyawan.',
        speakText: '審査員の評価と投票で決定されます',
      },
      {
        symbol: '異なる',
        reading: 'kotonaru',
        meaning: 'Berbeda (formal/tertulis)',
        mnemonic: 'Pasangan klasik dari ～によって dalam pengumuman resmi dan soal bacaan N3.',
        speakText: '自治体によってゴミの分別ルールが異なります',
      },
    ],
    contrastiveTip:
      'Jangan tertukar によって ("tergantung / melalui / oleh") dengan によると ("menurut sumber informasi...", yang selalu diikuti ～そうだ atau ～という).',
  },
  'n3-u10-bicara-rakit': {
    headline: 'Latih Menyusun Analisis & Ungkapan Siap JLPT N3',
    subtitle:
      'Ucapkan dan rangkai tiga penggunaan utama ～によって: perbedaan sudut pandang, penyelesaian masalah, dan kemungkinan perubahan rencana.',
    items: [
      {
        symbol: '人によって考え方が違います',
        reading: 'hito ni yotte kangaekata ga chigaimasu',
        meaning: 'Cara berpikir berbeda-beda tergantung orangnya',
        mnemonic: 'Kalimat super berguna saat berdiskusi agar menghargai perbedaan pendapat.',
        speakText: '人によって考え方が違います',
      },
      {
        symbol: '問題が解決しました',
        reading: 'mondai ga kaiketsu shimashita',
        meaning: 'Masalahnya telah terselesaikan',
        mnemonic: '解決する (kaiketsu suru = terselesaikan/menyelesaikan masalah).',
        speakText: '話し合いによって問題が解決しました',
      },
      {
        symbol: '場合によっては',
        reading: 'baai ni yotte wa',
        meaning: 'Tergantung situasinya, bisa jadi...',
        mnemonic: 'Frasa tetap N3 yang sangat sering diucapkan di kantor saat jadwal masih fleksibel.',
        speakText: '場合によっては予定が変わることもあります',
      },
      {
        symbol: '変わることもあります',
        reading: 'kawaru koto mo arimasu',
        meaning: 'Ada kalanya juga berubah',
        mnemonic: 'Pola ～こともある ("kadang-kadang / ada kemungkinan") adalah pasangan alami dari 場合によっては.',
        speakText: '予定が変わることもあります',
      },
    ],
    contrastiveTip:
      'Tambahkan は pada ～によっては (contoh: 場合によっては, 人によっては) ketika ingin menyatakan "untuk kasus tertentu saja, ada kemungkinan terjadi...".',
  },
}

export const NODE_PREVIEWS_N4_N3: Record<string, LevelNodePreviewInfo> = {
  // =========================================================================
  // JLPT N4 — 50 Lesson Node Previews
  // =========================================================================
  // Unit 1: Permohonan Sangat Sopan di Kantor (GP-JA-N4-001)
  'n4-u1-kosakata': {
    chips: ['資料・書類', '受付・確認', 'Kosakata Kantor'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-001',
  },
  'n4-u1-pola-utama': {
    chips: ['～ていただけませんか', 'Permohonan Sopan', 'Etika Kantor'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-001',
  },
  'n4-u1-dengar-baca': {
    chips: ['恐れ入りますが', 'ご記入いただけませんか', 'Situasi Kantor'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-001',
  },
  'n4-u1-bicara-rakit': {
    chips: ['チェックしていただけませんか', '貸していただけませんか', 'Bicara & Rakit'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-001',
  },
  'n4-u1-tes-akhir': {
    chips: ['Evaluasi Unit 1', '～ていただけませんか', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-001',
  },

  // Unit 2: Keadaan Hasil Aksi Disengaja (GP-JA-N4-002)
  'n4-u2-kosakata': {
    chips: ['倉庫・引き出し', '貼る・並べる', 'Kosakata Ruang'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-002',
  },
  'n4-u2-pola-utama': {
    chips: ['～てあります', 'Keadaan Hasil Aksi', 'Partikel が'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-002',
  },
  'n4-u2-dengar-baca': {
    chips: ['予約してあります', '全員分・出張', 'Persiapan Ruang'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-002',
  },
  'n4-u2-bicara-rakit': {
    chips: ['飾ってあります', '置いてあります', 'Laporan Kondisi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-002',
  },
  'n4-u2-tes-akhir': {
    chips: ['Evaluasi Unit 2', '～てあります', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-002',
  },

  // Unit 3: Bentuk Keharusan & Aturan Kerja (GP-JA-N4-003)
  'n4-u3-kosakata': {
    chips: ['遅刻・必ず', '健康保険証', 'Aturan & Jadwal'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-003',
  },
  'n4-u3-pola-utama': {
    chips: ['～なければなりません', 'Bentuk Keharusan', 'Konjugasi ない'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-003',
  },
  'n4-u3-dengar-baca': {
    chips: ['作業中・市役所', '先に失礼します', 'Prosedur Kerja'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-003',
  },
  'n4-u3-bicara-rakit': {
    chips: ['電源を切らなければ', '作業靴を履く', 'Kewajiban Tim'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-003',
  },
  'n4-u3-tes-akhir': {
    chips: ['Evaluasi Unit 3', '～なければなりません', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-003',
  },

  // Unit 4: Bentuk Potensial: Kemampuan & Fasilitas (GP-JA-N4-004)
  'n4-u4-kosakata': {
    chips: ['操作・無料', '話せます・使えます', 'Keahlian Kerja'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-004',
  },
  'n4-u4-pola-utama': {
    chips: ['～られる / ～える', 'Bentuk Potensial', 'Kemampuan & Izin'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-004',
  },
  'n4-u4-dengar-baca': {
    chips: ['大浴場・免許', 'お金がおろせます', 'Kemampuan & Layanan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-004',
  },
  'n4-u4-bicara-rakit': {
    chips: ['料理が作れます', 'ICカードが使えますか', 'Unjuk Keahlian'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-004',
  },
  'n4-u4-tes-akhir': {
    chips: ['Evaluasi Unit 4', 'Bentuk Potensial', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-004',
  },

  // Unit 5: Memberi & Menerima Bantuan (GP-JA-N4-005)
  'n4-u5-kosakata': {
    chips: ['引っ越し・運ぶ', '案内・手伝う', 'Kerja Sama Tim'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-005',
  },
  'n4-u5-pola-utama': {
    chips: ['～てあげる', '～てくれる', '～てもらう'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-005',
  },
  'n4-u5-dengar-baca': {
    chips: ['作ってくれました', '教えてもらいました', 'Bantuan Rekan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-005',
  },
  'n4-u5-bicara-rakit': {
    chips: ['翻訳してもらいました', '送ってくれました', 'Saling Membantu'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-005',
  },
  'n4-u5-tes-akhir': {
    chips: ['Evaluasi Unit 5', 'Memberi & Menerima', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-005',
  },

  // Unit 6: Saran Sebaiknya: Kesehatan & Harian (GP-JA-N4-006)
  'n4-u6-kosakata': {
    chips: ['お腹が痛い', '一日に三回', 'Kosakata Klinik'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-006',
  },
  'n4-u6-pola-utama': {
    chips: ['～たほうがいい', '～ないほうがいい', 'Pola Saran'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-006',
  },
  'n4-u6-dengar-baca': {
    chips: ['激しい運動', '道路が混みます', 'Saran Dokter'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-006',
  },
  'n4-u6-bicara-rakit': {
    chips: ['持って行ったほうがいい', 'メモに書いたほうがいい', 'Beri Nasihat'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-006',
  },
  'n4-u6-tes-akhir': {
    chips: ['Evaluasi Unit 6', '～たほうがいい', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-006',
  },

  // Unit 7: Menyatakan Alasan Halus & Izin Sopan (GP-JA-N4-007)
  'n4-u7-kosakata': {
    chips: ['熱がある・運休', '家族の用事', 'Izin & Jadwal'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-007',
  },
  'n4-u7-pola-utama': {
    chips: ['～ので', 'Alasan Halus', 'な + ので'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-007',
  },
  'n4-u7-dengar-baca': {
    chips: ['棚卸し作業', '閉店いたします', 'Alasan Sopan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-007',
  },
  'n4-u7-bicara-rakit': {
    chips: ['初めてなので', '聞こえにくいので', 'Minta Izin'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-007',
  },
  'n4-u7-tes-akhir': {
    chips: ['Evaluasi Unit 7', 'Alasan Halus ので', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-007',
  },

  // Unit 8: Syarat & Pengandaian (～たら) (GP-JA-N4-008)
  'n4-u8-kosakata': {
    chips: ['天気がよかったら', '掃除が終わったら', 'Cuaca & Rencana'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-008',
  },
  'n4-u8-pola-utama': {
    chips: ['～たら', 'Syarat & Setelah', 'Bentuk-た + ら'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-008',
  },
  'n4-u8-dengar-baca': {
    chips: ['赤いランプがついたら', '特定技能試験', 'Prosedur & Cuaca'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-008',
  },
  'n4-u8-bicara-rakit': {
    chips: ['五時になったら', '間違いがあったら', 'Jika & Setelah'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-008',
  },
  'n4-u8-tes-akhir': {
    chips: ['Evaluasi Unit 8', 'Syarat ～たら', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-008',
  },

  // Unit 9: Persiapan Sebelumnya (～ておく) (GP-JA-N4-009)
  'n4-u9-kosakata': {
    chips: ['乗り換え時間', '用意・充電する', 'Persiapan Kerja'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-009',
  },
  'n4-u9-pola-utama': {
    chips: ['～ておく', 'Persiapan Awal', 'そのままにしておく'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-009',
  },
  'n4-u9-dengar-baca': {
    chips: ['きれいにしておいて', '帰国・お土産', 'Rencana Matang'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-009',
  },
  'n4-u9-bicara-rakit': {
    chips: ['メモに書いておきます', '今夜のうちに', 'Siapkan Dulu'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-009',
  },
  'n4-u9-tes-akhir': {
    chips: ['Evaluasi Unit 9', 'Persiapan ～ておく', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-009',
  },

  // Unit 10: Kenjougo Dasar & Kesiapan JLPT N4 (GP-JA-N4-010)
  'n4-u10-kosakata': {
    chips: ['まいります・申します', '伺います', 'Etika Bisnis'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-010',
  },
  'n4-u10-pola-utama': {
    chips: ['お～いたします', 'ご～いたします', 'Kenjougo Dasar'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-010',
  },
  'n4-u10-dengar-baca': {
    chips: ['申し訳ございません', '席を外しております', 'Menyambut Tamu'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-010',
  },
  'n4-u10-bicara-rakit': {
    chips: ['お送りいたします', '頂戴いたします', 'Bahasa Hormat'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-010',
  },
  'n4-u10-tes-akhir': {
    chips: ['Ujian Siap JLPT N4', 'Kenjougo & Review', 'Tantangan Akhir N4'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-010',
  },

  // =========================================================================
  // JLPT N3 — 50 Lesson Node Previews
  // =========================================================================
  // Unit 1: Membiasakan Diri (～ようにする) (GP-JA-N3-001)
  'n3-u1-kosakata': {
    chips: ['目標を立てる', '健康診断・控える', 'Kosakata Rutinitas'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-001',
  },
  'n3-u1-pola-utama': {
    chips: ['～ようにする', '～ようにしている', 'Membiasakan Diri'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-001',
  },
  'n3-u1-dengar-baca': {
    chips: ['塩分・ゴミを減らす', '早めに質問', 'Gaya Hidup Jepang'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-001',
  },
  'n3-u1-bicara-rakit': {
    chips: ['飲むようにしています', '忘れないように', 'Bicara Kebiasaan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-001',
  },
  'n3-u1-tes-akhir': {
    chips: ['Evaluasi Unit 1', '～ようにする', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-001',
  },

  // Unit 2: Keputusan Resmi (～ことになる) (GP-JA-N3-002)
  'n3-u2-kosakata': {
    chips: ['本社・担当する', '社内研修・業務', 'Kosakata Kantor'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-002',
  },
  'n3-u2-pola-utama': {
    chips: ['～ことになる', '～ことになっている', 'Keputusan & Aturan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-002',
  },
  'n3-u2-dengar-baca': {
    chips: ['有給休暇', '先方の都合により', 'Prosedur & Jadwal'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-002',
  },
  'n3-u2-bicara-rakit': {
    chips: ['結婚することになりました', '担当することになりました', 'Bicara Pengumuman'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-002',
  },
  'n3-u2-tes-akhir': {
    chips: ['Evaluasi Unit 2', '～ことになる', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-002',
  },

  // Unit 3: Berkat Dukungan (～おかげで) (GP-JA-N3-003)
  'n3-u3-kosakata': {
    chips: ['同僚・期限', '完成させる・分別', 'Kosakata Pencapaian'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-003',
  },
  'n3-u3-pola-utama': {
    chips: ['～おかげで', '～おかげだ', 'おかげさまで'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-003',
  },
  'n3-u3-dengar-baca': {
    chips: ['電車の遅延', '無事に終える', 'Simak Apresiasi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-003',
  },
  'n3-u3-bicara-rakit': {
    chips: ['手伝ってくれたおかげで', '間に合いました', 'Bicara Syukur'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-003',
  },
  'n3-u3-tes-akhir': {
    chips: ['Evaluasi Unit 3', '～おかげで', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-003',
  },

  // Unit 4: Akibat & Kendala (～せいで) (GP-JA-N3-004)
  'n3-u4-kosakata': {
    chips: ['障害が発生', '騒音・不具合', 'Kosakata Kendala'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-004',
  },
  'n3-u4-pola-utama': {
    chips: ['～せいで', '～せいか', 'Penyebab Negatif'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-004',
  },
  'n3-u4-dengar-baca': {
    chips: ['つけたまま寝た', '物価が上がった', 'Simak Kendala'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-004',
  },
  'n3-u4-bicara-rakit': {
    chips: ['遅れたせいで', '運動不足のせいで', 'Bicara Kendala'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-004',
  },
  'n3-u4-tes-akhir': {
    chips: ['Evaluasi Unit 4', '～せいで', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-004',
  },

  // Unit 5: Sikap & Perbandingan (～に対して) (GP-JA-N3-005)
  'n3-u5-kosakata': {
    chips: ['心がける・品質', '改善策・ご意見', 'Kosakata Layanan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-005',
  },
  'n3-u5-pola-utama': {
    chips: ['～に対して', '～に対する', 'Sikap & Kontras'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-005',
  },
  'n3-u5-dengar-baca': {
    chips: ['都心と郊外', '営業部と開発部', 'Simak Perbandingan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-005',
  },
  'n3-u5-bicara-rakit': {
    chips: ['弊社・ご支援', '仕事に対して責任', 'Bicara Profesional'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-005',
  },
  'n3-u5-tes-akhir': {
    chips: ['Evaluasi Unit 5', '～に対して', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-005',
  },

  // Unit 6: Mumpung & Selagi (～うちに) (GP-JA-N3-006)
  'n3-u6-kosakata': {
    chips: ['済ませる・訪れる', '身につける', 'Kosakata Waktu'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-006',
  },
  'n3-u6-pola-utama': {
    chips: ['～うちに', '～ないうちに', 'Mumpung & Alami'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-006',
  },
  'n3-u6-dengar-baca': {
    chips: ['冷めないうちに', '乗り過ごす', 'Simak Momen'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-006',
  },
  'n3-u6-bicara-rakit': {
    chips: ['温かいうちに', '緊張がほぐれた', 'Bicara Kesempatan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-006',
  },
  'n3-u6-tes-akhir': {
    chips: ['Evaluasi Unit 6', '～うちに', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-006',
  },

  // Unit 7: Dugaan Logis (～はずだ) (GP-JA-N3-007)
  'n3-u7-kosakata': {
    chips: ['速達・問い合わせる', '在庫・定休日', 'Kosakata Verifikasi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-007',
  },
  'n3-u7-pola-utama': {
    chips: ['～はずだ', '～はずがない', '～はずなのに'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-007',
  },
  'n3-u7-dengar-baca': {
    chips: ['確かに・事前申し込み', '予約カレンダー', 'Simak Verifikasi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-007',
  },
  'n3-u7-bicara-rakit': {
    chips: ['五分後に着くはず', '間違いがあるはずがない', 'Bicara Logis'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-007',
  },
  'n3-u7-tes-akhir': {
    chips: ['Evaluasi Unit 7', '～はずだ', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-007',
  },

  // Unit 8: Bentuk Pasif (～られる) (GP-JA-N3-008)
  'n3-u8-kosakata': {
    chips: ['建てられる・親しまれる', 'びしょ濡れ・承認', 'Kosakata Berita'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-008',
  },
  'n3-u8-pola-utama': {
    chips: ['～られる / ～される', 'Pasif Langsung', 'Pasif Penderitaan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-008',
  },
  'n3-u8-dengar-baca': {
    chips: ['全社ミーティング', '企画案・実行に移す', 'Simak Pasif'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-008',
  },
  'n3-u8-bicara-rakit': {
    chips: ['仕事を頼まれました', '雨に降られました', 'Bicara Pasif'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-008',
  },
  'n3-u8-tes-akhir': {
    chips: ['Evaluasi Unit 8', 'Bentuk Pasif', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-008',
  },

  // Unit 9: Baru Saja (～たばかり) (GP-JA-N3-009)
  'n3-u9-kosakata': {
    chips: ['段ボール・配属', '専門用語・苦労', 'Kosakata Adaptasi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-009',
  },
  'n3-u9-pola-utama': {
    chips: ['～たばかり', '～たばかりの', 'Baru Saja'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-009',
  },
  'n3-u9-dengar-baca': {
    chips: ['高速道路・ひび', '雰囲気・たった今', 'Simak Pengalaman'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-009',
  },
  'n3-u9-bicara-rakit': {
    chips: ['引っ越したばかり', '終わったばかり', 'Bicara Awal Baru'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-009',
  },
  'n3-u9-tes-akhir': {
    chips: ['Evaluasi Unit 9', '～たばかり', '4 Pilar Keterampilan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-009',
  },

  // Unit 10: Ragam & Penyebab (～によって) (GP-JA-N3-010)
  'n3-u10-kosakata': {
    chips: ['旬の食材・自治体', 'テレワーク導入', 'Kosakata Budaya'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-010',
  },
  'n3-u10-pola-utama': {
    chips: ['～によって', '～による', '～によっては'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-010',
  },
  'n3-u10-dengar-baca': {
    chips: ['宿泊料金・異なる', '最優秀作品・評価', 'Simak Fakta'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-010',
  },
  'n3-u10-bicara-rakit': {
    chips: ['人によって違う', '場合によっては', 'Bicara Analisis'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-010',
  },
  'n3-u10-tes-akhir': {
    chips: ['Ujian Siap JLPT N3', '～によって & Review', 'Tantangan Akhir N3'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-010',
  },
}
