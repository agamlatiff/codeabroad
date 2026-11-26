import type { LessonIntroDeck } from './lessonIntroCards'
import type { LevelNodePreviewInfo } from './lessonIntroN4N3'

export const LESSON_INTRO_DECKS_N4_N1_EXPANSION: Record<string, LessonIntroDeck> = {
  // =========================================================================
  // JLPT N4 EXPANSION — 20 DECKS (baca-konteks & praktik-terpadu, U1..U10)
  // =========================================================================

  // Unit 1: GP-JA-N4-001 (～ていただけませんか)
  'n4-u1-baca-konteks': {
    headline: 'Baca Konteks: Memo Kantor & Email Permintaan Sopan',
    subtitle:
      'Pahami bagaimana pola ～ていただけませんか dipakai dalam email internal, catatan meja resepsionis, dan pengumuman operasional kantor Jepang.',
    items: [
      {
        symbol: '添付ファイルをご確認いただけませんか',
        reading: 'tenpu fairu o go-kakunin itadakemasen ka',
        meaning: 'Bersediakah Anda memeriksa berkas lampiran ini?',
        mnemonic: 'Ungkapan standar email kerja Jepang: 添付ファイル (lampiran) + ご確認いただけませんか.',
        speakText: '添付ファイルをご確認いただけませんか',
      },
      {
        symbol: '本日の午後までにお返事いただけませんか',
        reading: 'honjitsu no gogo made ni o-henji itadakemasen ka',
        meaning: 'Bersediakah Anda membalas sebelum siang hari ini?',
        mnemonic: '本日 (honjitsu) lebih sopan dari 今日, sering muncul bersama tenggat までにお返事.',
        speakText: '本日の午後までにお返事いただけませんか',
      },
      {
        symbol: '入口で名前を記入していただけませんか',
        reading: 'iriguchi de namae o kinyuu shite itadakemasen ka',
        meaning: 'Bersediakah Anda menuliskan nama di pintu masuk?',
        mnemonic: '記入する (kinyuu suru) dipakai khusus untuk mengisi formulir atau buku tamu.',
        speakText: '入口で名前を記入していただけませんか',
      },
      {
        symbol: 'もう一度送っていただけませんか',
        reading: 'mou ichido okutte itadakemasen ka',
        meaning: 'Bersediakah Anda mengirimkannya sekali lagi?',
        mnemonic: '送ります berubah menjadi 送って sebelum いただけませんか saat meminta kirim ulang.',
        speakText: 'もう一度送っていただけませんか',
      },
    ],
    contrastiveTip:
      'Dalam email bisnis, ご確認いただけませんか lebih ringkas dan halus dibanding 確認していただけませんか; keduanya benar, tetapi versi ご～ lebih lazim untuk klien.',
  },
  'n4-u1-praktik-terpadu': {
    headline: 'Praktik Terpadu: Meminta Bantuan di Lingkungan Kerja',
    subtitle:
      'Gabungkan sapaan pembuka, alasan singkat, dan permohonan ～ていただけませんか agar permintaanmu terdengar sopan dan jelas di situasi nyata.',
    items: [
      {
        symbol: 'お忙しいところすみませんが',
        reading: 'o-isogashii tokoro sumimasen ga',
        meaning: 'Maaf mengganggu di tengah kesibukan Anda, namun...',
        mnemonic: 'Bantalan pembuka wajib sebelum mengajukan permintaan kepada atasan atau senior.',
        speakText: 'お忙しいところすみませんが',
      },
      {
        symbol: 'コピーを手伝っていただけませんか',
        reading: 'kopii o tetsudatte itadakemasen ka',
        meaning: 'Bersediakah Anda membantu memfotokopi?',
        mnemonic: '手伝います (tetsudaimasu) berkonjugasi menjadi 手伝って (tetsudatte).',
        speakText: 'コピーを手伝っていただけませんか',
      },
      {
        symbol: '日程を変更していただけませんか',
        reading: 'nittei o henkou shite itadakemasen ka',
        meaning: 'Bersediakah Anda mengubah jadwalnya?',
        mnemonic: '日程 (nittei = jadwal agenda) + 変更する (mengubah secara resmi).',
        speakText: '日程を変更していただけませんか',
      },
      {
        symbol: '場所を教えていただけませんか',
        reading: 'basho o oshiete itadakemasen ka',
        meaning: 'Bersediakah Anda memberi tahu lokasinya?',
        mnemonic: 'Cocok saat menanyakan ruang rapat atau lokasi stasiun kepada orang yang baru dikenal.',
        speakText: '場所を教えていただけませんか',
      },
    ],
    contrastiveTip:
      'Hindari memakai ～てください kepada atasan atau tamu karena bernuansa instruksi; gunakan ～ていただけませんか untuk memberi ruang pilihan yang sopan.',
  },

  // Unit 2: GP-JA-N4-002 (～てあります)
  'n4-u2-baca-konteks': {
    headline: 'Baca Konteks: Laporan Persiapan Ruang & Fasilitas',
    subtitle:
      'Kenali penggunaan ～てあります dalam papan informasi, catatan serah terima shift, dan daftar periksa kesiapan ruangan.',
    items: [
      {
        symbol: '名簿が机の上に置いてあります',
        reading: 'meibo ga tsukue no ue ni oite arimasu',
        meaning: 'Daftar nama sudah diletakkan di atas meja',
        mnemonic: 'Objek memakai partikel が (名簿が) karena fokus pada kondisi barang yang sudah siap.',
        speakText: '名簿が机の上に置いてあります',
      },
      {
        symbol: '非常口の案内が貼ってあります',
        reading: 'hijouguchi no annai ga hatte arimasu',
        meaning: 'Petunjuk pintu darurat sudah ditempelkan',
        mnemonic: '貼る (haru) adalah kata kerja transitif, sehingga 貼ってあります menandakan ada petugas yang menempelkannya.',
        speakText: '非常口の案内が貼ってあります',
      },
      {
        symbol: '飲み物が冷蔵庫に冷やしてあります',
        reading: 'nomimono ga reizouko ni hiyashite arimasu',
        meaning: 'Minuman sudah didinginkan di kulkas',
        mnemonic: '冷やす (hiyasu = mendinginkan) menekankan kesiapan untuk tamu yang akan datang.',
        speakText: '飲み物が冷蔵庫に冷やしてあります',
      },
      {
        symbol: '会議室の鍵が開けてあります',
        reading: 'kaigishitsu no kagi ga akete arimasu',
        meaning: 'Kunci ruang rapat sudah dibukakan',
        mnemonic: '開ける (membuka, transitif) + てあります menunjukkan ruangan sengaja dibuka sebelum rapat.',
        speakText: '会議室の鍵が開けてあります',
      },
    ],
    contrastiveTip:
      'Bedakan 窓が開いています (jendela dalam keadaan terbuka secara netral) dengan 窓が開けてあります (jendela sengaja dibuka seseorang untuk tujuan tertentu, misalnya ventilasi).',
  },
  'n4-u2-praktik-terpadu': {
    headline: 'Praktik Terpadu: Melaporkan Kesiapan Tugas',
    subtitle:
      'Latih melaporkan status persiapan acara, dokumen, dan reservasi menggunakan ～てあります agar komunikasi tim lebih akurat.',
    items: [
      {
        symbol: '資料は人数分コピーしてあります',
        reading: 'shiryou wa ninzuubun kopii shite arimasu',
        meaning: 'Dokumen sudah difotokopi sesuai jumlah peserta',
        mnemonic: '人数分 (ninzuubun) berarti porsi atau jumlah sesuai banyaknya orang.',
        speakText: '資料は人数分コピーしてあります',
      },
      {
        symbol: 'ホテルはすでに予約してあります',
        reading: 'hoteru wa sudeni yoyaku shite arimasu',
        meaning: 'Hotelnya sudah dipesan sebelumnya',
        mnemonic: 'すでに (sudeni = sudah) memperkuat bahwa persiapan telah beres sebelum diminta.',
        speakText: 'ホテルはすでに予約してあります',
      },
      {
        symbol: '黒板に予定が書いてあります',
        reading: 'kokuban ni yotei ga kaite arimasu',
        meaning: 'Jadwal sudah tertulis di papan tulis',
        mnemonic: '書いてあります lazim untuk pengumuman, nomor telepon, atau alamat yang tertulis jelas.',
        speakText: '黒板に予定が書いてあります',
      },
      {
        symbol: '椅子がきれいに並べてあります',
        reading: 'isu ga kirei ni narabete arimasu',
        meaning: 'Kursi-kursi sudah ditata dengan rapi',
        mnemonic: '並べる (menata, transitif) dipakai untuk menekankan hasil penataan ruang rapat.',
        speakText: '椅子がきれいに並べてあります',
      },
    ],
    contrastiveTip:
      'Pola ～てあります hanya dipasangkan dengan kata kerja transitif (他動詞). Jangan gabungkan dengan kata kerja intransitif seperti 並ぶ atau 開く.',
  },

  // Unit 3: GP-JA-N4-003 (～なければなりません)
  'n4-u3-baca-konteks': {
    headline: 'Baca Konteks: Buku Panduan & Aturan Keselamatan',
    subtitle:
      'Pelajari cara membaca ketentuan wajib di pabrik, kantor, dan layanan publik Jepang yang memakai ～なければなりません.',
    items: [
      {
        symbol: 'ヘルメットを着用しなければなりません',
        reading: 'herumetto o chakuyou shinakereba narimasen',
        meaning: 'Harus mengenakan helm keselamatan',
        mnemonic: '着用する (chakuyou suru) adalah istilah formal untuk memakai perlengkapan kerja.',
        speakText: 'ヘルメットを着用しなければなりません',
      },
      {
        symbol: '期限までに提出しなければなりません',
        reading: 'kigen made ni teishutsu shinakereba narimasen',
        meaning: 'Harus menyerahkan paling lambat pada tenggat waktu',
        mnemonic: '期限までに (kigen made ni) menandakan batas akhir penyerahan dokumen.',
        speakText: '期限までに提出しなければなりません',
      },
      {
        symbol: '入館証を見せなければなりません',
        reading: 'nyuukanshou o misenakereba narimasen',
        meaning: 'Harus menunjukkan kartu izin masuk gedung',
        mnemonic: '見せます diubah ke bentuk-ない (見せない), lalu い diganti ければなりません.',
        speakText: '入館証を見せなければなりません',
      },
      {
        symbol: 'ゴミを分別しなければなりません',
        reading: 'gomi o bunbetsu shinakereba narimasen',
        meaning: 'Harus memilah sampah sesuai jenisnya',
        mnemonic: '分別 (bunbetsu = pemilahan) adalah aturan harian penting di lingkungan tinggal Jepang.',
        speakText: 'ゴミを分別しなければなりません',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～なければなりません (wajib dilakukan) dengan ～なくてもいいです (tidak perlu dilakukan / tidak apa-apa jika tidak).',
  },
  'n4-u3-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menyatakan Kewajiban & Prosedur',
    subtitle:
      'Rangkai kalimat tentang kewajiban kerja, prosedur administrasi, dan tenggat harian secara tepat sesuai konjugasi bentuk-ない.',
    items: [
      {
        symbol: '朝九時までに出勤しなければなりません',
        reading: 'asa kuji made ni shukkin shinakereba narimasen',
        meaning: 'Harus masuk kerja paling lambat pukul 9 pagi',
        mnemonic: '出勤する (shukkin suru) berarti berangkat dan hadir bekerja di kantor.',
        speakText: '朝九時までに出勤しなければなりません',
      },
      {
        symbol: '退社前に鍵を返さなければなりません',
        reading: 'taisha mae ni kagi o kaesanakereba narimasen',
        meaning: 'Harus mengembalikan kunci sebelum pulang kantor',
        mnemonic: '返します menjadi 返さない lalu 返さなければなりません.',
        speakText: '退社前に鍵を返さなければなりません',
      },
      {
        symbol: '上司に報告しなければなりません',
        reading: 'joushi ni houkoku shinakereba narimasen',
        meaning: 'Harus melapor kepada atasan',
        mnemonic: 'Di budaya kerja Jepang, prinsip Hou-Ren-So diawali dengan 報告 (houkoku = melapor).',
        speakText: '上司に報告しなければなりません',
      },
      {
        symbol: '靴を脱がなければなりません',
        reading: 'kutsu o nuganakereba narimasen',
        meaning: 'Harus melepas sepatu',
        mnemonic: '脱ぎます (nugimasu) berujung ぎ, maka bentuk-ない nya adalah 脱がない (nuganai).',
        speakText: '靴を脱がなければなりません',
      },
    ],
    contrastiveTip:
      'Dalam percakapan lisan yang agak santai, ～なければなりません sering disingkat menjadi ～なきゃ atau ～ないと, tetapi untuk laporan kerja tetap gunakan bentuk penuh.',
  },

  // Unit 4: GP-JA-N4-004 (Bentuk Potensial)
  'n4-u4-baca-konteks': {
    headline: 'Baca Konteks: Brosur Fasilitas & Profil Kemampuan',
    subtitle:
      'Amati pemakaian bentuk potensial pada papan petunjuk fasilitas umum, iklan lowongan kerja, dan brosur layanan di Jepang.',
    items: [
      {
        symbol: 'クレジットカードが使えます',
        reading: 'kurejitto kaado ga tsukaemasu',
        meaning: 'Kartu kredit dapat digunakan',
        mnemonic: '使います (Golongan 1) berubah vokal i menjadi e: 使えます, dengan partikel が.',
        speakText: 'クレジットカードが使えます',
      },
      {
        symbol: 'ここから富士山が見えます',
        reading: 'koko kara Fujisan ga miemasu',
        meaning: 'Dari sini Gunung Fuji terlihat',
        mnemonic: '見えます menyatakan sesuatu tampak secara alami di pandangan mata.',
        speakText: 'ここから富士山が見えます',
      },
      {
        symbol: '二十四時間いつでも利用できます',
        reading: 'nijuuyojikan itsudemo riyou dekimasu',
        meaning: 'Dapat digunakan kapan saja selama 24 jam',
        mnemonic: 'Kata kerja する berubah bentuk potensial menjadi できます.',
        speakText: '二十四時間いつでも利用できます',
      },
      {
        symbol: 'オンラインで予約が取れます',
        reading: 'onrain de yoyaku ga toremasu',
        meaning: 'Reservasi dapat diambil secara daring',
        mnemonic: '取ります menjadi 取れます; sangat umum pada situs klinik, restoran, dan tiket.',
        speakText: 'オンラインで予約が取れます',
      },
    ],
    contrastiveTip:
      'Bedakan 見えます (terlihat secara alami tanpa usaha) dengan 見られます (bisa dilihat/ditonton karena ada kesempatan atau fasilitas, misalnya film atau pameran).',
  },
  'n4-u4-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menjelaskan Keahlian & Akses Layanan',
    subtitle:
      'Latih memaparkan kemampuan diri saat wawancara serta menanyakan fasilitas yang tersedia dengan bentuk potensial yang akurat.',
    items: [
      {
        symbol: '簡単な日本語が話せます',
        reading: 'kantan na Nihongo ga hanasemasu',
        meaning: 'Saya bisa berbicara bahasa Jepang sederhana',
        mnemonic: '話します menjadi 話せます; objek kemampuan lazim ditandai partikel が.',
        speakText: '簡単な日本語が話せます',
      },
      {
        symbol: '自転車を止められますか',
        reading: 'jitensha o tomeraremasu ka',
        meaning: 'Apakah sepeda bisa diparkir di sini?',
        mnemonic: '止めます (Golongan 2) berubah menjadi 止められます saat menyatakan kemungkinan.',
        speakText: '自転車を止められますか',
      },
      {
        symbol: '辛い料理も食べられます',
        reading: 'karai ryouri mo taberaremasu',
        meaning: 'Masakan pedas pun saya bisa makan',
        mnemonic: '食べます menjadi 食べられます; partikel も menggantikan が untuk makna "juga".',
        speakText: '辛い料理も食べられます',
      },
      {
        symbol: '週末に来られますか',
        reading: 'shuumatsu ni koraremasu ka',
        meaning: 'Apakah Anda bisa datang di akhir pekan?',
        mnemonic: 'Bentuk potensial dari 来ます (kimasu) adalah 来られます (koraremasu), bukan きられます.',
        speakText: '週末に来られますか',
      },
    ],
    contrastiveTip:
      'Perhatikan perbedaan dua kata kerja tak beraturan: する menjadi できる, sedangkan 来る (kuru) menjadi 来られる (korareru).',
  },

  // Unit 5: GP-JA-N4-005 (～てあげる・～てくれる・～てもらう)
  'n4-u5-baca-konteks': {
    headline: 'Baca Konteks: Cerita Kerja Sama & Ucapan Terima Kasih',
    subtitle:
      'Pahami arah pemberian bantuan dalam teks cerita, email apresiasi, dan percakapan tim agar tidak tertukar pelaku dan penerima.',
    items: [
      {
        symbol: '先輩が仕事を教えてくれました',
        reading: 'senpai ga shigoto o oshiete kuremashita',
        meaning: 'Senior mengajari saya pekerjaan',
        mnemonic: 'Subjeknya adalah orang lain (先輩が) yang memberi kebaikan kepada saya.',
        speakText: '先輩が仕事を教えてくれました',
      },
      {
        symbol: '同僚に駅まで送ってもらいました',
        reading: 'douryou ni eki made okutte moraimashita',
        meaning: 'Saya diantar ke stasiun oleh rekan kerja',
        mnemonic: 'Subjeknya adalah saya; pemberi bantuan ditandai partikel に (同僚に).',
        speakText: '同僚に駅まで送ってもらいました',
      },
      {
        symbol: '後輩にパソコンの使い方を教えてあげました',
        reading: 'kouhai ni pasokon no tsukaikata o oshiete agemashita',
        meaning: 'Saya mengajari junior cara memakai komputer',
        mnemonic: '～てあげる cocok dipakai kepada junior, teman akrab, atau adik — bukan atasan.',
        speakText: '後輩にパソコンの使い方を教えてあげました',
      },
      {
        symbol: '部長が相談に乗ってくださいました',
        reading: 'buchou ga soudan ni notte kudasaimashita',
        meaning: 'Kepala bagian berkenan mendengarkan konsultasi saya',
        mnemonic: 'くださる adalah bentuk hormat dari くれる saat pemberi bantuan adalah atasan.',
        speakText: '部長が相談に乗ってくださいました',
      },
    ],
    contrastiveTip:
      'Jangan gunakan ～てあげます langsung kepada atasan atau orang yang lebih tua karena terkesan merendahkan; gunakan お手伝いしましょうか atau ～ましょうか.',
  },
  'n4-u5-praktik-terpadu': {
    headline: 'Praktik Terpadu: Mengungkapkan Bantuan & Apresiasi',
    subtitle:
      'Latih memilih sudut pandang subjek yang tepat antara ～てあげる, ～てくれる, dan ～てもらう dalam interaksi sehari-hari.',
    items: [
      {
        symbol: '友達に引っ越しを手伝ってもらいました',
        reading: 'tomodachi ni hikkoshi o tetsudatte moraimashita',
        meaning: 'Saya dibantu pindah rumah oleh teman',
        mnemonic: 'Fokus pada rasa terima kasih penerima (saya) kepada teman yang membantu.',
        speakText: '友達に引っ越しを手伝ってもらいました',
      },
      {
        symbol: '母がお弁当を作ってくれました',
        reading: 'haha ga obentou o tsukutte kuremashita',
        meaning: 'Ibu membuatkan bekal untuk saya',
        mnemonic: 'Karena ibu (subjek) melakukan kebaikan untuk saya, wajib pakai くれました.',
        speakText: '母がお弁当を作ってくれました',
      },
      {
        symbol: '妹に漢字を説明してあげました',
        reading: 'imouto ni kanji o setsumei shite agemashita',
        meaning: 'Saya menjelaskan kanji kepada adik perempuan',
        mnemonic: 'Arah aksi dari saya ke keluarga yang lebih muda, tepat memakai あげました.',
        speakText: '妹に漢字を説明してあげました',
      },
      {
        symbol: '先生に推薦状を書いていただきました',
        reading: 'sensei ni suisenjou o kaite itadakimashita',
        meaning: 'Saya dibuatkan surat rekomendasi oleh guru',
        mnemonic: 'いただく adalah versi sopan/merendah dari もらう saat meminta bantuan guru atau atasan.',
        speakText: '先生に推薦状を書いていただきました',
      },
    ],
    contrastiveTip:
      'Selalu cek siapa subjek kalimatnya: jika pemberi adalah subjek (Orang + が), pakai くれる; jika saya adalah subjek (Saya + は), pakai もらう dengan Orang + に.',
  },

  // Unit 6: GP-JA-N4-006 (～たほうがいい / ～ないほうがいい)
  'n4-u6-baca-konteks': {
    headline: 'Baca Konteks: Nasihat Dokter & Panduan Hidup Sehat',
    subtitle:
      'Pelajari pola saran ～たほうがいい dan larangan halus ～ないほうがいい dalam pamflet kesehatan, tips perjalanan, dan pesan rekan.',
    items: [
      {
        symbol: '早めに病院へ行ったほうがいいです',
        reading: 'hayame ni byouin e itta hou ga ii desu',
        meaning: 'Sebaiknya segera pergi ke rumah sakit',
        mnemonic: 'Untuk saran melakukan sesuatu, selalu gunakan bentuk lampau-た (行った) + ほうがいい.',
        speakText: '早めに病院へ行ったほうがいいです',
      },
      {
        symbol: '無理をしないほうがいいです',
        reading: 'muri o shinai hou ga ii desu',
        meaning: 'Sebaiknya tidak memaksakan diri',
        mnemonic: 'Untuk saran melarang, gunakan bentuk-ない (しない) + ほうがいい.',
        speakText: '無理をしないほうがいいです',
      },
      {
        symbol: '十分に睡眠をとったほうがいいです',
        reading: 'juubun ni suimin o totta hou ga ii desu',
        meaning: 'Sebaiknya tidur dengan cukup',
        mnemonic: '睡眠をとる (suimin o toru) adalah kolokasi alami untuk mendapatkan tidur cukup.',
        speakText: '十分に睡眠をとったほうがいいです',
      },
      {
        symbol: '冷たいものは飲まないほうがいいですよ',
        reading: 'tsumetai mono wa nomanai hou ga ii desu yo',
        meaning: 'Sebaiknya tidak minum minuman dingin, ya',
        mnemonic: 'Partikel よ di akhir membuat nasihat terdengar hangat dan perhatian.',
        speakText: '冷たいものは飲まないほうがいいですよ',
      },
    ],
    contrastiveTip:
      'Jangan pakai bentuk kamus sebelum ほうがいい untuk saran positif (salah: 行くほうがいい); bentuk baku untuk saran aktif adalah bentuk-た (行ったほうがいい).',
  },
  'n4-u6-praktik-terpadu': {
    headline: 'Praktik Terpadu: Memberi Rekomendasi & Peringatan Halus',
    subtitle:
      'Terapkan ～たほうがいい dan ～ないほうがいい secara luwes saat memberi saran persiapan perjalanan, belajar, atau pekerjaan.',
    items: [
      {
        symbol: '傘を持って行ったほうがいいですよ',
        reading: 'kasa o motte itta hou ga ii desu yo',
        meaning: 'Sebaiknya membawa payung, ya',
        mnemonic: '持って行く berubah ke bentuk-た menjadi 持って行った.',
        speakText: '傘を持って行ったほうがいいですよ',
      },
      {
        symbol: '事前に確認したほうがいいと思います',
        reading: 'jizen ni kakunin shita hou ga ii to omoimasu',
        meaning: 'Menurut saya sebaiknya dikonfirmasi terlebih dahulu',
        mnemonic: 'Menambahkan と思います melunakkan saran agar sopan saat berbicara dengan rekan kerja.',
        speakText: '事前に確認したほうがいいと思います',
      },
      {
        symbol: '暗くなってから一人で歩かないほうがいいです',
        reading: 'kuraku natte kara hitori de arukanai hou ga ii desu',
        meaning: 'Sebaiknya tidak berjalan sendirian setelah hari gelap',
        mnemonic: '歩きます menjadi 歩かない sebelum ほうがいい untuk saran keselamatan.',
        speakText: '暗くなってから一人で歩かないほうがいいです',
      },
      {
        symbol: 'パスワードはメモに書いたほうがいいですか',
        reading: 'pasuwaado wa memo ni kaita hou ga ii desu ka',
        meaning: 'Apakah sebaiknya kata sandi ditulis di catatan?',
        mnemonic: 'Tambahkan か di akhir untuk meminta pertimbangan atau saran dari lawan bicara.',
        speakText: 'パスワードはメモに書いたほうがいいですか',
      },
    ],
    contrastiveTip:
      'Pola ～たほうがいい bernuansa cukup tegas; saat berbicara ke atasan, tambahkan と思います atau のではないでしょうか agar tidak terkesan menggurui.',
  },

  // Unit 7: GP-JA-N4-007 (～ので)
  'n4-u7-baca-konteks': {
    headline: 'Baca Konteks: Pengumuman Resmi & Pemberitahuan Layanan',
    subtitle:
      'Cermati bagaimana ～ので dipakai secara objektif dan sopan dalam pengumuman toko, pemberitahuan kereta, dan email izin.',
    items: [
      {
        symbol: '設備点検のため休業いたしますので',
        reading: 'setsubi tenken no tame kyuugyou itashimasu node',
        meaning: 'Karena kami tutup untuk pemeriksaan fasilitas, maka...',
        mnemonic: 'Dalam pengumuman resmi, ～ますので terdengar sangat santun dan profesional.',
        speakText: '設備点検のため休業いたしますので',
      },
      {
        symbol: '道が混んでいたので遅れました',
        reading: 'michi ga konde ita node okuremashita',
        meaning: 'Karena jalanan macet, saya terlambat',
        mnemonic: 'Menyampaikan alasan keterlambatan dengan ので terasa lebih objektif daripada から.',
        speakText: '道が混んでいたので遅れました',
      },
      {
        symbol: '本日は雨天なので中止します',
        reading: 'honjitsu wa uten na node chuushi shimasu',
        meaning: 'Karena hari ini hujan, acara dibatalkan',
        mnemonic: 'Kata benda (雨天) dan kata sifat-な wajib disambung dengan な sebelum ので.',
        speakText: '本日は雨天なので中止します',
      },
      {
        symbol: '席に限りがありますのでご予約ください',
        reading: 'seki ni kagiri ga arimasu node go-yoyaku kudasai',
        meaning: 'Karena tempat duduk terbatas, silakan memesan terlebih dahulu',
        mnemonic: '限りがあります berarti terbatas; sangat sering muncul di poster acara Jepang.',
        speakText: '席に限りがありますのでご予約ください',
      },
    ],
    contrastiveTip:
      'Ingat aturan sambungan ので: Kata Benda dan Kata Sifat-な harus memakai な (静かなので, 雨なので), tidak boleh langsung ditempelkan tanpa な.',
  },
  'n4-u7-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menyampaikan Alasan & Meminta Izin',
    subtitle:
      'Latih merangkai alasan yang sopan dengan ～ので saat meminta izin pulang awal, mengajukan pertanyaan, atau menjelaskan kendala.',
    items: [
      {
        symbol: '体調が悪いので早退してもいいですか',
        reading: 'taichou ga warui node soutai shite mo ii desu ka',
        meaning: 'Karena kondisi badan kurang baik, bolehkah saya pulang lebih awal?',
        mnemonic: 'Kata sifat-い (悪い) langsung diikuti ので tanpa な.',
        speakText: '体調が悪いので早退してもいいですか',
      },
      {
        symbol: 'ここは禁煙なので外で吸ってください',
        reading: 'koko wa kinen na node soto de sutte kudasai',
        meaning: 'Karena di sini area bebas rokok, silakan merokok di luar',
        mnemonic: '禁煙 (kinen) adalah kata benda, sehingga menjadi 禁煙なので.',
        speakText: 'ここは禁煙なので外で吸ってください',
      },
      {
        symbol: 'まだ慣れていないので教えてください',
        reading: 'mada narete inai node oshiete kudasai',
        meaning: 'Karena saya belum terbiasa, mohon bimbingannya',
        mnemonic: 'Bentuk-ない (慣れていない) langsung disambung ので dengan sangat alami.',
        speakText: 'まだ慣れていないので教えてください',
      },
      {
        symbol: '用事があるので先に失礼します',
        reading: 'youji ga aru node saki ni shitsurei shimasu',
        meaning: 'Karena ada urusan, saya permisi pulang duluan',
        mnemonic: 'Kalimat pamit sopan yang sangat lazim diucapkan kepada rekan kantor.',
        speakText: '用事があるので先に失礼します',
      },
    ],
    contrastiveTip:
      'Untuk meminta izin atau menyampaikan alasan pribadi kepada atasan, pilih ～ので alih-alih ～から agar nada bicaramu tetap lembut dan tidak defensif.',
  },

  // Unit 8: GP-JA-N4-008 (～たら)
  'n4-u8-baca-konteks': {
    headline: 'Baca Konteks: Petunjuk Operasional & Skenario Harian',
    subtitle:
      'Pahami dua fungsi utama ～たら dalam panduan mesin, prakiraan cuaca, dan rencana harian: syarat pengandaian serta urutan "setelah".',
    items: [
      {
        symbol: 'ボタンをおしたら切符が出ます',
        reading: 'botan o oshitara kippu ga demasu',
        meaning: 'Kalau tombol ditekan, tiket akan keluar',
        mnemonic: '押します diubah ke bentuk-た (押した) lalu ditambah ら menjadi 押したら.',
        speakText: 'ボタンを押したら切符が出ます',
      },
      {
        symbol: '駅に着いたら連絡してください',
        reading: 'eki ni tsuitara renraku shite kudasai',
        meaning: 'Setelah tiba di stasiun, tolong hubungi saya',
        mnemonic: 'Di sini ～たら bermakna "setelah terjadi", bukan sekadar pengandaian.',
        speakText: '駅に着いたら連絡してください',
      },
      {
        symbol: '雨が降ったら室内で行います',
        reading: 'ame ga futtara shitsunai de okonaimasu',
        meaning: 'Jika turun hujan, acara diadakan di dalam ruangan',
        mnemonic: 'Pola klasik pengumuman acara luar ruangan di sekolah atau kantor Jepang.',
        speakText: '雨が降ったら室内で行います',
      },
      {
        symbol: '分からないことがあったら聞いてください',
        reading: 'wakaranai koto ga attara kiite kudasai',
        meaning: 'Jika ada hal yang tidak dipahami, silakan bertanya',
        mnemonic: 'あります menjadi あった + ら = あったら; frasa penting saat orientasi kerja.',
        speakText: '分からないことがあったら聞いてください',
      },
    ],
    contrastiveTip:
      'Keunggulan ～たら adalah fleksibel: kalimat belakangnya boleh berisi ajakan, perintah, atau permintaan (～てください / ～ましょう), berbeda dari ～と yang tidak boleh diikuti perintah.',
  },
  'n4-u8-praktik-terpadu': {
    headline: 'Praktik Terpadu: Merencanakan Syarat & Langkah Lanjutan',
    subtitle:
      'Latih membentuk ～たら dari kata kerja, kata sifat-い, kata sifat-な, dan kata benda dalam dialog perencanaan sehari-hari.',
    items: [
      {
        symbol: '時間ができたら旅行に行きたいです',
        reading: 'jikan ga dekitara ryokou ni ikitai desu',
        meaning: 'Kalau ada waktu luang, saya ingin pergi berwisata',
        mnemonic: '時間ができます berarti waktu luang tersedia; bentuk-たら nya 時間ができたら.',
        speakText: '時間ができたら旅行に行きたいです',
      },
      {
        symbol: '値段が安かったら買います',
        reading: 'nedan ga yasukattara kaimasu',
        meaning: 'Jika harganya murah, saya akan membelinya',
        mnemonic: 'Kata sifat-い: buang い ganti かったら (安い menjadi 安かったら).',
        speakText: '値段が安かったら買います',
      },
      {
        symbol: '暇だったら映画を見ませんか',
        reading: 'hima dattara eiga o mimasen ka',
        meaning: 'Kalau senggang, maukah menonton film?',
        mnemonic: 'Kata sifat-な dan kata benda memakai だったら (暇だったら).',
        speakText: '暇だったら映画を見ませんか',
      },
      {
        symbol: '仕事が終わったら飲みに行きましょう',
        reading: 'shigoto ga owattara nomi ni ikimashou',
        meaning: 'Setelah pekerjaan selesai, ayo pergi minum bersama',
        mnemonic: 'Dipakai untuk kejadian pasti yang akan terjadi di masa depan ("setelah...").',
        speakText: '仕事が終わったら飲みに行きましょう',
      },
    ],
    contrastiveTip:
      'Perhatikan perubahan kata sifat いい (bagus): bentuk lampaunya よかった, sehingga bentuk syaratnya adalah よかったら (bukan いかったら).',
  },

  // Unit 9: GP-JA-N4-009 (～ておく)
  'n4-u9-baca-konteks': {
    headline: 'Baca Konteks: Daftar Persiapan Acara & Instruksi Tim',
    subtitle:
      'Kenali makna persiapan di muka dan menjaga kondisi tertentu dari pola ～ておく dalam memo tugas dan panduan kerja.',
    items: [
      {
        symbol: '会議の前に資料を読んでおきます',
        reading: 'kaigi no mae ni shiryou o yonde okimasu',
        meaning: 'Saya akan membaca dokumen terlebih dahulu sebelum rapat',
        mnemonic: '～ておく menunjukkan aksi dilakukan lebih awal demi kelancaran acara berikutnya.',
        speakText: '会議の前に資料を読んでおきます',
      },
      {
        symbol: '電気はつけたままにしておいてください',
        reading: 'denki wa tsuketa mama ni shite oite kudasai',
        meaning: 'Tolong biarkan lampunya tetap menyala',
        mnemonic: '～ままにしておく berarti sengaja membiarkan sesuatu tetap dalam keadaan semula.',
        speakText: '電気はつけたままにしておいてください',
      },
      {
        symbol: '出発前にチケットを印刷しておきます',
        reading: 'shuppatsu mae ni chiketto o insatsu shite okimasu',
        meaning: 'Saya akan mencetak tiket terlebih dahulu sebelum berangkat',
        mnemonic: '印刷する (mencetak) + ておく menandakan antisipasi agar tidak repot di bandara.',
        speakText: '出発前にチケットを印刷しておきます',
      },
      {
        symbol: '使ったら元の場所に戻しておいてください',
        reading: 'tsukattara moto no basho ni modoshite oite kudasai',
        meaning: 'Setelah dipakai, tolong kembalikan ke tempat semula',
        mnemonic: '戻しておく (modoshite oku) menekankan merapikan alat agar siap dipakai orang berikutnya.',
        speakText: '使ったら元の場所に戻しておいてください',
      },
    ],
    contrastiveTip:
      'Bedakan ～ておく (aksi persiapan yang akan/sedang dilakukan) dengan ～てあります (keadaan hasil persiapan yang sudah tampak sekarang).',
  },
  'n4-u9-praktik-terpadu': {
    headline: 'Praktik Terpadu: Mengatur Persiapan & Tindak Lanjut',
    subtitle:
      'Rangkai kalimat persiapan sebelum ujian, perjalanan, maupun rapat menggunakan bentuk sopan ～ておきます dan permintaan ～ておいてください.',
    items: [
      {
        symbol: '明日のために今夜準備しておきます',
        reading: 'ashita no tame ni konya junbi shite okimasu',
        meaning: 'Saya akan bersiap malam ini demi acara besok',
        mnemonic: '明日 (besok) + のために (demi) berpasangan alami dengan ～ておきます.',
        speakText: '明日のために今夜準備しておきます',
      },
      {
        symbol: '分からない単語を調べておきました',
        reading: 'wakaranai tango o shirabete okimashita',
        meaning: 'Saya sudah mencari tahu kosakata yang tidak dipahami sebelumnya',
        mnemonic: 'Bentuk lampau ～ておきました menyatakan persiapan telah selesai dilakukan.',
        speakText: '分からない単語を調べておきました',
      },
      {
        symbol: '部屋を片付けておいてね',
        reading: 'heya o katazukete oite ne',
        meaning: 'Tolong rapikan kamarnya dulu, ya',
        mnemonic: 'Dalam percakapan akrab, ～ておく sering diucapkan singkat menjadi ～とく (片付けといて).',
        speakText: '部屋を片付けておいてね',
      },
      {
        symbol: '大切な予定は手帳に書いておきます',
        reading: 'taisetsu na yotei wa techou ni kaite okimasu',
        meaning: 'Jadwal penting saya catat dulu di buku agenda',
        mnemonic: 'Menulis agar tidak lupa di kemudian hari adalah fungsi inti ～ておく.',
        speakText: '大切な予定は手帳に書いておきます',
      },
    ],
    contrastiveTip:
      'Bentuk lisan ～とく / ～どく (misalnya 買っとく, 読んどく) hanya dipakai untuk teman dekat atau keluarga; di kantor tetap ucapkan ～ておきます.',
  },

  // Unit 10: GP-JA-N4-010 (Kenjougo Dasar)
  'n4-u10-baca-konteks': {
    headline: 'Baca Konteks: Korespondensi Bisnis & Penerimaan Tamu',
    subtitle:
      'Pahami penerapan bahasa merendah (Kenjougo) dalam surat resmi, email perusahaan, dan dialog meja resepsionis tingkat N4.',
    items: [
      {
        symbol: 'ただいま担当者をお呼びいたします',
        reading: 'tadaima tantousha o o-yobi itashimasu',
        meaning: 'Sekarang juga saya akan memanggilkan penanggung jawab',
        mnemonic: 'Rumus Kenjougo: お + stem kata kerja (呼び) + いたします.',
        speakText: 'ただいま担当者をお呼びいたします',
      },
      {
        symbol: '明日メールでご連絡いたします',
        reading: 'ashita meeru de go-renraku itashimasu',
        meaning: 'Besok saya akan menghubungi Anda melalui email',
        mnemonic: 'Untuk kata benda suru berunsur kanji (連絡, 案内, 説明), gunakan awalan ご + いたします.',
        speakText: '明日メールでご連絡いたします',
      },
      {
        symbol: '明後日御社へ伺います',
        reading: 'asatte onsha e ukagaimasu',
        meaning: 'Lusa saya akan berkunjung ke perusahaan Anda',
        mnemonic: '伺います (ukagaimasu) adalah bentuk Kenjougo khusus dari 行く (pergi) dan 聞く (bertanya).',
        speakText: '明後日御社へ伺います',
      },
      {
        symbol: '資料を拝見いたしました',
        reading: 'shiryou o haiken itashimashita',
        meaning: 'Saya telah membaca/melihat dokumen Anda',
        mnemonic: '拝見する (haiken suru) adalah bentuk merendah dari 見る untuk menghormati karya lawan bicara.',
        speakText: '資料を拝見いたしました',
      },
    ],
    contrastiveTip:
      'Kenjougo (お～いたします, 伺います, 拝見します) selalu digunakan untuk tindakan DIRI SENDIRI atau tim sendiri, bukan untuk tindakan tamu atau atasan.',
  },
  'n4-u10-praktik-terpadu': {
    headline: 'Praktik Terpadu: Etika Layanan & Percakapan Profesional N4',
    subtitle:
      'Latih merespons tamu, memperkenalkan diri, dan menawarkan bantuan dengan Kenjougo baku sebagai penutup lintasan N4.',
    items: [
      {
        symbol: '佐藤と申します',
        reading: 'Satou to moushimasu',
        meaning: 'Nama saya Sato (sangat sopan)',
        mnemonic: '申します (moushimasu) adalah bentuk Kenjougo dari 言います saat memperkenalkan diri.',
        speakText: '佐藤と申します',
      },
      {
        symbol: 'お荷物をお持ちいたします',
        reading: 'o-nimotsu o o-mochi itashimasu',
        meaning: 'Biar saya bawakan barang bawaan Anda',
        mnemonic: '持ちます (stem 持ち) masuk ke rumus お + 持ち + いたします.',
        speakText: 'お荷物をお持ちいたします',
      },
      {
        symbol: '会議室までご案内いたします',
        reading: 'kaigishitsu made go-annai itashimasu',
        meaning: 'Saya akan mengantarkan Anda sampai ruang rapat',
        mnemonic: '案内 adalah kata kanji dua huruf, maka memakai awalan ご (ご案内いたします).',
        speakText: '会議室までご案内いたします',
      },
      {
        symbol: '後ほど折り返しお電話いたします',
        reading: 'nochihodo orikaeshi o-denwa itashimasu',
        meaning: 'Sebentar lagi saya akan menelepon balik Anda',
        mnemonic: 'Pengecualian penting: 電話 memakai お (お電話), bukan ご電話.',
        speakText: '後ほど折り返しお電話いたします',
      },
    ],
    contrastiveTip:
      'Hafalkan pengecualian awalan お/ご yang sering keluar di JLPT N4: お電話 (o-denwa) dan お返事 (o-henji) memakai お meski terdiri dari dua kanji.',
  },

  // =========================================================================
  // JLPT N3 EXPANSION — 20 DECKS (baca-konteks & praktik-terpadu, U1..U10)
  // =========================================================================

  // Unit 1: GP-JA-N3-001 (～ようにする / ～ようにしている)
  'n3-u1-baca-konteks': {
    headline: 'Baca Konteks: Artikel Gaya Hidup & Kebiasaan Positif',
    subtitle:
      'Amati pemakaian ～ようにする dan ～ようにしている dalam artikel kesehatan, wawancara atlet, serta tips produktivitas kerja.',
    items: [
      {
        symbol: '毎日三十分は歩くようにしています',
        reading: 'mainichi sanjuppun wa aruku you ni shite imasu',
        meaning: 'Saya membiasakan diri berjalan kaki setidaknya 30 menit tiap hari',
        mnemonic: '～ようにしています menandakan kebiasaan positif yang terus dijaga hingga sekarang.',
        speakText: '毎日三十分は歩くようにしています',
      },
      {
        symbol: '夜遅くは食べないようにしています',
        reading: 'yoru osoku wa tabenai you ni shite imasu',
        meaning: 'Saya berusaha tidak makan larut malam',
        mnemonic: 'Bentuk-ない (食べない) + ようにする berarti berusaha menghindari suatu kebiasaan.',
        speakText: '夜遅くは食べないようにしています',
      },
      {
        symbol: '締め切りを守れるように工夫する',
        reading: 'shimekiri o mamoreru you ni kufuu suru',
        meaning: 'Berupaya mengatur cara agar bisa menepati tenggat',
        mnemonic: '工夫する (kufuu suru) berarti mencari cara atau strategi praktis.',
        speakText: '締め切りを守れるように工夫する',
      },
      {
        symbol: 'なるべく階段を使うようにしている',
        reading: 'narubeku kaidan o tsukau you ni shite iru',
        meaning: 'Saya berusaha sebisa mungkin memakai tangga',
        mnemonic: 'なるべく (sebisa mungkin) sering berpasangan dengan ～ようにしている.',
        speakText: 'なるべく階段を使うようにしている',
      },
    ],
    contrastiveTip:
      'Bedakan ～ようにする (berusaha membiasakan diri secara sadar) dengan ～ようになる (perubahan kemampuan atau kondisi yang terjadi seiring waktu).',
  },
  'n3-u1-praktik-terpadu': {
    headline: 'Praktik Terpadu: Membangun Komitmen & Rutinitas Harian',
    subtitle:
      'Latih menyatakan resolusi baru dengan ～ようにします dan menjelaskan rutinitas yang sudah berjalan dengan ～ようにしています.',
    items: [
      {
        symbol: 'これからは遅刻しないようにします',
        reading: 'korekara wa chikoku shinai you ni shimasu',
        meaning: 'Mulai sekarang saya akan berusaha agar tidak terlambat',
        mnemonic: '～ようにします dipakai untuk berjanji atau bertekad memperbaiki kebiasaan ke depan.',
        speakText: 'これからは遅刻しないようにします',
      },
      {
        symbol: '毎朝ニュースを読むようにしています',
        reading: 'maiasa nyuusu o yomu you ni shite imasu',
        meaning: 'Saya membiasakan diri membaca berita setiap pagi',
        mnemonic: 'Kata kerja bentuk kamus (読む) langsung diikuti ようにしています.',
        speakText: '毎朝ニュースを読むようにしています',
      },
      {
        symbol: '忘れ物をしないようにメモを取る',
        reading: 'wasuremono o shinai you ni memo o toru',
        meaning: 'Mencatat agar tidak ada barang yang tertinggal',
        mnemonic: 'メモを取る (memo o toru) adalah kolokasi baku untuk mencatat hal penting.',
        speakText: '忘れ物をしないようにメモを取る',
      },
      {
        symbol: '相手の話を最後まで聞くようにしてください',
        reading: 'aite no hanashi o saigo made kiku you ni shite kudasai',
        meaning: 'Tolong usahakan mendengarkan perkataan lawan bicara sampai selesai',
        mnemonic: '～ようにしてください memberi instruksi pembiasaan secara sopan.',
        speakText: '相手の話を最後まで聞くようにしてください',
      },
    ],
    contrastiveTip:
      'Jangan gunakan kata kerja non-kehendak (seperti 晴れる atau 分かる) sebelum ～ようにする karena pola ini menuntut usaha sadar dari pelaku.',
  },

  // Unit 2: GP-JA-N3-002 (～ことになる / ～ことになっている)
  'n3-u2-baca-konteks': {
    headline: 'Baca Konteks: Pengumuman Kantor & Tata Tertib Lembaga',
    subtitle:
      'Pahami bagaimana ～ことになる menyatakan keputusan organisasi, sedangkan ～ことになっている menjelaskan aturan yang berlaku umum.',
    items: [
      {
        symbol: '来月から大阪へ転勤することになりました',
        reading: 'raigetsu kara Oosaka e tenkin suru koto ni narimashita',
        meaning: 'Sudah diputuskan bahwa mulai bulan depan saya mutasi ke Osaka',
        mnemonic: '～ことになりました menekankan keputusan berasal dari perusahaan atau situasi luar.',
        speakText: '来月から大阪へ転勤することになりました',
      },
      {
        symbol: 'この建物では禁煙ということになっています',
        reading: 'kono tatemono de wa kinen to iu koto ni natte imasu',
        meaning: 'Di gedung ini ditetapkan aturan dilarang merokok',
        mnemonic: '～ことになっています dipakai untuk menyatakan peraturan, jadwal tetap, atau adat.',
        speakText: 'この建物では禁煙ということになっています',
      },
      {
        symbol: '新プロジェクトを担当することになった',
        reading: 'shin purojekuto o tantou suru koto ni natta',
        meaning: 'Saya ditugaskan menangani proyek baru',
        mnemonic: '担当する (tantou suru) berarti memegang tanggung jawab suatu tugas atau klien.',
        speakText: '新プロジェクトを担当することになった',
      },
      {
        symbol: '会議は毎週火曜日に開くことになっている',
        reading: 'kaigi wa maishuu kayoubi ni hiraku koto ni natte iru',
        meaning: 'Rapat dijadwalkan rutin diadakan setiap hari Selasa',
        mnemonic: '開く (hiraku) dipakai bersama 会議 untuk makna mengadakan rapat.',
        speakText: '会議は毎週火曜日に開くことになっている',
      },
    ],
    contrastiveTip:
      'Bedakan ～ことにする (keputusan pribadi pembicara sendiri) dengan ～ことになる (keputusan pihak luar/organisasi, atau cara merendah saat mengumumkan keputusan pribadi).',
  },
  'n3-u2-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menyampaikan Keputusan & Aturan Kerja',
    subtitle:
      'Terapkan ～ことになりました dan ～ことになっています saat mengumumkan perubahan jadwal, aturan tim, atau rencana resmi.',
    items: [
      {
        symbol: '来週の出張は延期することになりました',
        reading: 'raishuu no shucchou wa enki suru koto ni narimashita',
        meaning: 'Perjalanan dinas minggu depan diputuskan untuk ditunda',
        mnemonic: '延期する (enki suru = menunda jadwal) berbeda dari 中止する (membatalkan total).',
        speakText: '来週の出張は延期することになりました',
      },
      {
        symbol: '休むときは前日に連絡することになっています',
        reading: 'yasumu toki wa zenjitsu ni renraku suru koto ni natte imasu',
        meaning: 'Aturannya adalah menghubungi sehari sebelumnya jika izin libur',
        mnemonic: '前日 (zenjitsu = hari sebelumnya) sering muncul dalam SOP kerja Jepang.',
        speakText: '休むときは前日に連絡することになっています',
      },
      {
        symbol: '今度、日本へ留学することになりました',
        reading: 'kondo, Nihon e ryuugaku suru koto ni narimashita',
        meaning: 'Kali ini sudah diputuskan bahwa saya akan studi ke Jepang',
        mnemonic: 'Orang Jepang sering memakai ～ことになりました untuk berita pribadi agar terdengar rendah hati.',
        speakText: '今度、日本へ留学することになりました',
      },
      {
        symbol: 'ここでは靴を脱ぐことになっています',
        reading: 'koko de wa kutsu o nugu koto ni natte imasu',
        meaning: 'Di tempat ini aturannya harus melepas sepatu',
        mnemonic: 'Nada ～ことになっています lebih halus dibanding perintah langsung 脱いでください.',
        speakText: 'ここでは靴を脱ぐことになっています',
      },
    ],
    contrastiveTip:
      'Gunakan ～ことになっています (bukan ～ことになりました) ketika menjelaskan peraturan tetap yang sudah berlaku lama kepada anggota baru.',
  },

  // Unit 3: GP-JA-N3-003 (～おかげで)
  'n3-u3-baca-konteks': {
    headline: 'Baca Konteks: Pidato Apresiasi & Kisah Keberhasilan',
    subtitle:
      'Cermati struktur ～おかげで dalam kata sambutan, surat ucapan terima kasih, dan ulasan pencapaian positif di Jepang.',
    items: [
      {
        symbol: '皆さんのご協力のおかげで成功しました',
        reading: 'minasan no go-kyouryoku no okage de seikou shimashita',
        meaning: 'Berkat kerja sama Anda semua, acara ini berhasil',
        mnemonic: 'Kata benda disambung memakai の sebelum おかげで (ご協力のおかげで).',
        speakText: '皆さんのご協力のおかげで成功しました',
      },
      {
        symbol: '早く家を出たおかげで間に合った',
        reading: 'hayaku ie o deta okage de maniatta',
        meaning: 'Berkat berangkat dari rumah lebih awal, saya sempat tepat waktu',
        mnemonic: 'Kata kerja bentuk biasa (出た) langsung diikuti おかげで tanpa の.',
        speakText: '早く家を出たおかげで間に合った',
      },
      {
        symbol: '合格できたのは先生のおかげです',
        reading: 'goukaku dekita no wa sensei no okage desu',
        meaning: 'Bisa lulus ujian adalah berkat jasa guru',
        mnemonic: 'Pola ～のは...のおかげです menonjolkan pihak yang paling berjasa di akhir kalimat.',
        speakText: '合格できたのは先生のおかげです',
      },
      {
        symbol: '薬を飲んだおかげで熱が下がりました',
        reading: 'kusuri o nonda okage de netsu ga sagarimashita',
        meaning: 'Berkat minum obat, demam saya turun',
        mnemonic: 'Hasil di belakang おかげで selalu bersifat positif atau melegakan.',
        speakText: '薬を飲んだおかげで熱が下がりました',
      },
    ],
    contrastiveTip:
      'Jangan pakai ～おかげで untuk hasil buruk kecuali bermaksud menyindir (sarkasme); untuk penyebab hasil negatif gunakan ～せいで.',
  },
  'n3-u3-praktik-terpadu': {
    headline: 'Praktik Terpadu: Mengungkapkan Syukur & Kredit Tim',
    subtitle:
      'Latih merangkai kalimat terima kasih yang tulus dengan ～おかげで dan sapaan hangat おかげさまで dalam percakapan profesional.',
    items: [
      {
        symbol: 'おかげさまで元気にやっています',
        reading: 'okagesama de genki ni yatte imasu',
        meaning: 'Berkat doa Anda, saya baik-baik saja',
        mnemonic: 'Ungkapan balasan standar saat ditanya kabar (お元気ですか) di Jepang.',
        speakText: 'おかげさまで元気にやっています',
      },
      {
        symbol: '先輩が助けてくれたおかげで終わりました',
        reading: 'senpai ga tasukete kureta okage de owarimashita',
        meaning: 'Berkat bantuan senior, tugasnya selesai',
        mnemonic: 'Gabungan ～てくれた + おかげで sangat kuat menyampaikan rasa terima kasih.',
        speakText: '先輩が助けてくれたおかげで終わりました',
      },
      {
        symbol: '天気がよかったおかげで景色がよく見えた',
        reading: 'tenki ga yokatta okage de keshiki ga yoku mieta',
        meaning: 'Berkat cuacanya cerah, pemandangannya terlihat jelas',
        mnemonic: 'Kata sifat-い lampau (よかった) langsung disambung ke おかげで.',
        speakText: '天気がよかったおかげで景色がよく見えた',
      },
      {
        symbol: '便利なアプリのおかげで勉強が楽しいです',
        reading: 'benri na apuri no okage de benkyou ga tanoshii desu',
        meaning: 'Berkat aplikasi yang praktis, belajar jadi menyenangkan',
        mnemonic: 'Kata sifat-な memakai な (便利な) saat menerangkan kata benda di depan のおかげで.',
        speakText: '便利なアプリのおかげで勉強が楽しいです',
      },
    ],
    contrastiveTip:
      'Ingat aturan sambungannya: Kata Kerja / Kata Sifat-い langsung + おかげで, Kata Sifat-な + な + おかげで, dan Kata Benda + の + おかげで.',
  },

  // Unit 4: GP-JA-N3-004 (～せいで / ～せいか)
  'n3-u4-baca-konteks': {
    headline: 'Baca Konteks: Laporan Insiden & Analisis Kendala',
    subtitle:
      'Pelajari cara ～せいで dan ～せいか digunakan dalam laporan gangguan sistem, berita cuaca buruk, dan penjelasan masalah sehari-hari.',
    items: [
      {
        symbol: '大雪のせいで電車が止まってしまった',
        reading: 'ooyuki no sei de densha ga tomatte shimatta',
        meaning: 'Gara-gara salju lebat, kereta berhenti beroperasi',
        mnemonic: 'Kata benda (大雪) wajib memakai の sebelum せいで.',
        speakText: '大雪のせいで電車が止まってしまった',
      },
      {
        symbol: '寝不足のせいか頭が痛い',
        reading: 'nebusoku no sei ka atama ga itai',
        meaning: 'Entah mungkin karena kurang tidur, kepala saya sakit',
        mnemonic: '～せいか menyatakan dugaan penyebab negatif yang belum 100% pasti.',
        speakText: '寝不足のせいか頭が痛い',
      },
      {
        symbol: 'システム障害のせいで作業が遅れた',
        reading: 'shisutemu shougai no sei de sagyou ga okureta',
        meaning: 'Karena gangguan sistem, pekerjaan menjadi tertunda',
        mnemonic: '障害 (shougai) dalam konteks TI berarti gangguan atau kegagalan sistem.',
        speakText: 'システム障害のせいで作業が遅れた',
      },
      {
        symbol: '確認を忘れたせいでミスが起きた',
        reading: 'kakunin o wasureta sei de misu ga okita',
        meaning: 'Gara-gara lupa mengecek, terjadilah kesalahan',
        mnemonic: 'Kata kerja bentuk biasa (忘れた) langsung diikuti せいで tanpa の.',
        speakText: '確認を忘れたせいでミスが起きた',
      },
    ],
    contrastiveTip:
      'Dalam laporan bisnis sangat resmi, ～せいで kadang terdengar seperti menyalahkan; untuk laporan objektif kepada klien, pilih ～のため atau ～により.',
  },
  'n3-u4-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menjelaskan Penyebab Masalah & Dugaan',
    subtitle:
      'Latih membedakan penyebab pasti (～せいで), kesimpulan akhir (～せいだ), dan dugaan halus (～せいか) dalam dialog nyata.',
    items: [
      {
        symbol: '全部私のせいです、申し訳ありません',
        reading: 'zenbu watashi no sei desu, moushiwake arimasen',
        meaning: 'Semuanya salah saya, mohon maaf sebesar-besarnya',
        mnemonic: '～のせいです dipakai untuk mengakui tanggung jawab atas suatu kesalahan.',
        speakText: '全部私のせいです、申し訳ありません',
      },
      {
        symbol: 'エアコンをつけすぎたせいで喉が痛い',
        reading: 'eakon o tsukesugita sei de nodo ga itai',
        meaning: 'Gara-gara menyalakan AC terlalu lama, tenggorokan saya sakit',
        mnemonic: 'Gabungan ～すぎた (terlalu) + せいで sangat alami untuk keluhan harian.',
        speakText: 'エアコンをつけすぎたせいで喉が痛い',
      },
      {
        symbol: '最近忙しいせいか疲れが取れない',
        reading: 'saikin isogashii sei ka tsukare ga torenai',
        meaning: 'Mungkin karena akhir-akhir ini sibuk, rasa lelah tidak hilang',
        mnemonic: '疲れが取れない (tsukare ga torenai) berarti rasa capek sulit hilang.',
        speakText: '最近忙しいせいか疲れが取れない',
      },
      {
        symbol: '渋滞のせいで約束に遅れてしまった',
        reading: 'juutai no sei de yakusoku ni okurete shimatta',
        meaning: 'Gara-gara macet, saya terlambat memenuhi janji',
        mnemonic: '渋滞 (juutai) adalah kemacetan lalu lintas kendaraan bermotor.',
        speakText: '渋滞のせいで約束に遅れてしまった',
      },
    ],
    contrastiveTip:
      'Perhatikan nuansa ～せいか: selalu berarti "mungkin gara-gara..." untuk gejala atau hasil kurang enak yang belum pasti penyebabnya.',
  },

  // Unit 5: GP-JA-N3-005 (～に対して / ～に対する)
  'n3-u5-baca-konteks': {
    headline: 'Baca Konteks: Opini Publik, Layanan & Data Perbandingan',
    subtitle:
      'Pahami dua peran penting ～に対して dalam artikel berita dan laporan bisnis: sasaran sikap/tindakan serta perbandingan dua hal kontras.',
    items: [
      {
        symbol: 'お客様に対して丁寧に対応する',
        reading: 'o-kyakusama ni taishite teinei ni taiou suru',
        meaning: 'Melayani dengan sopan terhadap pelanggan',
        mnemonic: 'Makna 1 (Sasaran): menandai pihak yang menjadi tujuan sikap atau perilaku.',
        speakText: 'お客様に対して丁寧に対応する',
      },
      {
        symbol: '兄が静かなのに対して弟は明るい',
        reading: 'ani ga shizuka na no ni taishite otouto wa akarui',
        meaning: 'Berbeda dengan kakak yang pendiam, adik berkepribadian ceria',
        mnemonic: 'Makna 2 (Kontras): membandingkan dua fakta yang berlawanan (A のに対して B).',
        speakText: '兄が静かなのに対して弟は明るい',
      },
      {
        symbol: '新制度に対する意見が集まった',
        reading: 'shin seido ni taisuru iken ga atsumatta',
        meaning: 'Berbagai pendapat terhadap sistem baru telah terkumpul',
        mnemonic: 'Jika langsung menerangkan kata benda di belakangnya, ubah menjadi ～に対する + N.',
        speakText: '新制度に対する意見が集まった',
      },
      {
        symbol: '質問に対して分かりやすく答える',
        reading: 'shitsumon ni taishite wakariyasuku kotaeru',
        meaning: 'Menjawab pertanyaan dengan mudah dipahami',
        mnemonic: '質問に対して adalah kolokasi baku dalam wawancara, rapat, dan presentasi.',
        speakText: '質問に対して分かりやすく答える',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～に対して (diikuti kata kerja/klausa) dengan ～に対する (wajib diikuti kata benda seperti 意見, 質問, 責任, 興味).',
  },
  'n3-u5-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menyatakan Sikap & Kontras Data',
    subtitle:
      'Latih memaparkan perbandingan statistik serta mengungkapkan tanggung jawab atau apresiasi profesional memakai ～に対して.',
    items: [
      {
        symbol: '自分の仕事に対して責任を持つ',
        reading: 'jibun no shigoto ni taishite sekinin o motsu',
        meaning: 'Memiliki rasa tanggung jawab terhadap pekerjaan sendiri',
        mnemonic: '責任を持つ (sekinin o motsu) adalah ungkapan etos kerja penting di Jepang.',
        speakText: '自分の仕事に対して責任を持つ',
      },
      {
        symbol: '去年の売上に対して今年は二割増えた',
        reading: 'kyonen no uriage ni taishite kotoshi wa niwari fueta',
        meaning: 'Dibandingkan penjualan tahun lalu, tahun ini naik 20 persen',
        mnemonic: '二割 (niwari) berarti 20%; sering muncul di laporan perbandingan N3.',
        speakText: '去年の売上に対して今年は二割増えた',
      },
      {
        symbol: '環境問題に対する関心が高まっている',
        reading: 'kankyou mondai ni taisuru kanshin ga takamatte iru',
        meaning: 'Perhatian terhadap masalah lingkungan semakin meningkat',
        mnemonic: '関心 (kanshin = minat/perhatian) adalah kata benda, jadi wajib pakai に対する.',
        speakText: '環境問題に対する関心が高まっている',
      },
      {
        symbol: '日本文化に対して深い興味がある',
        reading: 'Nihon bunka ni taishite fukai kyoumi ga aru',
        meaning: 'Memiliki ketertarikan mendalam terhadap budaya Jepang',
        mnemonic: 'Bisa juga ditulis 日本文化に対する深い興味 untuk frasa nomina.',
        speakText: '日本文化に対して深い興味がある',
      },
    ],
    contrastiveTip:
      'Saat membandingkan dua klausa lengkap, tambahkan の sebelum に対して (misalnya 都会は便利な のに対して、田舎は静かだ).',
  },

  // Unit 6: GP-JA-N3-006 (～うちに / ～ないうちに)
  'n3-u6-baca-konteks': {
    headline: 'Baca Konteks: Cerita Pengalaman & Pesan Memanfaatkan Waktu',
    subtitle:
      'Kenali dua nuansa ～うちに dalam bacaan N3: bertindak mumpung keadaan belum berubah, dan perubahan alami yang terjadi di tengah proses.',
    items: [
      {
        symbol: '雨が降らないうちに帰りましょう',
        reading: 'ame ga furanai uchi ni kaerimashou',
        meaning: 'Ayo pulang sebelum hujan turun',
        mnemonic: '～ないうちに berarti "selagi belum..." atau "sebelum terlambat".',
        speakText: '雨が降らないうちに帰りましょう',
      },
      {
        symbol: '話しているうちに仲良くなった',
        reading: 'hanashite iru uchi ni nakayoku natta',
        meaning: 'Selagi mengobrol, kami pun jadi akrab tanpa terasa',
        mnemonic: 'Bentuk ～ているうちに sering diikuti perubahan alami yang terjadi tanpa disadari.',
        speakText: '話しているうちに仲良くなった',
      },
      {
        symbol: '若いうちにいろいろな経験をしたい',
        reading: 'wakai uchi ni iroiro na keiken o shitai',
        meaning: 'Mumpung masih muda, saya ingin mencoba berbagai pengalaman',
        mnemonic: 'Kata sifat-い (若い) langsung disambung うちに.',
        speakText: '若いうちにいろいろな経験をしたい',
      },
      {
        symbol: '忘れないうちにメモしておきます',
        reading: 'wasurenai uchi ni memo shite okimasu',
        meaning: 'Selagi belum lupa, saya catat dulu',
        mnemonic: 'Kombinasi emas N3+N4: ～ないうちに + ～ておきます.',
        speakText: '忘れないうちにメモしておきます',
      },
    ],
    contrastiveTip:
      'Bedakan ～間に (fokus pada rentang waktu pasti dari awal sampai akhir) dengan ～うちに (ada rasa urgensi karena kondisi bisa segera berubah).',
  },
  'n3-u6-praktik-terpadu': {
    headline: 'Praktik Terpadu: Mengambil Kesempatan & Mengamati Perubahan',
    subtitle:
      'Rangkai kalimat tentang memanfaatkan momen terbaik serta menceritakan perubahan yang terjadi secara bertahap dengan ～うちに.',
    items: [
      {
        symbol: '熱いうちに召し上がってください',
        reading: 'atsui uchi ni meshiagatte kudasai',
        meaning: 'Silakan dinikmati selagi masih hangat',
        mnemonic: 'Ungkapan klasik di restoran Jepang agar makanan disantap sebelum dingin.',
        speakText: '熱いうちに召し上がってください',
      },
      {
        symbol: '日本にいるうちに富士山に登りたい',
        reading: 'Nihon ni iru uchi ni Fujisan ni noboritai',
        meaning: 'Mumpung sedang berada di Jepang, saya ingin mendaki Gunung Fuji',
        mnemonic: 'Menekankan kesempatan terbatas selama masa tinggal di Jepang.',
        speakText: '日本にいるうちに富士山に登りたい',
      },
      {
        symbol: '本を読んでいるうちに眠ってしまった',
        reading: 'hon o yonde iru uchi ni nemutte shimatta',
        meaning: 'Saat sedang membaca buku, saya ketiduran tanpa sadar',
        mnemonic: 'Perubahan tidak sengaja (眠ってしまった) sangat khas pada pola ～ているうちに.',
        speakText: '本を読んでいるうちに眠ってしまった',
      },
      {
        symbol: '暗くならないうちに掃除を済ませよう',
        reading: 'kuraku naranai uchi ni souji o sumaseyou',
        meaning: 'Ayo selesaikan bersih-bersih sebelum hari gelap',
        mnemonic: '済ませる (sumaseru) berarti menuntaskan suatu pekerjaan.',
        speakText: '暗くならないうちに掃除を済ませよう',
      },
    ],
    contrastiveTip:
      'Jika kata di depan うちに adalah kata benda, wajib tambahkan の (misalnya 学生のうちに = mumpung masih mahasiswa).',
  },

  // Unit 7: GP-JA-N3-007 (～はずだ / ～はずがない)
  'n3-u7-baca-konteks': {
    headline: 'Baca Konteks: Verifikasi Jadwal, Logika & Dugaan Kuat',
    subtitle:
      'Pahami cara pembicara Jepang menyampaikan keyakinan berbasis bukti dengan ～はずだ, penyangkalan logis ～はずがない, dan kekecewaan ～はずなのに.',
    items: [
      {
        symbol: '昨日発送したので明日届くはずです',
        reading: 'kinou hassou shita node ashita todoku hazu desu',
        meaning: 'Karena dikirim kemarin, seharusnya tiba besok',
        mnemonic: '～はずだ selalu bertumpu pada alasan atau bukti logis yang jelas.',
        speakText: '昨日発送したので明日届くはずです',
      },
      {
        symbol: 'そんな簡単な問題を間違えるはずがない',
        reading: 'sonna kantan na mondai o machigaeru hazu ga nai',
        meaning: 'Tidak mungkin salah pada soal semudah itu',
        mnemonic: '～はずがない mengekspresikan keyakinan kuat bahwa sesuatu mustahil terjadi.',
        speakText: 'そんな簡単な問題を間違えるはずがない',
      },
      {
        symbol: 'ここに置いたはずなのに見つからない',
        reading: 'koko ni oita hazu na noni mitsukaranai',
        meaning: 'Padahal seingat saya ditaruh di sini, kok tidak ketemu',
        mnemonic: '～たはずなのに dipakai saat kenyataan bertolak belakang dengan ingatan/dugaan.',
        speakText: 'ここに置いたはずなのに見つからない',
      },
      {
        symbol: '彼は日本に五年いたから詳しいはずだ',
        reading: 'kare wa Nihon ni gonen ita kara kuwashii hazu da',
        meaning: 'Karena dia tinggal 5 tahun di Jepang, seharusnya dia paham betul',
        mnemonic: 'Kata sifat-い (詳しい) langsung disambung ke はずだ.',
        speakText: '彼は日本に五年いたから詳しいはずだ',
      },
    ],
    contrastiveTip:
      'Jangan gunakan ～はずだ untuk tebakan tanpa dasar atau prediksi cuaca spontan; gunakan ～だろう / ～でしょう untuk perkiraan umum.',
  },
  'n3-u7-praktik-terpadu': {
    headline: 'Praktik Terpadu: Mengonfirmasi Fakta & Menyanggah Logis',
    subtitle:
      'Latih menggunakan ～はずだ, ～はずがない, dan ～はずだった dalam situasi cek pesanan, verifikasi dokumen, dan diskusi tim.',
    items: [
      {
        symbol: 'メールはすでに送ったはずです',
        reading: 'meeru wa sudeni okutta hazu desu',
        meaning: 'Emailnya seharusnya sudah saya kirim',
        mnemonic: 'Menyatakan keyakinan berdasarkan ingatan tindakan yang sudah dilakukan.',
        speakText: 'メールはすでに送ったはずです',
      },
      {
        symbol: '今日は火曜日だから図書館は休みのはずだ',
        reading: 'kyou wa kayoubi dakara toshokan wa yasumi no hazu da',
        meaning: 'Karena hari ini Selasa, perpustakaan seharusnya tutup',
        mnemonic: 'Kata benda (休み) wajib memakai の sebelum はずだ (休みのはずだ).',
        speakText: '今日は火曜日だから図書館は休みのはずだ',
      },
      {
        symbol: '彼が約束を破るはずがありません',
        reading: 'kare ga yakusoku o yaburu hazu ga arimasen',
        meaning: 'Tidak mungkin dia mengingkari janji',
        mnemonic: 'Versi sopan ～はずがありません cocok dipakai dalam percakapan formal.',
        speakText: '彼が約束を破るはずがありません',
      },
      {
        symbol: '三時に始まるはずだったのに遅れている',
        reading: 'sanji ni hajimaru hazu datta noni okurete iru',
        meaning: 'Padahal seharusnya mulai jam 3, tetapi malah tertunda',
        mnemonic: '～はずだった menyatakan rencana atau ekspektasi sebelumnya yang tidak terwujud.',
        speakText: '三時に始まるはずだったのに遅れている',
      },
    ],
    contrastiveTip:
      'Ingat sambungan kata sifat-な dan kata benda: kata sifat-な + な + はずだ (元気なはずだ), sedangkan kata benda + の + はずだ (休みのはずだ).',
  },

  // Unit 8: GP-JA-N3-008 (Bentuk Pasif ～られる / ～される)
  'n3-u8-baca-konteks': {
    headline: 'Baca Konteks: Berita Budaya, Sejarah & Pasif Penderitaan',
    subtitle:
      'Kenali penggunaan kalimat pasif pada artikel berita, penjelasan bangunan bersejarah, serta cerita kejadian tak terduga.',
    items: [
      {
        symbol: 'このお寺は三百年前に建てられました',
        reading: 'kono o-tera wa sanbyakunen mae ni tateraremashita',
        meaning: 'Kuil ini dibangun 300 tahun yang lalu',
        mnemonic: 'Pasif benda mati sering dipakai saat pelakunya tidak disebutkan secara spesifik.',
        speakText: 'このお寺は三百年前に建てられました',
      },
      {
        symbol: 'この小説は世界中で読まれています',
        reading: 'kono shousetsu wa sekaijuu de yomarete imasu',
        meaning: 'Novel ini dibaca di seluruh dunia',
        mnemonic: '読む (Golongan 1) berubah vokal u ke a + れる menjadi 読まれる.',
        speakText: 'この小説は世界中で読まれています',
      },
      {
        symbol: '帰り道で急に雨に降られました',
        reading: 'kaerimichi de kyuu ni ame ni furaremashita',
        meaning: 'Di jalan pulang saya mendadak kehujanan',
        mnemonic: 'Pasif penderitaan (迷惑の受身): menyatakan kejadian yang merugikan pembicara.',
        speakText: '帰り道で急に雨に降られました',
      },
      {
        symbol: 'オリンピックは四年に一度開かれます',
        reading: 'Orinpikku wa yonen ni ichido hirakaremasu',
        meaning: 'Olimpiade diselenggarakan empat tahun sekali',
        mnemonic: '開く menjadi 開かれる; sangat sering muncul di bacaan berita N3.',
        speakText: 'オリンピックは四年に一度開かれます',
      },
    ],
    contrastiveTip:
      'Jika menyebutkan pencipta karya (buku, lagu, lukisan, penemuan), gunakan partikel によって (bukan に), misalnya 紫式部によって書かれた.',
  },
  'n3-u8-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menceritakan Pengalaman dengan Bentuk Pasif',
    subtitle:
      'Latih mengubah kata kerja Golongan 1, 2, dan 3 ke bentuk pasif untuk menceritakan pujian, tugas, maupun kejadian tidak nyaman.',
    items: [
      {
        symbol: '上司に発表を褒められました',
        reading: 'joushi ni happyou o homeraremashita',
        meaning: 'Presentasi saya dipuji oleh atasan',
        mnemonic: 'Pelaku tindakan ditandai partikel に (上司に); 褒める menjadi 褒められる.',
        speakText: '上司に発表を褒められました',
      },
      {
        symbol: '満員電車で足を踏まれました',
        reading: 'manin densha de ashi o fumaremashita',
        meaning: 'Kaki saya terinjak di kereta yang penuh sesak',
        mnemonic: '踏む (menginjak) berubah menjadi 踏まれる; kalimat klasik pengalaman komuter Jepang.',
        speakText: '満員電車で足を踏まれました',
      },
      {
        symbol: '大事な会議に招待されました',
        reading: 'daiji na kaigi ni shoutai saremashita',
        meaning: 'Saya diundang ke rapat penting',
        mnemonic: 'Kata kerja する selalu berubah bentuk pasif menjadi される (招待される).',
        speakText: '大事な会議に招待されました',
      },
      {
        symbol: '友達に夜遅く来られて困った',
        reading: 'tomodachi ni yoru osoku korarete komatta',
        meaning: 'Saya kerepotan karena didatangi teman larut malam',
        mnemonic: 'Bentuk pasif dari 来る (kuru) adalah 来られる (korareru).',
        speakText: '友達に夜遅く来られて困った',
      },
    ],
    contrastiveTip:
      'Jangan bingung antara bentuk pasif dan bentuk potensial Golongan 2 yang sama-sama berakhiran ～られる; bedakan lewat konteks kalimat dan adanya pelaku berpartikel に.',
  },

  // Unit 9: GP-JA-N3-009 (～たばかり)
  'n3-u9-baca-konteks': {
    headline: 'Baca Konteks: Kisah Adaptasi, Pekerjaan Baru & Berita Hangat',
    subtitle:
      'Pahami nuansa subjektif ～たばかり yang menyatakan suatu peristiwa terasa masih sangat baru bagi pembicara meski sudah lewat beberapa hari atau bulan.',
    items: [
      {
        symbol: '日本に来たばかりでまだ慣れません',
        reading: 'Nihon ni kita bakari de mada naremasen',
        meaning: 'Karena baru saja datang ke Jepang, saya belum terbiasa',
        mnemonic: 'Meski sudah datang 1–2 bulan lalu, jika terasa masih baru tetap pakai ～たばかり.',
        speakText: '日本に来たばかりでまだ慣れません',
      },
      {
        symbol: '買ったばかりの傘を電車に忘れた',
        reading: 'katta bakari no kasa o densha ni wasureta',
        meaning: 'Saya melupakan payung yang baru saja dibeli di kereta',
        mnemonic: 'Untuk menerangkan kata benda di belakangnya, tambahkan の (買ったばかりの傘).',
        speakText: '買ったばかりの傘を電車に忘れた',
      },
      {
        symbol: 'この店は先月オープンしたばかりです',
        reading: 'kono mise wa sengetsu oopun shita bakari desu',
        meaning: 'Toko ini baru saja buka bulan lalu',
        mnemonic: 'Kata kerja bentuk-た + ばかり + です sangat lazim pada ulasan tempat dan berita.',
        speakText: 'この店は先月オープンしたばかりです',
      },
      {
        symbol: '卒業したばかりの新入社員です',
        reading: 'sotsugyou shita bakari no shinnyuu shain desu',
        meaning: 'Dia adalah karyawan baru yang baru saja lulus kuliah',
        mnemonic: '新入社員 (shinnyuu shain) berarti karyawan baru di perusahaan Jepang.',
        speakText: '卒業したばかりの新入社員です',
      },
    ],
    contrastiveTip:
      'Bedakan ～たばかり (terasa baru menurut pembicara, bisa kemarin atau bulan lalu) dengan ～たところ (benar-benar baru saja selesai beberapa detik/menit lalu).',
  },
  'n3-u9-praktik-terpadu': {
    headline: 'Praktik Terpadu: Memperkenalkan Diri & Situasi Baru',
    subtitle:
      'Latih memakai ～たばかり dan ～たばかりの untuk menjelaskan pengalaman awal kerja, pindah rumah, atau kegiatan yang baru selesai.',
    items: [
      {
        symbol: '先週この部署に配属されたばかりです',
        reading: 'senshuu kono busho ni haizoku sareta bakari desu',
        meaning: 'Saya baru saja ditempatkan di divisi ini minggu lalu',
        mnemonic: '配属される (haizoku sareru = ditempatkan di bagian/divisi) sangat sering dipakai di kantor.',
        speakText: '先週この部署に配属されたばかりです',
      },
      {
        symbol: 'さっき昼ご飯を食べたばかりです',
        reading: 'sakki hirugohan o tabeta bakari desu',
        meaning: 'Saya baru saja makan siang barusan',
        mnemonic: 'さっき (barusan) mempertegas bahwa kejadian memang baru berlalu.',
        speakText: 'さっき昼ご飯を食べたばかりです',
      },
      {
        symbol: '引っ越したばかりで荷物が片付いていない',
        reading: 'hikkoshita bakari de nimotsu ga katazuite inai',
        meaning: 'Karena baru saja pindah rumah, barang-barang belum beres',
        mnemonic: '～たばかりで menyambungkan alasan "karena baru saja..." ke kondisi saat ini.',
        speakText: '引っ越したばかりで荷物が片付いていない',
      },
      {
        symbol: '修理したばかりなのにまた壊れた',
        reading: 'shuuri shita bakari na noni mata kowareta',
        meaning: 'Padahal baru saja diperbaiki, eh rusak lagi',
        mnemonic: 'Sebelum のに, tambahkan な menjadi ～たばかりなのに.',
        speakText: '修理したばかりなのにまた壊れた',
      },
    ],
    contrastiveTip:
      'Perhatikan partikel penghubung setelah ばかり: gunakan ばかりの + Kata Benda, ばかりなのに (padahal baru saja), dan ばかりなので (karena baru saja).',
  },

  // Unit 10: GP-JA-N3-010 (～によって / ～による / ～によっては)
  'n3-u10-baca-konteks': {
    headline: 'Baca Konteks: Artikel Budaya, Metode & Penyebab Resmi',
    subtitle:
      'Kuasai empat fungsi ～によって dalam teks berita dan esai N3: variasi (tergantung), penyebab resmi, cara/metode, dan pencipta karya.',
    items: [
      {
        symbol: '国によって食文化が大きく異なる',
        reading: 'kuni ni yotte shokubunka ga ookiku kotonaru',
        meaning: 'Budaya kuliner sangat berbeda tergantung negaranya',
        mnemonic: 'Makna variasi: sering berpasangan dengan 違う, 異なる, atau さまざまだ.',
        speakText: '国によって食文化が大きく異なる',
      },
      {
        symbol: '台風による被害が広がっている',
        reading: 'taifuu ni yoru higai ga hirogatte iru',
        meaning: 'Kerusakan akibat topan semakin meluas',
        mnemonic: 'Jika menerangkan kata benda di belakangnya (被害), gunakan ～による.',
        speakText: '台風による被害が広がっている',
      },
      {
        symbol: 'インターネットによって生活が便利になった',
        reading: 'intaanetto ni yotte seikatsu ga benri ni natta',
        meaning: 'Berkat/melalui internet, kehidupan menjadi praktis',
        mnemonic: 'Makna metode/sarana: menyatakan cara yang menghasilkan suatu perubahan.',
        speakText: 'インターネットによって生活が便利になった',
      },
      {
        symbol: '場合によっては中止になることもあります',
        reading: 'baai ni yotte wa chuushi ni naru koto mo arimasu',
        meaning: 'Tergantung situasinya, ada kalanya acara dibatalkan',
        mnemonic: '～によっては menyoroti kasus khusus tertentu saja (tidak semuanya).',
        speakText: '場合によっては中止になることもあります',
      },
    ],
    contrastiveTip:
      'Bedakan ～によって (menjelaskan keragaman secara umum) dengan ～によっては (menyoroti pengecualian atau kasus tertentu, misalnya 人によっては).',
  },
  'n3-u10-praktik-terpadu': {
    headline: 'Praktik Terpadu: Analisis Budaya & Penutup JLPT N3',
    subtitle:
      'Latih membedakan ～によって, ～による, dan ～によっては saat menjelaskan perbedaan kebiasaan, hasil penelitian, serta prosedur resmi.',
    items: [
      {
        symbol: '人によって考え方はさまざまです',
        reading: 'hito ni yotte kangaekata wa samazama desu',
        meaning: 'Cara berpikir bermacam-macam tergantung orangnya',
        mnemonic: 'さまざまです (beraneka ragam) adalah pasangan alami dari 人によって.',
        speakText: '人によって考え方はさまざまです',
      },
      {
        symbol: '話し合いによって問題を解決した',
        reading: 'hanashiai ni yotte mondai o kaiketsu shita',
        meaning: 'Menyelesaikan masalah melalui diskusi',
        mnemonic: '話し合い (diskusi) menjadi sarana/metode penyelesaian masalah.',
        speakText: '話し合いによって問題を解決した',
      },
      {
        symbol: 'アンケートによる調査結果を報告します',
        reading: 'ankeeto ni yoru chousa kekka o houkoku shimasu',
        meaning: 'Saya laporkan hasil survei berdasarkan kuesioner',
        mnemonic: '調査結果 adalah kata benda, sehingga bentuk yang tepat adalah ～による.',
        speakText: 'アンケートによる調査結果を報告します',
      },
      {
        symbol: '季節によってメニューが変わります',
        reading: 'kisetsu ni yotte menyuu ga kawarimasu',
        meaning: 'Menunya berubah-ubah tergantung musim',
        mnemonic: '季節によって sering muncul di brosur restoran dan penginapan Jepang.',
        speakText: '季節によってメニューが変わります',
      },
    ],
    contrastiveTip:
      'Di depan ～によって selalu berbentuk Kata Benda (tanpa の). Jangan menulis 国のによって; cukup tulis 国によって.',
  },

  // =========================================================================
  // JLPT N2 EXPANSION — 20 DECKS (baca-konteks & praktik-terpadu, U1..U10)
  // =========================================================================

  // Unit 1: GP-JA-N2-001 (～にあたって / ～にあたり)
  'n2-u1-baca-konteks': {
    headline: 'Baca Konteks: Sambutan Resmi & Pengumuman Peluncuran',
    subtitle:
      'Telaah pemakaian ～にあたって dan ～にあたり pada siaran pers perusahaan, panduan registrasi proyek, dan teks sambutan formal N2.',
    items: [
      {
        symbol: '新事業を立ち上げるにあたって',
        reading: 'shinjigyou o tachiageru ni atatte',
        meaning: 'Menjelang merintis lini bisnis baru',
        mnemonic: '立ち上げる (tachiageru = meluncurkan/merintis) berpasangan resmi dengan にあたって.',
        speakText: '新事業を立ち上げるにあたって',
      },
      {
        symbol: '移転にあたりご挨拶申し上げます',
        reading: 'iten ni atari go-aisatsu moushiagemasu',
        meaning: 'Pada kesempatan relokasi kantor, kami menyampaikan salam hormat',
        mnemonic: '～にあたり lazim dalam surat pemberitahuan bisnis bersama ご挨拶申し上げます.',
        speakText: '移転にあたりご挨拶申し上げます',
      },
      {
        symbol: '申請にあたっては必要書類をご準備ください',
        reading: 'shinsei ni atatte wa hitsuyou shorui o go-junbi kudasai',
        meaning: 'Khusus menjelang pengajuan, mohon siapkan dokumen yang diperlukan',
        mnemonic: 'Tambahan は (にあたっては) menyoroti syarat wajib yang perlu diperhatikan pemohon.',
        speakText: '申請にあたっては必要書類をご準備ください',
      },
      {
        symbol: 'リニューアルオープンにあたり記念イベントを開催する',
        reading: 'rinyuuaru oopun ni atari kinen ibento o kaisai suru',
        meaning: 'Dalam rangka pembukaan kembali, kami menggelar acara peringatan',
        mnemonic: 'Dipakai untuk titik awal momen besar dan positif yang telah direncanakan.',
        speakText: 'リニューアルオープンにあたり記念イベントを開催する',
      },
    ],
    contrastiveTip:
      'Bedakan ～にあたって (menjelang momen penting/positif yang direncanakan) dengan ～に際して (pada saat suatu kejadian formal, baik positif maupun darurat/netral).',
  },
  'n2-u1-praktik-terpadu': {
    headline: 'Praktik Terpadu: Pidato Pembukaan & Proposal Strategis',
    subtitle:
      'Latih menyusun ucapan sambutan, arahan proyek, dan email transisi kerja menggunakan ～にあたって / ～にあたり dengan register bisnis N2.',
    items: [
      {
        symbol: 'プロジェクト開始にあたって目標を共有したい',
        reading: 'purojekuto kaishi ni atatte mokuhyou o kyouyuu shitai',
        meaning: 'Menjelang dimulainya proyek, saya ingin menyelaraskan target bersama',
        mnemonic: 'Kata benda peristiwa (プロジェクト開始) langsung diikuti にあたって tanpa の.',
        speakText: 'プロジェクト開始にあたって目標を共有したい',
      },
      {
        symbol: '着任にあたり一言ご挨拶いたします',
        reading: 'chakunin ni atari hitokoto go-aisatsu itashimasu',
        meaning: 'Pada kesempatan mulai menjabat, izinkan saya menyampaikan sepatah kata',
        mnemonic: '着任 (chakunin = mulai bertugas di jabatan/lokasi baru) adalah istilah korporat N2.',
        speakText: '着任にあたり一言ご挨拶いたします',
      },
      {
        symbol: '留学を決意するにあたって家族と話し合った',
        reading: 'ryuugaku o ketsui suru ni atatte kazoku to hanashiatta',
        meaning: 'Menjelang memutuskan studi ke luar negeri, saya berdiskusi dengan keluarga',
        mnemonic: 'Kata kerja sebelum にあたって selalu berbentuk kamus (決意する), bukan 決意した.',
        speakText: '留学を決意するにあたって家族と話し合った',
      },
      {
        symbol: '新制度の導入にあたり説明会を開く',
        reading: 'shin seido no dounyuu ni atari setsumeikai o hiraku',
        meaning: 'Menjelang penerapan sistem baru, kami mengadakan sesi sosialisasi',
        mnemonic: '導入 (dounyuu = adopsi sistem) + 説明会 (sesi penjelasan) sangat khas lingkungan kantor.',
        speakText: '新制度の導入にあたり説明会を開く',
      },
    ],
    contrastiveTip:
      'Jangan pernah menggunakan bentuk lampau (-た) di depan ～にあたって; selalu gunakan bentuk kamus (するにあたって) atau kata benda langsung (開始にあたり).',
  },

  // Unit 2: GP-JA-N2-002 (～に伴って / ～に伴い / ～に伴う)
  'n2-u2-baca-konteks': {
    headline: 'Baca Konteks: Berita Ekonomi & Analisis Tren Masyarakat',
    subtitle:
      'Amati pola sebab-akibat beriringan ～に伴って, ～に伴い, dan ～に伴う dalam laporan berita ekonomi, demografi, dan kebijakan publik.',
    items: [
      {
        symbol: '人口減少に伴って空き家が増えている',
        reading: 'jinkou genshou ni tomonatte akiya ga fuete iru',
        meaning: 'Seiring penurunan jumlah penduduk, rumah kosong kian bertambah',
        mnemonic: 'Menunjukkan dua perubahan besar yang bergerak bersamaan secara proporsional.',
        speakText: '人口減少に伴って空き家が増えている',
      },
      {
        symbol: 'システム更新に伴い一時的に利用を停止します',
        reading: 'shisutemu koushin ni tomonai ichijiteki ni riyou o teishi shimasu',
        meaning: 'Sehubungan dengan pembaruan sistem, layanan dihentikan sementara',
        mnemonic: '～に伴い sering muncul pada pengumuman resmi layanan bank, kereta, dan situs web.',
        speakText: 'システム更新に伴い一時的に利用を停止します',
      },
      {
        symbol: '高齢化に伴う医療費の増加が課題だ',
        reading: 'koureika ni tomonau iryouhi no zouka ga kadai da',
        meaning: 'Kenaikan biaya medis yang menyertai penuaan penduduk menjadi tantangan',
        mnemonic: 'Jika langsung menerangkan kata benda di belakangnya (医療費の増加), gunakan ～に伴う.',
        speakText: '高齢化に伴う医療費の増加が課題だ',
      },
      {
        symbol: '都市化が進むに伴って緑地が減ってきた',
        reading: 'toshika ga susumu ni tomonatte ryokuchi ga hette kita',
        meaning: 'Seiring berjalannya urbanisasi, ruang terbuka hijau semakin berkurang',
        mnemonic: 'Kata kerja perubahan (進む, 増える, 変化する) sering hadir sebelum に伴って.',
        speakText: '都市化が進むに伴って緑地が減ってきた',
      },
    ],
    contrastiveTip:
      'Bedakan ～に伴って (diikuti klausa/verba) dengan ～に伴う (wajib diikuti kata benda seperti リスク, 変化, 増加, 影響).',
  },
  'n2-u2-praktik-terpadu': {
    headline: 'Praktik Terpadu: Memaparkan Dampak Perubahan & Kebijakan',
    subtitle:
      'Latih merangkai analisis bisnis dan pengumuman operasional menggunakan ～に伴って, ～に伴い, dan ～に伴う secara tepat.',
    items: [
      {
        symbol: '原材料の高騰に伴い価格を改定いたします',
        reading: 'genzairyou no koutou ni tomonai kakaku o kaitei itashimasu',
        meaning: 'Seiring lonjakan harga bahan baku, kami menyesuaikan harga jual',
        mnemonic: '高騰 (koutou = lonjakan harga) + 価格改定 (penyesuaian harga) adalah frasa bisnis baku.',
        speakText: '原材料の高騰に伴い価格を改定いたします',
      },
      {
        symbol: '事業拡大に伴う人員の増強を図る',
        reading: 'jigyou kakudai ni tomonau jinin no zoukyou o hakaru',
        meaning: 'Mengupayakan penambahan personel seiring ekspansi usaha',
        mnemonic: '人員の増強 adalah frasa nomina, sehingga penghubungnya wajib ～に伴う.',
        speakText: '事業拡大に伴う人員の増強を図る',
      },
      {
        symbol: '技術の発展に伴って働き方も多様化した',
        reading: 'gijutsu no hatten ni tomonatte hatarakikata mo tayouka shita',
        meaning: 'Seiring kemajuan teknologi, cara bekerja pun semakin beragam',
        mnemonic: '多様化する (tayouka suru = menjadi beragam) sangat sering keluar di wacana N2.',
        speakText: '技術の発展に伴って働き方も多様化した',
      },
      {
        symbol: '法律の改正に伴い社内規定を見直した',
        reading: 'houritsu no kaisei ni tomonai shanai kitei o minaoshita',
        meaning: 'Seiring revisi undang-undang, kami meninjau ulang peraturan internal',
        mnemonic: '見直す (minaosu = meninjau kembali) berpasangan alami dengan perubahan regulasi.',
        speakText: '法律の改正に伴い社内規定を見直した',
      },
    ],
    contrastiveTip:
      'Hindari memakai ～に伴って untuk kegiatan rutin pribadi yang tidak memiliki skala perubahan besar; gunakan ～につれて atau ～ながら untuk proses ringan.',
  },

  // Unit 3: GP-JA-N2-003 (～に限らず)
  'n2-u3-baca-konteks': {
    headline: 'Baca Konteks: Esai Tren Global & Keragaman Pasar',
    subtitle:
      'Pahami bagaimana ～に限らず memperluas cakupan argumen dari satu contoh sempit ke jangkauan yang jauh lebih luas dalam artikel N2.',
    items: [
      {
        symbol: '日本に限らずアジア全体で人気が高まっている',
        reading: 'Nihon ni kagirazu Ajia zentai de ninki ga takamatte iru',
        meaning: 'Tidak terbatas di Jepang, popularitasnya meningkat di seluruh Asia',
        mnemonic: 'Pola A に限らず B でも / も memperluas cakupan dari A ke lingkup lebih besar.',
        speakText: '日本に限らずアジア全体で人気が高まっている',
      },
      {
        symbol: '若者に限らず幅広い世代に支持されている',
        reading: 'wakamono ni kagirazu habahiroi sedai ni shiji sarete iru',
        meaning: 'Tidak hanya kaum muda, melainkan didukung lintas generasi yang luas',
        mnemonic: '幅広い世代 (habahiroi sedai) berarti rentang generasi yang luas.',
        speakText: '若者に限らず幅広い世代に支持されている',
      },
      {
        symbol: '語学に限らず何事も継続が大切だ',
        reading: 'gogaku ni kagirazu nanigoto mo keizoku ga taisetsu da',
        meaning: 'Tidak terbatas pada bahasa, dalam hal apa pun konsistensi itu penting',
        mnemonic: '何事も (nanigoto mo = segala hal) sering menyertai ～に限らず dalam esai.',
        speakText: '語学に限らず何事も継続が大切だ',
      },
      {
        symbol: '専門家に限らず一般の市民も参加できる',
        reading: 'senmonka ni kagirazu ippan no shimin mo sanka dekiru',
        meaning: 'Tidak hanya pakar, warga umum pun dapat berpartisipasi',
        mnemonic: 'Kata benda langsung diikuti に限らず tanpa partikel tambahan.',
        speakText: '専門家に限らず一般の市民も参加できる',
      },
    ],
    contrastiveTip:
      'Bedakan ～に限らず (tidak terbatas pada A, melainkan juga B/semua) dengan ～に限って (justru khusus pada saat/orang itu saja terjadi hal tak terduga).',
  },
  'n2-u3-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menyusun Argumen Inklusif & Presentasi',
    subtitle:
      'Latih memakai ～に限らず untuk mempresentasikan jangkauan layanan, tren industri, dan prinsip universal secara meyakinkan.',
    items: [
      {
        symbol: '首都圏に限らず地方でも需要が伸びている',
        reading: 'shutoken ni kagirazu chihou demo juyou ga nobite iru',
        meaning: 'Tidak hanya di wilayah ibu kota, permintaan di daerah pun bertumbuh',
        mnemonic: '首都圏 (wilayah metropolitan Tokyo) berpasangan kontras dengan 地方 (daerah).',
        speakText: '首都圏に限らず地方でも需要が伸びている',
      },
      {
        symbol: 'この店舗は休日に限らず毎日混雑している',
        reading: 'kono tenpo wa kyuujitsu ni kagirazu mainichi konzatsu shite iru',
        meaning: 'Toko ini ramai setiap hari, tidak terbatas pada hari libur saja',
        mnemonic: '混雑する (konzatsu suru) berarti padat atau ramai pengunjung.',
        speakText: 'この店舗は休日に限らず毎日混雑している',
      },
      {
        symbol: 'スポーツに限らず芸術の分野でも活躍している',
        reading: 'supootsu ni kagirazu geijutsu no bunya demo katsuyaku shite iru',
        meaning: 'Tidak hanya di olahraga, ia juga berkiprah di bidang seni',
        mnemonic: '活躍する (katsuyaku suru) menyatakan kiprah aktif yang menonjol.',
        speakText: 'スポーツに限らず芸術の分野でも活躍している',
      },
      {
        symbol: '正社員に限らずアルバイトにも研修を行う',
        reading: 'seishain ni kagirazu arubaito ni mo kenshuu o okonau',
        meaning: 'Pelatihan diberikan tidak hanya untuk karyawan tetap, tetapi juga pekerja paruh waktu',
        mnemonic: '正社員 (karyawan tetap) dan アルバイト (paruh waktu) adalah istilah kerja wajib N2.',
        speakText: '正社員に限らずアルバイトにも研修を行う',
      },
    ],
    contrastiveTip:
      'Di depan ～に限らず hanya boleh diletakkan Kata Benda. Untuk menyatakan "tidak hanya melakukan...", gunakan ～だけでなく alih-alih ～に限らず.',
  },

  // Unit 4: GP-JA-N2-004 (～わけにはいかない / ～ないわけにはいかない)
  'n2-u4-baca-konteks': {
    headline: 'Baca Konteks: Dilema Profesional & Etika Tanggung Jawab',
    subtitle:
      'Cermati bagaimana ～わけにはいかない menyatakan ketidakmungkinan secara moral/sosial, sedangkan ～ないわけにはいかない menyatakan kewajiban tak terelakkan.',
    items: [
      {
        symbol: '重要な会議があるので休むわけにはいかない',
        reading: 'juuyou na kaigi ga aru node yasumu wake ni wa ikanai',
        meaning: 'Karena ada rapat penting, saya tidak mungkin absen',
        mnemonic: 'Secara fisik bisa absen, tetapi tanggung jawab sosial membuatnya tidak boleh dilakukan.',
        speakText: '重要な会議があるので休むわけにはいかない',
      },
      {
        symbol: '顧客の個人情報を漏らすわけにはいかない',
        reading: 'kokyaku no kojin jouhou o morasu wake ni wa ikanai',
        meaning: 'Kita sama sekali tidak boleh membocorkan data pribadi pelanggan',
        mnemonic: '漏らす (morasu = membocorkan) menyoroti etika kepatuhan kerja.',
        speakText: '顧客の個人情報を漏らすわけにはいかない',
      },
      {
        symbol: '招待された以上、行かないわけにはいかない',
        reading: 'shoutai sareta ijou, ikanai wake ni wa ikanai',
        meaning: 'Karena sudah diundang, mau tidak mau saya harus datang',
        mnemonic: 'Negatif ganda (～ない + わけにはいかない) bermakna "terpaksa harus melakukan".',
        speakText: '招待された以上、行かないわけにはいかない',
      },
      {
        symbol: 'ここまで準備したのだから諦めるわけにはいかない',
        reading: 'koko made junbi shita no dakara akirameru wake ni wa ikanai',
        meaning: 'Karena sudah bersiap sejauh ini, tidak mungkin saya menyerah',
        mnemonic: 'Menunjukkan tekad kuat berdasarkan usaha yang telah dicurahkan.',
        speakText: 'ここまで準備したのだから諦めるわけにはいかない',
      },
    ],
    contrastiveTip:
      'Bedakan ～わけにはいかない (tidak bisa karena norma, tanggung jawab, atau perasaan) dengan ～ことができない (tidak bisa secara fisik atau kemampuan teknis).',
  },
  'n2-u4-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menyatakan Batasan & Komitmen Kerja',
    subtitle:
      'Latih membedakan penolakan berprinsip (V-るわけにはいかない) dan keharusan sosial (V-ないわけにはいかない) dalam percakapan kantor.',
    items: [
      {
        symbol: '責任者として黙っているわけにはいかない',
        reading: 'sekininsha to shite damatte iru wake ni wa ikanai',
        meaning: 'Sebagai penanggung jawab, saya tidak bisa tinggal diam',
        mnemonic: 'Bentuk ～ている juga bisa mendahului わけにはいかない (黙っているわけにはいかない).',
        speakText: '責任者として黙っているわけにはいかない',
      },
      {
        symbol: '上司に頼まれたら引き受けないわけにはいかない',
        reading: 'joushi ni tanomaretara hikiukenai wake ni wa ikanai',
        meaning: 'Kalau diminta atasan, mau tidak mau saya harus menyanggupinya',
        mnemonic: '引き受ける (hikiukeru = menerima tugas/tanggung jawab) dalam bentuk-ない.',
        speakText: '上司に頼まれたら引き受けないわけにはいかない',
      },
      {
        symbol: '運転があるのでお酒を飲むわけにはいきません',
        reading: 'unten ga aru node o-sake o nomu wake ni wa ikimasen',
        meaning: 'Karena harus menyetir, saya tidak boleh minum alkohol',
        mnemonic: 'Versi sopan ～わけにはいきません sangat natural untuk menolak tawaran dengan halus.',
        speakText: '運転があるのでお酒を飲むわけにはいきません',
      },
      {
        symbol: 'お世話になった方に挨拶しないわけにはいかない',
        reading: 'o-sewa ni natta kata ni aisatsu shinai wake ni wa ikanai',
        meaning: 'Saya wajib menyapa beliau yang telah banyak membantu saya',
        mnemonic: 'Mencerminkan tata krama sosial Jepang yang kuat terhadap pihak yang berjasa.',
        speakText: 'お世話になった方に挨拶しないわけにはいかない',
      },
    ],
    contrastiveTip:
      'Perhatikan perbedaan makna satu kata ない: 行くわけにはいかない = tidak boleh pergi, sedangkan 行かないわけにはいかない = harus pergi (tidak bisa tidak pergi).',
  },

  // Unit 5: GP-JA-N2-005 (～ざるを得ない)
  'n2-u5-baca-konteks': {
    headline: 'Baca Konteks: Keputusan Sulit, Krisis & Laporan Bisnis',
    subtitle:
      'Pelajari nuansa formal ～ざるを得ない yang menyatakan keterpaksaan mengambil langkah berat karena keadaan tidak memberi pilihan lain.',
    items: [
      {
        symbol: '赤字が続いたため閉店せざるを得なくなった',
        reading: 'akaji ga tsuzuita tame heiten sezaru o enaku natta',
        meaning: 'Karena terus merugi, terpaksa harus menutup toko',
        mnemonic: 'Pengecualian wajib: する menjadi せざるを得ない (bukan しざるを得ない).',
        speakText: '赤字が続いたため閉店せざるを得なくなった',
      },
      {
        symbol: '安全を優先し計画を変更せざるを得ない',
        reading: 'anzen o yuusen shi keikaku o henkou sezaru o enai',
        meaning: 'Demi mengutamakan keselamatan, kami terpaksa mengubah rencana',
        mnemonic: 'Sering dipakai dalam pernyataan resmi manajemen saat mengambil keputusan berat.',
        speakText: '安全を優先し計画を変更せざるを得ない',
      },
      {
        symbol: '証拠がある以上、事実を認めざるを得ない',
        reading: 'shouko ga aru ijou, jijitsu o mitomezaru o enai',
        meaning: 'Karena sudah ada bukti, mau tidak mau harus mengakui faktanya',
        mnemonic: '認める (Golongan 2): buang る tambah ざるを得ない menjadi 認めざるを得ない.',
        speakText: '証拠がある以上、事実を認めざるを得ない',
      },
      {
        symbol: '天候不良によりイベントを中止せざるを得なかった',
        reading: 'tenkou furyou ni yori ibento o chuushi sezaru o enakatta',
        meaning: 'Akibat cuaca buruk, acara terpaksa harus dibatalkan',
        mnemonic: 'Bentuk lampau ～ざるを得なかった dipakai untuk melaporkan keputusan yang telah diambil.',
        speakText: '天候不良によりイベントを中止せざるを得なかった',
      },
    ],
    contrastiveTip:
      'Hafalkan konjugasi khusus ～ざるを得ない: bentuk-ない tanpa ない + ざるを得ない, KECUALI する yang menjadi せざるを得ない (bukan しざるを得ない).',
  },
  'n2-u5-praktik-terpadu': {
    headline: 'Praktik Terpadu: Merumuskan Solusi Darurat & Negosiasi',
    subtitle:
      'Latih membentuk ～ざるを得ない untuk Golongan 1, 2, dan する dalam skenario penyesuaian anggaran, jadwal, dan kompromi kerja.',
    items: [
      {
        symbol: '予算不足のため規模を縮小せざるを得ない',
        reading: 'yosan busoku no tame kibo o shukushou sezaru o enai',
        meaning: 'Karena kekurangan anggaran, skala proyek terpaksa diperkecil',
        mnemonic: '縮小する (shukushou suru = memperkecil skala) berubah menjadi 縮小せざるを得ない.',
        speakText: '予算不足のため規模を縮小せざるを得ない',
      },
      {
        symbol: '時間が足りず、今回は諦めざるを得なかった',
        reading: 'jikan ga tarizu, konkai wa akiramezaru o enakatta',
        meaning: 'Karena waktu tidak cukup, kali ini saya terpaksa menyerah',
        mnemonic: '諦める menjadi 諦め + ざるを得なかった.',
        speakText: '時間が足りず、今回は諦めざるを得なかった',
      },
      {
        symbol: '故障が直らないため新しい機械を買わざるを得ない',
        reading: 'koshou ga naoranai tame atarashii kikai o kawazaru o enai',
        meaning: 'Karena kerusakannya tidak kunjung pulih, terpaksa membeli mesin baru',
        mnemonic: '買う (bentuk-ない: 買わない) menjadi 買わざるを得ない.',
        speakText: '故障が直らないため新しい機械を買わざるを得ない',
      },
      {
        symbol: '相手の条件を受け入れざるを得ない状況だ',
        reading: 'aite no jouken o ukeirezaru o enai joukyou da',
        meaning: 'Situasinya memaksa kami harus menerima syarat pihak lawan',
        mnemonic: '受け入れる (menerima syarat/usulan) menjadi 受け入れざるを得ない.',
        speakText: '相手の条件を受け入れざるを得ない状況だ',
      },
    ],
    contrastiveTip:
      'Dibanding ～ないわけにはいかない (tekanan sosial/perasaan), ～ざるを得ない lebih formal, tertulis, dan menekankan faktor eksternal yang benar-benar memaksa.',
  },

  // Unit 6: GP-JA-N2-006 (～にもかかわらず)
  'n2-u6-baca-konteks': {
    headline: 'Baca Konteks: Tajuk Berita Kontras & Surat Apresiasi',
    subtitle:
      'Pahami pemakaian ～にもかかわらず untuk menyatakan hasil tak terduga yang bertolak belakang dengan kondisi sebelumnya dalam teks formal N2.',
    items: [
      {
        symbol: '厳しい状況にもかかわらず黒字を達成した',
        reading: 'kibishii joukyou ni mo kakawarazu kuroji o tassei shita',
        meaning: 'Meskipun dalam situasi sulit, perusahaan berhasil mencetak laba',
        mnemonic: 'Kata benda (厳しい状況) langsung diikuti にもかかわらず tanpa だ.',
        speakText: '厳しい状況にもかかわらず黒字を達成した',
      },
      {
        symbol: '何度も注意したにもかかわらずミスが続いた',
        reading: 'nando mo chuui shita ni mo kakawarazu misu ga tsuzuita',
        meaning: 'Meskipun sudah berkali-kali diperingatkan, kesalahan tetap berlanjut',
        mnemonic: 'Kata kerja bentuk biasa (注意した) langsung diikuti にもかかわらず.',
        speakText: '何度も注意したにもかかわらずミスが続いた',
      },
      {
        symbol: 'お忙しいにもかかわらずお越しいただきありがとうございます',
        reading: 'o-isogashii ni mo kakawarazu o-koshi itadaki arigatou gozaimasu',
        meaning: 'Terima kasih telah berkenan hadir di tengah kesibukan Anda',
        mnemonic: 'Ungkapan sambutan sangat sopan kepada tamu penting atau klien.',
        speakText: 'お忙しいにもかかわらずお越しいただきありがとうございます',
      },
      {
        symbol: '雨が降っていたにもかかわらず大勢の観客が集まった',
        reading: 'ame ga futte ita ni mo kakawarazu oozei no kankyaku ga atsumatta',
        meaning: 'Meskipun hujan turun, banyak sekali penonton yang berkumpul',
        mnemonic: 'Menonjolkan rasa kagum atau heran atas hasil yang melampaui dugaan.',
        speakText: '雨が降っていたにもかかわらず大勢の観客が集まった',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～にもかかわらず (meskipun A, tetap terjadi B yang kontras) dengan ～にかかわらず (tanpa memandang A — berlaku untuk semua kategori, misalnya 年齢にかかわらず).',
  },
  'n2-u6-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menyatakan Kontras Kuat & Penghormatan',
    subtitle:
      'Latih menyusun kalimat kontras formal dengan ～にもかかわらず serta kata penghubung antarkalimat それにもかかわらず.',
    items: [
      {
        symbol: '未経験にもかかわらず即戦力として活躍している',
        reading: 'mikeiken ni mo kakawarazu sokusenryoku to shite katsuyaku shite iru',
        meaning: 'Meskipun tanpa pengalaman, ia langsung berkiprah sebagai tenaga siap pakai',
        mnemonic: 'Kata benda dan kata sifat-な langsung diikuti にもかかわらず (boleh juga である).',
        speakText: '未経験にもかかわらず即戦力として活躍している',
      },
      {
        symbol: '十分に準備した。それにもかかわらず失敗してしまった',
        reading: 'juubun ni junbi shita. sore ni mo kakawarazu shippai shite shimatta',
        meaning: 'Sudah bersiap matang. Meskipun demikian, tetap saja gagal',
        mnemonic: 'それにもかかわらず dipakai di awal kalimat kedua sebagai konjungsi resmi.',
        speakText: '十分に準備した。それにもかかわらず失敗してしまった',
      },
      {
        symbol: '深夜にもかかわらず丁寧に対応してくれた',
        reading: 'shinya ni mo kakawarazu teinei ni taiou shite kureta',
        meaning: 'Meskipun sudah larut malam, mereka tetap melayani dengan sopan',
        mnemonic: '深夜 (larut malam) kontras dengan layanan yang tetap prima.',
        speakText: '深夜にもかかわらず丁寧に対応してくれた',
      },
      {
        symbol: '価格が高いにもかかわらず予約が殺到している',
        reading: 'kakaku ga takai ni mo kakawarazu yoyaku ga sattou shite iru',
        meaning: 'Meskipun harganya mahal, pesanan tetap membanjiri',
        mnemonic: '殺到する (sattou suru = membanjiri/berbondong-bondong) sering muncul di berita N2.',
        speakText: '価格が高いにもかかわらず予約が殺到している',
      },
    ],
    contrastiveTip:
      'Jangan pernah menaruh な sebelum にもかかわらず untuk kata sifat-な (salah: 便利なにもかかわらず); gunakan langsung 便利にもかかわらず atau 便利であるにもかかわらず.',
  },

  // Unit 7: GP-JA-N2-007 (～上で)
  'n2-u7-baca-konteks': {
    headline: 'Baca Konteks: Prosedur Keputusan & Prinsip Profesional',
    subtitle:
      'Kuasai dua fungsi utama ～上で dalam dokumen bisnis N2: urutan "setelah melakukan A, barulah B" (V-た上で) dan syarat "dalam rangka/hal A" (V-る上で / Nの上で).',
    items: [
      {
        symbol: '規約をよく読んだ上で署名してください',
        reading: 'kiyaku o yoku yonda ue de shomei shite kudasai',
        meaning: 'Silakan tanda tangan setelah membaca syarat dan ketentuan dengan saksama',
        mnemonic: 'V-た + 上で menunjukkan langkah A wajib tuntas dulu sebelum melangkah ke B.',
        speakText: '規約をよく読んだ上で署名してください',
      },
      {
        symbol: '外国語を学ぶ上で発音の練習は欠かせない',
        reading: 'gaikokugo o manabu ue de hatsuon no renshuu wa kakasenai',
        meaning: 'Dalam mempelajari bahasa asing, latihan pelafalan tidak bisa dilewatkan',
        mnemonic: 'V-る + 上で (bentuk kamus) berarti "dalam hal / demi mencapai tujuan...".',
        speakText: '外国語を学ぶ上で発音の練習は欠かせない',
      },
      {
        symbol: '関係者と協議した上で結論を出します',
        reading: 'kankeisha to kyougi shita ue de ketsuron o dashimasu',
        meaning: 'Kami akan mengambil kesimpulan setelah bermusyawarah dengan pihak terkait',
        mnemonic: '協議する (kyougi suru = bermusyawarah resmi) sangat lazim pada rapat korporat.',
        speakText: '関係者と協議した上で結論を出します',
      },
      {
        symbol: '仕事の上での信頼関係を大切にしている',
        reading: 'shigoto no ue de no shinrai kankei o taisetsu ni shite iru',
        meaning: 'Saya menghargai hubungan saling percaya dalam lingkup pekerjaan',
        mnemonic: 'Kata benda + の上で (atau の上での + N) berarti "dalam hal / dari segi...".',
        speakText: '仕事の上での信頼関係を大切にしている',
      },
    ],
    contrastiveTip:
      'Perhatikan tense sebelum 上で: V-た上で berarti "setelah selesai A, lalu B", sedangkan V-る上で berarti "dalam hal/proses A, hal B sangat penting".',
  },
  'n2-u7-praktik-terpadu': {
    headline: 'Praktik Terpadu: Merancang Alur Keputusan & Evaluasi',
    subtitle:
      'Latih menggunakan V-た上で untuk alur kerja berurutan dan V-る上で / Nの上で untuk menjelaskan faktor kunci keberhasilan.',
    items: [
      {
        symbol: '現地を視察した上で計画を確定する',
        reading: 'genchi o shisatsu shita ue de keikaku o kakutei suru',
        meaning: 'Menetapkan rencana setelah meninjau langsung lokasi lapangan',
        mnemonic: '視察する (shisatsu suru = meninjau/inspeksi lapangan) mendahului keputusan final.',
        speakText: '現地を視察した上で計画を確定する',
      },
      {
        symbol: 'チームで働く上で情報共有が最も重要だ',
        reading: 'chiimu de hataraku ue de jouhou kyouyuu ga mottomo juuyou da',
        meaning: 'Dalam bekerja sebagai tim, berbagi informasi adalah hal terpenting',
        mnemonic: '働く (bentuk kamus) + 上で diikuti penilaian penting (重要だ, 必要だ, 役立つ).',
        speakText: 'チームで働く上で情報共有が最も重要だ',
      },
      {
        symbol: '予算と効果を比較した上で導入を決めた',
        reading: 'yosan to kouka o hikaku shita ue de dounyuu o kimeta',
        meaning: 'Memutuskan adopsi setelah membandingkan anggaran dan dampaknya',
        mnemonic: '比較した上で menunjukkan keputusan matang berbasis analisis, bukan impulsif.',
        speakText: '予算と効果を比較した上で導入を決めた',
      },
      {
        symbol: '健康管理の上で規則正しい生活が基本だ',
        reading: 'kenkou kanri no ue de kisokutadashii seikatsu ga kihon da',
        meaning: 'Dalam hal menjaga kesehatan, pola hidup teratur adalah dasarnya',
        mnemonic: 'Kata benda (健康管理) wajib memakai の sebelum 上で.',
        speakText: '健康管理の上で規則正しい生活が基本だ',
      },
    ],
    contrastiveTip:
      'Bedakan V-た上で (dua tindakan sadar/berbobot yang saling berlanjut oleh pelaku) dengan ～てから (urutan kronologis umum untuk kegiatan sehari-hari biasa).',
  },

  // Unit 8: GP-JA-N2-008 (～つつある)
  'n2-u8-baca-konteks': {
    headline: 'Baca Konteks: Laporan Transformasi & Pergeseran Zaman',
    subtitle:
      'Kenali gaya bahasa tulisan/berita ～つつある untuk menggambarkan perubahan bertahap yang sedang berlangsung di masyarakat dan industri.',
    items: [
      {
        symbol: '日本の働き方は大きく変わりつつある',
        reading: 'Nihon no hatarakikata wa ookiku kawaritsutsu aru',
        meaning: 'Cara kerja di Jepang sedang mengalami perubahan besar secara bertahap',
        mnemonic: 'Rumus: stem bentuk-ます (変わり) + つつある untuk proses perubahan aktif.',
        speakText: '日本の働き方は大きく変わりつつある',
      },
      {
        symbol: '地域の経済は徐々に回復しつつある',
        reading: 'chiiki no keizai wa jojo ni kaifuku shitsutsu aru',
        meaning: 'Perekonomian daerah perlahan sedang pulih',
        mnemonic: '徐々に (jojo ni = secara bertahap) sering menjadi petunjuk pasangan ～つつある.',
        speakText: '地域の経済は徐々に回復しつつある',
      },
      {
        symbol: '伝統的な技術が失われつつある',
        reading: 'dentouteki na gijutsu ga ushinawaretsutsu aru',
        meaning: 'Keahlian tradisional perlahan mulai punah/hilang',
        mnemonic: 'Dapat digabung dengan bentuk pasif (失われる menjadi 失われつつある).',
        speakText: '伝統的な技術が失われつつある',
      },
      {
        symbol: 'キャッシュレス決済が急速に普及しつつある',
        reading: 'kyasshuresu kessai ga kyuusoku ni fukyuu shitsutsu aru',
        meaning: 'Pembayaran nontunai sedang menyebar dengan pesat',
        mnemonic: '急速に (dengan pesat) menggambarkan laju tren yang sedang berjalan.',
        speakText: 'キャッシュレス決済が急速に普及しつつある',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～つつある (sedang berubah secara bertahap) dengan ～つつも (meskipun merasa/tahu A, tetap melakukan B yang berlawanan).',
  },
  'n2-u8-praktik-terpadu': {
    headline: 'Praktik Terpadu: Mendeskripsikan Tren & Kemajuan Proyek',
    subtitle:
      'Latih merangkai laporan kemajuan dan pengamatan tren modern memakai ～つつある dengan kata kerja perubahan yang tepat.',
    items: [
      {
        symbol: '新しい施設は完成に近づきつつある',
        reading: 'atarashii shisetsu wa kansei ni chikazukitsutsu aru',
        meaning: 'Fasilitas baru tersebut sedang semakin mendekati penyelesaian',
        mnemonic: '近づく (mendekati) -> stem 近づき + つつある.',
        speakText: '新しい施設は完成に近づきつつある',
      },
      {
        symbol: '環境への意識が社会全体で高まりつつある',
        reading: 'kankyou e no ishiki ga shakai zentai de takamaritsutsu aru',
        meaning: 'Kesadaran terhadap lingkungan sedang meningkat di seluruh masyarakat',
        mnemonic: '高まる (meningkat secara alami) sangat cocok dengan pola ～つつある.',
        speakText: '環境への意識が社会全体で高まりつつある',
      },
      {
        symbol: '課題は少しずつ改善されつつあります',
        reading: 'kadai wa sukoshizutsu kaizen saretsutsu arimasu',
        meaning: 'Permasalahannya sedikit demi sedikit sedang diperbaiki',
        mnemonic: 'Bentuk sopan ～つつあります sangat cocok untuk laporan progres kepada manajemen.',
        speakText: '課題は少しずつ改善されつつあります',
      },
      {
        symbol: '消費者のニーズは年々多様化しつつある',
        reading: 'shouhisha no niizu wa nennen tayouka shitsutsu aru',
        meaning: 'Kebutuhan konsumen kian beragam dari tahun ke tahun',
        mnemonic: '年々 (nennen = dari tahun ke tahun) menegaskan tren jangka panjang.',
        speakText: '消費者のニーズは年々多様化しつつある',
      },
    ],
    contrastiveTip:
      'Pola ～つつある hanya cocok dengan kata kerja yang bermakna perubahan atau progres (変わる, 増える, 進む, 回復する), bukan aksi sesaat seperti 食べる atau 起きる.',
  },

  // Unit 9: GP-JA-N2-009 (～かねない)
  'n2-u9-baca-konteks': {
    headline: 'Baca Konteks: Peringatan Risiko & Analisis Dampak Negatif',
    subtitle:
      'Pahami nuansa kekhawatiran ～かねない dalam laporan manajemen risiko, berita keselamatan, dan tajuk peringatan N2.',
    items: [
      {
        symbol: '小さなミスが大事故につながりかねない',
        reading: 'chiisana misu ga daijiko ni tsunagarikanenai',
        meaning: 'Kesalahan kecil berpotensi memicu kecelakaan besar',
        mnemonic: 'Rumus: stem bentuk-ます (つながり) + かねない, khusus untuk kemungkinan BURUK.',
        speakText: '小さなミスが大事故につながりかねない',
      },
      {
        symbol: '対応が遅れれば信用を失いかねない',
        reading: 'taiou ga okurereba shinyou o ushinaikanenai',
        meaning: 'Jika penanganan terlambat, kita bisa kehilangan kepercayaan',
        mnemonic: '失う (kehilangan) -> stem 失い + かねない.',
        speakText: '対応が遅れれば信用を失いかねない',
      },
      {
        symbol: '無理な働き方は体調を崩しかねない',
        reading: 'muri na hatarakikata wa taichou o kuzushikanenai',
        meaning: 'Pola kerja berlebihan berisiko merusak kondisi kesehatan',
        mnemonic: '体調を崩す (taichou o kuzusu) adalah kolokasi baku untuk jatuh sakit/drop.',
        speakText: '無理な働き方は体調を崩しかねない',
      },
      {
        symbol: '誤った情報が誤解を招きかねない',
        reading: 'ayamatta jouhou ga gokai o manekikanenai',
        meaning: 'Informasi keliru berpotensi mengundang kesalahpahaman',
        mnemonic: '誤解を招く (mengundang salah paham) adalah frasa wajib berita dan bisnis N2.',
        speakText: '誤った情報が誤解を招きかねない',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～かねない (berisiko terjadi hal buruk) dengan ～かねる (sulit/tidak sanggup melakukan — penolakan halus bisnis, misalnya お答えしかねます).',
  },
  'n2-u9-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menyampaikan Peringatan & Mitigasi Risiko',
    subtitle:
      'Latih mengemukakan potensi bahaya dan dampak buruk secara profesional memakai ～かねない dalam diskusi keselamatan dan proyek.',
    items: [
      {
        symbol: 'このまま放置すれば問題が深刻化しかねない',
        reading: 'kono mama houchi sureba mondai ga shinkokuka shikanenai',
        meaning: 'Jika dibiarkan begini, masalahnya bisa semakin parah',
        mnemonic: '放置する (membiarkan terbengkalai) + 深刻化しかねない (berisiko memburuk).',
        speakText: 'このまま放置すれば問題が深刻化しかねない',
      },
      {
        symbol: '点検を怠ると故障を引き起こしかねない',
        reading: 'tenken o okotaru to koshou o hikiokoshikanenai',
        meaning: 'Jika melalaikan pemeriksaan, hal itu bisa memicu kerusakan',
        mnemonic: '怠る (okotaru = melalaikan kewajiban) berpasangan erat dengan peringatan risiko.',
        speakText: '点検を怠ると故障を引き起こしかねない',
      },
      {
        symbol: '管理が甘いと情報が漏洩しかねません',
        reading: 'kanri ga amai to jouhou ga roueishikanemasen',
        meaning: 'Jika pengelolaan longgar, informasi berisiko bocor',
        mnemonic: 'Bentuk sopan ～かねません dipakai saat memberi peringatan di rapat kantor.',
        speakText: '管理が甘いと情報が漏洩しかねません',
      },
      {
        symbol: '軽率な発言は信頼関係を壊しかねない',
        reading: 'keisotsu na hatsugen wa shinrai kankei o kowashikanenai',
        meaning: 'Ucapan yang gegabah berpotensi merusak hubungan kepercayaan',
        mnemonic: '軽率 (keisotsu = gegabah/kurang pertimbangan) adalah kosakata kunci N2.',
        speakText: '軽率な発言は信頼関係を壊しかねない',
      },
    ],
    contrastiveTip:
      'Jangan pernah menggunakan ～かねない untuk kemungkinan yang menggembirakan seperti lulus ujian atau menang undian; gunakan ～可能性がある untuk kemungkinan netral/positif.',
  },

  // Unit 10: GP-JA-N2-010 (Sonkeigo Baku)
  'n2-u10-baca-konteks': {
    headline: 'Baca Konteks: Korespondensi Klien & Protokol Sonkeigo N2',
    subtitle:
      'Pahami struktur bahasa hormat (Sonkeigo) untuk meninggikan tindakan klien, atasan, dan tamu dalam email bisnis serta dialog layanan.',
    items: [
      {
        symbol: '添付資料をご覧になりましたか',
        reading: 'tenpu shiryou o go-ran ni narimashita ka',
        meaning: 'Apakah Anda sudah berkenan melihat berkas lampirannya?',
        mnemonic: 'ご覧になる adalah bentuk Sonkeigo khusus untuk 見る (melihat/membaca).',
        speakText: '添付資料をご覧になりましたか',
      },
      {
        symbol: '社長は先ほどお戻りになりました',
        reading: 'shachou wa sakihodo o-modori ni narimashita',
        meaning: 'Direktur baru saja kembali',
        mnemonic: 'Rumus Sonkeigo baku: お + stem kata kerja (戻り) + になる.',
        speakText: '社長は先ほどお戻りになりました',
      },
      {
        symbol: 'ご不明な点がございましたらお尋ねください',
        reading: 'go-fumei na ten ga gozaimashitara o-tazune kudasai',
        meaning: 'Apabila ada hal yang kurang jelas, silakan bertanya',
        mnemonic: 'お + stem + ください adalah bentuk permintaan sopan berlevel Sonkeigo.',
        speakText: 'ご不明な点がございましたらお尋ねください',
      },
      {
        symbol: '部長がおっしゃった通りに進めます',
        reading: 'buchou ga osshatta toori ni susumemasu',
        meaning: 'Saya akan melanjutkannya sesuai dengan yang disampaikan Kepala Bagian',
        mnemonic: 'おっしゃる adalah Sonkeigo khusus dari 言う (berkata).',
        speakText: '部長がおっしゃった通りに進めます',
      },
    ],
    contrastiveTip:
      'Hati-hati terhadap Keigo ganda (二重敬語): jangan menulis お読みになられる atau ご覧になられる; cukup お読みになる dan ご覧になる.',
  },
  'n2-u10-praktik-terpadu': {
    headline: 'Praktik Terpadu: Komunikasi Eksekutif & Penutup JLPT N2',
    subtitle:
      'Latih membedakan Sonkeigo (untuk lawan bicara/atasan) dan Kenjougo (untuk diri sendiri) dalam skenario rapat dan penyambutan tamu N2.',
    items: [
      {
        symbol: '本日はお越しくださり誠にありがとうございます',
        reading: 'honjitsu wa o-koshi kudasari makoto ni arigatou gozaimasu',
        meaning: 'Terima kasih banyak telah berkenan hadir pada hari ini',
        mnemonic: 'お越しくださる adalah bentuk hormat sangat tinggi untuk kedatangan tamu.',
        speakText: '本日はお越しくださり誠にありがとうございます',
      },
      {
        symbol: 'こちらの件をご存じでしょうか',
        reading: 'kochira no ken o go-zonji deshou ka',
        meaning: 'Apakah Anda mengetahui perihal ini?',
        mnemonic: 'ご存じ (go-zonji) adalah Sonkeigo khusus dari 知っている; jangan pakai ご存じます.',
        speakText: 'こちらの件をご存じでしょうか',
      },
      {
        symbol: 'どうぞこちらにお掛けください',
        reading: 'douzo kochira ni o-kake kudasai',
        meaning: 'Silakan duduk di sebelah sini',
        mnemonic: 'お掛けください berasal dari 掛ける (duduk di kursi), lebih halus dari お座りください.',
        speakText: 'どうぞこちらにお掛けください',
      },
      {
        symbol: '先生は今研究室にいらっしゃいます',
        reading: 'sensei wa ima kenkyuushitsu ni irasshaimasu',
        meaning: 'Profesor saat ini sedang berada di ruang riset',
        mnemonic: 'いらっしゃる adalah Sonkeigo serbaguna untuk いる (berada), 行く (pergi), dan 来る (datang).',
        speakText: '先生は今研究室にいらっしゃいます',
      },
    ],
    contrastiveTip:
      'Saat berbicara dengan pihak luar (klien), anggota perusahaan sendiri termasuk kelompok dalam (内), sehingga tindakan direktur kita diceritakan memakai bentuk biasa/Kenjougo, bukan Sonkeigo.',
  },

  // =========================================================================
  // JLPT N1 EXPANSION — 20 DECKS (baca-konteks & praktik-terpadu, U1..U10)
  // =========================================================================

  // Unit 1: GP-JA-N1-001 (～に至って / ～に至っては / ～に至るまで)
  'n1-u1-baca-konteks': {
    headline: 'Baca Konteks: Tajuk Analisis Krisis & Laporan Investigasi',
    subtitle:
      'Telaah nuansa tinggi ～に至って (mencapai titik genting), ～に至っては (contoh paling ekstrem), dan ～に至るまで (mencakup hingga detail terkecil) dalam editorial N1.',
    items: [
      {
        symbol: '事態がここに至っては抜本的な改革が不可欠だ',
        reading: 'jitai ga koko ni itatte wa bapponteki na kaikaku ga fukaketsu da',
        meaning: 'Setelah situasi sampai ke titik ini, reformasi menyeluruh tak terelakkan',
        mnemonic: 'ここに至っては menandakan titik kritis yang tidak bisa ditangani lagi secara biasa.',
        speakText: '事態がここに至っては抜本的な改革が不可欠だ',
      },
      {
        symbol: '交渉は難航し、ついに決裂するに至った',
        reading: 'koushou wa nankou shi, tsuini ketsuretsu suru ni itatta',
        meaning: 'Negosiasi berjalan alot dan akhirnya berujung pada kebuntuan/putus',
        mnemonic: 'V-る + に至った menggambarkan akhir perjalanan panjang yang menuju satu hasil puncak.',
        speakText: '交渉は難航し、ついに決裂するに至った',
      },
      {
        symbol: '企画から運営に至るまで一貫して担当した',
        reading: 'kikaku kara unei ni itaru made ikkan shite tantou shita',
        meaning: 'Menangani secara konsisten mulai dari perencanaan hingga operasional',
        mnemonic: 'A から B に至るまで menyoroti rentang cakupan luas sampai hal terjauh.',
        speakText: '企画から運営に至るまで一貫して担当した',
      },
      {
        symbol: '問題が表面化するに至ってようやく対策が講じられた',
        reading: 'mondai ga hyoumenka suru ni itatte youyaku taisaku ga koujirareta',
        meaning: 'Baru setelah masalah mencuat ke permukaan, langkah penanganan diambil',
        mnemonic: 'Sering berpasangan dengan ようやく (akhirnya) untuk mengkritik respons yang terlambat.',
        speakText: '問題が表面化するに至ってようやく対策が講じられた',
      },
    ],
    contrastiveTip:
      'Bedakan ～に至って (baru pada tahap genting itu terjadi perubahan) dengan ～に至っては (menyoroti satu contoh paling ekstrem/parah di antara banyak kasus).',
  },
  'n1-u1-praktik-terpadu': {
    headline: 'Praktik Terpadu: Merangkum Kronologi & Analisis Mendalam N1',
    subtitle:
      'Latih menggunakan ～に至った経緯, ～に至るまで, dan ～に至っては dalam presentasi eksekutif dan penulisan esai formal N1.',
    items: [
      {
        symbol: '今回の決定に至った経緯を説明する',
        reading: 'konkai no kettei ni itatta keii o setsumei suru',
        meaning: 'Menjelaskan kronologi yang melatarbelakangi keputusan kali ini',
        mnemonic: '決定に至った経緯 adalah frasa standar konferensi pers dan laporan dewan direksi.',
        speakText: '今回の決定に至った経緯を説明する',
      },
      {
        symbol: '細部に至るまで徹底的に検証した',
        reading: 'saibu ni itaru made tetteiteki ni kenshou shita',
        meaning: 'Memverifikasi secara menyeluruh hingga ke detail terkecil',
        mnemonic: '細部 (saibu = rincian halus) + に至るまで menekankan ketelitian penuh.',
        speakText: '細部に至るまで徹底的に検証した',
      },
      {
        symbol: '一部の地域に至っては停電が三日も続いた',
        reading: 'ichibu no chiiki ni itatte wa teiden ga mikka mo tsuzuita',
        meaning: 'Bahkan di sebagian wilayah, pemadaman listrik berlangsung hingga tiga hari',
        mnemonic: '～に至っては mengangkat kasus paling ekstrem dari sebuah peristiwa.',
        speakText: '一部の地域に至っては停電が三日も続いた',
      },
      {
        symbol: '長年の研究が実を結び、実用化に至った',
        reading: 'naganen no kenkyuu ga mi o musubi, jitsuyouka ni itatta',
        meaning: 'Riset bertahun-tahun membuahkan hasil hingga mencapai tahap penerapan nyata',
        mnemonic: '実を結ぶ (membuahkan hasil) + 実用化に至った menunjukkan pencapaian puncak.',
        speakText: '長年の研究が実を結び、実用化に至った',
      },
    ],
    contrastiveTip:
      'Jangan pakai ～に至って untuk kejadian sepele sehari-hari; pola ini berregister sastra/jurnalistik tinggi untuk proses panjang atau situasi serius.',
  },

  // Unit 2: GP-JA-N1-002 (～を余儀なくされる / ～を余儀なくさせる)
  'n1-u2-baca-konteks': {
    headline: 'Baca Konteks: Berita Bencana, Restrukturisasi & Kebijakan Darurat',
    subtitle:
      'Pahami struktur formal ～を余儀なくされる dalam laporan pers dan dokumen ekonomi saat pihak terkait terpaksa menempuh langkah di luar keinginan.',
    items: [
      {
        symbol: '記録的な豪雨により住民は避難を余儀なくされた',
        reading: 'kirokuteki na gouu ni yori juumin wa hinan o yoginaku sareta',
        meaning: 'Akibat hujan lebat memecahkan rekor, warga terpaksa mengungsi',
        mnemonic: 'Di depan を余儀なくされる wajib berbentuk Kata Benda peristiwa/tindakan (避難).',
        speakText: '記録的な豪雨により住民は避難を余儀なくされた',
      },
      {
        symbol: '業績悪化のため計画の大幅な見直しを余儀なくされた',
        reading: 'gyouseki akka no tame keikaku no oohaba na minaoshi o yoginaku sareta',
        meaning: 'Akibat kinerja memburuk, perusahaan terpaksa meninjau ulang rencana secara besar-besaran',
        mnemonic: '見直し (peninjauan ulang) adalah bentuk nomina dari verba 見直す.',
        speakText: '業績悪化のため計画の大幅な見直しを余儀なくされた',
      },
      {
        symbol: '怪我のため大会の棄権を余儀なくされた',
        reading: 'kega no tame taikai no kiken o yoginaku sareta',
        meaning: 'Karena cedera, ia terpaksa mundur dari turnamen',
        mnemonic: '棄権 (kiken = mengundurkan diri dari kompetisi/hak) sering dipasangkan dengan pola ini.',
        speakText: '怪我のため大会の棄権を余儀なくされた',
      },
      {
        symbol: '部品不足が自動車メーカーに減産を余儀なくさせた',
        reading: 'buhin busoku ga jidousha meekaa ni gensan o yoginaku saseta',
        meaning: 'Kelangkaan suku cadang memaksa produsen mobil memangkas produksi',
        mnemonic: 'Bentuk kausatif ～を余儀なくさせる menempatkan faktor penyebab sebagai subjek kalimat.',
        speakText: '部品不足が自動車メーカーに減産を余儀なくさせた',
      },
    ],
    contrastiveTip:
      'Ingat perbedaan struktur kelas kata: ～ざるを得ない memakai Kata Kerja (変更せざるを得ない), sedangkan ～を余儀なくされる wajib memakai Kata Benda (変更を余儀なくされる).',
  },
  'n1-u2-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menyusun Laporan Dampak & Respons Krisis',
    subtitle:
      'Latih membedakan bentuk pasif ～を余儀なくされる dan kausatif ～を余儀なくさせる untuk menyusun ringkasan berita dan memo krisis N1.',
    items: [
      {
        symbol: '施設の老朽化により一時閉館を余儀なくされた',
        reading: 'shisetsu no roukyuuka ni yori ichiji heikan o yoginaku sareta',
        meaning: 'Akibat penuaan bangunan fasilitas, penutupan sementara terpaksa dilakukan',
        mnemonic: '老朽化 (roukyuuka = penuaan/keusangan infrastruktur) adalah kosakata kunci N1.',
        speakText: '施設の老朽化により一時閉館を余儀なくされた',
      },
      {
        symbol: '急激な円安が企業の戦略転換を余儀なくさせた',
        reading: 'kyuugeki na enyasu ga kigyou no senryaku tenkan o yoginaku saseta',
        meaning: 'Pelemahan yen yang drastis memaksa perusahaan mengubah strategi',
        mnemonic: '戦略転換 (perubahan haluan strategi) adalah nomina sasaran kausatif.',
        speakText: '急激な円安が企業の戦略転換を余儀なくさせた',
      },
      {
        symbol: '資金難から事業からの撤退を余儀なくされている',
        reading: 'shikinnan kara jigyou kara no tettai o yoginaku sarete iru',
        meaning: 'Karena kesulitan dana, mereka terpaksa mundur dari lini bisnis tersebut',
        mnemonic: '～を余儀なくされている menggambarkan kondisi keterpaksaan yang masih berlangsung.',
        speakText: '資金難から事業からの撤退を余儀なくされている',
      },
      {
        symbol: '交通網の麻痺により多くの乗客が足止めを余儀なくされた',
        reading: 'koutsuumou no mahi ni yori ooku no joukyaku ga ashidome o yoginaku sareta',
        meaning: 'Akibat lumpuhnya jaringan transportasi, banyak penumpang terpaksa tertahan',
        mnemonic: '足止め (ashidome = tertahan tidak bisa melanjutkan perjalanan) khas berita cuaca/kereta.',
        speakText: '交通網の麻痺により多くの乗客が足止めを余儀なくされた',
      },
    ],
    contrastiveTip:
      'Jangan pakai ～を余儀なくされる untuk keterpaksaan sepele sehari-hari (misalnya lupa payung lalu beli payung); khusus untuk situasi berat, resmi, atau berskala besar.',
  },

  // Unit 3: GP-JA-N1-003 (～とはいえ / ～とはいうものの)
  'n1-u3-baca-konteks': {
    headline: 'Baca Konteks: Editorial Berimbang & Evaluasi Kritis',
    subtitle:
      'Amati cara penulis Jepang mengakui sebuah fakta lalu melontarkan catatan kritis menggunakan ～とはいえ dan ～とはいうものの dalam kolom opini N1.',
    items: [
      {
        symbol: '春になったとはいえ朝晩はまだ冷え込む',
        reading: 'haru ni natta to wa ie asaban wa mada hiekomu',
        meaning: 'Meskipun sudah masuk musim semi, pagi dan malam masih terasa dingin',
        mnemonic: 'Mengakui fakta A (sudah musim semi), lalu menekankan kenyataan B yang bertolak belakang.',
        speakText: '春になったとはいえ朝晩はまだ冷え込む',
      },
      {
        symbol: '効率化が進んだとはいうものの人手不足は深刻だ',
        reading: 'kouritsuka ga susunda to wa iu mono no hitode busoku wa shinkoku da',
        meaning: 'Meskipun efisiensi telah maju, kekurangan tenaga kerja tetap serius',
        mnemonic: '～とはいうものの bernuansa sedikit lebih lembut dan reflektif dibanding ～とはいえ.',
        speakText: '効率化が進んだとはいうものの人手不足は深刻だ',
      },
      {
        symbol: '暫定措置とはいえ影響は決して小さくない',
        reading: 'zantei sochi to wa ie eikyou wa kesshite chiisakunai',
        meaning: 'Meskipun hanya langkah sementara, dampaknya sama sekali tidak kecil',
        mnemonic: 'Kata benda (暫定措置) dapat langsung diikuti とはいえ tanpa だ.',
        speakText: '暫定措置とはいえ影響は決して小さくない',
      },
      {
        symbol: 'AIが発達したとはいえ最終判断は人間が担うべきだ',
        reading: 'AI ga hattatsu shita to wa ie saishuu handan wa ningen ga ninau beki da',
        meaning: 'Sekalipun AI telah berkembang, keputusan akhir tetap harus diemban manusia',
        mnemonic: '担う (ninau = memikul/mengemban tanggung jawab) lazim pada esai kebijakan N1.',
        speakText: 'AIが発達したとはいえ最終判断は人間が担うべきだ',
      },
    ],
    contrastiveTip:
      'Bedakan ～とはいえ (mengakui kebenaran fakta A secara objektif, tetapi menekankan batasannya di B) dengan ～にもかかわらず (kontras mengejutkan/di luar dugaan).',
  },
  'n1-u3-praktik-terpadu': {
    headline: 'Praktik Terpadu: Merumuskan Argumen Bernuansa & Konsesi',
    subtitle:
      'Latih menyusun kritik konstruktif dan evaluasi seimbang memakai ～とはいえ dalam rapat strategi, ulasan riset, dan esai N1.',
    items: [
      {
        symbol: '予算が限られているとはいえ品質を落とすわけにはいかない',
        reading: 'yosan ga kagirarete iru to wa ie hinshitsu o otosu wake ni wa ikanai',
        meaning: 'Meskipun anggaran terbatas, kita tidak boleh menurunkan kualitas',
        mnemonic: 'Kombinasi N1+N2 yang sangat elegan untuk rapat proyek dan negosiasi klien.',
        speakText: '予算が限られているとはいえ品質を落とすわけにはいかない',
      },
      {
        symbol: '慣れた作業とはいえ一瞬の油断も許されない',
        reading: 'nareta sagyou to wa ie isshun no yudan mo yurusarenai',
        meaning: 'Meskipun pekerjaan yang sudah biasa, lengah sesaat pun tidak diperbolehkan',
        mnemonic: '油断 (yudan = kelengahan) + 許されない sering dipakai dalam pengarahan keselamatan.',
        speakText: '慣れた作業とはいえ一瞬の油断も許されない',
      },
      {
        symbol: '自由参加とはいうものの実際には全員が出席した',
        reading: 'jiyuu sanka to wa iu mono no jissai ni wa zenin ga shusseki shita',
        meaning: 'Meski disebut partisipasi bebas, kenyataannya semua orang hadir',
        mnemonic: '実際には (pada kenyataannya) sering mengiringi ～とはいうものの.',
        speakText: '自由参加とはいうものの実際には全員が出席した',
      },
      {
        symbol: '小規模とはいえ地域経済への波及効果は大きい',
        reading: 'shoukibo to wa ie chiiki keizai e no hakyuu kouka wa ookii',
        meaning: 'Meski berskala kecil, efek berantainya terhadap ekonomi lokal sangat besar',
        mnemonic: '波及効果 (hakyuu kouka = efek domino/rembetan) adalah istilah ekonomi N1.',
        speakText: '小規模とはいえ地域経済への波及効果は大きい',
      },
    ],
    contrastiveTip:
      'Saat menyambung kata benda atau kata sifat-な ke とはいえ, bentuk paling alami dan rapi adalah tanpa だ (misalnya 事実とはいえ, 簡単とはいえ).',
  },

  // Unit 4: GP-JA-N1-004 (～をもって / ～をもちまして)
  'n1-u4-baca-konteks': {
    headline: 'Baca Konteks: Surat Resmi, Pemberitahuan & Penutupan Acara',
    subtitle:
      'Kenali dua fungsi resmi ～をもって dalam dokumen legal dan seremonial Jepang: batas waktu/penutupan resmi serta cara/sarana pelaksanaan.',
    items: [
      {
        symbol: '本月末をもちまして営業を終了いたします',
        reading: 'hongetsumatsu o mochimashite eigyou o shuuryou itashimasu',
        meaning: 'Terhitung akhir bulan ini, kami resmi mengakhiri operasional',
        mnemonic: '～をもちまして adalah bentuk ekstra sopan untuk pengumuman penutupan layanan/acara.',
        speakText: '本月末をもちまして営業を終了いたします',
      },
      {
        symbol: '選考結果は書面をもって通知いたします',
        reading: 'senkou kekka wa shomen o motte tsuuchi itashimasu',
        meaning: 'Hasil seleksi akan diberitahukan secara resmi melalui surat tertulis',
        mnemonic: 'Makna sarana/cara resmi: 書面をもって (melalui dokumen tertulis).',
        speakText: '選考結果は書面をもって通知いたします',
      },
      {
        symbol: '以上をもちまして閉会とさせていただきます',
        reading: 'ijou o mochimashite heikai to sasete itadakimasu',
        meaning: 'Dengan demikian, acara ini kami nyatakan resmi ditutup',
        mnemonic: 'Kalimat penutup wajib pembawa acara pada seminar, rapat umum, dan upacara Jepang.',
        speakText: '以上をもちまして閉会とさせていただきます',
      },
      {
        symbol: '誠意をもって対応することが信頼につながる',
        reading: 'seii o motte taiou suru koto ga shinrai ni tsunagaru',
        meaning: 'Menangani dengan ketulusan hati akan membangun kepercayaan',
        mnemonic: '誠意をもって (dengan itikad baik) menandakan sikap batin sebagai landasan tindakan.',
        speakText: '誠意をもって対応することが信頼につながる',
      },
    ],
    contrastiveTip:
      'Jangan pakai ～をもって untuk alat harian biasa (salah: 箸をもって食べる); pola ini khusus untuk sarana resmi/abstrak (書面, 誠意, 責任) atau batas waktu formal.',
  },
  'n1-u4-praktik-terpadu': {
    headline: 'Praktik Terpadu: Protokol Pengumuman & Korespondensi Formal',
    subtitle:
      'Latih menyusun kalimat pemberitahuan resmi, sambutan penutupan, dan pernyataan sikap kerja memakai ～をもって / ～をもちまして.',
    items: [
      {
        symbol: '本日午後五時をもって受付を締め切ります',
        reading: 'honjitsu gogo goji o motte uketsuke o shimekirimasu',
        meaning: 'Pendaftaran resmi ditutup tepat pukul 5 sore hari ini',
        mnemonic: 'Menandai batas waktu akhir secara tegas dan resmi pada pengumuman.',
        speakText: '本日午後五時をもって受付を締め切ります',
      },
      {
        symbol: '任期満了をもって退任することになりました',
        reading: 'ninki manryou o motte tainin suru koto ni narimashita',
        meaning: 'Dengan berakhirnya masa jabatan, saya akan mengundurkan diri dari jabatan',
        mnemonic: '任期満了 (berakhirnya masa jabatan) + をもって sangat baku di berita korporasi.',
        speakText: '任期満了をもって退任することになりました',
      },
      {
        symbol: '責任感をもって最後まで任務を遂行する',
        reading: 'sekininkan o motte saigo made ninmu o suikou suru',
        meaning: 'Menuntaskan tugas hingga akhir dengan penuh rasa tanggung jawab',
        mnemonic: '遂行する (suikou suru = melaksanakan tugas sampai tuntas) berregister tinggi N1.',
        speakText: '責任感をもって最後まで任務を遂行する',
      },
      {
        symbol: 'これをもちまして本日の説明会を終了いたします',
        reading: 'kore o mochimashite honjitsu no setsumeikai o shuuryou itashimasu',
        meaning: 'Dengan ini, sesi penjelasan hari ini kami akhiri',
        mnemonic: 'これをもちまして merujuk pada seluruh rangkaian acara yang baru selesai.',
        speakText: 'これをもちまして本日の説明会を終了いたします',
      },
    ],
    contrastiveTip:
      'Dalam bentuk lisan formal/pidato gunakan ～をもちまして, sedangkan dalam surat pengumuman, peraturan, atau artikel berita gunakan ～をもって.',
  },

  // Unit 5: GP-JA-N1-005 (～極まりない / ～極まる / ～の極み)
  'n1-u5-baca-konteks': {
    headline: 'Baca Konteks: Kritik Tajam, Opini Publik & Emosi Ekstrem',
    subtitle:
      'Pahami daya tekan retoris ～極まりない, ～極まる, dan ～の極み dalam tajuk kritik, pernyataan resmi, serta karya sastra N1.',
    items: [
      {
        symbol: '十分な検証もなく導入するのは無謀極まりない',
        reading: 'juubun na kenshou mo naku dounyuu suru no wa mubou kiwamarinai',
        meaning: 'Menerapkannya tanpa verifikasi memadai adalah tindakan yang teramat gegabah',
        mnemonic: 'Stem kata sifat-な (無謀) langsung diikuti 極まりない untuk intensitas paling puncak.',
        speakText: '十分な検証もなく導入するのは無謀極まりない',
      },
      {
        symbol: '説明責任を果たさない姿勢は遺憾極まりない',
        reading: 'setsumei sekinin o hatasanai shisei wa ikan kiwamarinai',
        meaning: 'Sikap tidak memenuhi tanggung jawab penjelasan sungguh teramat disayangkan',
        mnemonic: '遺憾極まりない adalah frasa klasik pernyataan resmi pemerintah dan editorial.',
        speakText: '説明責任を果たさない姿勢は遺憾極まりない',
      },
      {
        symbol: '長年の努力が報われ、感激の極みです',
        reading: 'naganen no doryoku ga mukuware, kangeki no kiwami desu',
        meaning: 'Usaha bertahun-tahun terbayar lunas, sungguh puncak keharuan',
        mnemonic: 'Kata benda emosi (感激, 光栄, 贅沢) + の極み menyatakan puncak perasaan atau keadaan.',
        speakText: '長年の努力が報われ、感激の極みです',
      },
      {
        symbol: '安全基準を無視した工事は危険極まりない',
        reading: 'anzen kijun o mushi shita kouji wa kiken kiwamarinai',
        meaning: 'Konstruksi yang mengabaikan standar keselamatan sungguh teramat berbahaya',
        mnemonic: '危険極まりない lebih kuat dan lebih formal daripada 非常に危険だ.',
        speakText: '安全基準を無視した工事は危険極まりない',
      },
    ],
    contrastiveTip:
      'Hati-hati: akhiran ない pada ～極まりない BUKAN bermakna negatif ("tidak"), melainkan bermakna "tak berbatas / sangat ekstrem" (sangat + kata sifat).',
  },
  'n1-u5-praktik-terpadu': {
    headline: 'Praktik Terpadu: Mengkritik Tegas & Mengekspresikan Puncak Rasa',
    subtitle:
      'Latih memilih pasangan kosakata yang tepat untuk ～極まりない, ～極まる, dan ～の極み sesuai nuansa kritik atau penghormatan.',
    items: [
      {
        symbol: '約束を直前に破るのは失礼極まりない',
        reading: 'yakusoku o chokuzen ni yaburu no wa shitsurei kiwamarinai',
        meaning: 'Membatalkan janji tepat di detik terakhir sungguh teramat tidak sopan',
        mnemonic: '失礼極まりない dipakai untuk mengecam pelanggaran etika yang sangat berat.',
        speakText: '約束を直前に破るのは失礼極まりない',
      },
      {
        symbol: '手続きが煩雑極まりなく改善が求められる',
        reading: 'tetsuzuki ga hanzatsu kiwamarinaku kaizen ga motomerareru',
        meaning: 'Prosedurnya teramat berbelit-belit sehingga perbaikan sangat dibutuhkan',
        mnemonic: '極まりない berkonjugasi seperti kata sifat-い (極まりなく untuk menyambung klausa).',
        speakText: '手続きが煩雑極まりなく改善が求められる',
      },
      {
        symbol: 'このような賞をいただき光栄の極みでございます',
        reading: 'kono you na shou o itadaki kouei no kiwami de gozaimasu',
        meaning: 'Menerima penghargaan seperti ini merupakan kehormatan tertinggi bagi saya',
        mnemonic: '光栄の極み (puncak kehormatan) adalah ungkapan pidato penerimaan penghargaan.',
        speakText: 'このような賞をいただき光栄の極みでございます',
      },
      {
        symbol: '未確認の情報を拡散するのは無責任極まりない',
        reading: 'mikakunin no jouhou o kakusan suru no wa musekinin kiwamarinai',
        meaning: 'Menyebarkan informasi yang belum terverifikasi sungguh teramat tidak bertanggung jawab',
        mnemonic: '無責任 (tidak bertanggung jawab) adalah pasangan alami ～極まりない.',
        speakText: '未確認の情報を拡散するのは無責任極まりない',
      },
    ],
    contrastiveTip:
      'Pola ～極まりない umumnya melekat pada kata sifat-な (危険, 失礼, 不愉快, 遺憾), bukan kata sifat-い fisik seperti 大きい atau 高い.',
  },

  // Unit 6: GP-JA-N1-006 (～なりに / ～なりの)
  'n1-u6-baca-konteks': {
    headline: 'Baca Konteks: Esai Refleksi, Empati & Kepemimpinan',
    subtitle:
      'Pahami kehalusan makna ～なりに dan ～なりの yang mengakui keterbatasan suatu pihak sekaligus menghargai usaha terbaik sesuai kapasitasnya.',
    items: [
      {
        symbol: '完璧ではないが自分なりに最善を尽くした',
        reading: 'kanpeki de wa nai ga jibun nari ni saizen o tsukushita',
        meaning: 'Memang belum sempurna, tetapi saya telah berusaha sebaik mungkin dengan cara saya sendiri',
        mnemonic: '自分なりに (dengan cara/kapasitas diri sendiri) bernuansa rendah hati sekaligus tulus.',
        speakText: '完璧ではないが自分なりに最善を尽くした',
      },
      {
        symbol: '新人には新人なりの視点があるものだ',
        reading: 'shinjin ni wa shinjin nari no shiten ga aru mono da',
        meaning: 'Karyawan baru pun memiliki sudut pandang khas sesuai posisinya',
        mnemonic: 'Jika menerangkan kata benda (視点), ubah menjadi ～なりの + N.',
        speakText: '新人には新人なりの視点があるものだ',
      },
      {
        symbol: '限られた予算なりに工夫して企画をまとめた',
        reading: 'kagirareta yosan nari ni kufuu shite kikaku o matometa',
        meaning: 'Kami menyusun rencana dengan berinovasi sesuai batas anggaran yang ada',
        mnemonic: 'Menunjukkan sikap realistis dan kreatif meski kondisi tidak ideal.',
        speakText: '限られた予算なりに工夫して企画をまとめた',
      },
      {
        symbol: 'どの世代にもその世代なりの苦労がある',
        reading: 'dono sedai ni mo sono sedai nari no kurou ga aru',
        meaning: 'Setiap generasi memiliki kesulitan tersendiri sesuai zamannya',
        mnemonic: 'Sering muncul dalam esai sosial untuk menumbuhkan saling pengertian lintas generasi.',
        speakText: 'どの世代にもその世代なりの苦労がある',
      },
    ],
    contrastiveTip:
      'Jangan tertukar ～なりに (sesuai kemampuan/posisi masing-masing, sering ada nuansa "meski belum ideal") dengan ～なりに terhadap atasan — hindari memuji atasan dengan 社長なりに karena bisa terkesan merendahkan.',
  },
  'n1-u6-praktik-terpadu': {
    headline: 'Praktik Terpadu: Menyampaikan Perspektif & Menghargai Proses',
    subtitle:
      'Latih merangkai kalimat empatik dan reflektif memakai ～なりに, ～なりの, serta struktur pengulangan A は A なりに.',
    items: [
      {
        symbol: '彼も彼なりにチームのことを考えている',
        reading: 'kare mo kare nari ni chiimu no koto o kangaete iru',
        meaning: 'Dia pun memikirkan tim dengan caranya sendiri',
        mnemonic: 'Pola pengulangan [A も A なりに] efektif untuk membela atau memahami sudut pandang orang lain.',
        speakText: '彼も彼なりにチームのことを考えている',
      },
      {
        symbol: '子供には子供なりの悩みがあることを忘れてはいけない',
        reading: 'kodomo ni wa kodomo nari no nayami ga aru koto o wasurete wa ikenai',
        meaning: 'Kita tidak boleh lupa bahwa anak-anak pun punya kekhawatiran sendiri',
        mnemonic: '子供なりの悩み berarti persoalan yang sesuai dengan dunia anak-anak.',
        speakText: '子供には子供なりの悩みがあることを忘れてはいけない',
      },
      {
        symbol: '地方都市には地方都市なりの魅力がある',
        reading: 'chihou toshi ni wa chihou toshi nari no miryoku ga aru',
        meaning: 'Kota daerah memiliki daya tariknya sendiri yang khas',
        mnemonic: 'Mengakui perbedaan dari kota besar sambil mengapresiasi keunikannya.',
        speakText: '地方都市には地方都市なりの魅力がある',
      },
      {
        symbol: '初心者なりに毎日少しずつ練習を続けている',
        reading: 'shoshinsha nari ni mainichi sukoshizutsu renshuu o tsuzukete iru',
        meaning: 'Sesuai kapasitas pemula, saya terus berlatih sedikit demi sedikit setiap hari',
        mnemonic: 'Kata benda (初心者) langsung disambung なりに tanpa の.',
        speakText: '初心者なりに毎日少しずつ練習を続けている',
      },
    ],
    contrastiveTip:
      'Aturan sambungan ～なりに sangat ringkas: Kata Benda langsung + なりに (tanpa の), misalnya 自分なりに, 私なりの意見.',
  },

  // Unit 7: GP-JA-N1-007 (～ずにはおかない / ～ないではおかない)
  'n1-u7-baca-konteks': {
    headline: 'Baca Konteks: Resensi Karya, Pidato & Dampak Sosial',
    subtitle:
      'Pahami kekuatan retoris ～ずにはおかない dalam ulasan seni, artikel budaya, dan berita yang menekankan dampak besar yang pasti timbul.',
    items: [
      {
        symbol: 'その映画は観る者に深い感動を与えずにはおかない',
        reading: 'sono eiga wa miru mono ni fukai kandou o ataezu ni wa okanai',
        meaning: 'Film itu pasti menggugah rasa haru yang mendalam bagi siapa pun yang menontonnya',
        mnemonic: 'Rumus: bentuk-ない tanpa ない + ずにはおかない (khusus する menjadi せずにはおかない).',
        speakText: 'その映画は観る者に深い感動を与えずにはおかない',
      },
      {
        symbol: '画期的な発明は社会のあり方を変えずにはおかない',
        reading: 'kakkiteki na hatsumei wa shakai no arikata o kaezu ni wa okanai',
        meaning: 'Penemuan terobosan itu pasti akan mengubah tatanan masyarakat',
        mnemonic: '画期的 (kakkiteki = revolusioner/terobosan) berpasangan alami dengan dampak tak terbendung.',
        speakText: '画期的な発明は社会のあり方を変えずにはおかない',
      },
      {
        symbol: 'あの発言は激しい反発を招かずにはおかなかった',
        reading: 'ano hatsugen wa hageshii hanpatsu o manekazu ni wa okanakatta',
        meaning: 'Pernyataan itu tak pelak lagi memicu penolakan keras',
        mnemonic: '招く (mengundang/memicu) -> 招かずにはおかなかった (bentuk lampau).',
        speakText: 'あの発言は激しい反発を招かずにはおかなかった',
      },
      {
        symbol: '真相を突き止めずにはおかない決意だ',
        reading: 'shinsou o tsukitomezu ni wa okanai ketsui da',
        meaning: 'Bertekad bulat untuk tidak akan berhenti sebelum mengungkap kebenaran',
        mnemonic: 'Jika subjeknya manusia, ～ずにはおかない juga bermakna tekad keras "pasti akan kulakukan".',
        speakText: '真相を突き止めずにはおかない決意だ',
      },
    ],
    contrastiveTip:
      'Bedakan ～ずにはおかない (pasti memicu dampak kuat pada orang lain / tekad tak tergoyahkan) dengan ～ずにはいられない (dorongan batin diri sendiri yang tak tertahankan, misalnya 笑わずにはいられない).',
  },
  'n1-u7-praktik-terpadu': {
    headline: 'Praktik Terpadu: Mengevaluasi Pengaruh & Menyatakan Tekad',
    subtitle:
      'Latih membedakan konjugasi ～ずにはおかない dan ～ないではおかない serta memilih kata kerja pemicu dampak yang alami di level N1.',
    items: [
      {
        symbol: '彼の熱意あふれる演説は聴衆の胸を打たずにはおかない',
        reading: 'kare no netsui afureru enzetsu wa choushuu no mune o utazu ni wa okanai',
        meaning: 'Pidatonya yang penuh semangat pasti menyentuh hati para pendengar',
        mnemonic: '胸を打つ (menyentuh hati) -> 胸を打たずにはおかない.',
        speakText: '彼の熱意あふれる演説は聴衆の胸を打たずにはおかない',
      },
      {
        symbol: 'この政策は賛否両論の議論を呼ばずにはおかない',
        reading: 'kono seisaku wa sanpi ryouron no giron o yobazu ni wa okanai',
        meaning: 'Kebijakan ini pasti akan memicu perdebatan pro dan kontra',
        mnemonic: '議論を呼ぶ (memicu perdebatan) adalah kolokasi media cetak N1.',
        speakText: 'この政策は賛否両論の議論を呼ばずにはおかない',
      },
      {
        symbol: 'その不祥事は利用者の信頼を揺るがさずにはおかなかった',
        reading: 'sono fushouji wa riyousha no shinrai o yurugasazu ni wa okanakatta',
        meaning: 'Skandal tersebut tak pelak lagi mengguncang kepercayaan pengguna',
        mnemonic: '揺るがす (mengguncang) -> 揺るがさずにはおかなかった.',
        speakText: 'その不祥事は利用者の信頼を揺るがさずにはおかなかった',
      },
      {
        symbol: '一度見たら忘れられない強烈な印象を残さずにはおかない',
        reading: 'ichido mitara wasurerarenai kyouretsu na inshou o nokosazu ni wa okanai',
        meaning: 'Pasti meninggalkan kesan mendalam yang tak terlupakan sekali melihatnya',
        mnemonic: '印象を残す (meninggalkan kesan) -> 印象を残さずにはおかない.',
        speakText: '一度見たら忘れられない強烈な印象を残さずにはおかない',
      },
    ],
    contrastiveTip:
      'Ingat pengecualian する pada pola ～ず: selalu menjadi せずにはおかない (bukan しずにはおかない), sama seperti せざるを得ない.',
  },

  // Unit 8: GP-JA-N1-008 (～ともなると / ～ともなれば)
  'n1-u8-baca-konteks': {
    headline: 'Baca Konteks: Skala Eksekutif, Industri & Perubahan Musim',
    subtitle:
      'Amati pemakaian ～ともなると dan ～ともなれば untuk menekankan konsekuensi khusus yang otomatis muncul begitu mencapai taraf, jabatan, atau skala tertentu.',
    items: [
      {
        symbol: '上場企業の経営者ともなると社会的責任も極めて重い',
        reading: 'joujou kigyou no keieisha to mo naru to shakaiteki sekinin mo kiwamete omoi',
        meaning: 'Kalau sudah menjadi pimpinan perusahaan terbuka, tanggung jawab sosialnya pun teramat berat',
        mnemonic: 'Menyoroti beban atau standar tinggi yang menyertai posisi prestisius.',
        speakText: '上場企業の経営者ともなると社会的責任も極めて重い',
      },
      {
        symbol: '国際大会ともなれば世界中から注目が集まる',
        reading: 'kokusai taikai to mo nareba sekaijuu kara chuumoku ga atsumaru',
        meaning: 'Jika skalanya sudah turnamen internasional, sorotan dari seluruh dunia pun tertuju ke sana',
        mnemonic: '～ともなれば memberi nuansa pengandaian yang sedikit lebih retoris daripada ～ともなると.',
        speakText: '国際大会ともなれば世界中から注目が集まる',
      },
      {
        symbol: '十二月ともなると朝は息が白くなるほど寒い',
        reading: 'juunigatsu to mo naru to asa wa iki ga shiroku naru hodo samui',
        meaning: 'Begitu memasuki bulan Desember, pagi hari sedingin sampai napas terlihat putih',
        mnemonic: 'Juga dipakai untuk musim atau waktu yang membawa perubahan suasana khas.',
        speakText: '十二月ともなると朝は息が白くなるほど寒い',
      },
      {
        symbol: 'プロの世界ともなるとわずかな差が勝敗を分ける',
        reading: 'puro no sekai to mo naru to wazuka na sa ga shouhai o wakeru',
        meaning: 'Di dunia profesional, selisih tipis pun menentukan menang dan kalah',
        mnemonic: '勝敗を分ける (menentukan kemenangan dan kekalahan) lazim pada ulasan kompetisi N1.',
        speakText: 'プロの世界ともなるとわずかな差が勝敗を分ける',
      },
    ],
    contrastiveTip:
      'Bedakan ～ともなると (khusus untuk taraf tinggi, skala besar, atau waktu puncak) dengan ～になると (perubahan kondisi biasa secara netral, misalnya 夕方になると涼しい).',
  },
  'n1-u8-praktik-terpadu': {
    headline: 'Praktik Terpadu: Membandingkan Standar & Skala Besar',
    subtitle:
      'Latih menyusun argumen mengenai ekspektasi jabatan, proyek nasional, dan kualitas kelas atas menggunakan ～ともなると / ～ともなれば.',
    items: [
      {
        symbol: '国家予算規模の事業ともなると議論が長期化する',
        reading: 'kokka yosan kibo no jigyou to mo naru to giron ga choukika suru',
        meaning: 'Jika sudah proyek berskala anggaran negara, pembahasannya pasti memakan waktu lama',
        mnemonic: '長期化する (berlangsung lama) adalah konsekuensi wajar proyek berskala raksasa.',
        speakText: '国家予算規模の事業ともなると議論が長期化する',
      },
      {
        symbol: 'ベテラン職人ともなれば音だけで不具合を見抜く',
        reading: 'beteran shokunin to mo nareba oto dake de fuguai o minuku',
        meaning: 'Kalau sudah pengrajin kawakan, ia mampu mengenali kerusakan hanya dari suaranya',
        mnemonic: '見抜く (minuku = melihat menembus/mengenali secara jeli) sangat pas untuk ahli.',
        speakText: 'ベテラン職人ともなれば音だけで不具合を見抜く',
      },
      {
        symbol: '五つ星ホテルともなると接客の質が格段に違う',
        reading: 'itsutsuboshi hoteru to mo naru to sekkyaku no shitsu ga kakudan ni chigau',
        meaning: 'Kalau sudah hotel bintang lima, mutu pelayanannya berbeda jauh sekali',
        mnemonic: '格段に (kakudan ni = jauh sekali/sangat nyata) memperkuat perbandingan kelas atas.',
        speakText: '五つ星ホテルともなると接客の質が格段に違う',
      },
      {
        symbol: '入社十年目ともなると後輩を指導する立場になる',
        reading: 'nyuusha juunenme to mo naru to kouhai o shidou suru tachiba ni naru',
        meaning: 'Begitu menginjak tahun kesepuluh bekerja, seseorang berada di posisi membimbing junior',
        mnemonic: 'Menunjukkan perubahan peran alami saat mencapai tonggak masa kerja tertentu.',
        speakText: '入社十年目ともなると後輩を指導する立場になる',
      },
    ],
    contrastiveTip:
      'Di depan ～ともなると hampir selalu berupa Kata Benda atau frasa tingkat/tahap (misalnya 部長ともなると, 大学卒業ともなると), bukan kata sifat.',
  },

  // Unit 9: GP-JA-N1-009 (～いかんによらず / ～いかんにかかわらず / ～いかんによっては)
  'n1-u9-baca-konteks': {
    headline: 'Baca Konteks: Klausul Hukum, Kebijakan & Kepatuhan Resmi',
    subtitle:
      'Kuasai perbedaan tegas antara ～いかんによらず / ～いかんにかかわらず (tanpa memandang) dan ～いかんによっては / ～いかんで (bergantung pada hasil/kondisi) dalam dokumen hukum N1.',
    items: [
      {
        symbol: '理由のいかんによらず無断欠勤は認められない',
        reading: 'riyuu no ikan ni yorazu mudan kekkin wa mitomerarenai',
        meaning: 'Tanpa memandang apa pun alasannya, absen tanpa izin tidak dapat diterima',
        mnemonic: 'N + (の) + いかんによらず menegaskan aturan mutlak tanpa pengecualian.',
        speakText: '理由のいかんによらず無断欠勤は認められない',
      },
      {
        symbol: '国籍や年齢のいかんにかかわらず応募できる',
        reading: 'kokuseki ya nenrei no ikan ni kakawarazu oubo dekiru',
        meaning: 'Siapa pun dapat melamar tanpa memandang kewarganegaraan maupun usia',
        mnemonic: '～いかんにかかわらず sangat sering hadir dalam pengumuman rekrutmen dan beasiswa.',
        speakText: '国籍や年齢のいかんにかかわらず応募できる',
      },
      {
        symbol: '検査結果のいかんによっては計画を見直す必要がある',
        reading: 'kensa kekka no ikan ni yotte wa keikaku o minaosu hitsuyou ga aru',
        meaning: 'Bergantung pada hasil pemeriksaan, rencana mungkin perlu ditinjau kembali',
        mnemonic: '～いかんによっては (berkebalikan makna!) berarti "tergantung pada bagaimana kondisi A".',
        speakText: '検査結果のいかんによっては計画を見直す必要がある',
      },
      {
        symbol: '今後の努力いかんで成果は大きく変わる',
        reading: 'kongo no doryoku ikan de seika wa ookiku kawaru',
        meaning: 'Bergantung pada usaha ke depan, hasilnya akan sangat berubah',
        mnemonic: '～いかんで / ～いかんだ menekankan bahwa faktor penentunya ada pada nomina di depan.',
        speakText: '今後の努力いかんで成果は大きく変わる',
      },
    ],
    contrastiveTip:
      'Jangan sampai terbalik di ujian JLPT N1: ～いかんによらず / ～いかんにかかわらず = TIDAK bergantung pada (tanpa memandang), sedangkan ～いかんで / ～いかんによっては = BERGANTUNG pada.',
  },
  'n1-u9-praktik-terpadu': {
    headline: 'Praktik Terpadu: Merumuskan Ketentuan & Prinsip Keadilan',
    subtitle:
      'Latih menerapkan ～いかんによらず, ～いかんにかかわらず, dan ～いかんによっては dalam syarat layanan, kode etik, dan laporan kebijakan.',
    items: [
      {
        symbol: '購入後の返品は理由のいかんを問わずお断りします',
        reading: 'kounyuugo no henpin wa riyuu no ikan o towazu o-kotowari shimasu',
        meaning: 'Pengembalian barang setelah pembelian kami tolak tanpa memandang alasannya',
        mnemonic: '～のいかんを問わず adalah varian resmi yang semakna dengan ～のいかんによらず.',
        speakText: '購入後の返品は理由のいかんを問わずお断りします',
      },
      {
        symbol: '役職のいかんにかかわらず規約を遵守すべきだ',
        reading: 'yakushoku no ikan ni kakawarazu kiyaku o junshu subeki da',
        meaning: 'Setiap orang wajib mematuhi peraturan tanpa memandang jabatannya',
        mnemonic: '遵守する (junshu suru = mematuhi aturan hukum/kode etik) adalah kosakata inti N1.',
        speakText: '役職のいかんにかかわらず規約を遵守すべきだ',
      },
      {
        symbol: '天候のいかんによっては日程を変更する場合がある',
        reading: 'tenkou no ikan ni yotte wa nittei o henkou suru baai ga aru',
        meaning: 'Bergantung pada kondisi cuaca, jadwal dapat diubah sewaktu-waktu',
        mnemonic: 'Sering berpasangan dengan ～場合がある pada surat edaran resmi.',
        speakText: '天候のいかんによっては日程を変更する場合がある',
      },
      {
        symbol: '成否は関係者の協力いかんにかかっている',
        reading: 'seihi wa kankeisha no kyouryoku ikan ni kakatte iru',
        meaning: 'Berhasil tidaknya bergantung sepenuhnya pada kerja sama para pihak terkait',
        mnemonic: '成否 (seihi = sukses atau gagal) + ～いかんにかかっている adalah frasa esai unggul.',
        speakText: '成否は関係者の協力いかんにかかっている',
      },
    ],
    contrastiveTip:
      'Partikel の sebelum いかん bersifat opsional (理由のいかんによらず maupun 理由いかんによらず keduanya baku dan sering muncul di soal N1).',
  },

  // Unit 10: GP-JA-N1-010 (～に足る / ～に足りない)
  'n1-u10-baca-konteks': {
    headline: 'Baca Konteks: Evaluasi Akademik, Kredibilitas & Penutup N1',
    subtitle:
      'Kuasai ungkapan penilaian bermartabat ～に足る (layak/patut) dan ～に足りない (tidak layak / remeh) dalam jurnal akademik, kritik ilmiah, dan laporan eksekutif.',
    items: [
      {
        symbol: '彼は全面的に信頼するに足る人物だ',
        reading: 'kare wa zenmenteki ni shinrai suru ni taru jinbutsu da',
        meaning: 'Ia adalah sosok yang layak dipercaya sepenuhnya',
        mnemonic: 'V-る / Kata Benda (信頼) + に足る menyatakan kualitas yang benar-benar memadai dan patut.',
        speakText: '彼は全面的に信頼するに足る人物だ',
      },
      {
        symbol: 'そんな些細なミスは気にするに足りない',
        reading: 'sonna sasai na misu wa ki ni suru ni tarinai',
        meaning: 'Kesalahan sepele seperti itu tidak layak untuk dikhawatirkan',
        mnemonic: '～に足りない (atau ～に足らない) menegaskan sesuatu terlalu kecil untuk dipersoalkan.',
        speakText: 'そんな些細なミスは気にするに足りない',
      },
      {
        symbol: 'この研究成果は国際的な評価に足るものだ',
        reading: 'kono kenkyuu seika wa kokusaiteki na hyouka ni taru mono da',
        meaning: 'Hasil riset ini layak mendapatkan pengakuan internasional',
        mnemonic: 'Kata benda suru (評価, 信頼, 注目, 尊敬) bisa langsung diikuti に足る.',
        speakText: 'この研究成果は国際的な評価に足るものだ',
      },
      {
        symbol: '根拠のない噂など取るに足りない',
        reading: 'konkyo no nai uwasa nado toru ni tarinai',
        meaning: 'Rumor tanpa dasar sama sekali tidak ada artinya / terlalu remeh',
        mnemonic: '取るに足りない adalah ungkapan idiomatik wajib N1 yang berarti "tidak berarti/remeh".',
        speakText: '根拠のない噂など取るに足りない',
      },
    ],
    contrastiveTip:
      'Bedakan ～に足る (layak karena memenuhi standar kepercayaan/kualitas tinggi) dengan ～に値する (bernilai tinggi atau setimpal untuk mendapat penghargaan/hukuman).',
  },
  'n1-u10-praktik-terpadu': {
    headline: 'Praktik Terpadu: Penilaian Kritis & Kesiapan Mastery JLPT N1',
    subtitle:
      'Latih membedakan ～に足る, ～に足りない, dan idiom 取るに足りない untuk menyusun penilaian objektif berkelas akademik sebagai penutup lintasan N1.',
    items: [
      {
        symbol: '長期的な投資に足るだけの将来性を備えている',
        reading: 'choukiteki na toushi ni taru dake no shouraisei o sonaete iru',
        meaning: 'Memiliki prospek masa depan yang cukup layak untuk investasi jangka panjang',
        mnemonic: '備えている (memiliki kualitas bawaan) berpasangan kuat dengan 投資に足る.',
        speakText: '長期的な投資に足るだけの将来性を備えている',
      },
      {
        symbol: '出所不明の主張は反論するに足りない',
        reading: 'shussho fumei no shuchou wa hanron suru ni tarinai',
        meaning: 'Klaim yang tidak jelas sumbernya tidak layak untuk dibantah',
        mnemonic: '反論するに足りない menandakan argumen lawan terlalu lemah untuk ditanggapi.',
        speakText: '出所不明の主張は反論するに足りない',
      },
      {
        symbol: '長年の実績は尊敬に足るものである',
        reading: 'naganen no jisseki wa sonkei ni taru mono de aru',
        meaning: 'Rekam jejak bertahun-tahun tersebut sungguh patut dihormati',
        mnemonic: '尊敬に足る (patut dihormati) adalah pujian tertinggi dalam register tulisan N1.',
        speakText: '長年の実績は尊敬に足るものである',
      },
      {
        symbol: '取るに足りない問題に時間を費やすべきではない',
        reading: 'toru ni tarinai mondai ni jikan o tsuiyasu beki de wa nai',
        meaning: 'Kita sebaiknya tidak menghabiskan waktu untuk persoalan yang remeh',
        mnemonic: '時間を費やす (menghabiskan waktu) sering dipadukan dengan 取るに足りない問題.',
        speakText: '取るに足りない問題に時間を費やすべきではない',
      },
    ],
    contrastiveTip:
      'Bentuk negatif ～に足りない dan ～に足らない memiliki arti yang sama persis; keduanya baku dan dapat muncul bergantian dalam teks ujian JLPT N1.',
  },
}

export const NODE_PREVIEWS_N4_N1_EXPANSION: Record<string, LevelNodePreviewInfo> = {
  // =========================================================================
  // JLPT N4 EXPANSION NODE PREVIEWS (20 Unit Lessons + 1 Readiness Mock Exam)
  // =========================================================================
  'n4-u1-baca-konteks': {
    chips: ['添付ファイル', 'お返事いただけませんか', 'Baca Memo Kantor'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-001',
  },
  'n4-u1-praktik-terpadu': {
    chips: ['お忙しいところ', '日程を変更', 'Praktik Permohonan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-001',
  },
  'n4-u2-baca-konteks': {
    chips: ['置いてあります', '貼ってあります', 'Laporan Ruangan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-002',
  },
  'n4-u2-praktik-terpadu': {
    chips: ['人数分コピー', '予約してあります', 'Praktik Kesiapan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-002',
  },
  'n4-u3-baca-konteks': {
    chips: ['ヘルメット着用', '期限までに提出', 'Panduan Aturan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-003',
  },
  'n4-u3-praktik-terpadu': {
    chips: ['出勤しなければ', '上司に報告', 'Praktik Kewajiban'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-003',
  },
  'n4-u4-baca-konteks': {
    chips: ['カードが使えます', '24時間利用できます', 'Brosur Fasilitas'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-004',
  },
  'n4-u4-praktik-terpadu': {
    chips: ['日本語が話せます', '来られますか', 'Praktik Potensial'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-004',
  },
  'n4-u5-baca-konteks': {
    chips: ['教えてくれました', '送ってもらいました', 'Kisah Kerja Sama'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-005',
  },
  'n4-u5-praktik-terpadu': {
    chips: ['手伝ってもらいました', '書いていただきました', 'Praktik Apresiasi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-005',
  },
  'n4-u6-baca-konteks': {
    chips: ['行ったほうがいい', '無理をしない', 'Panduan Kesehatan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-006',
  },
  'n4-u6-praktik-terpadu': {
    chips: ['事前に確認した', '歩かないほうがいい', 'Praktik Rekomendasi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-006',
  },
  'n4-u7-baca-konteks': {
    chips: ['休業いたしますので', '雨天なので', 'Pengumuman Resmi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-007',
  },
  'n4-u7-praktik-terpadu': {
    chips: ['体調が悪いので', '先に失礼します', 'Praktik Izin Sopan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-007',
  },
  'n4-u8-baca-konteks': {
    chips: ['ボタンを押したら', '駅に着いたら', 'Panduan Skenario'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-008',
  },
  'n4-u8-praktik-terpadu': {
    chips: ['時間ができたら', '暇だったら', 'Praktik Pengandaian'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-008',
  },
  'n4-u9-baca-konteks': {
    chips: ['読んでおきます', 'つけたままにしておく', 'Memo Persiapan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-009',
  },
  'n4-u9-praktik-terpadu': {
    chips: ['調べておきました', '手帳に書いておく', 'Praktik Antisipasi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-009',
  },
  'n4-u10-baca-konteks': {
    chips: ['お呼びいたします', '拝見いたしました', 'Email Kenjougo'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-010',
  },
  'n4-u10-praktik-terpadu': {
    chips: ['ご案内いたします', 'お電話いたします', 'Praktik Layanan N4'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N4-010',
  },
  'n4-readiness-mock-exam': {
    chips: ['Simulasi JLPT N4', 'Unit 1–10 Lengkap', 'Uji Kesiapan Resmi', 'Tanpa Bocoran'],
    showGrammarLink: true,
  },

  // =========================================================================
  // JLPT N3 EXPANSION NODE PREVIEWS (20 Unit Lessons + 1 Readiness Mock Exam)
  // =========================================================================
  'n3-u1-baca-konteks': {
    chips: ['歩くようにしています', '食べないように', 'Artikel Gaya Hidup'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-001',
  },
  'n3-u1-praktik-terpadu': {
    chips: ['遅刻しないように', 'ニュースを読む', 'Praktik Rutinitas'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-001',
  },
  'n3-u2-baca-konteks': {
    chips: ['転勤することになった', '禁煙ということ', 'Tata Tertib Kantor'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-002',
  },
  'n3-u2-praktik-terpadu': {
    chips: ['延期することになった', '前日に連絡', 'Praktik Pengumuman'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-002',
  },
  'n3-u3-baca-konteks': {
    chips: ['ご協力のおかげで', '先生のおかげです', 'Pidato Apresiasi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-003',
  },
  'n3-u3-praktik-terpadu': {
    chips: ['おかげさまで', '助けてくれたおかげ', 'Praktik Syukur'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-003',
  },
  'n3-u4-baca-konteks': {
    chips: ['大雪のせいで', '寝不足のせいか', 'Laporan Insiden'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-004',
  },
  'n3-u4-praktik-terpadu': {
    chips: ['全部私のせいです', '渋滞のせいで', 'Praktik Kendala'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-004',
  },
  'n3-u5-baca-konteks': {
    chips: ['お客様に対して', '新制度に対する意見', 'Opini & Kontras'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-005',
  },
  'n3-u5-praktik-terpadu': {
    chips: ['仕事に対して責任', '去年の売上に対して', 'Praktik Perbandingan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-005',
  },
  'n3-u6-baca-konteks': {
    chips: ['降らないうちに', '話しているうちに', 'Bacaan Pengalaman'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-006',
  },
  'n3-u6-praktik-terpadu': {
    chips: ['熱いうちに', '日本にいるうちに', 'Praktik Momen'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-006',
  },
  'n3-u7-baca-konteks': {
    chips: ['明日届くはずです', '間違えるはずがない', 'Logika & Verifikasi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-007',
  },
  'n3-u7-praktik-terpadu': {
    chips: ['送ったはずです', '始まるはずだった', 'Praktik Dugaan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-007',
  },
  'n3-u8-baca-konteks': {
    chips: ['建てられました', '雨に降られました', 'Berita & Pasif'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-008',
  },
  'n3-u8-praktik-terpadu': {
    chips: ['発表を褒められた', '招待されました', 'Praktik Pasif'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-008',
  },
  'n3-u9-baca-konteks': {
    chips: ['来たばかりで', '買ったばかりの傘', 'Kisah Adaptasi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-009',
  },
  'n3-u9-praktik-terpadu': {
    chips: ['配属されたばかり', '修理したばかりなのに', 'Praktik Situasi Baru'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-009',
  },
  'n3-u10-baca-konteks': {
    chips: ['国によって異なる', '台風による被害', 'Artikel Budaya'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-010',
  },
  'n3-u10-praktik-terpadu': {
    chips: ['話し合いによって', '季節によって変わる', 'Praktik Analisis N3'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N3-010',
  },
  'n3-readiness-mock-exam': {
    chips: ['Simulasi JLPT N3', 'Unit 1–10 Lengkap', 'Uji Kesiapan Resmi', 'Tanpa Bocoran'],
    showGrammarLink: true,
  },

  // =========================================================================
  // JLPT N2 EXPANSION NODE PREVIEWS (20 Unit Lessons + 1 Readiness Mock Exam)
  // =========================================================================
  'n2-u1-baca-konteks': {
    chips: ['新事業立ち上げ', '移転にあたり', '申請にあたっては', 'Siaran Pers'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-001',
  },
  'n2-u1-praktik-terpadu': {
    chips: ['プロジェクト開始', '着任にあたり', '新制度の導入', 'Proposal N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-001',
  },
  'n2-u2-baca-konteks': {
    chips: ['人口減少に伴って', 'システム更新に伴い', '高齢化に伴う', 'Berita Ekonomi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-002',
  },
  'n2-u2-praktik-terpadu': {
    chips: ['原材料の高騰', '事業拡大に伴う', '法律の改正に伴い', 'Analisis Tren'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-002',
  },
  'n2-u3-baca-konteks': {
    chips: ['日本に限らず', '幅広い世代', '何事も継続', 'Esai Global'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-003',
  },
  'n2-u3-praktik-terpadu': {
    chips: ['首都圏に限らず', '休日に限らず', '正社員に限らず', 'Argumen Inklusif'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-003',
  },
  'n2-u4-baca-konteks': {
    chips: ['休むわけにはいかない', '個人情報を漏らす', '行かないわけには', 'Etika Kerja'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-004',
  },
  'n2-u4-praktik-terpadu': {
    chips: ['黙っているわけには', '引き受けないわけには', '運転がある', 'Komitmen N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-004',
  },
  'n2-u5-baca-konteks': {
    chips: ['閉店せざるを得ない', '計画を変更', '事実を認めざる', 'Laporan Krisis'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-005',
  },
  'n2-u5-praktik-terpadu': {
    chips: ['規模を縮小', '買わざるを得ない', '条件を受け入れる', 'Solusi Darurat'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-005',
  },
  'n2-u6-baca-konteks': {
    chips: ['厳しい状況', 'お忙しいにもかかわらず', '黒字を達成', 'Berita Kontras'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-006',
  },
  'n2-u6-praktik-terpadu': {
    chips: ['未経験にもかかわらず', 'それにもかかわらず', '予約が殺到', 'Kontras Formal'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-006',
  },
  'n2-u7-baca-konteks': {
    chips: ['読んだ上で署名', '学ぶ上で欠かせない', '協議した上で', 'Prosedur Bisnis'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-007',
  },
  'n2-u7-praktik-terpadu': {
    chips: ['現地を視察', '情報共有が重要', '比較した上で', 'Alur Keputusan'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-007',
  },
  'n2-u8-baca-konteks': {
    chips: ['変わりつつある', '回復しつつある', '失われつつある', 'Transformasi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-008',
  },
  'n2-u8-praktik-terpadu': {
    chips: ['完成に近づきつつ', '改善されつつある', '多様化しつつある', 'Laporan Progres'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-008',
  },
  'n2-u9-baca-konteks': {
    chips: ['大事故につながり', '信用を失いかねない', '誤解を招きかねない', 'Peringatan Risiko'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-009',
  },
  'n2-u9-praktik-terpadu': {
    chips: ['深刻化しかねない', '故障を引き起こす', '情報が漏洩', 'Mitigasi Risiko'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-009',
  },
  'n2-u10-baca-konteks': {
    chips: ['ご覧になりましたか', 'お戻りになりました', 'お尋ねください', 'Email Sonkeigo'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-010',
  },
  'n2-u10-praktik-terpadu': {
    chips: ['お越しくださり', 'ご存じでしょうか', 'お掛けください', 'Komunikasi N2'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N2-010',
  },
  'n2-readiness-mock-exam': {
    chips: ['Simulasi JLPT N2', 'Unit 1–10 Lengkap', 'Uji Kesiapan Resmi', 'Tanpa Bocoran'],
    showGrammarLink: true,
  },

  // =========================================================================
  // JLPT N1 EXPANSION NODE PREVIEWS (20 Unit Lessons + 1 Readiness Mock Exam)
  // =========================================================================
  'n1-u1-baca-konteks': {
    chips: ['ここに至っては', '決裂するに至った', '企画から運営に至る', 'Editorial Krisis'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-001',
  },
  'n1-u1-praktik-terpadu': {
    chips: ['決定に至った経緯', '細部に至るまで', '実用化に至った', 'Analisis N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-001',
  },
  'n1-u2-baca-konteks': {
    chips: ['避難を余儀なく', '大幅な見直し', '減産を余儀なくさせ', 'Berita Darurat'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-002',
  },
  'n1-u2-praktik-terpadu': {
    chips: ['一時閉館', '戦略転換', '足止めを余儀なく', 'Laporan Krisis'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-002',
  },
  'n1-u3-baca-konteks': {
    chips: ['春になったとはいえ', 'とはいうものの', '暫定措置とはいえ', 'Kolom Opini'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-003',
  },
  'n1-u3-praktik-terpadu': {
    chips: ['予算が限られる', '一瞬の油断', '波及効果', 'Argumen Kritis'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-003',
  },
  'n1-u4-baca-konteks': {
    chips: ['本月末をもちまして', '書面をもって通知', '誠意をもって', 'Surat Resmi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-004',
  },
  'n1-u4-praktik-terpadu': {
    chips: ['午後五時をもって', '任期満了をもって', '任務を遂行', 'Protokol Acara'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-004',
  },
  'n1-u5-baca-konteks': {
    chips: ['無謀極まりない', '遺憾極まりない', '感激の極み', 'Kritik Tajam'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-005',
  },
  'n1-u5-praktik-terpadu': {
    chips: ['失礼極まりない', '煩雑極まりなく', '光栄の極み', 'Retorika N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-005',
  },
  'n1-u6-baca-konteks': {
    chips: ['自分なりに最善', '新人なりの視点', '予算なりに工夫', 'Esai Refleksi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-006',
  },
  'n1-u6-praktik-terpadu': {
    chips: ['彼も彼なりに', '子供なりの悩み', '初心者なりに', 'Empati & Proses'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-006',
  },
  'n1-u7-baca-konteks': {
    chips: ['感動を与えずには', '反発を招かずには', '真相を突き止め', 'Resensi & Dampak'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-007',
  },
  'n1-u7-praktik-terpadu': {
    chips: ['胸を打たずには', '議論を呼ばずには', '信頼を揺るがさず', 'Evaluasi Dampak'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-007',
  },
  'n1-u8-baca-konteks': {
    chips: ['経営者ともなると', '国際大会ともなれば', 'プロの世界', 'Skala Eksekutif'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-008',
  },
  'n1-u8-praktik-terpadu': {
    chips: ['国家予算規模', 'ベテラン職人', '五つ星ホテル', 'Standar Tinggi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-008',
  },
  'n1-u9-baca-konteks': {
    chips: ['理由のいかんによらず', '年齢のいかんにかかわらず', '結果のいかんによって', 'Klausul Hukum'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-009',
  },
  'n1-u9-praktik-terpadu': {
    chips: ['いかんを問わず', '規約を遵守', '協力いかんにかかる', 'Kepatuhan Resmi'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-009',
  },
  'n1-u10-baca-konteks': {
    chips: ['信頼するに足る', '気にするに足りない', '取るに足りない', 'Evaluasi Akademik'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-010',
  },
  'n1-u10-praktik-terpadu': {
    chips: ['投資に足る', '反論するに足りない', '尊敬に足る', 'Mastery N1'],
    showGrammarLink: true,
    grammarCode: 'GP-JA-N1-010',
  },
  'n1-readiness-mock-exam': {
    chips: ['Simulasi JLPT N1', 'Unit 1–10 Lengkap', 'Uji Kesiapan Resmi', 'Tanpa Bocoran'],
    showGrammarLink: true,
  },
}
