# Product Requirements Document (PRD) - CodeAbroad
**Version:** 3.0 (Global Multi-Country Language Mastery Platform, Anki SRS & Diagnostic Exam Engine)  
**Status:** In Active Development (v0.4.0)  
**Last Updated:** 2026-11-09  

---

## 🧭 1. Executive Summary, Philosophy & Pedagogical Foundations

### 1.1 Latar Belakang Masalah (The Core Industry Problem)
Industri pembelajaran bahasa digital saat ini terbelah menjadi tiga kubu yang terfragmentasi, dan masing-masing memiliki kelemahan mendasar:

1. **The "Duolingo Illusion" (Gamifikasi Dangkal & Hafalan Mekanis):**  
   Banyak aplikasi bahasa mengutamakan *retensi engagement* (streak dan animasi lucu) di atas *pemahaman kaidah linguistik*. Pengguna menghafal kalimat acak ("apel itu hijau", "kucing minum susu") secara mekanis melalui tebak gambar berulang-ulang. Akibatnya, setelah 300 hari menjaga streak, pengguna tetap tidak mampu menyusun kalimat sendiri di dunia nyata karena **tidak pernah diajarkan peran sintaksis kalimat, fungsi partikel/kasus gramatikal, dan logika perubahan tenses/konjugasi**.
2. **The "Anki Friction" (Metode Ilmiah Kuat, Namun Kering & Minim Kurikulum):**  
   Sistem *Spaced Repetition (SRS)* seperti Anki secara ilmiah terbukti paling efektif untuk retensi memori jangka panjang (*Ebbinghaus Forgetting Curve*). Namun, antarmukanya kaku, membutuhkan kurasi kartu manual yang melelahkan, tidak memiliki alur kurikulum interaktif, dan tidak memberikan penjelasan instan terhadap kesalahan tata bahasa.
3. **The "Official Exam Blindness" (Ketakutan Ujian Sertifikasi Berbayar):**  
   Ujian sertifikasi bahasa resmi internasional (**JLPT 🇯🇵 N5–N1, Goethe-Zertifikat / TestDaF 🇩🇪 A1–C1, IELTS / Cambridge 🇬🇧/🇺🇸 B1–C2, HSK 🇨🇳 1–6, DELF 🇫🇷 A1–C1**) memiliki biaya pendaftaran yang mahal (\$100–\$250 per ujian) dan jadwal tes yang sangat terbatas (hanya 1–2 kali per tahun). Pembelajar sering kali masuk ruang ujian secara "buta" tanpa tahu apakah kemampuan riil mereka sudah memenuhi passing score resmi atau belum.
4. **The "Gimmick Fatigue" (Metafora Fiktif yang Membingungkan):**  
   Penggunaan metafora fiktif (seperti nama stasiun kereta, tiket ekspres, stasiun Shinjuku) yang dipaksakan membuat pengguna bingung membedakan antara progres kurikulum dengan gimik aplikasi. Pembelajar membutuhkan **alur kurikulum universal yang bersih, bertaraf internasional, dan langsung mencerminkan standar ujian resmi dunia**.

---

### 1.2 Misi Produk & Cakupan 6 Track Bahasa Resmi (The CodeAbroad Mission)
**CodeAbroad** hadir sebagai platform pembelajaran bahasa bertaraf internasional yang dirancang secara modular untuk mempersiapkan talenta global menembus karir, studi, dan kehidupan di 6 destinasi bahasa utama dunia:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CODEABROAD 6 GLOBAL DESTINATION TRACKS                                        │
├──────────────────┬──────────────────┬──────────────────┬──────────────────┬──────────────────┬──────────────────┤
│   🇯🇵 JEPANG      │ 🇬🇧 INGGRIS (UK)  │ 🇺🇸 INGGRIS (US)  │    🇩🇪 JERMAN     │   🇨🇳 MANDARIN    │    🇫🇷 PRANCIS    │
│  (Tokyo Track)   │  (London Track)  │(Silicon Valley)  │  (Berlin Track)  │ (Shanghai Track) │  (Paris Track)   │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ • JLPT N5 – N1   │ • IELTS 5.0–8.5  │ • TOEFL iBT      │ • Goethe A1 – C1 │ • HSK 1 – 6      │ • DELF A1 – C1   │
│ • Kanji, Kana    │ • UK Spelling    │ • US Spelling    │ • Artikel Kasus  │ • Hanzi & Pinyin │ • Gender Benda   │
│   & Romaji       │   (colour/lift)  │   (color/elev.)  │   (Der/Die/Das)  │   4 Nada (Tones) │ • Passé Composé  │
│ • Partikel SOV   │ • Non-Rhotic RP  │ • Rhotic Flap-T  │ • V2 & Perfekt   │ • Aspek '了'     │ • Aksen é/è/ç    │
│ • Tiket CGK✈️HND  │ • Tiket CGK✈️LHR │ • Tiket CGK✈️SFO │ • Tiket CGK✈️BER │ • Tiket CGK✈️PEK │ • Tiket CGK✈️CDG │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

> *"Memberdayakan pembelajar global untuk mencapai kemahiran bahasa yang mendalam (True Linguistic Mastery), retensi memori permanen bebas lupa, dan kesiapan ujian sertifikasi resmi internasional melalui gamifikasi 3D taktil yang menyenangkan, pemahaman tata bahasa visual, dan simulasi diagnostik yang presisi."*

Tiga pilar filosofis utama CodeAbroad:
* 🎮 **The Delight of Duolingo 3D Tactile Physics:**  
  Menghadirkan kenikmatan belajar harian dengan tombol fisik berkedalaman 4px, alur roadmap serpentine interaktif, partikel konfeti kemenangan, synthesizer audio prosedural Web Audio API tanpa beban kuota, serta maskot pendamping setia (**Kodi**).
* 🧠 **The Pedagogical Rigor of Anki SRS (SuperMemo SM-2):**  
  Menghilangkan kebiasaan lupa (*Eliminating the Forgetting Curve*). Setiap kali pengguna melakukan kesalahan pada latihan harian, butir soal tersebut secara otomatis masuk ke antrean kartu memori *Spaced Repetition* dengan penyesuaian interval dinamis (`ease_factor` & `interval_days`).
* 🏛️ **The Standard of Official International Certifications:**  
  Tidak ada tingkatan semu. Seluruh level kurikulum dipetakan secara ketat ke standar resmi dunia: **JLPT (N5–N1)** untuk Jepang, **IELTS / Cambridge (B1–C2)** untuk Inggris UK, **TOEFL (A1–C2)** untuk Inggris US, **Goethe (A1–C1)** untuk Jerman, **HSK (1–6)** untuk Mandarin, dan **DELF (A1–C1)** untuk Prancis.

---

### 1.3 Landasan Ilmu Kognitif & Pedagogi Bahasa (Cognitive Science Foundations)

CodeAbroad dibangun di atas 4 teori pemerolehan bahasa modern yang diterapkan secara universal di seluruh bahasa target:

#### A. Mastery Over Memorization: Balok Sintaksis Berkode Warna (Color-Coded Syntax Blocks)
Alih-alih menghafal kalimat secara mekanis, pengguna diajarkan memahami **arsitektur kalimat** menggunakan balok peran tata bahasa universal:
* 🟦 **Biru (Topik / Subjek):** Menandai entitas pelaku (misal: わたし, *Ich*, *She*, *我*, *Je*).
* 🟩 **Hijau (Partikel / Kasus / Preposisi):** Semen perekat hubungan kata (misal: は/に/で, *auf/in*, *for/since*, *在*, *à/de*).
* 🟧 **Oranye (Objek / Keterangan Waktu & Tempat):** Target aksi atau latar (misal: 東京, *Berlin*, *London*, *茶*, *Paris*).
* 🟪 **Ungu (Predikat / Kata Kerja & Tenses):** Mesin aksi beserta perubahan konjugasinya (misal: 行きます, *habe... getrunken*, *has lived*, *喝了*, *suis allé*).

#### Penerapan Balok Sintaksis Lintas Bahasa Target:
1. **Jepang 🇯🇵 (Struktur SOV & Partikel):**  
   `[わたし (Biru)]` + `[は (Hijau)]` + `[とうきょう (Oranye)]` + `[に (Hijau)]` + `[いきます (Ungu)]`  
   *Logika visual:* Partikel penanda arah 'に' selalu mengunci kata tujuan sebelum kata kerja.
2. **Jerman 🇩🇪 (Aturan Verb-Second / V2 & Das Perfekt):**  
   `[Ich (Biru)]` + `[habe (Ungu)]` + `[einen Kaffee (Oranye)]` + `[in Berlin (Oranye)]` + `[getrunken (Ungu)]`  
   *Logika visual:* Kata kerja bantu (*habe*) menempati posisi ke-2, sementara *Partizip II* (*getrunken*) dikirim ke akhir kalimat.
3. **Inggris 🇬🇧/🇺🇸 (Struktur SVO & Aspectual Tense):**  
   `[Sarah (Biru)]` + `[has lived (Ungu)]` + `[in London (Oranye)]` + `[for three years (Oranye)]`  
   *Logika visual:* Preposisi durasi *for* mengunci keterangan rentang waktu untuk menghubungkan masa lalu ke masa kini.
4. **Mandarin 🇨🇳 (Struktur SVO & Partikel Aspek):**  
   `[我 (Biru)]` + `[在咖啡馆 (Oranye)]` + `[喝了 (Ungu)]` + `[一杯茶 (Oranye)]`  
   *Logika visual:* Keterangan tempat mendahului kata kerja, dan partikel aspek '了' melekat langsung pada kata kerja penanda selesainya aksi.

---

#### B. Keseimbangan Holistik 4 Pilar Kemahiran Lintas Bahasa
1. **Reading:**
   * *Jepang:* Membaca Kanji dengan Furigana Ruby dinamis (`<ruby>`).
   * *Jerman:* Membaca artikel spesifik (*der/die/das*) dan huruf khusus (*ä, ö, ü, ß*).
   * *Mandarin:* Membaca karakter Hanzi dengan bantuan Pinyin di atasnya.
   * *Inggris & Prancis:* Membaca teks otentik artikel berita dan esai formal.
2. **Listening:**
   * Audio penutur asli (*Native Audio*) dengan aksen natural: Aksen Tokyo standar, *Hochdeutsch* Jerman, Aksen British/American, Mandarin Beijing standar, dan Bahasa Prancis standar.
   * Kontrol kecepatan dinamis (0.8x untuk pemula, 1.0x normal, 1.2x untuk melatih ketajaman ujian).
3. **Writing:**
   * Menyusun balok kalimat, melengkapi konjugasi tenses, dan menulis dengan toleransi ortografi multi-aksara.
4. **Speaking:**
   * Evaluasi fonetik suara via Web Speech API.
   * Panduan intonasi: *Pitch Accent* (Jepang), Kontur 4 Nada Pinyin (Mandarin), *Stress Markers* IPA (Inggris), Vokal Umlaut (Jerman).

---

#### C. Evaluasi Cerdas & Remediasi Instan (The Kodi AI Coach Lintas Bahasa)
Ketika pengguna menjawab salah, sistem membaca `diagnostic_rubric` untuk memberikan edukasi langsung sesuai kaidah bahasa terkait:

* 🇯🇵 **Kasus Jepang (Jebakan Partikel):**  
  Pengguna memilih `で` alih-alih `に` untuk *"Saya pergi ke Tokyo"*.  
  *Kodi:* *"Kamu memilih で. Hati-hati! Partikel で digunakan untuk tempat aktivitas (misal: makan di resto), sedangkan arah tujuan pergerakan wajib menggunakan partikel に atau へ."*
* 🇩🇪 **Kasus Jerman (Jebakan Kasus Akkusativ vs Dativ):**  
  Pengguna memilih *"auf dem Tisch"* alih-alih *"auf den Tisch"* untuk kalimat meletakkan cangkir ke atas meja.  
  *Kodi:* *"Kamu memilih dem (Dativ). Ingat aturan Wechselpräposition: jika menyatakan perpindahan posisi / gerakan ke suatu tempat, gunakan Akkusativ (den Tisch). Dativ hanya untuk posisi yang sudah diam!"*
* 🇬🇧 **Kasus Inggris (Jebakan Present Perfect vs Past Simple):**  
  Pengguna memilih *"I have seen him yesterday"*.  
  *Kodi:* *"Hati-hati! Kata keterangan waktu lampau spesifik ('yesterday', 'last night') tidak boleh menggunakan Present Perfect. Gunakan Past Simple: 'I saw him yesterday'."*
* 🇨🇳 **Kasus Mandarin (Jebakan Kata Satuan / Measure Words):**  
  Pengguna memilih *"一个人"* vs *"一本书"* atau salah menggunakan kata satuan umum '个' untuk benda lembaran.  
  *Kodi:* *"Untuk benda lembaran tipis seperti tiket atau kertas (票, 纸), gunakan kata satuan 张 (zhāng), bukan 个 (gè)!"*

---

#### D. Toleransi Multi-Aksara Tanpa Hukuman Salah (Multi-Script Flexibility)
Kolom `acceptable_answers` dirancang modular untuk menampung seluruh keragaman aksara dunia:
* **Jepang:** Menerima versi Kanji `私は学生です` maupun Hiragana `わたしはがくせいです` (100% Benar).
* **Mandarin:** Menerima karakter Simplified `中国` maupun Traditional `中國`, serta Pinyin dengan nada `zhōng guó`.
* **Inggris:** Menerima ejaan British (`colour`, `theatre`, `programme`) maupun American (`color`, `theater`, `program`).
* **Jerman:** Menerima penulisan `groß` maupun `gross` jika keyboard pengguna tidak memiliki tombol Eszett (ß).

---

#### E. Prediktor Kesiapan Ujian Resmi (The Readiness Exam Predictor)
Simulasi ujian diagnostik sebelum pengguna membayar ujian resmi (\$100–\$250):
* 🇯🇵 **JLPT Mock Exam:** Seksi *Moji/Goi*, *Bunpo/Dokkai*, dan *Choukai* (audio 1x putar).
* 🇩🇪 **Goethe Mock Exam:** Seksi *Lesen*, *Hören*, *Schreiben*, dan *Sprechen*.
* 🇬🇧 **IELTS Mock Exam:** Seksi *Academic Reading*, *Listening (Multi-Accent)*, *Writing Task 1 & 2*, dan *Speaking Interview*.
* 🇨🇳 **HSK Mock Exam:** Seksi *Tīnglì* (Mendengar), *Yuèdú* (Membaca), dan *Xiězuò* (Menulis).
* Menghasilkan **Laporan Kesiapan Presisi** dengan probabilitas kelulusan riil (misal: *"Probabilitas Lulus Goethe B1: 81%"*).

---

### 1.4 Delapan Metodologi Pembelajaran Ilmiah (The 8 Scientific Pedagogical Methodologies)

CodeAbroad memadukan 8 metodologi pedagogi teruji dari ranah sains kognitif dan akuisisi bahasa untuk menjamin pemahaman nyata dan retensi permanen:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           8 METODOLOGI PEDAGOGI ILMIAH CODEABROAD                                │
├──────────────────────────┬───────────────────────────────────────────────────────────────────────┤
│ 1. Spaced Repetition     │ Pengulangan berjarak adaptif (SM-2) tepat saat kurva memori menurun.  │
│ 2. Active Recall         │ Memaksa otak memanggil ingatan aktif (bukan membaca pasif).           │
│ 3. Syntax Scaffolding    │ Balok berkode warna mereduksi beban kognitif struktur asing (SOV/V2). │
│ 4. Multi-Sensory         │ Aktivasi 4 indera serentak: Telinga, Mata, Tangan, dan Mulut.         │
│ 5. Pushed Output         │ Keseimbangan Comprehensible Input (Krashen) & Produksi Aktif (Swain). │
│ 6. Formative Feedback    │ Koreksi instan berbasis logika via Kodi (mencegah kesalahan membatu). │
│ 7. Microlearning Habits  │ Ritual mikro 15 menit konsisten bebas burnout (Atomic Habits).        │
│ 8. Mastery Benchmark     │ Penguasaan bertingkat 80% & simulasi ujian patokan resmi dunia.       │
└──────────────────────────┴───────────────────────────────────────────────────────────────────────┘
```

1. **Metode Spaced Repetition System (SRS) — Pengulangan Berjarak Ilmiah (SuperMemo SM-2):**
   * *Mekanisme:* Materi diulang bukan setiap hari secara monoton, melainkan dengan jeda waktu adaptif ($1 \to 3 \to 6 \to 12 \to 30$ hari) tepat saat kurva daya ingat (*Ebbinghaus Forgetting Curve*) mulai menurun.
   * *Manfaat Pedagogis:* Mentransfer kosakata dan kaidah tata bahasa dari memori kerja jangka pendek (*Short-Term Memory*) menjadi memori permanen (*Long-Term Potentiation*) secara efisien.

2. **Metode Active Recall / Retrieval Practice — Pemanggilan Memori Aktif:**
   * *Mekanisme:* Otak dipaksa bekerja memeras ingatan sendiri untuk menjawab kalimat rumpang atau menyusun balok kata tanpa melihat kunci jawaban terlebih dahulu.
   * *Manfaat Pedagogis:* Riset kognitif membuktikan bahwa *retrieval practice* melipatgandakan kekuatan retensi hingga 300% dibandingkan membaca ulang teks secara pasif.

3. **Metode Visual Syntax Scaffolding — Perancah Sintaksis Berkode Warna:**
   * *Mekanisme:* Kalimat asing didekonstruksi menjadi balok fungsional (🟦 Subjek, 🟩 Partikel/Kasus, 🟧 Objek/Latar, 🟪 Predikat/Tenses) dengan aturan keterikatan magnetik.
   * *Manfaat Pedagogis:* Menerapkan *Cognitive Load Theory* (Sweller). Mereduksi beban memori kerja pembelajar pemula saat menghadapi struktur urutan kata yang terbalik dari bahasa ibu (misal: SOV Jepang atau V2 Jerman).

4. **Metode Multi-Sensory 4-Pillar Learning — Pembelajaran Multi-Indera Terpadu:**
   * *Mekanisme:* Mengintegrasikan 4 sensori secara seimbang dalam setiap materi: Auditori (Mendengar audio native), Visual (Membaca Kanji/aksara + Furigana), Kinestetik/Taktil (Menyusun balok 3D), dan Vokal/Artikulasi (Melafalkan ke mikrofon).
   * *Manfaat Pedagogis:* Membangun koneksi sinapsis ganda di otak (*Dual-Coding Theory*). Jika telinga lupa, tangan masih mengingat urutan balok; jika mata lupa, memori otot lidah masih mengingat artikulasinya.

5. **Metode Pushed Output & Comprehensible Input — Keseimbangan Input-Output:**
   * *Mekanisme:* Memadukan *Krashen’s Comprehensible Input ($i+1$)* dan *Swain’s Pushed Output Hypothesis*. Pembelajar tidak hanya mengonsumsi konten pasif, melainkan dipaksa memproduksi kalimat secara aktif melalui *Speaking Repeat* dan *Dialogue Roleplay*.
   * *Manfaat Pedagogis:* Menghilangkan sindrom *"paham saat mendengarkan, tetapi membeku saat harus berbicara"*.

6. **Metode Immediate Formative Feedback — Koreksi Diagnostik Berbasis Logika:**
   * *Mekanisme:* Saat pengguna keliru, sistem membaca rubrik diagnostik (`diagnostic_rubric`) dan Kodi langsung membedah letak kekeliruan berpikirnya saat itu juga (*Point-of-Performance Remediation*).
   * *Manfaat Pedagogis:* Mencegah *fossilization* (kekeliruan tata bahasa yang membatu permanen karena tidak pernah dikoreksi logikanya).

7. **Metode Microlearning & Habit Stacking — Ritual Mikro 15 Menit:**
   * *Mekanisme:* Memecah silabus sertifikasi internasional menjadi porsi mikro harian berdurasi 15 menit, dikombinasikan dengan penguat kebiasaan (*Atomic Habits*: Api Streak dan Peti Emas 3D).
   * *Manfaat Pedagogis:* Menurunkan hambatan inersia belajar, menjaga konsistensi jangka panjang tanpa risiko *burnout*.

8. **Metode Mastery Learning & Benchmark Testing — Penguasaan Bertingkat & Ujian Patokan:**
   * *Mekanisme:* Mengunci akses materi lanjutan via *Boss Battle Checkpoint* (syarat kelulusan $\ge 80\%$) dan memvalidasi kesiapan akhir menggunakan *Diagnostic Mock Exam* berstandar sertifikasi resmi (JLPT, IELTS, Goethe, HSK).
   * *Manfaat Pedagogis:* Menghilangkan tebak-tebakan kesiapan ujian dan memberikan tolok ukur kompetensi yang objektif.

---

## 🔄 2. End-to-End User Experience Lifecycle (Alur Komprehensif)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               THE COMPREHENSIVE LEARNER LIFECYCLE                                │
├───────────────────┬─────────────────────┬────────────────────┬──────────────────┬────────────────┤
│      STAGE 1      │       STAGE 2       │      STAGE 3       │     STAGE 4      │    STAGE 5     │
│  Onboarding &     │   The 15-Minute     │   Unit Mastery     │  The Diagnostic  │ Multi-Language │
│ Placement Compass │ Daily Mastery Loop  │  Gatekeeper (Boss) │ Mock Exam & Prep │ & Level Leap   │
├───────────────────┼─────────────────────┼────────────────────┼──────────────────┼────────────────┤
│ • Auth & Profil   │ • 3-Min Anki SRS    │ • Tantangan        │ • Simulasi Ujian │ • Naik Level   │
│ • Pilih Bahasa    │ • 8-Min Visual      │   Sintesis Bab     │   Resmi (Timer)  │   (N5➔N4, A1➔A2)│
│ • Target Ujian    │   Lesson Node       │ • Zero Hints       │ • Skor 4 Pilar   │ • Switch ke    │
│ • Placement Test  │ • 3-Min Speaking    │ • Syarat Lulus 80% │ • Preskripsi     │   Bahasa Lain  │
│   (Skip Level)    │ • Klaim Peti Emas   │ • Buka Kunci Unit  │   Remediasi AI   │ • Zero Reset   │
│ • 3D Boarding Pass│   & Streak Api      │   Berikutnya       │ • Garansi Lulus  │   Collision    │
└───────────────────┴─────────────────────┴────────────────────┴──────────────────┴────────────────┘
```

---

### 2.1 Stage 1: Onboarding, Compass Penempatan & Boarding Pass 3D

1. **Registrasi Cepat & Seamless Auto-Login:**
   * Pengguna mendaftar dengan Email & Password (enkripsi Bcrypt).
   * Token JWT dikeluarkan seketika, langsung mengalirkan pengguna ke Wizard Penempatan (*Zero Friction*).
2. **Langkah A: Pemilihan Destinasi Bahasa (Language Picker):**
   * Pengguna disajikan kartu 3D visual 5 destinasi utama:
     * 🇯🇵 **Jepang** (`ja`): JLPT N5 – N1 • Aksara: Kanji, Hiragana, Katakana.
     * 🇩🇪 **Jerman** (`de`): Goethe / TestDaF A1 – C1 • Aksara: Latin & Umlaut (ä, ö, ü, ß).
     * 🇬🇧/🇺🇸 **Inggris** (`en-gb` / `en-us`): IELTS 5.0–8.5 / TOEFL • Aksara: Latin UK/US.
     * 🇨🇳 **Mandarin** (`zh`): HSK 1 – 6 • Aksara: Hanzi (Simplified/Traditional) & Pinyin.
     * 🇫🇷 **Prancis** (`fr`): DELF A1 – C1 • Aksara: Latin dengan aksen (é, è, ç).
3. **Langkah B: Penentuan Target Sertifikasi Resmi (Proficiency Target Compass):**
   * Pengguna memilih ambisi konkrit mereka:
     * *Jepang:* JLPT N5 (Pemula), N4 (SSW Visa), N3 (Transisi), N2 (Kerja Profesional/Kuliah), N1 (Native Mastery).
     * *Jerman:* Goethe A1 (Syarat Visa Pasangan), A2, B1 (Syarat Kerja Ausbildung/Kerja Terampil), B2 (Universitas/IT Engineer), C1 (Eksekutif).
     * *Inggris:* IELTS 6.0 (Undergraduate), 7.0 (Postgraduate), 8.0+ (Global Tech Lead).
     * *Mandarin:* HSK 2, HSK 4 (Beasiswa China/Taiwan), HSK 5–6 (Bisnis & Manufaktur).
4. **Langkah C: Jalur Penempatan Diagnostik (The Placement Fork):**
   * 🟢 **Opsi 1: "Saya Benar-Benar Pemula (Mulai dari Nol)"**:
     Langsung diarahkan ke Unit 1 Lesson 1 bahasa tersebut (Pengenalan Aksara & Kalimat Subjek Dasar).
   * ⚡ **Opsi 2: "Saya Sudah Punya Dasar (Tes Penempatan 10 Menit)"**:
     * Mengerjakan 15 soal adaptif.
     * Jika meraih skor $\ge 80\%$ pada materi level awal (misal: N5 untuk Jepang atau A1 untuk Jerman), sistem secara otomatis menandai seluruh unit level awal sebagai *Completed* dan membuka gerbang awal level berikutnya (JLPT N4 atau CEFR A2).
5. **Langkah D: Penerbitan Tiket Fisik 3D (The Boarding Pass Milestone):**
   * Kodi menyerahkan tiket penerbangan interaktif 3D sesuai destinasi pilihan:
     * 🇯🇵 Jakarta ➔ Tokyo (`CGK ✈️ HND`)
     * 🇩🇪 Jakarta ➔ Berlin (`CGK ✈️ BER`)
     * 🇬🇧 Jakarta ➔ London (`CGK ✈️ LHR`)
     * 🇺🇸 Jakarta ➔ San Francisco (`CGK ✈️ SFO`)
     * 🇨🇳 Jakarta ➔ Beijing (`CGK ✈️ PEK`)
     * 🇫🇷 Jakarta ➔ Paris (`CGK ✈️ CDG`)
   * Efek audio chimes berdentang, hadiah selamat datang **+50 XP** diberikan, dan pengguna mendarat di Dashboard Roadmap Utama.

---

### 2.1.1 Spesifikasi Algoritma Tes Penempatan Adaptif (Adaptive Placement Test)
Bagi pengguna yang memilih *"Saya Sudah Punya Dasar"*, sistem menjalankan tes penempatan adaptif 10 menit dengan mekanisme:
* **Struktur Soal (15 Butir Dinamis):**
  * Butir 1–5: Tingkat Dasar (JLPT N5 / CEFR A1 / HSK 1) — Kosakata, partikel dasar, dan listening singkat.
  * Butir 6–10: Tingkat Menengah Bawah (JLPT N4 / CEFR A2 / HSK 2) — Konjugasi tenses lampau, klausa penghubung, artikel kasus.
  * Butir 11–15: Tingkat Transisi Menengah (JLPT N3 / CEFR B1 / HSK 3) — Pemahaman paragraf kerja, tenses majemuk, keigo dasar.
* **Logika Penyesuaian Dinamis (Branching Logic):**
  * Jika pengguna salah 3 kali berturut-turut pada soal tingkat N5/A1, tes langsung dihentikan lebih awal (*early stop*) untuk mencegah frustrasi, dan pengguna ditempatkan di Unit 1 Level Pemula.
  * Jika pengguna meraih akurasi $\ge 80\%$ pada soal kelompok level tertentu, seluruh unit di level tersebut langsung ditandai `is_completed: true` di database, dan `user_language_enrollments.current_level_id` otomatis dimajukan ke level berikutnya!

---

### 2.2 Stage 2: The 15-Minute Daily Mastery Ritual (Siklus Harian)

Setiap hari, pengguna disambut dengan siklus belajar harian berdurasi 15 menit yang terbukti secara kognitif memaksimalkan retensi memori tanpa memicu kejenuhan (*anti-burnout*):

#### ⏰ Menit 00–03: Pemanasan Kartu Memori Anki SRS (Spaced Retrieval Practice)
* Pengguna membuka tab **"Review Harian (Anki Deck)"**.
* Backend mengeksekusi query kilat mengambil kartu yang jatuh tempo hari ini:  
  `SELECT * FROM user_srs_reviews WHERE user_id = $1 AND next_review_at <= NOW()`
* Pengguna disajikan 10–15 kartu memori lintas bahasa sesuai track aktif:
  * 🇯🇵 *Jepang:* Kanji `東京` ➔ Cara baca `とうきょう` & arti.
  * 🇩🇪 *Jerman:* Gender kata benda: `___ Tisch` ➔ Balik kartu: `der Tisch` (Maskulin).
  * 🇬🇧 *Inggris:* Bentuk irregular verb: `freeze` ➔ `froze` ➔ `frozen`.
  * 🇨🇳 *Mandarin:* Karakter `谢谢` ➔ Pinyin nada ke-4 `xièxie`.
* Penilaian dengan 4 tombol taktil SM-2: 🔴 Lupa (1 hari), 🟠 Sulit (3 hari), 🟢 Bagus (6 hari), 🔵 Mudah (12 hari).

#### ⏰ Menit 03–11: Node Kurikulum Harian (Interactive Visual Lesson)
* Pengguna membuka Roadmap. Node aktif berdenyut dengan ring biru listrik dan popover:  
  `"Part 3: [Nama Materi] • +15 XP"`.
* Masuk ke **Learn Workspace**:
  1. **Micro-Grammar Introduction (2 menit):**
     * Mempelajari rumus sintaksis visual berkode warna (Biru = Subjek, Hijau = Partikel/Preposisi, Oranye = Objek/Latar, Ungu = Predikat/Tenses).
     * Mendengarkan audio pengucapan penutur asli (*Native Audio*).
  2. **Interactive 4-Pillar Exercises (6 menit):**
     * **Latihan 1 (Reading):** Membaca teks otentik dengan bantuan aksara.
     * **Latihan 2 (Listening):** Mendengarkan klip suara native dan memilih makna yang tepat.
     * **Latihan 3 (Writing - Sentence Builder):** Menyusun balok kata fisik sesuai aturan urutan kata (SOV di Jepang, V2 di Jerman, SVO di Inggris & Mandarin).
     * **Latihan 4 (Fill-in-the-Blank):** Melengkapi partikel/artikel/konjugasi waktu.
       * *Skenario Kesalahan:* Jika keliru, bottom-sheet Kodi muncul seketika memberikan penjelasan edukatif sesuai kaidah linguistik bahasa tersebut, dan otomatis menyuntikkan soal ke antrean kartu Anki besok!

#### ⏰ Menit 11–14: Latihan Bicara Aktif (Active Speech & Pushed Output)
* Pengguna menekan tombol mikrofon 3D tebal dan melafalkan kalimat target.
* Web Speech API menangkap ucapan dan mencocokkan transkrip fonetik dengan toleransi aksara.
* Jika akurasi $\ge 75\%$, tombol menyala hijau terang dengan suara keberhasilan taktil, melatih kepercayaan diri berbicara sebelum menghadapi wawancara atau ujian lisan resmi.

#### ⏰ Menit 14–15: Selebrasi Kemenangan, Peti Emas & Streak Harian
* Konfeti visual berhamburan di layar!
* XP bertambah +15 XP, menggenapkan target harian 50 XP.
* **Peti Emas 3D (Golden Chest) berguncang**:
  * Pengguna mengklik peti, peti terbuka dengan animasi fisika 3D dan audio synthesizer fanfare.
  * Hadiah klaim: **+10 Gems Biru** dan **+20 XP Bonus**.
* Api Streak berkobar menyala dengan efek audio desisan api hangat. Kebiasaan harian berhasil dirawat!

---

### 2.3 Stage 3: Unit Mastery Gatekeeper ("Boss Battle Checkpoint")

* Di akhir setiap Unit (4–6 lessons), terdapat **Node Gerbang Checkpoint**:
  * **Ujian Sintesis Tanpa Bantuan:** 10 soal komprehensif yang menguji kombinasi seluruh topik grammar di unit tersebut.
  * **Zero Hints & No Undo:** Fitur petunjuk dinonaktifkan untuk menguji pemahaman orisinal.
  * **Ambang Batas Kelulusan 80%:** Pengguna wajib meraih minimal nilai 80 untuk membuka Unit kurikulum berikutnya.
  * **Jika Lulus:** Animasi gembok emas terbuka dengan dentang suara kunci logam 3D, menganugerahkan **Lencana Unit (Badge)** ke profil pengguna.
  * **Jika Belum Lulus:** Kodi menyajikan analisis kelemahan spesifik dan mengarahkan kembali ke modul latihan penguatan.

---

### 2.4 Stage 4: The Diagnostic Mock Exam (Simulasi Ujian Kesiapan Resmi)

Ketika pengguna menyelesaikan seluruh unit dalam satu level resmi (misal: seluruh Unit di level JLPT N5, Goethe A1, atau IELTS Foundation), modul **Diagnostic Mock Exam** terbuka:

1. **Kondisi Ujian Otentik (Strict Exam Environment):**
   * Penghitung waktu mundur (*Countdown Timer*) berjalan sesuai durasi ujian resmi dunia.
   * Seksi dipisahkan secara ketat sesuai format resmi lembaga penguji (JLPT, Goethe-Institut, British Council/IDP, Hanban).
2. **Dashboard Evaluasi & Skor 4 Pilar:**
   * Menampilkan nilai terpisah untuk **Reading (0–100), Listening (0–100), Writing (0–100), dan Speaking (0–100)** serta Skor Agregat Keseluruhan.
   * Indikator status kelulusan resmi: **LULUS (Passed)** atau **BELUM LULUS (Needs Revision)** mengacu pada passing grade resmi (misal: 60%).
3. **The AI Diagnostic Prescription (Resep Remediasi Cerdas):**
   * **Gauge Probabilitas Kelulusan:** Menghitung persentase kesiapan riil (misal: *"Probabilitas Kelulusan Goethe B1: 83%"*).
   * **Daftar Kelemahan Kritis (Critical Weaknesses):** Memetakan topik tata bahasa spesifik yang gagal dijawab saat ujian dengan tombol satu-klik: **[Buka Remedial Topik Ini]**.
   * **Sinkronisasi Otomatis ke SRS:** Seluruh butir soal yang salah saat mock exam langsung dijadwalkan masuk ke kartu Anki harian untuk diperkuat selama 7 hari ke depan.

---

### 2.5 Stage 5: Lompatan Level & Pembelajaran Multi-Bahasa Bebas Konflik

Setelah lulus ujian kesiapan di satu level, ekosistem CodeAbroad memberikan kebebasan penuh:
1. **Lompatan Level Vertikal:** Pengguna dapat langsung naik kelas ke level berikutnya (misal: dari JLPT N5 naik ke JLPT N4, atau Goethe A1 naik ke A2) dengan kurikulum yang menyambung secara logis.
2. **Eksplorasi Multi-Bahasa Bebas Bentrok (Multi-Language Switching):**
   * Pengguna dapat membuka TopBar dan mengaktifkan bahasa lain (misal: beralih dari Jepang ke Jerman atau Mandarin).
   * **Zero Collision Architecture:** Database menyimpan progres di tabel terisolasi (`user_language_enrollments`, `user_lesson_progress`, `user_srs_reviews`). Beralih ke bahasa Jerman tidak akan pernah mereset kartu Anki atau streak bahasa Jepang pengguna!

---

## 🎯 3. Target Personas & Success Metrics

### 3.1 Personas 6 Track Destinasi
1. **Persona 1: Rian (24 thn) — Target Kerja & Beasiswa di Tokyo 🇯🇵**
   * *Target:* JLPT N5 hingga N2. Sering bingung membedakan partikel (に vs で) dan konjugasi bentuk lampau/te-form.
   * *Solusi CodeAbroad:* Latihan susun balok peran kalimat, toggle Furigana dinamis, dan kartu Anki otomatis untuk partikel yang sering keliru.
2. **Persona 2: Nadia (27 thn) — Profesional Menuju Berlin / Uni Eropa 🇩🇪**
   * *Target:* Goethe-Zertifikat A1–B2 untuk visa kerja tenaga ahli IT. Membutuhkan penguasaan gender kata benda (*der/die/das*), kasus (*Akkusativ/Dativ*), dan tenses (*Das Perfekt*).
   * *Solusi CodeAbroad:* Latihan balok sintaksis posisi kata kerja (V2), kartu artikel Anki, dan evaluasi fonetik vokal Umlaut.
3. **Persona 3: Kevin (22 thn) — Mahasiswa Menuju Cambridge / London 🇬🇧**
   * *Target:* Skor IELTS 7.5+ (CEFR C1) untuk kuliah magister di Inggris. Membutuhkan penguasaan ejaan British (*colour, organise*), aksen non-rhotic, dan esai formal IELTS Writing Task 2.
   * *Solusi CodeAbroad:* Mock Exam simulasi IELTS dengan evaluasi tata bahasa tingkat lanjut dan transkrip audio aksen British native.
4. **Persona 4: Maya (25 thn) — Software Engineer Menuju Silicon Valley / New York 🇺🇸**
   * *Target:* Skor TOEFL iBT 105+ dan kelancaran komunikasi engineering tech culture US. Membutuhkan penguasaan ejaan American (*color, organize*), idiom kerja (*circle back, touch base*), dan pelafalan rhotic flap-t.
   * *Solusi CodeAbroad:* Latihan speaking repeat dengan pengujian audio Amerika, kuis kosakata workplace US, dan persiapan TOEFL diagnostik.
5. **Persona 5: David (26 thn) — Hardware Engineer & Supply Chain ke Shenzhen / Shanghai 🇨🇳**
   * *Target:* HSK 3 hingga HSK 5 untuk kolaborasi teknologi dan manufaktur perangkat keras. Membutuhkan pengenalan karakter Hanzi dan pelafalan 4 nada Pinyin.
   * *Solusi CodeAbroad:* Evaluasi nada Pinyin via Web Speech API, dekonstruksi radikal Hanzi, dan kartu memori nada sandhi.
6. **Persona 6: Claire (25 thn) — Peneliti AI Menuju Paris 🇫🇷**
   * *Target:* DELF B1–B2 untuk studi dan riset di Prancis. Membutuhkan pemahaman gender kata benda dan perbedaan tenses *Passé Composé* vs *Imparfait*.
   * *Solusi CodeAbroad:* Latihan konjugasi kata kerja interaktif dan pengenalan aksen fonetik Prancis.

### 3.2 Core Product Metrics
| Metrik | Target | Instrumen Pengukuran |
| :--- | :--- | :--- |
| **Daily Habit Retention (7-Day Streak)** | > 50% dari active users | Redis streak sessions & log presensi harian |
| **SRS Review Adherence** | > 70% kartu jatuh tempo diselesaikan | Query `user_srs_reviews` due cards per hari |
| **First-Pass Exercise Accuracy** | > 65% pada sesi latihan pertama | Log `user_exercise_attempts.is_correct` |
| **Mock Exam Readiness Predictive Accuracy** | > 85% korelasi dengan kelulusan asli | Skor `readiness_exam_attempts` vs survey kelulusan |
| **Onboarding to First Lesson Completion** | > 80% dari user registrasi | Rasio `user_lesson_progress` node 1 |

---

## 🎮 4. Core Features & Functional Specifications

### 4.1 Authentication & The 3-Pillar Normalized Architecture
* **Pillar 1 (`users`):** Auth Core murni (ID, Email, Password Hash Bcrypt). Zero data leak pada query profil publik.
* **Pillar 2 (`user_profiles`):** Biodata pengguna, nama, username unik, preferensi visual kurikulum (`preferred_roadmap_view`: `'map'` vs `'syllabus'`), dan status wizard onboarding.
* **Pillar 3 (`user_gamification`):** Mesin gamifikasi berkonkurensi tinggi (XP, Level, Streak, Gems, Last Active At).

---

### 4.2 Kurikulum Multi-Bahasa & Tingkat Kemahiran Resmi
Sistem kurikulum dirancang berjenjang dan modular: **`languages` ➔ `proficiency_levels` ➔ `units` ➔ `lessons` ➔ `exercises`**:
1. **Master Bahasa (`languages`):**
   * Mendukung kode ISO: `ja` (Jepang), `de` (Jerman), `en-us` (Inggris Amerika), `en-gb` (Inggris British), `zh` (Mandarin), `fr` (Prancis).
   * Menyimpan metadata aksara resmi di `supported_scripts JSONB` (contoh: `["kanji", "hiragana", "katakana", "romaji"]` untuk Jepang, `["latin", "umlaut"]` untuk Jerman, `["simplified_hanzi", "pinyin"]` untuk Mandarin).
2. **Tingkat Kemahiran Internasional (`proficiency_levels`):**
   * Standar resmi: JLPT (N5–N1), CEFR (A1–C1), HSK (1–6).
   * Kolom `tier` (`beginner`, `intermediate`, `advanced`):
     * 🟢 **Pemula (`beginner`):** JLPT N5–N4, Goethe A1–A2, CEFR A1–A2 (IELTS < 4.5), HSK 1–2, DELF A1–A2.
     * 🟡 **Menengah (`intermediate`):** JLPT N3–N2, Goethe B1–B2, CEFR B1–B2 (IELTS 5.0–6.5), HSK 3–4, DELF B1–B2.
     * 🔴 **Mahir (`advanced`):** JLPT N1, Goethe C1–C2, CEFR C1–C2 (IELTS 7.0–9.0), HSK 5–6, DALF C1–C2.
   * Menyimpan `official_exam_name` dan `passing_score_percent` resmi (misal: 60% standar kelulusan).
3. **Multi-Language Enrollment (`user_language_enrollments`):**
   * Pengguna dapat mempelajari lebih dari satu bahasa secara paralel tanpa terjadinya konflik progres.
   * State bahasa aktif dapat dialihkan secara instan melalui bilah navigasi atas (TopBar).
   * Menyimpan `initial_placement_type` (`'zero_beginner'`, `'placement_test'`, `'manual_select'`) dan `placement_score_percent`.

#### 4.2.1 Desain Drawer Pemilih Multi-Bahasa di TopBar (Multi-Language Switcher UX)
* **Bilah Navigasi Atas (TopBar):**  
  Menampilkan lencana bendera 3D bahasa yang sedang aktif (misal: 🇯🇵 Jepang dengan label `JLPT N5`).
* **Drawer Interaktif 3D (Language Switcher Sheet):**  
  Ketika lencana ditekan, drawer samping membuka daftar seluruh bahasa yang sedang dipelajari pengguna:
  * Menampilkan level saat ini per bahasa (misal: *Jepang N5*, *Jerman A1*).
  * Menampilkan jumlah kartu Anki yang jatuh tempo hari ini per bahasa.
  * Menampilkan api streak bahasa tersebut.
  * Tombol taktil: **[+ Pelajari Bahasa Baru]** untuk menambah track baru dari 6 bahasa yang tersedia.
* **Isolasi State Bebas Bentrok (Zero Collision Guarantee):**  
  Pergantian bahasa bersifat instan di sisi klien melalui Zustand store dan TanStack Query. Seluruh data progres tersimpan terpisah di database (`user_language_enrollments`, `user_lesson_progress`, `user_srs_reviews`), menjamin pergantian bahasa tidak akan pernah mereset progres bahasa lain!

#### 4.2.2 Mekanisme Penempatan Pengguna (Pemula vs Menengah vs Mahir)
Bagaimana database memperlakukan pengguna berdasarkan tingkat kemahiran awal mereka:

* **Skenario 1: Pengguna Pemula (Mulai dari Nol):**
  * `user_language_enrollments.current_level_id` menunjuk ke level pertama (`order_index = 1`, misal: JLPT N5 atau Goethe A1).
  * `initial_placement_type = 'zero_beginner'`.
  * Unit 1 Lesson 1 berstatus aktif ⚡, materi setelahnya terkunci 🔒.
* **Skenario 2: Pengguna Menengah / Mahir (Lolos Tes Penempatan atau Pilih Mandiri):**
  * Misal pengguna lolos di level **JLPT N4 (Menengah Bawah)**:
  * `current_level_id` langsung diarahkan ke ID level N4 (`order_index = 2`).
  * `initial_placement_type = 'placement_test'` dengan skor `placement_score_percent` (misal: 85).
  * **Auto-Unlock Materi Sebelumnya (`is_skipped: true`):**  
    Seluruh pelajaran di level sebelumnya (N5) otomatis dimasukkan ke tabel `user_lesson_progress` dengan nilai `is_completed: true`, `score: 100`, dan `is_skipped: true`.  
    *Hasil di UI:* Seluruh node N5 menampilkan centang hijau selesai (✅) dan tetap bisa dimainkan ulang kapan saja (*Replayable*), sementara node N4 langsung aktif sebagai gerbang belajar utama.
  * **Zero-Clutter Anki SRS:**  
    Sistem **TIDAK AKAN** membebani antrean kartu Anki pengguna dengan 300 kosakata dasar N5 yang sudah mereka kuasai bertahun-tahun. Kartu Anki SRS murni hanya mulai dibuat untuk kosakata baru di level aktif (N4) dan butir soal yang dijawab salah!

---

### 4.3 Engine Tata Bahasa & Tenses Ternormalisasi (`grammar_points`)
Untuk memastikan evaluasi tidak hanya berupa teks acak, seluruh aturan bahasa dinormalisasi ke tabel `grammar_points`:
* **Kategori Grammar (`category`):**
  * `'tense'`: Aturan waktu (*Past Simple, Present Perfect, Das Perfekt, Passé Composé*).
  * `'conjugation'`: Konjugasi kata kerja/sifat (*Bentuk Masu, Te-form, Konjunktiv II*).
  * `'particle'`: Partikel & kasus (*は, に, で, Akkusativ, Dativ*).
  * `'honorific'`: Tingkat kesopanan formal/kasual (*Keigo, Sie vs Du, 您 vs 你*).
  * `'sentence_pattern'`: Pola struktur kalimat majemuk (Klausa relatif, kalimat pengandaian / *conditionals*).
* **Rumus Sintaksis (`formula`):** Format baku susunan kata (misal: `[Subjek] + は + [Keterangan] + です` atau `[Subjekt] + [Hilfsverb] + ... + [Partizip II]`).
* **Hubungan ke Soal:** Setiap butir `exercises` dapat ditautkan ke `grammar_point_id` sehingga sistem dapat memetakan kelemahan spesifik pengguna.

---

### 4.4 Engine Latihan Interaktif 4 Pilar (`exercises`)
Setiap sesi pelajaran (`lessons`) menyajikan rangkaian latihan interaktif yang menguji **4 Pilar Bahasa**:

| Pilar Kemahiran | Tipe Latihan (`exercise_type`) | Mekanisme & Interaksi UX |
| :--- | :--- | :--- |
| **Writing** | `sentence_builder` | Balok peran kata warna-warni yang dapat disusun. Dilengkapi kode warna sintaks (Subjek = Biru, Partikel/Kasus = Hijau, Objek = Oranye, Predikat = Ungu). |
| **Reading** | `fill_blank` | Melengkapi partikel/artikel/konjugasi yang hilang sesuai tenses dan konteks kalimat. |
| **Listening** | `listening_choice` | Audio penutur asli berkualitas tinggi dengan pilihan ganda makna atau transkrip kalimat. |
| **Speaking** | `speaking_repeat` | Merekam suara via mikrofon browser, dianalisis menggunakan Web Speech API / pembanding fonetik dengan threshold akurasi. |
| **Integrated** | `dialogue_roleplay` | Percakapan situasi nyata dua arah dengan maskot Kodi. |

#### 4.4.1 Deep Dive Interaksi: `sentence_builder` (Balok Sintaksis Visual)
* **Tata Letak & Interaksi:**
  * Bagian atas: **Garis Rakitan Kalimat (Sentence Assembly Line)** berupa slot kosong berkedalaman 3D.
  * Bagian bawah: **Bank Balok Kata (Word Tile Bank)** yang diacak.
  * Pengguna dapat menekan (*tap/click*) atau menarik (*drag-and-drop*) balok untuk memindahkannya ke rakitan kalimat. Mengetuk balok di atas akan mengembalikannya ke bank bawah.
* **Balok Pengalih (Distractor Tiles):**
  * Setiap soal menyertakan 2–3 balok pengalih (misal: partikel yang salah `で` vs `に`, atau konjugasi bentuk lampau vs bentuk sekarang) untuk melatih ketelitian diskriminasi kaidah tata bahasa.
* **Aturan Khusus Aksara & Ortografi:**
  * *Jepang:* Tanpa spasi antar-balok, diakhiri tanda baca句点 (`。`).
  * *Jerman:* Balok kata benda (*Substantiv*) selalu diawali huruf kapital (*der Tisch*, *die Frau*).
  * *Inggris:* Balok pertama otomatis dikapitalisasi dan diberi tanda titik (`.`) di akhir.

#### 4.4.2 Deep Dive Interaksi: `fill_blank` (Sintaksis & Konjugasi Rumpang)
* **Mode Ganda:**
  1. *Mode Tile Selector (Pemula):* Memilih 1 dari 3–4 balok opsi partikel/konjugasi yang disajikan di bawah kalimat.
  2. *Mode Text Input (Tingkat Mahir):* Mengetik langsung jawaban menggunakan keyboard virtual atau fisik (menguji penguasaan ejaan/kanji tanpa bantuan opsi).
* **Umpan Balik Posisi:** Kursor secara otomatis melompat ke celah rumpang berikutnya setelah satu celah terisi.

#### 4.4.3 Deep Dive Interaksi: `listening_choice` (Pemahaman Menyimak)
* **Kontrol Pemutar Audio Otentik:**
  * Tombol Putar Standar (1.0x kecepatan alami penutur asli).
  * Tombol Kura-kura (*Turtle Mode* / 0.75x) untuk mendengarkan pelafalan fonem yang lambat dan jernih.
  * Pintasan Keyboard: `Ctrl + Space` atau `Spasi` untuk memutar ulang audio secara instan tanpa menggerakkan kursor mouse.
* **Transkrip Tersembunyi:** Teks dialog disembunyikan selama pengerjaan agar pengguna benar-benar mengandalkan telinga, dan baru dibuka secara otomatis setelah pengguna menekan tombol "Periksa".

#### 4.4.4 Deep Dive Interaksi: `speaking_repeat` (Pelafalan Suara Aktif)
* **Alur Izin & Aksesibilitas Mikrofon:**
  * Saat pertama kali membuka latihan speaking, browser menampilkan prompt izin mikrofon yang ramah.
  * **Tombol Toleransi ("Tidak Bisa Bicara Sekarang"):**  
    Jika pengguna sedang berada di transportasi umum, perpustakaan, atau lingkungan bising, pengguna dapat mengklik tombol *"Tidak bisa bicara sekarang"*. Sistem akan menonaktifkan latihan speaking selama 15 menit dan menggantinya dengan latihan menulis tanpa penalti streak atau XP!
* **Pencocokan Fonetik & Threshold:**
  * Akurasi $\ge 75\%$: **Lulus Sempurna** (Lampu hijau bersinar, audio chime).
  * Akurasi $60\% - 74\%$: **Hampir Benar** (Kodi memberi tips artikulasi suku kata mana yang kurang jelas).
  * Akurasi $< 60\%$: **Ulangi Sekali Lagi** (Diberikan kesempatan 2x mencoba sebelum masuk antrean Anki).

#### 4.4.5 Deep Dive Interaksi: `dialogue_roleplay` (Simulasi Percakapan Nyata)
* **Interaksi Bergilir (Turn-Based Chat):**
  * Kodi memulai dialog dalam setting situasional (misal: memesan makanan di kedai ramen Tokyo, menanyakan arah di stasiun Berlin Hauptbahnhof, atau memesan teh di Shanghai).
  * Pengguna memilih respon kalimat yang tepat atau melafalkan balasan menggunakan mikrofon.
  * Setiap giliran dialog disertai translasi kontekstual yang dapat di-tap (*tap-to-translate*).

---

#### 4.4.6 Dukungan Multi-Aksara & Toleransi Jawaban (`acceptable_answers JSONB`):
* Menampung variasi ejaan resmi lintas negara (Kanji vs Hiragana, Simplified vs Traditional Hanzi, British vs American English, Eszett vs ss Jerman). Seluruh variasi dinilai sah 100%.
* Tampilan Furigana interaktif di frontend menggunakan tag standar `<ruby>` yang dapat diaktifkan/dinonaktifkan oleh pengguna (Mode Pemula vs Mode Ujian Asli).

#### 4.4.7 Rubrik Diagnostik Kesalahan Cerdas (`diagnostic_rubric JSONB`):
* Jika pengguna salah memilih opsi, Kodi tidak hanya memberi tanda silang, melainkan membaca rubrik diagnostik kesalahan umum (*Common Misconceptions*) untuk memberikan edukasi instan.

---

### 4.5 Spesifikasi Algoritma Anki Spaced Repetition (SuperMemo SM-2)
CodeAbroad mengadopsi rumus matematika **SuperMemo SM-2** yang telah disesuaikan:

1. **Rating Kualitas Jawaban ($q \in [0, 5]$):**
   * $q = 5$: Jawaban sempurna tanpa ragu-ragu (< 4 detik).
   * $q = 4$: Jawaban benar setelah sedikit berpikir (4–8 detik).
   * $q = 3$: Jawaban benar dengan usaha serius (> 8 detik).
   * $q = 2$: Salah, tapi langsung ingat saat melihat kunci jawaban.
   * $q = 1$: Salah total, jawaban tampak asing.
   * $q = 0$: Blank total.

2. **Pembaruan Faktor Kemudahan (Ease Factor - $EF$):**
   $$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
   * Batas minimum $EF$: `1.30` (mencegah kartu terjebak dalam siklus tak berujung).
   * Nilai bawaan awal $EF$: `2.50`.

3. **Pembaruan Interval Hari ($I$):**
   * Jika $q < 3$ (Gagal): `repetition_count = 0`, `interval_days = 1`.
   * Jika $q \ge 3$ (Berhasil):
     * $n = 1 \implies I_1 = 1\text{ hari}$
     * $n = 2 \implies I_2 = 6\text{ hari}$
     * $n > 2 \implies I_n = I_{n-1} \times EF'$

4. **Manajemen Kartu "Leech":**
   Kartu yang gagal diulang lebih dari 5 kali berturut-turut diberi label *Leech*, dan Kodi akan memberikan saran khusus untuk mengulang kembali materi teori di Unit kurikulum terkait.

#### 4.5.1 Protokol Remediasi Cerdas untuk Kartu "Leech"
* **Definisi Leech:** Kartu memori yang gagal diingat pengguna sebanyak $\ge 5$ kali berturut-turut ($q < 3$). Kondisi ini membuktikan bahwa metode hafalan pasif tidak lagi mempan dan pengguna mengalami *kebuntuan pemahaman konsep*.
* **Intervensi Proaktif Kodi:**
  * Alih-alih membiarkan kartu terus muncul dan membuat frustrasi, Kodi mengunci kartu sementara dan menyajikan kartu bantuan (*Conceptual Rescue Card*):  
    *"Kartu ini agak membandel ya! Jangan cuma dihafal bunyinya. Yuk kita bedah kaidah dasarnya!"*
  * Sistem menyertakan tautan satu-klik langsung ke modul materi dan puzzle susun balok kalimat (`sentence_builder`) di Unit kurikulum terkait, mengubah kegagalan hafalan mekanis menjadi pemahaman logika aktif.

---

### 4.6 Ujian Kesiapan Diagnostik (Diagnostic Mock Exam)
Modul simulasi ujian (`readiness_exam_attempts`) dirancang persis menyerupai ujian internasional resmi:
* **Penilaian Terpisah 4 Pilar:** Menghasilkan skor 0–100 untuk Reading, Listening, Writing, dan Speaking.
* **Laporan Kesiapan & Rekomendasi Remedi (`analysis_report JSONB`):**
  * Menghitung probabilitas kelulusan ujian resmi (contoh: *"Prediksi: Lulus JLPT N5: 84%"*, *"Probabilitas Lulus Goethe B1: 82%"*).
  * Memberikan daftar topik tata bahasa yang paling mendesak untuk diperbaiki beserta tautan modul untuk mengulanginya.

#### 4.6.1 Mesin Kalkulasi Kelulusan Berbasis Ambang Batas Seksi Resmi (Sectional Cutoff Rules)
Banyak ujian resmi dunia yang tidak hanya mensyaratkan skor total rata-rata, melainkan memberlakukan **Ambang Batas Minimum Per Seksi (Sectional Pass Marks)**:
* **Simulasi JLPT 🇯🇵:**  
  Untuk lulus JLPT N5, peserta membutuhkan skor total $\ge 90/180$ (50%), **DAN** nilai seksi *Moji/Goi/Bunpo* $\ge 19/60$ serta seksi *Choukai* (Listening) $\ge 19/60$. Jika seorang pengguna meraih nilai sempurna di Listening namun hanya mendapat 15/60 di Moji/Goi, status kelulusan dinyatakan **TIDAK LULUS (Gagal pada Batas Seksi)**.
* **Simulasi Goethe-Zertifikat 🇩🇪:**  
  Setiap modul (*Lesen, Hören, Schreiben, Sprechen*) wajib meraih minimal 60 poin (60%). Jika salah satu modul gagal, peserta harus mengulang modul tersebut.
* **Simulasi IELTS 🇬🇧:**  
  Menghitung *Band Score* per seksi (0.0 – 9.0) dengan pembulatan *half-band* resmi, menghindarkan pengguna dari ilusi nilai rata-rata biasa.

---

### 4.7 Gamifikasi & Desain Audio Tactile 3D
* **Desain Visual:** Standar Duolingo 3D Tactile Physics (Clean Light Mode, tombol fisik tebal berkedalaman 4px, partikel konfeti kemenangan, dan maskot Kodi).
* **Audio Interaktif:** Web Audio API Procedural Synthesizer (`AudioService.ts`) menghasilkan 13 efek suara taktil (klik balok kata, jawaban benar, jawaban salah, naik level, klaim peti emas, streak flame) tanpa ketergantungan file audio eksternal yang berat.
* **Siklus Harian:**
  * Streak harian bertingkat dengan api animasi (`streak`).
  * Peti emas harian dengan milestone 50 XP (`user_daily_chest_claims`).
  * Toko Arcade untuk membeli *Streak Freeze* dan *XP Booster*.

#### 4.7.1 Standar Desain Visual Lencana Bendera 3D (Zero Raw Emoji Policy)
* **Larangan Emoji Mentah (Zero Raw Unicode Emoji in DB/UI):**  
  Aplikasi dan database **DILARANG KERAS** menggunakan karakter emoji mentah sistem operasi (seperti `🇯🇵`, `🇩🇪`, `🇬🇧`) karena inkonsistensi rendering antar perangkat (Windows vs iOS vs Android) yang tampak kurang profesional.
* **Spesifikasi 3D Vector SVG Flag Badges:**  
  Seluruh bendera negara dirender menggunakan komponen SVG vektor 3D khusus:
  * Bentuk: Persegi panjang tumpul (*rounded rect* `rounded-lg`).
  * Efek Taktil: Border halus 1px semi-transparan dengan bayangan bevel bawah 2px berkedalaman fisik.
  * Tampilan seragam, tajam di layar Retina/HiDPI, dan menyatu sempurna dengan estetika Duolingo 3D.

#### 4.7.2 Penyesuaian Ritme Belajar Harian (Daily Habit Pace Tiers)
Pengguna dapat menentukan ritme komitmen waktu belajar harian sesuai gaya hidup mereka pada menu Pengaturan:
* 🟢 **Casual:** 5 menit/hari (Target: 20 XP) — Cocok untuk menjaga streak di sela kesibukan.
* 🟡 **Regular:** 10 menit/hari (Target: 35 XP) — Belajar stabil 1 lesson + review singkat.
* 🔵 **Serious (Bawaan):** 15 menit/hari (Target: 50 XP) — Target standar untuk membuka Peti Emas harian.
* 🟣 **Intense:** 30 menit/hari (Target: 100 XP) — Persiapan intensif menjelang ujian resmi (2 lessons + full SRS review + speaking challenge).

---

### 4.8 Sistem Perilaku & State Machine Maskot Kodi (The Kodi Companion Engine)
Kodi bertindak sebagai tutor AI dan pendamping emosional pembelajar dengan 5 kondisi emosional visual (*State Machine*):

| State Emosi Kodi | Pemicu Antarmuka (UX Trigger) | Perilaku & Ekspresi Visual |
| :--- | :--- | :--- |
| `IDLE` | Berada di Roadmap atau Dashboard | Duduk santai di sebelah node aktif, mata berkedip lembut dengan pose menyemangati. |
| `CHEERING` | Pengguna menjawab benar / kombo 3x | Melompat gembira dengan partikel bintang kecil dan senyum lebar. |
| `COACHING` | Pengguna menjawab salah | Memegang papan tulis kecil dengan pose berpikir empati; memberikan penjelasan edukatif tanpa ekspresi marah atau menghakimi. |
| `LISTENING` | Berada di soal Listening / Speaking | Mengenakan headphone retro saat audio diputar, atau memegang mikrofon saat pengguna merekam suara. |
| `CELEBRATING` | Menyelesaikan Lesson / Peti Emas / Mock Exam | Mengangkat piala emas 3D dengan konfeti melimpah dan animasi tepuk tangan. |

---

### 4.9 Sistem Audio Prosedural & Sintesis Suara (Audio System Specifications)
Arsitektur suara CodeAbroad mengadopsi **Web Audio API Procedural Synthesizer** murni (`audioService.ts`) yang menghasilkan 13 preset SFX taktil tanpa memerlukan download aset audio MP3 eksternal yang membebani kuota:

1. `tap`: Klik tajam frekuensi 800Hz untuk peletakan balok kata.
2. `card_flip`: Suara gesekan kartu memori Anki berputar.
3. `correct`: Arpeggio akor mayor riang (C5 - E5 - G5 - C6) bertempo cepat.
4. `incorrect`: Nada rendah tumpul non-punitive (F3 - C3) dengan filter low-pass halus.
5. `streak_flame`: Desisan api hangat (*white noise filter sweep*) saat streak bertambah.
6. `level_up`: Fanfare multi-oktaf megah penanda kenaikan level gamifikasi.
7. `chest_open`: Derit peti kayu fisika 3D diikuti kilauan kristal emas.
8. `reward_claim`: Denting kristal frekuensi tinggi saat menerima Blue Gems.
9. `button_press`: Suara pegas mekanik berkedalaman 4px saat tombol 3D ditekan.
10. `node_unlock`: Dentang gembok logam terbuka saat gerbang unit baru terlepas.
11. `combo`: Nada frekuensi naik progresif setiap kali pengguna menjawab benar beruntun.
12. `timer_tick`: Detak halus penanda waktu mundur pada simulasi ujian diagnostik.
13. `fanfare`: Melodi kemenangan orkestra penutup sesi belajar.

*Fallback Sintesis Suara:* Jika file audio native sebuah kata belum tersedia di CDN, sistem memicu Web Speech API lokal (`speakLanguage`) dengan tag bahasa BCP-47 (`ja-JP`, `de-DE`, `en-GB`, `en-US`, `zh-CN`, `fr-FR`).

---

## 🎯 5. Batasan Scope Produk (Scope Boundaries & Phased Rollout)

Untuk menjamin kualitas eksekusi engineering dan fokus pedagogis, batasan cakupan sistem ditetapkan secara ketat:

### 5.1 In-Scope: Rilis MVP (v1.0)
* **Dukungan Skema Penuh:** Database PostgreSQL sudah siap menampung 6 bahasa (`ja`, `en-gb`, `en-us`, `de`, `zh`, `fr`).
* **Kurikulum Lengkap Peluncuran Perdana:**
  * 🇯🇵 **Jepang:** Kurikulum lengkap **JLPT N5** (6 Unit, 30 Lessons, 180+ Exercises 4 Pilar, dan Simulasi Diagnostic Mock Exam N5).
  * 🇬🇧 **Inggris British:** Kurikulum **IELTS Foundation (Band 5.0–6.5)** lengkap dengan latihan tata bahasa dan listening multi-aksen.
* **Fitur Inti:**
  * Engine 5 tipe latihan interaktif lengkap.
  * Mesin Anki Spaced Repetition SM-2 otomatis.
  * Sistem Gamifikasi (XP, Streak Flame, Peti Emas 3D, Blue Gems, Toko Arcade).
  * Audio Synthesizer Prosedural 13 SFX.
  * Ujian Diagnostik Kesiapan (Readiness Exam Predictor) dengan laporan remedi.

### 5.2 In-Scope: Rollout Bertahap (v1.1 – v1.3)
* **v1.1 (European Expansion):** Peluncuran kurikulum penuh **Jerman 🇩🇪 Goethe A1** dan **Inggris Amerika 🇺🇸 TOEFL Starter**.
* **v1.2 (Asian & Romance Expansion):** Peluncuran kurikulum penuh **Mandarin 🇨🇳 HSK 1–2** dan **Prancis 🇫🇷 DELF A1**.
* **v1.3 (Advanced Levels):** Ekspansi kurikulum tingkat menengah (**JLPT N4–N3**, **Goethe B1–B2**, **IELTS 7.0–8.0**).

### 5.3 Explicit Out-of-Scope (Bukan Bagian dari Produk)
* ❌ **Tutor Tatap Muka Manusia 1-on-1:** Platform berfokus 100% pada *self-paced mastery*, gamifikasi interaktif, dan pembimbing AI (Kodi). Tidak ada fitur booking guru privat manusia.
* ❌ **Streaming Video / Live Classroom:** Tidak ada panggilan video langsung antar-pengguna demi menjaga performa server yang ringan dan privasi pengguna.
* ❌ **Forum Diskusi Bebas Tanpa Moderasi:** Interaksi sosial dibatasi pada sistem yang sehat dan memotivasi (*Weekly Leaderboard* dan profil publik) untuk mencegah spam dan toksisitas.
* ❌ **Mode Offline Penuh (Lokal SQLite):** Versi web membutuhkan koneksi internet untuk sinkronisasi state. Mode offline penuh dicadangkan untuk aplikasi mobile native di masa mendatang.

---

## 🛡️ 6. Ketahanan Sistem, Integritas Data & Edge Cases

1. **Pemutusan Koneksi Jaringan Mendadak (Network Disconnection Resilience):**
   * Sesi latihan yang sedang berjalan disimpan secara optimis di memori lokal peramban (*Zustand persistent storage*).
   * Jika pengguna kehilangan koneksi internet di tengah soal nomor 5, latihan tidak akan *crash*. Begitu koneksi kembali pulih, progres jawaban langsung disinkronkan ke endpoint `POST /api/v1/lessons/:id/submit`.
2. **Pencegahan Kecurangan & Dobel Submit (Anti-Spam & Debouncing):**
   * Tombol "Periksa Jawaban" dikunci secara instan (*optimistic disable*) saat pertama kali ditekan untuk mencegah dobel submit skor XP atau gems.
3. **Penanganan Aksara & Furigana Rendering:**
   * Seluruh teks karakter CJK (Kanji/Hanzi) dirender menggunakan font standar UTF-8 `Noto Sans JP` dan `Noto Sans SC` untuk menjamin tampilan glif tidak pecah di perangkat lawas.
4. **Isolasi Multi-Bahasa (Zero Collision Guarantee):**
   * Seluruh query progres dikunci dengan komposit key `(user_id, language_id)`. Beralih dari belajar bahasa Jepang ke bahasa Jerman dijamin tidak akan merusak jadwal review Anki bahasa Jepang pengguna.

---

## 💎 7. Kebijakan Akses Bebas & Batasan Bebas Paywall

* **Komitmen Akses Inti 100% Gratis (Zero Paywall on Learning):**  
  Seluruh materi kurikulum inti, modul tata bahasa visual, latihan 4 pilar, sistem Anki SRS harian, dan streak flame dapat diakses secara **penuh dan gratis tanpa batasan kuota energi/nyawa yang membatasi belajar**.
* **Fitur Opsional Masa Depan (CodeAbroad Pro):**  
  Monetisasi opsional di masa mendatang hanya diperuntukkan bagi fitur tingkat lanjut non-kurikulum, seperti: simulasi Diagnostic Mock Exam tanpa batas dengan sertifikat digital terverifikasi dan analisis heatmap pengucapan fonetik AI mendalam.

---

## 🛠️ 8. Technical Architecture Stack

| Lapisan Sistem | Teknologi | Pola & Standar Arsitektur |
| :--- | :--- | :--- |
| **Frontend** | React 18, TypeScript 5, Vite, Tailwind CSS v4, Lucide & Phosphor Icons | **Headless Hook Pattern** (Separasi logika state murni di custom hooks, JSX bersih) + Zustand Persistent Stores + TanStack Query |
| **Audio & Speech Engine** | Web Audio API (Synthesizer prosedural) + Web Speech API (Speech Recognition & Synthesis) | Taktil tanpa latensi jaringan, fallback cerdas antar-browser |
| **Backend API** | Golang 1.23+, Gin Web Framework | **Strict Clean Architecture** (`delivery/http` ➔ `usecase` ➔ `repository` ➔ `domain`) |
| **Database** | PostgreSQL 16 (`pgcrypto`), Redis 7 | Skema relasional ternormalisasi (3NF) dipadukan dengan payload `JSONB` untuk konten interaktif dan rubrik evaluasi |
| **Event Streaming** | Apache Kafka | Pemrosesan asinkron untuk reset antrean SRS harian, rekap leaderboard, dan audit aktivitas |

---

## 📋 9. Database Schema Cross-Reference

Seluruh spesifikasi teknis tabel, tipe data, indeks performa, dan relasi cardinalitas mengacu secara ketat pada dokumen:  
👉 [`.agents/docs/erd.md`](file:///c:/Projects/codeabroad/.agents/docs/erd.md) (Versi 3.0).
