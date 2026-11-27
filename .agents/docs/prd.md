# Product Requirements Document (PRD) — Merantalk
**Version:** 3.2 (Global Multi-Language Mastery Platform: JLPT N5–N1 & CEFR A1–C2 / TOEFL iBT, Pengingat Ulang Otomatis Anti Lupa & Diagnostic Exam Engine)  
**Status:** Production Live (v1.2.0 — https://merantalk.vercel.app)  
**Last Updated:** 2026-11-27  

---

## 1. Executive Summary, Philosophy & Pedagogical Foundations

### 1.1 Latar Belakang Masalah (The Core Industry Problem)
Industri pembelajaran bahasa digital saat ini terbelah menjadi tiga kubu yang terfragmentasi, dan masing-masing memiliki kelemahan mendasar:

1. **Ilusi Gamifikasi Dangkal & Hafalan Mekanis:**  
   Banyak aplikasi bahasa mengutamakan *retensi engagement* di atas *pemahaman kaidah linguistik*. Pengguna menghafal kalimat acak secara mekanis melalui tebak gambar berulang-ulang, namun setelah berbulan-bulan menjaga streak tetap tidak mampu menyusun kalimat mandiri di dunia nyata karena **tidak pernah diajarkan peran sintaksis kalimat, fungsi partikel/kasus gramatikal, serta logika konjugasi dan tenses secara kontrastif terhadap Bahasa Indonesia**.
2. **Alat Hafalan Kaku yang Terpisah dari Kurikulum:**  
   Aplikasi kartu hafalan mandiri dengan penjadwalan ulang memang membantu melawan lupa (*Ebbinghaus Forgetting Curve*), tetapi antarmukanya terasa kaku, menuntut kurasi kartu manual, tidak menyatu dengan alur kurikulum bertingkat, dan tidak memberikan koreksi diagnostik ketika pembelajar salah memahami struktur kalimat.
3. **The "Official Exam Blindness" (Ketakutan Ujian Sertifikasi Berbayar):**  
   Ujian sertifikasi bahasa internasional (**JLPT N5–N1**, **TOEFL iBT / CEFR A1–C2**, **IELTS**, **Goethe-Zertifikat A1–C1**, **HSK 1–6**, **DELF/DALF A1–C2**) memiliki biaya pendaftaran tinggi (USD 100–250 per ujian) dan jadwal tes terbatas. Pembelajar kerap memasuki ruang ujian secara "buta" tanpa tolok ukur objektif atas kesiapan 4 pilar kemahiran mereka.
4. **The "Gimmick Fatigue" (Metafora Fiktif yang Membingungkan):**  
   Metafora buatan yang dipaksakan (seperti tiket pesawat fiktif atau nama stasiun kereta) membuat pengguna bingung membedakan progres linguistik dengan gimik antarmuka. Pembelajar membutuhkan **alur kurikulum universal yang bersih, terstruktur, dan mencerminkan standar ujian sertifikasi resmi dunia secara langsung**.

---

### 1.2 Misi Produk & Cakupan 6 Destinasi Bahasa (Live Production & Roadmap)
**Merantalk** hadir sebagai platform pembelajaran bahasa bertaraf internasional bagi pembelajar Indonesia untuk menembus karier global, beasiswa, dan sertifikasi bahasa resmi melalui 6 jalur bahasa modular:

| Kode ISO | Destinasi Bahasa | Status Produksi | Standar & Level Resmi | Inventaris Konten Produksi Saat Ini |
| :--- | :--- | :--- | :--- | :--- |
| **`ja`** | **Jepang** | **Aktif Penuh** | **JLPT N5 – N1** (5 level) | Papan Hiragana/Katakana/Kanji interaktif (`/kana/:script`), **56** Panduan Grammar (`GP-JA-*`), **120** Dek Kartu Kosakata (**1.819** kartu), **76** Unit (**496** pelajaran, **4.113** soal 4 pilar), Tes Penempatan 15 soal & Ujian Simulasi Kesiapan N5–N1 |
| **`en-us`** | **Inggris (American)** | **Aktif Penuh** | **CEFR A1 – C2 / TOEFL iBT** (6 level: `A1` Pra-TOEFL Dasar, `A2` TOEFL 32–41, `B1` TOEFL 42–71, `B2` TOEFL 72–94, `C1` TOEFL 95–114, `C2` TOEFL 115–120) | **60** Panduan Grammar ber-IPA General American (`GP-EN-A1-001`..`GP-EN-C2-010`), **60** Dek Kartu Kosakata (**900** kartu dalam `daily`, `work_study`, `phrasal_idioms`, `academic_toefl`), **67** Unit (**247** pelajaran, **2.031** soal 4 pilar, **180** dek studi pengantar), Tes Penempatan 15 soal & Ujian Simulasi Kesiapan A1–C2 |
| **`en-gb`** | **Inggris (British)** | **Segera Hadir** (`is_active = false`) | **CEFR A1 – C2 / IELTS** | Terpisah secara eksplisit dari `en-us` untuk ortografi UK (*colour, programme*), kosakata UK, dan format IELTS Academic; terkunci eksplisit di Landing/Onboarding |
| **`de`** | **Jerman** | **Segera Hadir** (`is_active = false`) | **Goethe-Zertifikat A1 – C1** | Katalog terdaftar & terkunci eksplisit di Landing/Onboarding tanpa fallback diam-diam ke Jepang |
| **`zh`** | **Mandarin** | **Segera Hadir** (`is_active = false`) | **HSK 1 – 6** | Katalog terdaftar & terkunci eksplisit di Landing/Onboarding tanpa fallback diam-diam ke Jepang |
| **`fr`** | **Prancis** | **Segera Hadir** (`is_active = false`) | **DELF / DALF A1 – C2** | Katalog terdaftar & terkunci eksplisit di Landing/Onboarding tanpa fallback diam-diam ke Jepang |

> **Total Bank Materi Aktif di Produksi (`ja` + `en-us`):** **143 Unit** · **743 Pelajaran** · **6.144 Soal 4 Pilar** · **116 Panduan Grammar Interaktif** · **180 Dek Kartu Kosakata (2.719 Kartu)**.

> *"Memberdayakan pembelajar Indonesia mencapai penguasaan bahasa yang mendalam (True Linguistic Mastery), daya ingat jangka panjang agar ingat lebih lama, dan kesiapan ujian sertifikasi internasional melalui Desain 3D Taktil Merantalk, pembelajaran tata bahasa visual-kontrastif, Pengingat Ulang Otomatis Anti Lupa, dan simulasi ujian diagnostik."*

Tiga pilar filosofis utama Merantalk:
* **Desain 3D Taktil Merantalk:** Kenikmatan belajar harian melalui tombol fisik berkedalaman 4px (Royal Blue `#2563EB`), peta kurikulum interaktif, kartu pengantar materi sebelum kuis (*Learn-Before-Quiz*), synthesizer Web Audio API prosedural bebas beban kuota, serta maskot pendamping **Mera**.
* **Pengingat Ulang Otomatis Merantalk (Anti Lupa):** Membantu pembelajar **Ingat Lebih Lama** melalui dua sistem **Jadwal Latihan Ulang Adaptif** — (1) antrean latihan ulang otomatis untuk soal yang masih keliru (`/review`) dan (2) 180 dek **Kartu Kosakata** terkurasi bertingkat (`/flashcards`).
* **Official International Certification Standard:** Seluruh tingkat kemahiran dipetakan langsung ke standar sertifikasi global (**JLPT N5–N1** untuk `ja`, **CEFR A1–C2 / TOEFL iBT** untuk `en-us`, serta **IELTS / Goethe / HSK / DELF** untuk jalur ekspansi berikutnya).

---

### 1.3 Landasan Ilmu Kognitif & Pedagogi Bahasa (Cognitive Science Foundations)

Merantalk dibangun di atas 5 pilar pedagogi kognitif yang diterapkan lintas bahasa target:

#### A. Mastery Over Memorization: Balok Sintaksis Berkode Warna (Color-Coded Syntax Blocks)
Pembelajar dilatih memahami **arsitektur kalimat** menggunakan balok peran gramatikal universal yang konsisten di Kurikulum maupun Grammar Studio:
* **Biru (Topik / Subjek):** Pelaku atau topik kalimat (misal: `わたし`, `Sarah`, `The committee`).
* **Hijau (Partikel / Preposisi / Penghubung):** Perekat hubungan sintaksis (misal: `は / に / で`, `for / since / although`).
* **Oranye (Objek / Keterangan Waktu & Tempat):** Sasaran aksi atau latar konteks (misal: `東京`, `in San Francisco`, `quarterly report`).
* **Ungu (Predikat / Kata Kerja & Tenses):** Mesin aksi beserta konjugasi/aspek waktu (misal: `行きます`, `has been working`, `would have completed`).

Contoh penerapan lintas bahasa aktif:
1. **Jepang (`ja` — Struktur SOV & Partikel):**  
   `[わたし (Biru)]` + `[は (Hijau)]` + `[とうきょう (Oranye)]` + `[に (Hijau)]` + `[いきます (Ungu)]`  
   *Logika visual:* Partikel arah `に` mengunci tujuan tepat sebelum predikat di akhir kalimat.
2. **Inggris Amerika (`en-us` — Struktur SVO, Aspectual Tense & IPA):**  
   `[Maya (Biru)]` + `[has worked (Ungu)]` + `[in Seattle (Oranye)]` + `[for three years (Hijau/Oranye)]`  
   *Logika visual:* *Present Perfect* menghubungkan durasi masa lalu hingga sekarang dengan penanda durasi `for`.

#### B. Keseimbangan Holistik 4 Pilar Kemahiran
1. **Reading (`fill_blank`):** Membaca Kanji/Kana dengan Furigana Ruby (`<ruby>`) untuk `ja` serta teks situasional dan akademik berstandar TOEFL untuk `en-us`.
2. **Listening (`listening_choice`):** Pengucapan multi-locale BCP-47 (`ja-JP`, `en-US`, dll.) dengan kontrol kecepatan **Normal (`1.0x`)** dan **Pelan (`0.6x`)** tanpa membocorkan transkrip sebelum jawaban diperiksa.
3. **Writing (`sentence_builder`):** Menyusun balok kalimat berkode warna dilengkapi balok pengecoh (*distractor tiles*) untuk melatih diskriminasi urutan kata dan kaidah tata bahasa.
4. **Speaking (`speaking_repeat`):** Evaluasi pelafalan aktif via Web Speech API + panduan fonetik (Romaji/Furigana untuk `ja`, General American IPA untuk `en-us`) serta tombol toleransi aksesibilitas ketika tidak memungkinkan berbicara.

#### C. Evaluasi Cerdas & Remediasi Instan (`diagnostic_rubric`)
Setiap kali pembelajar keliru, sistem membaca `diagnostic_rubric` untuk menampilkan umpan balik kontrastif Bahasa Indonesia secara langsung (*Point-of-Performance Remediation*) alih-alih sekadar menandai salah:
* **Kasus Jepang (`ja`):** Memilih `で` alih-alih `に` untuk tujuan perjalanan -> Mera menjelaskan perbedaan lokasi aktivitas (`で`) vs arah tujuan pergerakan (`に` / `へ`).
* **Kasus Inggris US (`en-us`):** Memilih *"I have seen him yesterday"* -> Mera membedah bahwa keterangan waktu lampau spesifik (`yesterday`) mensyaratkan *Past Simple* (`I saw him yesterday`), bukan *Present Perfect*.

#### D. Toleransi Multi-Aksara & Pengaman Evaluasi Lintas Bahasa
* Kolom `acceptable_answers JSONB` menerima variasi sah (misal Kanji vs Hiragana penuh untuk `ja`, kontraksi vs bentuk penuh `don't` / `do not` untuk `en-us`, serta `ß` vs `ss` untuk ekspansi `de`).
* Pada latihan `speaking_repeat`, backend Go menerapkan normalisasi Kanji/Katakana/Hiragana/Romaji khusus bahasa Jepang yang dijaga oleh fungsi **`containsJapaneseScript`** agar fallback fonetik Romaji Jepang tidak pernah diterapkan secara keliru pada bahasa beraksara Latin seperti `en-us`.

#### E. Prediktor Kesiapan Ujian Resmi (Readiness Mock Exam)
Setiap level resmi (N5–N1 untuk `ja` dan A1–C2 untuk `en-us`) dilengkapi unit **Readiness Exam (`unit_type = 'diagnostic_exam'`, `order_index = 99`)** yang mensimulasikan ujian sertifikasi tanpa bantuan kartu pengantar (*spoiler-free*), menghasilkan rincian skor 4 pilar (`reading`, `listening`, `writing`, `speaking`), status kelulusan terhadap `passing_score_percent`, dan rekomendasi remediasi topik grammar.

---

### 1.4 Delapan Metodologi Pembelajaran Ilmiah (The 8 Scientific Pedagogical Methodologies)

| # | Metodologi | Implementasi Nyata di Merantalk |
| :--- | :--- | :--- |
| **1** | **Pengingat Ulang Otomatis (Anti Lupa)** | Jadwal Latihan Ulang Adaptif ganda: antrean soal yang masih keliru (`user_srs_reviews`) dan 180 dek **Kartu Kosakata** (`user_flashcard_progress`) dengan penyesuaian otomatis faktor kemudahan (`ease_factor`) & jarak hari (`interval_days`). |
| **2** | **Learn-Before-Quiz Scaffolding** | Materi dikenalkan dalam batch mikro (*2 kartu studi -> latihan -> 2 kartu berikutnya*) lengkap dengan mnemonik Indonesia & audio 2 kecepatan sebelum diuji. |
| **3** | **Active Recall / Retrieval Practice** | Latihan rumpang, susun balok kata, dan mini-kuis 3 soal pada Grammar Studio memaksa pemanggilan memori aktif, bukan membaca pasif. |
| **4** | **Visual Syntax Scaffolding** | Balok peran kalimat berkode warna & *Slot Playground* mereduksi beban kognitif struktur bahasa asing (SOV Jepang, pola klausa akademik TOEFL). |
| **5** | **Multi-Sensory 4-Pillar Learning** | Aktivasi simultan auditori (TTS BCP-47), visual (Furigana/IPA/warna), taktil (balok 3D), dan artikulasi vokal (mikrofon Web Speech API). |
| **6** | **Immediate Formative Feedback** | Koreksi logis instan berbasis `diagnostic_rubric` untuk mencegah *fossilization* kekeliruan tata bahasa. |
| **7** | **Microlearning & Habit Loops** | Pilihan ritme 5/15/30/45 menit/hari, 3 Misi Harian rotasi WIB, 3 Peti Harian, Streak harian, Lencana Bulanan, dan Liga Mingguan. |
| **8** | **Mastery Gatekeeping & Benchmarking** | Checkpoint akhir unit (*spoiler-free*) dan Ujian Simulasi Kesiapan 4 pilar sebagai tolok ukur objektif sebelum naik level atau mengikuti ujian resmi. |

---

## 2. End-to-End User Experience Lifecycle

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             MERANTALK LEARNER LIFECYCLE (v3.2 LIVE)                                 │
├──────────────────┬──────────────────┬──────────────────┬──────────────────┬─────────────────────────┤
│     STAGE 0      │     STAGE 1      │     STAGE 2      │     STAGE 3      │         STAGE 4         │
│   Guest Trial    │ 3-Step Onboarding│  Daily Mastery   │ Unit Checkpoint  │ Readiness Exam & Track  │
│  (Tanpa Login)   │ & Placement Test │ & Anti Lupa Loop │  (Spoiler-Free)  │  Switching / Pro Leap   │
├──────────────────┼──────────────────┼──────────────────┼──────────────────┼─────────────────────────┤
│ • Unit 1 N5 / A1 │ • Step 1: Bahasa │ • Interleaved    │ • Tes Akhir Unit │ • Simulasi 4 Pilar per  │
│ • Grammar & Deck │   (SVG Flags)    │   Study Batches  │   (`tes-akhir`)  │   Level (N5-N1 / A1-C2) │
│   Pemula         │ • Step 2: Pace   │ • 4-Pillar Quiz  │ • Tanpa Bocoran  │ • Laporan Kelemahan &   │
│ • Simpan Lokal   │   5/15/30/45 mnt │ • Grammar Studio │   & Laci Materi  │   Masuk Antrean Ulang   │
│   & Auto-Sync    │ • Step 3: Tes 15 │ • Ulang Adaptif  │ • Buka Unit      │ • Switch ja <-> en-us   │
│   saat Daftar    │   Soal -> +50 XP │ • Misi WIB & Liga│   Berikutnya     │   Zero Collision        │
└──────────────────┴──────────────────┴──────────────────┴──────────────────┴─────────────────────────┘
```

### 2.1 Stage 0: Mode Coba Tanpa Login (Guest Trial & Auto-Sync)
* Pengunjung di Landing Page atau `/curriculum` dapat langsung memilih bahasa aktif (`ja` atau `en-us`) dan memainkan seluruh **Unit 1 pada level pemula (`JLPT N5` / `CEFR A1`)**, membuka panduan grammar pemula, papan aksara Jepang, serta deck flashcard pemula tanpa registrasi.
* Progres pelajaran yang diselesaikan beserta preferensi bahasa aktif (`preferredLanguageId`) disimpan secara lokal di peramban melalui `guestTrialStore` (`merantalk_guest_trial_v1`).
* Begitu pengguna mendaftar atau masuk (via Email/Password atau **Google OAuth 2.0**) dan menuntaskan onboarding, hook **`useGuestTrialSync`** memutar ulang (*replay*) seluruh pelajaran yang diselesaikan secara kronologis dengan *single-flight lock* ke PostgreSQL sehingga XP dan progres Unit 1 tidak pernah hilang.

### 2.2 Stage 1: Registrasi & 3-Step Onboarding Wizard
Pengguna baru yang mendaftar melalui Email/Password atau **Google OAuth 2.0** diarahkan ke alur **3-Step Onboarding Wizard** yang ringkas (< 2 menit):

1. **Welcome Intro -> Step 1: Pemilihan Destinasi Bahasa (`Step1LanguagePicker`):**
   * Menampilkan kartu bahasa dengan ilustrasi **Bendera SVG 3D** (Zero Raw Emoji Policy).
   * Bahasa aktif (**Jepang `ja`** dan **Inggris American `en-us`**) dapat dipilih langsung.
   * Bahasa bertanda *Segera Hadir* (**Inggris British `en-gb`**, **Jerman `de`**, **Mandarin `zh`**, **Prancis `fr`** dengan `is_active = false`) terkunci secara eksplisit beserta label status tanpa pernah melakukan fallback diam-diam ke Jepang.
2. **Step 2: Ritme Belajar Harian & Jalur Penempatan (`Step2PaceAndPlacement`):**
   * **Komitmen Belajar Harian (`daily_goal_minutes`):**
     * **5 Menit / Hari** — Santai & konsisten (~1 materi/hari).
     * **15 Menit / Hari (Rekomendasi)** — Ritme ideal anti-burnout (~2 materi/hari).
     * **30 Menit / Hari** — Progres cepat menuju sertifikasi (~3–4 materi/hari).
     * **45 Menit / Hari** — Akselerasi intensif (~5+ materi/hari).
   * **Jalur Penempatan Awal (`initial_placement_type`):**
     * **Mulai dari Nol (`zero_beginner`):** Langsung menuntaskan onboarding dan memulai dari Unit 1 Level Pemula (`JLPT N5` / `CEFR A1`).
     * **Tes Penempatan Singkat (`placement_test`):** Melanjutkan ke Langkah 3.
3. **Step 3: Tes Penempatan Adaptif 15 Soal (`Step3PlacementTest`):**
   * Mengambil hingga **15 soal diagnostik** (`unit_type = 'diagnostic_exam'`, `order_index = -1`) untuk bahasa pilihan (`ja` atau `en-us`).
   * **Penilaian & Lompat Level Otomatis:** Jika skor >= 80% dan level lanjutan tersedia serta memiliki materi, sistem otomatis menempatkan `user_language_enrollments.current_level_id` ke level berikutnya dan menandai pelajaran level awal sebagai `is_completed = true`, `is_skipped = true` (tetap *replayable* tanpa membanjiri antrean **Pengingat Ulang Otomatis** dengan materi dasar yang sudah dikuasai).
4. **Penyelesaian Wizard:**
   * Backend memberikan bonus selamat datang **+50 XP** (tercatat sebagai `onboarding_completed` di `user_activity_logs`), menginvalidasi cache kurikulum Redis, dan langsung mengarahkan pengguna ke **`/curriculum`**.

### 2.3 Stage 2: Siklus Belajar Harian (Interleaved Study, Grammar Studio & Anti Lupa)
1. **Interleaved Learn-Before-Quiz Study Batches (`LessonIntroView` & `LessonStudyCardsDrawer`):**
   * Pada setiap pelajaran non-checkpoint, alur pembelajaran memadukan **2 kartu studi pengantar -> 2–3 soal latihan -> 2 kartu studi berikutnya** di dalam satu progress bar terpadu.
   * Setiap kartu studi menampilkan aksara/kosakata atau frasa target, pembacaan (Furigana/Romaji atau US IPA), arti Bahasa Indonesia, mnemonik/jembatan keledai, serta audio 2 kecepatan (**Normal `1.0x`** dan **Pelan `0.6x`**) dengan auto-play berurutan.
   * Selama mengerjakan latihan non-checkpoint, pembelajar dapat membuka slide-over **Intip Kartu Materi (`LessonStudyCardsDrawer`)** kapan saja tanpa kehilangan posisi soal.
2. **Latihan Interaktif 4 Pilar:**
   * Soal mencakup `fill_blank`, `listening_choice`, `sentence_builder`, `speaking_repeat`, dan `dialogue_roleplay` dengan umpan balik diagnostik Mera seketika.
   * Soal yang dijawab keliru secara otomatis dijadwalkan masuk ke antrean **Pengingat Ulang Otomatis (`/review`)** agar segera dilatih kembali sebelum lupa.
3. **3-Step Progressive Interactive Grammar Studio (`/grammar` & `/grammar/:code`):**
   * Terbuka untuk seluruh 116 poin tata bahasa (`56` `GP-JA-*` & `60` `GP-EN-*`) dengan alur bertahap: **1. Pahami** -> **2. Coba Rakit** -> **3. Tes Cepat (3 Soal)** yang merekam progres ke `user_grammar_progress`.
4. **Pengingat Ulang Otomatis (Anti Lupa), Kartu Kosakata & Papan Aksara:**
   * Pembelajar mengulas kesalahan latihan di **`/review`** (`user_srs_reviews`), melatih kosakata kurasi per topik di **`/flashcards`** (`user_flashcard_progress`), serta berlatih Hiragana/Katakana/Kanji di **`/kana/:script`** (`user_kana_progress`) saat berada pada jalur Jepang.
5. **Ritual Gamifikasi Harian & Mingguan:**
   * Menyelesaikan 3 Misi Harian rotasi WIB, membuka 3 Peti Harian bertingkat, mengejar Lencana Kehormatan Bulanan (`25` misi/bulan, `+150 XP`), berbelanja di Toko Gems (*Streak Freeze*, *2x XP Booster*), dan bersaing di Liga Mingguan (`Bronze` -> `Diamond`).

### 2.4 Stage 3: Checkpoint Akhir Unit (`tes-akhir`) — Mode Bebas Bocoran
* Di penghujung setiap unit terdapat pelajaran checkpoint (**`tes-akhir`**) yang menguji sintesis seluruh materi unit tersebut.
* **Spoiler-Free Discipline:** Kartu pengantar materi (`LessonIntroView`) dan laci *Intip Kartu Materi* (`LessonStudyCardsDrawer`) dinonaktifkan penuh pada checkpoint. Selain itu, backend secara otomatis menyaring petunjuk terjemahan atau rumus persamaan yang berpotensi membocorkan jawaban (`isFillBlankTranslationSpoiler`, `sanitizeFillBlankSentenceTemplate`).
* Lulus checkpoint membuka gerbang menuju Unit berikutnya (kecuali pengguna Merantalk Pro yang memiliki keleluasaan melompat antar-unit).

### 2.5 Stage 4: Ujian Simulasi Kesiapan (Readiness Mock Exam) & Multi-Language Switching
* Setiap level (`N5–N1` & `A1–C2`) menyediakan **Readiness Exam (`order_index = 99`)** berformat 4 pilar dengan penghitung waktu, bebas bocoran, skor terpisah Reading/Listening/Writing/Speaking (`readiness_exam_attempts`), status lulus terhadap ambang batas resmi (`60%–75%`), serta rekomendasi penguatan ke topik grammar dan antrean **Pengingat Ulang Otomatis** (`/review`).
* Melalui **Track Switcher** di TopBar/Sidebar, pengguna dapat beralih secara instan antara **Jepang (`ja`)** dan **Inggris American (`en-us`)** tanpa konflik data (*Zero Collision*), dengan pembaruan otomatis level, grammar, kartu kosakata, audio BCP-47, serta visibilitas menu Aksara Kana.

---

## 3. Target Personas & Success Metrics

### 3.1 Personas Utama
1. **Rian (24 thn) — Kandidat Tokutei Ginou (SSW) / Engineer Menuju Jepang (`ja` • Aktif):**  
   *Target:* JLPT N5 -> N3 (Akun Gratis) hingga N2 (Merantalk Pro). Sering tertukar partikel (`に` vs `で`) dan konjugasi *te-form*.  
   *Solusi:* Papan Kana/Kanji interaktif, Grammar Studio 3 langkah dengan analogi Indonesia, balok sintaksis berwarna, dan 120 dek **Kartu Kosakata** dengan jadwal latihan ulang adaptif.
2. **Maya (25 thn) — Software Engineer / Kandidat Beasiswa LPDP & Karier Global (`en-us` • Aktif):**  
   *Target:* CEFR A1–B1 (Akun Gratis) hingga B2–C2 / TOEFL iBT 95–114+ (Merantalk Pro). Membutuhkan penguasaan tenses akademik, phrasal verbs/idiom kerja US, dan pelafalan General American IPA.  
   *Solusi:* 67 unit kurikulum 4 pilar dengan 180 dek studi pengantar, 60 panduan grammar ber-IPA Amerika, 60 dek **Kartu Kosakata** (`work_study`, `phrasal_idioms`, `academic_toefl`), dan simulasi Readiness Exam A1–C2.
3. **Kevin, Nadia, David & Claire — Target Ekspansi Jalur Berikutnya (`en-gb`, `de`, `zh`, `fr` • Segera Hadir):**  
   Kandidat studi dan karier di Inggris (IELTS), Jerman (Goethe A1–C1), Tiongkok/Taiwan (HSK 1–6), dan Prancis (DELF/DALF A1–C2) yang akan dilayani di atas arsitektur kurikulum multi-bahasa yang sudah siap di database.

### 3.2 Core Product Metrics
| Metrik | Target | Instrumen Pengukuran |
| :--- | :--- | :--- |
| **Guest-to-Signup Conversion** | > 25% tamu yang menyelesaikan minimal 1 pelajaran Unit 1 | Rasio `guestTrialStore` -> `useGuestTrialSync` completion |
| **Onboarding to First Lesson Completion** | > 80% dari pengguna teregistrasi | Rasio `user_profiles.is_onboarded` vs `user_lesson_progress` |
| **Daily Habit Retention (7-Day Streak)** | > 50% dari active users | `user_gamification.streak` & `user_activity_logs` WIB |
| **Kepatuhan Pengingat Ulang (Anti Lupa)** | > 70% kartu dan soal terjadwal diselesaikan tepat waktu | Antrean jatuh tempo pada `user_srs_reviews` & `user_flashcard_progress` |
| **First-Pass Exercise Accuracy** | > 65% pada percobaan pertama | `user_exercise_attempts.is_correct` |
| **Mock Exam Readiness Correlation** | > 85% kesesuaian dengan hasil ujian resmi | Skor `readiness_exam_attempts` vs survei pengguna |

---

## 4. Core Features & Functional Specifications

### 4.1 Authentication, Google OAuth & 3-Pillar User Architecture
Sesuai skema ternormalisasi di `.agents/docs/erd.md` (v3.2):
* **Pillar 1 — Identity, OAuth & Subscription (`users` & `user_oauth_accounts`):**  
  Menyimpan `id`, `email`, `password_hash` (Bcrypt, *nullable* bagi akun murni Google OAuth), `email_verified`, `subscription_tier` (`'free'` | `'pro'`), `subscription_expires_at`, serta tautan akun **Google OAuth 2.0** (`/api/v1/auth/google`). Sesi menggunakan JWT Access Token (15 menit) dan Rotated Refresh Token di Upstash Redis (30 hari).
* **Pillar 2 — Profile (`user_profiles`):**  
  Menyimpan `name`, `username` unik, `bio`, `avatar_url`, `daily_goal_minutes` (`5 | 15 | 30 | 45`), `is_onboarded`, dan `has_seen_roadmap_tour` (untuk tur spotlight interaktif pertama kali).
* **Pillar 3 — High-Concurrency Gamification (`user_gamification`):**  
  Menyimpan `xp`, `current_level`, `streak`, `gems`, `xp_booster_expires_at`, dan `last_active_at`.

---

### 4.2 Kurikulum Multi-Bahasa & Isolasi Jalur (`languages` -> `exercises`)
Hierarki kurikulum universal: **`languages` -> `proficiency_levels` -> `units` -> `lessons` -> `exercises`**:
1. **Master Bahasa (`languages`):**  
   Menyimpan kode ISO (`ja`, `en-us`, `en-gb`, `de`, `zh`, `fr`), nama lokal Bahasa Indonesia, metadata `supported_scripts JSONB`, dan flag `is_active` (`true` untuk `ja` dan `en-us`; `false` untuk 4 bahasa *Segera Hadir*).
2. **Tingkat Kemahiran Resmi (`proficiency_levels`):**
   * **Jepang (`ja`):** `N5` (beginner, passing 60%), `N4` (beginner), `N3` (intermediate), `N2` (intermediate), `N1` (advanced) — standar **JLPT**.
   * **Inggris American (`en-us`):** `A1` Pra-TOEFL Dasar (beginner, passing 60%), `A2` TOEFL 32–41 (beginner, 60%), `B1` TOEFL 42–71 (intermediate, 65%), `B2` TOEFL 72–94 (intermediate, 65%), `C1` TOEFL 95–114 (advanced, 70%), `C2` TOEFL 115–120 (advanced, 75%) — standar **TOEFL iBT / CEFR**.
3. **Multi-Language Enrollment & Track Switcher (`user_language_enrollments`):**
   * Pengguna dapat mendaftar dan beralih secara instan antar bahasa aktif melalui **Track Switcher** di TopBar/Sidebar.
   * Seluruh progres (`user_lesson_progress`, `user_srs_reviews`, `user_flashcard_progress`, `user_grammar_progress`, `readiness_exam_attempts`) terisolasi ketat (*Zero Collision*).
   * Menu **Papan Aksara (`/kana/:script`)** ditampilkan hanya ketika bahasa aktif mendukung aksara Kana (`ja`) dan disembunyikan otomatis saat bahasa aktif non-Kana (`en-us`).

---

### 4.3 Interleaved Learn-Before-Quiz & Engine Latihan 4 Pilar (`exercises`)
1. **Interleaved Study Batches (`LessonIntroView` & `LessonStudyCardsDrawer`):**
   * Materi pengantar pada pelajaran kurikulum dibagi ke dalam segmen mikro **2 kartu studi -> blok 2–3 soal -> 2 kartu studi berikutnya**.
   * Setiap kartu menyajikan teks target, pembacaan (Furigana/Romaji atau US IPA), arti Bahasa Indonesia, jembatan keledai (mnemonik), serta pemutar suara **Normal (`1.0x`)** dan **Pelan (`0.6x`)**.
   * **Laci Intip Materi (`LessonStudyCardsDrawer`):** Drawer geser di sisi kanan agar pembelajar dapat mengecek ulang materi selama latihan reguler; nonaktif pada Checkpoint (`tes-akhir`) dan Readiness Exam (`order_index = 99`).
2. **5 Tipe Latihan Interaktif:**

| Pilar Kemahiran | Tipe (`exercise_type`) | Mekanisme & Aturan Evaluasi |
| :--- | :--- | :--- |
| **Reading** | `fill_blank` | Melengkapi partikel, kosakata, atau bentuk tenses (pilihan balok atau input teks) dengan proteksi anti-spoiler backend (`isFillBlankTranslationSpoiler`, `sanitizeFillBlankSentenceTemplate`). |
| **Listening** | `listening_choice` | Audio BCP-47 (`1.0x` normal & `0.6x` pelan) dengan transkrip tersembunyi hingga jawaban diperiksa. |
| **Writing** | `sentence_builder` | Menyusun balok kata berkode warna (Biru/Hijau/Oranye/Ungu) disertai balok pengalih (*distractor tiles*). |
| **Speaking** | `speaking_repeat` | Pengenalan suara Web Speech API dengan tombol toleransi *"Tidak bisa bicara sekarang"* dan pengaman backend **`containsJapaneseScript`** agar normalisasi fonetik Romaji hanya berjalan pada soal berbahasa Jepang. |
| **Integrated** | `dialogue_roleplay` | Simulasi dialog dua arah kontekstual bersama Mera dengan terjemahan situasional. |

---

### 4.4 3-Step Progressive Interactive Grammar Studio (`/grammar` & `/grammar/:code`)
Menampung **116 panduan tata bahasa ternormalisasi** (`56` `GP-JA-*` + `60` `GP-EN-A1-001`..`GP-EN-C2-010`) dalam tabel `grammar_points` (`category`: `tense | conjugation | particle | honorific | sentence_pattern`, plus payload kaya `learning_guide JSONB`):
1. **Tab 1 — Pahami:**
   * Contoh kalimat nyata di awal (*example-first*), analogi Bahasa Indonesia yang membumi, kapan digunakan (`when_to_use`), rumus warna interaktif (`GrammarFormulaVisual`), bedah kalimat kata per kata (`GrammarWordBreakdownSection`) dengan tombol toggle **Romaji** (untuk `ja`) atau **IPA** (untuk `en-us`), tabel variasi bentuk (`forms`), serta daftar jebakan umum (`mistakes`).
2. **Tab 2 — Coba Rakit:**
   * *Interactive Slot Playground* (`GrammarSlotPlayground`) tempat pembelajar merakit kombinasi subjek, partikel/preposisi, objek, dan predikat untuk melihat perubahan makna secara langsung beserta audio pengucapannya.
3. **Tab 3 — Tes Cepat (3 Soal):**
   * Mini-kuis 3 soal (`GrammarMiniQuizCard`) yang mencatat skor, status pemahaman (`is_understood`), dan jadwal ulasan berkala (`next_review_at`) ke **`user_grammar_progress`**, serta tautan langsung menuju pelajaran kurikulum terkait.

---

### 4.5 Pengingat Ulang Otomatis Merantalk (Anti Lupa & Ingat Lebih Lama)
Merantalk menjalankan dua mesin **Jadwal Latihan Ulang Adaptif** yang menyesuaikan jarak waktu munculnya kembali materi berdasarkan tingkat kemudahan pembelajar mengingatnya ($EF' = EF + (0.1 - (5 - q)(0.08 + (5 - q) \times 0.02))$, batas minimum faktor kemudahan $EF_{\min} = 1.30$, nilai awal $EF = 2.50$):

1. **Mesin 1 — Antrean Latihan Ulang Soal Keliru (`/review` -> `user_srs_reviews`):**
   * Setiap soal latihan atau ujian simulasi yang dijawab keliru otomatis masuk ke antrean pengingat ulang harian.
   * Penilaian 4 tingkat daya ingat (*Lupa*, *Sulit*, *Bagus*, *Mudah*) memperbarui jarak hari (`interval_days`), jumlah pengulangan (`repetition_count`), faktor kemudahan (`ease_factor`), dan jadwal berikutnya (`next_review_at`).
   * **Soal yang Masih Sering Salah** (berulang kali keliru) ditandai secara khusus agar pembelajar diarahkan kembali ke penjelasan konsep kurikulum dan panduan grammar terkait.
2. **Mesin 2 — Dek Kartu Kosakata Terkurasi (`/flashcards` -> `flashcard_decks`, `flashcard_cards`, `user_flashcard_progress`):**
   * **120 Dek Jepang (`ja`, 1.819 kartu)** dari JLPT `N5` hingga `N1`.
   * **60 Dek Inggris American (`en-us`, 900 kartu)** dari CEFR `A1` hingga `C2` dalam 4 kategori tematik: **`daily`**, **`work_study`**, **`phrasal_idioms`**, dan **`academic_toefl`**.
   * Setiap kartu menampilkan teks target, pembacaan Kana/Romaji atau US IPA, audio 2 kecepatan, arti Bahasa Indonesia, kelas kata (`part_of_speech`), serta jadwal latihan ulang adaptif independen per pengguna agar kosakata menempel lebih lama.

---

### 4.6 Papan Aksara Jepang Interaktif (`/kana/:script`)
* Didukung tabel `kana_characters` dan `user_kana_progress` khusus bahasa Jepang (`ja`).
* Menyajikan papan interaktif **Hiragana**, **Katakana**, dan **Kanji** inti JLPT lengkap dengan urutan baris (`row_group`), mnemonik Bahasa Indonesia, contoh kosakata, audio pelafalan `ja-JP`, serta mode kuis latihan per baris untuk melacak penguasaan (`mastery_score`, `is_mastered`).
* **Adaptif Bahasa:** Tautan navigasi Papan Aksara disembunyikan secara otomatis ketika pengguna sedang aktif belajar bahasa beraksara Latin (`en-us`).

---

### 4.7 Audio Multi-Locale & Procedural Synthesizer (`audioService.ts` + `useActiveSpeechLocale`)
1. **Procedural Web Audio Synthesizer (`audioService.ts` & `soundTokens.ts`):**
   * Menghasilkan **13 preset SFX taktil** secara matematis tanpa unduhan file MP3 eksternal: `node_tap`, `node_hover`, `modal_open`, `modal_close`, `quest_start`, `node_locked`, `trophy_tap`, `track_change`, `yamanote_jingle`, `zen_bell`, `quest_complete`, `gem_collect`, dan `streak_ignite`.
   * Dilengkapi 2 latar suara fokus ambient prosedural (**Universal Lo-Fi Focus** & **Japan Zen Pentatonic**) dengan 3 mode pemutaran (`all` | `sfx_only` | `muted`) yang tersimpan di `audioStore`.
2. **Multi-Locale Speech Synthesis & Recognition (`useActiveSpeechLocale` + `resolveSpeechLocale`):**
   * Memetakan kode bahasa aktif pengguna (baik akun login maupun `guestTrialStore.preferredLanguageId`) secara otomatis ke locale BCP-47 (`ja-JP`, `en-US`, `en-GB`, `de-DE`, `zh-CN`, `fr-FR`).
   * Mendukung pemutaran **Normal (`1.0x`)** dan **Pelan (`0.6x`)** di kartu studi, soal listening, grammar studio, papan aksara, dan flashcard.

---

### 4.8 Gamifikasi, Misi Harian WIB, Toko Gems & Liga Mingguan
1. **Misi Harian Rotasi WIB (`daily_quest_templates` & `user_daily_quest_claims`):**
   * 3 misi harian yang berotasi otomatis setiap pergantian hari **WIB (`Asia/Jakarta`)** dengan klaim hadiah XP idempoten per `(user_id, quest_template_id, claim_date_wib)`.
2. **3 Peti Harian Bertingkat (`user_daily_chest_claims`):**
   * Tier 1, Tier 2, dan Tier 3 terbuka progresif seiring pencapaian target harian untuk mengklaim hadiah **Blue Gems** & bonus **XP**.
3. **Lencana Kehormatan Bulanan (`user_monthly_badge_claims`) & Pencapaian (`badge_definitions`, `user_badges`):**
   * Menyelesaikan **25** misi & pelajaran dalam satu bulan kalender membuka klaim Lencana Bulanan berhadiah **+150 XP**.
4. **Toko Gems & Inventaris (`shop_items` & `user_inventories`):**
   * Pengguna membelanjakan Blue Gems untuk membeli dan mengaktifkan item seperti **Streak Freeze** (melindungi api streak saat absen) dan **2x XP Booster** (pengganda XP aktif selama 15 menit via `xp_booster_expires_at`).
5. **Liga Mingguan (`leaderboard_weekly_rewards`):**
   * 4 divisi kompetitif lintas bahasa berdasarkan XP mingguan: **Bronze** (`0–299 XP`), **Silver** (`300–799 XP`), **Gold** (`800–1.499 XP`), dan **Diamond** (`1.500+ XP`), lengkap dengan indikator zona promosi/aman/degradasi serta klaim hadiah Gems bagi podium **Top 3** setiap pekan ISO.
6. **Standar Visual Desain 3D Taktil Merantalk & Zero Raw Emoji Policy:**
   * Seluruh antarmuka dan basis data bebas dari emoji Unicode mentah. Seluruh bendera negara dirender menggunakan komponen **SVG Bendera 3D** dan ikonografi menggunakan **Phosphor Icons**, dipadukan dengan maskot **Mera** (5 state visual: `IDLE`, `CHEERING`, `COACHING`, `LISTENING`, `CELEBRATING`).

---

## 5. Inventaris Konten Produksi & Peta Jalan Ekspansi (Scope & Rollout)

### 5.1 Live Production Inventory (v1.2.0 — Terpasang di Neon PostgreSQL)
* **Migrasi `000001`–`000012` — Jalur Jepang (`ja` • JLPT N5–N1):**
  * **5 Level Resmi:** `N5`, `N4`, `N3`, `N2`, `N1`.
  * **76 Unit**, **496 Pelajaran**, **4.113 Soal 4 Pilar** (termasuk 1 Tes Penempatan 15 soal & 5 Ujian Simulasi Kesiapan N5–N1).
  * **56 Panduan Grammar Interaktif** (`GP-JA-*`), **120 Deck Flashcard** (**1.819 kartu**), dan Papan Aksara **Hiragana, Katakana & Kanji**.
* **Migrasi `000013`–`000017` — Jalur Inggris American (`en-us` • CEFR A1–C2 / TOEFL iBT):**
  * **6 Level Resmi:** `A1` (Pra-TOEFL Dasar), `A2` (TOEFL 32–41), `B1` (TOEFL 42–71), `B2` (TOEFL 72–94), `C1` (TOEFL 95–114), `C2` (TOEFL 115–120).
  * **67 Unit** (1 Placement + 60 Curriculum + 6 Readiness Exams), **247 Pelajaran**, **2.031 Soal 4 Pilar**, dan **180 dek studi pengantar**.
  * **60 Panduan Grammar ber-IPA General American** (`GP-EN-A1-001`..`GP-EN-C2-010`) & **60 Deck Flashcard** (**900 kartu**).

### 5.2 Roadmap Ekspansi Berikutnya
* **v1.3 (Monetization & Midtrans Integration):** Aktivasi checkout otomatis **Merantalk Pro** via **Midtrans** (QRIS, GoPay/OVO/DANA/ShopeePay, Virtual Account BCA/Mandiri/BRI/BNI) dengan webhook pembaruan `subscription_tier` & `subscription_expires_at`, serta pembaruan sinkron halaman `/pricing` lintas bahasa (`ja` & `en-us`).
* **v1.4 (UK IELTS & European Expansion):** Aktivasi jalur **Inggris British (`en-gb` • IELTS A1–C2)** dan **Jerman (`de` • Goethe A1–C1)** beserta deck flashcard, panduan grammar, dan ujian simulasi masing-masing.
* **v1.5 (Asian & Romance Expansion):** Aktivasi jalur **Mandarin (`zh` • HSK 1–6)** dan **Prancis (`fr` • DELF/DALF A1–C2)**.

### 5.3 Explicit Out-of-Scope
* **Kelas Privat Tatap Muka / Live Video Classroom:** Platform berfokus pada *self-paced mastery* interaktif, AI coaching terstruktur, dan review asinkron (`coaching_submissions`), bukan layanan live video streaming antar-pengguna.
* **Forum Diskusi Bebas Tanpa Moderasi:** Interaksi sosial dibatasi pada Liga Mingguan dan profil pencapaian untuk menjaga fokus belajar serta mencegah spam.
* **Mode Offline Penuh (SQLite Native):** Aplikasi web membutuhkan koneksi jaringan untuk sinkronisasi progres dan leaderboard (dengan penyangga lokal sementara untuk sesi tamu via `guestTrialStore`).

---

## 6. Ketahanan Sistem, Integritas Data & Edge Cases

1. **Sinkronisasi Progres Tamu Anti-Duplikasi (`guestTrialStore` + `useGuestTrialSync`):**  
   Progres Unit 1 dan `preferredLanguageId` pengguna tamu divalidasi dengan skema `zod` di `localStorage` (`merantalk_guest_trial_v1`). Saat masuk/daftar, `useGuestTrialSync` menerapkan *single-flight lock* dan memutar ulang pelajaran secara kronologis sambil menangani konflik `409` dengan bersih.
2. **Proteksi Anti-Double-Submit & Rate Limiting:**  
   Seluruh mutasi kritis (submit jawaban, selesai pelajaran, klaim misi/peti/lencana/hadiah liga, pembelian toko, submit onboarding) dilindungi tombol *optimistic disable* di frontend, pembatas laju (*rate limiting*) berbasis Upstash Redis di backend, serta constraint `UNIQUE` idempoten di PostgreSQL.
3. **Global Loading & Error States:**  
   Seluruh halaman utama menyediakan skeleton loading konsisten dan fallback retry yang bersih tanpa halaman kosong atau *layout shift*.
4. **Spoiler-Free Integrity & Multi-Locale Speech Safety:**  
   Backend menyaring jawaban bocor pada `fill_blank` (`isFillBlankTranslationSpoiler`, `sanitizeFillBlankSentenceTemplate`), menonaktifkan materi pengantar pada `tes-akhir` & `order_index = 99`, serta memastikan normalisasi fonetik Romaji hanya berjalan jika `containsJapaneseScript` bernilai benar.
5. **Penguncian Ketat Jalur Segera Hadir & Zero-Collision Multi-Bahasa:**  
   Bahasa dengan `is_active = false` ditolak eksplisit oleh API (`ErrLanguageNotActive`) dan terkunci di UI tanpa fallback diam-diam ke Jepang. Seluruh tabel progres menyertakan isolasi relasional lintas bahasa.

---

## 7. Model Akses 3-Tier Freemium & Merantalk Pro

Seluruh aturan gerbang akses (*Single Source of Truth*) ditegakkan secara konsisten oleh `frontend/src/shared/utils/levelAccess.ts`, halaman `/pricing`, dan otorisasi tier pada `users.subscription_tier` (`free` | `pro`) serta `users.subscription_expires_at`:

| Dimensi Akses | Mode Coba Tanpa Login (Guest Trial) | Akun Gratis (`subscription_tier = 'free'`) | Merantalk Pro (`subscription_tier = 'pro'`) |
| :--- | :--- | :--- | :--- |
| **Biaya & Autentikasi** | Rp 0 — Tanpa akun | Rp 0 selamanya — Email/Password atau **Google OAuth 2.0** | Langganan Pro: **Bulanan** Rp 49.000, **6 Bulan** Rp 239.000 (~Rp 39.800/bln), **Tahunan** Rp 399.000 (~Rp 33.250/bln) |
| **Level Kurikulum Terbuka** | Seluruh **Unit 1** level pemula (`JLPT N5` / `CEFR A1`) | Akses penuh **JLPT N5–N3** & **CEFR A1–B1** tanpa batas nyawa/energi | Akses penuh semua level termasuk mahir: **JLPT N2–N1** & **CEFR B2–C2 (TOEFL 72–120)** |
| **Navigasi Unit** | Berurutan dari Unit 1 | Berurutan per unit & checkpoint | **Bebas lompat ke unit mana pun** tanpa harus berurutan |
| **Grammar Studio & Kartu Kosakata** | Materi & dek tingkat pemula (`N5` / `A1`) + Papan Kana | Penuh untuk `N5–N3` & `A1–B1` + Papan Kana | Penuh seluruh level termasuk materi bisnis, berita & akademik `N2–N1` & `B2–C2` |
| **Readiness Mock Exam** | Pratinjau pemula | Ujian kesiapan `N5–N3` & `A1–B1` | Seluruh ujian simulasi kesiapan termasuk tingkat lanjut `N2–N1` & `B2–C2` |
| **Progres, Gamifikasi & Karier** | Simpan lokal (`guestTrialStore` + `preferredLanguageId`), auto-sync saat daftar (`useGuestTrialSync`) | Sinkronisasi akun penuh, Misi Harian WIB, 3 Peti Harian, Lencana Bulanan, Pengingat Ulang Otomatis (Anti Lupa), Kartu Kosakata, Toko Gems & Liga Mingguan (`Bronze`–`Diamond`) | Seluruh fitur Akun Gratis + akses fitur karier & coaching (`coaching_submissions`: CV review & mock interview) |

> **Roadmap Integrasi Pembayaran:** Integrasi payment gateway **Midtrans** (QRIS, E-Wallet lokal GoPay/OVO/DANA/ShopeePay, dan Virtual Account Bank BCA/Mandiri/BRI/BNI) dijadwalkan pada rilis berikutnya untuk mengotomatisasi aktivasi dan perpanjangan `subscription_tier = 'pro'`.

---

## 8. Technical Architecture Stack

| Lapisan Sistem | Teknologi Produksi | Pola & Standar Arsitektur |
| :--- | :--- | :--- |
| **Frontend Web SPA** | React 19, TypeScript 5.9 (**Zero `any`**), Vite 8, Tailwind CSS v4, Phosphor Icons | **Feature-Sliced + Headless Hook Pattern** (`features/<domain>/{components,hooks,pages,services,store,types,utils}` + `shared/`), Zustand (`authStore`, `guestTrialStore`, `onboardingStore`, `audioStore`), TanStack Query v5, `react-hook-form` + `zod`, global skeleton loading & anti-double-submit guards |
| **Audio & Speech Engine** | Procedural Web Audio API (`audioService.ts`, 13 SFX + 2 ambient soundscapes) + Web Speech API (`useActiveSpeechLocale`) | Sintesis audio zero-MP3 bebas latensi jaringan + pengucapan/pengenalan multi-locale BCP-47 (`ja-JP`, `en-US`, dll.) |
| **Backend REST API** | Go 1.25+, Gin Web Framework | **Modular Clean Architecture** (`internal/app/<module>/{domain,repository,usecase,handler,helper}.go` + `internal/shared/{apperror,middleware,progression,response,router}`) |
| **Database & Caching** | **Neon Serverless PostgreSQL 16** (`pgx/v5`, `pgcrypto`) + **Upstash Redis TLS** | 32 tabel relasional ternormalisasi + payload `JSONB` (17 migrasi `000001`–`000017`); Redis TLS untuk rotated refresh tokens, rate limiting, dan cache kurikulum |
| **Cloud Deployment** | Vercel Serverless Go Function (`backend/api/index.go`, region **`sin1` Singapura**) + Vercel Static SPA CDN | Live production di `https://merantalk.vercel.app`, terhubung langsung ke Neon PostgreSQL & Upstash Redis |

---

## 9. Cross-References & Contract Documents

Seluruh implementasi basis data dan kontrak antarmuka REST API harus tetap selaras 100% dengan dokumen sumber kebenaran berikut:
* **Database Schema, DBML & Migration Inventory (v3.2 — 32 Tables, `000001`–`000017`):** [`.agents/docs/erd.md`](file:///c:/Projects/codeabroad/.agents/docs/erd.md)
* **REST API OpenAPI 3.0.3 Specification (v3.2.0):** [`docs/api/openapi.yaml`](file:///c:/Projects/codeabroad/docs/api/openapi.yaml)
* **Engineering & Repository Overview (v3.2):** [`README.md`](file:///c:/Projects/codeabroad/README.md)
