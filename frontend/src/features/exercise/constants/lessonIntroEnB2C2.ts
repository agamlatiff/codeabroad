import type { LessonIntroDeck } from './lessonIntroCards'

export const LESSON_INTRO_DECKS_EN_B2_C2: Record<string, LessonIntroDeck> = {
  // ===========================================================================
  // Level B2 — UNIT 1 (GP-EN-B2-001)
  // ===========================================================================
  'en-us-b2-u1-kosakata': {
    headline: 'Ungkapan Kerja Sehari-hari & Pasangan Kata Alami',
    subtitle: 'Pelajari ungkapan kerja idiomatis penutur asli Amerika yang sering muncul pada rapat lintas zona waktu dan evaluasi kuartalan.',
    items: [
      {
        symbol: 'iron out',
        reading: '/ˈaɪərn aʊt/',
        meaning: 'Membereskan detail masalah / kendala kecil hingga mulus',
        mnemonic: 'Bayangkan menyetrika (iron) kusut pada kemeja sampai rata — dipakai untuk merapikan hambatan teknis atau kontrak.',
        speakText: 'iron out',
      },
      {
        symbol: 'follow through on',
        reading: '/ˈfɑːloʊ θruː ɑːn/',
        meaning: 'Menindaklanjuti janji atau rencana hingga tuntas',
        mnemonic: 'Gerakan ayunan penuh sampai akhir (follow through) — bukan sekadar memulai inisiatif, tetapi menyelesaikannya.',
        speakText: 'follow through on',
      },
      {
        symbol: 'spearhead an initiative',
        reading: '/ˈspɪrˌhɛd ən ɪˈnɪʃətɪv/',
        meaning: 'Memelopori / memimpin langsung sebuah inisiatif strategis',
        mnemonic: 'Spearhead = ujung tombak paling depan yang membuka jalan bagi anggota tim lainnya.',
        speakText: 'spearhead an initiative',
      },
      {
        symbol: 'push back the deadline',
        reading: '/pʊʃ bæk ðə ˈdɛdˌlaɪn/',
        meaning: 'Mengundur tenggat waktu ke tanggal yang lebih lambat',
        mnemonic: 'Awas jebakan arah waktu bahasa Inggris: push back = mundur lebih lambat, sedangkan move up = maju lebih cepat!',
        speakText: 'push back the deadline',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-001',
      title: 'Gabungan Kata Kerja: Bisa Dipisah vs. Tiga Kata',
      formula: 'Separable: V + Pronoun + Particle | Three-Word: V + Particle + Prep + Object',
      formulaReading: 'iron them out / follow through on the plan',
      explanation: 'Gabungan kata kerja dua kata wajib dipisahkan jika objeknya berupa kata ganti (iron it out, BUKAN iron out it). Sebaliknya, gabungan kata kerja tiga kata (follow through on, zero in on) tidak boleh dipisahkan dari objeknya.',
      examples: [
        {
          jp: 'We need to iron them out before the client demo tomorrow.',
          reading: '/wi niːd tə ˈaɪərn ðɛm aʊt bɪˈfɔːr ðə ˈklaɪənt ˈdɛmoʊ təˈmɑːroʊ/',
          id: 'Kita perlu membereskannya sebelum demo klien besok.',
        },
        {
          jp: 'Our product lead followed through on every security commitment.',
          reading: '/ˈaʊər ˈprɑːdʌkt liːd ˈfɑːloʊd θruː ɑːn ˈɛvri sɪˈkjʊrəti kəˈmɪtmənt/',
          id: 'Pemimpin produk kami menuntaskan setiap komitmen keamanan.',
        },
      ],
    },
    contrastiveTip: 'Jangan tertukar \'push back\' (mengundur jadwal jadi lebih lambat) dengan \'bring forward / move up\' (memajukan jadwal jadi lebih awal).',
  },
  'en-us-b2-u1-tata-bahasa': {
    headline: 'Aturan Kata Ganti pada Gabungan Kata Kerja: Yang Bisa Dipisah vs. Tidak Bisa Dipisah',
    subtitle: 'Hindari kesalahan klasik pembelajar Indonesia saat menempatkan kata ganti (it, them) di tengah atau di akhir gabungan kata kerja.',
    items: [
      {
        symbol: 'turn it down',
        reading: '/tɜːrn ɪt daʊn/',
        meaning: 'Menolaknya (tawaran/proposal) secara sopan',
        mnemonic: 'Kata ganti objek \'it\' WAJIB diletakkan di tengah antara \'turn\' dan \'down\' — tidak boleh \'turn down it\'.',
        speakText: 'turn it down',
      },
      {
        symbol: 'look into the discrepancy',
        reading: '/lʊk ˈɪntuː ðə dɪˈskrɛpənsi/',
        meaning: 'Menyelidiki selisih / ketidaksesuaian data',
        mnemonic: '\'Look into\' bersifat inseparable (tak terpisahkan): baik kata benda maupun kata ganti tetap di belakang \'into\'.',
        speakText: 'look into the discrepancy',
      },
      {
        symbol: 'zero in on',
        reading: '/ˈzɪroʊ ɪn ɑːn/',
        meaning: 'Memusatkan perhatian penuh pada satu akar masalah',
        mnemonic: 'Tiga kata kerja berpartikel ganda (verb + particle + kata depan) selalu mengunci objek di paling belakang.',
        speakText: 'zero in on',
      },
      {
        symbol: 'phase them out',
        reading: '/feɪz ðɛm aʊt/',
        meaning: 'Menghentikan penggunaannya secara bertahap',
        mnemonic: 'Saat merujuk pada sistem lama (\'old systems\' -> \'them\'), letakkan \'them\' tepat sebelum \'out\'.',
        speakText: 'phase them out',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-001',
      title: 'Pronoun Placement in Multi-Word Verbs',
      formula: '✔ V + it/them + Particle (turn it down) | ✔ V + Prep + it/them (look into it)',
      formulaReading: 'phase them out / look into it / zero in on the root cause',
      explanation: 'Dalam bahasa Inggris Amerika standar (termasuk penulisan bahasa Inggris standar), gabungan kata kerja dua kata (seperti phase out, turn down, bring up) mengharuskan kata ganti objek (it, them, us) berada DI TENGAH. Namun kata kerja + kata depan (look into, rely on, come across) tidak pernah dipisah.',
      examples: [
        {
          jp: 'The offer lacked equity, so she turned it down politely.',
          reading: '/ði ˈɔːfər lækt ˈɛkwəti soʊ ʃi tɜːrnd ɪt daʊn pəˈlaɪtli/',
          id: 'Tawaran itu tidak menyertakan ekuitas, sehingga ia menolaknya dengan sopan.',
        },
        {
          jp: 'Finance spotted an invoice error and promised to look into it.',
          reading: '/ˈfaɪnæns ˈspɑːtɪd ən ˈɪnvɔɪs ˈɛrər ænd ˈprɑːmɪst tə lʊk ˈɪntuː ɪt/',
          id: 'Tim keuangan menemukan kesalahan faktur dan berjanji menyelidikinya.',
        },
      ],
    },
    contrastiveTip: 'Tes cepat: jika kata keduanya adalah kata depan murni (\'into\', \'across\', \'on\' pada \'rely on\'), jangan pernah pisahkan kata ganti ke tengah!',
  },
  'en-us-b2-u1-diskusi-toefl': {
    headline: 'Ungkapan Nyata di Kampus & Rapat Kerja Amerika',
    subtitle: 'Kenali ungkapan idiomatis yang sering keluar pada percakapan kampus Amerika dan rapat lintas fungsi.',
    items: [
      {
        symbol: 'get everyone on the same page',
        reading: '/ɡɛt ˈɛvriˌwʌn ɑːn ðə seɪm peɪdʒ/',
        meaning: 'Menyamakan pemahaman seluruh anggota tim',
        mnemonic: 'Bayangkan semua peserta rapat membuka halaman buku yang persis sama agar tidak salah arah.',
        speakText: 'get everyone on the same page',
      },
      {
        symbol: 'factor in',
        reading: '/ˈfæktər ɪn/',
        meaning: 'Memperhitungkan / memasukkan variabel ke dalam kalkulasi',
        mnemonic: 'Sangat lazim pada kuliah ekonomi/teknik saat menambahkan biaya tersembunyi atau risiko waktu.',
        speakText: 'factor in',
      },
      {
        symbol: 'pan out',
        reading: '/pæn aʊt/',
        meaning: 'Membuahkan hasil baik / berjalan sesuai harapan',
        mnemonic: 'Berasal dari mendulang emas di sungai dengan wajan (pan) hingga terlihat apakah ada hasilnya.',
        speakText: 'pan out',
      },
      {
        symbol: 'rule out a hypothesis',
        reading: '/ruːl aʊt ə haɪˈpɑːθəsɪs/',
        meaning: 'Mengesampingkan / mencoret suatu hipotesis karena bukti tidak mendukung',
        mnemonic: 'Frasa kunci di latihan mendengarkan percakapan & kuliah saat profesor menjelaskan mengapa satu teori tidak mungkin benar.',
        speakText: 'rule out a hypothesis',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-001',
      title: 'Memilih Gaya Bahasa Resmi vs Santai',
      formula: 'Spoken Campus/Exec: pan out / rule out / factor in ↔ Written Essay: succeed / exclude / incorporate',
      formulaReading: 'Did the experiment pan out? → The experiment yielded positive results.',
      explanation: 'Dalam latihan mendengarkan percakapan & kuliah (percakapan kantor dekan & diskusi kelas), penutur asli memakai gabungan kata kerja seperti \'pan out\', \'rule out\', dan \'factor in\'. Memahami padanan formalnya membantu Anda menjawab soal parafrasa pilihan ganda dengan cepat.',
      examples: [
        {
          jp: 'We forgot to factor in currency changes when estimating year-end revenue.',
          reading: '/wi fərˈɡɑːt tə ˈfæktər ɪn ˈkɜːrənsi ˌflʌktʃuˈeɪʃənz wɛn prəˈdʒɛktɪŋ/',
          id: 'Kami lupa memperhitungkan perubahan mata uang saat memperkirakan pendapatan akhir tahun.',
        },
        {
          jp: 'Initial lab tests allowed the researchers to rule out bacterial contamination.',
          reading: '/ɪˈnɪʃəl læb tɛsts əˈlaʊd ðə ˈriːsɜːrtʃərz tə ruːl aʊt bækˈtɪriəl kənˌtæməˈneɪʃən/',
          id: 'Uji lab awal memungkinkan peneliti mengesampingkan kontaminasi bakteri.',
        },
      ],
    },
    contrastiveTip: 'Pada soal latihan mendengarkan percakapan & kuliah, pilihan jawaban yang benar hampir selalu memparafrasakan ungkapan kata kerja dalam audio ke kata kerja akademik tunggal (mis. \'rule out\' -> \'eliminate\').',
  },
  // ===========================================================================
  // Level B2 — UNIT 2 (GP-EN-B2-002)
  // ===========================================================================
  'en-us-b2-u2-kosakata': {
    headline: 'Kosakata Wawancara Behavioral berstandar Global Tech',
    subtitle: 'Ganti kata kerja umum seperti \'did\' atau \'helped\' dengan action verbs presisi tinggi yang menunjukkan kepemilikan dan hasil terukur.',
    items: [
      {
        symbol: 'bottleneck',
        reading: '/ˈbɑːtəlˌnɛk/',
        meaning: 'Titik kemacetan proses yang memperlambat kinerja keseluruhan',
        mnemonic: 'Seperti leher botol yang sempit: aliran kerja tertahan di satu tahap krusial (Situation/Task).',
        speakText: 'bottleneck',
      },
      {
        symbol: 'overhaul a workflow',
        reading: '/ˈoʊvərˌhɔːl ə ˈwɜːrkˌfloʊ/',
        meaning: 'Merombak total alur kerja agar jauh lebih efisien',
        mnemonic: 'Lebih kuat dari \'change\': overhaul berarti membongkar bagian yang usang dan menyusun ulang secara menyeluruh.',
        speakText: 'overhaul a workflow',
      },
      {
        symbol: 'cut turnaround time by 40%',
        reading: '/kʌt ˈtɜːrnəˌraʊnd taɪm baɪ ˈfɔːrti pərˈsɛnt/',
        meaning: 'Memangkas waktu penyelesaian proses sebesar 40%',
        mnemonic: 'Gunakan kata depan \'by\' untuk selisih persentase penurunan/kenaikan, dan \'to\' untuk angka akhir!',
        speakText: 'cut turnaround time by 40%',
      },
      {
        symbol: 'cross-functional alignment',
        reading: '/ˌkrɔːsˈfʌŋkʃənəl əˈlaɪnmənt/',
        meaning: ' Keselarasan kerja antar-divisi (produk, teknik, desain, bisnis)',
        mnemonic: 'Kata kunci utama rekruter perusahaan multinasional saat menilai kolaborasi kandidat senior.',
        speakText: 'cross-functional alignment',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-002',
      title: 'Quantifying Results: \'by\' vs. \'to\' in Impact Statements',
      formula: 'Verb + Metric + by [Delta %] | Verb + Metric + from [A] to [B]',
      formulaReading: 'reduced latency by 35% / boosted retention from 62% to 81%',
      explanation: 'Pada bagian Result (R) metode STAR, rekruter Amerika menilai dampak kuantitatif. Gunakan \'by\' untuk menyatakan besaran perubahan (selisih), sedangkan \'to\' untuk menyatakan titik capaian akhir.',
      examples: [
        {
          jp: 'Automating quality checks cut delivery turnaround time by 40 percent.',
          reading: '/ˈɔːtəˌmeɪtɪŋ ˌkjuːˈeɪ tʃɛks kʌt rɪˈliːs ˈtɜːrnəˌraʊnd taɪm baɪ ˈfɔːrti pərˈsɛnt/',
          id: 'Otomatisasi pemeriksaan kualitas memangkas waktu penyelesaian kerja sebesar 40 persen.',
        },
        {
          jp: 'My redesign raised trial-to-paid conversion from 4% to 9%.',
          reading: '/maɪ ˌriːdɪˈzaɪn reɪzd ˈtraɪəl tə peɪd kənˈvɜːrʒən frʌm fɔːr pərˈsɛnt tə naɪn pərˈsɛnt/',
          id: 'Desain ulang saya meningkatkan konversi uji coba ke berbayar dari 4% menjadi 9%.',
        },
      ],
    },
    contrastiveTip: 'Hindari berkata \'I reduced latency until 40%\' (terjemahan harfiah \'sampai\'). Gunakan \'by 40%\' (sebesar) atau \'to 40ms\' (menjadi).',
  },
  'en-us-b2-u2-tata-bahasa': {
    headline: 'Arsitektur Waktu Lampau dalam Cerita STAR',
    subtitle: 'Gunakan kombinasi Past Continuous, Past Perfect, dan Simple Past agar cerita pengalaman kerja terdengar runtut, tajam, dan tidak datar.',
    items: [
      {
        symbol: 'had been losing (Past Perfect Continuous)',
        reading: '/hæd bɪn ˈluːzɪŋ/',
        meaning: 'Telah terus-menerus kehilangan (sebelum saya bertindak)',
        mnemonic: 'Sempurna untuk bagian Situation: menggambarkan masalah kronis yang sudah berjalan sebelum Anda turun tangan.',
        speakText: 'had been losing (Past Perfect Continuous)',
      },
      {
        symbol: 'was preparing (Past Continuous)',
        reading: '/wʌz prɪˈpɛrɪŋ/',
        meaning: 'Sedang mempersiapkan (latar kejadian yang sedang berlangsung)',
        mnemonic: 'Memberi konteks aktivitas tim tepat ketika insiden atau tantangan baru muncul.',
        speakText: 'was preparing (Past Continuous)',
      },
      {
        symbol: 'spearheaded & launched (Simple Past)',
        reading: '/ˈspɪrˌhɛdɪd ænd dɪˈplɔɪd/',
        meaning: 'Memelopori dan meluncurkan (aksi konkret Anda)',
        mnemonic: 'Seluruh langkah pada bagian Action dan Result wajib memakai Simple Past tegas dengan subjek \'I\' (bukan \'we\' terus-menerus).',
        speakText: 'spearheaded and launched',
      },
      {
        symbol: 'had never documented (Past Perfect)',
        reading: '/hæd ˈnɛvər ˈdɑːkjəmɛntɪd/',
        meaning: 'Belum pernah mendokumentasikan sebelumnya',
        mnemonic: 'Menjelaskan kondisi akar masalah yang mendahului titik waktu cerita utama Anda.',
        speakText: 'had never documented (Past Perfect)',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-002',
      title: 'Narrative Past Framing (Past Perfect vs. Past Continuous vs. Simple Past)',
      formula: 'Situation: had + V3 / had been + V-ing + when + Simple Past | Action & Result: I + V2',
      formulaReading: 'Complaints had been rising for months when I took over and improved our welcome process.',
      explanation: 'Penutur Indonesia sering memakai Simple Past saja atau bahkan Present Tense saat bercerita pengalaman lampau. Di wawancara Amerika, gunakan Past Perfect (Continuous) untuk masalah pendahulu (Situation), lalu Simple Past tegas untuk aksi Anda (Action).',
      examples: [
        {
          jp: 'Customer cancellations had been climbing for six months before I reviewed the welcome process.',
          reading: '/ˈkʌstəmər tʃɜːrn hæd bɪn ˈklaɪmɪŋ fɔːr tuː ˈkwɔːrtərz bɪˈfɔːr aɪ ˈɔːdɪtɪd/',
          id: 'Tingkat berhentinya pelanggan telah terus naik selama dua kuartal sebelum saya mengaudit alur orientasi.',
        },
        {
          jp: 'While our team was migrating the database, we uncovered a critical indexing flaw.',
          reading: '/waɪl ˈaʊər tiːm wʌz ˈmaɪˌɡreɪtɪŋ ðə ˈdeɪtəˌbeɪs wi ʌnˈkʌvərd ə ˈkrɪtɪkəl ˈɪndɛksɪŋ flɔː/',
          id: 'Saat tim kami sedang memigrasikan basis data, kami menemukan celah pengindeksan yang kritis.',
        },
      ],
    },
    contrastiveTip: 'Jebakan wawancara: jangan larut memakai \'we\' di bagian Action (\'We did X\'). Rekruter ingin tahu kontribusi spesifik \'I\' di dalam tim tersebut!',
  },
  'en-us-b2-u2-diskusi-toefl': {
    headline: 'Menjawab Pertanyaan Kegagalan, Konflik & Berbicara Opini Mandiri',
    subtitle: 'Baik wawancara global maupun latihan menjawab opini secara lisan menuntut argumen personal yang jujur, ringkas, dan ditutup dengan pelajaran konkret.',
    items: [
      {
        symbol: 'own up to a mistake',
        reading: '/oʊn ʌp tuː ə mɪˈsteɪk/',
        meaning: 'Mengakui kesalahan secara ksatria tanpa menyalahkan pihak lain',
        mnemonic: 'Budaya kerja Amerika sangat menghargai akuntabilitas pribadi (\'ownership\') dibanding mencari kambing hitam.',
        speakText: 'own up to a mistake',
      },
      {
        symbol: 'in hindsight',
        reading: '/ɪn ˈhaɪndˌsaɪt/',
        meaning: 'Jika dilihat kembali ke belakang (setelah tahu hasilnya)',
        mnemonic: 'Frasa pembuka elegan saat mengevaluasi apa yang seharusnya dilakukan secara lebih baik.',
        speakText: 'in hindsight',
      },
      {
        symbol: 'course-correct',
        reading: '/ˈkɔːrs kəˌrɛkt/',
        meaning: 'Mengoreksi arah strategi di tengah jalan sebelum terlambat',
        mnemonic: 'Analogi kapten kapal/pilot yang segera meluruskan haluan begitu melihat kompas melenceng.',
        speakText: 'course-correct',
      },
      {
        symbol: 'key takeaway',
        reading: '/kiː ˈteɪkəˌweɪ/',
        meaning: 'Pelajaran / poin kesimpulan terpenting yang dipetik',
        mnemonic: 'Penutup emas untuk wawancara behavioral maupun kesimpulan 10 detik terakhir presentasi & berbicara bahasa Inggris!',
        speakText: 'key takeaway',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-002',
      title: 'Menyoroti Pelajaran Utama (\'What I learned was...\')',
      formula: 'Pola Penegas: What + S + V + was (that) + Kalimat | Reflective: In hindsight, I should have + V3',
      formulaReading: 'What that experience taught me was that early feedback prevents costly rework.',
      explanation: 'Pola penegas (\'What I realized was...\', \'What made the difference was...\') menyorot pelajaran utama secara dramatis dan membantu pembaca & penguji maupun pewawancara menangkap poin inti Anda seketika.',
      examples: [
        {
          jp: 'What that setback taught me was to validate assumptions early.',
          reading: '/wʌt ðæt ˈsɛtˌbæk tɔːt mi wʌz tə ˈvæləˌdeɪt əˈsʌmpʃənz ˈɜːrli/',
          id: 'Hal yang diajarkan kemunduran itu kepada saya adalah memvalidasi asumsi sejak dini.',
        },
        {
          jp: 'In hindsight, I should have escalated the vendor delay sooner.',
          reading: '/ɪn ˈhaɪndˌsaɪt aɪ ʃʊd həv ˈɛskəˌleɪtɪd ðə ˈvɛndər dɪˈleɪ ˈsuːnər/',
          id: 'Jika menoleh ke belakang, saya semestinya melaporkan keterlambatan vendor itu lebih cepat.',
        },
      ],
    },
    contrastiveTip: 'Saat ditanya \'What is your biggest failure?\', jangan pernah menjawab kelemahan palsu (\'I work too hard\'). Ceritakan kegagalan nyata berskala wajar + cara Anda course-correct!',
  },
  // ===========================================================================
  // Level B2 — UNIT 3 (GP-EN-B2-003)
  // ===========================================================================
  'en-us-b2-u3-kosakata': {
    headline: 'Penanda Struktur Kuliah (Lecture Signposts) di ujian bahasa Inggris internasional',
    subtitle: 'Profesor di kampus Amerika tidak berbicara seperti buku teks kaku; mereka memberi sinyal transisi lisan sebelum menyampaikan ide utama ujian.',
    items: [
      {
        symbol: 'hinge on',
        reading: '/hɪndʒ ɑːn/',
        meaning: 'Sangat bergantung pada satu faktor penentu',
        mnemonic: 'Hinge = engsel pintu. Seluruh pintu argumen berputar dan bertumpu pada engsel tersebut!',
        speakText: 'hinge on',
      },
      {
        symbol: 'digress for a moment',
        reading: '/daɪˈɡrɛs fɔːr ə ˈmoʊmənt/',
        meaning: 'Menyimpang sejenak dari topik utama kuliah',
        mnemonic: 'Sinyal emas soal \'Function Question\' ujian bahasa Inggris: saat dosen berkata \'Let me digress\' atau \'Off the top of my head\', perhatikan tujuan contohnya!',
        speakText: 'digress for a moment',
      },
      {
        symbol: 'counterintuitive',
        reading: '/ˌkaʊntərɪnˈtuːətɪv/',
        meaning: 'Bertentangan dengan intuisi atau dugaan awam',
        mnemonic: 'Setiap kali profesor menyebut fenomena sains \'counterintuitive\', hampir pasti muncul soal ujian tentang fenomena itu!',
        speakText: 'counterintuitive',
      },
      {
        symbol: 'corroborate a finding',
        reading: '/kəˈrɑːbəˌreɪt ə ˈfaɪndɪŋ/',
        meaning: 'Menguatkan / mengonfirmasi temuan dengan bukti independen',
        mnemonic: 'Tingkat akademik di atas \'support\': bukti baru dari lab lain membuktikan temuan awal memang benar.',
        speakText: 'corroborate a finding',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-003',
      title: 'Causal & Evidential Verbs in Academic Lectures',
      formula: 'Theory + hinges on / stems from / accounts for + Noun Phrase',
      formulaReading: 'Survival in arid zones hinges on nocturnal water retention.',
      explanation: 'Dalam kuliah sains dan psikologi, hubungan sebab-akibat jarang memakai \'because\' semata. Dosen menggunakan kata kerja sebab-akibat seperti \'hinge on\' (bergantung pada), \'stem from\' (berakar dari), dan \'account for\' (menjelaskan porsi/penyebab).',
      examples: [
        {
          jp: 'Coral reef resilience hinges on symbiotic algae within their tissues.',
          reading: '/ˈkɔːrəl riːf rɪˈzɪliəns ˈhɪndʒɪz ɑːn ˌsɪmbaɪˈɑːtɪk ˈældʒiː wɪˈðɪn ðɛr ˈtɪʃuːz/',
          id: 'Ketahanan terumbu karang sangat bergantung pada alga simbiotik di dalam jaringannya.',
        },
        {
          jp: 'Ice-core samples corroborated the paleoclimatologist\'s hypothesis.',
          reading: '/aɪs kɔːr ˈsæmpəlz kəˈrɑːbəˌreɪtɪd ðə ˌpeɪlioʊˌklaɪməˈtɑːlədʒɪsts haɪˈpɑːθəsɪs/',
          id: 'Sampel inti es menguatkan hipotesis pakar paleoklimatologi tersebut.',
        },
      ],
    },
    contrastiveTip: 'Jangan tertukar \'account for\' (menjelaskan penyebab ATAU mencakup persentase, mis. \'accounts for 30% of heat loss\') dengan \'count on\' (mengandalkan seseorang).',
  },
  'en-us-b2-u3-tata-bahasa': {
    headline: 'Embedded Questions & Pertanyaan Retoris dalam Wacana Sains',
    subtitle: 'Kuasai tata urutan subjek-kata kerja pada bagian kalimat tanya tak langsung serta fungsi pertanyaan retoris pembuka argumen ilmiah.',
    items: [
      {
        symbol: 'how organisms adapt',
        reading: '/haʊ ˈɔːrɡəˌnɪzəmz əˈdæpt/',
        meaning: 'Bagaimana organisme beradaptasi (BUKAN \'how do organisms adapt\')',
        mnemonic: 'Begitu kalimat tanya masuk ke dalam kalimat pernyataan, hilangkan \'do/does/did\' dan kembalikan ke urutan Subjek + Kata Kerja!',
        speakText: 'how organisms adapt',
      },
      {
        symbol: 'whether the pattern holds',
        reading: '/ˈwɛðər ðə ˈpætərn hoʊldz/',
        meaning: 'Apakah pola tersebut tetap berlaku',
        mnemonic: 'Dalam penulisan akademik dan tes bahasa Inggris, \'whether\' (terutama \'whether or not\') jauh lebih disukai daripada \'if\' sesudah kata depan/kata kerja riset.',
        speakText: 'whether the pattern holds',
      },
      {
        symbol: 'Why does that matter? Well,...',
        reading: '/waɪ dʌz ðæt ˈmætər wɛl/',
        meaning: 'Mengapa hal itu penting? Nah,... (Pertanyaan Retoris)',
        mnemonic: 'Profesor bertanya bukan untuk dijawab mahasiswa, melainkan untuk menyorot signifikansi konsep tepat di kalimat sesudahnya!',
        speakText: 'Why does that matter? Well,...',
      },
      {
        symbol: 'the extent to which',
        reading: '/ði ɪkˈstɛnt tə wɪtʃ/',
        meaning: 'Sejauh mana / tingkat di mana suatu variabel memengaruhi yang lain',
        mnemonic: 'Konstruksi emas penulisan akademik B2–C1 pengganti \'how much\'.',
        speakText: 'the extent to which',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-003',
      title: 'Pertanyaan di Tengah Kalimat & Kata Hubung \'to which / in which\'',
      formula: 'Kalimat Utama + wh-word / whether + Subject + Verb (urutan lurus, TANPA do/did!)',
      formulaReading: 'Researchers examined to what extent sleep deprivation impairs memory.',
      explanation: 'Kesalahan paling sering di penulisan esai bahasa Inggris adalah membalik posisi kata bantu ke depan di dalam pertanyaan di dalam kalimat (*\'Scientists asked why did the glacier melt\'* -> SALAH). Yang benar: \'Scientists investigated why the glacier melted\' dan \'Researchers measured the extent to which urbanization alters rainfall.\'',
      examples: [
        {
          jp: 'Astronomers still debate how supermassive black holes formed so early.',
          reading: '/əˈstrɑːnəmərz stɪl dɪˈbeɪt haʊ ˌsuːpərˈmæsɪv blæk hoʊlz fɔːrmd soʊ ˈɜːrli/',
          id: 'Para astronom masih memperdebatkan bagaimana lubang hitam supermasif terbentuk begitu dini.',
        },
        {
          jp: 'The study evaluates the extent to which microplastics penetrate marine food webs.',
          reading: '/ðə ˈstʌdi ɪˈvæljuˌeɪts ði ɪkˈstɛnt tə wɪtʃ ˈmaɪkroʊˌplæstɪks ˈpɛnəˌtreɪt məˈriːn fuːd wɛbz/',
          id: 'Studi ini mengevaluasi sejauh mana mikroplastik menembus jaring makanan laut.',
        },
      ],
    },
    contrastiveTip: 'Ingat rumus emas: sesudah kata depan (\'of whether\', \'about how\', \'to which\'), jangan pernah gunakan \'if\' untuk arti \'apakah\' — wajib gunakan \'whether\'!',
  },
  'en-us-b2-u3-diskusi-toefl': {
    headline: 'Kerangka Merangkum Kuliah Akademik (latihan merangkum kuliah secara lisan)',
    subtitle: 'Latih transisi lisan bernilai tinggi untuk merangkum definisi konsep beserta dua contoh eksperimen profesor dalam 60 detik.',
    items: [
      {
        symbol: 'The professor illustrates this with...',
        reading: '/ðə prəˈfɛsər ˈɪləˌstreɪts ðɪs wɪð/',
        meaning: 'Profesor mengilustrasikan konsep ini menggunakan...',
        mnemonic: 'Pembuka transisi wajib dari definisi umum ke contoh hewan/eksperimen pertama pada latihan merangkum kuliah secara lisan.',
        speakText: 'The professor illustrates this with...',
      },
      {
        symbol: 'By contrast, the second example...',
        reading: '/baɪ ˈkɑːntræst ðə ˈsɛkənd ɪɡˈzæmpəl/',
        meaning: 'Sebaliknya / sebagai kontras, contoh kedua...',
        mnemonic: 'Menghubungkan dua mekanisme berbeda dalam kuliah biologi atau bisnis secara tajam dan kohesif.',
        speakText: 'By contrast, the second example...',
      },
      {
        symbol: 'thereby enabling',
        reading: '/ˌðɛrˈbaɪ ɪˈneɪblɪŋ/',
        meaning: 'Sehingga dengan demikian memungkinkan...',
        mnemonic: 'Penghubung partisip ringkas yang menghemat detik berharga saat menjelaskan dampak adaptasi biologis!',
        speakText: 'thereby enabling',
      },
      {
        symbol: 'shed light on',
        reading: '/ʃɛd laɪt ɑːn/',
        meaning: 'Memberikan titik terang / memperjelas pemahaman tentang...',
        mnemonic: 'Idiom akademik elegan untuk merangkum kontribusi riset tanpa mengulang kata \'explain\' terus-menerus.',
        speakText: 'shed light on',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-003',
      title: 'Academic Summary Reporting & \'thereby + V-ing\'',
      formula: 'Kalimat Utama + , thereby + V-ing (Result) | The lecture sheds light on how + S + V',
      formulaReading: 'Desert foxes have oversized ears, thereby dissipating excess body heat.',
      explanation: 'Pada latihan merangkum bacaan & kuliah secara lisan, waktu bicara hanya 60 detik. Menggabungkan aksi dan hasil memakai \', thereby + V-ing\' jauh lebih padat dan bernilai skor tata bahasa lebih tinggi daripada dua kalimat pendek yang terputus-putus.',
      examples: [
        {
          jp: 'Mangrove roots trap coastal sediment, thereby stabilizing vulnerable shorelines.',
          reading: '/ˈmæŋɡroʊv ruːts træp ˈkoʊstəl ˈsɛdəmənt ˌðɛrˈbaɪ ˈsteɪbəˌlaɪzɪŋ ˈvʌlnərəbəl ˈʃɔːrˌlaɪnz/',
          id: 'Akar bakau memerangkap sedimen pesisir, sehingga menstabilkan garis pantai yang rentan.',
        },
        {
          jp: 'Both studies shed light on how infants acquire phonetic categories.',
          reading: '/boʊθ ˈstʌdiz ʃɛd laɪt ɑːn haʊ ˈɪnfənts əˈkwaɪər fəˈnɛtɪk ˈkætəˌɡɔːriz/',
          id: 'Kedua studi memberikan titik terang tentang bagaimana bayi memperoleh kategori fonetik.',
        },
      ],
    },
    contrastiveTip: 'Pada latihan merangkum kuliah secara lisan, jangan pernah memasukkan opini pribadi (\'I think desert animals are cool\'). Laporkan murni fakta dan contoh profesor menggunakan Present Tense ilmiah!',
  },
  // ===========================================================================
  // Level B2 — UNIT 4 (GP-EN-B2-004)
  // ===========================================================================
  'en-us-b2-u4-kosakata': {
    headline: 'Menantang Ide Tanpa Menyerang Pribadi (Constructive Pushback)',
    subtitle: 'Di ruang rapat Amerika dan seminar kampus, ketidaksetujuan tajam disampaikan lewat pengakuan poin positif terlebih dahulu sebelum mengutarakan keberatan.',
    items: [
      {
        symbol: 'see the merit in',
        reading: '/siː ðə ˈmɛrɪt ɪn/',
        meaning: 'Mengakui nilai positif / kelebihan dari suatu usulan',
        mnemonic: 'Merit = bobot kebaikan. Mengucapkan \'I see the merit in your proposal, but...\' menurunkan tensi defensif lawan bicara.',
        speakText: 'see the merit in',
      },
      {
        symbol: 'play devil\'s advocate',
        reading: '/pleɪ ˈdɛvəlz ˈædvəkət/',
        meaning: 'Sengaja mengambil sudut pandang berlawanan demi menguji kelemahan ide',
        mnemonic: 'Cara paling sopan di rapat produk Amerika untuk menguji celah rencana tim tanpa terkesan negatif.',
        speakText: 'play devil\'s advocate',
      },
      {
        symbol: 'a valid point, albeit...',
        reading: '/ə ˈvælɪd pɔɪnt ɔːlˈbiːɪt/',
        meaning: 'Poin yang masuk akal, meskipun...',
        mnemonic: '\'Albeit\' (/ɔːlˈbiːɪt/) adalah kata hubung ringkas berkelas B2–C1 yang diikuti kata sifat atau frasa pendek.',
        speakText: 'a valid point, albeit...',
      },
      {
        symbol: 'overlook a caveat',
        reading: '/ˌoʊvərˈlʊk ə ˈkæviˌɑːt/',
        meaning: 'Melewatkan catatan peringatan / batasan penting',
        mnemonic: 'Caveat = syarat/batasan krusial yang wajib diperhatikan sebelum menarik kesimpulan mutlak.',
        speakText: 'overlook a caveat',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-004',
      title: 'Concessive Framing (\'While / Granted..., main argument\')',
      formula: 'While I see the merit in [X], [counter-claim]. | Granted, [fact]; however, [limitation].',
      formulaReading: 'While I see the merit in launching early, stability must come first.',
      explanation: 'Baik dalam rapat lintas divisi maupun tugas baru diskusi tertulis di kelas atau forum, argumen bernilai tinggi selalu mengakui sudut pandang rekan diskusi terlebih dahulu (\'While Alex raises a valid point regarding X, this view overlooks Y\').',
      examples: [
        {
          jp: 'While I see the merit in cutting ad spend, doing so abruptly could stall growth.',
          reading: '/waɪl aɪ siː ðə ˈmɛrɪt ɪn ˈkʌtɪŋ æd spɛnd ˈduːɪŋ soʊ əˈbrʌptli kʊd stɔːl ɡroʊθ/',
          id: 'Meskipun saya melihat sisi baik pemangkasan belanja iklan, melakukannya secara mendadak dapat menghambat pertumbuhan.',
        },
        {
          jp: 'Let me play devil\'s advocate—what happens if our primary supplier defaults?',
          reading: '/lɛt mi pleɪ ˈdɛvəlz ˈædvəkət wʌt ˈhæpənz ɪf ˈaʊər ˈpraɪˌmɛri səˈplaɪər dɪˈfɔːlts/',
          id: 'Izinkan saya menguji dari sisi sebaliknya—apa yang terjadi jika pemasok utama kita gagal memenuhi kontrak?',
        },
      ],
    },
    contrastiveTip: 'Hindari berkata langsung \'I disagree with you\' atau \'Your idea is wrong\' di rapat Amerika; gunakan \'I see where you\'re coming from, though have we considered...?\'',
  },
  'en-us-b2-u4-tata-bahasa': {
    headline: 'Bahasa Halus & Pertanyaan Pengajak untuk Persuasi Rapat',
    subtitle: 'Gunakan modal lampau pelembut (would, might, could) dan pertanyaan negatif sopan (\'Wouldn\'t it be wiser to...?\') untuk mengarahkan keputusan rapat.',
    items: [
      {
        symbol: 'Wouldn\'t it make more sense to...?',
        reading: '/ˈwʊdənt ɪt meɪk mɔːr sɛns tuː/',
        meaning: 'Bukankah akan lebih masuk akal jika kita...?',
        mnemonic: 'Pertanyaan negatif dengan \'Wouldn\'t\' mengundang persetujuan rekan kerja tanpa terdengar menggurui seperti \'You must\'.',
        speakText: 'Wouldn\'t it make more sense to...?',
      },
      {
        symbol: 'might want to reconsider',
        reading: '/maɪt wɑːnt tə ˌriːkənˈsɪdər/',
        meaning: 'Sebaiknya mempertimbangkan kembali (saran halus tapi serius)',
        mnemonic: 'Di kantor Amerika, jika atasan berkata \'You might want to reconsider X\', artinya secara halus adalah \'Tolong ubah X\'!',
        speakText: 'might want to reconsider',
      },
      {
        symbol: 'I would argue that...',
        reading: '/aɪ wʊd ˈɑːrɡjuː ðæt/',
        meaning: 'Saya berpendapat / berargumen bahwa...',
        mnemonic: 'Memakai \'would argue\' terdengar jauh lebih objektif dan terpelajar di esai/seminar ketimbang \'I think\'.',
        speakText: 'I would argue that...',
      },
      {
        symbol: 'Even if we were to...',
        reading: '/ˈiːvən ɪf wi wɜːr tuː/',
        meaning: 'Bahkan seandainya pun kita benar-benar melakukan...',
        mnemonic: 'Melemahkan argumen lawan dengan menunjukkan bahwa meskipun usulan mereka dijalankan, masalah inti tetap belum terpecahkan.',
        speakText: 'Even if we were to...',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-004',
      title: 'Diplomatic Modals & Hypothetical Concession (\'Even if + were to\')',
      formula: 'Wouldn\'t it be + Comparative + to V1? | Even if + S + were to + V1, S + would still + V1',
      formulaReading: 'Even if we were to double the ad budget, retention would still lag.',
      explanation: 'Penggunaan bentuk lampau modal (\'would\', \'could\', \'might\') untuk situasi SAAT INI menciptakan jarak kesopanan psikologis (*pragmatic distancing*). Konstruksi \'Even if we were to + V1\' membantah kelayakan suatu ide secara hipotetis dan elegan.',
      examples: [
        {
          jp: 'Wouldn\'t it be more prudent to pilot the feature in one city first?',
          reading: '/ˈwʊdənt ɪt bi mɔːr ˈpruːdənt tə ˈpaɪlət ðə ˈfiːtʃər ɪn wʌn ˈsɪti fɜːrst/',
          id: 'Bukankah akan lebih bijaksana menguji coba fitur tersebut di satu kota terlebih dahulu?',
        },
        {
          jp: 'Even if we were to hire five helpers today, training would take weeks.',
          reading: '/ˈiːvən ɪf wi wɜːr tə ˈhaɪər faɪv ˈkɑːntræktərz təˈdeɪ ˈɔːnˌbɔːrdɪŋ wʊd teɪk wiːks/',
          id: 'Bahkan seandainya pun kita merekrut lima kontraktor hari ini, proses orientasi tetap akan memakan berminggu-minggu.',
        },
      ],
    },
    contrastiveTip: 'Pahami kode budaya AS: \'We might want to double-check line 42\' bukanlah opsi sukarela, melainkan koreksi sopan yang wajib segera ditindaklanjuti!',
  },
  'en-us-b2-u4-diskusi-toefl': {
    headline: 'Menyumbang Sudut Pandang Baru di Seminar & Menulis Opini di Forum Diskusi',
    subtitle: 'Pada diskusi kelas & forum akademik (10 menit), skor 5.0 diraih dengan menanggapi opini teman sekelas lalu menambahkan dimensi argumen yang belum dibahas.',
    items: [
      {
        symbol: 'build on someone\'s point',
        reading: '/bɪld ɑːn ˈsʌmwʌnz pɔɪnt/',
        meaning: 'Mengembangkan / memperkaya argumen yang sudah disampaikan rekan sebelumnya',
        mnemonic: 'Bayangkan menyusun bata tambahan di atas fondasi argumen teman agar diskusi bergerak maju.',
        speakText: 'build on someone\'s point',
      },
      {
        symbol: 'echo that sentiment',
        reading: '/ˈɛkoʊ ðæt ˈsɛntəmənt/',
        meaning: 'Menyuarakan persetujuan kuat atas pandangan yang baru disampaikan',
        mnemonic: 'Alternatif eksekutif dan akademik yang jauh lebih segar daripada sekadar \'I agree with you\'.',
        speakText: 'echo that sentiment',
      },
      {
        symbol: 'strike a balance between',
        reading: '/straɪk ə ˈbæləns bɪˈtwiːn/',
        meaning: 'Mencapai titik keseimbangan yang tepat di antara dua kutub',
        mnemonic: 'Frasa kunci solusi jalan tengah untuk esai kebijakan publik, teknologi, dan manajemen.',
        speakText: 'strike a balance between',
      },
      {
        symbol: 'weigh the pros and cons',
        reading: '/weɪ ðə proʊz ænd kɑːnz/',
        meaning: 'Menimbang keuntungan dan kerugian secara matang',
        mnemonic: 'Weigh (menimbang, ejaan tanpa t di akhir!) + pros and cons = evaluasi rasional sebelum keputusan.',
        speakText: 'weigh the pros and cons',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-004',
      title: 'Synthesizing Positions (\'Building on X, ...\' & Balanced Thesis)',
      formula: 'Building on [Name]\'s point about [A], we must also consider [B].',
      formulaReading: 'Building on Liam\'s point about privacy, regulators must strike a balance between safety and innovation.',
      explanation: 'Pembaca & penguji menilai apakah tulisan/ucapan Anda benar-benar berinteraksi dalam diskusi akademik, bukan monolog terpisah. Gunakan frasa partisip pembuka \'Building on [Name]\'s observation...\' atau \'Echoing [Name]\'s concern...\' untuk alur yang langsung nyambung.',
      examples: [
        {
          jp: 'Building on Maya\'s point about urban transit, congestion pricing funds cleaner buses.',
          reading: '/ˈbɪldɪŋ ɑːn ˈmaɪəz pɔɪnt əˈbaʊt ˈɜːrbən ˈtrænzɪt kənˈdʒɛstʃən ˈpraɪsɪŋ fʌndz ˈkliːnər ˈbʌsɪz/',
          id: 'Mengembangkan poin Maya tentang transportasi kota, tarif kemacetan turut mendanai bus yang lebih bersih.',
        },
        {
          jp: 'Effective AI governance must strike a balance between open research and consumer safety.',
          reading: '/ɪˈfɛktɪv ˌeɪˈaɪ ˈɡʌvərnəns mʌst straɪk ə ˈbæləns bɪˈtwiːn ˈoʊpən ˈriːsɜːrtʃ ænd kənˈsuːmər ˈseɪfti/',
          id: 'Tata kelola AI yang efektif harus mencapai keseimbangan antara riset terbuka dan keselamatan konsumen.',
        },
      ],
    },
    contrastiveTip: 'Jangan hanya menyalin ulang argumen mahasiswa di soal diskusi kelas & forum akademik; wajib tambahkan satu alasan baru atau contoh nyata milik Anda sendiri!',
  },
  // ===========================================================================
  // Level B2 — UNIT 5 (GP-EN-B2-005)
  // ===========================================================================
  'en-us-b2-u5-kosakata': {
    headline: 'Kosakata Inti Kerja Tim & Memberi Masukan Kerja Secara Profesional',
    subtitle: 'Kuasai istilah rekayasa produk yang dipakai insinyur dan manajer produk di Silicon Valley saat membahas reliabilitas, utang teknis, dan desain sistem.',
    items: [
      {
        symbol: 'architectural trade-off',
        reading: '/ˌɑːrkəˈtɛktʃərəl ˈtreɪdˌɔːf/',
        meaning: 'Kompromi desain arsitektur (mengorbankan satu aspek demi keunggulan aspek lain)',
        mnemonic: 'Tidak ada sistem sempurna: memilih konsistensi ketat sering kali menuntut trade-off pada latensi.',
        speakText: 'architectural trade-off',
      },
      {
        symbol: 'incur technical debt',
        reading: '/ɪnˈkɜːr ˈtɛknɪkəl dɛt/',
        meaning: 'Menimbulkan / menumpuk utang teknis akibat jalan pintas kode',
        mnemonic: 'Pasangan kata alami baku untuk \'debt\' (utang) atau \'cost\' adalah kata kerja resmi \'incur\' (bukan \'make debt\')!',
        speakText: 'incur technical debt',
      },
      {
        symbol: 'nitpick (nit:)',
        reading: '/ˈnɪtˌpɪk/',
        meaning: 'Komentar koreksi gaya/detail kecil yang tidak menghalangi persetujuan PR',
        mnemonic: 'Saat memberi ulasan kerja di AS, mengawali catatan dengan \'Nit:\' memberi tahu rekan bahwa saran itu kecil/opsional, bukan hambatan utama.',
        speakText: 'nitpick (nit:)',
      },
      {
        symbol: 'single point of failure',
        reading: '/ˈsɪŋɡəl pɔɪnt ʌv ˈfeɪljər/',
        meaning: 'Satu komponen kritis yang jika mati akan melumpuhkan seluruh sistem',
        mnemonic: 'Istilah wajib wawancara System Design dan tinjauan infrastruktur (disingkat SPOF).',
        speakText: 'single point of failure',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-005',
      title: 'Impersonal & Causative Feedback in Code Reviews',
      formula: 'Netral: Simplifying this step would make review easier. | Menyuruh sistem/orang: have the team/system run X',
      formulaReading: 'Caching tokens here avoids hitting the auth service on every request.',
      explanation: 'Masukan kerja terbaik selalu fokus pada HASIL KERJA, bukan menyerang orangnya (\'You made a messy draft\' -> kurang sopan; \'Simplifying this section makes the report much clearer\' -> profesional & sopan). Selain itu, gunakan pola aktif \'have/make + Objek + V1\' untuk meminta bantuan atau mengatur tugas otomatis.',
      examples: [
        {
          jp: 'Hardcoding credentials here incurs security risks and blocks rotation.',
          reading: '/ˈhɑːrdˌkoʊdɪŋ krəˈdɛnʃəlz hɪr ɪnˈkɜːrz sɪˈkjʊrəti rɪsks ænd blɑːks roʊˈteɪʃən/',
          id: 'Menanam kredensial secara statis di sini menimbulkan risiko keamanan dan menghambat rotasi kunci.',
        },
        {
          jp: 'Let\'s have the assistant run a final check before publishing.',
          reading: '/lɛts hæv ðə ˌsiːˈaɪ ˈpaɪpˌlaɪn rʌn ˌɪntəˈɡreɪʃən tɛsts bɪˈfɔːr ˈmɜːrdʒɪŋ/',
          id: 'Mari minta asisten menjalankan pemeriksaan akhir sebelum dipublikasikan.',
        },
      ],
    },
    contrastiveTip: 'Ingat pasangan kata alami formal: \'incur technical debt / incur latency overhead\' dan \'pay down technical debt\' (melunasi/mengurangi utang teknis).',
  },
  'en-us-b2-u5-tata-bahasa': {
    headline: 'Struktur Kausatif (Have/Get) & Pasif Objektif pada Dokumen RFC',
    subtitle: 'Bedakan kapan memakai \'have something done\', \'have someone/system do something\', dan kalimat pasif bermodal dalam spesifikasi teknis.',
    items: [
      {
        symbol: 'have the service retry (Active Causative)',
        reading: '/hæv ðə ˈsɜːrvɪs riːˈtraɪ/',
        meaning: 'Mengatur layanan agar mencoba ulang (have + pelaku/sistem + V1)',
        mnemonic: 'Jika objek sesudah \'have\' adalah PELAKU aksi, gunakan kata kerja dasar murni (V1 tanpa \'to\')!',
        speakText: 'have the service retry (Active Causative)',
      },
      {
        symbol: 'get the payload compressed (Passive Causative)',
        reading: '/ɡɛt ðə ˈpeɪˌloʊd kəmˈprɛst/',
        meaning: 'Membuat muatan data dikompresi (get/have + objek sasaran + V3)',
        mnemonic: 'Jika objek sesudah \'have/get\' adalah SASARAN yang dikenai tindakan, wajib gunakan bentuk V3!',
        speakText: 'get the payload compressed (Passive Causative)',
      },
      {
        symbol: 'must be invalidated',
        reading: '/mʌst bi ɪnˈvæləˌdeɪtɪd/',
        meaning: 'Wajib dibatalkan / dihapus masa berlakunya (Modal Passive)',
        mnemonic: 'Standar penulisan spesifikasi RFC: fokus pada objek sistem (\'Stale cache entries must be invalidated\').',
        speakText: 'must be invalidated',
      },
      {
        symbol: 'prevent requests from timing out',
        reading: '/prɪˈvɛnt rɪˈkwɛsts frʌm ˈtaɪmɪŋ aʊt/',
        meaning: 'Mencegah permintaan mengalami kehabisan waktu',
        mnemonic: 'Rumus wajib: prevent / keep / stop + Object + FROM + V-ing (bukan \'prevent to timeout\'!).',
        speakText: 'prevent requests from timing out',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-005',
      title: 'Active vs. Passive Causatives & Prevention Verbs',
      formula: 'have + Agent + V1 | have/get + Target + V3 | prevent + Obj + from + V-ing',
      formulaReading: 'We had the load balancer reroute traffic and got the SSL certificates renewed.',
      explanation: 'Tiga struktur ini mendominasi komunikasi teknis Amerika: (1) \'have + system + V1\' untuk delegasi tugas, (2) \'have/get + artifact + V3\' ketika berfokus pada hasil akhir suatu objek, dan (3) \'prevent/keep + X + from + V-ing\' untuk mitigasi insiden.',
      examples: [
        {
          jp: 'We got the penetration test completed before signing the enterprise deal.',
          reading: '/wi ɡɑːt ðə ˌpɛnəˈtreɪʃən tɛst kəmˈpliːtɪd bɪˈfɔːr ˈsaɪnɪŋ ði ˈɛntərˌpraɪz diːl/',
          id: 'Kami memastikan uji penetrasi diselesaikan sebelum menandatangani kontrak korporat.',
        },
        {
          jp: 'Rate limiting prevents malicious bots from overwhelming our login endpoint.',
          reading: '/reɪt ˈlɪmɪtɪŋ prɪˈvɛnts məˈlɪʃəs bɑːts frʌm ˌoʊvərˈwɛlmɪŋ ˈaʊər ˈlɔːɡɪn ˈɛndˌpɔɪnt/',
          id: 'Pembatasan laju mencegah bot jahat membanjiri titik masuk login kami.',
        },
      ],
    },
    contrastiveTip: 'Jebakan umum: jangan tulis \'have the worker to process\' (salah karena ada \'to\'). Gunakan \'have the worker process\' ATAU \'get the worker to process\'!',
  },
  'en-us-b2-u5-diskusi-toefl': {
    headline: 'Komunikasi Asinkron Lintas Zona Waktu & Kuliah Teknologi',
    subtitle: 'Kuasai ungkapan serah-terima kerja lintas benua sekaligus kosakata algoritma/komputasi yang sering muncul di bacaan dan kuliah ujian bahasa Inggris internasional.',
    items: [
      {
        symbol: 'hand off cleanly',
        reading: '/hænd ɔːf ˈkliːnli/',
        meaning: 'Menyerahkan tongkat estafet pekerjaan secara rapi ke zona waktu berikutnya',
        mnemonic: 'Analogi lari estafet: dokumentasi konteks yang jelas membuat tim di benua lain langsung bisa berlari tanpa bingung.',
        speakText: 'hand off cleanly',
      },
      {
        symbol: 'unblock a teammate',
        reading: '/ʌnˈblɑːk ə ˈtiːmˌmeɪt/',
        meaning: 'Menyingkirkan hambatan teknis/keputusan agar rekan tim dapat lanjut bekerja',
        mnemonic: 'Prioritas nomor satu seorang engineer senior di perusahaan global: unblocking others.',
        speakText: 'unblock a teammate',
      },
      {
        symbol: 'diminishing returns',
        reading: '/dɪˈmɪnɪʃɪŋ rɪˈtɜːrnz/',
        meaning: 'Hasil tambahan yang makin mengecil meskipun usaha/biaya terus ditambah',
        mnemonic: 'Konsep favorit lintas kuliah ekonomi dan teknologi (mis. menambah core CPU melampaui batas paralelisasi).',
        speakText: 'diminishing returns',
      },
      {
        symbol: 'computational overhead',
        reading: '/ˌkɑːmpjəˈteɪʃənəl ˈoʊvərˌhɛd/',
        meaning: 'Beban komputasi ekstra (memori/waktu) di luar tugas inti',
        mnemonic: 'Sering dikontraskan dengan efisiensi: fitur enkripsi atau abstraksi membawa sedikit computational overhead.',
        speakText: 'computational overhead',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-005',
      title: 'Pola \'Semakin..., Semakin...\' (The more..., the more/less...)',
      formula: 'The + Comparative + S + V, the + Comparative + S + V',
      formulaReading: 'The deeper the neural network grows, the higher the computational overhead becomes.',
      explanation: 'Konstruksi komparatif ganda (\'The more X..., the less Y...\') sangat sering diujikan pada latihan membaca & menulis dan dipakai menjelaskan skalabilitas sistem maupun hukum *diminishing returns*.',
      examples: [
        {
          jp: 'The clearer your project summary is, the faster reviewers can help you.',
          reading: '/ðə ˈklɪrər jʊr pʊl rɪˈkwɛst dɪˈskrɪpʃən ɪz ðə ˈfæstər rɪˈvjuːərz kæn ʌnˈblɑːk juː/',
          id: 'Semakin jelas ringkasan proyek Anda, semakin cepat peninjau dapat membantu Anda.',
        },
        {
          jp: 'Beyond eight worker threads, lock contention yields diminishing returns.',
          reading: '/bɪˈjɑːnd eɪt ˈwɜːrkər θrɛdz lɑːk kənˈtɛnʃən jiːldz dɪˈmɪnɪʃɪŋ rɪˈtɜːrnz/',
          id: 'Di atas delapan utas pekerja, perebutan kunci memori menghasilkan manfaat tambahan yang kian menyusut.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan kata sandang \'The\' wajib muncul di KEDUA belah bagian kalimat: \'The larger the payload, the slower the rendering\' (bukan \'Larger payload, slower rendering\').',
  },
  // ===========================================================================
  // Level B2 — UNIT 6 (GP-EN-B2-006)
  // ===========================================================================
  'en-us-b2-u6-kosakata': {
    headline: 'Kosakata Evaluasi Proyek & Analisis Akar Masalah',
    subtitle: 'Pelajari istilah profesional Amerika untuk meninjau keberhasilan maupun kegagalan proyek secara objektif tanpa saling menyalahkan (evaluasi objektif tanpa saling menyalahkan).',
    items: [
      {
        symbol: 'foresight',
        reading: '/ˈfɔːrˌsaɪt/',
        meaning: 'Visi antisipasi ke depan sebelum masalah benar-benar terjadi',
        mnemonic: 'Kebalikan dari \'hindsight\' (menoleh sesudah kejadian): foresight = melihat jauh ke depan sebelum badai tiba.',
        speakText: 'foresight',
      },
      {
        symbol: 'contingency plan',
        reading: '/kənˈtɪndʒənsi plæn/',
        meaning: 'Rencana darurat cadangan jika skenario utama meleset',
        mnemonic: 'Selalu disiapkan untuk mengantisipasi kegagalan vendor, gangguan server, atau gejolak nilai tukar.',
        speakText: 'contingency plan',
      },
      {
        symbol: 'avert a crisis',
        reading: '/əˈvɜːrt ə ˈkraɪsɪs/',
        meaning: 'Mencegah / mengelakkan krisis tepat sebelum meledak',
        mnemonic: 'Pasangan kata alami formal B2–C1: kita tidak sekadar \'stop a crisis\', melainkan \'avert a crisis / disaster\'.',
        speakText: 'avert a crisis',
      },
      {
        symbol: 'stem the tide of',
        reading: '/stɛm ðə taɪd ʌv/',
        meaning: 'Membendung gelombang lonjakan buruk (pembatalan/kerugian)',
        mnemonic: 'Analogi membendung pasang air laut yang deras, mis. \'stem the tide of customer cancellations\'.',
        speakText: 'stem the tide of',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-006',
      title: 'Pengandaian Masa Lalu (If + had V3, would have V3) for Evaluasi Pengalaman Secara Objektif',
      formula: 'If + S + had + V3, S + would / could / might + have + V3',
      formulaReading: 'If we had drafted a contingency plan, we would have averted the outage.',
      explanation: 'Pengandaian Masa Lalu (If + had V3, would have V3) mengandaikan masa lalu yang sudah tidak bisa diubah demi memetik pelajaran organisasi. Gunakan \'would have + V3\' untuk hasil pasti yang dibayangkan, dan \'could/might have + V3\' untuk peluang yang mungkin tercapai.',
      examples: [
        {
          jp: 'If our vendor had flagged the chip shortage earlier, we could have switched suppliers.',
          reading: '/ɪf ˈaʊər ˈvɛndər hæd flæɡd ðə tʃɪp ˈʃɔːrtɪdʒ ˈɜːrliər wi kʊd həv swɪtʃt səˈplaɪərz/',
          id: 'Seandainya vendor kita memberi tahu kelangkaan cip lebih awal, kita sebenarnya bisa beralih pemasok.',
        },
        {
          jp: 'Without your foresight on backups, the team wouldn\'t have recovered so fast.',
          reading: '/wɪˈðaʊt jʊr ˈfɔːrˌsaɪt ɑːn ˈbækʌps ðə tiːm ˈwʊdənt həv rɪˈkʌvərd soʊ fæst/',
          id: 'Tanpa antisipasi Anda soal pencadangan, tim tidak akan pulih secepat itu.',
        },
      ],
    },
    contrastiveTip: 'Hindari kesalahan paling fatal di bagian \'If\': JANGAN pernah taruh \'would have\' di dalam bagian \'If\' (*\'If we would have known\'* -> SALAH dalam bahasa Inggris resmi!). Wajib \'If we had known\'.',
  },
  'en-us-b2-u6-tata-bahasa': {
    headline: 'Pengandaian Campuran (Masa Lalu & Sekarang) (Sebab Lampau → Akibat Sekarang) & \'But for\'',
    subtitle: 'Bedakan dengan tajam kapan memakai \'would have V3\' (hasil di masa lalu) vs. \'would V1\' (kondisi nyata saat ini akibat keputusan masa lalu).',
    items: [
      {
        symbol: 'If we had invested..., we would be profitable today',
        reading: '/ɪf wi hæd ɪnˈvɛstɪd wi wʊd bi ˈprɑːfɪtəbəl təˈdeɪ/',
        meaning: 'Sebab di masa lalu (had V3) → Dampak yang terasa HARI INI (would + V1)',
        mnemonic: 'Perhatikan penanda waktu \'today / right now / currently\' di bagian kalimat kedua: itulah sinyal wajib Pengandaian Campuran (Masa Lalu & Sekarang)!',
        speakText: 'If we had invested..., we would be profitable today',
      },
      {
        symbol: 'If she weren\'t fluent..., she wouldn\'t have won',
        reading: '/ɪf ʃi wɜːrnt ˈfluːənt ʃi ˈwʊdənt həv wʌn/',
        meaning: 'Kondisi permanen/umum (bentuk lampau pengandaian (V2/were)) → Hasil spesifik di masa lalu (would have V3)',
        mnemonic: 'Kemahiran bahasanya berlaku umum hingga kini (\'weren\'t fluent\'), yang memengaruhi seleksi beasiswa bulan lalu.',
        speakText: 'If she weren\'t fluent..., she wouldn\'t have won',
      },
      {
        symbol: 'But for the emergency grant',
        reading: '/bʌt fɔːr ði ɪˈmɜːrdʒənsi ɡrænt/',
        meaning: 'Seandainya bukan karena hibah darurat tersebut',
        mnemonic: 'Padanan formal berkelas tinggi untuk \'If it hadn\'t been for...\' diikuti langsung oleh Frasa Kata Benda!',
        speakText: 'But for the emergency grant',
      },
      {
        symbol: 'Otherwise, we would now face...',
        reading: '/ˈʌðərˌwaɪz wi wʊd naʊ feɪs/',
        meaning: 'Jika tidak demikian (tadi), kita sekarang pasti menghadapi...',
        mnemonic: '\'Otherwise\' menggantikan seluruh bagian pengandaian negatif dari kalimat sebelumnya secara efisien.',
        speakText: 'Otherwise, we would now face...',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-006',
      title: 'Pengandaian Campuran (Masa Lalu & Sekarang) & Kata Depan \'But for\'',
      formula: 'Past→Present: If + S + had + V3, S + would + V1 (now) | Present→Past: If + S + V2/were, S + would have + V3',
      formulaReading: 'But for early seed funding, our lab would not exist today.',
      explanation: 'Kunci menaklukkan soal Pengandaian Campuran (Masa Lalu & Sekarang) di ujian bahasa Inggris tingkat lanjut adalah memeriksa keterangan waktu di tiap bagian kalimat. Jika bagian \'If\' lampau (\'last year\') tetapi bagian utama kalimat memiliki \'today / now\', gunakan \'would + V1\' (BUKAN \'would have V3\').',
      examples: [
        {
          jp: 'If we had automated compliance checks last year, we wouldn\'t be scrambling right now.',
          reading: '/ɪf wi hæd ˈɔːtəˌmeɪtɪd kəmˈplaɪəns tʃɛks læst jɪr wi ˈwʊdənt bi ˈskræmblɪŋ raɪt naʊ/',
          id: 'Seandainya tahun lalu kita mengotomatiskan pemeriksaan kepatuhan, kita tidak akan kelabakan sekarang.',
        },
        {
          jp: 'But for Dr. Sari\'s mentorship, I would not hold this fellowship today.',
          reading: '/bʌt fɔːr ˈdɑːktər ˈsɑːriz ˈmɛntɔːrˌʃɪp aɪ wʊd nɑːt hoʊld ðɪs ˈfɛloʊˌʃɪp təˈdeɪ/',
          id: 'Seandainya bukan karena bimbingan Dr. Sari, saya tidak akan memegang beasiswa riset ini hari ini.',
        },
      ],
    },
    contrastiveTip: 'Cek kilat ujian: lihat kata terakhir kalimat! Ada \'yesterday/in 2022\'? Pakai \'would have V3\'. Ada \'today/now/currently\'? Pakai \'would V1 / would be V-ing\'!',
  },
  'en-us-b2-u6-diskusi-toefl': {
    headline: 'Penalaran Kontrafaktual dalam Kuliah Sejarah, Lingkungan & Ekonomi',
    subtitle: 'Dosen di kelas sering memakai skenario \'What would have happened without X?\' untuk menekankan betapa krusialnya peran suatu inovasi atau spesies kunci.',
    items: [
      {
        symbol: 'pivotal turning point',
        reading: '/ˈpɪvətəl ˈtɜːrnɪŋ pɔɪnt/',
        meaning: 'Titik balik krusial yang mengubah arah sejarah atau proyek',
        mnemonic: 'Pivot = poros putar. Momen ketika arah perkembangan berbelok secara permanen.',
        speakText: 'pivotal turning point',
      },
      {
        symbol: 'keystone species',
        reading: '/ˈkiːˌstoʊn ˈspiːʃiːz/',
        meaning: 'Spesies kunci penjaga keseimbangan seluruh ekosistem',
        mnemonic: 'Topik abadi kuliah biologi (seperti berang-berang laut pemakan bulu babi penjaga hutan kelp).',
        speakText: 'keystone species',
      },
      {
        symbol: 'trigger a domino effect',
        reading: '/ˈtrɪɡər ə ˈdɑːməˌnoʊ ɪˈfɛkt/',
        meaning: 'Memicu efek berantai yang menjatuhkan komponen satu per satu',
        mnemonic: 'Sangat efektif mendeskripsikan dampak runtuhnya satu mata rantai ekologis atau finansial.',
        speakText: 'trigger a domino effect',
      },
      {
        symbol: 'take a drastically different trajectory',
        reading: '/teɪk ə ˈdræstɪkli ˈdɪfrənt trəˈdʒɛktəri/',
        meaning: 'Menempuh lintasan perkembangan yang jauh berbeda',
        mnemonic: 'Trajectory = lintasan peluru/roket; dipakai secara figuratif untuk arah karier, ekonomi, atau evolusi.',
        speakText: 'take a drastically different trajectory',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-006',
      title: 'Counterfactual Synthesis in Academic Speaking & Essays',
      formula: 'Without [Key Factor], [System] would have + V3 / would take a different trajectory.',
      formulaReading: 'Without sea otters, urchin populations would have decimated coastal kelp forests.',
      explanation: 'Saat menjawab soal rangkuman bacaan & kuliah atau menulis esai beasiswa tentang kontribusi riset Anda, penalaran kontrafaktual (\'Without X, Y would remain unsolved\') menonjolkan urgensi topik secara tajam.',
      examples: [
        {
          jp: 'Without standardized shipping containers, global trade would have grown far more slowly.',
          reading: '/wɪˈðaʊt ˈstændərˌdaɪzd ˈʃɪpɪŋ kənˈteɪnərz ˈɡloʊbəl treɪd wʊd həv ɡroʊn fɑːr mɔːr ˈsloʊli/',
          id: 'Tanpa kontainer pengiriman terstandarisasi, perdagangan global pasti tumbuh jauh lebih lambat.',
        },
        {
          jp: 'Removing that keystone predator would trigger a trophic domino effect.',
          reading: '/rɪˈmuːvɪŋ ðæt ˈkiːˌstoʊn ˈprɛdətər wʊd ˈtrɪɡər ə ˈtroʊfɪk ˈdɑːməˌnoʊ ɪˈfɛkt/',
          id: 'Menghilangkan predator kunci tersebut akan memicu efek domino rantai makanan.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan subjek implisit \'Removing X would trigger...\' — kata kerja -ing (V-ing) di awal kalimat berfungsi sebagai bagian pengandaian ringkas (\'If we removed X, it would trigger...\').',
  },
  // ===========================================================================
  // Level B2 — UNIT 7 (GP-EN-B2-007)
  // ===========================================================================
  'en-us-b2-u7-kosakata': {
    headline: 'Memadatkan Prosa Eksekutif & Akademik (Concise Reporting)',
    subtitle: 'Laporan direksi dan jurnal ilmiah membenci pengulangan kata sambung \'because / after / which was\'. Frasa V-ing/V3 memangkas kalimat bertele-tele menjadi tajam.',
    items: [
      {
        symbol: 'streamline operations',
        reading: '/ˈstriːmˌlaɪn ˌɑːpəˈreɪʃənz/',
        meaning: 'Merampingkan / menyederhanakan alur operasional agar bebas pemborosan',
        mnemonic: 'Bentuk streamline seperti bodi pesawat aerodinamis yang membelah angin tanpa hambatan.',
        speakText: 'streamline operations',
      },
      {
        symbol: 'spearheaded by',
        reading: '/ˈspɪrˌhɛdɪd baɪ/',
        meaning: 'Dipelopori / dipimpin oleh (Bentuk V3 pembuka kalimat)',
        mnemonic: 'Pangkas \'The project, which was spearheaded by Rina, succeeded\' menjadi \'Spearheaded by Rina, the project succeeded\'!',
        speakText: 'spearheaded by',
      },
      {
        symbol: 'stemming from',
        reading: '/ˈstɛmɪŋ frʌm/',
        meaning: 'Yang berakar / bersumber dari (Bentuk V-ing aktif)',
        mnemonic: 'Stem = batang tanaman tempat cabang tumbuh. Menggantikan \'which stems from\' secara ringkas.',
        speakText: 'stemming from',
      },
      {
        symbol: 'having secured approval',
        reading: '/ˈhævɪŋ sɪˈkjʊrd əˈpruːvəl/',
        meaning: 'Setelah berhasil mengantongi persetujuan resmi (Bentuk Having + V3)',
        mnemonic: '\'Having + V3\' menegaskan bahwa tahap A benar-benar rampung terlebih dahulu sebelum aksi utama dimulai.',
        speakText: 'having secured approval',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-007',
      title: 'Memadatkan Kalimat dengan V-ing, V3 & Having + V3',
      formula: 'Active: V-ing..., S + V | Passive: V3 + by..., S + V | Prior Action: Having + V3..., S + V',
      formulaReading: 'Having secured regulatory approval, the fintech launched across Java.',
      explanation: 'Tiga bentuk frasa V-ing/V3 menggantikan anak kalimat panjang: (1) V-ing untuk aksi aktif simultan/sebab, (2) bentuk V3 untuk makna pasif (\'Designed for slow internet, the app...\'), dan (3) Having + V3 untuk aksi yang selesai lebih dulu.',
      examples: [
        {
          jp: 'Designed for rural clinics, the portable ultrasound runs on solar power.',
          reading: '/dɪˈzaɪnd fɔːr ˈrʊrəl ˈklɪnɪks ðə ˈpɔːrtəbəl ˈʌltrəˌsaʊnd rʌnz ɑːn ˈsoʊlər ˈpaʊər/',
          id: 'Dirancang bagi klinik pedesaan, alat ultrasonografi portabel ini beroperasi dengan tenaga surya.',
        },
        {
          jp: 'Having analyzed ten thousand records, the auditors uncovered three anomalies.',
          reading: '/ˈhævɪŋ ˈænəˌlaɪzd tɛn ˈθaʊzənd ˈrɛkərdz ði ˈɔːdɪtərz ʌnˈkʌvərd θriː əˈnæməliz/',
          id: 'Setelah menganalisis sepuluh ribu catatan, para auditor menemukan tiga anomali.',
        },
      ],
    },
    contrastiveTip: 'Bedakan V-ing vs V3 di awal kalimat dengan melihat SUBJEK bagian utama kalimatnya: jika subjek melakukan aksi → V-ing; jika subjek dikenai aksi → V3!',
  },
  'en-us-b2-u7-tata-bahasa': {
    headline: 'Aturan Subjek Identik: Mengeliminasi Subjek Tidak Nyambungs',
    subtitle: 'Jebakan tata bahasa nomor satu pada esai pascasarjana, GMAT, dan penulisan esai bahasa Inggris adalah pembuka kalimat V-ing/V3 yang subjeknya tidak cocok dengan subjek bagian utama kalimat!',
    items: [
      {
        symbol: 'Walking into the lab, the samples... (SALAH!)',
        reading: '/ˈwɔːkɪŋ ˈɪntuː ðə læb/',
        meaning: 'Contoh Subjek Tidak Nyambung: seolah-olah \'sampel\' yang berjalan kaki masuk ke lab!',
        mnemonic: 'Subjek tepat sesudah koma WAJIB pelaku dari aksi partisip di depan koma (\'Walking into the lab, the researcher noticed...\').',
        speakText: 'Walking into the lab, the samples... (SALAH!)',
      },
      {
        symbol: 'Once approved, the plan...',
        reading: '/wʌns dɪˈplɔɪd ðə pætʃ/',
        meaning: 'Begitu dirilis, tambalan kode tersebut... (Subjek \'the patch\' cocok karena ia yang dirilis)',
        mnemonic: 'Kata hubung waktu/syarat (\'Once / When / While / If / Unless\') + V3/V-ing sangat ampuh memadatkan prosa ilmiah.',
        speakText: 'Once approved, the plan moved forward.',
      },
      {
        symbol: 'Viewed from space, the delta...',
        reading: '/vjuːd frʌm speɪs ðə ˈdɛltə/',
        meaning: 'Dilihat dari luar angkasa, delta sungai tersebut...',
        mnemonic: 'Subjek sesudah koma adalah \'the delta\' (benda yang dilihat dari angkasa), BUKAN \'astronot\'!',
        speakText: 'Viewed from space, the delta...',
      },
      {
        symbol: 'When calibrating sensors, engineers must...',
        reading: '/wɛn ˈkæləˌbreɪtɪŋ ˈsɛnsərz/',
        meaning: 'Saat mengkalibrasi sensor, para insinyur wajib...',
        mnemonic: 'Jangan tulis \'When calibrating sensors, temperature must be constant\' — karena suhu tidak bisa mengkalibrasi sensor!',
        speakText: 'When calibrating sensors, engineers must...',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-007',
      title: 'Mencocokkan Pelaku di Awal Kalimat & Meringkas Anak Kalimat',
      formula: 'Frasa V-ing/V3, + [Matching Subject] + Verb | Once/When/Unless + V3, + [Passive Subject] + V',
      formulaReading: '✔ Having reviewed the data, the committee approved the grant. (✖ ...the grant was approved.)',
      explanation: 'Aturan besi tata bahasa standar Amerika: subjek gramatikal tepat setelah koma adalah pemilik frasa V-ing/V3 di depannya. Jika pembukanya \'Having reviewed the data,\', kata sesudah koma HARUS \'the committee / the researchers\' (yang meninjau), TIDAK BOLEH \'the grant / the conclusion\'!',
      examples: [
        {
          jp: 'Having reviewed three hundred applications, the fellowship panel selected twelve scholars.',
          reading: '/ˈhævɪŋ rɪˈvjuːd θriː ˈhʌndrəd ˌæpləˈkeɪʃənz ðə ˈfɛloʊˌʃɪp ˈpænəl sɪˈlɛktɪd twɛlv ˈskɑːlərz/',
          id: 'Setelah meninjau tiga ratus lamaran, panel beasiswa memilih dua belas penerima.',
        },
        {
          jp: 'Unless stored below four degrees, the reagent loses potency rapidly.',
          reading: '/ʌnˈlɛs stɔːrd bɪˈloʊ fɔːr dɪˈɡriːz ðə riˈeɪdʒənt ˈluːzɪz ˈpoʊtənsi ˈræpɪdli/',
          id: 'Kecuali disimpan di bawah suhu empat derajat, reagen tersebut kehilangan keampuhannya dengan cepat.',
        },
      ],
    },
    contrastiveTip: 'Trik koreksi cepat saat menulis esai: setiap kali Anda menaruh koma sesudah bagian kalimat \'V-ing / Having V3 / V3\', tanyakan \'SIAPA yang melakukan/mengalami ini?\' — tulis pelaku itu tepat setelah koma!',
  },
  'en-us-b2-u7-diskusi-toefl': {
    headline: 'Mendeskripsikan Tren Data, Lonjakan & Anomali secara Ringkas',
    subtitle: 'Latih kosakata laporan eksekutif dan kuliah ekonomi/demografi untuk menggambarkan kurva tren disertai frasa V-ing/V3 penjelas angka.',
    items: [
      {
        symbol: 'plateau at',
        reading: '/plæˈtoʊ æt/',
        meaning: 'Mendatar / tertahan stabil di angka tertentu sesudah periode naik',
        mnemonic: 'Plateau = dataran tinggi yang rata di puncak bukit (tekanan suara Amerika di suku kata KEDUA: pla-TOW!).',
        speakText: 'plateau at',
      },
      {
        symbol: 'outpace',
        reading: '/ˌaʊtˈpeɪs/',
        meaning: 'Tumbuh / melaju lebih cepat melampaui pesaing atau variabel pembanding',
        mnemonic: 'Out + pace (langkah lari): pertumbuhan permintaan outpaced kapasitas pasokan.',
        speakText: 'outpace',
      },
      {
        symbol: 'a sharp uptick in',
        reading: '/ə ʃɑːrp ˈʌpˌtɪk ɪn/',
        meaning: 'Kenaikan / lonjakan tajam yang terlihat jelas pada grafik',
        mnemonic: 'Istilah favorit analis ekonomi dan rapat produk AS pengganti \'a sudden increase\'.',
        speakText: 'a sharp uptick in',
      },
      {
        symbol: 'peaking at 78%',
        reading: '/ˈpiːkɪŋ æt ˈsɛvənti eɪt pərˈsɛnt/',
        meaning: 'Mencapai titik puncaknya pada angka 78% (Partisip penjelas data)',
        mnemonic: 'Tambahkan \', peaking at X\' atau \', accounting for Y%\' di ujung kalimat untuk menyisipkan angka tanpa kalimat baru!',
        speakText: 'peaking at 78%',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-007',
      title: 'Menambahkan Rincian Angka dengan V-ing di Akhir Kalimat',
      formula: 'Kalimat Tren Utama + , peaking at [X] / accounting for [Y]% / outpacing [Z]',
      formulaReading: 'Solar capacity surged threefold, outpacing coal additions for the first time.',
      explanation: 'Dalam laporan riset maupun presentasi direksi, frasa V-ing/V3 di AKHIR kalimat (tambahan V-ing di akhir kalimat) merangkum detail statistik secara mulus tanpa mengulang \'and it peaked at... and it accounted for...\'.',
      examples: [
        {
          jp: 'Mobile wallet transactions doubled in 2025, accounting for sixty percent of retail volume.',
          reading: '/ˈmoʊbəl ˈwɑːlɪt trænˈzækʃənz ˈdʌbəld ɪn ˈtwɛnti ˈtwɛnti faɪv əˈkaʊntɪŋ fɔːr ˈsɪksti pərˈsɛnt/',
          id: 'Transaksi dompet seluler berlipat ganda pada 2025, mencakup enam puluh persen volume ritel.',
        },
        {
          jp: 'User sign-ups climbed steadily through May before plateauing at fifty thousand.',
          reading: '/ˈjuːzər ˈsaɪnʌps klaɪmd ˈstɛdəli θruː meɪ bɪˈfɔːr plæˈtoʊɪŋ æt ˈfɪfti ˈθaʊzənd/',
          id: 'Pendaftaran pengguna naik stabil sepanjang Mei sebelum mendatar di angka lima puluh ribu.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan pelafalan Amerika untuk \'plateau\': /plæˈtoʊ/ (tekanan di akhir), berbeda dari ejaan Prancis atau pelafalan Inggris!',
  },
  // ===========================================================================
  // Level B2 — UNIT 8 (GP-EN-B2-008)
  // ===========================================================================
  'en-us-b2-u8-kosakata': {
    headline: 'Istilah Kunci Negosiasi Kompensasi Global & Kontrak Bisnis',
    subtitle: 'Baik saat menerima tawaran kerja jarak jauh AS maupun menegosiasikan ruang lingkup klien, kuasai kosakata tawar-menawar profesional ini.',
    items: [
      {
        symbol: 'scope creep',
        reading: '/skoʊp kriːp/',
        meaning: 'Meluasnya tuntutan pekerjaan secara perlahan melampaui kesepakatan awal tanpa tambahan biaya/waktu',
        mnemonic: 'Creep = merayap diam-diam. Musuh utama manajer proyek dan konsultan jika kontrak tidak tegas!',
        speakText: 'scope creep',
      },
      {
        symbol: 'non-negotiable / dealbreaker',
        reading: '/ˌnɑːnnɪˈɡoʊʃəbəl/ • /ˈdiːlˌbreɪkər/',
        meaning: 'Syarat mutlak yang jika dilanggar membatalkan seluruh kesepakatan',
        mnemonic: 'Misalnya kepatuhan privasi data atau hak kekayaan intelektual inti.',
        speakText: 'non-negotiable / dealbreaker',
      },
      {
        symbol: 'sweeten the pot / offer',
        reading: '/ˈswiːtən ðə ˈɔːfər/',
        meaning: 'Menambahkan insentif ekstra (bonus/saham/fleksibilitas) agar tawaran lebih menarik',
        mnemonic: 'Jika gaji pokok sudah mentok di batas atas pita gaji, perusahaan bisa sweeten the offer lewat sign-on bonus atau equity.',
        speakText: 'sweeten the pot / offer',
      },
      {
        symbol: 'meet halfway',
        reading: '/miːt ˌhæfˈweɪ/',
        meaning: 'Berkompromi secara adil dengan masing-masing pihak bergeser ke titik tengah',
        mnemonic: 'Ungkapan kolaboratif untuk mengunci kesepakatan win-win tanpa ada pihak yang merasa dikalahkan.',
        speakText: 'meet halfway',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-008',
      title: 'Menawar Syarat dengan Halus (\'Provided that / On condition that / As long as\')',
      formula: 'We can accommodate [X], provided that / as long as / on condition that [Y].',
      formulaReading: 'We can expedite delivery, provided that the scope remains locked.',
      explanation: 'Prinsip emas negosiasi Harvard: jangan pernah memberikan konsesi secara cuma-cuma (\'Sure, we\'ll add that feature\'). Selalu ikat konsesi Anda dengan syarat timbal balik memakai \'provided (that)\', \'on condition that\', atau \'as long as\' + Present Simple!',
      examples: [
        {
          jp: 'We can waive the setup fee, provided that you commit to a two-year term.',
          reading: '/wi kæn weɪv ðə ˈsɛtʌp fiː prəˈvaɪdɪd ðæt ju kəˈmɪt tuː ə tuː jɪr tɜːrm/',
          id: 'Kami dapat membebaskan biaya instalasi awal, dengan syarat Anda berkomitmen pada kontrak dua tahun.',
        },
        {
          jp: 'I\'d be thrilled to sign this week, as long as we can revisit equity after six months.',
          reading: '/aɪd bi θrɪld tə saɪn ðɪs wiːk æz lɔːŋ æz wi kæn riːˈvɪzɪt ˈɛkwəti ˈæftər sɪks mʌnθs/',
          id: 'Saya akan sangat senang menandatangani minggu ini, selama kita dapat meninjau ulang ekuitas setelah enam bulan.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan tata bahasa sesudah \'provided that / as long as\': meskipun merujuk masa depan, gunakan PRESENT TENSE (\'provided you commit\', BUKAN \'provided you will commit\')!',
  },
  'en-us-b2-u8-tata-bahasa': {
    headline: 'Presisi Logika Syarat: \'Unless\' vs. \'Provided that\' vs. \'In the event of\'',
    subtitle: 'Satu kata sambung syarat yang meleset pada kontrak atau soal bacaan artikel panjang dapat membalikkan arti hukum 180 derajat!',
    items: [
      {
        symbol: 'in the event of / in case of',
        reading: '/ɪn ði ɪˈvɛnt ʌv/',
        meaning: 'Apabila terjadi (peristiwa darurat/wanprestasi) — diikuti Frasa Kata Benda',
        mnemonic: 'Berbeda dari \'if\' biasa, \'in the event of a breach\' dipakai di kontrak formal untuk skenario kontingensi.',
        speakText: 'in the event of / in case of',
      },
      {
        symbol: 'unless notified in writing',
        reading: '/ʌnˈlɛs ˈnoʊtəˌfaɪd ɪn ˈraɪtɪŋ/',
        meaning: 'Kecuali apabila diberi tahu secara tertulis (= if NOT notified)',
        mnemonic: 'Jangan pernah taruh \'not\' ganda sesudah unless (*\'unless you don\'t notify\'* -> salah logika!).',
        speakText: 'unless notified in writing',
      },
      {
        symbol: 'subject to board approval',
        reading: '/ˈsʌbdʒɪkt tə bɔːrd əˈpruːvəl/',
        meaning: 'Bergantung pada / tunduk pada persetujuan akhir dewan direksi',
        mnemonic: 'Frasa pengaman wajib dalam email penawaran bisnis agar kesepakatan lisan belum mengikat secara sepihak.',
        speakText: 'subject to board approval',
      },
      {
        symbol: 'waive a penalty',
        reading: '/weɪv ə ˈpɛnəlti/',
        meaning: 'Membebaskan / melepaskan hak menagih denda secara resmi',
        mnemonic: 'Ejaan \'waive\' (melepaskan hak/biaya), jangan tertukar dengan \'wave\' (melambaikan tangan/gelombang)!',
        speakText: 'waive a penalty',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-008',
      title: 'Kalimat Syarat dalam Perjanjian (\'Unless\', \'In the event that/of\', \'Subject to\')',
      formula: 'Unless + Positive Verb | In the event of + Noun / In the event that + S + V | Subject to + Noun',
      formulaReading: 'Subscriptions renew automatically unless canceled thirty days prior.',
      explanation: 'Bedakan secara ketat: \'in case / in the event of\' menyatakan persiapan SEBELUM risiko terjadi atau klausul jika insiden muncul, sedangkan \'provided that\' menyatakan syarat agar hak diberikan. Selain itu, \'unless\' sudah mengandung arti \'if ... not\' sehingga kata kerjanya wajib positif.',
      examples: [
        {
          jp: 'The lease renews automatically unless either party gives sixty days\' written notice.',
          reading: '/ðə liːs rɪˈnuːz ˌɔːtəˈmætɪkli ʌnˈlɛs ˈiːðər ˈpɑːrti ɡɪvz ˈsɪksti deɪz ˈrɪtən ˈnoʊtɪs/',
          id: 'Sewa diperpanjang otomatis kecuali salah satu pihak memberikan pemberitahuan tertulis enam puluh hari sebelumnya.',
        },
        {
          jp: 'In the event of a server outage exceeding four hours, service credits apply.',
          reading: '/ɪn ði ɪˈvɛnt ʌv ə ˈsɜːrvər ˈaʊtɪdʒ ɪkˈsiːdɪŋ fɔːr ˈaʊərz ˈsɜːrvɪs ˈkrɛdɪts əˈplaɪ/',
          id: 'Apabila terjadi gangguan server yang melebihi empat jam, kredit kompensasi layanan berlaku.',
        },
      ],
    },
    contrastiveTip: 'Jebakan pembelajar Indonesia: \'Take an umbrella in case it rains\' (bawa payung SEKARANG buat jaga-jaga kalau hujan) ≠ \'Call me if it rains\' (telepon nanti HANYA JIKA benar-benar turun hujan)!',
  },
  'en-us-b2-u8-diskusi-toefl': {
    headline: 'Advokasi Diri di Kampus AS: Tenggat Riset, Asistensi & Pendanaan',
    subtitle: 'Mahasiswa pascasarjana di AS sering bernegosiasi soal pendanaan konferensi, perpanjangan tenggat lab, atau penyesuaian beasiswa—topik inti ujian bahasa Inggris Campus Conversations!',
    items: [
      {
        symbol: 'wiggle room',
        reading: '/ˈwɪɡəl ruːm/',
        meaning: 'Ruang kelonggaran / fleksibilitas kecil untuk negosiasi jadwal atau anggaran',
        mnemonic: 'Idiom sehari-hari yang sangat sering diucapkan staf dekanat atau manajer AS: \'Is there any wiggle room on the deadline?\'',
        speakText: 'wiggle room',
      },
      {
        symbol: 'stretch the budget',
        reading: '/strɛtʃ ðə ˈbʌdʒɪt/',
        meaning: 'Memaksimalkan anggaran terbatas agar cukup membiayai kebutuhan penting',
        mnemonic: 'Bayangkan menarik karet anggaran dengan hemat agar menjangkau lebih banyak pos riset.',
        speakText: 'stretch the budget',
      },
      {
        symbol: 'make an exception',
        reading: '/meɪk ən ɪkˈsɛpʃən/',
        meaning: 'Memberikan pengecualian khusus di luar aturan standar',
        mnemonic: 'Biasanya disertai bukti kuat dan alasan akademik yang sah pada percakapan kantor universitas.',
        speakText: 'make an exception',
      },
      {
        symbol: 'leverage competing offers',
        reading: '/ˈlɛvərɪdʒ kəmˈpiːtɪŋ ˈɔːfərz/',
        meaning: 'Memanfaatkan tawaran beasiswa/kerja dari tempat lain sebagai daya tawar',
        mnemonic: 'Di AS, \'leverage\' dilafalkan /ˈlɛvərɪdʒ/ (vokal /ɛ/, bukan /ˈliːvərɪdʒ/ ala Inggris)!',
        speakText: 'leverage competing offers',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-008',
      title: 'Polite Self-Advocacy (\'I was wondering if there might be...\')',
      formula: 'Past Continuous Distancing: I was wondering if + S + could/might + V1',
      formulaReading: 'I was wondering if there might be any wiggle room on the travel grant cap.',
      explanation: 'Saat meminta pengecualian kepada profesor atau direktur program beasiswa di AS, gunakan Past Continuous (\'I was wondering if...\', \'I was hoping we could...\') yang terdengar jauh lebih santun dan tidak menuntut dibanding \'I want to ask if can you...\'.',
      examples: [
        {
          jp: 'I was wondering if there might be any wiggle room on the lab submission date.',
          reading: '/aɪ wʌz ˈwʌndərɪŋ ɪf ðɛr maɪt bi ˈɛni ˈwɪɡəl ruːm ɑːn ðə læb səbˈmɪʃən deɪt/',
          id: 'Saya ingin menanyakan apakah sekiranya ada sedikit kelonggaran terkait tanggal pengumpulan laporan lab.',
        },
        {
          jp: 'Sharing my competing fellowship letter helped me leverage extra research funding.',
          reading: '/ˈʃɛrɪŋ maɪ kəmˈpiːtɪŋ ˈfɛloʊˌʃɪp ˈlɛtər hɛlpt mi ˈlɛvərɪdʒ ˈɛkstrə ˈriːsɜːrtʃ ˈfʌndɪŋ/',
          id: 'Menunjukkan surat tawaran beasiswa pembanding membantu saya menegosiasikan tambahan dana riset.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan kata kerja \'I was wondering if...\' BUKAN pertanyaan langsung, sehingga diakhiri tanda titik (.) dan urutan kata normal (\'if there might be\', bukan \'if might there be?\')!',
  },
  // ===========================================================================
  // Level B2 — UNIT 9 (GP-EN-B2-009)
  // ===========================================================================
  'en-us-b2-u9-kosakata': {
    headline: 'Kosakata Inti Soal Inferensi & Bukti pada bacaan artikel panjang',
    subtitle: 'Pahami perbedaan tajam antara apa yang tersirat oleh penulis (\'imply\') dan apa yang disimpulkan pembaca (\'infer\'), serta jebakan klaim ekstrem!',
    items: [
      {
        symbol: 'imply vs. infer',
        reading: '/ɪmˈplaɪ/ • /ɪnˈfɜːr/',
        meaning: 'Teks/penulis menyiratkan (imply) → Pembaca menyimpulkan secara logis (infer)',
        mnemonic: 'Ingat arah panahnya: penulis memberi petunjuk halus (imply), lalu otak Anda menarik kesimpulan (infer)!',
        speakText: 'imply vs. infer',
      },
      {
        symbol: 'substantiate a claim',
        reading: '/səbˈstænʃiˌeɪt ə kleɪm/',
        meaning: 'Membuktikan kebenaran suatu klaim dengan bukti konkret',
        mnemonic: 'Substantiate = memberi substansi/daging bukti nyata pada pernyataan teoretis.',
        speakText: 'substantiate a claim',
      },
      {
        symbol: 'plausible explanation',
        reading: '/ˈplɔːzəbəl ˌɛkspləˈneɪʃən/',
        meaning: 'Penjelasan yang masuk akal dan layak dipercaya berdasarkan bukti awal',
        mnemonic: 'Belum tentu mutlak 100% terbukti, tetapi sangat logis secara ilmiah.',
        speakText: 'plausible explanation',
      },
      {
        symbol: 'mutually exclusive',
        reading: '/ˈmjuːtʃuəli ɪkˈskluːsɪv/',
        meaning: 'Saling meniadakan (jika A terjadi, B mustahil terjadi bersamaan)',
        mnemonic: 'Sering muncul di bacaan artikel panjang: \'These two evolutionary pressures are not mutually exclusive\' (keduanya BISA berjalan beriringan!).',
        speakText: 'mutually exclusive',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-009',
      title: 'Logical Inference vs. Kata Mutlak yang Menjebak in Reading Passages',
      formula: 'Valid Inference: hedged logical necessity | Extreme Traps: solely / entirely / never / impossible',
      formulaReading: 'Not until 1950 did archival records appear → Records prior to 1950 were unavailable.',
      explanation: 'Pada soal membaca pemahaman tersirat (\'What can be inferred from paragraph 3?\'), jawaban benar TIDAK pernah melompat jauh dari bukti teks. Pilihan jawaban yang memakai kata mutlak seperti \'solely\', \'completely eliminated\', atau \'impossible\' hampir selalu jebakan salah!',
      examples: [
        {
          jp: 'Fossil pollen substantiates the claim that grasslands predated human arrival.',
          reading: '/ˈfɑːsəl ˈpɑːlən səbˈstænʃiˌeɪts ðə kleɪm ðæt ˈɡræsˌlændz priːˈdeɪtɪd ˈhjuːmən əˈraɪvəl/',
          id: 'Serbuk sari fosil membuktikan klaim bahwa padang rumput sudah ada mendahului kedatangan manusia.',
        },
        {
          jp: 'Economic growth and wetland conservation need not be mutually exclusive.',
          reading: '/ˌiːkəˈnɑːmɪk ɡroʊθ ænd ˈwɛtlænd ˌkɑːnsərˈveɪʃən niːd nɑːt bi ˈmjuːtʃuəli ɪkˈskluːsɪv/',
          id: 'Pertumbuhan ekonomi dan pelestarian lahan basah tidak harus saling meniadakan.',
        },
      ],
    },
    contrastiveTip: 'Hati-hati kata \'predate\' (/priːˈdeɪt/): artinya \'sudah ada LEBIH DULU sebelum X\' (pre + date), bukan berburu mangsa (predator)!',
  },
  'en-us-b2-u9-tata-bahasa': {
    headline: 'Membedah Kalimat Panjang ujian bahasa Inggris: Appositives & \'whereby / in which\'',
    subtitle: 'Kalimat bacaan artikel panjang rata-rata sepanjang 30–45 kata! Kuasai kerangka aposisi berjeda tanda pisah dan kata sambung \'whereby\' untuk menangkap tulang punggung ide.',
    items: [
      {
        symbol: 'whereby',
        reading: '/wɛrˈbaɪ/',
        meaning: 'Yang melaluinya / dengan mekanisme mana (menggantikan \'by which\')',
        mnemonic: 'Sangat sering muncul di definisi proses sains/hukum: \'a process whereby plants convert light...\'.',
        speakText: 'whereby',
      },
      {
        symbol: 'Subjek, — keterangan tambahan — , Kata Kerja',
        reading: '/əˈpɑːzətɪv/',
        meaning: 'Keterangan sisipan diapit koma atau tanda pisah yang menjelaskan kata benda di depannya',
        mnemonic: 'Trik membaca cepat ujian bahasa Inggris: lompati sementara sisipan di antara dua tanda pisah (—...—) untuk menemukan Subjek + Kata Kerja utama!',
        speakText: 'The city, a major trading hub, grew rapidly.',
      },
      {
        symbol: 'chief among them',
        reading: '/tʃiːf əˈmʌŋ ðɛm/',
        meaning: 'Yang paling utama di antaranya adalah...',
        mnemonic: 'Frasa elegan untuk menonjolkan satu faktor terpenting sesudah menyebut adanya beberapa faktor.',
        speakText: 'chief among them',
      },
      {
        symbol: 'distill complex prose',
        reading: '/dɪˈstɪl ˈkɑːmplɛks proʊz/',
        meaning: 'Menyaring kalimat rumit menjadi inti gagasan esensial',
        mnemonic: 'Keterampilan utama soal \'Sentence Simplification\' di bacaan artikel panjang: pertahankan hubungan sebab/kontras inti, buang hiasan minor!',
        speakText: 'distill complex prose',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-009',
      title: 'Menjelaskan Cara Kerja dengan \'whereby\' & Core-Relation Paraphrasing',
      formula: 'System / Process + whereby + S + V | Subject, [Sisipan Penjelas], + Main Verb',
      formulaReading: 'Osmosis is the mechanism whereby solvent molecules cross a semipermeable membrane.',
      explanation: 'Soal penyederhanaan kalimat (Sentence Simplification) di bacaan artikel panjang menguji apakah Anda bisa mengenali bagian utama kalimat di balik aposisi panjang serta menjaga relasi logis (\'whereby\' = mekanisme, \'despite\' = kontras) tanpa membalik sebab-akibat.',
      examples: [
        {
          jp: 'Peer review is the process whereby independent scholars vet research quality.',
          reading: '/pɪr rɪˈvjuː ɪz ðə ˈprɑːsɛs wɛrˈbaɪ ˌɪndɪˈpɛndənt ˈskɑːlərz vɛt ˈriːsɜːrtʃ ˈkwɑːləti/',
          id: 'Tinjauan sejawat adalah proses yang melaluinya para ilmuwan independen memeriksa mutu riset.',
        },
        {
          jp: 'Several obstacles—chief among them port congestion—slowed grain exports.',
          reading: '/ˈsɛvrəl ˈɑːbstəkəlz tʃiːf əˈmʌŋ ðɛm pɔːrt kənˈdʒɛstʃən sloʊd ɡreɪn ˈɛkspɔːrts/',
          id: 'Sejumlah hambatan—yang paling utama di antaranya kepadatan pelabuhan—memperlambat ekspor gandum.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan ejaan dan pelafalan Amerika \'process\': /ˈprɑːsɛs/ (vokal /ɑː/ seperti \'father\', bukan /ˈproʊsɛs/ ala Kanada/Inggris).',
  },
  'en-us-b2-u9-diskusi-toefl': {
    headline: 'Menaklukkan Soal 2 Poin Terakhir bacaan artikel panjang: Prose Summary',
    subtitle: 'Soal pamungkas setiap bacaan panjang bernilai 2 poin: Anda harus memilih 3 ide payung utama dan membuang 3 detail sempit atau pernyataan keliru!',
    items: [
      {
        symbol: 'overarching thesis',
        reading: '/ˌoʊvərˈɑːrtʃɪŋ ˈθiːsɪs/',
        meaning: 'Gagasan besar yang memayungi seluruh paragraf dalam artikel',
        mnemonic: 'Over + arch (lengkungan kubah besar): kubah utama yang menaungi seluruh tiang argumen bacaan.',
        speakText: 'overarching thesis',
      },
      {
        symbol: 'minor supporting detail',
        reading: '/ˈmaɪnər səˈpɔːrtɪŋ dɪˈteɪl/',
        meaning: 'Rincian contoh/angka spesifik yang benar secara fakta tetapi terlalu sempit untuk ringkasan',
        mnemonic: 'Jebakan paling licik di soal Ringkasan Bacaan Panjang: kalimatnya 100% BENAR ada di paragraf 4, tapi hanya contoh kecil sehingga BUKAN jawaban!',
        speakText: 'minor supporting detail',
      },
      {
        symbol: 'underscore the significance',
        reading: '/ˌʌndərˈskɔːr ðə sɪɡˈnɪfɪkəns/',
        meaning: 'Menggarisbawahi / menegaskan betapa pentingnya suatu temuan',
        mnemonic: 'Underscore = garis bawah penegas. Kata kerja favorit untuk merangkum tujuan penulis.',
        speakText: 'underscore the significance',
      },
      {
        symbol: 'taken together',
        reading: '/ˈteɪkən təˈɡɛðər/',
        meaning: 'Jika dilihat secara keseluruhan / digabungkan bersama-sama',
        mnemonic: 'Pembuka sintesis penutup yang menyatukan berbagai bukti lintas paragraf.',
        speakText: 'taken together',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-009',
      title: 'Macro-Idea Synthesis vs. Granular Detail Filtering',
      formula: 'Taken together, [Evidence A] and [Evidence B] underscore that + [Overarching Thesis].',
      formulaReading: 'Taken together, fossil and genetic data underscore that domestication occurred twice.',
      explanation: 'Untuk membedakan jawaban benar di Ringkasan Bacaan Panjang, tanyakan: \'Apakah pernyataan ini merangkum satu bagian/paragraf utuh, atau hanya satu contoh tanggal/nama tempat?\' Hanya pernyataan tingkat paragraf yang layak masuk 3 pilihan utama.',
      examples: [
        {
          jp: 'Taken together, these archival letters underscore the role of women in early astronomy.',
          reading: '/ˈteɪkən təˈɡɛðər ðiːz ɑːrˈkaɪvəl ˈlɛtərz ˌʌndərˈskɔːr ðə roʊl ʌv ˈwɪmɪn ɪn ˈɜːrli əˈstrɑːnəmi/',
          id: 'Jika dilihat secara keseluruhan, surat-surat arsip ini menegaskan peran perempuan dalam astronomi awal.',
        },
        {
          jp: 'An overarching summary omits minor supporting details such as single specimen weights.',
          reading: '/ən ˌoʊvərˈɑːrtʃɪŋ ˈsʌməri oʊˈmɪts ˈmaɪnər səˈpɔːrtɪŋ dɪˈteɪlz sʌtʃ æz ˈsɪŋɡəl ˈspɛsəmən weɪts/',
          id: 'Ringkasan menyeluruh mengesampingkan detail pendukung kecil seperti bobot satu spesimen tunggal.',
        },
      ],
    },
    contrastiveTip: 'Di US English, kata \'detail\' boleh ditekan di suku kata kedua /dɪˈteɪl/ maupun pertama /ˈdiːteɪl/—keduanya terdengar di rekaman penutur asli Amerika!',
  },
  // ===========================================================================
  // Level B2 — UNIT 10 (GP-EN-B2-010)
  // ===========================================================================
  'en-us-b2-u10-kosakata': {
    headline: 'Kata Kerja untuk Membantah Pendapat untuk Tugas Menulis Rangkuman Bacaan & Kuliah',
    subtitle: 'Dalam Esai Rangkuman Bacaan & Kuliah (20 menit), profesor hampir selalu mematahkan 3 argumen bacaan satu per satu. Variasikan kata kerja bantahan Anda agar tidak mengulang \'disagrees\' 3 kali!',
    items: [
      {
        symbol: 'cast doubt on',
        reading: '/kæst daʊt ɑːn/',
        meaning: 'Meragukan / menggoyahkan keabsahan argumen bacaan dengan bukti tandingan',
        mnemonic: 'Ungkapan nomor satu di standar esai rangkuman kuliah bahasa Inggris!',
        speakText: 'cast doubt on',
      },
      {
        symbol: 'refute the assertion that',
        reading: '/rɪˈfjuːt ði əˈsɜːrʃən ðæt/',
        meaning: 'Membantah / mematahkan klaim tegas bahwa...',
        mnemonic: 'Refute lebih kuat daripada \'question\': dosen menyajikan bukti yang membuktikan klaim bacaan keliru.',
        speakText: 'refute the assertion that',
      },
      {
        symbol: 'run counter to',
        reading: '/rʌn ˈkaʊntər tuː/',
        meaning: 'Berjalan berlawanan arah / bertolak belakang dengan prediksi teks',
        mnemonic: 'Sangat alami untuk mendeskripsikan data lapangan yang berlawanan dengan teori bacaan.',
        speakText: 'run counter to',
      },
      {
        symbol: 'call into question',
        reading: '/kɔːl ˈɪntuː ˈkwɛstʃən/',
        meaning: 'Mempertanyakan keandalan asumsi atau metode penelitian',
        mnemonic: 'Variasi elegan di paragraf kedua/ketiga esai Integrated agar kosakata Anda dinilai kaya oleh e-rater.',
        speakText: 'call into question',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-010',
      title: 'Point-by-Point Contrast Attribution (Reading vs. Lecture)',
      formula: 'Whereas the reading posits that [Claim], the lecturer casts doubt on this by pointing out that [Counter-evidence].',
      formulaReading: 'The reading claims X; however, the professor refutes this assertion, noting that Y.',
      explanation: 'Esai rangkuman bacaan & kuliah wajib 100% objektif (TANPA opini pribadi \'I agree with the professor\'!). Setiap paragraf isi menyandingkan satu klaim bacaan (\'The author contends/posits that...\') lalu langsung mematahkannya dengan bukti spesifik audio (\'Conversely, the lecturer calls this into question by explaining...\').',
      examples: [
        {
          jp: 'The lecturer casts doubt on the reading\'s cost estimate, noting hidden maintenance fees.',
          reading: '/ðə ˈlɛktʃər kæsts daʊt ɑːn ðə ˈriːdɪŋz kɔːst ˈɛstəmət ˈnoʊtɪŋ ˈhɪdən ˈmeɪntənəns fiːz/',
          id: 'Dosen meragukan estimasi biaya pada bacaan dengan menyoroti biaya pemeliharaan tersembunyi.',
        },
        {
          jp: 'Field observations run counter to the passage\'s claim that the mammals hunt alone.',
          reading: '/fiːld ˌɑːbzərˈveɪʃənz rʌn ˈkaʊntər tə ðə ˈpæsɪdʒɪz kleɪm ðæt ðə ˈmæməlz hʌnt əˈloʊn/',
          id: 'Pengamatan lapangan bertolak belakang dengan klaim bacaan bahwa mamalia tersebut berburu sendirian.',
        },
      ],
    },
    contrastiveTip: 'Aturan mutlak Esai Rangkuman Bacaan & Kuliah: JANGAN tulis kesimpulan opini pribadi! Cukup rangkum kontras bacaan vs. kuliah menggunakan Present Tense pelaporan.',
  },
  'en-us-b2-u10-tata-bahasa': {
    headline: 'Arsitektur Sintesis: \'Contrary to...\', \'The fact that...\', & \'Far from V-ing\'',
    subtitle: 'Naikkan skor Grammatical Range esai bahasa Inggris Anda dari level menengah ke mahir menggunakan pembuka kontras padat di awal kalimat.',
    items: [
      {
        symbol: 'Contrary to the author\'s claim,',
        reading: '/ˈkɑːntrɛri tə ði ˈɔːθərz kleɪm/',
        meaning: 'Berlawanan dengan klaim penulis bacaan,',
        mnemonic: 'Di US English, \'contrary\' dilafalkan /ˈkɑːntrɛri/ (empat suku kata jelas -trɛri). Wajib diikuti kata depan \'to\'!',
        speakText: 'Contrary to the author\'s claim,',
      },
      {
        symbol: 'Far from solving the issue,',
        reading: '/fɑːr frʌm ˈsɑːlvɪŋ ði ˈɪʃuː/',
        meaning: 'Jauh dari menyelesaikan masalah tersebut, (justru malah memperparah...)',
        mnemonic: 'Konstruksi emas ketika profesor menunjukkan bahwa solusi di bacaan justru memicu dampak sebaliknya!',
        speakText: 'Far from solving the issue,',
      },
      {
        symbol: 'The fact that [S + V] suggests...',
        reading: '/ðə fækt ðæt ... səɡˈdʒɛsts/',
        meaning: 'Kenyataan bahwa [fakta audio] menunjukkan...',
        mnemonic: 'Mengubah bagian kalimat fakta eksperimen menjadi subjek kalimat utuh (\'That / The fact that X occurred demonstrates Y\').',
        speakText: 'The fact that [S + V] suggests...',
      },
      {
        symbol: 'precisely the opposite',
        reading: '/prɪˈsaɪsli ði ˈɑːpəzət/',
        meaning: 'Justru kebalikannya secara persis',
        mnemonic: 'Sangat tajam merangkum argumen kuliah yang membalikkan klaim sebab-akibat bacaan.',
        speakText: 'precisely the opposite',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-010',
      title: 'Advanced Contrastive Openers (\'Far from + V-ing\' & \'Contrary to + NP\')',
      formula: 'Contrary to [NP], S + V | Far from + V-ing [Expected Good], [Subject] actually + V [Negative Reality]',
      formulaReading: 'Far from protecting native birds, the imported predators devastated ground nests.',
      explanation: 'Penguji manusia dan AI pada penulisan esai bahasa Inggris memberikan poin tinggi untuk variasi pembuka kalimat. Mengganti \'However, the professor says it makes the problem worse\' dengan \'Far from alleviating traffic, widening the bridge actually worsened congestion\' mendongkrak skor secara instan.',
      examples: [
        {
          jp: 'Contrary to the passage\'s prediction, hospital readmissions rose by twelve percent.',
          reading: '/ˈkɑːntrɛri tə ðə ˈpæsɪdʒɪz prɪˈdɪkʃən ˈhɑːspɪtəl ˌriːədˈmɪʃənz roʊz baɪ twɛlv pərˈsɛnt/',
          id: 'Berlawanan dengan prediksi bacaan, angka pasien masuk rumah sakit kembali justru naik dua belas persen.',
        },
        {
          jp: 'Far from saving taxpayers money, outsourcing maintenance doubled annual costs.',
          reading: '/fɑːr frʌm ˈseɪvɪŋ ˈtæksˌpeɪərz ˈmʌni ˈaʊtˌsɔːrsɪŋ ˈmeɪntənəns ˈdʌbəld ˈænjuəl kɔːsts/',
          id: 'Jauh dari menghemat uang pembayar pajak, mengalihdayakan pemeliharaan justru menggandakan biaya tahunan.',
        },
      ],
    },
    contrastiveTip: 'Ingat: \'Contrary to\' adalah frasa kata depan sehingga diikuti Kata Benda (\'Contrary to the reading\'s view\'), BUKAN bagian kalimat S+V langsung (*\'Contrary to the author thinks\'* -> SALAH)!',
  },
  'en-us-b2-u10-diskusi-toefl': {
    headline: 'Menyempurnakan Penyampaian Lisan & Tertulis Tugas Terpadu ujian bahasa Inggris',
    subtitle: 'Gabungkan penanda urutan kohesif, atribusi sumber yang jernih, dan parafrasa padat agar respons 60 detik maupun esai 225 kata mengalir mulus.',
    items: [
      {
        symbol: 'With respect to [Topic],',
        reading: '/wɪð rɪˈspɛkt tuː/',
        meaning: 'Terkait dengan / berkenaan dengan aspek [Topik],',
        mnemonic: 'Pembuka paragraf transisi yang jauh lebih spesifik dan elegan daripada sekadar \'Second, about costs...\'.',
        speakText: 'With respect to [Topic],',
      },
      {
        symbol: 'attribute [X] to [Y]',
        reading: '/əˈtrɪbjuːt ... tuː/',
        meaning: 'Mengaitkan / menisbahkan bahwa [akibat X] disebabkan oleh [faktor Y]',
        mnemonic: 'Tekanan kata kerja di suku kata KEDUA (/əˈtrɪbjuːt/), sedangkan kata benda \'attribute\' di suku kata PERTAMA (/ˈætrɪbjuːt/)!',
        speakText: 'attribute [X] to [Y]',
      },
      {
        symbol: 'unintended consequence',
        reading: '/ˌʌnɪnˈtɛndɪd ˈkɑːnsəˌkwɛns/',
        meaning: 'Dampak sampingan tak terduga yang tidak diinginkan pembuat kebijakan',
        mnemonic: 'Tema abadi 80% soal ekologi dan kebijakan publik di tugas rangkuman bacaan & kuliah!',
        speakText: 'unintended consequence',
      },
      {
        symbol: 'stand up to scrutiny',
        reading: '/stænd ʌp tə ˈskruːtəni/',
        meaning: 'Tahan diuji / tetap valid saat diperiksa secara kritis dan teliti',
        mnemonic: '\'The author\'s third argument fails to stand up to scrutiny\' = kalimat pembuka paragraf 3 yang luar biasa tajam!',
        speakText: 'stand up to scrutiny',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-B2-010',
      title: 'Topical Transitions & Causal Attribution (\'attribute A to B\')',
      formula: 'With respect to [Aspect], the author attributes [Effect] to [Cause A]; however, the lecturer attributes it to [Cause B].',
      formulaReading: 'The lecturer argues that this hypothesis fails to stand up to empirical scrutiny.',
      explanation: 'Memasangkan \'With respect to [Sub-topic],\' dengan kata kerja \'attribute [Phenomenon] to [Cause]\' memungkinkan Anda membandingkan dua penjelasan kausal (bacaan vs. dosen) hanya dalam dua kalimat jernih dan padat.',
      examples: [
        {
          jp: 'With respect to financing, the lecturer points out several unintended consequences.',
          reading: '/wɪð rɪˈspɛkt tə ˈfaɪnænsɪŋ ðə ˈlɛktʃər pɔɪnts aʊt ˈsɛvrəl ˌʌnɪnˈtɛndɪd ˈkɑːnsəˌkwɛnsɪz/',
          id: 'Terkait aspek pembiayaan, penceramah menyoroti sejumlah dampak tak terduga.',
        },
        {
          jp: 'Whereas the text attributes the die-off to fungi, the professor attributes it to drought.',
          reading: '/wɛrˈæz ðə tɛkst əˈtrɪbjuːts ðə ˈdaɪˌɔːf tə ˈfʌndʒaɪ ðə prəˈfɛsər əˈtrɪbjuːts ɪt tə draʊt/',
          id: 'Sementara teks mengaitkan kematian massal itu pada jamur, profesor mengaitkannya pada kekeringan.',
        },
      ],
    },
    contrastiveTip: 'Hati-hati kata depan: \'attribute [Akibat] TO [Penyebab]\' — jangan terbalik meletakkan penyebab sebelum akibat!',
  },
  // ===========================================================================
  // Level C1 — UNIT 1 (GP-EN-C1-001)
  // ===========================================================================
  'en-us-c1-u1-kosakata': {
    headline: 'Kata Negatif & Pembatas di Awal Kalimat yang Membalik Urutan Subjek & Kata Bantu',
    subtitle: 'Menempatkan keterangan negatif atau pembatas ketat di awal kalimat otomatis membalik urutan Subjek dan Kata Kerja Bantu seperti kalimat tanya.',
    items: [
      {
        symbol: 'Not only did..., but ... also',
        reading: '/nɑːt ˈoʊnli dɪd ... bʌt ... ˈɔːlsoʊ/',
        meaning: 'Tidak hanya melakukan A, tetapi juga melakukan B',
        mnemonic: 'Senjata nomor satu untuk meraih skor tertinggi Grammatical Range pada penulisan esai bahasa Inggris & esai LPDP!',
        speakText: 'Not only did..., but ... also',
      },
      {
        symbol: 'Seldom / Rarely have...',
        reading: '/ˈsɛldəm hæv/',
        meaning: 'Sangat jarang sepanjang sejarah terjadi...',
        mnemonic: 'Mengangkat pernyataan biasa (\'Researchers have seldom seen...\') menjadi pembuka paragraf yang berwibawa.',
        speakText: 'Seldom / Rarely have...',
      },
      {
        symbol: 'Under no circumstances should...',
        reading: '/ˈʌndər noʊ ˈsɜːrkəmˌstænsɪz ʃʊd/',
        meaning: 'Dalam keadaan apa pun sama sekali tidak boleh...',
        mnemonic: 'Standar emas protokol keamanan siber, etika medis, dan kepatuhan hukum korporat.',
        speakText: 'Under no circumstances should...',
      },
      {
        symbol: 'Little did they realize...',
        reading: '/ˈlɪtəl dɪd ðeɪ ˈriːəˌlaɪz/',
        meaning: 'Sama sekali tidak mereka sadari waktu itu bahwa...',
        mnemonic: 'Sangat efektif membangun narasi penemuan ilmiah tak sengaja (*serendipity*) di kuliah sejarah sains.',
        speakText: 'Little did they realize...',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-001',
      title: 'Pembalikan Urutan Kalimat Setelah Kata Negatif/Pembatas',
      formula: 'Kata Negatif di Awal + Kata Bantu (do/does/did/have/should) + Subject + Main Verb',
      formulaReading: 'Not only did the vaccine cut transmission, but it also lowered hospitalization.',
      explanation: 'Jika kalimat diawali kata bermakna negatif atau hampir nol (Not only, Never, Seldom, Rarely, Little, Under no circumstances, On no account), kita WAJIB melakukan pembalikan urutan \'Kata Bantu + Subjek + Kata Kerja\'. Jika kalimat aslinya tidak punya modal/have, pinjam \'do / does / did\' lalu kembalikan kata kerja ke V1!',
      examples: [
        {
          jp: 'Not only did the reform curb inflation, but it also spurred rural investment.',
          reading: '/nɑːt ˈoʊnli dɪd ðə rɪˈfɔːrm kɜːrb ɪnˈfleɪʃən bʌt ɪt ˈɔːlsoʊ spɜːrd ˈrʊrəl ɪnˈvɛstmənt/',
          id: 'Reformasi tersebut tidak hanya meredam inflasi, tetapi juga memacu investasi pedesaan.',
        },
        {
          jp: 'Under no circumstances should raw patient identifiers leave the hospital server.',
          reading: '/ˈʌndər noʊ ˈsɜːrkəmˌstænsɪz ʃʊd rɔː ˈpeɪʃənt aɪˈdɛntəˌfaɪərz liːv ðə ˈhɑːspɪtəl ˈsɜːrvər/',
          id: 'Dalam keadaan apa pun pengenal identitas mentah pasien sama sekali tidak boleh keluar dari server rumah sakit.',
        },
      ],
    },
    contrastiveTip: 'Awas jebakan ganda: sesudah memakai \'did\' pada \'Not only did the sensor...\', kata kerjanya kembali ke V1 murni (\'detect\', BUKAN \'detected\')!',
  },
  'en-us-c1-u1-tata-bahasa': {
    headline: 'Jebakan Pembalikan Urutan di Bagian Kedua: \'Not until\', \'Only when\', & \'No sooner ... than\'',
    subtitle: 'Kuasai perbedaan paling krusial di level C1: pada \'Not until / Only after / Only when\', pembalikan urutan baru terjadi di BAGIAN UTAMA KALIMAT kedua, BUKAN di bagian kalimat pertama!',
    items: [
      {
        symbol: 'Not until [S + V] did [Main S + V1]',
        reading: '/nɑːt ʌnˈtɪl ... dɪd .../',
        meaning: 'Baru setelah [kejadian A berlangsung], barulah [kejadian B terjadi]',
        mnemonic: 'Jebakan maut ujian: JANGAN pembalikan urutan bagian kalimat sesudah \'until\'! Simpan pembalikan urutan \'did\' untuk bagian utama kalimat sesudah keterangan waktunya selesai!',
        speakText: 'Not until [S + V] did [Main S + V1]',
      },
      {
        symbol: 'Only after [NP / S+V] were we able to...',
        reading: '/ˈoʊnli ˈæftər ... wɜːr wi ˈeɪbəl tuː/',
        meaning: 'Hanya sesudah [tahap A selesai], barulah kami mampu...',
        mnemonic: 'Sangat kuat untuk menceritakan terobosan riset atau pemecahan bug pelik di wawancara senior.',
        speakText: 'Only after [NP / S+V] were we able to...',
      },
      {
        symbol: 'No sooner had [S + V3] than [S + V2]',
        reading: '/noʊ ˈsuːnər hæd ... ðæn .../',
        meaning: 'Begitu [A baru saja selesai], seketika itu pula [B langsung terjadi]',
        mnemonic: 'Pasangan wajib \'No sooner\' adalah \'THAN\' (bukan \'when\'!). Sedangkan \'Hardly / Scarcely had...\' berpasangan dengan \'WHEN\'!',
        speakText: 'No sooner had [S + V3] than [S + V2]',
      },
      {
        symbol: 'Only by [V-ing] can [S + V1]',
        reading: '/ˈoʊnli baɪ ... kæn .../',
        meaning: 'Hanya dengan cara [melakukan X], barulah [subjek] dapat...',
        mnemonic: 'Kalimat tesis rekomendasi kebijakan yang sangat meyakinkan di paragraf penutup esai esai beasiswa & bahasa Inggris.',
        speakText: 'Only by [V-ing] can [S + V1]',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-001',
      title: 'Pembalikan Urutan di Bagian Kedua (\'Not until / Only after / Only by\') & \'No sooner... than\'',
      formula: 'Only after / Not until + [Anak Kalimat Biasa (S + V)] + Aux + Main Subject + Verb',
      formulaReading: 'Not until the ice melted did archaeologists discover the ancient trail.',
      explanation: 'Mengapa disebut Pembalikan Urutan di Bagian Kedua? Karena \'Not until the ice melted\' hanyalah anak kalimat keterangan waktu di depan; subjek-kata kerjanya (\'the ice melted\') TETAP NORMAL. Begitu masuk ke induk kalimat (\'did archaeologists discover\'), barulah pembalikan urutan terjadi!',
      examples: [
        {
          jp: 'Not until electron microscopy matured did virologists visualize bacteriophages.',
          reading: '/nɑːt ʌnˈtɪl ɪˈlɛktrɑːn maɪˈkrɑːskəpi məˈtʃʊrd dɪd vaɪˈrɑːlədʒɪsts ˈvɪʒuəˌlaɪz bækˈtɪrioʊˌfeɪdʒɪz/',
          id: 'Baru setelah mikroskopi elektron matang, para ahli virologi dapat memvisualisasikan bakteriofag.',
        },
        {
          jp: 'No sooner had the central bank cut rates than bond yields tumbled.',
          reading: '/noʊ ˈsuːnər hæd ðə ˈsɛntrəl bæŋk kʌt reɪts ðæn bɑːnd jiːldz ˈtʌmbəld/',
          id: 'Begitu bank sentral memangkas suku bunga, seketika itu pula imbal hasil obligasi merosot.',
        },
      ],
    },
    contrastiveTip: 'Hafalkan pasangan kembar yang sering mengecoh: \'No sooner ... THAN\' (karena \'sooner\' bentuk komparatif -er!) vs. \'Hardly / Scarcely ... WHEN\'!',
  },
  'en-us-c1-u1-diskusi-toefl': {
    headline: 'Fronting & Penekanan Retoris dalam Presentasi Akademik',
    subtitle: 'Selain pembalikan urutan setelah kata negatif, penutur mahir menonjolkan kontras menggunakan \'So [adj] was X that...\' dan \'Such was [NP] that...\' dalam kuliah maupun pidato.',
    items: [
      {
        symbol: 'So compelling was the evidence that...',
        reading: '/soʊ kəmˈpɛlɪŋ wʌz ði ˈɛvədəns ðæt/',
        meaning: 'Begitu kuat dan meyakinkannya bukti tersebut sehingga...',
        mnemonic: 'Mengedepankan kata sifat \'So compelling\' menciptakan klimaks retoris sebelum menyebutkan dampaknya.',
        speakText: 'So compelling was the evidence that...',
      },
      {
        symbol: 'Such was the demand that...',
        reading: '/sʌtʃ wʌz ðə dɪˈmænd ðæt/',
        meaning: 'Sedemikian besarnya permintaan tersebut sehingga...',
        mnemonic: 'Ingat bedanya: \'So + Adjective + be + S + that\' vs. \'Such + be + Noun Phrase + that\'!',
        speakText: 'Such was the demand that...',
      },
      {
        symbol: 'Nor does this imply that...',
        reading: '/nɔːr dʌz ðɪs ɪmˈplaɪ ðæt/',
        meaning: 'Dan hal ini juga sama sekali tidak menyiratkan bahwa...',
        mnemonic: 'Cara paling tajam di esai C1 untuk menutup celah salah tafsir pembaca sesudah kalimat negatif sebelumnya.',
        speakText: 'Nor does this imply that...',
      },
      {
        symbol: 'At the heart of the debate lies...',
        reading: '/æt ðə hɑːrt ʌv ðə dɪˈbeɪt laɪz/',
        meaning: 'Di jantung / inti perdebatan tersebut terletak...',
        mnemonic: 'Pembalikan urutan tempat: Frasa Tempat + Kata Kerja Tanpa Objek (lies/stands) + Subjek panjang di akhir!',
        speakText: 'At the heart of the debate lies...',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-001',
      title: '\'So/Such\' Emphatic Pembalikan urutan, \'Nor\' Continuation & pembalikan urutan keterangan tempat',
      formula: 'So + Adj + be + S + that... | Nor + Aux + S + V | Place Phrase + Kata Kerja Tanpa Objek + Subject',
      formulaReading: 'At the heart of the controversy lies an unresolved ethical dilemma.',
      explanation: 'Tiga pola elitis C1–C2: (1) \'So severe was the drought that...\', (2) \'Nor + Aux + S + V\' untuk menyambung bagian kalimat negatif kedua, dan (3) Pembalikan urutan tempat \'At the center of X stands/lies Y\' (tanpa kata bantu \'do\'!) untuk memperkenalkan topik utama secara anggun.',
      examples: [
        {
          jp: 'So rapid was mobile banking adoption that rural branches pivoted to advisory roles.',
          reading: '/soʊ ˈræpɪd wʌz ˈmoʊbəl ˈbæŋkɪŋ əˈdɑːpʃən ðæt ˈrʊrəl ˈbræntʃɪz ˈpɪvətɪd/',
          id: 'Begitu pesatnya adopsi perbankan seluler sehingga kantor cabang daerah beralih ke peran konsultasi.',
        },
        {
          jp: 'The study does not prove causation, nor does it claim universal generalizability.',
          reading: '/ðə ˈstʌdi dʌz nɑːt pruːv kɔːˈzeɪʃən nɔːr dʌz ɪt kleɪm ˌjuːnəˈvɜːrsəl ˌdʒɛnrəˌlaɪzəˈbɪləti/',
          id: 'Studi ini tidak membuktikan hubungan sebab-akibat, dan tidak pula mengklaim daya generalisasi universal.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan pada pembalikan urutan keterangan tempat (\'At the heart of X lies Y\'), kata kerja \'lies/stands\' langsung mendahului subjek TANPA \'does\'—dan wajib selaras tunggal/jamak dengan Y di belakangnya!',
  },
  // ===========================================================================
  // Level C1 — UNIT 2 (GP-EN-C1-002)
  // ===========================================================================
  'en-us-c1-u2-kosakata': {
    headline: 'Pola Anjuran & Tuntutan Resmi (Selalu Pakai Kata Kerja Dasar V1)',
    subtitle: 'Berbeda dari percakapan santai Britania yang sering menyisipkan \'should\', bahasa Inggris formal Amerika mewajibkan kata kerja dasar murni (V1 murni tanpa \'to\') sesudah kata kerja/sifat tuntutan!',
    items: [
      {
        symbol: 'It is imperative that [S + V1]',
        reading: '/ɪt ɪz ɪmˈpɛrətɪv ðæt/',
        meaning: 'Sangat mutlak / mendesak bahwa [subjek melakukan sesuatu]',
        mnemonic: 'Meski subjeknya tunggal (\'the governor\', \'each hospital\'), kata kerjanya TANPA -s: \'that each hospital maintain\'!',
        speakText: 'It is imperative that [S + V1]',
      },
      {
        symbol: 'stipulate that [S + be + V3]',
        reading: '/ˈstɪpjəˌleɪt ðæt/',
        meaning: 'Mensyaratkan secara tegas di dalam pasal kontrak/aturan bahwa...',
        mnemonic: 'Untuk kalimat bentuk pasif anjuran resmi, gunakan \'be\' murni (BUKAN is/are/was): \'stipulates that all bids be sealed\'!',
        speakText: 'stipulate that [S + be + V3]',
      },
      {
        symbol: 'mandate that [S + not + V1]',
        reading: '/ˈmændeɪt ðæt/',
        meaning: 'Mewajibkan lewat regulasi resmi agar [subjek TIDAK melakukan...]',
        mnemonic: 'Bentuk bentuk negatif anjuran resmi super ringkas: langsung \'not + V1\' TANPA \'does not / do not\' (\'that a judge not hold shares\')!',
        speakText: 'mandate that [S + not + V1]',
      },
      {
        symbol: 'paramount',
        reading: '/ˈpærəˌmaʊnt/',
        meaning: 'Paling utama / di atas segala kepentingan lainnya',
        mnemonic: '\'Of paramount importance\' atau \'It is paramount that...\' sering muncul di pembuka rekomendasi kebijakan.',
        speakText: 'paramount',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-002',
      title: 'Pola Anjuran Resmi Amerika (V1 Murni: Aktif, Negatif & Pasif)',
      formula: 'recommend / stipulate / imperative + that + S + [V1 | not V1 | be V3]',
      formulaReading: 'The audit committee recommended that the CFO disclose all off-balance-sheet liabilities.',
      explanation: 'Dalam standar penulisan akademik dan hukum Amerika Serikat, bagian kalimat \'that\' sesudah kata kerja anjuran/tuntutan (recommend, insist, propose, mandate, stipulate, demand) atau kata sifat urgensi (imperative, essential, vital, crucial, paramount) selalu menggunakan KATA KERJA DASAR MURNI (V1) untuk semua subjek dan semua kala waktu (bahkan jika kata kerja utamanya lampau: \'insisted that he resign\')!',
      examples: [
        {
          jp: 'Federal guidelines mandate that every clinical trial submit its protocol upfront.',
          reading: '/ˈfɛdərəl ˈɡaɪdˌlaɪnz ˈmændeɪt ðæt ˈɛvri ˈklɪnɪkəl ˈtraɪəl ˈrɛdʒɪstər ɪts ˈproʊtəˌkɔːl/',
          id: 'Pedoman federal mewajibkan setiap uji klinis mendaftarkan protokolnya di muka.',
        },
        {
          jp: 'Ethics rules require that a board member not vote on related-party transactions.',
          reading: '/ˈɛθɪks ruːlz rɪˈkwaɪər ðæt ə bɔːrd ˈmɛmbər nɑːt voʊt ɑːn rɪˈleɪtɪd ˈpɑːrti trænˈzækʃənz/',
          id: 'Aturan etika mengharuskan anggota dewan tidak memberikan suara pada transaksi pihak berelasi.',
        },
      ],
    },
    contrastiveTip: 'Tiga ranjau pola anjuran V1 murni yang paling sering menjebak peserta ujian: (1) tanpa akhiran -s untuk he/she/it, (2) tetap V1 walau kata kerja depannya lampau (\'proposed that it be\'), dan (3) negatifnya \'not V1\' tanpa \'doesn\'t\'!',
  },
  'en-us-c1-u2-tata-bahasa': {
    headline: 'Membedakan Makna Ganda: \'Suggest / Insist\' (Fakta vs. Tuntutan) & \'Lest\'',
    subtitle: 'Hati-hati! Kata \'suggest\' dan \'insist\' punya DUA arti berbeda: jika menyatakan tuntutan → pola anjuran V1 murni; jika menyatakan fakta bukti/klaim → Indikatif biasa!',
    items: [
      {
        symbol: 'suggests that X is (Bukti) vs. suggest that X be (Usul)',
        reading: '/səɡˈdʒɛsts ðæt/',
        meaning: 'Data menunjukkan fakta (indikatif \'is/was\') vs. Komite mengusulkan tindakan (pola V1 murni \'be\')',
        mnemonic: 'Cek maknanya! \'Fossil data suggests that the lake WAS deep\' (bukan usulan agar danau menjadi dalam, melainkan bukti fakta!).',
        speakText: 'suggests that X is (Bukti) vs. suggest that X be (Usul)',
      },
      {
        symbol: 'insisted that he was innocent (Klaim Fakta)',
        reading: '/ɪnˈsɪstɪd ðæt hi wʌz ˈɪnəsənt/',
        meaning: 'Bersikeras menyatakan fakta bahwa ia tidak bersalah (Indikatif)',
        mnemonic: 'Bandingkan dengan \'insisted that he resign\' (menuntut agar ia mundur → pola anjuran V1 murni)!',
        speakText: 'insisted that he was innocent (Klaim Fakta)',
      },
      {
        symbol: 'lest [S + V1 / should V1]',
        reading: '/lɛst/',
        meaning: 'Agar jangan sampai / dikhawatirkan akan...',
        mnemonic: 'Kata hubung formal C1–C2 yang memicu pola anjuran V1 murni (\'Diversify suppliers lest a single port strike halt production\').',
        speakText: 'lest [S + V1 / should V1]',
      },
      {
        symbol: 'It is high time [S + V2]',
        reading: '/ɪt ɪz haɪ taɪm/',
        meaning: 'Sudah saatnya (bahkan agak terlambat) bagi subjek untuk segera bertindak!',
        mnemonic: 'Berbeda dari \'imperative that + V1\', frasa \'It is (high) time + S\' memakai bentuk lampau pengandaian (V2), mis. \'It is high time we modernized the grid\'!',
        speakText: 'It is high time [S + V2]',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-002',
      title: 'Dual-Meaning Verbs (\'suggest/insist\'), \'Lest\', & \'It is high time + V2\'',
      formula: 'Evidence suggests that S + V(tensed) | Proposal suggests that S + V1 | lest + S + V1 | It\'s high time + S + V2',
      formulaReading: 'Telemetry suggests that the valve leaked, so engineers suggested that it be replaced.',
      explanation: 'Kalimat contoh di atas merangkum kecerdasan gramatikal C1 dalam satu tarikan napas: \'suggests\' pertama berarti mengindikasikan fakta (\'leaked\' indikatif), sedangkan \'suggested\' kedua berarti mengusulkan tindakan (\'be replaced\' pola V1 murni)!',
      examples: [
        {
          jp: 'Isotope data suggests that the aquifer recharges slowly, so hydrologists urged that pumping be capped.',
          reading: '/ˈaɪsəˌtoʊp ˈdeɪtə səɡˈdʒɛsts ðæt ði ˈækwəfər riːˈtʃɑːrdʒɪz ˈsloʊli/',
          id: 'Data isotop mengindikasikan akuifer terisi lambat, sehingga ahli hidrologi mendesak agar pemompaan dibatasi.',
        },
        {
          jp: 'It is high time municipal governments overhauled archaic zoning codes.',
          reading: '/ɪt ɪz haɪ taɪm mjuːˈnɪsəpəl ˈɡʌvərnmənts ˈoʊvərˌhɔːld ɑːrˈkeɪɪk ˈzoʊnɪŋ koʊdz/',
          id: 'Sudah saatnya pemerintah kota merombak aturan zonasi yang usang.',
        },
      ],
    },
    contrastiveTip: 'Ingat: \'lest\' sudah bermakna negatif (\'agar jangan sampai\'), jadi JANGAN tambahkan \'not\' sesudah \'lest\'!',
  },
  'en-us-c1-u2-diskusi-toefl': {
    headline: 'Bahasa Rekomendasi Kebijakan Publik & Eksekutif (Policy Briefs)',
    subtitle: 'Latih kosakata tata kelola dan struktur proposal yang dipakai di esai beasiswa kebijakan publik (Fulbright/LPDP), konsultansi manajemen, dan penulisan esai bahasa Inggris.',
    items: [
      {
        symbol: 'actionable recommendation',
        reading: '/ˈækʃənəbəl ˌrɛkəmɛnˈdeɪʃən/',
        meaning: 'Rekomendasi konkret yang dapat langsung dieksekusi di lapangan',
        mnemonic: 'Lawan dari saran abstrak (\'improve education\'): actionable berarti jelas siapa melakukan apa dan bagaimana.',
        speakText: 'actionable recommendation',
      },
      {
        symbol: 'spearhead regulatory reform',
        reading: '/ˈspɪrˌhɛd ˈrɛɡjələˌtɔːri rɪˈfɔːrm/',
        meaning: 'Memelopori pembaruan regulasi secara terarah',
        mnemonic: 'Pelafalan Amerika \'regulatory\': /ˈrɛɡjələˌtɔːri/ dengan vokal jelas pada suku kata keempat -tɔːri.',
        speakText: 'spearhead regulatory reform',
      },
      {
        symbol: 'phase in subsidies',
        reading: '/feɪz ɪn ˈsʌbsədiz/',
        meaning: 'Menerapkan subsidi secara bertahap (kebalikan dari \'phase out\')',
        mnemonic: 'Kebijakan baru diusulkan \'phased in\' agar anggaran dan pelaku pasar sempat beradaptasi.',
        speakText: 'phase in subsidies',
      },
      {
        symbol: 'contingent upon',
        reading: '/kənˈtɪndʒənt əˈpɑːn/',
        meaning: 'Bergantung sepenuhnya pada terpenuhinya syarat tertentu',
        mnemonic: 'Padanan C1 untuk \'dependent on / subject to\', mis. \'Disbursement is contingent upon independent verification\'.',
        speakText: 'contingent upon',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-002',
      title: 'Anjuran Resmi Setelah Kata Benda (\'The proposal that S + V1\')',
      formula: 'The recommendation / requirement / condition + that + S + [V1 / be V3] + Main Verb',
      formulaReading: 'The stipulation that grant recipients return home strengthens national capacity.',
      explanation: 'Pola anjuran resmi (V1 murni) juga berlaku sesudah KATA BENDA turunan seperti \'the recommendation that...\', \'the proposal that...\', dan \'on the condition that...\'. Pola ini sangat elegan sebagai subjek kalimat utama dalam esai kebijakan LPDP & Fulbright!',
      examples: [
        {
          jp: 'The proposal that carbon revenues be rebated to low-income households gained wide support.',
          reading: '/ðə prəˈpoʊzəl ðæt ˈkɑːrbən ˈrɛvəˌnuːz bi ˈriːbeɪtɪd tə loʊ ˈɪnkʌm ˈhaʊsˌhoʊldz ɡeɪnd waɪd səˈpɔːrt/',
          id: 'Usulan agar pendapatan pajak karbon dikembalikan kepada rumah tangga berpendapatan rendah meraih dukungan luas.',
        },
        {
          jp: 'Future tranche funding remains contingent upon the agency meeting transparency targets.',
          reading: '/ˈfjuːtʃər trɑːntʃ ˈfʌndɪŋ rɪˈmeɪnz kənˈtɪndʒənt əˈpɑːn ði ˈeɪdʒənsi ˈmiːtɪŋ trænsˈpɛrənsi ˈtɑːrɡɪts/',
          id: 'Pencairan dana tahap berikutnya tetap bergantung pada keberhasilan lembaga memenuhi target transparansi.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan kata benda \'proposal / recommendation that...\' menggunakan pola anjuran V1 murni (\'that taxes BE cut\'), sedangkan \'the fact / belief that...\' menggunakan Indikatif (\'that taxes ARE high\').',
  },
  // ===========================================================================
  // Level C1 — UNIT 3 (GP-EN-C1-003)
  // ===========================================================================
  'en-us-c1-u3-kosakata': {
    headline: 'Cara Berbicara Hati-Hati & Tidak Terlalu Mutlak: Mengapa Ilmuwan Jarang Berkata \'100% Pasti\'',
    subtitle: 'Dalam jurnal internasional dan esai esai bahasa Inggris tingkat mahir, klaim kasar tanpa kualifikasi (\'Remote work destroys culture\') dianggap naif. Bahasa yang hati-hati justru menunjukkan ketajaman intelektual!',
    items: [
      {
        symbol: 'arguably',
        reading: '/ˈɑːrɡjuəbli/',
        meaning: 'Bisa dibilang / patut diajukan argumen kuat bahwa... (penguat klaim yang tetap elegan)',
        mnemonic: 'Menyatakan klaim superlatif tanpa terdengar arogan: \'CRISPR is arguably the most transformative biotech tool of our era\'.',
        speakText: 'arguably',
      },
      {
        symbol: 'compelling evidence suggests',
        reading: '/kəmˈpɛlɪŋ ˈɛvədəns səɡˈdʒɛsts/',
        meaning: 'Bukti yang sangat meyakinkan mengindikasikan bahwa...',
        mnemonic: 'Jauh lebih berwibawa secara ilmiah ketimbang kalimat mutlak \'This proves 100% that...\'.',
        speakText: 'compelling evidence suggests',
      },
      {
        symbol: 'ostensibly',
        reading: '/ɑːˈstɛnsəbli/',
        meaning: 'Secara lahiriah / menurut klaim di permukaan (menyiratkan kenyataan di baliknya berbeda!)',
        mnemonic: 'Senjata analisis kritis C1–C2: \'a fee ostensibly designed for safety, yet functioning as a trade barrier\'.',
        speakText: 'ostensibly',
      },
      {
        symbol: 'confounding variable',
        reading: '/kənˈfaʊndɪŋ ˈvɛriəbəl/',
        meaning: 'Variabel perancu tersembunyi yang memalsukan hubungan sebab-akibat',
        mnemonic: 'Inti kritik metodologi di kuliah sains & psikologi: es krim naik dan tenggelam naik karena faktor perancu musim panas!',
        speakText: 'confounding variable',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-003',
      title: 'Tiga Cara Menyampaikan Pendapat Secara Hati-Hati & Terukur',
      formula: 'Evidence + appears / tends to + V1 | Subject + may well + V1 | arguably / ostensibly + Adj/Phrase',
      formulaReading: 'Early exposure to bilingualism appears to enhance executive control in aging adults.',
      explanation: 'Tiga lapis bahasa hati-hati & terukur: (1) Kata kerja kehati-hatian (\'appear to\', \'tend to\', \'seem to indicate\'), (2) Kata keterangan penghalus (\'arguably\', \'plausibly\', \'largely\', \'ostensibly\'), dan (3) Kata bantu kemungkinan (\'may well\' = kemungkinan besar, \'could potentially\'). Hindari pernyataan terlalu mutlak (\'all\', \'always\', \'proves beyond doubt\').',
      examples: [
        {
          jp: 'Chronic sleep debt appears to accelerate metabolic insulin resistance.',
          reading: '/ˈkrɑːnɪk sliːp dɛt əˈpɪrz tə ækˈsɛləˌreɪt ˌmɛtəˈbɑːlɪk ˈɪnsəlɪn rɪˈzɪstəns/',
          id: 'Utang tidur kronis tampaknya mempercepat resistensi insulin metabolik.',
        },
        {
          jp: 'The merger was ostensibly aimed at efficiency, yet consumer prices rose.',
          reading: '/ðə ˈmɜːrdʒər wʌz ɑːˈstɛnsəbli eɪmd æt ɪˈfɪʃənsi jɛt kənˈsuːmər ˈpraɪsɪz roʊz/',
          id: 'Merger tersebut di permukaan diklaim bertujuan demi efisiensi, namun harga konsumen justru naik.',
        },
      ],
    },
    contrastiveTip: 'Bedakan \'may\' (mungkin 40–50%) dengan \'may well\' (/meɪ wɛl/ = besar kemungkinan / sangat beralasan untuk menduga, ~75%)!',
  },
  'en-us-c1-u3-tata-bahasa': {
    headline: 'Impersonal Reporting Passives (\'is thought to have V3\') & Scope Qualifiers',
    subtitle: 'Kuasai konstruksi pasif pelaporan bertingkat (\'is widely held to be\', \'is estimated to have V3\') dan pembatas cakupan (\'insofar as\', \'to the extent that\').',
    items: [
      {
        symbol: 'is thought to have originated',
        reading: '/ɪz θɔːt tə həv əˈrɪdʒəˌneɪtɪd/',
        meaning: 'Diperkirakan para ahli saat ini telah bermula (di masa lampau)',
        mnemonic: 'Rumus emas C1: Opini sekarang (\'is thought\') + Kejadian masa lalu (\'to have + V3\')!',
        speakText: 'is thought to have originated',
      },
      {
        symbol: 'insofar as / inasmuch as',
        reading: '/ˌɪnsoʊˈfɑːr æz/',
        meaning: 'Sejauh mana / hanya dalam batas bahwa...',
        mnemonic: 'Membatasi validitas argumen secara presisi: \'GDP is useful insofar as it tracks output, not well-being\'.',
        speakText: 'insofar as / inasmuch as',
      },
      {
        symbol: 'cannot be extrapolated to',
        reading: '/ˈkænɑːt bi ɪkˈstræpəˌleɪtɪd tuː/',
        meaning: 'Tidak dapat diekstrapolasi / digeneralisasikan mentah-mentah ke populasi lain',
        mnemonic: 'Kalimat kritik metodologi berkelas tinggi untuk esai dan peer review.',
        speakText: 'cannot be extrapolated to',
      },
      {
        symbol: 'by and large',
        reading: '/baɪ ænd lɑːrdʒ/',
        meaning: 'Secara garis besar / pada umumnya (dengan mengakui adanya sedikit pengecualian)',
        mnemonic: 'Ungkapan hati-hati yang luwes pengganti \'mostly\' dalam diskusi kebijakan dan kuliah.',
        speakText: 'by and large',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-003',
      title: 'Subject-to-Subject Raising Passives (\'is alleged / thought / estimated to have V3\')',
      formula: 'Subject + is believed / estimated / thought + [to V1 (present) | to have V3 (past)]',
      formulaReading: 'The sunken trading vessel is estimated to have carried thirty tons of ceramics.',
      explanation: 'Alih-alih menulis \'Scholars estimate that the vessel carried...\' terus-menerus, jurnal ilmiah memadatkannya menjadi \'The vessel is estimated to have carried...\'. Gunakan \'to + V1\' jika keadaan masih berlangsung kini, dan \'to have + V3\' jika peristiwanya sudah lampau!',
      examples: [
        {
          jp: 'Austronesian navigators are believed to have reached Madagascar by the sixth century.',
          reading: '/ˌɔːstroʊˈniːʒən ˈnævəˌɡeɪtərz ɑːr bɪˈliːvd tə həv riːtʃt ˌmædəˈɡæskər baɪ ðə sɪksθ ˈsɛntʃəri/',
          id: 'Para navigator Austronesia diyakini telah mencapai Madagaskar menjelang abad keenam.',
        },
        {
          jp: 'Carbon offsets work insofar as protected forests face genuine deforestation risk.',
          reading: '/ˈkɑːrbən ˈɔːfˌsɛts wɜːrk ˌɪnsoʊˈfɑːr æz prəˈtɛktɪd ˈfɔːrɪsts feɪs ˈdʒɛnjuɪn diːˌfɔːrɪˈsteɪʃən rɪsk/',
          id: 'Kompensasi karbon efektif sejauh hutan yang dilindungi memang menghadapi risiko penggundulan nyata.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan ejaan satu kata di American English: \'insofar as\' (tiga bagian digabung menjadi satu kata \'insofar\' diikuti \'as\')!',
  },
  'en-us-c1-u3-diskusi-toefl': {
    headline: 'Membaca Sikap & Nada Bicara Pembicara: Membaca Nada Skeptis Profesor',
    subtitle: 'Di latihan mendengarkan percakapan & kuliah tingkat tinggi, soal \'What is the professor\'s attitude toward X?\' menguji apakah Anda menangkap kata halus bernada ragu seperti \'so-called\', \'at best\', atau \'remains to be seen\'.',
    items: [
      {
        symbol: 'remains to be seen',
        reading: '/rɪˈmeɪnz tə bi siːn/',
        meaning: 'Masih belum pasti dan baru bisa dibuktikan seiring berjalannya waktu',
        mnemonic: 'Sinyal pasti di latihan mendengarkan percakapan & kuliah bahwa profesor BERSIKAP SKEPTIS / BELUM YAKIN apakah teknologi/teori baru itu akan berhasil!',
        speakText: 'remains to be seen',
      },
      {
        symbol: 'speculative at best',
        reading: '/ˈspɛkjələtɪv æt bɛst/',
        meaning: 'Paling banter pun baru sebatas spekulasi (sangat lemah buktinya)',
        mnemonic: 'Ungkapan \'at best\' membatasi pujian ke level paling rendah — menandakan kritik tajam namun sopan.',
        speakText: 'speculative at best',
      },
      {
        symbol: 'take [claim] with a grain of salt',
        reading: '/teɪk wɪð ə ɡreɪn ʌv sɔːlt/',
        meaning: 'Menyikapi klaim secara kritis dan tidak langsung menelannya mentah-mentah',
        mnemonic: 'Idiom klasik diskusi kampus AS saat meninjau sumber sejarah yang bias atau klaim pemasaran.',
        speakText: 'take [claim] with a grain of salt',
      },
      {
        symbol: 'premature to conclude',
        reading: '/ˌpriːməˈtʃʊr tə kənˈkluːd/',
        meaning: 'Terlalu dini / terburu-buru untuk menyimpulkan saat ini',
        mnemonic: 'Jawaban favorit pilihan ganda ujian bahasa Inggris ketika eksperimen masih kekurangan replikasi!',
        speakText: 'premature to conclude',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-003',
      title: 'Stance Framing (\'It remains to be seen whether...\' & Evaluative \'at best\')',
      formula: 'It remains to be seen whether + S + will V1 | It would be premature to conclude that + S + V',
      formulaReading: 'Whether room-temperature superconductors scale commercially remains to be seen.',
      explanation: 'Kenali spektrum sikap akademik: antusias hati-hati (\'promising, albeit preliminary\') vs. skeptis terukur (\'speculative at best\', \'premature to conclude\', \'remains to be seen\'). Pada ujian bahasa Inggris, sikap profesor hampir tidak pernah \'marah/membenci total\', melainkan \'skeptical / cautiously optimistic / unconvinced\'!',
      examples: [
        {
          jp: 'It remains to be seen whether autonomous taxis can handle monsoon visibility.',
          reading: '/ɪt rɪˈmeɪnz tə bi siːn ˈwɛðər ɔːˈtɑːnəməs ˈtæksiz kæn ˈhændəl mɑːnˈsuːn ˌvɪzəˈbɪləti/',
          id: 'Masih perlu dilihat ke depan apakah taksi otonom mampu menangani jarak pandang saat hujan monsun.',
        },
        {
          jp: 'Without control groups, those productivity claims are anecdotal at best.',
          reading: '/wɪˈðaʊt kənˈtroʊl ɡruːps ðoʊz ˌproʊdʌkˈtɪvəti kleɪmz ɑːr ˌænɪkˈdoʊtəl æt bɛst/',
          id: 'Tanpa kelompok kontrol, klaim produktivitas tersebut paling banter hanyalah bukti anekdotal.',
        },
      ],
    },
    contrastiveTip: 'Tips emas soal menebak sikap pembicara: coret pilihan ekstrem emosional seperti \'hostile\', \'indifferent\', atau \'completely convinced\'—pilih nuansa ilmiah seperti \'skeptical because evidence is incomplete\'!',
  },
  // ===========================================================================
  // Level C1 — UNIT 4 (GP-EN-C1-004)
  // ===========================================================================
  'en-us-c1-u4-kosakata': {
    headline: 'Diksi Inti Statement of Purpose (SoP) LPDP & Fulbright',
    subtitle: 'Komite seleksi universitas AS membenci klise \'Since childhood I dreamed of...\'. Bukalah esai Anda dengan masalah nyata di lapangan dan kesiapan intelektual Anda!',
    items: [
      {
        symbol: 'bridge a critical gap',
        reading: '/brɪdʒ ə ˈkrɪtɪkəl ɡæp/',
        meaning: 'Menjembatani kesenjangan krusial antara riset teori dan kebutuhan nyata',
        mnemonic: 'Frasa inti yang menghubungkan mengapa program studi tujuan Anda dibutuhkan oleh Indonesia.',
        speakText: 'bridge a critical gap',
      },
      {
        symbol: 'catalyze my interest in',
        reading: '/ˈkætəˌlaɪz maɪ ˈɪntrəst ɪn/',
        meaning: 'Memicu / mempercepat tumbuhnya minat riset mendalam saya pada...',
        mnemonic: 'Catalyze (ejaan AS dengan -yze!) jauh lebih dewasa dan tajam daripada \'made me interested in\'.',
        speakText: 'catalyze my interest in',
      },
      {
        symbol: 'underserved communities',
        reading: '/ˌʌndərˈsɜːrvd kəˈmjuːnətiz/',
        meaning: 'Masyarakat yang selama ini kurang terjangkau layanan memadai (kesehatan/pendidikan/finansial)',
        mnemonic: 'Istilah kebijakan publik standar internasional pengganti \'poor areas\' yang terdengar menghakimi.',
        speakText: 'underserved communities',
      },
      {
        symbol: 'capacity building',
        reading: '/kəˈpæsəti ˈbɪldɪŋ/',
        meaning: 'Penguatan kapasitas sumber daya manusia dan kelembagaan lokal',
        mnemonic: 'Kata kunci penilaian dampak pascastudi pada wawancara LPDP dan Fulbright!',
        speakText: 'capacity building',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-004',
      title: 'Purposeful Trajectory Framing (\'Equipped with [X], I aim to [Y]\')',
      formula: 'Witnessing [Problem] catalyzed my resolve to [Goal] | Equipped with [Skill], I aim to [Impact]',
      formulaReading: 'Equipped with causal inference training at Stanford, I aim to evaluate rural stunting interventions.',
      explanation: 'Struktur esai beasiswa juara mengikuti busur tiga babak: (1) Titik pijak bukti masa lalu (\'Leading maternal health audits across Maluku catalyzed...\'), (2) Mengapa kampus/lab spesifik ini (\'Professor Chen\'s lab uniquely bridges...\'), dan (3) Rencana kontribusi terukur (\'Equipped with..., I intend to spearhead...\').',
      examples: [
        {
          jp: 'Auditing off-grid clinics in Papua catalyzed my commitment to frugal bioengineering.',
          reading: '/ˈɔːdɪtɪŋ ˈɔːfˌɡrɪd ˈklɪnɪks ɪn ˈpɑːpuə ˈkætəˌlaɪzd maɪ kəˈmɪtmənt tə ˈfruːɡəl ˌbaɪoʊˌɛndʒəˈnɪrɪŋ/',
          id: 'Mengaudit klinik luar jaringan listrik di Papua memicu komitmen saya pada rekayasa hayati hemat biaya.',
        },
        {
          jp: 'Graduate training at Columbia will equip me to bridge Indonesia\'s geothermal policy gap.',
          reading: '/ˈɡrædʒuət ˈtreɪnɪŋ æt kəˈlʌmbiə wɪl ɪˈkwɪp mi tə brɪdʒ ˌɪndəˈniːʒəz ˌdʒiːoʊˈθɜːrməl ˈpɑːləsi ɡæp/',
          id: 'Pendidikan pascasarjana di Columbia akan membekali saya menjembatani kesenjangan kebijakan panas bumi Indonesia.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan pelafalan kata sifat/benda \'graduate\' (/ˈɡrædʒuət/ schwa di akhir) vs. kata kerja \'to graduate\' (/ˈɡrædʒuˌeɪt/ diftong eɪ di akhir)!',
  },
  'en-us-c1-u4-tata-bahasa': {
    headline: 'Pola Penegas \'It was ... that ...\' & Inferential \'It is precisely because...\' dalam Esai Personal',
    subtitle: 'Gunakan pola penegas \'It was ... that ...\' secara selektif untuk menyorot momen penentu karier tanpa terdengar narsistik atau monoton.',
    items: [
      {
        symbol: 'It was during [X] that I first...',
        reading: '/ɪt wʌz ˈdʊrɪŋ ... ðæt aɪ fɜːrst/',
        meaning: 'Justru pada masa [pengalaman X] itulah saya pertama kali...',
        mnemonic: 'Menyorot konteks lapangan tempat kesadaran riset Anda lahir dengan fokus tajam.',
        speakText: 'It was during [X] that I first...',
      },
      {
        symbol: 'It is precisely this intersection that...',
        reading: '/ɪt ɪz prɪˈsaɪsli ðɪs ˌɪntərˈsɛkʃən ðæt/',
        meaning: 'Persis titik temu antar-disiplin inilah yang...',
        mnemonic: 'Menjelaskan mengapa latar belakang lintas bidang Anda adalah keunggulan unik, bukan kelemahan.',
        speakText: 'It is precisely this intersection that...',
      },
      {
        symbol: 'Not until I led [X] did I appreciate...',
        reading: '/nɑːt ʌnˈtɪl aɪ lɛd ... dɪd aɪ əˈpriːʃiˌeɪt/',
        meaning: 'Baru setelah saya memimpin [X], saya benar-benar memahami...',
        mnemonic: 'Memadukan refleksi pertumbuhan kepemimpinan dengan pembalikan urutan C1 dari Unit 1!',
        speakText: 'Not until I led [X] did I appreciate...',
      },
      {
        symbol: 'What sets [Program] apart is...',
        reading: '/wʌt sɛts ... əˈpɑːrt ɪz/',
        meaning: 'Hal yang membedakan [Program Kampus] secara unggul dibanding yang lain adalah...',
        mnemonic: 'Kalimat pujian spesifik nan berkelas untuk paragraf \'Why This Program\' di SoP.',
        speakText: 'What sets [Program] apart is...',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-004',
      title: 'Pola Penegas \'It was ... that ...\' (\'It was X that...\') & \'What sets X apart is...\'',
      formula: 'It + be + [Focused Element] + that/who + Sisa Kalimat | What sets [X] apart is [NP / that S+V]',
      formulaReading: 'It was while debugging hospital scheduling software that I saw how algorithms shape triage.',
      explanation: 'Perhatikan kata hubung pasangan pola penegas \'It was ... that ...\': meskipun elemen fokusnya berupa waktu atau tempat (\'during the 2022 flood\', \'in rural NTT\'), standar formal memakai \'THAT\' (bukan \'when/where\'): \'It was during my assignment in Kupang THAT I witnessed...\'.',
      examples: [
        {
          jp: 'It was during our microgrid pilot in Sumba that storage bottlenecks became evident.',
          reading: '/ɪt wʌz ˈdʊrɪŋ ˈaʊər ˈmaɪkroʊˌɡrɪd ˈpaɪlət ɪn ˈsʊmbə ðæt ˈstɔːrɪdʒ ˈbɑːtəlˌnɛks bɪˈkeɪm ˈɛvədənt/',
          id: 'Justru selama uji coba mikrogrid kami di Sumba itulah kemacetan penyimpanan energi tampak nyata.',
        },
        {
          jp: 'What sets Cornell\'s program apart is its clinical immersion with municipal agencies.',
          reading: '/wʌt sɛts kɔːrˈnɛlz ˈproʊɡræm əˈpɑːrt ɪz ɪts ˈklɪnɪkəl ɪˈmɜːrʒən wɪð mjuːˈnɪsəpəl ˈeɪdʒənsiz/',
          id: 'Hal yang membedakan program Cornell secara unggul adalah terjun praktik langsungnya bersama dinas kota.',
        },
      ],
    },
    contrastiveTip: 'Jangan memakai pola penegas \'It was ... that ...\' lebih dari satu atau dua kali per esai 800 kata — gunakan hanya pada puncak transisi paragraf agar efek sorotannya tetap maksimal!',
  },
  'en-us-c1-u4-diskusi-toefl': {
    headline: 'Menjawab Wawancara Panel LPDP, Chevening & Fulbright secara Tajam',
    subtitle: 'Panelis beasiswa menguji kejelasan visi 5–10 tahun, realisme implementasi di tanah air, serta ketangguhan menghadapi resistensi birokrasi/industri.',
    items: [
      {
        symbol: 'tangible multiplier effect',
        reading: '/ˈtændʒəbəl ˈmʌltəˌplaɪər ɪˈfɛkt/',
        meaning: 'Efek pengganda nyata yang manfaatnya meluas berkali-kali lipat ke orang lain',
        mnemonic: 'Panelis LPDP berinvestasi pada kandidat yang ilmunya memberi multiplier effect bagi ekosistem nasional, bukan karier pribadi semata.',
        speakText: 'tangible multiplier effect',
      },
      {
        symbol: 'flexible model',
        reading: '/ˈskeɪləbəl ˈbluːˌprɪnt/',
        meaning: 'Cetak biru percontohan yang dapat direplikasi ke skala provinsi/nasional',
        mnemonic: 'Mulailah dari proyek percontohan realistis di satu daerah, lalu jadikan model fleksibel yang bisa ditiru di tempat lain!',
        speakText: 'flexible model',
      },
      {
        symbol: 'institutionalize best practices',
        reading: '/ˌɪnstəˈtuːʃənəˌlaɪz bɛst ˈpræktɪsɪz/',
        meaning: 'Melembagakan praktik terbaik ke dalam SOP resmi agar bertahan meski pimpinan berganti',
        mnemonic: 'Jawaban pamungkas saat ditanya \'Bagaimana agar inovasi Anda tidak berhenti ketika Anda dimutasi?\'.',
        speakText: 'institutionalize best practices',
      },
      {
        symbol: 'align goals across partners',
        reading: '/əˈlaɪn ɪnˈsɛntɪvz əˈkrɔːs ˈsteɪkˌhoʊldərz/',
        meaning: 'Menyelaraskan kepentingan/insentif seluruh pemangku kepentingan agar mau bekerja sama',
        mnemonic: 'Menunjukkan kematangan kepemimpinan sistemik di atas rata-rata pelamar.',
        speakText: 'align goals across partners',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-004',
      title: 'Menyusun Rencana Jangka Pendek & Dampak Jangka Panjang',
      formula: 'In the immediate term, I plan to [Proyek Awal]; over the longer horizon, this will serve as a flexible model to [Tujuan Besar].',
      formulaReading: 'Rather than proposing top-down mandates, I aim to align incentives across local clinics.',
      explanation: 'Ketika ditanya rencana kontribusi pascastudi, hindari janji muluk tanpa pijakan (\'Saya akan menghapus kemiskinan Indonesia\'). Bagi jawaban ke dua cakrawala: langkah konkret Tahun ke-1–2 (\'In the immediate term...\') dan perluasan sistemik Tahun ke-5 (\'Over a five-year horizon...\').',
      examples: [
        {
          jp: 'In the immediate term, I will pilot AI malaria screening in three Maluku hospitals.',
          reading: '/ɪn ði ɪˈmiːdiət tɜːrm aɪ wɪl ˈpaɪlət ˌeɪˈaɪ məˈlɛriə ˈskriːnɪŋ ɪn θriː məˈluːkuː ˈhɑːspɪtəlz/',
          id: 'Dalam jangka pendek terdekat, saya akan menguji coba penyaringan malaria berbasis AI di tiga rumah sakit Maluku.',
        },
        {
          jp: 'Institutionalizing open procurement standards creates a tangible multiplier effect.',
          reading: '/ˌɪnstəˈtuːʃənəˌlaɪzɪŋ ˈoʊpən prəˈkjʊrmənt ˈstændərdz kriˈeɪts ə ˈtændʒəbəl ˈmʌltəˌplaɪər ɪˈfɛkt/',
          id: 'Melembagakan standar pengadaan terbuka menciptakan efek pengganda yang nyata.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan ejaan Amerika \'institutionalize\' (dengan -ize) dan pelafalannya /ˌɪnstəˈtuːʃənəˌlaɪz/!',
  },
  // ===========================================================================
  // Level C1 — UNIT 5 (GP-EN-C1-005)
  // ===========================================================================
  'en-us-c1-u5-kosakata': {
    headline: 'Melampaui Hitam-Putih: Kosakata Sintesis Riset Tingkat C1',
    subtitle: 'Pada riset pascasarjana dan bacaan akademik tingkat tinggi, sumber kedua sering kali mengakui sebagian kebenaran sumber pertama sembari mempersempit syarat berlakunya (*qualifying*).',
    items: [
      {
        symbol: 'reconcile conflicting findings',
        reading: '/ˈrɛkənˌsaɪl kənˈflɪktɪŋ ˈfaɪndɪŋz/',
        meaning: 'Mendamaikan / menemukan penjelasan pemersatu atas dua temuan riset yang tampak bertabrakan',
        mnemonic: 'Ketika Studi A bilang naik dan Studi B bilang turun, teori C hadir untuk reconcile keduanya (mis. beda kelompok usia)!',
        speakText: 'reconcile conflicting findings',
      },
      {
        symbol: 'qualify an assertion',
        reading: '/ˈkwɑːləˌfaɪ ən əˈsɜːrʃən/',
        meaning: 'Memberikan batasan syarat pada suatu klaim agar tidak terlalu digeneralisasi',
        mnemonic: 'Awas arti kata akademik penting dalam bahasa Inggris resmi: \'qualify a statement\' = MEMBATASI/MEMPERHALUS klaim, BUKAN lulus seleksi!',
        speakText: 'qualify an assertion',
      },
      {
        symbol: 'lend credence to',
        reading: '/lɛnd ˈkriːdəns tuː/',
        meaning: 'Memberikan bobot kepercayaan / dukungan bukti tambahan pada suatu hipotesis',
        mnemonic: 'Credence (seakar dengan credible/credit) = tingkat keterpercayaan ilmiah.',
        speakText: 'lend credence to',
      },
      {
        symbol: 'cast into sharp relief',
        reading: '/kæst ˈɪntuː ʃɑːrp rɪˈliːf/',
        meaning: 'Membuat suatu kontras atau kelemahan tampak sangat menonjol dan jelas terlihat',
        mnemonic: 'Berasal dari seni pahat relief: bayangan tajam membuat ukiran menonjol keluar dengan sangat kontras.',
        speakText: 'cast into sharp relief',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-005',
      title: 'Nuanced Qualification (\'While conceding that..., the lecturer qualifies this by...\')',
      formula: 'While conceding that [Partial Truth], [Author B] qualifies this assertion, demonstrating that [Boundary Condition].',
      formulaReading: 'The professor reconciles these conflicting datasets by distinguishing acute stress from chronic stress.',
      explanation: 'Di bacaan & esai tingkat lanjut, kata kerja \'qualify\' sering muncul di pilihan jawaban (\'The author mentions X in order to qualify an earlier claim\'). Memahami nuansa \'concede + qualify\' membuat esai Anda jauh lebih matang daripada sekadar menulis \'The professor disagrees\'.',
      examples: [
        {
          jp: 'While conceding that tariffs protect infant mills, the economist qualifies their long-term efficacy.',
          reading: '/waɪl kənˈsiːdɪŋ ðæt ˈtærɪfs prəˈtɛkt ˈɪnfənt mɪlz ði ɪˈkɑːnəmɪst ˈkwɑːləˌfaɪz ðɛr lɔːŋ tɜːrm ˈɛfɪkəsi/',
          id: 'Meski mengakui tarif melindungi pabrik rintisan awal, ekonom tersebut membatasi klaim kemanjuran jangka panjangnya.',
        },
        {
          jp: 'Deep-ocean core samples lend credence to the rapid-cooling hypothesis.',
          reading: '/diːp ˈoʊʃən kɔːr ˈsæmpəlz lɛnd ˈkriːdəns tə ðə ˈræpɪd ˈkuːlɪŋ haɪˈpɑːθəsɪs/',
          id: 'Sampel inti laut dalam memberi bobot keterpercayaan pada hipotesis pendinginan cepat.',
        },
      ],
    },
    contrastiveTip: 'Jebakan kosakata nomor satu di bahasa Inggris tingkat lanjut: \'to qualify a claim\' berarti menambahkan syarat/batasan (\'Yes, ONLY under condition X\'), bukan memvalidasi mutlak!',
  },
  'en-us-c1-u5-tata-bahasa': {
    headline: 'Konstruksi Kontras Tingkat C1: \'Whereas / Much as / Not so much A as B\'',
    subtitle: 'Pertajam kalimat pembanding teori Anda dengan struktur diferensiasi halus \'not so much [A] as [B]\' dan bagian kalimat konsesi \'Much as [S + V]\'.',
    items: [
      {
        symbol: 'not so much [A] as [B]',
        reading: '/nɑːt soʊ mʌtʃ ... æz .../',
        meaning: 'Bukanlah terutama [A], melainkan lebih tepat disebut [B]',
        mnemonic: 'Koreksi konseptual super tajam di latihan membaca & menulis: \'The crisis was not so much a lack of grain as a failure of rail distribution\'!',
        speakText: 'not so much [A] as [B]',
      },
      {
        symbol: 'Much as [S + V], ...',
        reading: '/mʌtʃ æz .../',
        meaning: 'Meskipun sangat diakui bahwa [S + V], ...',
        mnemonic: 'Pembuka konsesi C1 yang elegan di awal kalimat, setara dengan \'Although ... very much\'.',
        speakText: 'Much as [S + V], ...',
      },
      {
        symbol: 'inasmuch as',
        reading: '/ˌɪnəzˈmʌtʃ æz/',
        meaning: 'Mengingat kenyataan bahwa / sejauh bahwa (penjelas alasan formal)',
        mnemonic: 'Sering muncul di teks filsafat, hukum, dan artikel akademik untuk memperjelas dasar alasan.',
        speakText: 'inasmuch as',
      },
      {
        symbol: 'diverge sharply on',
        reading: '/daɪˈvɜːrdʒ ˈʃɑːrpli ɑːn/',
        meaning: 'Berbeda pandangan secara tajam mengenai mekanisme tertentu',
        mnemonic: 'Ketika dua ilmuwan sepakat pada fakta dasarnya (\'converge on X\'), namun \'diverge sharply on Y\'!',
        speakText: 'diverge sharply on',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-005',
      title: 'Reframing Contrasts (\'not so much A as B\') & Concessive \'Much as\'',
      formula: 'Subject + be + not so much [Misconception A] as [Precise Reality B] | Much as + S + V, Kalimat Utama',
      formulaReading: 'The Mayan collapse was not so much a sudden conquest as a protracted ecological shift.',
      explanation: 'Struktur \'not so much X as Y\' tidak membuang X secara kasar, melainkan membingkai ulang (*reframe*) hakikat masalah ke definisi Y yang jauh lebih akurat—teknik favorit penulis jurnal ilmiah dan soal parafrasa esai bahasa Inggris tingkat mahir!',
      examples: [
        {
          jp: 'Employee attrition stems not so much from compensation as from opaque career paths.',
          reading: '/ɪmˈplɔɪiː əˈtrɪʃən stɛmz nɑːt soʊ mʌtʃ frʌm ˌkɑːmpənˈseɪʃən æz frʌm oʊˈpeɪk kəˈrɪr pæðz/',
          id: 'Keluarnya karyawan berakar bukan terutama dari kompensasi, melainkan dari jalur karier yang tidak transparan.',
        },
        {
          jp: 'Much as classical models prize equilibrium, real credit markets swing wildly.',
          reading: '/mʌtʃ æz ˈklæsɪkəl ˈmɑːdəlz praɪz ˌiːkwəˈlɪbriəm ˈriːəl ˈkrɛdɪt ˈmɑːrkɪts swɪŋ ˈwaɪldli/',
          id: 'Meskipun model klasik sangat menjunjung titik keseimbangan, pasar kredit nyata berayun tajam.',
        },
      ],
    },
    contrastiveTip: 'Jaga paralelisme mutlak pada \'not so much [A] as [B]\': jika [A] memakai kata depan \'from X\', maka [B] wajib memakai kata depan \'from Y\'!',
  },
  'en-us-c1-u5-diskusi-toefl': {
    headline: 'Menyintesis Beragam Perspektif dalam Seminar Pascasarjana & Esai Riset',
    subtitle: 'Di ruang seminar doktoral AS maupun penulisan akademik C1, Anda diharapkan memetakan benang merah lintas sumber (\'thread the needle\', \'complementary rather than contradictory\').',
    items: [
      {
        symbol: 'complementary rather than contradictory',
        reading: '/ˌkɑːmpləˈmɛntəri ˈræðər ðæn ˌkɑːntrəˈdɪktəri/',
        meaning: 'Saling melengkapi satu sama lain, bukannya saling bertentangan',
        mnemonic: 'Ejaan krusial: \'complEmentary\' (melengkapi dari kata complement, huruf E!) ≠ \'complImentary\' (memuji/gratis, huruf I)!',
        speakText: 'complementary rather than contradictory',
      },
      {
        symbol: 'account for an anomaly',
        reading: '/əˈkaʊnt fɔːr ən əˈnɑːməli/',
        meaning: 'Menjelaskan secara ilmiah mengapa suatu penyimpangan data bisa muncul',
        mnemonic: 'Teori baru dinilai unggul bila mampu account for anomalies yang gagal dijelaskan teori lama.',
        speakText: 'account for an anomaly',
      },
      {
        symbol: 'nuanced middle ground',
        reading: '/ˈnuːɑːnst ˈmɪdəl ɡraʊnd/',
        meaning: 'Posisi jalan tengah yang kaya nuansa dan tidak terjebak dikotomi ekstrem',
        mnemonic: 'Ciri khas pemikir C1–C2 pada diskusi kelas & forum akademik dan wawancara beasiswa!',
        speakText: 'nuanced middle ground',
      },
      {
        symbol: 'underpin a framework',
        reading: '/ˌʌndərˈpɪn ə ˈfreɪmˌwɜːrk/',
        meaning: 'Menjadi fondasi penopang utama di bawah suatu kerangka teori',
        mnemonic: 'Under + pin (pasak penyangga bawah): asumsi dasar yang menopang seluruh bangunan kebijakan.',
        speakText: 'underpin a framework',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-005',
      title: 'Integrative Synthesis (\'Viewed as complementary, [A] and [B]...\')',
      formula: 'Viewed as complementary rather than contradictory, [Theory A] explains [Macro], whereas [Theory B] accounts for [Micro].',
      formulaReading: 'Behavioral economics underpins modern retirement default policies.',
      explanation: 'Cara paling anggun menutup sintesis teori yang tampaknya berseberangan adalah menunjukkan pembagian wilayah penjelasannya: Teori A menjelaskan skala makro/jangka panjang, sementara Teori B menjelaskan anomali mikro/jangka pendek.',
      examples: [
        {
          jp: 'Viewed as complementary rather than contradictory, the two models explain both boom and bust.',
          reading: '/vjuːd æz ˌkɑːmpləˈmɛntəri ˈræðər ðæn ˌkɑːntrəˈdɪktəri ðə tuː ˈmɑːdəlz ɪkˈspleɪn boʊθ buːm ænd bʌst/',
          id: 'Dipandang saling melengkapi alih-alih bertentangan, kedua model tersebut menjelaskan fase ekspansi maupun krisis.',
        },
        {
          jp: 'Three core assumptions underpin the central bank\'s inflation-targeting framework.',
          reading: '/θriː kɔːr əˈsʌmpʃənz ˌʌndərˈpɪn ðə ˈsɛntrəl bæŋks ɪnˈfleɪʃən ˈtɑːrɡətɪŋ ˈfreɪmˌwɜːrk/',
          id: 'Tiga asumsi inti menopang kerangka penargetan inflasi milik bank sentral.',
        },
      ],
    },
    contrastiveTip: 'Cek ejaan wajib: \'complementary\' (e = complete/melengkapi) vs. \'complimentary\' (i = praise/gratis, mis. complimentary breakfast)!',
  },
  // ===========================================================================
  // Level C1 — UNIT 6 (GP-EN-C1-006)
  // ===========================================================================
  'en-us-c1-u6-kosakata': {
    headline: 'Teknik Bridging & Komunikasi Krisis Tingkat Pimpinan',
    subtitle: 'Saat menghadapi pertanyaan mendadak dari investor, jurnalis, atau penguji sidang, pemimpin C1 tidak panik atau menghindar kasar—mereka melakukan *acknowledge and bridge*.',
    items: [
      {
        symbol: 'address the elephant in the room',
        reading: '/əˈdrɛs ði ˈɛləfənt ɪn ðə ruːm/',
        meaning: 'Membahas secara terbuka masalah besar/sensitif yang semua orang tahu tetapi enggan bicarakan',
        mnemonic: 'Membuka presentasi krisis dengan menyentuh isu sensitif lebih dulu langsung melucuti ketegangan audiens.',
        speakText: 'address the elephant in the room',
      },
      {
        symbol: 'contain the fallout',
        reading: '/kənˈteɪn ðə ˈfɔːlˌaʊt/',
        meaning: 'Membatasi meluasnya dampak buruk susulan dari suatu krisis atau keputusan',
        mnemonic: 'Fallout = debu radioaktif susulan sesudah ledakan; dipakai untuk dampak reputasi/finansial.',
        speakText: 'contain the fallout',
      },
      {
        symbol: 'speak to [a specific aspect]',
        reading: '/spiːk tuː/',
        meaning: 'Menjelaskan / memberi tanggapan berwenang mengenai satu aspek spesifik',
        mnemonic: 'Idiom ruang direksi AS: \'I can speak to the engineering timeline, while our CFO will cover margins\'.',
        speakText: 'speak to [a specific aspect]',
      },
      {
        symbol: 'get ahead of the narrative',
        reading: '/ɡɛt əˈhɛd ʌv ðə ˈnærətɪv/',
        meaning: 'Mengumumkan fakta dan solusi lebih dulu sebelum rumor liar membentuk opini publik',
        mnemonic: 'Prinsip emas manajemen krisis modern: proaktif memberi konteks sebelum spekulasi menyebar.',
        speakText: 'get ahead of the narrative',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-006',
      title: 'Menekankan Pernyataan dengan \'do/does/did\' saat Tanya Jawab',
      formula: 'Kalimat Pengakuan + , S + do / does / did + V1 (Emphatic Affirmation)',
      formulaReading: 'While we cannot share client names, we do publish third-party SOC 2 audits.',
      explanation: 'Dalam sesi Q&A kritis, menyisipkan \'do / does / did\' pada kalimat positif (\'What we DO know is...\', \'We DID isolate the cluster within four minutes\') menciptakan kontras meyakinkan terhadap hal yang belum bisa diungkapkan.',
      examples: [
        {
          jp: 'While root-cause forensics continue, we did isolate the affected server within minutes.',
          reading: '/waɪl ruːt kɔːz fəˈrɛnzɪks kənˈtɪnjuː wi dɪd ˈaɪsəˌleɪt ði əˈfɛktɪd ˈsɜːrvər wɪˈðɪn ˈmɪnɪts/',
          id: 'Meskipun forensik akar masalah masih berjalan, kami benar-benar telah mengisolasi server terdampak dalam hitungan menit.',
        },
        {
          jp: 'I cannot comment on unannounced deals, though I can speak to our long-term research plan.',
          reading: '/aɪ ˈkænɑːt ˈkɑːmɛnt ɑːn ˌʌnəˈnaʊnst ˌɛmændˈeɪ ðoʊ aɪ kæn spiːk tuː ˈaʊər ɔːrˈɡænɪk/',
          id: 'Saya tidak dapat mengomentari merger yang belum diumumkan, namun saya dapat menjelaskan peta jalan riset internal kami.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan sesudah penegas \'did\' (\'we did isolate\'), kata kerja utamanya kembali ke V1 murni (\'isolate\', bukan \'isolated\')!',
  },
  'en-us-c1-u6-tata-bahasa': {
    headline: 'Preparatory \'It\' Objek (\'find it + Adj + to V1\') & Subjek Ekstraposisi',
    subtitle: 'Hindari kalimat janggal terjemahan harfiah seperti *\'Automation makes easier to scale\'* — bahasa Inggris menuntut objek semu \'it\' sebelum kata sifat!',
    items: [
      {
        symbol: 'make it feasible to [V1]',
        reading: '/meɪk ɪt ˈfiːzəbəl tuː/',
        meaning: 'Membuat [tindakan] menjadi layak dijalankan (WAJIB ada \'it\'!)',
        mnemonic: 'Rumus besi C1: make / find / deem / consider + IT + Adjective/Noun + to V1 / kalimat \'that...\'!',
        speakText: 'make it feasible to [V1]',
      },
      {
        symbol: 'deem it prudent to',
        reading: '/diːm ɪt ˈpruːdənt tuː/',
        meaning: 'Memandang / menilai bijaksana untuk melakukan sesuatu',
        mnemonic: 'Kata kerja resmi tingkat direksi dan hukum pengganti \'think it is smart to\'.',
        speakText: 'deem it prudent to',
      },
      {
        symbol: 'owe it to [everyone involved] to [V1]',
        reading: '/oʊ ɪt tuː ... tuː .../',
        meaning: 'Memiliki kewajiban moral kepada [pihak] untuk [melakukan sesuatu]',
        mnemonic: 'Retorika kepemimpinan penuh integritas pada pidato eksekutif dan esai beasiswa.',
        speakText: 'We owe it to everyone involved to be transparent.',
      },
      {
        symbol: 'take it for granted that...',
        reading: '/teɪk ɪt fɔːr ˈɡræntɪd ðæt/',
        meaning: 'Menganggap remeh / mengasumsikan begitu saja bahwa...',
        mnemonic: 'Jika diikuti bagian kalimat \'that...\', wajib sisipkan \'it\' sesudah \'take\': \'take IT for granted that...\'!',
        speakText: 'take it for granted that...',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-006',
      title: 'Wajib Sisipkan \'it\' pada Pola \'make/find/deem + it + Kata Sifat + to V1\'',
      formula: 'Verb (make/find/deem/consider) + IT + Adj/NP + [to V1 | that S + V]',
      formulaReading: 'Modular batteries make it economically viable to electrify island ferries.',
      explanation: 'Kesalahan paling sering bahkan di kalangan penulis mahir Indonesia adalah melupakan \'it\' di antara kata kerja pendapat/penyebab dan komplemen sifat (*\'High latency makes difficult to collaborate\'* -> SALAH!). Karena bentuk \'to + V1\' tidak boleh duduk langsung sebelum kata sifat objek, wajib pasang penyangga \'it\': \'makes IT difficult to collaborate\'!',
      examples: [
        {
          jp: 'Edge caching makes it possible to stream surgical video over 4G networks.',
          reading: '/ɛdʒ ˈkæʃɪŋ meɪks ɪt ˈpɑːsəbəl tə striːm ˈsɜːrdʒɪkəl ˈvɪdioʊ ˈoʊvər ˌfɔːrˈdʒiː ˈnɛtˌwɜːrks/',
          id: 'Penyimpanan tepi memungkinkan penyiaran video bedah melalui jaringan 4G.',
        },
        {
          jp: 'The risk committee deemed it prudent that cash reserves be doubled.',
          reading: '/ðə rɪsk kəˈmɪti diːmd ɪt ˈpruːdənt ðæt kæʃ rɪˈzɜːrvz bi ˈdʌbəld/',
          id: 'Komite risiko memandang bijaksana agar cadangan kas digandakan.',
        },
      ],
    },
    contrastiveTip: 'Cek selalu setiap kali menulis \'make / find + kata sifat + to V1\': sudahkah ada kata \'IT\' di tengahnya? (\'find IT challenging to...\', \'made IT clear that...\')!',
  },
  'en-us-c1-u6-diskusi-toefl': {
    headline: 'Menjawab Pertanyaan Kritis pada Sidang Tesis, Konferensi & Debat ujian bahasa Inggris',
    subtitle: 'Saat penguji menembakkan celah metodologi di konferensi internasional, gunakan frasa akademik C1 untuk memvalidasi pertanyaan, memperjelas batasan, dan mengaitkannya ke riset lanjutan.',
    items: [
      {
        symbol: 'That speaks directly to a key limitation',
        reading: '/ðæt spiːks dəˈrɛktli tuː ə kiː ˌlɪməˈteɪʃən/',
        meaning: 'Pertanyaan tersebut menyentuh langsung salah satu batasan kunci riset kami',
        mnemonic: 'Jawaban paling berwibawa di sidang tesis/konferensi: bukannya defensif panik, Anda menunjukkan bahwa Anda sudah memikirkan batasan itu!',
        speakText: 'That speaks directly to a key limitation',
      },
      {
        symbol: 'beyond the scope of this study',
        reading: '/bɪˈjɑːnd ðə skoʊp ʌv ðɪs ˈstʌdi/',
        meaning: 'Berada di luar batas cakupan penelitian kali ini',
        mnemonic: 'Cara sah dan elegan menjaga fokus presentasi saat penanya melebar terlalu jauh.',
        speakText: 'beyond the scope of this study',
      },
      {
        symbol: 'warrant further investigation',
        reading: '/ˈwɔːrənt ˈfɜːrðər ɪnˌvɛstəˈɡeɪʃən/',
        meaning: 'Layak / patut diteliti lebih mendalam pada studi berikutnya',
        mnemonic: 'Kata kerja \'warrant\' (= layak mendapat/memerlukan) jauh lebih rapi daripada \'needs more research\'.',
        speakText: 'warrant further investigation',
      },
      {
        symbol: 'take precedence over',
        reading: '/teɪk ˈprɛsədəns ˈoʊvər/',
        meaning: 'Memiliki prioritas lebih tinggi / didahulukan di atas hal lain',
        mnemonic: 'Lafalkan \'precedence\' /ˈprɛsədəns/ (tekanan di suku kata pertama PRES-e-dence, jangan tertukar \'president\'!).',
        speakText: 'take precedence over',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-006',
      title: 'Academic Defense Framing (\'While [X] lies beyond our scope, it warrants...\')',
      formula: 'While [Broad Question] lies beyond the scope of the present study, preliminary trends warrant further investigation.',
      formulaReading: 'Patient safety takes precedence over rapid commercialization.',
      explanation: 'Dalam tanya-jawab akademik Amerika, mengakui batas cakupan studi secara lugas (\'lies beyond our current scope\') lalu menawarkan arah riset masa depan (\'warrants longitudinal follow-up\') menandakan kematangan ilmuwan sejati.',
      examples: [
        {
          jp: 'Cross-border tax harmonization lies beyond the scope of this municipal analysis.',
          reading: '/ˌkrɔːsˈbɔːrdər tæks ˌhɑːrmənəˈzeɪʃən laɪz bɪˈjɑːnd ðə skoʊp ʌv ðɪs mjuːˈnɪsəpəl əˈnæləsɪs/',
          id: 'Harmonisasi pajak lintas batas berada di luar cakupan analisis tingkat kota ini.',
        },
        {
          jp: 'These unexpected gender differences warrant further investigation in Phase Two.',
          reading: '/ðiːz ˌʌnɪkˈspɛktɪd ˈdʒɛndər ˈdɪfrənsɪz ˈwɔːrənt ˈfɜːrðər ɪnˌvɛstəˈɡeɪʃən ɪn feɪz tuː/',
          id: 'Perbedaan gender tak terduga ini layak diteliti lebih lanjut pada Fase Dua.',
        },
      ],
    },
    contrastiveTip: 'Jangan tertukar dua kata mirip: \'precedence\' (/ˈprɛsədəns/ = prioritas lebih tinggi) vs. \'precedent\' (/ˈprɛsədənt/ = contoh keputusan/yurisprudensi terdahulu)!',
  },
  // ===========================================================================
  // Level C1 — UNIT 7 (GP-EN-C1-007)
  // ===========================================================================
  'en-us-c1-u7-kosakata': {
    headline: 'Grammatical Metaphor: Rahasia Kepadatan Bahasa Jurnal Ilmiah',
    subtitle: 'Percakapan sehari-hari berpusat pada kata kerja (\'Because cities grew fast, rivers became polluted\'), sedangkan tulisan C1 memadatkannya menjadi hubungan antar-frasa kata benda (\'Rapid urban sprawl accelerated river contamination\')!',
    items: [
      {
        symbol: 'proliferation (from proliferate)',
        reading: '/prəˌlɪfəˈreɪʃən/',
        meaning: 'Perkembangbiakan / menjamurnya jumlah sesuatu secara sangat pesat',
        mnemonic: 'Misalnya \'the rapid proliferation of unlicensed fintech apps\' — jauh lebih padat daripada \'apps multiplied fast\'.',
        speakText: 'proliferation (from proliferate)',
      },
      {
        symbol: 'attrition (from wear down)',
        reading: '/əˈtrɪʃən/',
        meaning: 'Penyusutan bertahap jumlah anggota/karyawan/responden karena keluar satu per satu',
        mnemonic: 'Dipakai baik di HR (\'employee attrition\') maupun metodologi riset (\'participant attrition in longitudinal trials\').',
        speakText: 'attrition (from wear down)',
      },
      {
        symbol: 'disparity (from disparate)',
        reading: '/dɪˈspærəti/',
        meaning: 'Kesenjangan / ketimpangan mencolok antara dua kelompok',
        mnemonic: 'Pasangan kata alami akademik utama: \'stark disparities in maternal mortality across provinces\'.',
        speakText: 'disparity (from disparate)',
      },
      {
        symbol: 'adherence to (from adhere to)',
        reading: '/ədˈhɪrəns tuː/',
        meaning: 'Kepatuhan / ketaatan konsisten terhadap protokol atau pedoman',
        mnemonic: 'Tetap mewarisi kata depan kata kerja asalnya: \'adhere TO\' → \'strict adherence TO clinical protocols\'!',
        speakText: 'adherence to (from adhere to)',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-007',
      title: 'Mengubah Aksi Menjadi Kata Benda (Meringkas Kalimat Menjadi Frasa Benda)',
      formula: 'Spoken: Because [S + V + Adv], [S2 + V2] → Academic: [Adj + Nominalized N1 + of S] + [Causal Verb] + [Nominalized N2]',
      formulaReading: 'Strict adherence to cold-chain protocols prevented vaccine degradation.',
      explanation: 'Mengubah aksi jadi kata benda memungkinkan penulis akademik menaruh seluruh proses kejadian sebagai SUBJEK kalimat, lalu menghubungkannya dengan kata kerja kausal tunggal seperti \'precipitated\', \'curbed\', \'exacerbated\', atau \'hinged on\'. Pastikan kata depan bawaannya tepat (\'adherence to\', \'disparity between\', \'proliferation of\')!',
      examples: [
        {
          jp: 'The rapid proliferation of rooftop solar strained legacy distribution transformers.',
          reading: '/ðə ˈræpɪd prəˌlɪfəˈreɪʃən ʌv ˈruːfˌtɑːp ˈsoʊlər streɪnd ˈlɛɡəsi ˌdɪstrəˈbjuːʃən trænsˈfɔːrmərz/',
          id: 'Menjamurnya panel surya atap secara pesat membebani transformator distribusi lawas.',
        },
        {
          jp: 'High participant attrition undermined the statistical power of the five-year study.',
          reading: '/haɪ pɑːrˈtɪsəpənt əˈtrɪʃən ˌʌndərˈmaɪnd ðə stəˈtɪstɪkəl ˈpaʊər ʌv ðə faɪv jɪr ˈstʌdi/',
          id: 'Tingginya penyusutan partisipan melemahkan kekuatan statistik studi lima tahun tersebut.',
        },
      ],
    },
    contrastiveTip: 'Aturan emas gaya tulis AS (Williams\' Style): gunakan pengubahan aksi jadi kata benda untuk merangkum konsep yang jelas, tapi JANGAN membunuh kata kerja utama menjadi \'make an analysis of\' (cukup \'analyze\')!',
  },
  'en-us-c1-u7-tata-bahasa': {
    headline: 'Jangan Pakai \'This\' Sendirian: Tambahkan Kata Benda Perangkum!',
    subtitle: 'Aturan emas penulisan akademik AS (APA Style & penulisan esai bahasa Inggris tingkat lanjut): jangan pernah memulai kalimat dengan kata \'This\' sendirian (\'This caused inflation\') — ikuti \'This/These\' dengan kata benda perangkum!',
    items: [
      {
        symbol: 'This discrepancy (Summary Noun)',
        reading: '/ðɪs dɪˈskrɛpənsi/',
        meaning: 'Ketidaksesuaian data ini (merangkum seluruh kalimat sebelumnya secara presisi)',
        mnemonic: 'Ubah \'This confused scientists\' (samar!) menjadi \'This discrepancy prompted scientists to recalibrate\' (tajam!).',
        speakText: 'This discrepancy (Summary Noun)',
      },
      {
        symbol: 'Such fragmentation',
        reading: '/sʌtʃ ˌfræɡmənˈteɪʃən/',
        meaning: 'Terpecah-pecahnya sistem semacam itu',
        mnemonic: 'Mengikat kalimat panjang sebelumnya ke topik kalimat berikutnya seperti kaitan gerbong kereta (*Given-to-New flow*).',
        speakText: 'Such fragmentation',
      },
      {
        symbol: 'These twin pressures',
        reading: '/ðiːz twɪn ˈprɛʃərz/',
        meaning: 'Kedua tekanan kembar tersebut (merangkum dua faktor yang baru dibahas)',
        mnemonic: 'Cara super elegan membuka kalimat sintesis sesudah memaparkan dua masalah berurutan!',
        speakText: 'These twin pressures',
      },
      {
        symbol: 'This shift in emphasis',
        reading: '/ðɪs ʃɪft ɪn ˈɛmfəsɪs/',
        meaning: 'Pergeseran titik fokus ini',
        mnemonic: 'Sangat membantu menjawab soal \'Insert a Sentence\' di bacaan artikel panjang karena menjadi petunjuk rujukan balik (*anaphoric anchor*)!',
        speakText: 'This shift in emphasis',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-007',
      title: 'Menyambung Kalimat dengan \'This/These/Such + Kata Benda Perangkum\'',
      formula: 'Sentence 1: [Complex Event/Process]. → Sentence 2: This/Such + [Abstract Summary Noun] + Verb...',
      formulaReading: 'Districts adopted incompatible data formats. Such fragmentation hindered epidemic tracking.',
      explanation: 'Mengapa \'This\' tanpa kata benda disebut *unattended \'this\'* oleh profesor Amerika? Karena pembaca terpaksa menebak bagian mana dari kalimat sebelumnya yang dimaksud \'This\'. Menambahkan kata benda perangkum (\'This bottleneck\', \'These competing demands\', \'Such volatility\') sekaligus menjadi kunci pemecah soal *Sentence Insertion* di bacaan artikel panjang!',
      examples: [
        {
          jp: 'Shipping costs rose while export orders shrank. These twin pressures squeezed small mills.',
          reading: '/ˈʃɪpɪŋ kɔːsts roʊz waɪl ˈɛkspɔːrt ˈɔːrdərz ʃræŋk ðiːz twɪn ˈprɛʃərz skwiːzd smɔːl mɪlz/',
          id: 'Biaya pelayaran naik sementara pesanan ekspor menyusut. Kedua tekanan kembar ini menghimpit pabrik kecil.',
        },
        {
          jp: 'Municipal agencies used incompatible radio bands. This lack of interoperability delayed rescue.',
          reading: '/mjuːˈnɪsəpəl ˈeɪdʒənsiz juːzd ˌɪnkəmˈpætəbəl ˈreɪdioʊ bændz ðɪs læk ʌv ˌɪntərˌɑːpərəˈbɪləti dɪˈleɪd ˈrɛskjuː/',
          id: 'Dinas-dinas kota memakai pita radio yang tak kompatibel. Ketiadaan interoperabilitas ini menghambat penyelamatan.',
        },
      ],
    },
    contrastiveTip: 'Trik cepat soal bacaan artikel panjang \'Insert Text\': cari \'This / These / Such + Kata Benda\' di kalimat kotak hitam—kalimat itu WAJIB diletakkan tepat sesudah kalimat yang menjelaskan konsep kata benda tersebut!',
  },
  'en-us-c1-u7-diskusi-toefl': {
    headline: 'Ubah Kalimat Kaku Jadi Bicara Luwes: Agar Presentasi Tidak Terdengar Seperti Robot Buku Teks',
    subtitle: 'Kemahiran C1 bekerja dua arah: menulis padat dengan pengubahan aksi jadi kata benda di esai, namun MENGURAI kembali frasa padat menjadi kata kerja aktif saat berbicara di wawancara atau presentasi & berbicara bahasa Inggris!',
    items: [
      {
        symbol: 'boil down to',
        reading: '/bɔɪl daʊn tuː/',
        meaning: 'Pada intinya bermuara / dapat disederhanakan menjadi satu hal pokok',
        mnemonic: 'Analogi merebus kaldu hingga airnya menyusut dan menyisakan sari pati utamanya.',
        speakText: 'boil down to',
      },
      {
        symbol: 'put simply / in plain terms',
        reading: '/pʊt ˈsɪmpli/ • /ɪn pleɪn tɜːrmz/',
        meaning: 'Singkat kata / dengan bahasa sederhana yang mudah dicerna',
        mnemonic: 'Jembatan emas presenter eksekutif sesudah menyebutkan istilah teknis berat kepada audiens non-spesialis.',
        speakText: 'put simply / in plain terms',
      },
      {
        symbol: 'spell out the implications',
        reading: '/spɛl aʊt ði ˌɪmpləˈkeɪʃənz/',
        meaning: 'Menguraikan dampak praktisnya secara gamblang satu per satu',
        mnemonic: 'Menerjemahkan angka abstrak menjadi apa artinya bagi anggaran, pengguna, atau kebijakan.',
        speakText: 'spell out the implications',
      },
      {
        symbol: 'strip away the jargon',
        reading: '/strɪp əˈweɪ ðə ˈdʒɑːrɡən/',
        meaning: 'Menanggalkan istilah teknis rumit agar inti mekanismenya terlihat jernih',
        mnemonic: 'Keterampilan utama latihan merangkum bacaan & kuliah secara lisan: mengubah definisi bacaan yang penuh jargon menjadi penjelasan kata kerja aktif!',
        speakText: 'strip away the jargon',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-007',
      title: 'Menyesuaikan Gaya Bahasa: Tulisan Padat ↔ Bicara Luwes',
      formula: 'Written Text: [Thermoregulatory vasoconstriction] → Spoken Paraphrase: Put simply, blood vessels narrow to retain heat.',
      formulaReading: 'What this technical white paper boils down to is how fast batteries charge in winter.',
      explanation: 'Pada latihan merangkum bacaan secara lisan, kotak bacaan sengaja ditulis dengan pengubahan aksi jadi kata benda berat (\'asymmetrical information asymmetry in secondary markets\'). Jika Anda membacakannya mentah-mentah, skor bicara Anda turun. Ubah menjadi kalimat aktif jernih: \'Put simply, sellers know far more about product defects than buyers do\'!',
      examples: [
        {
          jp: 'Put simply, dynamic pricing adjusts transit fares whenever rush-hour demand spikes.',
          reading: '/pʊt ˈsɪmpli daɪˈnæmɪk ˈpraɪsɪŋ əˈdʒʌsts ˈtrænzɪt fɛrz wɛˈnɛvər rʌʃ ˈaʊər dɪˈmænd spaɪks/',
          id: 'Dengan bahasa sederhana, penetapan tarif dinamis menyesuaikan ongkos angkutan setiap kali permintaan jam sibuk melonjak.',
        },
        {
          jp: 'Strip away the legal jargon, and the rule boils down to shared responsibility.',
          reading: '/strɪp əˈweɪ ðə ˈliːɡəl ˈdʒɑːrɡən ænd ðə klɔːz bɔɪlz daʊn tə ʃɛrd ˌlaɪəˈbɪləti/',
          id: 'Tanggalkan jargon hukumnya, maka pasal tersebut pada intinya bermuara pada pembagian tanggung jawab.',
        },
      ],
    },
    contrastiveTip: 'Ingat rumus kesesuaian gaya bahasa: tulisan akademik = padat kata benda; presentasi lisan & wawancara = bertenaga kata kerja aktif!',
  },
  // ===========================================================================
  // Level C1 — UNIT 8 (GP-EN-C1-008)
  // ===========================================================================
  'en-us-c1-u8-kosakata': {
    headline: 'Membaca & Menyampaikan Umpan Balik Halus di Lingkungan Eksekutif AS',
    subtitle: 'Pemimpin senior Amerika jarang membentak; mereka memakai *understatement* dan *litotes* (negasi ganda berkelas seperti \'not insignificant\') yang artinya justru SANGAT SERIUS!',
    items: [
      {
        symbol: 'far from trivial / no small feat',
        reading: '/fɑːr frʌm ˈtrɪviəl/ • /noʊ smɔːl fiːt/',
        meaning: 'Sama sekali bukan hal sepele (= sangat rumit / pencapaian luar biasa besar!)',
        mnemonic: 'Litotes C1: menegasikan lawan katanya untuk menghasilkan penekanan elegan (\'Migrating zero-downtime is no small feat\').',
        speakText: 'far from trivial / no small feat',
      },
      {
        symbol: 'room for refinement',
        reading: '/ruːm fɔːr rɪˈfaɪnmənt/',
        meaning: 'Ruang untuk penyempurnaan lebih lanjut (cara halus mengatakan draf belum siap rilis!)',
        mnemonic: 'Jika atasan di Amerika berkata \'Strong start, though there\'s room for refinement in section two\', artinya bagian dua wajib ditulis ulang!',
        speakText: 'room for refinement',
      },
      {
        symbol: 'manage expectations upward',
        reading: '/ˈmænɪdʒ ˌɛkspɛkˈteɪʃənz ˈʌpwərd/',
        meaning: 'Mengelola ekspektasi atasan/direksi sejak dini secara proaktif berbasis data',
        mnemonic: 'Jangan tunggu tenggat meledak dalam diam (budaya sungkan); beri peringatan risiko beserta opsi solusi lebih awal!',
        speakText: 'manage expectations upward',
      },
      {
        symbol: 'candid yet constructive',
        reading: '/ˈkændɪd jɛt kənˈstrʌktɪv/',
        meaning: 'Jujur blak-blakan apa adanya namun tetap membangun dan solutif',
        mnemonic: 'Filosofi *Radical Candor* di perusahaan teknologi AS: peduli secara personal sembari jujur terhadap standar kualitas.',
        speakText: 'candid yet constructive',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-008',
      title: 'Litotes (Double-Negative Understatement) & Diplomatic Critiques',
      formula: 'not + Negative Adjective (not uncommon / not insignificant) | far from + Positive/Neutral Adj',
      formulaReading: 'Compliance delays carry a not insignificant financial penalty.',
      explanation: 'Litotes memakai \'not + awalan negatif (un-/in-/im-)\' atau \'hardly / scarcely / far from\' untuk menyampaikan bobot serius secara terpelajar: \'not uncommon\' (= cukup sering terjadi), \'not without risk\' (= mengandung risiko nyata), \'far from optimal\' (= buruk dan harus diperbaiki).',
      examples: [
        {
          jp: 'Migrating fifty terabytes without downtime was no small feat.',
          reading: '/ˈmaɪˌɡreɪtɪŋ ˈfɪfti ˈtɛrəˌbaɪts wɪˈðaʊt ˈdaʊnˌtaɪm wʌz noʊ smɔːl fiːt/',
          id: 'Memigrasikan lima puluh terabita tanpa waktu henti merupakan pencapaian yang luar biasa besar.',
        },
        {
          jp: 'Cross-border acquisitions are not without cultural friction.',
          reading: '/ˌkrɔːsˈbɔːrdər ˌækwəˈzɪʃənz ɑːr nɑːt wɪˈðaʊt ˈkʌltʃərəl ˈfrɪkʃən/',
          id: 'Akuisisi lintas negara bukannya tanpa gesekan budaya (pasti menghadapi gesekan nyata).',
        },
      ],
    },
    contrastiveTip: 'Arti tersirat di kantor AS: \'That\'s an ambitious timeline\' = jadwal itu nyaris mustahil, tolong pangkas lingkupnya atau mundurkan tanggalnya!',
  },
  'en-us-c1-u8-tata-bahasa': {
    headline: 'Tata Bahasa Diplomasi Tingkat Tinggi: \'Would rather + Past\' & \'Much less\'',
    subtitle: 'Kuasai struktur preferensi sopan dengan subjek berbeda (\'I would rather the team focused on...\') serta penguat kontras negatif \'much less / still less\'.',
    items: [
      {
        symbol: 'I\'d rather we waited',
        reading: '/aɪd ˈræðər wi ˈweɪtɪd/',
        meaning: 'Saya lebih memilih agar kita menunggu dulu (preferensi untuk SEKARANG/MASA DEPAN!)',
        mnemonic: 'Awas aturan emas: jika sesudah \'would rather\' muncul SUBJEK BARU (\'we\', \'you\', \'the vendor\'), kata kerjanya WAJIB Past Simple (V2)!',
        speakText: 'I\'d rather we waited until tomorrow.',
      },
      {
        symbol: 'I\'d rather not rush (Same Subject)',
        reading: '/aɪd ˈræðər nɑːt rʌʃ/',
        meaning: 'Saya sendiri lebih memilih untuk tidak terburu-buru (subjek sama → V1 murni)',
        mnemonic: 'Bandingkan: tanpa subjek baru (\'I\'d rather wait\' = V1) vs. dengan subjek baru (\'I\'d rather YOU waited\' = V2)!',
        speakText: 'I\'d rather not rush (Same Subject)',
      },
      {
        symbol: 'much less / let alone',
        reading: '/mʌtʃ lɛs/ • /lɛt əˈloʊn/',
        meaning: 'Apalagi / terlebih lagi mustahil untuk... (sesudah pernyataan negatif/sulit)',
        mnemonic: '\'The sensor barely survives room humidity, much less tropical monsoons!\'',
        speakText: 'much less / let alone',
      },
      {
        symbol: 'With all due respect,',
        reading: '/wɪð ɔːl duː rɪˈspɛkt/',
        meaning: 'Dengan segala hormat, (pembuka ketidaksetujuan tegas di ruang sidang/debat)',
        mnemonic: 'Gunakan secara terukur hanya ketika Anda hendak menyampaikan sanggahan faktual yang sangat tegas.',
        speakText: 'With all due respect,',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-008',
      title: 'Different-Subject \'Would rather + V2/had V3\' & \'Much less\'',
      formula: 'Present/Future Preference: S1 + would rather + S2 + V2 (past form) | Past Regret: ... S2 + had V3',
      formulaReading: 'The board would rather management prioritized profitability over raw user growth.',
      explanation: 'Soal jebakan klasik ujian bahasa Inggris tingkat lanjut dan percakapan eksekutif: \'I would rather you DIDN\'T share this slide yet\' merujuk pada SAAT INI/BESOK (bukan kemarin!). Jika ingin menyatakan penyesalan atas hal yang telanjur terjadi kemarin, gunakan Past Perfect: \'I\'d rather you HAD consulted legal yesterday\'.',
      examples: [
        {
          jp: 'Our security lead would rather contractors accessed staging via bastion hosts.',
          reading: '/ˈaʊər sɪˈkjʊrəti liːd wʊd ˈræðər ˈkɑːntræktərz ˈæksɛst ˈsteɪdʒɪŋ ˈvaɪə ˈbæstʃən hoʊsts/',
          id: 'Pemimpin keamanan kami lebih memilih agar kontraktor mengakses lingkungan staging melalui bastion host.',
        },
        {
          jp: 'Legacy scripts can barely parse ASCII logs, much less nested JSON streams.',
          reading: '/ˈlɛɡəsi skrɪpts kæn ˈbɛrli pɑːrs ˈæski lɔːɡz mʌtʃ lɛs ˈnɛstɪd ˈdʒeɪsɑːn striːmz/',
          id: 'Skrip lawas nyaris tak sanggup mengurai log ASCII biasa, apalagi aliran JSON bersarang.',
        },
      ],
    },
    contrastiveTip: 'Cek kilat \'would rather\': apakah ada subjek kedua sesudahnya? Tidak ada → V1 (\'I\'d rather stay\'). Ada subjek kedua (untuk kini/esok) → V2 (\'I\'d rather she stayed\')!',
  },
  'en-us-c1-u8-diskusi-toefl': {
    headline: 'De-eskalasi Konflik Lintas Divisi & Kolaborasi Multikultural',
    subtitle: 'Pemimpin global dituntut mampu menengahi gesekan antara tim produk, teknik, dan regional menggunakan bahasa netral berorientasi tujuan bersama.',
    items: [
      {
        symbol: 'find common ground',
        reading: '/faɪnd ˈkɑːmən ɡraʊnd/',
        meaning: 'Menemukan titik temu / kepentingan bersama di tengah perbedaan pendapat',
        mnemonic: 'Langkah pembuka mediasi: tarik kedua kubu yang berdebat kembali ke tujuan utama yang sama-sama mereka sepakati.',
        speakText: 'find common ground',
      },
      {
        symbol: 'separate the person from the problem',
        reading: '/ˈsɛpəˌreɪt ðə ˈpɜːrsən frʌm ðə ˈprɑːbləm/',
        meaning: 'Memisahkan urusan pribadi dari akar masalah objektifnya',
        mnemonic: 'Prinsip negosiasi Harvard: keras terhadap masalah sistemnya, namun lembut dan hormat terhadap manusianya.',
        speakText: 'separate the person from the problem',
      },
      {
        symbol: 'give someone the benefit of the doubt',
        reading: '/ɡɪv ˈsʌmwʌn ðə ˈbɛnəfɪt ʌv ðə daʊt/',
        meaning: 'Berprasangka baik bahwa rekan punya niat positif/alasan wajar saat terjadi miskomunikasi',
        mnemonic: 'Kunci utama tim jarak jauh lintas negara ketika nada pesan chat kerja terasa singkat!',
        speakText: 'give someone the benefit of the doubt',
      },
      {
        symbol: 'air grievances constructively',
        reading: '/ɛr ˈɡriːvənsɪz kənˈstrʌktɪvli/',
        meaning: 'Menyampaikan keluhan/ganjalan secara terbuka dan membangun',
        mnemonic: 'Air (mengangin-anginkan ke ruang terbuka) agar ganjalan tidak membusuk di belakang layar.',
        speakText: 'air grievances constructively',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-008',
      title: 'Reframing Conflict into Shared Goals (\'Rather than framing this as A vs. B...\')',
      formula: 'Rather than framing this as [Conflict], let\'s examine how [Shared Goal] can be achieved.',
      formulaReading: 'Assuming positive intent helps distributed teams give colleagues the benefit of the doubt.',
      explanation: 'Saat menjawab soal kepemimpinan di wawancara kerja senior maupun presentasi & berbicara bahasa Inggris, tunjukkan kemampuan de-eskalasi dengan membingkai ulang dikotomi semu (\'Speed vs. Quality\') menjadi pertanyaan kolaboratif (\'How can we ship core value safely?\').',
      examples: [
        {
          jp: 'Rather than framing this as speed versus security, let\'s automate compliance checks.',
          reading: '/ˈræðər ðæn ˈfreɪmɪŋ ðɪs æz spiːd ˈvɜːrsəz sɪˈkjʊrəti lɛts ˈɔːtəˌmeɪt kəmˈplaɪəns tʃɛks/',
          id: 'Alih-alih membingkai masalah ini sebagai pertentangan kecepatan lawan keamanan, mari kita otomatiskan pemeriksaan kepatuhan.',
        },
        {
          jp: 'Across time zones, it pays to give teammates the benefit of the doubt on terse messages.',
          reading: '/əˈkrɔːs taɪm zoʊnz ɪt peɪz tə ɡɪv ˈtiːmˌmeɪts ðə ˈbɛnəfɪt ʌv ðə daʊt ɑːn tɜːrs ˈmɛsɪdʒɪz/',
          id: 'Lintas zona waktu, sangat bermanfaat untuk berprasangka baik kepada rekan setim atas pesan singkat.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan kata sifat \'terse\' (/tɜːrs/ = sangat singkat dan padat hingga kadang terkesan ketus di chat teks) — kosakata C1 favorit!',
  },
  // ===========================================================================
  // Level C1 — UNIT 9 (GP-EN-C1-009)
  // ===========================================================================
  'en-us-c1-u9-kosakata': {
    headline: 'Membuka Kalimat dengan Predikat Terdepan (*Predicate Fronting*)',
    subtitle: 'Penulis esai C1 menghubungkan kalimat sebelumnya dengan kalimat baru secara mulus melalui pengedepanan sifat atau lokasi penting sebelum subjek panjang.',
    items: [
      {
        symbol: 'Crucial to this transition is...',
        reading: '/ˈkruːʃəl tə ðɪs trænˈzɪʃən ɪz/',
        meaning: 'Hal yang krusial bagi transisi ini adalah... (diikuti subjek tunggal)',
        mnemonic: 'Kata kerja \'is/are\' ditentukan oleh kata benda SESUDAHNYA, bukan oleh frasa di depannya!',
        speakText: 'Crucial to this transition is...',
      },
      {
        symbol: 'Equally pressing are...',
        reading: '/ˈiːkwəli ˈprɛsɪŋ ɑːr/',
        meaning: 'Yang sama mendesaknya adalah... (diikuti subjek jamak)',
        mnemonic: 'Transisi paragraf kebijakan yang sangat elegan untuk memperkenalkan kumpulan tantangan kedua.',
        speakText: 'Equally pressing are...',
      },
      {
        symbol: 'at the heart of',
        reading: '/æt ðə hɑːrt ʌv/',
        meaning: 'Pada jantung / inti terdalam dari suatu persoalan atau perdebatan',
        mnemonic: 'Sering dikedepankan: \'At the heart of the dispute lies a disagreement over patent royalties\'.',
        speakText: 'at the heart of',
      },
      {
        symbol: 'paramount to',
        reading: '/ˈpærəˌmaʊnt tuː/',
        meaning: 'Paling utama / menduduki prioritas tertinggi bagi...',
        mnemonic: 'Tingkat formalitas di atas \'very important\': \'Paramount to grid stability is battery storage\'.',
        speakText: 'paramount to',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-009',
      title: 'Mengedepankan Fokus & Membalik Urutan Subjek (\'Crucial to this is...\')',
      formula: '[Kata Sifat / V-ing / Keterangan Tempat] + be / kata kerja tanpa objek + [Deferred Subject]',
      formulaReading: 'Crucial to this effort is (+ Singular N) • Equally vital are (+ Plural N)',
      explanation: 'Saat predikat kata sifat, partisip, atau keterangan tempat dikedepankan untuk menjaga alur informasi lama-ke-baru (*given-to-new information flow*), posisi kata kerja dan subjek dibalik. Pastikan keselarasan tunggal/jamak mengikuti subjek yang muncul di BELAKANG kata kerja!',
      examples: [
        {
          jp: 'Crucial to semiconductor sovereignty is a reliable domestic supply of ultrapure neon.',
          reading: '/ˈkruːʃəl tə ˌsɛmikənˈdʌktər ˈsɑːvrənti ɪz ə rɪˈlaɪəbəl dəˈmɛstɪk səˈplaɪ ʌv ˈʌltrəˌpjʊr ˈniːɑːn/',
          id: 'Hal yang krusial bagi kedaulatan semikonduktor adalah pasokan domestik neon ultra-murni yang andal.',
        },
        {
          jp: 'Equally pressing are the workforce shortages across regional water utilities.',
          reading: '/ˈiːkwəli ˈprɛsɪŋ ɑːr ðə ˈwɜːrkˌfɔːrs ˈʃɔːrtɪdʒɪz əˈkrɔːs ˈriːdʒənəl ˈwɔːtər juːˈtɪlətiz/',
          id: 'Yang sama mendesaknya adalah kekurangan tenaga kerja di berbagai perusahaan air minum daerah.',
        },
      ],
    },
    contrastiveTip: 'Jebakan nomor satu ujian bahasa Inggris tingkat lanjut: melihat kata jamak tepat sebelum \'is/are\' padahal itu objek kata depan! (\'Central to these reforms IS a new tax code\' — subjeknya \'a new tax code\', tunggal!).',
  },
  'en-us-c1-u9-tata-bahasa': {
    headline: 'Keseimbangan Struktur Mutlak (*Strict Parallelism*) & Demonstratif Pembanding',
    subtitle: 'Kalimat panjang pada penulisan esai bahasa Inggris dan publikasi jurnal runtuh jika unsur yang disejajarkan berbeda kelas katanya atau membandingkan apel dengan pohon apel.',
    items: [
      {
        symbol: 'not only in X, but also in Y',
        reading: '/nɑːt ˈoʊnli ɪn ... bʌt ˈɔːlsoʊ ɪn/',
        meaning: 'Tidak hanya dalam X, tetapi juga dalam Y (kata depan wajib sejajar!)',
        mnemonic: 'Jika \'not only\' mendahului \'in\', maka \'but also\' WAJIB mendahului \'in\' juga!',
        speakText: 'not only in X, but also in Y',
      },
      {
        symbol: 'that of / those of',
        reading: '/ðæt ʌv ... ðoʊz ʌv/',
        meaning: 'Milik / tingkat dari... (kata ganti penunjuk pembanding tunggal vs. jamak)',
        mnemonic: 'Jangan membandingkan \'Indonesia\'s GDP\' langsung dengan \'Malaysia\'; bandingkan dengan \'THAT OF Malaysia\'!',
        speakText: 'that of / those of',
      },
      {
        symbol: 'whether by V-ing or by V-ing',
        reading: '/ˈwɛðər baɪ ... ɔːr baɪ/',
        meaning: 'Baik dengan cara ... maupun dengan cara ... (korelatif simetris)',
        mnemonic: 'Pasangan \'whether\' adalah \'or\' (bukan \'and\'), dengan bentuk V-ing yang kembar.',
        speakText: 'whether by V-ing or by V-ing',
      },
      {
        symbol: 'neither X nor Y',
        reading: '/ˈniːðər ... nɔːr/',
        meaning: 'Bukan X maupun Y (kata kerja mengikuti subjek terdekat dengan \'nor\')',
        mnemonic: 'Dalam US English, \'neither\' lazim dilafalkan /ˈniːðər/.',
        speakText: 'neither X nor Y',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-009',
      title: 'Correlative Parallelism & Comparative Demonstratives (\'that of / those of\')',
      formula: 'both [Prep + NP] and [Prep + NP] • [Property] of A is higher than that of B (singular) / those of B (plural)',
      formulaReading: 'The thermal efficiency of silicon carbide exceeds that of conventional silicon.',
      explanation: 'Dua kaidah emas tata bahasa C1: (1) Apa pun bentuk gramatikal sesudah bagian pertama kata hubung berpasangan (*both...and, either...or, not only...but also*), bentuk identik wajib muncul sesudah bagian kedua; (2) Saat membandingkan atribut suatu benda, gunakan \'that of\' (atribut tunggal) atau \'those of\' (atribut jamak) agar perbandingan logis.',
      examples: [
        {
          jp: 'Success depends not on how much data we collect, but on how cleanly we label it.',
          reading: '/səkˈsɛs dɪˈpɛndz nɑːt ɑːn haʊ mʌtʃ ˈdeɪtə wi kəˈlɛkt bʌt ɑːn haʊ ˈkliːnli wi ˈleɪbəl ɪt/',
          id: 'Keberhasilan bergantung bukan pada seberapa banyak data yang kita kumpulkan, melainkan pada seberapa bersih kita melabelinya.',
        },
        {
          jp: 'Operating margins at cloud-native banks rival those of legacy lenders.',
          reading: '/ˈɑːpəˌreɪtɪŋ ˈmɑːrdʒɪnz æt klaʊd ˈneɪtɪv bæŋks ˈraɪvəl ðoʊz ʌv ˈlɛɡəsi ˈlɛndərz/',
          id: 'Margin operasional di bank berbasis cloud menyaingi margin milik pemberi pinjaman konvensional.',
        },
      ],
    },
    contrastiveTip: 'Cek cepat paralelisme: kurung bagian sebelum korelatif pertama sebagai batang bersama, lalu pastikan cabang A dan cabang B dapat menempel mulus ke batang tersebut!',
  },
  'en-us-c1-u9-diskusi-toefl': {
    headline: 'Menyeimbangkan Dua Dimensi Argumen secara Elegan',
    subtitle: 'Gunakan konstruksi penyeimbang C1 untuk menunjukkan pemikiran sistemik dalam diskusi kelas & forum akademik dan wawancara LPDP/Fulbright.',
    items: [
      {
        symbol: 'as much a matter of X as of Y',
        reading: '/æz mʌtʃ ə ˈmætər ʌv ... æz ʌv/',
        meaning: 'Sama besarnya merupakan persoalan X sebagaimana persoalan Y',
        mnemonic: 'Menunjukkan kedewasaan analisis bahwa suatu masalah tidak berdimensi tunggal.',
        speakText: 'as much a matter of X as of Y',
      },
      {
        symbol: 'strike a delicate balance between',
        reading: '/straɪk ə ˈdɛlɪkət ˈbæləns bɪˈtwiːn/',
        meaning: 'Mencapai titik keseimbangan yang peka di antara dua kepentingan yang bersaing',
        mnemonic: 'Wajib diikuti \'between A AND B\' (jangan \'between A to B\'!).',
        speakText: 'strike a delicate balance between',
      },
      {
        symbol: 'stem not from X, but from Y',
        reading: '/stɛm nɑːt frʌm ... bʌt frʌm/',
        meaning: 'Berakar/bersumber bukan dari X, melainkan dari Y',
        mnemonic: 'Mengarahkan ulang diagnosis akar masalah secara tajam dan paralel.',
        speakText: 'stem not from X, but from Y',
      },
      {
        symbol: 'in tandem with',
        reading: '/ɪn ˈtændəm wɪð/',
        meaning: 'Berjalan beriringan / serempak dan saling menguatkan dengan',
        mnemonic: 'Seperti sepeda tandem dua pengayuh: kebijakan teknologi harus bekerja serempak dengan pelatihan guru.',
        speakText: 'in tandem with',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-009',
      title: 'Balanced Diagnostic Framing (\'as much X as Y\' / \'between A and B\')',
      formula: '[Issue] is as much a matter of [NP A] as of [NP B] • strike a balance between [V-ing A] and [V-ing B]',
      formulaReading: 'Cybersecurity is as much a matter of human habits as of encryption.',
      explanation: 'Dalam rubrik penulisan esai bahasa Inggris (skor 5/5), penguji mencari bukti variasi struktur kalimat yang matang. Membingkai argumen dengan struktur keseimbangan simetris membuktikan bahwa Anda mampu mengelola dua ide abstrak sekaligus tanpa kalimat terpecah.',
      examples: [
        {
          jp: 'Broadband adoption is as much a matter of affordability as of tower coverage.',
          reading: '/ˈbrɔːdˌbænd əˈdɑːpʃən ɪz æz mʌtʃ ə ˈmætər ʌv əˌfɔːrdəˈbɪləti æz ʌv ˈtaʊər ˈkʌvərɪdʒ/',
          id: 'Adopsi pita lebar sama besarnya merupakan persoalan keterjangkauan harga sebagaimana jangkauan menara.',
        },
        {
          jp: 'Central banks must strike a delicate balance between taming inflation and preserving jobs.',
          reading: '/ˈsɛntrəl bæŋks mʌst straɪk ə ˈdɛlɪkət ˈbæləns bɪˈtwiːn ˈteɪmɪŋ ɪnˈfleɪʃən ænd prɪˈzɜːrvɪŋ dʒɑːbz/',
          id: 'Bank sentral harus mencapai keseimbangan peka antara menjinakkan inflasi dan menjaga lapangan kerja.',
        },
      ],
    },
    contrastiveTip: 'Hati-hati interferensi Bahasa Indonesia \'antara A sampai/dengan B\': dalam bahasa Inggris standar, \'between\' SELALU berpasangan dengan \'and\' (\'between A and B\'), sedangkan \'from\' berpasangan dengan \'to\'!',
  },
  // ===========================================================================
  // Level C1 — UNIT 10 (GP-EN-C1-010)
  // ===========================================================================
  'en-us-c1-u10-kosakata': {
    headline: 'Menyambung Ide Tanpa Mengulang Kata yang Sama',
    subtitle: 'Penutur C1 menghindari menyalin ulang frasa kerja panjang di kalimat kedua; mereka menggantinya secara presisi dengan perangkat substitusi formal.',
    items: [
      {
        symbol: 'do so / doing so',
        reading: '/duː soʊ ... ˈduːɪŋ soʊ/',
        meaning: 'Melakukan tindakan tersebut (menggantikan seluruh predikat kata kerja aksi + objek sebelumnya)',
        mnemonic: 'Jauh lebih formal dan jernih daripada \'do it\' dalam esai bahasa Inggris, dokumen teknis, dan kontrak.',
        speakText: 'do so / doing so',
      },
      {
        symbol: 'if so, ... / if not, ...',
        reading: '/ɪf soʊ ... ɪf nɑːt/',
        meaning: 'Jika demikian, ... / jika tidak demikian, ... (menggantikan seluruh bagian kalimat syarat)',
        mnemonic: 'Memangkas 8–12 kata pengulangan menjadi dua kata transisi yang sangat tajam!',
        speakText: 'if so, ... / if not, ...',
      },
      {
        symbol: 'the former ... the latter',
        reading: '/ðə ˈfɔːrmər ... ðə ˈlætər/',
        meaning: 'Yang disebut pertama ... yang disebut kedua/terakhir (dari DUA rujukan)',
        mnemonic: 'Ingat aturan ketat: HANYA gunakan \'former/latter\' jika rujukannya tepat DUA hal (untuk >=3 hal gunakan \'the first / the last\')!',
        speakText: 'the former ... the latter',
      },
      {
        symbol: 'follow suit',
        reading: '/ˈfɑːloʊ suːt/',
        meaning: 'Mengikuti langkah / meniru kebijakan pihak yang bergerak lebih dulu',
        mnemonic: 'Berasal dari permainan kartu (mengeluarkan jenis daun kartu yang sama); sangat populer di analisis ekonomi.',
        speakText: 'follow suit',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-010',
      title: 'Verbal & Clausal Substitution (\'do so / doing so / if not\')',
      formula: '[Kalimat 1: Action Verb + Obj]. Those who do so... / Doing so + V • [Question/Condition]? If so, X; if not, Y.',
      formulaReading: 'Firms may defer tax payments; those choosing to do so must file Form 89.',
      explanation: 'Substitusi \'do so\' (beserta bentuk waktu \'did so / done so / doing so\') merujuk kembali pada kata kerja DINAMIS beserta pelengkapnya. Jangan gunakan \'do so\' untuk menggantikan kata kerja keadaan (kata kerja keadaan seperti *know, own, resemble*)!',
      examples: [
        {
          jp: 'The team wanted to retire the old system, and by year-end they finally did so.',
          reading: '/ˌɛndʒəˈnɪrz ˈwɑːntɪd tə ˈdɛprəˌkeɪt ðə viː wʌn ˈɛndˌpɔɪnt ænd ɪn kjuː fɔːr ðeɪ ˈfaɪnəli dɪd soʊ/',
          id: 'Para insinyur ingin memensiunkan titik akhir v1, dan pada kuartal keempat mereka akhirnya melakukannya.',
        },
        {
          jp: 'Verify whether the token has expired; if so, trigger a silent refresh.',
          reading: '/ˈvɛrəˌfaɪ ˈwɛðər ðə ˈtoʊkən hæz ɪkˈspaɪərd ɪf soʊ ˈtrɪɡər ə ˈsaɪlənt rɪˈfrɛʃ/',
          id: 'Periksa apakah token telah kedaluwarsa; jika demikian, picu pembaruan senyap.',
        },
      ],
    },
    contrastiveTip: 'Bedakan \'doing so\' (melakukan aksi di kalimat sebelumnya) vs. \'to do so\' (untuk melakukan aksi tersebut): \'We compressed payloads; doing so cut egress bills by 40%\'.',
  },
  'en-us-c1-u10-tata-bahasa': {
    headline: 'Seni Memangkas Kata Berulang Tanpa Kehilangan Makna',
    subtitle: 'Pahami kapan kalimat bahasa Inggris mengizinkan penghilangan kata kerja sesudah kata bantu, \'to\' tereduksi, dan bagian kalimat opini \'so / not\'.',
    items: [
      {
        symbol: 'I believe so / I suspect not',
        reading: '/aɪ bɪˈliːv soʊ ... aɪ səˈspɛkt nɑːt/',
        meaning: 'Saya kira demikian / saya duga tidak demikian (substitusi bagian kalimat opini)',
        mnemonic: 'Kata kerja seperti \'believe, think, suppose, expect\' memakai \'don\'t think so\' ATAU sangat formal \'I believe not / suspect not\'; \'hope\' & \'guess\' SELALU memakai \'I hope not / I guess not\'!',
        speakText: 'I believe so / I suspect not',
      },
      {
        symbol: 'can—and indeed must—[V1]',
        reading: '/kæn ænd ɪnˈdiːd mʌst/',
        meaning: 'Bisa—dan memang wajib—[melakukan sesuatu] (pemangkasan kata kerja berulang)',
        mnemonic: 'Karena kedua modal (\'can\' dan \'must\') sama-sama diikuti V1 murni, kata kerja utamanya cukup disebut SATU kali di akhir!',
        speakText: 'can—and indeed must—[V1]',
      },
      {
        symbol: 'opt not to',
        reading: '/ɑːpt nɑːt tuː/',
        meaning: 'Memilih untuk tidak melakukannya (bentuk ringkas berakhir pada \'to\')',
        mnemonic: 'Menyisakan partikel \'to\' di akhir (\'wanted to migrate, but decided not to\') terdengar jauh lebih alami daripada mengulang seluruh kalimat.',
        speakText: 'Many guests opted not to stay late.',
      },
      {
        symbol: 'if any / if ever',
        reading: '/ɪf ˈɛni ... ɪf ˈɛvər/',
        meaning: 'Kalaupun ada (sangat sedikit) / kalaupun pernah terjadi (sangat jarang)',
        mnemonic: 'Bagian kalimat ringkas tanpa kata berulang yang sangat padat: \'Few, if any, startups survive without product-market fit\'.',
        speakText: 'if any / if ever',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-010',
      title: 'Memangkas Kata Kerja yang Sama dengan Kata Bantu & \'If any / If ever\'',
      formula: 'Compatible Aux: can and must + V1 • Incompatible Aux: has [V3], and will continue to, [V1] -> WAJIB sebut V3 dulu!',
      formulaReading: 'Few, if any, clinical trials achieve 100% retention.',
      explanation: 'Waspadai jebakan pemangkasan kata kerja setelah kata bantu berbeda tuntutan! Anda BOLEH menulis \'Cities can, and should, electrify buses\' (keduanya diikuti V1 \'electrify\'). Namun Anda DILARANG menulis *\'Our lab has, and always will, publish open code\'* karena \'has\' menuntut V3 (\'published\') sedangkan \'will\' menuntut V1 (\'publish\')—yang benar: \'Our lab has published, and always will publish, open code\'!',
      examples: [
        {
          jp: 'Few, if any, archival manuscripts survive tropical humidity without climate control.',
          reading: '/fjuː ɪf ˈɛni ɑːrˈkaɪvəl ˈmænjəˌskrɪpts sərˈvaɪv ˈtrɑːpɪkəl hjuːˈmɪdəti wɪˈðaʊt ˈklaɪmət kənˈtroʊl/',
          id: 'Sangat sedikit, kalaupun ada, manuskrip arsip yang bertahan dari kelembapan tropis tanpa pengatur suhu.',
        },
        {
          jp: 'Asked whether inflation had peaked, the governor replied, \'We certainly hope so, though energy risks remain.\'',
          reading: '/æskt ˈwɛðər ɪnˈfleɪʃən hæd piːkt ðə ˈɡʌvərnər rɪˈplaɪd wi ˈsɜːrtənli hoʊp soʊ/',
          id: 'Ditanya apakah inflasi telah mencapai puncaknya, gubernur menjawab, \'Kami tentu berharap demikian, meski risiko energi tetap ada.\'',
        },
      ],
    },
    contrastiveTip: 'Ingat aturan mutlak \'hope\': jangan pernah mengatakan *\'I don\'t hope so\'*! Untuk harapan negatif, bahasa Inggris wajib memakai \'I hope not\'.',
  },
  'en-us-c1-u10-diskusi-toefl': {
    headline: 'Merangkai Argumen Lisan & Esai Tanpa Kalimat Bertele-tele',
    subtitle: 'Gunakan kata penyambung ide tingkat lanjut untuk memadatkan paragraf penutup esai bahasa Inggris, wawancara LPDP/Fulbright, dan tinjauan pustaka.',
    items: [
      {
        symbol: 'in doing so,',
        reading: '/ɪn ˈduːɪŋ soʊ/',
        meaning: 'Dalam proses melakukan hal tersebut, / sembari melakukannya,',
        mnemonic: 'Menghubungkan tindakan kalimat pertama dengan dampak sekundernya secara mulus di awal kalimat kedua.',
        speakText: 'in doing so,',
      },
      {
        symbol: 'and vice versa',
        reading: '/ænd ˈvaɪs ˈvɜːrsə/',
        meaning: 'Dan begitu pula sebaliknya (arah hubungan A->B berlaku pula untuk B->A)',
        mnemonic: 'Di US English lazim diucapkan dua suku kata pada kata pertama: /ˈvaɪs ˈvɜːrsə/ (atau /ˈvaɪsə ˈvɜːrsə/).',
        speakText: 'and vice versa',
      },
      {
        symbol: 'to that end,',
        reading: '/tə ðæt ɛnd/',
        meaning: 'Demi mencapai tujuan tersebut, (transisi dari visi ke langkah konkret)',
        mnemonic: 'Pembuka kalimat tindakan strategis favorit di Statement of Purpose beasiswa S2/S3!',
        speakText: 'to that end,',
      },
      {
        symbol: 'by the same logic,',
        reading: '/baɪ ðə seɪm ˈlɑːdʒɪk/',
        meaning: 'Dengan penalaran yang sama, (memperluas prinsip ke kasus sejajar)',
        mnemonic: 'Menjaga alur argumen yang runtut tanpa mengulang premis dari awal.',
        speakText: 'by the same logic,',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C1-010',
      title: 'Kata Penyambung Rujukan Ide (\'To that end,\' / \'In doing so,\' / \'and vice versa\')',
      formula: '[Goal Statement]. To that end, S + V. • [Action Statement]. In doing so, S + V.',
      formulaReading: 'Soil microbes nourish roots, and vice versa.',
      explanation: 'Alur tulisan yang mulus tidak dicapai dengan menumpuk *Moreover, Furthermore, In addition* di setiap kalimat, melainkan dengan penunjuk anaforis (*anaphoric reference*) seperti \'To that end\', \'In doing so\', dan \'Such measures\' yang menjahit makna antarkalimat secara organik.',
      examples: [
        {
          jp: 'Our ministry aims to halve maternal mortality by 2030; to that end, we are equipping rural midwives with portable ultrasound.',
          reading: '/ˈaʊər ˈmɪnɪstri eɪmz tə hæv məˈtɜːrnəl mɔːrˈtæləti baɪ ˈtwɛnti ˈθɜːrti tə ðæt ɛnd wi ɑːr ɪˈkwɪpɪŋ/',
          id: 'Kementerian kami menargetkan memangkas separuh angka kematian ibu pada 2030; demi tujuan itu, kami membekali bidan desa dengan USG portabel.',
        },
        {
          jp: 'The coral polyps shelter photosynthetic algae, which in doing so supply ninety percent of the reef\'s energy.',
          reading: '/ðə ˈkɔːrəl ˈpɑːlɪps ˈʃɛltər ˌfoʊtoʊsɪnˈθɛtɪk ˈældʒiː wɪtʃ ɪn ˈduːɪŋ soʊ səˈplaɪ ˈnaɪnti pərˈsɛnt/',
          id: 'Polip karang melindungi alga fotosintetik, yang dalam prosesnya memasok sembilan puluh persen energi terumbu.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan huruf \'l\' bisu pada kata kerja \'halve\' (/hæv/, memangkas jadi separuh) dan kata benda \'half\' (/hæf/)!',
  },
  // ===========================================================================
  // Level C2 — UNIT 1 (GP-EN-C2-001)
  // ===========================================================================
  'en-us-c2-u1-kosakata': {
    headline: 'Pengandaian Kontingensi Resmi dengan \'Should + Subject + V1\'',
    subtitle: 'Dalam kontrak komersial, pengumuman penerbangan, dan rapat dewan direksi AS, \'If X happens\' digantikan oleh \'Should X happen\' untuk memberi kesan terukur dan berwibawa.',
    items: [
      {
        symbol: 'Should the board approve...',
        reading: '/ʃʊd ðə bɔːrd əˈpruːv/',
        meaning: 'Apabila dewan direksi menyetujui... (setara \'If the board should approve\')',
        mnemonic: 'Kata kerja sesudah subjek WAJIB bentuk dasar murni (V1 tanpa -s/-ed), bahkan untuk subjek tunggal!',
        speakText: 'Should the board approve...',
      },
      {
        symbol: 'contingency plan',
        reading: '/kənˈtɪndʒənsi plæn/',
        meaning: 'Rencana cadangan terstruktur untuk mengantisipasi skenario darurat',
        mnemonic: 'Selalu berpasangan alami dengan \'Should + S + V1\' dalam tata kelola risiko.',
        speakText: 'contingency plan',
      },
      {
        symbol: 'ripple effect',
        reading: '/ˈrɪpəl ɪˈfɛkt/',
        meaning: 'Efek riak berantai yang menjalar luas dari satu guncangan awal',
        mnemonic: 'Seperti batu jatuh ke danau tenang: gangguan satu pelabuhan memicu riak ke seluruh rantai pasok.',
        speakText: 'ripple effect',
      },
      {
        symbol: 'preemptively',
        reading: '/priˈɛmptɪvli/',
        meaning: 'Secara mendahului / melakukan pencegahan sebelum ancaman sempat terjadi',
        mnemonic: 'Kata keterangan strategis untuk tindakan antisipatif sebelum krisis pecah.',
        speakText: 'preemptively',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-001',
      title: 'Pengandaian Resmi Tanpa \'If\' (Pakai \'Should\') (\'Should + Subject + Base Verb\')',
      formula: 'Should + [Subject] + (not) + [Base Verb V1], [Kalimat Utama: will / perintah / modal]',
      formulaReading: 'Should latency exceed 200ms, the gateway routes traffic to Tokyo.',
      explanation: 'Menghapus \'if\' dan memindahkan \'Should\' ke awal kalimat mengubah syarat biasa menjadi protokol kontingensi profesional (\'apabila sewaktu-waktu terjadi\'). Ingat dua pantangan mutlak: (1) kata kerja utama tetap V1 murni tanpa \'-s\' (*\'Should the server fails\'* -> SALAH), dan (2) bentuk negatif TIDAK BOLEH disingkat (*\'Shouldn\'t you agree\'* -> SALAH; tulis \'Should you not agree\')!',
      examples: [
        {
          jp: 'Should negotiations stall this Friday, our legal team will file for arbitration.',
          reading: '/ʃʊd nɪˌɡoʊʃiˈeɪʃənz stɔːl ðɪs ˈfraɪdeɪ ˈaʊər ˈliːɡəl tiːm wɪl faɪl fɔːr ˌɑːrbəˈtreɪʃən/',
          id: 'Apabila perundingan menemui jalan buntu Jumat ini, tim hukum kami akan mengajukan arbitrase.',
        },
        {
          jp: 'Should the sensor not respond within three seconds, reboot the controller.',
          reading: '/ʃʊd ðə ˈsɛnsər nɑːt rɪˈspɑːnd wɪˈðɪn θriː ˈsɛkəndz riːˈbuːt ðə kənˈtroʊlər/',
          id: 'Apabila sensor tidak merespons dalam tiga detik, mulai ulang pengendalinya.',
        },
      ],
    },
    contrastiveTip: 'Jangan terjebak menambahkan \'-s\' pada subjek tunggal sesudah pembalikan urutan \'Should\': tulis \'Should the minister resign\' (BUKAN *\'resigns\'*) karena \'Should\' adalah modal verb!',
  },
  'en-us-c2-u1-tata-bahasa': {
    headline: 'Pengandaian Elit Tipe 2 (\'Were + S + to V1\') & Tipe 3 (\'Had + S + V3\')',
    subtitle: 'Tinggalkan \'If we had known\' dan \'If it failed\' saat menulis paragraf evaluasi tingkat C2—gunakan kalimat pengandaian ringkas tanpa \'if\' yang padat dan berkelas editorial.',
    items: [
      {
        symbol: 'Were the dam to breach,',
        reading: '/wɜːr ðə dæm tə briːtʃ/',
        meaning: 'Seandainya bendungan tersebut jebol (hipotesis kecil kemungkinannya / dramatis)',
        mnemonic: '\'Were + Subject + to V1\' menggantikan \'If + S + Past Verb\' untuk aksi hipotetis masa depan/kini!',
        speakText: 'Were the dam to breach,',
      },
      {
        symbol: 'Were it not for...',
        reading: '/wɜːr ɪt nɑːt fɔːr/',
        meaning: 'Seandainya saat ini bukan karena [faktor penyelamat]... (Tipe 2 masa kini)',
        mnemonic: 'Setara \'But for X\' untuk kondisi yang masih berlangsung hari ini!',
        speakText: 'Were it not for...',
      },
      {
        symbol: 'Had we anticipated...',
        reading: '/hæd wi ænˈtɪsəˌpeɪtɪd/',
        meaning: 'Seandainya dulu kami telah mengantisipasi... (kontrafaktual Tipe 3)',
        mnemonic: 'Menghapus \'if\' dan membalik \'we had\' menjadi \'Had we + V3\'.',
        speakText: 'Had we anticipated...',
      },
      {
        symbol: 'Had it not been for...',
        reading: '/hæd ɪt nɑːt bɪn fɔːr/',
        meaning: 'Seandainya dulu bukan karena [faktor penyelamat masa lalu]... (Tipe 3 lampau)',
        mnemonic: 'INGAT: Dilarang keras menyingkat menjadi *\'Hadn\'t it been for\'*!',
        speakText: 'Had it not been for...',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-001',
      title: 'Inverted Type-2 (\'Were + S + to V1\') & Type-3 (\'Had + S + V3\')',
      formula: 'Type 2 State: Were + S + [Adj/NP] • Type 2 Action: Were + S + to V1 • Type 3: Had + S + (not) + V3',
      formulaReading: 'Were it not for subsidies, fares would double. • Had they patched early, the breach would not have occurred.',
      explanation: 'Perhatikan perbedaan krusial Tipe 2: jika kata kerjanya berupa \'be\', cukup balikkan menjadi \'Were the market larger,...\' (pakai \'Were\' untuk SEMUA subjek termasuk \'it/he/she\'). Namun jika kata kerjanya berupa AKSI (\'collapse, withdraw, fail\'), Anda WAJIB menyisipkan \'to + V1\': \'Were the sponsor to withdraw,...\' (BUKAN *\'Were the sponsor withdraw\'*)!',
      examples: [
        {
          jp: 'Were major insurers to exit coastal Florida, mortgage markets would freeze.',
          reading: '/wɜːr ˈmeɪdʒər ɪnˈʃʊrərz tə ˈɛɡzɪt ˈkoʊstəl ˈflɔːrɪdə ˈmɔːrɡɪdʒ ˈmɑːrkɪts wʊd friːz/',
          id: 'Seandainya perusahaan asuransi besar angkat kaki dari pesisir Florida, pasar KPR pasti membeku.',
        },
        {
          jp: 'Had it not been for rapid genomic sequencing, the variant would have spread undetected.',
          reading: '/hæd ɪt nɑːt bɪn fɔːr ˈræpɪd dʒɪˈnoʊmɪk ˈsiːkwənsɪŋ ðə ˈvɛriənt wʊd həv sprɛd ˌʌndɪˈtɛktɪd/',
          id: 'Seandainya dulu bukan karena pengurutan genomik cepat, varian tersebut pasti telah menyebar tanpa terdeteksi.',
        },
      ],
    },
    contrastiveTip: 'Hafalkan kontras waktu kembar ini: \'Were it not for X, S would V1\' (situasi SEKARANG) vs. \'Had it not been for X, S would have V3\' (kejadian MASA LALU)!',
  },
  'en-us-c2-u1-diskusi-toefl': {
    headline: 'Membingkai Skenario Makro dalam Sidang Tesis, Debat Kebijakan & Esai Tingkat Mahir',
    subtitle: 'Padukan pengandaian terbalik dengan kosakata ekonomi-politik C2 untuk menjawab pertanyaan spekulatif *\'What would happen if...?\'* dengan wibawa penuh.',
    items: [
      {
        symbol: 'Were that to transpire,',
        reading: '/wɜːr ðæt tə trænˈspaɪər/',
        meaning: 'Seandainya hal tersebut benar-benar terjadi, (transisi skenario lanjutan)',
        mnemonic: '\'Transpire\' dalam bahasa Inggris formal berarti \'terjadi / terungkap\', menggantikan \'happen\' yang terlalu datar.',
        speakText: 'Were that to transpire,',
      },
      {
        symbol: 'insulate [X] from [shocks]',
        reading: '/ˈɪnsəˌleɪt ... frʌm/',
        meaning: 'Melindungi / menyekat [sistem/ekonomi] agar kebal dari guncangan luar',
        mnemonic: 'Metafora termal/listrik yang menjadi kosakata inti bank sentral dan arsitektur sistem.',
        speakText: 'insulate [X] from [shocks]',
      },
      {
        symbol: 'spillover effect',
        reading: '/ˈspɪlˌoʊvər ɪˈfɛkt/',
        meaning: 'Dampak limpahan (positif maupun negatif) yang meluber ke wilayah atau sektor lain',
        mnemonic: 'Sangat sering keluar di latihan membaca & mendengarkan ekonomi serta ekologi!',
        speakText: 'spillover effect',
      },
      {
        symbol: 'untenable',
        reading: '/ʌnˈtɛnəbəl/',
        meaning: 'Mustahil dipertahankan lagi secara logis, finansial, atau moral',
        mnemonic: '\'An untenable position / fiscal path\' = posisi/jalur yang cepat atau lambat pasti runtuh.',
        speakText: 'untenable',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-001',
      title: 'Pengandaian Resmi Campuran & Penyambung Alur (\'Were that to transpire,\')',
      formula: 'Past Action -> Present State: Had + S + V3 [then], S + would be [today] • Chained Hypothesis: Were that to transpire, ...',
      formulaReading: 'Had the treaty been ratified in 1997, global emissions trajectories would look markedly different today.',
      explanation: 'Menggabungkan Pengandaian Resmi Tanpa \'If\' dengan *Mixed Time Reference* (\'Had we invested then, our grid would be resilient today\') adalah puncak penguasaan tata bahasa waktu dan modalitas bahasa Inggris.',
      examples: [
        {
          jp: 'Had urban planners preserved tram corridors in the 1960s, commuter congestion would be far milder today.',
          reading: '/hæd ˈɜːrbən ˈplænərz prɪˈzɜːrvd træm ˈkɔːrɪdɔːrz ɪn ðə ˈnaɪntiːn ˈsɪkstiz kəˈmjuːtər kənˈdʒɛstʃən wʊd bi fɑːr ˈmaɪldər təˈdeɪ/',
          id: 'Seandainya perencana kota mempertahankan koridor trem pada era 1960-an, kemacetan komuter pasti jauh lebih ringan hari ini.',
        },
        {
          jp: 'Were sovereign defaults to cluster, regional spillover effects would prove untenable.',
          reading: '/wɜːr ˈsɑːvrən dɪˈfɔːlts tə ˈklʌstər ˈriːdʒənəl ˈspɪlˌoʊvər ɪˈfɛkts wʊd pruːv ʌnˈtɛnəbəl/',
          id: 'Seandainya gagal bayar utang negara terjadi beruntun, dampak limpahan regionalnya akan terbukti tak tertahankan.',
        },
      ],
    },
    contrastiveTip: 'Selalu periksa penanda waktu ujung kalimat (\'today / now\' vs. \'in 2020 / last night\') sebelum menentukan apakah induk kalimatnya memakai \'would V1\' atau \'would have V3\'!',
  },
  // ===========================================================================
  // Level C2 — UNIT 2 (GP-EN-C2-002)
  // ===========================================================================
  'en-us-c2-u2-kosakata': {
    headline: 'Instruksi Otoritatif & Agenda Resmi dengan \'am / is / are + to V1\'',
    subtitle: 'Alih-alih menulis \'must\' berulang kali, dokumen kebijakan pemerintah, SOP keselamatan, dan siaran pers kenegaraan menggunakan \'be + to V1\' yang dingin dan tak terbantahkan.',
    items: [
      {
        symbol: 'are to comply with',
        reading: '/ɑːr tə kəmˈplaɪ wɪð/',
        meaning: 'Diwajibkan mematuhi sepenuhnya (mandat kelembagaan resmi)',
        mnemonic: '\'All contractors are to comply with ISO 27001\' terdengar jauh lebih berwibawa daripada \'have to comply\'.',
        speakText: 'are to comply with',
      },
      {
        symbol: 'is not to be disclosed',
        reading: '/ɪz nɑːt tə bi dɪsˈkloʊzd/',
        meaning: 'Sama sekali tidak boleh dibocorkan / diungkapkan (larangan pasif mutlak)',
        mnemonic: 'Kalimat klasik pada sampul dokumen embargo pers dan akuisisi korporat!',
        speakText: 'is not to be disclosed',
      },
      {
        symbol: 'in strict accordance with',
        reading: '/ɪn strɪkt əˈkɔːrdəns wɪð/',
        meaning: 'Sesuai secara ketat dan persis dengan (pasal/protokol resmi)',
        mnemonic: 'Pasangan idiom hukum yang sering mendampingi \'be + to V1\'.',
        speakText: 'in strict accordance with',
      },
      {
        symbol: 'take effect',
        reading: '/teɪk ɪˈfɛkt/',
        meaning: 'Mulai berlaku secara resmi dan mengikat secara hukum',
        mnemonic: 'Untuk jadwal resmi yang sudah ditetapkan: \'The tariff is to take effect on January 1\'.',
        speakText: 'take effect',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-002',
      title: 'Authoritative Mandates & Scheduled Protocol (\'be + to V1 / to be V3\')',
      formula: 'Mandate/Schedule: [Subject] + am/is/are + (not) + to V1 • Passive Prohibition: [Subject] + is/are not + to be V3',
      formulaReading: 'All visitors are to wear dosimeters. • Embargoed data is not to be shared prior to 9 a.m. EST.',
      explanation: 'Konstruksi \'be + to-bentuk \'to + V1\'\' mengemban dua fungsi formal utama di masa kini: (1) menyatakan jadwal kenegaraan/korporat yang telah dikunci (\'The summit is to convene in Geneva\'), dan (2) menyampaikan perintah atau larangan aturan yang tidak membuka ruang tawar-menawar (\'No raw patient identifiers are to leave this enclave\').',
      examples: [
        {
          jp: 'Under the consent decree, all third-party brokers are to purge biometric records within thirty days.',
          reading: '/ˈʌndər ðə kənˈsɛnt dɪˈkriː ɔːl ˈθɜːrd ˈpɑːrti ˈbroʊkərz ɑːr tə pɜːrdʒ ˌbaɪoʊˈmɛtrɪk ˈrɛkərdz/',
          id: 'Berdasarkan keputusan persetujuan hukum tersebut, seluruh pialang pihak ketiga wajib menghapus catatan biometrik dalam tiga puluh hari.',
        },
        {
          jp: 'Draft earnings slides are not to be circulated outside the audit committee.',
          reading: '/dræft ˈɜːrnɪŋz slaɪdz ɑːr nɑːt tə bi ˈsɜːrkjəˌleɪtɪd ˌaʊtˈsaɪd ði ˈɔːdɪt kəˈmɪti/',
          id: 'Salindia draf laporan laba dilarang keras diedarkan di luar komite audit.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan gaya berita utama koran AS (*headlinese*): kata \'is/are\' sering dilesapkan dari \'is to V1\' menjadi langsung \'Central Bank to Hold Rates\' (= \'The Central Bank is to hold rates\')!',
  },
  'en-us-c2-u2-tata-bahasa': {
    headline: 'Prasyarat Tujuan (\'If we are to...\') & Masa Depan dari Sudut Lampau (\'was to V1\')',
    subtitle: 'Dua nuansa C2 yang sangat sering diujikan di bacaan artikel panjang sejarah dan esai kebijakan: menyatakan syarat mutlak demi mencapai visi, serta menarasikan takdir sejarah.',
    items: [
      {
        symbol: 'If [S] is to [achieve Goal],',
        reading: '/ɪf ... ɪz tuː/',
        meaning: 'Jika [Subjek] memang ingin berhasil mencapai [Tujuan besar], maka...',
        mnemonic: 'Setara \'In order for S to achieve Goal\': menuntut kata bantu kuat (\'must / need to\') di bagian utama kalimat!',
        speakText: 'If [S] is to [achieve Goal],',
      },
      {
        symbol: 'was soon to become',
        reading: '/wʌz suːn tə bɪˈkʌm/',
        meaning: 'Kelak tak lama kemudian akan menjadi... (*future-in-the-past* yang benar-benar terjadi)',
        mnemonic: 'Favorit mutlak penulis biografi dan teks sejarah bacaan artikel panjang!',
        speakText: 'was soon to become',
      },
      {
        symbol: 'was never to return',
        reading: '/wʌz ˈnɛvər tə rɪˈtɜːrn/',
        meaning: 'Ditakdirkan tidak akan pernah kembali lagi (fakta sejarah yang dramatis)',
        mnemonic: 'Berbeda dari \'would\', \'was never to V1\' menyiratkan kepastian sejarah yang telah tercatat.',
        speakText: 'was never to return',
      },
      {
        symbol: 'was to have [V3]',
        reading: '/wʌz tə həv/',
        meaning: 'Tadinya dijadwalkan akan [melakukan sesuatu], TETAPI batal terlaksana!',
        mnemonic: 'Perhatikan bentuk \'to have + V3\' \'was to HAVE opened\': menandakan rencana resmi masa lalu yang GAGAL terjadi!',
        speakText: 'was to have [V3]',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-002',
      title: 'Goal-Condition (\'If + S + be + to V1\') & Historical Fate (\'was/were to V1\' vs \'to have V3\')',
      formula: 'Prerequisite: If + S + am/is/are + to V1, S + must + V1 • Realized Fate: was/were + to V1 • Unfulfilled Plan: was/were + to have V3',
      formulaReading: 'If ASEAN is to lead green manufacturing, grids must interconnect. • The treaty was to have been signed in May, but talks collapsed.',
      explanation: 'Cermati kontras tajam antara \'was to V1\' dan \'was to have V3\' di teks sejarah tingkat C2! \'The telegraph cable was to transform diplomacy\' berarti kabel itu KELAK BENAR-BENAR mengubah diplomasi. Sebaliknya, \'The expedition was to have reached the pole by June\' berarti ekspedisi itu TADINYA DIRENCANAKAN mencapai kutub pada bulan Juni, namun KENYATAANNYA GAGAL!',
      examples: [
        {
          jp: 'If universities are to remain engines of mobility, need-blind aid must expand.',
          reading: '/ɪf ˌjuːnəˈvɜːrsətiz ɑːr tə rɪˈmeɪn ˈɛndʒɪnz ʌv moʊˈbɪləti ˈniːd blaɪnd eɪd mʌst ɪkˈspænd/',
          id: 'Jika universitas memang ingin tetap menjadi mesin mobilitas sosial, bantuan finansial tanpa pandang kemampuan bayar wajib diperluas.',
        },
        {
          jp: 'The 1914 peace conference was to have convened in Vienna, before war intervened.',
          reading: '/ðə ˈnaɪntiːn fɔːrˈtiːn piːs ˈkɑːnfərəns wʌz tə həv kənˈviːnd ɪn viˈɛnə bɪˈfɔːr wɔːr ˌɪntərˈviːnd/',
          id: 'Konferensi perdamaian 1914 tadinya dijadwalkan bersidang di Wina, sebelum perang keburu pecah.',
        },
      ],
    },
    contrastiveTip: 'Rumus cepat bacaan artikel panjang: lihat \'was/were to + V1\' -> kelak terjadi dalam sejarah; lihat \'was/were to + HAVE V3\' -> rencana resmi yang batal/gagal terjadi!',
  },
  'en-us-c2-u2-diskusi-toefl': {
    headline: 'Kosakata Transisi Sejarah & Visi Kepemimpinan C2',
    subtitle: 'Perkaya respons lisan dan esai Anda saat mengulas bagaimana suatu inovasi atau kebijakan melahirkan era baru.',
    items: [
      {
        symbol: 'usher in [a new era]',
        reading: '/ˈʌʃər ɪn/',
        meaning: 'Mengantarkan masuk / membuka gerbang bagi dimulainya suatu babak baru',
        mnemonic: 'Kata kerja sejarah dan inovasi yang jauh lebih hidup daripada \'start a new era\'.',
        speakText: 'usher in [a new era]',
      },
      {
        symbol: 'come to fruition',
        reading: '/kʌm tə fruˈɪʃən/',
        meaning: 'Membuahkan hasil nyata setelah perjuangan atau perencanaan panjang',
        mnemonic: 'Berasal dari kata \'fruit\' (berbuah): \'Years of R&D finally came to fruition\'.',
        speakText: 'come to fruition',
      },
      {
        symbol: 'embark upon',
        reading: '/ɪmˈbɑːrk əˈpɑːn/',
        meaning: 'Memulai suatu perjalanan, reformasi, atau proyek berskala besar dan menantang',
        mnemonic: 'Jangan pakai untuk hal sepele (*\'embark upon eating lunch\'* -> terlalu berlebihan untuk situasi santai); gunakan untuk riset/transformasi besar!',
        speakText: 'embark upon',
      },
      {
        symbol: 'watershed moment',
        reading: '/ˈwɔːtərˌʃɛd ˈmoʊmənt/',
        meaning: 'Momen titik balik bersejarah yang memisahkan cara lama dan cara baru secara permanen',
        mnemonic: 'Secara geografis, punggung bukit pemisah aliran sungai; secara historis, momen penentu arah zaman.',
        speakText: 'watershed moment',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-002',
      title: 'Inverting \'Were + S + to V1\' with Purpose \'If + S + be + to V1\'',
      formula: 'Vision Framing: If we are to usher in [Goal], we must embark upon [Action] today.',
      formulaReading: 'That obscure 1947 lab demo was to usher in the solid-state revolution.',
      explanation: 'Mengombinasikan kosakata titik balik (\'watershed moment\', \'usher in\', \'come to fruition\') dengan struktur \'be + to-bentuk \'to + V1\'\' memberikan bobot retoris tingkat pidato kunci (*keynote address*) dan esai beasiswa paling kompetitif.',
      examples: [
        {
          jp: 'Bell Labs\' 1947 point-contact transistor was to usher in the information age.',
          reading: '/bɛl læbz ˈnaɪntiːn ˈfɔːrti ˈsɛvən pɔɪnt ˈkɑːntækt trænˈzɪstər wʌz tə ˈʌʃər ɪn ði ˌɪnfərˈmeɪʃən eɪdʒ/',
          id: 'Transistor kontak-titik Bell Labs tahun 1947 kelak membuka gerbang bagi era informasi.',
        },
        {
          jp: 'If this blueprint is to come to fruition, provincial agencies must align permitting.',
          reading: '/ɪf ðɪs ˈbluːˌprɪnt ɪz tə kʌm tə fruˈɪʃən prəˈvɪnʃəl ˈeɪdʒənsiz mʌst əˈlaɪn pərˈmɪtɪŋ/',
          id: 'Jika cetak biru ini memang ingin membuahkan hasil nyata, dinas-dinas provinsi wajib menyelaraskan perizinan.',
        },
      ],
    },
    contrastiveTip: 'Lafalkan \'fruition\' dengan tiga suku kata jelas: /fruˈɪʃən/ (fru-ISH-uhn)!',
  },
  // ===========================================================================
  // Level C2 — UNIT 3 (GP-EN-C2-003)
  // ===========================================================================
  'en-us-c2-u3-kosakata': {
    headline: 'Ungkapan Absolut Idiomatis dalam Ekonomi, Sains & Rapat Eksekutif',
    subtitle: 'Berbeda dari frasa V-ing/V3 biasa, konstruksi absolut membawa SUBJEKNYA SENDIRI di depan partisip sehingga sah berdiri mendampingi induk kalimat bersubjek berbeda!',
    items: [
      {
        symbol: 'Other things being equal,',
        reading: '/ˈʌðər θɪŋz ˈbiːɪŋ ˈiːkwəl/',
        meaning: 'Dengan asumsi seluruh variabel lain tetap sama (*ceteris paribus*)',
        mnemonic: 'Ungkapan nomor satu di kuliah ekonomi, sains, dan kesehatan!',
        speakText: 'Other things being equal,',
      },
      {
        symbol: 'Weather permitting,',
        reading: '/ˈwɛðər pərˈmɪtɪŋ/',
        meaning: 'Jika kondisi cuaca mengizinkan / mendukung,',
        mnemonic: 'Subjeknya \'Weather\' + partisip aktif \'permitting\', sedangkan induk kalimatnya bersubjek tim/kapal/pesawat!',
        speakText: 'Weather permitting,',
      },
      {
        symbol: 'All things considered,',
        reading: '/ɔːl θɪŋz kənˈsɪdərd/',
        meaning: 'Setelah menimbang seluruh faktor secara menyeluruh,',
        mnemonic: 'Subjek \'All things\' + partisip pasif \'considered\': pembuka kesimpulan berimbang tingkat eksekutif.',
        speakText: 'All things considered,',
      },
      {
        symbol: 'That being said,',
        reading: '/ðæt ˈbiːɪŋ sɛd/',
        meaning: 'Meskipun hal itu benar, / namun demikian, (transisi kualifikasi halus)',
        mnemonic: 'Jembatan transisi lisan dan tulisan paling populer di ruang kerja profesional Amerika.',
        speakText: 'That being said,',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-003',
      title: 'Fixed & Semi-Fixed Absolute Phrases (\'Other things being equal,\')',
      formula: '[Independent Noun] + [V-ing / V3], [Kalimat Utama (Subjek Berbeda)]',
      formulaReading: 'Time permitting, we will review year-end plans. • All else being equal, higher rates slow borrowing.',
      explanation: 'Pada level B2 Anda belajar bahwa *\'Walking into the lab, the microscope fell\'* salah (subjek yang tidak nyambung) karena mikroskop tidak punya kaki. Pada level C2, jika dua bagian kalimat memang memiliki subjek berbeda namun Anda ingin memadatkannya tanpa kata sambung \'because/if/after\', sertakan saja subjek pertamanya secara eksplisit: \'Weather permitting, the vessel will depart\' (= If weather permits, the vessel will depart)!',
      examples: [
        {
          jp: 'Other things being equal, shorter supply chains exhibit lower carbon intensity.',
          reading: '/ˈʌðər θɪŋz ˈbiːɪŋ ˈiːkwəl ˈʃɔːrtər səˈplaɪ tʃeɪnz ɪɡˈzɪbɪt ˈloʊər ˈkɑːrbən ɪnˈtɛnsəti/',
          id: 'Dengan asumsi faktor lain tetap sama, rantai pasok yang lebih pendek menunjukkan intensitas karbon yang lebih rendah.',
        },
        {
          jp: 'Regulatory approval permitting, clinical enrollment begins in September.',
          reading: '/ˈrɛɡjəˌleɪtɔːri əˈpruːvəl pərˈmɪtɪŋ ˈklɪnɪkəl ɪnˈroʊlmənt bɪˈɡɪnz ɪn sɛpˈtɛmbər/',
          id: 'Jika persetujuan regulasi mengizinkan, pendaftaran uji klinis dimulai pada bulan September.',
        },
      ],
    },
    contrastiveTip: 'Jangan sisipkan \'is/are\' di dalam kalimat latar ringkas! Tulis \'Other things BEING equal,\' (BUKAN *\'Other things are equal, shorter chains...\'* yang memicu kesalahan *comma splice*)!',
  },
  'en-us-c2-u3-tata-bahasa': {
    headline: 'Meringkas Sebab & Situasi Tanpa Kata Hubung (\'The audit completed,\' / \'With reserves dwindling,\')',
    subtitle: 'Kuasai senjata rahasia penulis *The New Yorker*, *Nature*, dan skor penuh penulisan esai bahasa Inggris: memadatkan bagian kalimat \'Because/Once X happened, Y happened\' menjadi kalimat latar ringkas.',
    items: [
      {
        symbol: 'The audit completed, [S + V]',
        reading: '/ði ˈɔːdɪt kəmˈpliːtɪd/',
        meaning: 'Begitu / karena audit telah rampung, [induk kalimat bergerak maju]',
        mnemonic: '\'The audit\' dielesaikan (pasif -> V3 \'completed\'), lalu disusul koma + subjek induk kalimat.',
        speakText: 'The audit completed, [S + V]',
      },
      {
        symbol: 'Its battery depleted, [the probe...]',
        reading: '/ɪts ˈbætəri dɪˈpliːtɪd/',
        meaning: 'Karena baterainya telah terkuras habis, [wahana antariksa itu...]',
        mnemonic: 'Sangat padat untuk artikel sains: menggantikan \'Because its battery had been depleted,\'.',
        speakText: 'Its battery depleted, [the probe...]',
      },
      {
        symbol: 'With [NP] + V-ing / V3,',
        reading: '/wɪð .../',
        meaning: 'Mengingat / seiring dengan [Subjek] yang sedang V-ing / telah di-V3,',
        mnemonic: 'Menambahkan \'With\' di depan kalimat latar ringkas membuatnya terdengar luwes baik di tulisan maupun bicara!',
        speakText: 'With [NP] + V-ing / V3,',
      },
      {
        symbol: 'Her tenure having expired,',
        reading: '/hɜːr ˈtɛnjər ˈhævɪŋ ɪkˈspaɪərd/',
        meaning: 'Setelah masa jabatannya berakhir, (partisip perfek aktif untuk kata kerja tanpa objek)',
        mnemonic: '\'Expire\' adalah tanpa objek (bukan pasif), sehingga bentuk lampau selesainya adalah \'having expired\'!',
        speakText: 'Her tenure having expired,',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-003',
      title: 'Productive Nominative Absolutes & \'With\'-Augmented Absolutes',
      formula: '(With) + [Subject 1] + [V-ing (active) | V3 (passive) | having V3 | Adj/Prep Phrase], [Subject 2] + [Finite Verb]',
      formulaReading: 'The quorum achieved, the chair called the vote. • With reservoirs shrinking, cities rationed water.',
      explanation: 'Tiga langkah merakit kalimat latar ringkas bebas cacat: (1) Tulis subjek bagian kalimat latar (\'The treaty\' / \'With exports\'); (2) Pilih V-ing jika subjek itu melakukan aksi aktif (\'shrinking / surging\'), ATAU V3 jika subjek itu dikenai aksi pasif (\'ratified / depleted\'); (3) Tutup dengan koma dan pastikan induk kalimat memiliki KATA KERJA UTAMA (finit) yang utuh!',
      examples: [
        {
          jp: 'The merger cleared by antitrust regulators, both boards scheduled integration workshops.',
          reading: '/ðə ˈmɜːrdʒər klɪrd baɪ ˌæntaɪˈtrʌst ˈrɛɡjəˌleɪtərz boʊθ bɔːrdz ˈskɛdʒuːld ˌɪntəˈɡreɪʃən ˈwɜːrkˌʃɑːps/',
          id: 'Setelah merjer disetujui oleh regulator antipakat, kedua dewan menjadwalkan lokakarya integrasi.',
        },
        {
          jp: 'With freight rates tripling overnight, exporters renegotiated delivery terms.',
          reading: '/wɪð freɪt reɪts ˈtrɪplɪŋ ˌoʊvərˈnaɪt ɪkˈspɔːrtərz ˌriːnɪˈɡoʊʃiˌeɪtɪd dɪˈlɪvəri tɜːrmz/',
          id: 'Seiring tarif angkutan kargo melonjak tiga kali lipat dalam semalam, para eksportir menegosiasikan ulang ketentuan pengiriman.',
        },
      ],
    },
    contrastiveTip: 'Waspadai soal jebakan struktur ujian bahasa Inggris tingkat lanjut: *\'The treaty was ratified, delegates celebrated\'* adalah SALAH (*comma splice*: dua kalimat utuh cuma dipisah koma)! Buang \'was\' -> \'The treaty ratified, delegates celebrated\' (BENAR, kalimat latar ringkas)!',
  },
  'en-us-c2-u3-diskusi-toefl': {
    headline: 'Kosakata Perubahan Lanskap, Ekologi & Ekonomi Makro C2',
    subtitle: 'Gunakan kata kerja dan frasa deskriptif bernilai tinggi yang sering muncul di dalam maupun sesudah konstruksi absolut.',
    items: [
      {
        symbol: 'recede',
        reading: '/rɪˈsiːd/',
        meaning: 'Surut / mundur menjauh perlahan (gletser, banjir, ancaman resesi)',
        mnemonic: 'Kata kerja tanpa objek: \'Glaciers receded\' (jangan pernah *\'were receded\'*!).',
        speakText: 'recede',
      },
      {
        symbol: 'in its wake',
        reading: '/ɪn ɪts weɪk/',
        meaning: 'Di belakang jejaknya / sebagai dampak langsung sesudah berlalunya suatu peristiwa besar',
        mnemonic: 'Berasal dari jejak buih air di belakang buritan kapal (\'left widespread reform in its wake\').',
        speakText: 'in its wake',
      },
      {
        symbol: 'set the stage for',
        reading: '/sɛt ðə steɪdʒ fɔːr/',
        meaning: 'Menyiapkan panggung / menciptakan kondisi pendahulu yang memungkinkan terjadinya...',
        mnemonic: 'Sangat kuat merangkum urutan kausalitas sejarah dan biologi evolusioner dalam bahasa Inggris resmi.',
        speakText: 'set the stage for',
      },
      {
        symbol: 'dwindle',
        reading: '/ˈdwɪndəl/',
        meaning: 'Menyusut / menipis sedikit demi sedikit hingga hampir habis (cadangan air, dana, populasi)',
        mnemonic: 'Sering muncul dalam absolut: \'With groundwater reserves dwindling, ...\'.',
        speakText: 'dwindle',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-003',
      title: 'Sentence-Final Descriptive Absolutes (\'..., each + V-ing / V3\')',
      formula: '[Kalimat Utama], [Sub-part Noun / each] + [V-ing / V3 / Prep Phrase]',
      formulaReading: 'The archipelago comprises 17,000 islands, each harboring distinct coastal microclimates.',
      explanation: 'Bagian kalimat absolut tidak hanya diletakkan di AWAL kalimat untuk sebab/waktu, tetapi juga sangat elegan diletakkan di AKHIR kalimat untuk memerinci bagian-bagian tanpa memulai kalimat baru yang patah-patah (\'..., with [X] accounting for 60% and [Y] supplying the rest\').',
      examples: [
        {
          jp: 'Ice sheets retreated northward, leaving fertile glacial lakes in their wake.',
          reading: '/aɪs ʃiːts rɪˈtriːtɪd ˈnɔːrθwərd ˈliːvɪŋ ˈfɜːrtəl ˈɡleɪʃəl leɪks ɪn ðɛr weɪk/',
          id: 'Lapisan es mundur ke utara, meninggalkan danau-danau glasial yang subur di belakang jejaknya.',
        },
        {
          jp: 'Three undersea cables link the hub, each carrying forty terabits per second.',
          reading: '/θriː ˈʌndərˌsiː ˈkeɪbəlz lɪŋk ðə hʌb iːtʃ ˈkæriɪŋ ˈfɔːrti ˈtɛrəbɪts pər ˈsɛkənd/',
          id: 'Tiga kabel bawah laut menghubungkan sentra tersebut, yang masing-masing mengangkut empat puluh terabit per detik.',
        },
      ],
    },
    contrastiveTip: 'Pola \', each + V-ing / V3\' di ujung kalimat adalah cara paling bersih menjelaskan rincian data grafik atau arsitektur sistem di penulisan esai bahasa Inggris!',
  },
  // ===========================================================================
  // Level C2 — UNIT 4 (GP-EN-C2-004)
  // ===========================================================================
  'en-us-c2-u4-kosakata': {
    headline: 'Mengakui Keunggulan Sebelum Mengajukan Kritik Tajam (*Emphatic Concession*)',
    subtitle: 'Pada level C2, Anda tidak lagi selalu mengawali paragraf dengan \'Although X is impressive,\'. Mengangkat kata sifatnya langsung ke depan (\'Impressive though X is,\') langsung memikat pembaca!',
    items: [
      {
        symbol: 'Much as I respect...',
        reading: '/mʌtʃ æz aɪ rɪˈspɛkt/',
        meaning: 'Betapapun besarnya rasa hormat saya terhadap... (= Although I respect X very much,)',
        mnemonic: 'Pembuka sanggahan intelektual paling berkelas di ruang sidang disertasi maupun dewan direksi!',
        speakText: 'Much as I respect...',
      },
      {
        symbol: 'Try as they might,',
        reading: '/traɪ æz ðeɪ maɪt/',
        meaning: 'Sekeras apa pun mereka berusaha mencoba, (tetap saja belum berhasil...)',
        mnemonic: 'Pola \'[Base Verb] + as + [Subject] + may/might,\' melukiskan kegigihan yang terbentur batas nyata.',
        speakText: 'Try as they might,',
      },
      {
        symbol: 'for all its [merits / hype],',
        reading: '/fɔːr ɔːl ɪts/',
        meaning: 'Terlepas dari segala [keunggulan / kehebohannya], (jangan terkecoh menerjemahkan \'untuk semua\'!)',
        mnemonic: 'JEBAKAN ujian bahasa Inggris READING KLASIK: \'For all his wealth, he lived simply\' artinya \'MESKIPUN sangat kaya\', BUKAN \'karena kekayaannya\'!',
        speakText: 'for all its [merits / hype],',
      },
      {
        symbol: 'laudable',
        reading: '/ˈlɔːdəbəl/',
        meaning: 'Patut dipuji / mulia niatnya (sering dipakai sebelum menunjukkan kendala eksekusi)',
        mnemonic: '\'Laudable though the target is, funding remains elusive\' = pujian tulus diikuti realisme tajam.',
        speakText: 'laudable',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-004',
      title: 'Emphatic Concession (\'Much as + S + V\' & \'For all + Kata Kepemilikan + Benda\')',
      formula: 'Much as + [S + V of liking/admiring], [Kalimat Utama] • For all + [its/their + Noun], [Kalimat Utama]',
      formulaReading: 'Much as we welcome automation, human oversight remains vital. • For all its elegance, the proof omits edge cases.',
      explanation: 'Waspadai makna idiomatis \'For all [NP]\' dalam artikel *The Atlantic*, *Foreign Affairs*, dan bacaan artikel panjang: kata depan \'for all\' di awal kalimat berfungsi 100% sebagai KONSESI (\'terlepas dari / kendati memiliki banyak X\'), setara dengan \'Despite all its X\'!',
      examples: [
        {
          jp: 'Much as clinicians admire the model\'s sensitivity, false alarms still fatigue night-shift nurses.',
          reading: '/mʌtʃ æz klɪˈnɪʃənz ədˈmaɪər ðə ˈmɑːdəlz ˌsɛnsəˈtɪvəti fɔːls əˈlɑːrmz stɪl fəˈtiːɡ naɪt ʃɪft ˈnɜːrsɪz/',
          id: 'Betapapun para klinisi mengagumi sensitivitas model tersebut, alarm palsu masih melelahkan perawat giliran malam.',
        },
        {
          jp: 'For all its computational firepower, brute-force simulation cannot replace physical wind tunnels.',
          reading: '/fɔːr ɔːl ɪts ˌkɑːmpjəˈteɪʃənəl ˈfaɪərˌpaʊər ˈbruːt fɔːrs ˌsɪmjəˈleɪʃən ˈkænɑːt rɪˈpleɪs ˈfɪzɪkəl wɪnd ˈtʌnəlz/',
          id: 'Terlepas dari segala daya gedor komputasinya, simulasi paksa tidak dapat menggantikan terowongan angin fisik.',
        },
      ],
    },
    contrastiveTip: 'Ingat: boleh menulis \'Much as I admire...\' atau \'However much I admire...\', tetapi JANGAN menulis *\'Very as I admire\'*!',
  },
  'en-us-c2-u4-tata-bahasa': {
    headline: 'Mengedepankan Predikat Konsesif (\'Compelling though the data is,\')',
    subtitle: 'Kuasai aturan susunan kata yang tepat ketika mengangkat kata sifat, kata keterangan, atau kata benda predikatif ke depan \'as\' atau \'though\'.',
    items: [
      {
        symbol: 'Compelling though the theory is,',
        reading: '/kəmˈpɛlɪŋ ðoʊ ðə ˈθiːəri ɪz/',
        meaning: 'Sekuat / semenarik apa pun teori tersebut, (= Although the theory is compelling,)',
        mnemonic: 'Urutan sesudah \'as/though\' TETAP normal \'Subject + Verb\' (\'the theory is\'), BUKAN *\'is the theory\'*!',
        speakText: 'Compelling though the theory is,',
      },
      {
        symbol: 'Swiftly as the team acted,',
        reading: '/ˈswɪftli æz ðə tiːm ˈæktɪd/',
        meaning: 'Secepat apa pun tim tersebut telah bertindak,',
        mnemonic: 'Kata keterangan cara (\'Swiftly\') dikedepankan mendahului \'as + Subject + Action Verb\'.',
        speakText: 'Swiftly as the team acted,',
      },
      {
        symbol: 'Skeptic though she was,',
        reading: '/ˈskɛptɪk ðoʊ ʃi wʌz/',
        meaning: 'Meskipun ia seorang yang skeptis, (TANPA artikel \'a/an\' saat kata benda dikedepankan!)',
        mnemonic: 'KAIDAH EMAS C2: Kata benda tunggal terhitung melepas artikel \'a/an\' ketika dikedepankan (\'Pioneer though he was\', BUKAN *\'A pioneer though he was\'*)!',
        speakText: 'Skeptic though she was,',
      },
      {
        symbol: 'However [Adj/Adv] + S + V,',
        reading: '/haʊˈɛvər .../',
        meaning: 'Se-[sifat/cara] apa pun Subjek melakukan sesuatu, (setara \'No matter how Adj/Adv\')',
        mnemonic: 'Jangan tertukar \'However, [comma]\' (= namun) dengan \'However sophisticated the cipher is,\' (= secanggih apa pun sandinya)!',
        speakText: 'However [Adj/Adv] + S + V,',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-004',
      title: 'Concessive Fronting Rules (\'Adj + as/though + S + V\' vs \'Although\')',
      formula: 'VALID: [Adj/Adv/Zero-Article Noun] + as / though + [S + V] • INVALID: *[Adj] + although + [S + V]!',
      formulaReading: 'Formidable though the hurdle seemed, engineers cleared it. • Skeptic as he was, the evidence convinced him.',
      explanation: 'Tiga pantangan tata bahasa C2 pada pola \'meskipun\' terbalik: (1) Kata \'although\' TIDAK BISA menggantikan \'as/though\' setelah kata sifat yang dikedepankan (*\'Brilliant although it is\'* -> SALAH TOTAL!); (2) Urutan setelah \'as/though\' adalah S + V normal (\'though the model is\'), bukan V + S; (3) Jika kata benda tunggal dikedepankan, hapus \'a/an\' (\'Master strategist though she was\').',
      examples: [
        {
          jp: 'Ingenious as the passive cooling tower is, peak humidity reduces its efficiency.',
          reading: '/ɪnˈdʒiːnjəs æz ðə ˈpæsɪv ˈkuːlɪŋ ˈtaʊər ɪz piːk hjuːˈmɪdəti rɪˈduːsɪz ɪts ɪˈfɪʃənsi/',
          id: 'Secerdas apa pun rancangan menara pendingin pasif itu, kelembapan puncak tetap menurunkan efisiensinya.',
        },
        {
          jp: 'However meticulously researchers clean ancient DNA, modern contamination remains a hazard.',
          reading: '/haʊˈɛvər məˈtɪkjələsli ˈriːsɜːrtʃərz kliːn ˈeɪnʃənt ˈdiːˈɛnˈeɪ ˈmɑːdərn kənˌtæməˈneɪʃən rɪˈmeɪnz/',
          id: 'Secermat apa pun peneliti membersihkan DNA purba, kontaminasi modern tetap menjadi bahaya.',
        },
      ],
    },
    contrastiveTip: 'Ingat jebakan ujian klasik: \'Brilliant THOUGH / AS the plan is\' = BENAR; *\'Brilliant ALTHOUGH the plan is\'* = SALAH! \'Although\' wajib berada paling depan bagian kalimat!',
  },
  'en-us-c2-u4-diskusi-toefl': {
    headline: 'Menolak Klaim Berlebihan Tanpa Terdengar Sinis (*Nuanced Critique*)',
    subtitle: 'Gunakan ungkapan batas kritis C2 agar tinjauan pustaka, esai bahasa Inggris, dan jawaban sidang Anda terdengar tajam, dewasa, dan seimbang.',
    items: [
      {
        symbol: 'stop short of + V-ing',
        reading: '/stɑːp ʃɔːrt ʌv/',
        meaning: 'Berhenti tepat sebelum melakukan langkah ekstrem / belum sampai pada tahap...',
        mnemonic: '\'The report criticizes governance but stops short of alleging fraud\' = mengkritik tata kelola tanpa sampai menuduh kecurangan!',
        speakText: 'stop short of + V-ing',
      },
      {
        symbol: 'no panacea (for)',
        reading: '/noʊ ˌpænəˈsiːə/',
        meaning: 'Bukan obat mujarab penyembuh segala masalah (menolak solusi tunggal yang disederhanakan)',
        mnemonic: 'Kosakata emas penulisan esai bahasa Inggris untuk menyanggah klaim bahwa satu teknologi bisa menyelesaikan segalanya!',
        speakText: 'no panacea (for)',
      },
      {
        symbol: 'temper enthusiasm (with realism)',
        reading: '/ˈtɛmpər ɪnˈθuːziˌæzəm/',
        meaning: 'Menyeimbangkan / meredam antusiasme berlebih dengan kacamata realisme',
        mnemonic: 'Dari metalurgi (\'tempering steel\' agar tidak getas): menyeimbangkan optimisme dengan kehati-hatian.',
        speakText: 'temper enthusiasm (with realism)',
      },
      {
        symbol: 'a far cry from',
        reading: '/ə fɑːr kraɪ frʌm/',
        meaning: 'Masih sangat jauh berbeda dibandingkan dengan (standar ideal/klaim)',
        mnemonic: 'Idiom tajam dan berkelas untuk menyoroti kesenjangan antara demo laboratorium dan skala industri.',
        speakText: 'a far cry from',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-004',
      title: 'Synthesizing Emphatic Concession with Measured Critique',
      formula: '[Adj] + though [Tech/Policy] is, it remains no panacea for [Systemic Issue]—and is still a far cry from [Ideal].',
      formulaReading: 'Promising as solid-state batteries are, lab cells remain a far cry from mass-market packs.',
      explanation: 'Paragraf evaluasi C2 yang utuh bekerja dalam dua gerak: gerak pertama memberi pengakuan maksimal menggunakan pola \'meskipun\' dengan kata sifat di depan (\'Transformative though AI diagnostics may prove,\'), dan gerak kedua menarik garis batas realistis (\'algorithms alone are no panacea for understaffed clinics\').',
      examples: [
        {
          jp: 'Revolutionary though CRISPR therapies are, billion-dollar price tags remain a far cry from equitable care.',
          reading: '/ˌrɛvəˈluːʃəˌnɛri ðoʊ ˈkrɪspər ˈθɛrəpiz ɑːr ˈbɪljən ˈdɑːlər praɪs tæɡz rɪˈmeɪn ə fɑːr kraɪ frʌm ˈɛkwətəbəl kɛr/',
          id: 'Serevolusioner apa pun terapi CRISPR, label harga miliaran dolar masih sangat jauh dari layanan kesehatan yang merata.',
        },
        {
          jp: 'The central bank signaled vigilance, though it stopped short of pledging an emergency rate hike.',
          reading: '/ðə ˈsɛntrəl bæŋk ˈsɪɡnəld ˈvɪdʒələns ðoʊ ɪt stɑːpt ʃɔːrt ʌv ˈplɛdʒɪŋ ən ɪˈmɜːrdʒənsi reɪt haɪk/',
          id: 'Bank sentral mengisyaratkan kewaspadaan, meski belum sampai menjanjikan kenaikan suku bunga darurat.',
        },
      ],
    },
    contrastiveTip: 'Lafalkan \'panacea\' empat suku kata jelas: /ˌpænəˈsiːə/ (pan-uh-SEE-uh)!',
  },
  // ===========================================================================
  // Level C2 — UNIT 5 (GP-EN-C2-005)
  // ===========================================================================
  'en-us-c2-u5-kosakata': {
    headline: 'Menandai Klaim Pihak Lain Tanpa Ikut Menjamin Kebenarannya (*Evidential Distancing*)',
    subtitle: 'Dalam jurnalisme investigasi AS, opini hukum, dan soal *Author\'s Attitude* di bacaan artikel panjang, satu kata seperti \'purports\' atau \'ostensibly\' langsung menyingkap sikap skeptis penulis!',
    items: [
      {
        symbol: 'purport to + V1',
        reading: '/pərˈpɔːrt tuː/',
        meaning: 'Mengklaim / mengaku seolah-olah mampu melakukan sesuatu (menyiratkan keraguan kuat penulis!)',
        mnemonic: 'Jika latihan bahasa Inggris bertanya \'Why does the author use the word purports?\', jawabannya SELALU: untuk menunjukkan keraguan bahwa klaim itu belum tentu benar!',
        speakText: 'purport to + V1',
      },
      {
        symbol: 'ostensibly',
        reading: '/ɑːˈstɛnsəbli/',
        meaning: 'Secara lahiriah / menurut alasan yang tampak di permukaan (namun motif atau kenyataan aslinya berbeda)',
        mnemonic: '\'Ostensibly built for irrigation, the canal served military logistics\' = alasan luarnya irigasi, fungsi aslinya militer!',
        speakText: 'ostensibly',
      },
      {
        symbol: 'putative',
        reading: '/ˈpjuːtətɪv/',
        meaning: 'Yang selama ini diduga / dianggap umum demikian (meski bukti pastinya belum konklusif)',
        mnemonic: 'Sangat populer di artikel sains & sejarah: \'the putative ancestor of modern birds\'.',
        speakText: 'putative',
      },
      {
        symbol: 'take [a claim] at face value',
        reading: '/teɪk ... æt feɪs ˈvæljuː/',
        meaning: 'Menelan mentah-mentah suatu klaim sesuai tampilan luarnya tanpa menguji kebenarannya',
        mnemonic: 'Peneliti C2 TIDAK menerima angka pemasaran vendor \'at face value\'!',
        speakText: 'take [a claim] at face value',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-005',
      title: 'Lexical Evidentiality & Authorial Skepticism (\'purport to\' / \'ostensibly\')',
      formula: '[Subject] + purports to + V1 (skeptical claim) • Ostensibly + [Surface Claim], [Actual Reality]',
      formulaReading: 'The supplement purports to reverse cellular aging, yet double-blind trials show no effect.',
      explanation: 'Soal *Rhetorical Purpose & Attitude* tersulit di ujian bahasa Inggris internasional menguji apakah Anda peka terhadap penanda jarak bukti (*evidential markers*). Kata \'demonstrate / establish\' menandakan penulis SETUJU bukti kuat; kata \'suggest / indicate\' bersifat netral; sedangkan \'purport to / ostensibly / putative / so-called\' menandakan penulis SKEPTIS terhadap klaim tersebut!',
      examples: [
        {
          jp: 'The browser extension purports to anonymize traffic while quietly harvesting browsing histories.',
          reading: '/ðə ˈbraʊzər ɪkˈstɛnʃən pərˈpɔːrts tə əˈnɑːnəˌmaɪz ˈtræfɪk waɪl ˈkwaɪətli ˈhɑːrvəstɪŋ ˈbraʊzɪŋ ˈhɪstəriz/',
          id: 'Ekstensi peramban tersebut mengklaim menganonimkan lalu lintas padahal diam-diam memanen riwayat penjelajahan.',
        },
        {
          jp: 'Ostensibly designed to protect small savers, the fee cap drove micro-lenders out of rural districts.',
          reading: '/ɑːˈstɛnsəbli dɪˈzaɪnd tə prəˈtɛkt smɔːl ˈseɪvərz ðə fiː kæp droʊv ˈmaɪkroʊ ˈlɛndərz aʊt ʌv ˈrʊrəl ˈdɪstrɪkts/',
          id: 'Meski di permukaan dirancang untuk melindungi penabung kecil, batas biaya itu justru mengusir lembaga keuangan mikro dari distrik pedesaan.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan tekanan kata kerja \'purport\' jatuh pada suku kata KEDUA (/pərˈpɔːrt/), dan selalu diikuti \'to + V1\'!',
  },
  'en-us-c2-u5-tata-bahasa': {
    headline: 'Menyebutkan Dugaan/Laporan Masa Lalu & Sekarang (\'is alleged to have V3\')',
    subtitle: 'Dalam berita hukum AS dan artikel sejarah, kata kerja pelaporan tetap Present (\'is believed / is alleged\'), sedangkan waktu terjadinya klaim dikodekan secara presisi di dalam bentuk \'to + V1\' sesudahnya!',
    items: [
      {
        symbol: 'is alleged to have [V3]',
        reading: '/ɪz əˈlɛdʒd tə həv/',
        meaning: 'Diduga (saat ini oleh jaksa/pihak lain) TELAH melakukan [aksi di masa lalu]',
        mnemonic: 'Perhatikan lafal \'alleged\' hanya DUA suku kata: /əˈlɛdʒd/ (uh-LEJD, BUKAN *uh-lej-id*)!',
        speakText: 'is alleged to have [V3]',
      },
      {
        symbol: 'is thought to have been [V3]',
        reading: '/ɪz θɔːt tə həv bɪn/',
        meaning: 'Diperkirakan para ahli TELAH di-[pasif] pada masa lampau',
        mnemonic: 'Bentuk \'to have been + V3\' (pasif lampau): \'The fresco is thought to have been painted in 1460\'!',
        speakText: 'is thought to have been [V3]',
      },
      {
        symbol: 'is rumored to be [V-ing]',
        reading: '/ɪz ˈruːmərd tə bi/',
        meaning: 'Dikabarkan SEDANG melakukan [proses yang berlangsung detik/minggu ini]',
        mnemonic: 'Bentuk \'to be + V-ing\' (sedang berlangsung) mengunci makna kejadian yang sedang berjalan saat berita diturunkan.',
        speakText: 'is rumored to be [V-ing]',
      },
      {
        symbol: 'appears to have [V3]',
        reading: '/əˈpɪrz tə həv/',
        meaning: 'Tampaknya (berdasarkan bukti fisik sekarang) telah mengalami/melakukan [kejadian lampau]',
        mnemonic: 'Sangat objektif untuk laporan evaluasi masalah teknis dan analisis forensik ilmiah!',
        speakText: 'appears to have [V3]',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-005',
      title: 'Evidential Passive Matrix (Simple, Progressive, Perfect & Passive-Perfect Infinitives)',
      formula: '[S] + is said/thought/alleged + { to V1 (umum) | to be V-ing (sedang) | to have V3 (lampau aktif) | to have been V3 (lampau pasif) }',
      formulaReading: 'The manuscript is believed to have been forged in the 1890s.',
      explanation: 'Kuasai empat pola waktu dengan \'to\' sesudah \'is believed / alleged / reported / estimated\': (1) Keadaan kini/rutin -> \'to hold reserves\'; (2) Sedang berlangsung sekarang -> \'to be negotiating a merger\'; (3) Aksi lampau oleh subjek -> \'to have siphoned funds\'; (4) Aksi lampau yang dialami subjek secara pasif -> \'to have been forged\'!',
      examples: [
        {
          jp: 'The threat group is alleged to have exfiltrated source code via a compromised VPN appliance.',
          reading: '/ðə θrɛt ɡruːp ɪz əˈlɛdʒd tə həv ˈɛksfɪlˌtreɪtɪd sɔːrs koʊd ˈvaɪə ə ˈkɑːmprəˌmaɪzd ˈviːˈpiːˈɛn əˈplaɪəns/',
          id: 'Kelompok ancaman tersebut diduga telah mencuri keluar kode sumber melalui perangkat VPN yang tersusupi.',
        },
        {
          jp: 'Domesticated cacao is now thought to have been cultivated in the upper Amazon 5,000 years ago.',
          reading: '/dəˈmɛstɪˌkeɪtɪd kəˈkaʊ ɪz naʊ θɔːt tə həv bɪn ˈkʌltəˌveɪtɪd ɪn ði ˈʌpər ˈæməˌzɑːn faɪv ˈθaʊzənd jɪrz əˈɡoʊ/',
          id: 'Kakao budidaya kini diperkirakan telah dibudidayakan di hulu Amazon 5.000 tahun silam.',
        },
      ],
    },
    contrastiveTip: 'Cek aktif vs. pasif di ujung bentuk \'to have + V3\': \'monks copied the scroll\' -> \'the scroll is believed TO HAVE BEEN COPIED\' (jangan lupa \'been\' jika subjeknya benda mati yang dikenai tindakan!).',
  },
  'en-us-c2-u5-diskusi-toefl': {
    headline: 'Mengkritik Kualitas Bukti secara Ilmiah dalam Tinjauan Sejawat (*Peer Review*)',
    subtitle: 'Gunakan kosakata penilaian bukti tingkat C2 saat mengevaluasi kelemahan studi di esai bahasa Inggris, tesis, dan komite investasi.',
    items: [
      {
        symbol: 'a paucity of [evidence / data]',
        reading: '/ə ˈpɔːsəti ʌv/',
        meaning: 'Kelangkaan / sangat minimnya jumlah bukti atau data yang memadai',
        mnemonic: 'Kata benda C2 super-elegan pengganti \'a lack / shortage of\': \'a paucity of longitudinal trials\'.',
        speakText: 'a paucity of [evidence / data]',
      },
      {
        symbol: 'uncorroborated',
        reading: '/ˌʌnkəˈrɑːbəˌreɪtɪd/',
        meaning: 'Belum didukung atau diperkuat oleh sumber independen kedua',
        mnemonic: 'Kesaksian tunggal tanpa bukti silang dalam hukum maupun sejarah disebut \'uncorroborated testimony\'.',
        speakText: 'uncorroborated',
      },
      {
        symbol: 'warrant caution',
        reading: '/ˈwɔːrənt ˈkɔːʃən/',
        meaning: 'Menuntut / membenarkan perlunya sikap ekstra hati-hati sebelum menyimpulkan',
        mnemonic: 'Ungkapan penutup tinjauan metodologi paling halus dan berbobot!',
        speakText: 'warrant caution',
      },
      {
        symbol: 'anecdotal at best',
        reading: '/ˌænɪkˈdoʊtəl æt bɛst/',
        meaning: 'Paling banter baru sebatas cerita pengalaman lepas (bukan bukti statistik terkontrol)',
        mnemonic: 'Sangat tajam untuk membedakan testimoni kasuistik dari bukti uji acak terkontrol (*RCT*).',
        speakText: 'anecdotal at best',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-005',
      title: 'Methodological Critique Framing (\'Given the paucity of..., claims warrant caution\')',
      formula: 'Given the paucity of [Independent Data], [Putative Claims] remain anecdotal at best and warrant caution.',
      formulaReading: 'Given a paucity of baseline cores, claims of sudden collapse warrant caution.',
      explanation: 'Menggabungkan kata benda \'a paucity of [X]\', kata sifat \'uncorroborated / anecdotal at best\', dan predikat \'warrant caution\' memungkinkan Anda meruntuhkan argumen lemah tanpa satu pun kata emosional atau kasar.',
      examples: [
        {
          jp: 'Given a paucity of multi-year follow-up data, claims of permanent remission warrant caution.',
          reading: '/ˈɡɪvən ə ˈpɔːsəti ʌv ˈmʌlti jɪr ˈfɑːloʊ ʌp ˈdeɪtə kleɪmz ʌv ˈpɜːrmənənt rɪˈmɪʃən ˈwɔːrənt ˈkɔːʃən/',
          id: 'Mengingat minimnya data pemantauan multi-tahun, klaim kesembuhan permanen menuntut sikap hati-hati.',
        },
        {
          jp: 'Until independent labs replicate the superconductor, the preprint\'s assertions remain uncorroborated.',
          reading: '/ʌnˈtɪl ˌɪndɪˈpɛndənt læbz ˈrɛplɪˌkeɪt ðə ˌsuːpərkənˈdʌktər ðə ˈpriːˌprɪnts əˈsɜːrʃənz rɪˈmeɪn ˌʌnkəˈrɑːbəˌreɪtɪd/',
          id: 'Sampai laboratorium independen berhasil mereplikasi superkonduktor tersebut, klaim pracetak itu tetap belum terkonfirmasi silang.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan artikel pada \'a paucity of\': sama seperti \'a lack of\', kata \'paucity\' hampir selalu didahului artikel \'a\' (\'a paucity of reliable records\')!',
  },
  // ===========================================================================
  // Level C2 — UNIT 6 (GP-EN-C2-006)
  // ===========================================================================
  'en-us-c2-u6-kosakata': {
    headline: 'Empat Ungkapan Klasik Resmi yang Hidup di Puncak Eksekutif',
    subtitle: 'Bahasa Inggris modern menyimpan sejumlah ungkapan baku dengan \'be\' atau V1 tanpa \'-s\' yang memberi wibawa luar biasa dalam transisi debat dan penulisan opini.',
    items: [
      {
        symbol: 'Be that as it may,',
        reading: '/biː ðæt æz ɪt meɪ/',
        meaning: 'Terlepas dari benar atau tidaknya hal tersebut, / biarpun demikian,',
        mnemonic: 'Transisi berwibawa untuk menutup perdebatan masa lalu dan mengajak rapat fokus ke keputusan ke depan.',
        speakText: 'Be that as it may,',
      },
      {
        symbol: 'Suffice it to say (that)...',
        reading: '/səˈfaɪs ɪt tə seɪ/',
        meaning: 'Cukuplah dikatakan bahwa... (tanpa perlu membeberkan detail sensitif/panjang lebar)',
        mnemonic: 'Perhatikan lafal kata kerja \'suffice\' berakhiran /s/ tajam (/səˈfaɪs/), dan bentuknya \'Suffice\' tanpa \'-s\'!',
        speakText: 'Suffice it to say (that)...',
      },
      {
        symbol: 'Come what may,',
        reading: '/kʌm wʌt meɪ/',
        meaning: 'Apa pun yang kelak terjadi, / badai apa pun yang menghadang,',
        mnemonic: 'Komitmen ketangguhan jangka panjang (\'Come what may, customer deposits remain fully backed\').',
        speakText: 'Come what may,',
      },
      {
        symbol: 'Far be it from me to...',
        reading: '/fɑːr biː ɪt frʌm miː tuː/',
        meaning: 'Sama sekali bukan maksud saya untuk menggurui/mengkritik..., (tetapi...)',
        mnemonic: 'Pembuka *rhetorical modesty* yang sangat halus sebelum menyampaikan koreksi tajam!',
        speakText: 'Far be it from me to...',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-006',
      title: 'Fixed Formulaic pola anjuran V1 murnis (\'Be that as it may\' / \'Suffice it to say\')',
      formula: 'Be that as it may, [Kalimat Utama] • Suffice it to say (that) + [S + V] • Far be it from [Obj] to + V1',
      formulaReading: 'Be that as it may, our deadline stands. • Suffice it to say, the audit uncovered gaps.',
      explanation: 'Ungkapan ungkapan baku klasik bersifat beku (*frozen idioms*): jangan pernah mengubah \'Be\' menjadi \'Is\', atau \'Suffice\' menjadi *\'Suffices\'*! Mengubah satu huruf saja langsung merusak kealamian ungkapan di telinga penutur asli.',
      examples: [
        {
          jp: 'Supplier delays hurt spring sales; be that as it may, we must finish the safety update tonight.',
          reading: '/ˈvɛndər dɪˈleɪz hɜːrt kjuː tuː biː ðæt æz ɪt meɪ wi mʌst ʃɪp ðə sɪˈkjʊrəti pætʃ təˈnaɪt/',
          id: 'Keterlambatan pemasok memang merugikan penjualan; biarpun demikian, kita wajib menyelesaikan pembaruan keamanan malam ini.',
        },
        {
          jp: 'NDA rules bar specifics, so suffice it to say that due diligence ended abruptly.',
          reading: '/ˈɛnˈdiːˈeɪ ruːlz bɑːr spəˈsɪfɪks soʊ səˈfaɪs ɪt tə seɪ ðæt ˈduː ˈdɪlədʒəns ˈɛndɪd əˈbrʌptli/',
          id: 'Aturan kerahasiaan melarang rincian, jadi cukuplah dikatakan bahwa uji tuntas berakhir mendadak.',
        },
      ],
    },
    contrastiveTip: 'Jangan menulis *\'It suffices to say\'* jika Anda mengincar keanggunan ungkapan klasik berkelas \'Suffice it to say (that)...\'!',
  },
  'en-us-c2-u6-tata-bahasa': {
    headline: 'Konsesi Alternatif Produktif (\'Be it urban or rural\') & Ketegasan Sikap (\'So be it\')',
    subtitle: 'Tidak seperti idiom beku lainnya, struktur \'Be it [A] or [B]\' bersifat PRODUKTIF: Anda dapat mengisinya dengan kata benda, kata sifat, atau frasa kata depan apa pun di esai bahasa Inggris!',
    items: [
      {
        symbol: 'be it [X] or [Y]',
        reading: '/biː ɪt ... ɔːr/',
        meaning: 'Baik itu berupa [X] maupun [Y] (= whether it is X or Y)',
        mnemonic: 'Gunakan \'be it\' untuk rujukan tunggal/abstrak, dan \'be they\' jika merujuk langsung ke benda jamak (\'be they startups or conglomerates\')!',
        speakText: 'be it [X] or [Y]',
      },
      {
        symbol: 'If..., so be it.',
        reading: '/soʊ biː ɪt/',
        meaning: 'Jika memang harus demikian konsekuensinya, terjadilah / kami siap menerimanya.',
        mnemonic: 'Penutup kalimat penerimaan konsekuensi prinsipil yang sangat kuat.',
        speakText: 'If..., so be it.',
      },
      {
        symbol: 'Heaven forbid (that) S + V1',
        reading: '/ˈhɛvən fərˈbɪd/',
        meaning: 'Jangan sampai terjadi bahwa... (harapan kuat mencegah skenario buruk)',
        mnemonic: 'Diikuti pola V1 murni V1 murni: \'Heaven forbid that a dam fail during peak monsoon\'.',
        speakText: 'Heaven forbid (that) S + V1',
      },
      {
        symbol: 'as it were',
        reading: '/æz ɪt wɜːr/',
        meaning: 'Kalau boleh diibaratkan demikian / seakan-akan (pelunak metafora C2)',
        mnemonic: 'Berasal dari \'as if it were\': diselipkan dengan koma saat memakai perumpamaan figuratif!',
        speakText: 'as it were',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-006',
      title: 'Pola \'Be it A or B\' (Baik A Maupun B) (\'be it A or B\' / \'be they A or B\')',
      formula: '[Main Statement], be it + [Singular NP / Adj / Prep Phrase A] or [B] • ..., be they + [Plural NP A] or [B]',
      formulaReading: 'Every dataset carries bias, be it clinical, financial, or linguistic.',
      explanation: 'Struktur \'be it X or Y\' memangkas bagian kalimat \'whether it happens to be X or Y\' menjadi sisipan penjelas yang tajam dan berirama. Jika kata benda induknya jamak (\'All hospitals, be they public or private,...\'), sesuaikan kata gantinya menjadi \'be they\'!',
      examples: [
        {
          jp: 'No essential service—be it payments, login, or messaging—may launch without safety checks.',
          reading: '/noʊ ˈkrɪtɪkəl ˈsɜːrvɪs biː ɪt ˈpeɪmənts aɪˈdɛntəti ɔːr ˈmɛsɪdʒɪŋ meɪ dɪˈplɔɪ wɪˈðaʊt kəˈnɛri tʃɛks/',
          id: 'Tidak satu pun layanan kritis—baik pembayaran, identitas, maupun perpesanan—boleh dirilis tanpa pemeriksaan kenari.',
        },
        {
          jp: 'Central banks act as the market\'s shock absorber, as it were, during liquidity panics.',
          reading: '/ˈsɛntrəl bæŋks ækt æz ðə ˈmɑːrkɪts ʃɑːk əbˈzɔːrbər æz ɪt wɜːr ˈdʊrɪŋ lɪˈkwɪdəti ˈpænɪks/',
          id: 'Bank sentral bertindak sebagai peredam kejut pasar, kalau boleh diibaratkan demikian, saat terjadi kepanikan likuiditas.',
        },
      ],
    },
    contrastiveTip: 'Cek keselarasan jumlah: \'Every applicant, BE HE OR SHE domestic or international\' / \'Every institution, BE IT large or small\' vs. \'All institutions, BE THEY large or small\'!',
  },
  'en-us-c2-u6-diskusi-toefl': {
    headline: 'Menyatakan Keberatan Resmi & Catatan Risalah Rapat Tingkat Pimpinan',
    subtitle: 'Lengkapi khazanah pidato formal Anda dengan ungkapan keberatan terukur dan transisi risalah resmi.',
    items: [
      {
        symbol: 'take exception to',
        reading: '/teɪk ɪkˈsɛpʃən tuː/',
        meaning: 'Menyatakan keberatan tegas / tidak terima terhadap suatu klaim atau asumsi yang keliru',
        mnemonic: 'Jauh lebih tajam dan formal daripada \'disagree with\': \'I must take strong exception to that characterization\'.',
        speakText: 'take exception to',
      },
      {
        symbol: 'Needless to say,',
        reading: '/ˈniːdləs tə seɪ/',
        meaning: 'Tak perlu diragukan/dikatakan lagi, (fakta yang sudah jelas disepakati bersama)',
        mnemonic: 'Gunakan hemat hanya untuk hal yang benar-benar jelas konsekuensinya!',
        speakText: 'Needless to say,',
      },
      {
        symbol: 'let the record reflect (that)',
        reading: '/lɛt ðə ˈrɛkərd rɪˈflɛkt/',
        meaning: 'Mohon dicatat secara resmi di dalam risalah rapat/sidang bahwa...',
        mnemonic: 'Ungkapan hukum dan tata kelola direksi AS saat anggota dewan ingin mencatatkan posisi resminya.',
        speakText: 'let the record reflect (that)',
      },
      {
        symbol: 'in no uncertain terms',
        reading: '/ɪn noʊ ʌnˈsɜːrtən tɜːrmz/',
        meaning: 'Dengan bahasa yang sangat gamblang, lugas, dan tanpa keraguan sedikit pun',
        mnemonic: 'Litotes ganda (no + uncertain = 100% tegas): \'warned vendors in no uncertain terms\'.',
        speakText: 'in no uncertain terms',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-006',
      title: 'Gaya Bahasa Resmi saat Rapat & Sidang (\'take exception to\' / \'in no uncertain terms\')',
      formula: 'I must take exception to [Characterization]; let the record reflect that [Factual Clarification].',
      formulaReading: 'Regulators told the exchange in no uncertain terms to segregate client funds.',
      explanation: 'Dalam simulasi sidang tesis, arbitrase bisnis, atau wawancara eksekutif C2, ketenangan saat menghadapi tuduhan keliru ditunjukkan lewat gaya bahasa yang tenang dan terukur: gunakan \'take exception to + Noun Phrase\' diikuti fakta jernih.',
      examples: [
        {
          jp: 'Our scientists took strong exception to the editorial\'s claim that safety data had been withheld.',
          reading: '/ˈaʊər ˈsaɪəntɪsts tʊk strɔːŋ ɪkˈsɛpʃən tə ði ˌɛdəˈtɔːriəlz kleɪm ðæt ˈseɪfti ˈdeɪtə hæd bɪn wɪðˈhɛld/',
          id: 'Para ilmuwan kami menyatakan keberatan keras atas klaim tajuk rencana bahwa data keselamatan telah disembunyikan.',
        },
        {
          jp: 'The chairwoman warned in no uncertain terms that insider leaks would trigger dismissal.',
          reading: '/ðə ˈtʃɛrˌwʊmən wɔːrnd ɪn noʊ ʌnˈsɜːrtən tɜːrmz ðæt ˈɪnˌsaɪdər liːks wʊd ˈtrɪɡər dɪsˈmɪsəl/',
          id: 'Ketua dewan memperingatkan dengan bahasa paling tegas bahwa kebocoran orang dalam akan memicu pemecatan.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan kata benda \'record\' bertekanan di suku kata PERTAMA (/ˈrɛkərd/), sedangkan kata kerja \'record\' di suku kata KEDUA (/rɪˈkɔːrd/)!',
  },
  // ===========================================================================
  // Level C2 — UNIT 7 (GP-EN-C2-007)
  // ===========================================================================
  'en-us-c2-u7-kosakata': {
    headline: 'Membuka dengan Aposisi Ringkas & Menutup Tanpa Jebakan \', which\'',
    subtitle: 'Penulis esai C1 sering terjebak menulis \'...prices rose, which hurt exports\' (rujukan \', which\' kabur pada seluruh bagian kalimat!). Penulis C2 menggantinya dengan kata benda perangkum di akhir kalimat yang tajam!',
    items: [
      {
        symbol: '—a shift that...',
        reading: '/ə ʃɪft ðæt/',
        meaning: '—sebuah pergeseran yang... (merangkum seluruh bagian kalimat di depannya menjadi satu kata benda tajam!)',
        mnemonic: 'Ganti \', which caused Y\' yang lembek dengan \'—a shift / bottleneck / miscalculation that triggered Y\'!',
        speakText: '—a shift that...',
      },
      {
        symbol: 'A linchpin of [System], [Subject]',
        reading: '/ə ˈlɪntʃˌpɪn ʌv/',
        meaning: 'Sebagai pasak penyangga utama dari [Sistem], [Subjek tepat di belakang koma]...',
        mnemonic: 'Linchpin = pasak pengunci roda kereta; jika dicabut, seluruh sistem lepas berantakan!',
        speakText: 'A linchpin of [System], [Subject]',
      },
      {
        symbol: 'a hallmark of',
        reading: '/ə ˈhɔːlˌmɑːrk ʌv/',
        meaning: 'Ciri khas utama / tanda mutu otentik dari suatu era, lembaga, atau keahlian',
        mnemonic: 'Berasal dari cap kemurnian emas di Guildhall London: \'Precision is a hallmark of her prose\'.',
        speakText: 'a hallmark of',
      },
      {
        symbol: 'precipitate',
        reading: '/prɪˈsɪpəˌteɪt/',
        meaning: 'Memicu terjadinya suatu krisis atau perubahan besar secara tiba-tiba / lebih cepat',
        mnemonic: 'Kata kerja sebab-akibat favorit bacaan artikel panjang (/prɪˈsɪpəˌteɪt/) di dalam kata benda perangkum di akhir kalimat (\'—a default that precipitated panic\').',
        speakText: 'precipitate',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-007',
      title: 'Introductory Appositives & Summative Modifiers (Replacing Broad \'which\')',
      formula: 'Pembuka Penjelas: [A/An + Noun Phrase], [Matching Subject] + V • Summative: [Kalimat Utama]—[a/an + Summary Noun + that + V]',
      formulaReading: 'A linchpin of global trade, the Suez Canal carries 12% of cargo. • Yields spiked—a shock that froze IPOs.',
      explanation: 'Dua teknik tanda baca dan struktur tingkat *The Economist*: (1) Jika kalimat dibuka dengan frasa penjelas di awal (\'An architect of modern monetary theory,\'), kata tepat sesudah koma WAJIB tokoh/benda yang sama persis! (2) Di akhir kalimat utuh, gunakan tanda pisah (*em-dash* `—`) atau koma diikuti `[Summary Noun] + that/which...` untuk memberi nama sekaligus menilai kejadian di bagian utama kalimat!',
      examples: [
        {
          jp: 'A hallmark of fault-tolerant design, graceful degradation keeps core payments online.',
          reading: '/ə ˈhɔːlˌmɑːrk ʌv ˈfɔːlt ˈtɑːlərənt dɪˈzaɪn ˈɡreɪsfəl ˌdɛɡrəˈdeɪʃən kiːps kɔːr ˈpeɪmənts ˈɑːnˌlaɪn/',
          id: 'Sebagai ciri khas perancangan toleran-kesalahan, penurunan fungsi terukur menjaga pembayaran inti tetap daring.',
        },
        {
          jp: 'Monsoon rains arrived six weeks late—an anomaly that precipitated reservoir rationing.',
          reading: '/mɑːnˈsuːn reɪnz əˈraɪvd sɪks wiːks leɪt ən əˈnɑːməli ðæt prɪˈsɪpəˌteɪtɪd ˈrɛzərˌvwɑːr ˈræʃənɪŋ/',
          id: 'Hujan monsun datang terlambat enam minggu—sebuah anomali yang memicu penjatahan air waduk.',
        },
      ],
    },
    contrastiveTip: 'Dalam standar penulisan akademik AS ketat (APA/Chicago/GMAT), hindari `, which` untuk merujuk ke seluruh kejadian kalimat (\'He missed the flight, which ruined the pitch\'); ubah menjadi \'He missed the flight—a delay that ruined the pitch\'!',
  },
  'en-us-c2-u7-tata-bahasa': {
    headline: 'Mengulang Kata Kunci untuk Memperpanjang Napas Kalimat (*Mengulang Kata Kunci untuk Menjelaskan*)',
    subtitle: 'Bagaimana cara menulis kalimat 35 kata yang tetap sejernih kristal? Tangkap kembali kata benda, kata sifat, atau kata kerja penting menjelang akhir kalimat, lalu kembangkan!',
    items: [
      {
        symbol: '..., [Noun] that...',
        reading: '/... ðæt/',
        meaning: 'Pengulangan kata benda kunci (*resumptive noun*) untuk menambahkan bagian penjelas \'yang\' mendalam tanpa tersesat',
        mnemonic: 'Contoh: \'We face a trust deficit, a deficit that no PR campaign alone can close\'.',
        speakText: '..., [Noun] that...',
      },
      {
        symbol: '..., [Adjective] enough to...',
        reading: '/... ɪˈnʌf tuː/',
        meaning: 'Pengulangan kata sifat kunci (*resumptive adjective*) untuk merinci konsekuensi sifatnya',
        mnemonic: 'Contoh: \'The mesh must be resilient—resilient enough to survive triple-node failure\'.',
        speakText: '..., [Adjective] enough to...',
      },
      {
        symbol: '..., a threshold beyond which...',
        reading: '/ə ˈθrɛʃˌhoʊld bɪˈjɑːnd wɪtʃ/',
        meaning: '..., sebuah ambang batas yang apabila dilampaui maka... (*summative + kata depan + which*)',
        mnemonic: 'Menggabungkan kata benda perangkum dengan kalimat penjelas pakai kata depan + which C1/C2!',
        speakText: '..., a threshold beyond which...',
      },
      {
        symbol: 'cascade',
        reading: '/kæˈskeɪd/',
        meaning: 'Runtutan berjenjang seperti air terjun bertingkat (kata benda/kerja kegagalan atau efek sistemik)',
        mnemonic: '\'A cascade of liquidations\' / \'failures cascaded across regions\'.',
        speakText: 'cascade',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-007',
      title: 'Mengulang Kata Kunci untuk Penjelasan Mendalam',
      formula: '[Kalimat Utama berakhir di Kata Kunci X], [Key Word X] + [that / Prep + which / penjelasan \'to + V1\']',
      formulaReading: 'Central banks guard credibility, credibility that takes decades to earn and minutes to lose.',
      explanation: 'Berbeda dari repetisi tak sengaja yang membosankan, teknik mengulang kata kunci sengaja menggemakan satu kata kunci tepat sesudah koma atau tanda pisah untuk menjadi landasan pacu ide lanjutan. Ini menghilangkan 100% ambiguitas rujukan kata ganti relatif pada kalimat kompleks!',
      examples: [
        {
          jp: 'Tropical peatlands store vast carbon reserves, reserves that centuries of drainage now threaten to release.',
          reading: '/ˈtrɑːpɪkəl ˈpiːtˌlændz stɔːr væst ˈkɑːrbən rɪˈzɜːrvz rɪˈzɜːrvz ðæt ˈsɛntʃəriz ʌv ˈdreɪnɪdʒ naʊ ˈθrɛtən tə rɪˈliːs/',
          id: 'Lahan gambut tropis menyimpan cadangan karbon raksasa, cadangan yang kini terancam lepas akibat berabad-abad pengeringan.',
        },
        {
          jp: 'Permafrost thaw crosses a tipping point—a threshold beyond which methane release becomes self-sustaining.',
          reading: '/ˈpɜːrməˌfrɔːst θɔː ˈkrɔːsɪz ə ˈtɪpɪŋ pɔɪnt ə ˈθrɛʃˌhoʊld bɪˈjɑːnd wɪtʃ ˈmɛθeɪn rɪˈliːs bɪˈkʌmz ˈsɛlf səˈsteɪnɪŋ/',
          id: 'Pencairan ibun abadi melintasi titik kritis—sebuah ambang batas yang jika dilampaui membuat pelepasan metana berlangsung mandiri.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan lafal \'methane\' di American English: /ˈmɛθeɪn/ (METH-ayn), berbeda dari pelafalan Inggris /ˈmiːθeɪn/!',
  },
  'en-us-c2-u7-diskusi-toefl': {
    headline: 'Menghindari Kalimat Patah-Patah (*Choppy Prose*) sekaligus Menghindari *Run-On*',
    subtitle: 'Gabungkan aposisi, tanda pisah, dan kosakata struktur sistemik untuk menghasilkan paragraf esai Esai Tingkat Mahir yang matang.',
    items: [
      {
        symbol: 'at the crossroads of',
        reading: '/æt ðə ˈkrɔːsˌroʊdz ʌv/',
        meaning: 'Berada di persimpangan strategis antara (dua disiplin ilmu atau pilihan sejarah)',
        mnemonic: 'Pembuka aposisi favorit untuk esai Statement of Purpose interdisipliner!',
        speakText: 'at the crossroads of',
      },
      {
        symbol: 'an inflection point',
        reading: '/ən ɪnˈflɛkʃən pɔɪnt/',
        meaning: 'Titik belok kurva di mana laju dan arah perubahan berbalik tajam secara eksponensial',
        mnemonic: 'Dari kalkulus diferensial; dipakai eksekutif AS untuk momen percepatan struktural.',
        speakText: 'an inflection point',
      },
      {
        symbol: 'byproduct of',
        reading: '/ˈbaɪˌprɑːdʌkt ʌv/',
        meaning: 'Hasil sampingan (sering kali tak disengaja) dari suatu proses utama',
        mnemonic: 'Sangat berguna di dalam kata benda perangkum: \'—an unintended byproduct of cheap credit\'.',
        speakText: 'byproduct of',
      },
      {
        symbol: 'double-edged sword',
        reading: '/ˈdʌbəl ɛdʒd sɔːrd/',
        meaning: 'Pedang bermata dua (membawa manfaat besar sekaligus risiko setara)',
        mnemonic: 'Ingat huruf \'w\' pada \'sword\' (/sɔːrd/) 100% BISU (*silent w*)!',
        speakText: 'double-edged sword',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-007',
      title: 'Editorial Sentence Architecture (Pembuka Penjelas + Kalimat Inti + Summative Dash)',
      formula: '[Pembuka Penjelas], [Subject + Active Verb + Object]—[a/an + Evaluative Noun + that + Consequence].',
      formulaReading: 'Situated at the crossroads of biology and data science, modern research decodes genes—a partnership that transforms medicine.',
      explanation: 'Cetak biru tiga lapis ini (*Intro Frame -> Crisp Core -> Summative Tail*) memungkinkan Anda memasukkan tiga gagasan utuh ke dalam satu kalimat yang sangat mudah dibaca tanpa satu pun kata sambung mekanis yang kaku.',
      examples: [
        {
          jp: 'An unintended byproduct of coastal seawalls, beach scouring erodes turtle nesting grounds.',
          reading: '/ən ˌʌnɪnˈtɛndɪd ˈbaɪˌprɑːdʌkt ʌv ˈkoʊstəl ˈsiːˌwɔːlz biːtʃ ˈskaʊərɪŋ ɪˈroʊdz ˈtɜːrtəl ˈnɛstɪŋ ɡraʊndz/',
          id: 'Sebagai hasil sampingan tak terduga dari dinding laut pesisir, penggerusan pantai mengikis tempat bertelur penyu.',
        },
        {
          jp: 'Cloud concentration has reached an inflection point—a double-edged sword that pairs elasticity with systemic risk.',
          reading: '/klaʊd ˌkɑːnsənˈtreɪʃən hæz riːtʃt ən ɪnˈflɛkʃən pɔɪnt ə ˈdʌbəl ɛdʒd sɔːrd ðæt pɛrz ˌiːlæˈstɪsəti wɪð sɪˈstɛmɪk rɪsk/',
          id: 'Konsentrasi cloud telah mencapai titik belok—sebuah pedang bermata dua yang menyandingkan elastisitas dengan risiko sistemik.',
        },
      ],
    },
    contrastiveTip: 'Cek pelafalan wajib: \'sword\' = /sɔːrd/ (berima dengan \'cord/board\', TANPA bunyi /w/ sama sekali)!',
  },
  // ===========================================================================
  // Level C2 — UNIT 8 (GP-EN-C2-008)
  // ===========================================================================
  'en-us-c2-u8-kosakata': {
    headline: 'Membatasi Sejauh Mana Suatu Klaim Berlaku (*Scope Delimitation*)',
    subtitle: 'Pemikir C2 jarang membuat klaim mutlak tanpa batas; mereka mengunci *sejauh mana* (\'insofar as\') atau *terlepas dari apa* (\'notwithstanding\') sebuah argumen valid.',
    items: [
      {
        symbol: 'insofar as (+ S + V)',
        reading: '/ˌɪnsoʊˈfɑːr æz/',
        meaning: 'Sejauh mana / hanya dalam batas bahwa... (membatasi derajat keberlakuan klaim)',
        mnemonic: 'Ditulis SATU kata di American English modern (\'insofar as\', bukan tiga kata terpisah di gaya lama).',
        speakText: 'insofar as (+ S + V)',
      },
      {
        symbol: 'notwithstanding',
        reading: '/ˌnɑːtwɪðˈstændɪŋ/',
        meaning: 'Terlepas dari / kendati adanya... (kata depan super-formal yang bisa di DEPAN atau di BELAKANG kata bendanya!)',
        mnemonic: 'Bisa \'Notwithstanding fierce opposition,\' ATAU \'Fierce opposition notwithstanding,\'—keduanya 100% sah dan sangat elegan!',
        speakText: 'notwithstanding',
      },
      {
        symbol: 'vis-à-vis (+ Noun)',
        reading: '/ˌviːzəˈviː/',
        meaning: 'Dibandingkan dengan / dalam hubungannya berhadapan dengan...',
        mnemonic: 'Lafalkan tanpa bunyi \'s\' di ujung: /ˌviːzəˈviː/ (\'Dollar strength vis-à-vis emerging currencies\').',
        speakText: 'vis-à-vis (+ Noun)',
      },
      {
        symbol: 'by the same token,',
        reading: '/baɪ ðə seɪm ˈtoʊkən/',
        meaning: 'Atas dasar alasan yang sama persis, / demikian pula halnya,',
        mnemonic: 'Transisi simetris C2 untuk menunjukkan bahwa prinsip yang barusan dipakai juga melahirkan konsekuensi pendamping.',
        speakText: 'by the same token,',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-008',
      title: 'Precision Scope & Bidirectional Kata Depan (\'Insofar as\' & \'Notwithstanding\')',
      formula: 'Batasan Cakupan: [Claim] + insofar as + [S + V] • Concession Prep: Notwithstanding [NP], / [NP] notwithstanding,',
      formulaReading: 'GDP measures welfare only insofar as market prices capture value. • Short-term volatility notwithstanding, fundamentals remain sound.',
      explanation: 'Hati-hati membedakan kelas katanya! \'Insofar as\' dan \'inasmuch as\' adalah KATA HUBUNG sehingga wajib diikuti bagian kalimat lengkap `Subject + Verb`. Sebaliknya, \'notwithstanding\' dan \'vis-à-vis\' adalah KATA DEPAN sehingga diikuti `Noun Phrase` (TANPA kata \'of\'—jangan pernah menulis *\'notwithstanding of\'*!).',
      examples: [
        {
          jp: 'Carbon credits work only insofar as baseline forest threats are verified independently.',
          reading: '/ˈkɑːrbən ˈkrɛdɪts wɜːrk ˈoʊnli ˌɪnsoʊˈfɑːr æz ˈbeɪsˌlaɪn ˈfɔːrəst θrɛts ɑːr ˈvɛrəˌfaɪd ˌɪndɪˈpɛndəntli/',
          id: 'Kredit karbon efektif hanya sejauh ancaman dasar terhadap hutan diverifikasi secara independen.',
        },
        {
          jp: 'Supply bottlenecks notwithstanding, seasonal deliveries topped estimates by eight percent.',
          reading: '/səˈplaɪ ˈbɑːtəlˌnɛks ˌnɑːtwɪðˈstændɪŋ ˈkwɔːrtərli dɪˈlɪvəriz tɑːpt ˈɡaɪdəns baɪ eɪt pərˈsɛnt/',
          id: 'Terlepas dari kemacetan pasokan, pengiriman kuartalan melampaui proyeksi sebesar delapan persen.',
        },
      ],
    },
    contrastiveTip: 'Ingat: sama seperti \'despite\', kata \'notwithstanding\' TIDAK PERNAH diikuti kata depan \'of\' (*\'notwithstanding of the delay\'* -> SALAH)!',
  },
  'en-us-c2-u8-tata-bahasa': {
    headline: 'Membedakan Kausalitas Formal (\'Inasmuch as\') & Derajat Korelasi (\'To the extent that\')',
    subtitle: 'Pahami nuansa halus di antara kata-kata hubung tingkat tinggi yang sering muncul di soal parafrasa (*Sentence Simplification*) bacaan artikel panjang!',
    items: [
      {
        symbol: 'inasmuch as (+ S + V)',
        reading: '/ˌɪnəzˈmʌtʃ æz/',
        meaning: 'Mengingat kenyataan bahwa / sejauh dan karena... (alasan formal yang membatasi klaim)',
        mnemonic: 'Satu kata sambung (\'inasmuch\') + \'as\': menggabungkan nuansa \'because\' dan \'to the degree that\'.',
        speakText: 'inasmuch as (+ S + V)',
      },
      {
        symbol: 'to the extent that (+ S + V)',
        reading: '/tə ði ɪkˈstɛnt ðæt/',
        meaning: 'Sampai pada tingkat di mana / sejauh bahwa... (proporsional)',
        mnemonic: 'Dapat dibalik ke depan: \'To the extent that inflation cools, real wages recover\'.',
        speakText: 'to the extent that (+ S + V)',
      },
      {
        symbol: 'save for / save that',
        reading: '/seɪv fɔːr ... seɪv ðæt/',
        meaning: 'Kecuali untuk (+ Noun) / kecuali bahwa (+ Kalimat Utuh) — pengecualian formal sastra/hukum',
        mnemonic: 'Hati-hati di bacaan artikel panjang: \'save for two coastal enclaves\' berarti \'EXCEPT for two enclaves\', BUKAN \'menabung/menyelamatkan\'!',
        speakText: 'save for / save that',
      },
      {
        symbol: 'absent (+ Noun Phrase)',
        reading: '/ˈæbsənt/',
        meaning: 'Tanpa adanya / jika tidak terdapat... (kata depan legal-eksekutif Amerika!)',
        mnemonic: 'Penggunaan khas US Supreme Court & pimpinan perusahaan: \'Absent congressional action, the tax credit expires\' (= Without congressional action)!',
        speakText: 'absent (+ Noun Phrase)',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-008',
      title: 'Legal-Academic Kata Depan (\'Absent + NP\' / \'Save for + NP\') & \'Inasmuch as\'',
      formula: 'Absent + [NP], [Consequence] (= Without NP) • Save for + [NP] (= Except for NP) • Inasmuch as + [Kalimat Utuh]',
      formulaReading: 'Absent cold-chain storage, mRNA doses degrade rapidly. • The grid held firm, save for two substations.',
      explanation: 'Dua kata pendek yang mengecoh 90% pembaca non-C2 di teks Amerika: (1) Kata sifat \'absent\' yang diletakkan di DEPAN kata benda berubah fungsi menjadi KATA DEPAN bermakna \'tanpa adanya\' (\'Absent clear evidence, we must acquit\'); (2) Kata \'save (for)\' bermakna \'kecuali\' (\'All ports reopened, save for Galveston\').',
      examples: [
        {
          jp: 'Absent binding methane verification, voluntary oil-patch pledges accomplish little.',
          reading: '/ˈæbsənt ˈbaɪndɪŋ ˈmɛθeɪn ˌvɛrəfəˈkeɪʃən ˈvɑːlənˌtɛri ɔɪl pætʃ ˈplɛdʒɪz əˈkɑːmplɪʃ ˈlɪtəl/',
          id: 'Tanpa adanya verifikasi metana yang mengikat, janji sukarela ladang minyak tidak menghasilkan banyak dampak.',
        },
        {
          jp: 'Inasmuch as central banks target expectations, credible forward guidance matters enormously.',
          reading: '/ˌɪnəzˈmʌtʃ æz ˈsɛntrəl bæŋks ˈtɑːrɡɪt ˌɛkspɛkˈteɪʃənz ˈkrɛdəbəl ˈfɔːrwərd ˈɡaɪdəns ˈmætərz ɪˈnɔːrməsli/',
          id: 'Mengingat bahwa bank sentral menyasar ekspektasi pasar, panduan arah kebijakan yang kredibel menjadi luar biasa penting.',
        },
      ],
    },
    contrastiveTip: 'Uji cepat pemahaman C2: \'Absent a warrant, officers cannot search the server\' -> \'Absent\' di sini = \'Without\' (kata depan), BUKAN kata sifat \'tidak hadir\'!',
  },
  'en-us-c2-u8-diskusi-toefl': {
    headline: 'Membedakan Realitas Lapangan vs. Aturan Tertulis (*De Facto, De Jure, Per Se*)',
    subtitle: ' Empat istilah klasik serapan hukum-ekonomi yang telah menyatu sepenuhnya ke dalam bahasa Inggris akademik C2 dan ujian bahasa Inggris internasional.',
    items: [
      {
        symbol: 'de facto vs. de jure',
        reading: '/deɪ ˈfæktoʊ ... deɪ ˈdʒʊri/',
        meaning: 'Secara kenyataan praktik di lapangan (*de facto*) vs. secara ketetapan hukum resmi (*de jure*)',
        mnemonic: 'Kontras favorit di kuliah sejarah, teknologi, dan hubungan internasional!',
        speakText: 'de facto vs. de jure',
      },
      {
        symbol: 'not [bad/illegal] per se',
        reading: '/pɜːr seɪ/',
        meaning: 'Bukan [buruk/terlarang] pada dirinya sendiri secara hakiki (melainkan bergantung pada konteks/cara pakainya!)',
        mnemonic: 'Sangat presisi untuk membedakan alat dari penyalahgunaannya: \'Debt is not harmful per se\'.',
        speakText: 'not [bad/illegal] per se',
      },
      {
        symbol: 'a statutory carve-out',
        reading: '/ə ˈstætʃəˌtɔːri ˈkɑːrv aʊt/',
        meaning: 'Pengecualian khusus yang sengaja dipahat keluar dari cakupan aturan umum undang-undang',
        mnemonic: 'Kosakata inti kebijakan publik AS untuk ruang bebas regulasi bagi usaha kecil atau riset akademik.',
        speakText: 'a statutory carve-out',
      },
      {
        symbol: 'on balance,',
        reading: '/ɑːn ˈbæləns/',
        meaning: 'Setelah menimbang sisi positif dan negatif di atas neraca secara keseluruhan,',
        mnemonic: 'Pembuka simpulan akhir paling elegan di paragraf penutup penulisan esai bahasa Inggris!',
        speakText: 'on balance,',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-008',
      title: 'Intrinsic vs. Contextual Qualification (\'not X per se, but insofar as...\')',
      formula: '[Phenomenon] is not [Problematic] per se; rather, risks arise insofar as [Specific Misuse].',
      formulaReading: 'Market concentration is not unlawful per se under US antitrust law.',
      explanation: 'Menggabungkan \'not [Adj] per se\' dengan \'insofar as\' menciptakan tesis C2 yang tak mudah dipatahkan penguji mana pun: Anda menunjukkan bahwa teknologi/kebijakan tersebut tidak buruk pada hakikatnya (\'per se\'), melainkan hanya bermasalah sejauh kondisi tertentu dilanggar (\'insofar as...\').',
      examples: [
        {
          jp: 'Algorithmic pricing is not anticompetitive per se; liability arises insofar as rivals share nonpublic inputs.',
          reading: '/ˌælɡəˈrɪðmɪk ˈpraɪsɪŋ ɪz nɑːt ˌæntikəmˈpɛtətɪv pɜːr seɪ ˌlaɪəˈbɪləti əˈraɪzɪz ˌɪnsoʊˈfɑːr æz ˈraɪvəlz ʃɛr/',
          id: 'Penetapan harga algoritmik tidak bersifat antipakat pada dirinya sendiri; pertanggungjawaban hukum muncul sejauh para pesaing berbagi data masukan nonpublik.',
        },
        {
          jp: 'English holds no de jure federal status in the US, yet it serves as the de facto language of courts.',
          reading: '/ˈɪŋɡlɪʃ hoʊldz noʊ deɪ ˈdʒʊri ˈfɛdərəl ˈsteɪtəs ɪn ðə ˈjuːˈɛs jɛt ɪt sɜːrvz æz ðə deɪ ˈfæktoʊ ˈlæŋɡwɪdʒ/',
          id: 'Bahasa Inggris tidak memegang status resmi undang-undang federal di AS, namun berfungsi sebagai bahasa praktik nyata di pengadilan.',
        },
      ],
    },
    contrastiveTip: 'Jangan gunakan \'per se\' sembarangan sebagai pengganti kata \'exactly\'! Gunakan \'per se\' HANYA untuk arti \'by or in itself / secara hakiki terlepas dari faktor luar\'.',
  },
  // ===========================================================================
  // Level C2 — UNIT 9 (GP-EN-C2-009)
  // ===========================================================================
  'en-us-c2-u9-kosakata': {
    headline: 'Idiom Tiga Kata yang Membuat Bahasa Inggris Lisan Anda Terdengar 100% Asli AS',
    subtitle: 'Paradoks pembelajar C2: mampu menulis kata Latin panjang, namun kaku di rapat Amerika karena belum luwes memakai gabungan tiga kata kerja yang dipakai sehari-hari!',
    items: [
      {
        symbol: 'come down to / boil down to',
        reading: '/kʌm daʊn tuː ... bɔɪl daʊn tuː/',
        meaning: 'Pada intinya mengerucut / bergantung pada satu faktor penentu paling mendasar',
        mnemonic: '\'It all comes down to unit economics\' = setelah semua dibedah, inti penentunya adalah ekonomi unit!',
        speakText: 'come down to / boil down to',
      },
      {
        symbol: 'live up to [the hype / promise]',
        reading: '/lɪv ʌp tuː/',
        meaning: 'Terbukti memenuhi standar tinggi atau ekspektasi besar yang dijanjikan',
        mnemonic: 'Sangat sering muncul di latihan mendengarkan percakapan & kuliah & ulasan riset: \'failed to live up to early clinical promise\'.',
        speakText: 'live up to [the hype / promise]',
      },
      {
        symbol: 'do away with',
        reading: '/duː əˈweɪ wɪð/',
        meaning: 'Menghapuskan / meniadakan aturan, birokrasi, atau komponen usang secara permanen',
        mnemonic: 'Setara \'abolish / eliminate\', namun jauh lebih idiomatis dalam diskusi produk dan reformasi!',
        speakText: 'do away with',
      },
      {
        symbol: 'zero in on',
        reading: '/ˈzɪroʊ ɪn ɑːn/',
        meaning: 'Membidik tajam / memusatkan seluruh perhatian tepat ke akar masalah spesifik',
        mnemonic: 'Dari membidik titik nol sasaran tembak: \'Investigators zeroed in on a faulty valve\'.',
        speakText: 'zero in on',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-009',
      title: 'Gabungan Tiga Kata Kerja (Selalu Utuh & Tidak Dipisah)',
      formula: '[Verb + Particle + Kata Depan] + [Noun / Pronoun / V-ing] (TIDAK BOLEH dipisah objek!)',
      formulaReading: 'We did away with paper forms -> We did away with THEM (BUKAN *did them away with*!).',
      explanation: 'Berbeda dari gabungan kata kerja dua kata (*iron it out*), SELURUH kata kerja tiga kata (*Verb + Adverb Particle + Kata Depan*) bersifat 100% TAK TERPISAHKAN (*inseparable*)! Kata ganti objek (\'it / them\') WAJIB diletakkan paling belakang sesudah kata depan, dan kata kerja sesudahnya wajib berbentuk `V-ing`!',
      examples: [
        {
          jp: 'Ultimately, long-term customer loyalty comes down to solving daily problems.',
          reading: '/ˈʌltəmətli ˈɛntərˌpraɪz sæs rɪˈtɛnʃən kʌmz daʊn tə ˈsɑːlvɪŋ ˈdeɪli ˈwɜːrkˌfloʊ peɪn/',
          id: 'Pada akhirnya, kesetiaan pelanggan jangka panjang mengerucut pada penyelesaian masalah sehari-hari.',
        },
        {
          jp: 'Outdated paper fees slowed registration, so the ministry did away with them entirely.',
          reading: '/ˈlɛɡəsi stæmp ˈduːtiz sloʊd ˈɑːnˌbɔːrdɪŋ soʊ ðə ˈmɪnɪstri dɪd əˈweɪ wɪð ðɛm ɪnˈtaɪərli/',
          id: 'Bea meterai fisik lawas memperlambat orientasi, sehingga kementerian menghapuskannya sama sekali.',
        },
      ],
    },
    contrastiveTip: 'Hati-hati jebakan \'to\' pada \'come down TO\' dan \'live up TO\': kata \'to\' di sini adalah KATA DEPAN murni, sehingga wajib diikuti `V-ing` (\'comes down to EXECUTING well\', BUKAN *\'to execute\'*)!',
  },
  'en-us-c2-u9-tata-bahasa': {
    headline: 'Wajib Pakai V-ing Setelah Kata Depan di Akhir & Bentuk Pasif Idiom Tiga Kata',
    subtitle: 'Pelajari empat idiom tiga kata berikutnya beserta cara membentuk kalimat pasif yang sah tanpa memotong partikelnya!',
    items: [
      {
        symbol: 'face up to (+ NP / V-ing)',
        reading: '/feɪs ʌp tuː/',
        meaning: 'Berani menghadapi dan mengakui kenyataan pahit yang selama ini dihindari',
        mnemonic: 'Diikuti benda atau V-ing: \'Boards must face up to writing down stranded assets\'.',
        speakText: 'face up to (+ NP / V-ing)',
      },
      {
        symbol: 'fall back on (+ NP / V-ing)',
        reading: '/fɔːl bæk ɑːn/',
        meaning: 'Kembali mengandalkan sistem cadangan atau keahlian lama saat rencana utama gagal',
        mnemonic: 'Sangat lazim dalam rekayasa keandalan (*resilience*) dan strategi karier.',
        speakText: 'fall back on (+ NP / V-ing)',
      },
      {
        symbol: 'brush up on (+ NP)',
        reading: '/brʌʃ ʌp ɑːn/',
        meaning: 'Menyegarkan kembali penguasaan keterampilan/bahasa yang agak berkarat sebelum dipakai',
        mnemonic: '\'Brush up on econometrics before starting your PhD coursework\'.',
        speakText: 'brush up on (+ NP)',
      },
      {
        symbol: 'put up with / be done away with',
        reading: '/pʊt ʌp wɪð ... bi dʌn əˈweɪ wɪð/',
        meaning: 'Menoleransi gangguan / dihapuskan (ketiga kata tetap berurutan utuh dalam pasif!)',
        mnemonic: 'Pasif: \'Paper customs manifests have been DONE AWAY WITH\'—partikel \'away\' dan \'with\' tetap menempel utuh!',
        speakText: 'put up with / be done away with',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-009',
      title: 'Bentuk V-ing Setelah Kata Depan & Bentuk Pasif Gabungan Tiga Kata',
      formula: 'Active: S + [V + Part + Prep] + V-ing • Passive: [Obj] + be + [V3 + Part + Prep] (all 3 words stay adjacent!)',
      formulaReading: 'Legacy fax workflows should have been done away with years ago.',
      explanation: 'Saat mengubah gabungan tiga kata kerja ke bentuk pasif dalam tulisan formal maupun bicara, JANGAN membuang kata depan terakhirnya! Tulis \'Outdated tariffs were done away with\' (lengkap tiga kata: `done + away + with`). Selain itu, pastikan setiap kata kerja yang mengikuti `face up to` atau `fall back on` berbentuk `V-ing`.',
      examples: [
        {
          jp: 'Municipalities must face up to relocating infrastructure away from subsiding coastlines.',
          reading: '/mjuːˈnɪsəpələtiz mʌst feɪs ʌp tə riːˈloʊkeɪtɪŋ ˈɪnfrəˌstrʌktʃər əˈweɪ frʌm səbˈsaɪdɪŋ ˈkoʊstˌlaɪnz/',
          id: 'Pemerintah kota harus berani menghadapi kenyataan merelokasi infrastruktur menjauhi garis pantai yang ambles.',
        },
        {
          jp: 'When GPS jamming hit the strait, captains fell back on radar range-finding.',
          reading: '/wɛn ˈdʒiːˈpiːˈɛs ˈdʒæmɪŋ hɪt ðə streɪt ˈkæptənz fɛl bæk ɑːn ˈreɪdɑːr ˈreɪndʒ ˌfaɪndɪŋ/',
          id: 'Ketika pengacauan sinyal GPS melanda selat tersebut, para nakhoda kembali mengandalkan pengukuran jarak radar.',
        },
      ],
    },
    contrastiveTip: 'Ingat: \'face up TO + V-ing\' (sama seperti \'look forward TO + V-ing\' dan \'be committed TO + V-ing\')—kata \'to\' adalah kata depan, bukan penanda \'to + V1\'!',
  },
  'en-us-c2-u9-diskusi-toefl': {
    headline: 'Idiom Tiga Kata Akuntabilitas & Penyelesaian Tugas di Budaya Kerja Amerika',
    subtitle: 'Dalam budaya kepemimpinan AS (*ownership culture*), empat idiom tiga kata ini membedakan pemimpin yang bertanggung jawab dari yang sekadar berwacana.',
    items: [
      {
        symbol: 'own up to (+ NP / V-ing)',
        reading: '/oʊn ʌp tuː/',
        meaning: 'Mengakui kesalahan atau kelalaian secara ksatria dan terbuka tanpa mencari kambing hitam',
        mnemonic: 'Inti dari evaluasi jujur tanpa saling menyalahkan dan integritas akademik: \'owned up to miscalibrating the sensor\'.',
        speakText: 'own up to (+ NP / V-ing)',
      },
      {
        symbol: 'follow through on (+ NP)',
        reading: '/ˈfɑːloʊ θruː ɑːn/',
        meaning: 'Menuntaskan janji, komitmen, atau rencana hingga benar-benar selesai tereksekusi',
        mnemonic: 'Dari gerakan ayunan penuh raket/golf sesudah memukul bola: tidak berhenti setengah jalan!',
        speakText: 'follow through on (+ NP)',
      },
      {
        symbol: 'measure up to (+ NP)',
        reading: '/ˈmɛʒər ʌp tuː/',
        meaning: 'Mampu menyamai / memenuhi tolok ukur mutu pesaing atau standar ketat',
        mnemonic: 'Mirip \'live up to\', namun lebih fokus membandingkan kualitas objektif terhadap tolok ukur (*benchmark*).',
        speakText: 'measure up to (+ NP)',
      },
      {
        symbol: 'get around to (+ V-ing)',
        reading: '/ɡɛt əˈraʊnd tuː/',
        meaning: 'Akhirnya sempat meluangkan waktu untuk mengerjakan tugas yang lama tertunda',
        mnemonic: 'Selalu diikuti NP atau V-ing: \'never got around to refactoring the auth module\'!',
        speakText: 'get around to (+ V-ing)',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-009',
      title: 'Executive Ownership Idioms (\'follow through on\' / \'own up to V-ing\')',
      formula: 'own up to + [NP / V-ing] • follow through on + [pledges/reforms] • get around to + [V-ing]',
      formulaReading: 'Great leaders own up to missteps early and follow through on corrective pledges.',
      explanation: 'Dalam latihan mendengarkan percakapan & kuliah (baik percakapan administrasi kampus maupun kuliah manajemen) serta wawancara perilaku perusahaan AS, idiom tiga kata membawa muatan sikap (*stance*) yang jauh lebih bernuansa daripada kata kerja satu kata.',
      examples: [
        {
          jp: 'Rather than deflecting blame, the lab director owned up to mislabeling the control batch.',
          reading: '/ˈræðər ðæn dɪˈflɛktɪŋ bleɪm ðə læb dəˈrɛktər oʊnd ʌp tə mɪsˈleɪbəlɪŋ ðə kənˈtroʊl bætʃ/',
          id: 'Alih-alih mengalihkan kesalahan, kepala laboratorium secara terbuka mengakui salah melabeli kelompok kontrol.',
        },
        {
          jp: 'Treaties fail when signatories announce bold targets yet never follow through on domestic funding.',
          reading: '/ˈtriːtiz feɪl wɛn ˈsɪɡnəˌtɔːriz əˈnaʊns boʊld ˈtɑːrɡɪts jɛt ˈnɛvər ˈfɑːloʊ θruː ɑːn dəˈmɛstɪk ˈfʌndɪŋ/',
          id: 'Perjanjian gagal ketika para penanda tangan mengumumkan target berani namun tak pernah menuntaskan pendanaan dalam negeri.',
        },
      ],
    },
    contrastiveTip: 'Perhatikan V-ing wajib pada \'get around TO + V-ing\' (\'finally got around to READING the thesis\', BUKAN *\'to read\'*)!',
  },
  // ===========================================================================
  // Level C2 — UNIT 10 (GP-EN-C2-010)
  // ===========================================================================
  'en-us-c2-u10-kosakata': {
    headline: 'Seni Membingkai Ulang Persoalan dengan Antitesis Tajam (*Rhetorical Antithesis*)',
    subtitle: 'Kalimat pembuka atau penutup yang tak terlupakan hampir selalu dibangun di atas kontras simetris yang menggeser cara pandang audiens dalam satu ayunan kalimat.',
    items: [
      {
        symbol: 'less about [X] than about [Y]',
        reading: '/lɛs əˈbaʊt ... ðæn əˈbaʊt/',
        meaning: 'Bukan terutama soal [X], melainkan jauh lebih merupakan persoalan [Y]',
        mnemonic: 'Tidak menyangkal X 100%, tetapi menggeser titik berat analisis secara jauh lebih cerdas daripada \'not X, but Y\'!',
        speakText: 'less about [X] than about [Y]',
      },
      {
        symbol: 'at once [Adj A] and [Adj B]',
        reading: '/æt wʌns ... ænd/',
        meaning: 'Sekaligus bersifat [A] dan [B] pada saat yang bersamaan (untuk dua sifat kontras/paradoks!)',
        mnemonic: 'JEBAKAN C2: Di prosa sastra/akademik, \'at once\' sebelum dua kata sifat berarti \'SIMULTANEOUSLY\' (\'at once fragile and resilient\'), BUKAN \'segera\'!',
        speakText: 'at once [Adj A] and [Adj B]',
      },
      {
        symbol: 'What matters is not [A], but [B]',
        reading: '/wʌt ˈmætərz ɪz nɑːt ... bʌt/',
        meaning: 'Hal yang sesungguhnya menentukan bukanlah [A], melainkan [B]',
        mnemonic: 'Pola penegas kontras \'What ... is ...\' untuk mengunci pesan utama presentasi eksekutif dan wawancara beasiswa.',
        speakText: 'What matters is not [A], but [B]',
      },
      {
        symbol: 'stand the test of time',
        reading: '/stænd ðə tɛst ʌv taɪm/',
        meaning: 'Terbukti tangguh dan tetap relevan melintasi ujian zaman',
        mnemonic: 'Idiom puncak untuk menutup evaluasi arsitektur perangkat lunak, konstitusi, atau karya ilmiah.',
        speakText: 'stand the test of time',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-010',
      title: 'Proportional Antithesis (\'less about X than about Y\') & Paradoxical \'at once\'',
      formula: '[Issue] is less about [Surface Factor] than about [Deep Driver] • [Subject] is at once [Trait A] and [Trait B]',
      formulaReading: 'Digital transformation is less about cloud tools than about decision incentives.',
      explanation: 'Dua penanda kemahiran retoris tertinggi C2: (1) Gunakan \'less [Prep + X] than [Prep + Y]\' untuk membingkai ulang perdebatan secara bernuansa tanpa terdengar hitam-putih; (2) Pahami idiom sastra-akademik \'at once X and Y\' (= *both X and Y simultaneously*) yang sangat sering diujikan di soal kosakata konteks bacaan artikel panjang!',
      examples: [
        {
          jp: 'Grid modernization is less about inventing new cables than about reforming permitting incentives.',
          reading: '/ɡrɪd ˌmɑːdərnəˈzeɪʃən ɪz lɛs əˈbaʊt ɪnˈvɛntɪŋ nuː ˈkeɪbəlz ðæn əˈbaʊt rɪˈfɔːrmɪŋ pərˈmɪtɪŋ ɪnˈsɛntɪvz/',
          id: 'Modernisasi jaringan listrik bukan terutama soal menemukan kabel baru, melainkan soal merombak insentif perizinan.',
        },
        {
          jp: 'Coral reefs are ecosystems at once astonishingly biodiverse and acutely thermally fragile.',
          reading: '/ˈkɔːrəl riːfs ɑːr ˈiːkoʊˌsɪstəmz æt wʌns əˈstɑːnɪʃɪŋli ˌbaɪoʊdəˈvɜːrs ænd əˈkjuːtli ˈθɜːrməli ˈfrædʒəl/',
          id: 'Terumbu karang adalah ekosistem yang sekaligus sangat kaya keanekaragaman hayati dan amat rapuh terhadap suhu.',
        },
      ],
    },
    contrastiveTip: 'Ingat: pada \'less about X THAN about Y\', gunakan kata pembanding \'than\' (ejaan \'a\'), jangan pernah terpleset menulis \'then\'!',
  },
  'en-us-c2-u10-tata-bahasa': {
    headline: 'Hukum Suku Kata menanjak (*Tricolon Crescendo*) & Pembalikan Cermin (*Chiasmus*)',
    subtitle: 'Mengapa kalimat pidato Abraham Lincoln, JFK, dan Barack Obama terdengar begitu memukau? Rahasianya adalah irama tiga serangkai yang memanjang di bagian akhir!',
    items: [
      {
        symbol: 'Tricolon Crescendo (A, B, and C)',
        reading: '/traɪˈkoʊlən krəˈʃɛndoʊ/',
        meaning: 'Rangkaian tiga unsur paralel yang disusun dari suku kata pendek ke frasa terpanjang di akhir',
        mnemonic: 'Bandingkan: \'accurate, reproducible, and fast\' (antiklimaks jatuh!) vs. \'fast, accurate, and independently reproducible\' (klimaks menanjak!).',
        speakText: 'Tricolon Crescendo (A, B, and C)',
      },
      {
        symbol: 'not because [A], but because [B]',
        reading: '/nɑːt bɪˈkɔːz ... bʌt bɪˈkɔːz/',
        meaning: 'Bukan karena [alasan dangkal A], melainkan karena [alasan prinsipil B]',
        mnemonic: 'Bagian kalimat antitesis kausal paling klasik dalam pidato publik Amerika (ingat pidato Bulan JFK!).',
        speakText: 'not because [A], but because [B]',
      },
      {
        symbol: 'Antimetabole / Chiasmus',
        reading: '/ˌæntɪməˈtæbəli ... kaɪˈæzməs/',
        meaning: 'Pembalikan cermin urutan kata kunci (`A -> B` menjadi `B -> A`) untuk daya ingat abadi',
        mnemonic: 'Contoh teknis modern: \'We shape our tools, and thereafter our tools shape us\' (Marshall McLuhan/Culkin).',
        speakText: 'Antimetabole / Chiasmus',
      },
      {
        symbol: 'anaphora (deliberate repetition)',
        reading: '/əˈnæfərə/',
        meaning: 'Pengulangan frasa pembuka yang disengaja pada bagian kalimat berurutan untuk membangun gelombang emosi/logika',
        mnemonic: '\'To invest in water is to invest in health; to neglect it is to mortgage our future\'.',
        speakText: 'anaphora (deliberate repetition)',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-010',
      title: 'Behaghel\'s Law of Increasing Terms (Tricolon Cadence) & Causal Antithesis',
      formula: 'Short [1-2 words], Medium [2-3 words], and Longest Climactic Phrase [4-6 words]',
      formulaReading: 'Data must be clean, auditable, and cryptographically verifiable across borders.',
      explanation: '*Hukum Behaghel* (*end-weight principle*) dalam stilistika bahasa Inggris menyatakan bahwa telinga manusia mengharapkan unsur paling ringan berada di depan dan unsur paling berbobot berada di ujung kalimat. Menempatkan kata pendek sepele sesudah dua frasa panjang merusak irama kalimat penutup esai Anda!',
      examples: [
        {
          jp: 'Resilient cities demand permeable parks, elevated transit, and community-governed flood insurance.',
          reading: '/rɪˈzɪljənt ˈsɪtiz dɪˈmænd ˈpɜːrmiəbəl pɑːrks ˈɛləˌveɪtɪd ˈtrænzɪt ænd kəˈmjuːnəti ˈɡʌvərnd flʌd ɪnˈʃʊrəns/',
          id: 'Kota yang tangguh menuntut taman berdaya serap air, transportasi layang, serta asuransi banjir yang dikelola warga.',
        },
        {
          jp: 'Metrics should serve clinical judgment, never clinical judgment serve metrics.',
          reading: '/ˈmɛtrɪks ʃʊd sɜːrv ˈklɪnɪkəl ˈdʒʌdʒmənt ˈnɛvər ˈklɪnɪkəl ˈdʒʌdʒmənt sɜːrv ˈmɛtrɪks/',
          id: 'Metrik semestinya melayani pertimbangan klinis, jangan pernah pertimbangan klinis yang diperbudak metrik.',
        },
      ],
    },
    contrastiveTip: 'Saat menyunting kalimat terakhir esai bahasa Inggris atau SoP beasiswa, bacalah dalam hati: pastikan anggota ketiga dari daftar `A, B, and C` adalah yang paling kaya dan panjang suku katanya!',
  },
  'en-us-c2-u10-diskusi-toefl': {
    headline: 'Menutup Pidato Kunci, Wawancara Beasiswa & Esai dengan Kesan Mendalam',
    subtitle: 'Empat pasangan kata alami visi kepemimpinan yang memadukan seluruh struktur B2–C2 menjadi penutup yang matang, inspiratif, dan bebas klise murahan.',
    items: [
      {
        symbol: 'rise to the occasion',
        reading: '/raɪz tə ði əˈkeɪʒən/',
        meaning: 'Bangkit membuktikan kapasitas terbaik saat dihadapkan pada tantangan sejarah yang besar',
        mnemonic: 'Idiom klasik pidato kepemimpinan Amerika di momen krisis atau transisi besar.',
        speakText: 'rise to the occasion',
      },
      {
        symbol: 'chart a [pragmatic] course',
        reading: '/tʃɑːrt ə ... kɔːrs/',
        meaning: 'Memetakan haluan / arah kebijakan strategis menembus perairan yang belum terpetakan',
        mnemonic: 'Metafora navigasi maritim yang sangat anggun untuk esai kebijakan publik dan strategi korporat.',
        speakText: 'chart a [pragmatic] course',
      },
      {
        symbol: 'leave an indelible mark on',
        reading: '/liːv ən ɪnˈdɛləbəl mɑːrk ɑːn/',
        meaning: 'Meninggalkan jejak pengaruh abadi yang tak terhapuskan pada suatu bidang atau generasi',
        mnemonic: 'Indelible = tinta yang tak bisa dihapus (/ɪnˈdɛləbəl/).',
        speakText: 'leave an indelible mark on',
      },
      {
        symbol: 'bridge the divide between',
        reading: '/brɪdʒ ðə dɪˈvaɪd bɪˈtwiːn/',
        meaning: 'Menjembatani jurang pemisah antara (riset dan kebijakan / pusat dan daerah)',
        mnemonic: 'Misi inti hampir setiap penerima beasiswa LPDP, Fulbright, Chevening, dan pemimpin teknologi global!',
        speakText: 'bridge the divide between',
      },
    ],
    grammarSummary: {
      code: 'GP-EN-C2-010',
      title: 'Master Synthesis: Combining Pembalikan Urutan Mahir, Framing & Antithesis',
      formula: 'If [Generation/Institution] is to rise to the occasion, we must chart a course defined not by [Fear], but by [Vision].',
      formulaReading: 'Bridging the divide between lab and clinic leaves an indelible mark on public health.',
      explanation: 'Anda kini memegang seluruh pola kalimat tertinggi bahasa Inggris Amerika: Pengandaian Resmi Tanpa \'If\', Pola Resmi \'is/are to + V1\', *Nominative Absolutes*, Pola \'Meskipun\' dengan Kata Sifat di Depan, *Evidential Passives*, *Formulaic pola anjuran V1 murni*, Sisipan Perangkum & Pengulang Kata Kunci, *Precision Framing*, *Three-Word Verbs*, dan *Rhetorical Antithesis*. Gunakan secara selektif—satu atau dua struktur puncak per paragraf membuat tulisan Anda bersinar alami!',
      examples: [
        {
          jp: 'If our generation is to rise to the climate occasion, we must bridge the divide between frontier science and municipal finance.',
          reading: '/ɪf ˈaʊər ˌdʒɛnəˈreɪʃən ɪz tə raɪz tə ðə ˈklaɪmət əˈkeɪʒən wi mʌst brɪdʒ ðə dɪˈvaɪd bɪˈtwiːn frʌnˈtɪr ˈsaɪəns/',
          id: 'Jika generasi kita memang hendak bangkit menjawab tantangan iklim, kita wajib menjembatani jurang antara sains garis depan dan pembiayaan daerah.',
        },
        {
          jp: 'Charting a prudent course requires rules at once flexible enough for startups and firm enough against abuse.',
          reading: '/ˈtʃɑːrtɪŋ ə ˈpruːdənt kɔːrs rɪˈkwaɪərz ruːlz æt wʌns ˈflɛksəbəl ɪˈnʌf fɔːr ˈstɑːrtˌʌps ænd fɜːrm ɪˈnʌf əˈɡɛnst əˈbjuːs/',
          id: 'Memetakan arah kebijakan yang bijak menuntut aturan yang sekaligus cukup lentur bagi usaha rintisan dan cukup tegas terhadap penyalahgunaan.',
        },
      ],
    },
    contrastiveTip: 'Bedakan pelafalan kata benda \'abuse\' berakhiran /s/ (/əˈbjuːs/) vs. kata kerja \'abuse\' berakhiran /z/ (/əˈbjuːz/)!',
  },
}
