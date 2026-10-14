# 📋 MASTER TODO: CodeAbroad Platform & Learning Path System

> **File Lokasi:** `c:\Projects\codeabroad\.agents\todo.md`  
> **Status:** Single Source of Truth (SSOT) Master Todo — Disimpan permanen di repository workspace agar tidak terhapus.  
> **Arah Desain Terbaru:** Angka langsung per-part di jalur belajar (1, 2, 3, 4, 5...), unit kurikulum teknis nyata (BUKAN nama stasiun), 3 state pengerjaan part, Peti Hadiah 3D pengganti Tolok Ukur, dan sidebar ringkas.

---

## 🎯 Arahan Utama Desain Baru (User Directive)

1. **Angka Langsung di Setiap Node Stepping-Stone (1, 2, 3, 4, 5...)**:
   - Menghilangkan icon-icon simbolis yang ambigu (`</>`, `✓`, `🔒`, `🎁`).
   - Setiap part modul koding langsung memiliki angka timbul 3D yang jelas, tebal, dan taktil.
2. **Semua Part Langsung Muncul di Jalur (*Direct Sequential Breakdown*)**:
   - Tidak lagi menyembunyikan part-part materi di dalam modal quest yang membingungkan.
   - Di jalur berliku, setiap unit langsung membentangkan part-partnya secara berurutan:
     - **Unit 1: Golang Dasar** (Part 1, 2, 3, 4, 5...)
     - **Unit 2: Golang REST API & Middleware** (Part 1, 2, 3, 4...)
     - **Unit 3: Golang Concurrency & Channels** (Part 1, 2, 3...)
     - **Unit 4: Microservices & Capstone Portofolio** (Part 1, 2...)
3. **3 State Pengerjaan Part yang Jelas**:
   - ✅ **`sudah selesai dikerjakan` (Completed)**: Tombol hijau emerald 3D taktil, centang badge `✓`, dapat diulang kapan saja (+XP sudah diklaim).
   - ⚡ **`sudah bisa dikerjakan` (Active / Available)**: Tombol biru brand 3D taktil dengan outer progress ring berdenyut, popover mengambang: *"Part X: [Judul] • LANJUTKAN (+50 XP)"*, didampingi maskot Kodi yang cheering.
   - 🔒 **`belum bisa dikerjakan` (Locked / Terkunci)**: Tombol abu-abu slate taktil, angka tetap terlihat jelas (`3`, `4`, `5`), dengan mini badge gembok `🔒`. Saat diklik, Kodi memberi tahu bahwa part sebelumnya harus diselesaikan dulu.
4. **Hapus Semua Nama Stasiun Kereta & Ornamen Gimmick**:
   - Hapus: *"Stasiun Akihabara"*, *"Stasiun Shinjuku"*, *"Stasiun Shibuya"*, *"Stasiun Tokyo Central"*.
   - Hapus: *"Rel Yamanote"*, *"Rambu JY"*, *"Taman Ueno"*.
   - Ganti dengan nama modul kurikulum IT riil berstandar industri.
5. **Sidebar Kanan yang Relevan & Ringkas (~650px Total — Bebas Terpotong Layar)**:
   - **Streak Tracker 🔥**: 7 hari sinkron riil dengan data user.
   - **Peti Hadiah & Target 50 XP Harian 🎁**: Pengganti Tolok Ukur Karier yang kaku, menampilkan peti emas 3D berkilau dengan progress bar harian.
   - **Misi Harian 🎯**: Pindah dari kolom tengah ke sidebar kanan di bawah Peti Hadiah.
   - **Kosakata Kantor Tokyo 🇯🇵**: Format ringkas (~160px) tanpa nested box berlebih.

---

## 🚀 FASE 9: Restrukturisasi Jalur Belajar Berangka (The Learning Path Parts) (SELESAI ✅)

### [x] 9.1 Ganti Komponen `YamanotePathMap` Menjadi `CurriculumPathMap.tsx`
- [x] Buang semua nama stasiun ("Akihabara", "Shinjuku", dll.), rambu JY, dan sakura Ueno.
- [x] Ganti dengan struktur **Unit Kurikulum Nyata**:
  - **Unit 1: Golang Dasar** (Part 1 - Variabel & Tipe Data, Part 2 - Pointer & Struktur Data).
  - **Unit 2: Golang REST API & Middleware** (Part 3 - Gin Routing Engine, Part 4 - Routing & JWT Middleware, Part 5 - Database Connection Pool).
  - **Unit 3: Golang Concurrency & Channels** (Part 6 - Worker Pool & Concurrency).
- [x] **9.1.B Visual Unit Banner Lengkap untuk Unit 1, 2, dan 3 (Duolingo Multi-Unit Track)**:
  - **Banner Unit 1 (Golang Dasar)**: Tema Emerald/Teal + Badge "SELESAI (100%)" + Node Part 1 & 2.
  - **Banner Unit 2 (Golang REST API & Middleware)**: Tema Electric Blue + Badge "SEDANG BERJALAN" + Node Part 3 (Selesai), Part 4 (Aktif + Popover CTA + Kodi), Part 5 (Terkunci).
  - **Banner Unit 3 (Golang Concurrency & Channels)**: Tema Violet/Purple + Badge "TERKUNCI" + Node Part 6 (Terkunci).
- [x] Tampilkan setiap node dengan **Angka Timbul 3D** yang besar dan tegas (`1`, `2`, `3`, `4`, `5`).
- [x] Terapkan 3 status pengerjaan yang jelas:
  - `sudah selesai dikerjakan`: Hijau emerald 3D + badge centang `✓`.
  - `sudah bisa dikerjakan`: Biru brand 3D + ring progres berdenyut + Floating Popover CTA `LANJUTKAN KODING (+50 XP)`.
  - `belum bisa dikerjakan`: Abu-abu slate 3D + angka terlihat jelas + badge gembok `🔒`.
- [x] Pasang Sticky Unit Header Banner di puncak unit:
  - Tag: `UNIT 2 • GOLANG REST API & MIDDLEWARE`
  - Subjudul: `Routing Engine, JWT Controller & Database Pool`
  - Tombol aksi: `📖 BUKU PANDUAN BAB`.
- [x] Pastikan jarak nafas vertikal luas (~170px–190px per node) dengan kurva SVG Bezier yang meliuk mulus tanpa ada tabrakan teks/maskot.

### [x] 9.2 Hapus Sapaan Ganda & Bersihkan Kolom Utama di `DashboardPage.tsx`
- [x] Hapus H1 `Selamat Datang Kembali, admin123!` dan teks target redundan.
- [x] Hadirkan **Top Contextual Bar** ringkas:
  - Badge Unit Aktif: `Golang REST API & Middleware`
  - Status Gamifikasi: Streak 🔥, XP ⭐, dan Level Kodi.
  - Search input yang rapi.
- [x] Hapus `KodiStationHero` terpisah (karena sudah dilebur ke Unit Header dan Floating Popover pada node aktif).

---

## 🚀 FASE 10: Refinement Sidebar Kanan Berdaya Tarik Tinggi (SELESAI ✅)

### [x] 10.1 Peningkatan Visual Widget Konsistensi Belajar (Duolingo 3D Flame Tokens)
- [x] Ganti lingkaran datar dan angka tanggal yang membingungkan dengan **Token Api 3D** (gradient amber-orange + bevel shadow `shadow-[0_3px_0_0_#C2410C]`).
- [x] Sinkronisasi jumlah api aktif secara dinamis sesuai `userStreak` asli (hari aktif menyala tebal, hari ini dengan ring berdenyut, hari mendatang dengan titik halus).
- [x] Header kartu gamified: Badge api 3D timbul `🔥 {userStreak} Hari Aktif` berlatar belakang hangat `bg-gradient-to-b from-orange-50/40`.
- [x] Banner motivasi adaptif Kodi On Fire: Menampilkan pesan motivasi mempertahankan api belajar baik untuk streak pemula (< 7 hari) maupun streak tinggi (>= 7 hari).

### [x] 10.2 Buat Widget Peti Hadiah & Target 50 XP Harian (`DailyGoalChestCard.tsx`)
- [x] Menggantikan `TokyoCompetencyCard.tsx` yang kurang relevan.
- [x] Komponen baru memuat:
  - Header: `Sparkle` + "Target Harian" + badge "PETI EMAS".
  - Visual Peti Harta Karun 3D taktil emas dengan efek glow/kilau.
  - Progress bar taktil `30 / 50 XP (60%)`.
  - Balon tip Kodi: *"Tuntaskan 1 modul lagi untuk membuka peti hari ini!"*.
  - Tombol interaktif `KLAIM HADIAH` saat mencapai 50 XP.
  - Tinggi terukur: ~170px (ringkas & memotivasi).

### [x] 10.3 Relokasi Widget Misi Harian ke Sidebar Kanan
- [x] Pindahkan widget `Misi Harian` dari kolom tengah ke sidebar kanan (di bawah Peti Hadiah).
- [x] Format ringkas (~180px) dengan 2 misi aktif, progress bar mini, dan tombol aksi `KLAIM XP` / `MULAI`.
- [x] Kolom tengah 100% bebas dari tumpukan kartu bawah.

### [x] 10.4 Penyederhanaan Widget Kosakata Kantor Tokyo (`TechNihongoCard.tsx`)
- [x] Hilangkan kotak bersarang ganda.
- [x] Format ringkas (~160px): Kata `Jissou (実装)`, arti `Implementasi Fitur`, tombol salin 📋, dan 1 kotak kutipan contoh standup pagi yang elegan.

### [x] 10.5 Validasi Build & Responsivitas
- [x] Jalankan `npm run build` untuk memastikan kelulusan typecheck dan bundling Vite (Sukses exit 0).
- [x] Pastikan seluruh sidebar (~650px total) dan jalur belajar berangka pas sempurna di viewport tanpa terpotong.

---

## 🚀 FASE 11: Multi-Track Course Switcher & Country-Agnostic Architecture (SELESAI ✅)

### [x] 11.1 Pembersihan Emoticon Ngawur & Penggunaan Brand SVG Resmi
- [x] Buang semua emoji tidak relevan (`🐹`, `🐼`) pada logo track koding.
- [x] Perbaiki `GoLogo`: Menggunakan path resmi Go brandmark (`viewBox="0 38 128 52"`) dengan 3 speed streaks dan huruf tebal 'G' & 'O' dalam `#00ACD7` cyan (menghilangkan bug path terpotong yang sebelumnya tampak seperti '-O').
- [x] Perbaiki `ReactLogo`: Menggunakan vector resmi filled atom dari `assets/react.svg` dalam `#00D8FF` cyan cerah dengan orbit solid tebal (menghilangkan garis wireframe tipis).
- [x] Perbaiki `DockerLogo`: Menggunakan vector resmi SimpleIcons (`viewBox="0 0 24 24"`) dengan tumpukan kontainer pengiriman dan siluet paus utuh dalam `#2496ED` (menghilangkan siluet gepeng yang mengecil).
- [x] Perbaiki `FundamentalLogo`: Menggunakan badge terminal developer `>_` dalam `#4F46E5` indigo yang tajam dan representatif.
- [x] Kalibrasi ukuran frame icon di `CourseSwitcherModal.tsx` (`w-6 h-6` / `w-7 h-5`) dan `DashboardPage.tsx` (`w-7 h-7`) agar proporsional dan tidak terpotong.

### [x] 11.2 Penataan 2 Kategori Resmi di `CourseSwitcherModal.tsx`
- [x] **Kategori 1: Spesialisasi Koding**:
  - `Fundamental Programming` (Crash Course memori, struct, hash map, pointer & Git CLI)
  - `Golang Backend Engineering` (Gin REST API, JWT, Pgxpool & Concurrency)
  - `React & TypeScript Frontend` (TypeScript, React 19, Hooks & Next.js App Router)
  - `DevOps & Cloud Infrastructure` (Linux Shell, Docker, CI/CD & AWS)
- [x] **Kategori 2: Bahasa & Karier Luar Negeri**:
  - `Tech Nihongo (Bahasa Jepang IT)` (Kosakata Koding, Asakai Standup, PR Review & Interview Tokyo)

### [x] 11.3 Relokasi Pemilih Jalur Belajar ke Sidebar Kanan (`DashboardPage.tsx`)
- [x] Pindahkan pemilih jalur belajar dari Top Bar ke **Puncak Sidebar Kanan** (`aside`).
- [x] Kartu **Jalur Belajar Aktif**:
  - Badge kategori: `Jalur Belajar Aktif` (biru pastel)
  - Logo brand resmi besar (`w-12 h-12` rounded-2xl dengan Go / React / Docker / Nihongo)
  - Judul materi & subjudul spesialisasi
  - Progress bar mini persentase aktif (`40%`)
  - Tombol aksi `Ganti ▾` yang membuka [CourseSwitcherModal.tsx](file:///c:/Projects/codeabroad/frontend/src/components/game/CourseSwitcherModal.tsx).
- [x] Streamline Top Bar:
  - Sisi kiri: Search input yang lega & lapang (`w-full sm:w-72 md:w-80`).
  - Sisi kanan: Game Status HUD (Streak 🔥, XP ⭐, Level Kodi) tanpa saling berdesakan.

### [x] 11.4 Integrasi Kurikulum 5 Jalur di `CurriculumPathMap.tsx`
- [x] `fundamental` (Unit 1: Memori & Variabel, Unit 2: Struktur Data, Unit 3: CLI Git HTTP)
- [x] `golang` (Unit 1: Dasar, Unit 2: REST API, Unit 3: Concurrency)
- [x] `frontend` (Unit 1: TypeScript, Unit 2: Custom Hooks, Unit 3: Next.js SSR)
- [x] `devops` (Unit 1: Linux Shell, Unit 2: Docker, Unit 3: CI/CD AWS)
- [x] `nihongo` (Unit 1: Kosakata Git, Unit 2: Asakai Standup & PR, Unit 3: Mensetsu Interview)

---

## 🚀 FASE 12: Penyatuan Kurikulum Terpadu & Resolusi Spasi Jalur Belajar (SELESAI ✅)

### [x] 12.1 Penyatuan Kurikulum ke 3 Program Karier Tokyo All-in-One
- [x] Satukan Fondasi IT + Spesialisasi Teknis + Bahasa Jepang Kerja ke dalam 3 Program Karier Utama:
  - **Frontend Engineer (React & TS)**
  - **Backend Engineer (Golang)**
  - **DevOps & Cloud Engineer**
- [x] Hilangkan pembagian kursus terpisah yang membuat alur UX membingungkan.
- [x] Perbarui [CourseSwitcherModal.tsx](file:///c:/Projects/codeabroad/frontend/src/components/game/CourseSwitcherModal.tsx) dengan visual 3 Program Karier komprehensif.

### [x] 12.2 Resolusi Tumpukan Elemen & Spasi Lega (*Collision-Free Duolingo S-Curve*)
- [x] **Pelebaran Spasi Vertikal (`VERTICAL_SPACING = 175px`)**: Menghilangkan tabrakan fisik 27px antar disc 72px dan kartu teks di bawahnya.
- [x] **Clearance Popover Atas (`START_Y = 135px`)**: Memastikan balon popover modul aktif (`-top-28`) berada 100% di dalam kanvas tanpa terpotong tepi atas.
- [x] **Kurva S 4-Titik Dinamis (`xSequence = [135, 200, 265, 200]`)**: Mencegah Peti Hadiah 🎁 dan Trofi Ujian 🏆 bertumpuk pada garis vertikal yang sama.
- [x] **Eliminasi Kartu Ganda Modul Aktif**: Menghilangkan label bawah redundan saat modul aktif agar disc memiliki ruang bernapas lega diapit popover atas dan maskot Kodi.
- [x] **Milestone Badges Ramping**: Mengubah kartu kotak tebal pada Peti dan Trofi menjadi pill ramping bergaya Duolingo (`🎁 Diklaim (+30 XP)` / `🏆 Lulus (+50 XP)`).
- [x] **Streamline Top Bar & Sidebar**: Memindahkan indikator karier ke Duolingo-style pill di bar atas, membersihkan sidebar kanan dari kartu raksasa yang sesak.

### [x] 12.3 Eliminasi Double Scroll & Peleburan Peti ke Misi Harian (*Duolingo Web Sidebar*)
- [x] **Peleburan Peti Emas ke Dalam Misi Harian**: Menggabungkan Target Harian (Peti Emas 50 XP) dan Misi Harian menjadi 1 widget terpadu, menghemat ruang ~140px.
- [x] **Eliminasi Teks Terpotong (`truncate`)**: Judul misi sekarang tampil lengkap 2 baris tanpa terpotong `...`, contoh kalimat Bahasa Jepang membentang alami.
- [x] **Kartu Bahasa Jepang Tokyo Tampil 100% Utuh**: Kartu ke-3 naik ke atas dengan nyaman, bebas dari terpotong garis layar laptop bawah.
- [x] **Hapus `h-screen` & `overflow-y-auto`**: Menghilangkan nested scrollbar kedua yang membuat kursor mouse terjebak.
- [x] **Total Tinggi ~460px Bebas Double Scroll**: Pas sempurna di viewport mana pun dengan `xl:sticky xl:top-4 xl:self-start`.

### [x] 12.4 Transformasi Menuju Seamless Sectional Rail (*Zero Card-itis*)
- [x] **Eliminasi Border Fatigue**: Membuang border-2 kotak luar warna-warni yang bertumpuk.
- [x] **Aliran Kanvas Murni**: Mengubah sidebar menjadi 1 panel putih mengalir dengan pembatas garis tipis 1px (`h-[1px] bg-slate-100`).
- [x] **Hirarki Fokus Bersih**: Panggung utama (peta belajar kurikulum) menjadi 100% pusat perhatian tanpa terdistraksi kotak-kotak berat di samping.

### [x] 12.5 Transformasi Peta Belajar ke Open World Canvas (*Duolingo Stage Architecture*)
- [x] **Eliminasi Card Box Sekeliling Jalur**: Membuang kotak `border-2 border-slate-200 bg-white rounded-3xl overflow-hidden` di sekeliling S-curve path di [CurriculumPathMap.tsx](file:///c:/Projects/codeabroad/frontend/src/components/game/CurriculumPathMap.tsx).
- [x] **Open World Canvas & `overflow-visible`**: Jalur serpentin dan disc melayang bebas di kanvas panggung utama tanpa terpotong batas kotak.
- [x] **Rampingkan Banner Unit Bab (~75px)**: Mengubah banner dari kotak raksasa 6 baris teks menjadi archway Duolingo ramping:
  - Teks pill tidak lagi patah 2 baris (`UNIT {n} • [🔒 TERKUNCI]`).
  - Judul materi ringkas, elegan, dan sejajar vertikal dengan tombol Buku Panduan.
  - Membuang paragraf deskripsi gemuk dari banner demi proporsi visual yang seimbang.
- [x] **Kedalaman Visual & Gradasi Aura Tanpa Hambar**:
  - **Ambient Biome Spotlight Aura**: Pendaran radial lembut (`blur-3xl opacity-30`) berwarna biru/emerald/ungu di belakang jalur sesuai unit.
  - **Blueprint Dot Matrix**: Tekstur dot grid micro (`radial-gradient`) dengan fade-out melingkar halus di tepi.
  - **3D Banner Gloss & Tactile Lip**: Lapisan pantulan kaca glossy di atas banner + bayangan 3D tebal `shadow-[0_4px_0_0_rgba(0,0,0,0.18)]`.
  - **Neon Track Glow**: Jalur rel aktif menyala dengan pendaran biru neon lembut di belakang garis serpentin.
- [x] **Eliminasi Teks Label Terpotong**: Mengubah kartu nama materi dari `truncate` menjadi `line-clamp-2 max-w-[170px] leading-snug` sehingga judul materi tampil utuh tanpa terpotong `...`.
### [x] 12.6 Papan Game Terpadu (*Unified Adventure Game Stage*)
- [x] **Satu Papan Kanvas Induk (`max-w-2xl mx-auto`)**: Seluruh unit belajar (Unit 1, 2, 3) kini dibingkai dalam satu papan petualangan terpadu (`bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-7`).
- [x] **Eliminasi Void Putih Tanpa Batas**: Mengunci lebar stage agar elemen `{ }` dan `func() : tokyo_prod` membingkai jalur rel secara presisi di dalam papan (~80px dari disc), tidak lagi terlempar ke pojok monitor.
- [x] **Dot Matrix Terintegrasi**: Papan memiliki tekstur dot blueprint halus (`[radial-gradient(#E2E8F0_1.2px,transparent_1.2px)]`) dengan kontras tajam terhadap latar belakang halaman `#FAFAF9`.
- [x] **Perbaikan Syntax DockerLogo**: Mengembalikan tanda kurung pembuka `{` pada baris 119 [DashboardPage.tsx](file:///c:/Projects/codeabroad/frontend/src/pages/DashboardPage.tsx).

---

## ⚡ FASE 13: Integrasi Data Dinamis Dashboard & Sinkronisasi Backend (SELESAI ✅)

### [x] 13.1 Sinkronisasi Profil & Gamifikasi Real-Time (`useDashboard.ts` & HUD Bar)
- [x] Sambungkan `user.xp`, `user.streak`, dan `user.current_level` dari `GET /api/v1/users/me` langsung ke HUD bar atas.
- [x] Hapus mock multiplier `user.xp * 100` dan fallback angka palsu (`5,400`, `14`, `7`).
- [x] Set peminatan aktif (`activeTrack`) secara otomatis dari `user.primary_stack` atau `user.career_path_id` profil pengguna saat pertama kali memuat dashboard.

### [x] 13.2 Kalender Konsistensi 7-Hari Dinamis (Streak Calendar Engine)
- [x] Deteksi hari aktif mingguan (Senin–Minggu) secara dinamis sesuai kalender lokal (`new Date().getDay()`).
- [x] Tandai token api 3D menyala secara akurat berdasarkan `user.streak` dan tanggal `user.last_active_at`.
- [x] Sorot hari ini (*Today Indicator*) dengan border putus-putus dan pesan pemicu aksi yang tepat.

### [x] 13.3 Target Peti Emas & Misi Harian Terpadu (Daily Quest Engine)
- [x] Konsumsi data misi harian riil dari `GET /api/v1/quests/daily` via hook `useQuests()`.
- [x] Hitung total XP misi harian yang diselesaikan hari ini secara otomatis.
- [x] Buat progress bar `todayXp / 50 XP` bergerak dinamis (0% – 100%) dan berikan status buka pada Peti Emas saat target 50 XP tercapai.
- [x] Pastikan klik tombol aksi pada misi mengarahkan pengguna langsung ke workspace belajar `/learn/:questId`.

### [x] 13.4 Peta Kurikulum Dinamis (`CurriculumPathMap.tsx` ➔ `useRoadmap`)
- [x] Integrasikan hook `useRoadmap(activeTrack)` yang memanggil endpoint `GET /api/v1/roadmaps/:track_slug` atau `GET /api/v1/roadmaps/active`.
- [x] Transformasikan struktur data backend (`Roadmap ➔ Stations ➔ Chapters ➔ Quests`) ke format kanvas kurikulum:
  - Station / Chapter ➔ Unit Banner (Nomor unit, judul materi, tema gradasi, status).
  - Quests ➔ Stepping Stone Berangka 3D (1, 2, 3...) dengan status riil (`completed`, `active`, `locked`) dari tabel `user_quests`.
- [x] Pertahankan *graceful degradation* (fallback kurikulum bawaan) jika backend sedang offline atau koneksi terputus.

### [x] 13.5 Kosakata Harian Kantor Tokyo Dinamis (`TechNihongoCard.tsx`)
- [x] Bangun engine rotasi kosakata harian IT Tokyo (*Daily Tech Nihongo*) berdasarkan tanggal kalender.
- [x] Tampilkan istilah teknis relevan (Kanji, Romaji, Furigana, Terjemahan, dan contoh kalimat standup *Asakai*).
- [x] Integrasikan fitur Web Speech API (audio pengucapan) dan tombol salin instan.

### [x] 13.6 Validasi Pipeline & Pengujian End-to-End
- [x] Jalankan `npm run build` di frontend untuk memvalidasi zero error TypeScript.
- [x] Jalankan `go test -count=1 ./...` di backend untuk menjamin 100% test coverage endpoint.
- [x] Uji skenario alur: Pengguna login ➔ dashboard menampilkan progres riil ➔ ganti track karier ➔ peta kurikulum berganti secara instan.

---

## ⚡ FASE 14: Finalisasi Interaktivitas & Dinamisasi Lanjutan (SELESAI ✅)

### [x] 14.1 Modal Detail Part Belajar 3D (`CurriculumPathMap.tsx` ➔ `activeModalNode`)
- [x] Render Modal Dialog 3D taktil bergaya Duolingo saat pengguna mengklik node stepping stone manapun.
- [x] State Selesai (Completed): Tampilkan ringkasan materi, badge "Sudah Selesai", ilustrasi Kodi Proud, dan tombol `KODING ULANG (LATIHAN)`.
- [x] State Aktif (Active): Tampilkan popover info lengkap, prasyarat, estimasi waktu, ilustrasi Kodi Coding, dan tombol `MULAI KODING SEKARANG (+50 XP)`.
- [x] State Terkunci (Locked): Tampilkan ilustrasi Kodi Thinking dengan pesan ramah bahwa part sebelumnya harus diselesaikan terlebih dahulu, serta tombol `MENGERTI, TUTUP`.
- [x] State Peti/Trofi: Menampilkan ilustrasi Kodi Celebrate dengan info hadiah bonus XP dan permata.

### [x] 14.2 Persistensi Pilihan Jalur Belajar ke Backend (`CourseSwitcherModal.tsx` & `PATCH /api/v1/users/me`)
- [x] Buat handler & usecase `PATCH /api/v1/users/me` di backend Go untuk memperbarui `primary_stack` dan `career_path_id`.
- [x] Sambungkan modal switcher ke mutasi API via `authService.updateProfile` dan `actions.refetchProfile()` sehingga saat berganti track (misal Golang ➔ Frontend), preferensi tersimpan permanen di database PostgreSQL.

### [x] 14.3 Klaim Hadiah Nyata di Backend (Quest Claim & Peti Emas)
- [x] Sambungkan tombol `KLAIM` pada Misi Harian ke backend (`POST /api/v1/quests/:id/submit`) via `questService.submitQuest` agar perolehan XP dan status tersimpan nyata di PostgreSQL (menghilangkan ketergantungan pada state semu).
- [x] Tambahkan aksi interaktif klik pada Peti Emas saat mencapai target 50 XP untuk membuka modal selebrasi Peti Emas (+20 💎 Permata dan +50 XP Harian) dengan animasi selebrasi.

### [x] 14.4 Drawer / Modal Buku Panduan Bab (Guidebook Cheatsheet)
- [x] Ganti toast banner statis pada tombol `📖 BUKU PANDUAN BAB` menjadi modal cheatsheet 3D nyata.
- [x] Tampilkan ringkasan konsep inti, contekan sintaks standar industri dengan tombol salin instan (📋), dan standar engineering Tokyo untuk setiap unit kurikulum.

### [x] 14.5 Eliminasi Kotak Pencarian & Penggantian dengan Bar Progres Jalur (Opsi 3)
- [x] Hapus input pencarian `searchQuery` yang kurang cocok di peta belajar bertahap gamified.
- [x] Pasang pemilih jalur belajar taktil 3D lengkap dengan logo SVG resmi (`GolangLogo`, `ReactLogo`, `DockerLogo`).
- [x] Pasang bar progres horizontal ramping dengan metrik dinamis modul selesai vs total modul (`0/10 Modul (0%)` saat mulai fresh).
- [x] Inisialisasi status progres fresh user ke Part 1 (`defaultActivePart: 1`, Unit 1 `SEDANG BERJALAN`, Unit 2+ `TERKUNCI`, dan sequential locking ketat sehingga hanya 1 modul pertama yang aktif).

---

## ⚡ FASE 19: Refinement Gamifikasi Dashboard & Widget Pendukung (Opsi B)

### [x] 19.1 Dinamisasi Nama Developer pada Kosakata Jikoshoukai (`TechNihongoCard.tsx`)
- [x] Ganti nama hardcoded "agam" pada contoh kalimat perkenalan diri (*"Hajimemashite, Indonesia kara kimashita agam to moushimasu."*) dengan nama profil asli pengguna `{user?.name || user?.username || 'developer'}` dari `useAuthStore`.

### [x] 19.2 Sinkronisasi Fallback Misi Harian (`DashboardPage.tsx`)
- [x] Ubah fallback `activeQuests` yang awalnya merujuk ke modul lanjut (`part-4-gin-routing`) agar selaras dengan posisi fresh user di Part 1 (`part-1-variabel-dan-tipe-data`, "GO 01").

### [x] 19.3 Perbaikan Bug UI: Backdrop Shadow Modal Terpotong di Bagian Bawah (`CurriculumPathMap.tsx` & Modals)
- [x] Bungkus modal dengan `createPortal(modalElement, document.body)` dari `react-dom` dengan `fixed inset-0 w-screen h-screen z-50` agar overlay backdrop gelap menutup 100% viewport layar tanpa celah putih di bagian bawah.

---

## ⚡ FASE 15: Dinamisasi Penuh Workspace Koding & Quiz Runner (Opsi A) (`LearnWorkspacePage.tsx` & `QuestCompleteModal.tsx`) (SELESAI ✅)

### [x] 15.1 Sinkronisasi Detail Misi Riil dari Backend (`useLearnWorkspace` ➔ UI)
- [x] Ganti teks hardcoded breadcrumb ("Station 3 • Bab 2") dengan `{quest?.chip_label}` dan `{quest?.title}`.
- [x] Ganti tombol navigasi `← Silabus` yang mengarah ke `/courses` menjadi kembali ke `/dashboard`.
- [x] Ganti badge statis XP (`⚡ +50 XP`) dan estimasi waktu dengan data riil `{quest?.xp_reward}` dan `{quest?.estimated_minutes}`.
- [x] Ganti badge statis streak `🔥 5 HARI` dengan data streak riil pengguna dari `useAuthStore` / profil.
- [x] Ganti progress bar statis `Step 2/4 (50%)` dengan kalkulasi kriteria penerimaan yang terpenuhi vs total kriteria.
- [x] Sinkronkan deskripsi materi, skenario industri Tokyo (`{quest?.story_context}` / `{quest?.description}`), dan catatan Nihongo (`{quest?.nihongo_notes}`).
- [x] Render daftar Kriteria Penerimaan (*Acceptance Criteria*) secara dinamis dari `{quest?.acceptance_criteria}` (menghilangkan hardcoded checklist).
- [x] Muat starter code dan nama file tab editor secara dinamis dari `{quest?.starter_code}`.

### [x] 15.2 Integrasi Test Runner & Eksekusi Unit Test Real-Time
- [x] Sambungkan tombol `JALANKAN TES (CTRL+ENTER)` ke `POST /api/v1/quests/:id/run-tests` dengan payload kode editor.
- [x] Update status centang/silang pada masing-masing kriteria penerimaan berdasarkan `testResult.criteria_results`.
- [x] Tampilkan output terminal konsol riil dari sandbox Go runner (stdout, stderr, durasi eksekusi dalam milidetik).

### [x] 15.3 Layar & Modal Selebrasi Kelulusan Dinamis (`QuestCompleteModal.tsx` & `QuestCompletePage.tsx`)
- [x] Tampilkan judul quest yang baru diselesaikan secara dinamis dari `{quest?.title}` (hapus hardcoded `Station 3 • Bab 2` dan `GIN // 04`).
- [x] Tampilkan perolehan XP riil (`submitResult.xp_awarded`), saldo streak terkini dari auth state (bukan fallback statis `5 HARI` / `1,450 XP`), dan peningkatan skor kesiapan Tokyo IT.
- [x] Tampilkan kartu istilah kosakata Jepang baru yang di-unlock (`submitResult.unlocked_vocab`).
- [x] Arahkan tombol aksi "Lanjutkan" ke quest berikutnya (`submitResult.next_quest.id`) atau kembali ke dashboard kurikulum.

---

## ⚡ FASE 16: Dinamisasi Pusat Misi & Quest Log (Opsi C) (`QuestLogPage.tsx` ➔ `useQuests`) (SELESAI ✅)

### [x] 16.1 Integrasi Hook `useQuests` & Eliminasi Mock State
- [x] Hubungkan `QuestLogPage.tsx` ke hook `useQuests()` (`GET /api/v1/quests` & `GET /api/v1/quests/daily`).
- [x] Hapus data hardcoded D1, D2, D3, mock gems (45 💎), dan perbaiki bug perkalian `user.xp * 100` serta fallback streak (`userStreak || 14`).
- [x] Bersihkan penamaan stasiun lama ("Akihabara Quest Board") menjadi format standar Pusat Misi CodeAbroad.

### [x] 16.2 Filter Tab & Hitung Mundur Reset Harian Dinamis
- [x] Buat tab filter ("Semua", "Misi Harian", "Misi Utama", "Portofolio") memfilter quest secara dinamis berdasarkan data backend.
- [x] Tampilkan timer countdown riil menuju reset tengah malam JST/WIB (`timeLeft` dari `useQuests`).

### [x] 16.3 Klaim Hadiah Quest Langsung ke Backend
- [x] Hubungkan tombol "KLAIM HADIAH" ke `questService.submitQuest(id)` dan sinkronkan mutasi ke profil user (XP, gems, level).
- [x] Hubungkan tombol "Mulai / Lanjutkan" ke navigasi workspace belajar `/learn/:questId`.

---

## ⚡ FASE 20: Perbaikan Interaksi Misi Harian & Persistensi Hadiah Peti Emas (Dashboard Sidebar) (SELESAI ✅)

### [x] 20.1 Perbaiki Logika Tombol Misi Harian di `DashboardPage.tsx`
- [x] Pisahkan status misi: jika belum tuntas (`available`), tampilkan tombol biru `MULAI ▶` yang mengarahkan ke workspace `/learn/:id` atau scroll halus ke kartu materi Nihongo.
- [x] Hanya tampilkan tombol amber `KLAIM ⚡` jika misi berstatus selesai/tervalidasi (`ready_to_claim`) setelah interaksi riil (Next, Copy, Speak vocab).
- [x] Tampilkan badge hijau `✓ SELESAI` saat reward misi sudah diklaim secara sah (+30 XP) dan tersimpan ke user state.

### [x] 20.2 Sinkronisasi Progres Peti Emas Harian (Target 50 XP) & Klaim Hadiah
- [x] Hitung `todayEarnedXp` secara dinamis dari quest harian API dan interaksi vocab lokal berbobot (+15 XP review, +30 XP klaim).
- [x] Kunci persistensi status klaim peti harian per tanggal (`codeabroad_daily_chest_claimed_YYYY-MM-DD`).
- [x] Tombol "KLAIM HADIAH & LANJUTKAN" pada modal Peti Emas memberikan reward +50 XP nyata yang tersimpan ke profil pengguna dan menandai peti sebagai sudah diklaim hari ini.

---

## ⚡ FASE 17: Modernisasi Silabus Kurikulum (`RoadmapPage.tsx` ➔ `useRoadmap` & Clean 3D) (SELESAI ✅)

### [x] 17.1 Migrasi ke Data Kurikulum Dinamis Backend
- [x] Hubungkan `RoadmapPage.tsx` ke hook `useRoadmap(activeTrack)` (`GET /api/v1/roadmaps/:track_slug` atau `GET /api/v1/roadmaps/active`).
- [x] Hapus ribuan baris HTML kartu stasiun distrik statis (Akihabara, Shinjuku, Shibuya) dan ganti dengan rendering dinamis Stations ➔ Chapters ➔ Quests.
- [x] Perbaiki bug perkalian XP (`user.xp * 100`), fallback streak 14, dan persentase progress statis `62% Selesai` dengan agregasi riil dari backend.
- [x] Dukung alias slug koding (`golang` ➔ `backend`, `react` ➔ `frontend`, `devops_aws` ➔ `devops`) di repository SQL backend.

### [x] 17.2 Refaktor Tampilan ke Duolingo 3D Design Tokens
- [x] Ganti icon `lucide-react` dengan `@phosphor-icons/react` yang konsisten (`MagnifyingGlass`, `CalendarBlank`, `LockSimple`, `CaretDown`, `CaretUp`, `Star`, `Fire`, `Sparkle`, `ArrowClockwise`, `Medal`, `Trophy`, `Lightning`).
- [x] Hapus avatar panda mock `🐼` dan sinkronkan level dengan `user.current_level` dari profil auth.
- [x] Hubungkan tombol "LANJUTKAN KODING" ke quest aktif pertama yang belum selesai (`/learn/:questId`).
- [x] Sediakan fallback kurikulum komprehensif saat offline untuk graceful degradation.

---

## ⚡ FASE 21: Pembersihan Halaman Selebrasi Quest Lama (`QuestCompletePage.tsx`) (SELESAI ✅)

### [x] 21.1 Sinkronisasi Halaman Kelulusan Terpisah
- [x] Sinkronkan data quest title, chip label, XP reward, dan streak pengguna secara dinamis dari `location.state` atau query parameter.
- [x] Hapus teks hardcoded legacy "Station 3 • Bab 2", "1,450 XP", dan "2/2 Tes Lolos".
- [x] Tampilkan ilustrasi Kodi Celebrate yang ceria dan animasi pantul selebrasi 3D.
- [x] Sambungkan tombol "Lanjutkan ke Modul Berikutnya" ke rute quest berikutnya (`submitResult.next_quest.id`) atau dashboard kurikulum.

---

## ⚡ FASE 18: Agregasi Progres Track & Modal Pengaturan Akun (SELESAI ✅)

### [x] 18.1 Hitung Progres Karier Dinamis di `CourseSwitcherModal.tsx`
- [x] Ganti persentase statis (`40%` di Go, `0%` di React/DevOps) dengan perhitungan dinamis modul selesai vs total modul per track (`trackProgressMap`).
- [x] Tampilkan total part materi riil dan persentase dinamis per track karir.

### [x] 18.2 Modal Pengaturan Akun & Profil (`NavRail.tsx` ➔ `AccountSettingsModal.tsx`)
- [x] Buka modal pengaturan 3D saat tombol gear (`GearSix`) dan avatar pengguna di kiri bawah diklik.
- [x] Fitur pengaturan: Update nama lengkap, bio developer, target spesialisasi koding, dan live selector gaya avatar Kodi (Adventurer, Cyber Bottts, Lorelei).
- [x] Dukungan backend Go: Perluas `UpdateProfileRequest` di domain, repository, dan `PATCH /api/v1/users/me` untuk mendukung pembaruan `name`.

### [x] 18.3 Perbaikan Rute Belajar di Peta Kurikulum (`CurriculumPathMap.tsx`)
- [x] Ubah rute fallback semua part dari `/courses` menjadi rute koding langsung `/learn/:id`.
- [x] Tombol CTA floating popover dan tombol modal 3D mengarahkan user langsung ke workspace koding materi yang dipilih.

---

## 📜 Riwayat Fase yang Sudah Selesai (100% Completed)

### [x] FASE 1: Fondasi Token Light Mode, Tipografi & Phosphor Icons (SELESAI)
- [x] **1.1 Pembersihan `tokens/index.ts`:** Mengunci surface ke `#FAFAF9` & `#FFFFFF`, membuang residu bandara/hanko.
- [x] **1.2 Setup Font di `index.html`:** Memuat Google Fonts `Nunito`, `Fredoka`, `Plus Jakarta Sans`, dan `JetBrains Mono`.
- [x] **1.3 Registrasi Tailwind v4 `@theme` di `index.css`:** Mendaftarkan `--font-brand`, `--font-sans`, `--font-mono`, dan fisika 3D (`--shadow-tactile-code: 0 4px 0 0 #1D4ED8;`).
- [x] **1.4 Instalasi Phosphor Icons:** `@phosphor-icons/react` terpasang di `frontend/` (exit 0).
- [x] **1.5 Verifikasi Build Awal:** `npm run build` sukses.

### [x] FASE 2: Komponen Karakter Dasar & Stepping-Stone Awal (SELESAI)
- [x] **2.1 Update Tombol 3D (`Button3D.tsx`):** Memakai `font-brand font-black` dan loader Phosphor `CircleNotch`.
- [x] **2.2 Buat Komponen Hero Maskot (`KodiStationHero.tsx`):** Waving Kodi di kartu putih, balon sapaan Bahasa Indonesia, tombol teks murni `LANJUTKAN KODING`.
- [x] **2.3 Buat Komponen Jalur Belajar Awal (`YamanotePathMap.tsx`):** Versi awal jalur 3D (selesai, aktif, terkunci).

### [x] FASE 3: Widget Nilai Nyata (SELESAI)
- [x] **3.1 Buat Widget Kosakata Kantor Tokyo (`TechNihongoCard.tsx`):** Kartu kosakata standup (*Jissou* = Implementasi Fitur) dengan tombol salin.
- [x] **3.2 Buat Widget Tolok Ukur Kompetensi Tokyo (`TokyoCompetencyCard.tsx`):** Tracker 4 pilar teknis Go, Gin, Concurrency, dan Nihongo.

### [x] FASE 4: Navigasi & Integrasi Halaman (SELESAI)
- [x] **4.1 Refaktor `NavRail.tsx`:** NavRail Clean Light Mode dengan Phosphor Icons & bottom bar mobile.
- [x] **4.2 Perakitan Layout Bersih `DashboardPage.tsx`:** Top HUD, KodiStationHero, YamanotePathMap, Quests, Streak, dan Sidebar Kompetensi.

### [x] FASE 5: Validasi & Quality Assurance (SELESAI)
- [x] **5.1 Build & Typecheck:** `npm run build` sukses (exit code 0 dalam 999ms).
- [x] **5.2 Backend Sanity Check:** `go test -count=1 ./...` semua endpoint lulus (exit code 0).

### [x] FASE 6: Perombakan Jalur Belajar Berliku (Organic S-Curve Path & World Map) (SELESAI)
- [x] **6.1 Buang Tiang Lurus & Ganti dengan SVG Curved Bezier Path:** Menggunakan `<path d="M... C... S..." />` rel metro ganda mulus.
- [x] **6.2 Pola Koordinat Meliuk Organik:** Menghitung kurva S meliuk lembut.
- [x] **6.3 Pijakan Kaki Kodi (Grounded Living Companion):** Kodi berdiri di samping node aktif dengan panggung bayangan elips dan balon bicara.
- [x] **6.4 Cincin Progres Melingkar (Duolingo SVG Ring):** Cincin progress melingkar di sekeliling node aktif yang terisi 60%.
- [x] **6.5 Panggung Hadiah Podium 3D:** Peti hadiah stasiun akhir duduk di atas podium bertingkat 3D.
- [x] **6.6 Ornamen Lingkungan Halus:** Mini sakura Taman Ueno dan mini rambu metro `JY`.
- [x] **6.7 Verifikasi Build:** `npm run build` lulus (exit code 0).

### [x] FASE 7: Integrasi Maskot Hidup Kodi (SELESAI)
- [x] **7.1 Integrasi Komponen:**
  - Diperluas ke `KodiMascot.tsx` mendukung 8 emosi: `welcome`, `coding`, `celebrate`, `thinking`, `warning`, `onFire`, `coffee`, `proud`.
  - Terhubung ke `TokyoCompetencyCard.tsx`, `YamanotePathMap.tsx`, dan `DashboardPage.tsx`.

### [x] FASE 8: Penyelarasan Penuh Inkonsistensi Doodle Kodi (SELESAI)
- [x] **8.1 Eliminasi Inkonsistensi Karakter & Style:** Menghapus panda, menyelaraskan seluruh 8 pose ke Cyber Blue Bear dengan headphone cyan, antena, dan medali `{}`.
- [x] **8.2 Konversi Cutout Transparan Murni (RGBA):** Menghapus border stiker putih dan latar belakang solid menjadi transparan murni RGBA (`corner alpha: 0`).
- [x] **8.3 Penimpaan Aset Proyek & Verifikasi Build:** 5 aset baru berhasil disalin ke `frontend/src/assets/kodi/`, `npm run build` sukses dalam 874ms.

---

## 🏛️ Riwayat Backend Quest & Roadmap Engine (Feature 3 v0.3.0)

### [x] Phase A: Database Migrations & Seeds
- [x] **A1:** Created migration `000004_create_quest_and_roadmap_engine.up.sql` (`roadmaps`, `stations`, `chapters`, extended `quests`, extended `user_quests`, performance indexes).
- [x] **A2:** Created migration `000004_create_quest_and_roadmap_engine.down.sql`.
- [x] **A3:** Seeded multi-track curriculum: Go Backend (`golang`), Docker/DevOps (`devops_aws`), dan React (`react`) with 5 Stations each + Quests.
- [x] **A4:** Seeded daily quests pool (10 rotating micro-challenges).

### [x] Phase B: Backend Clean Architecture (Golang)
- [x] **B1: Domain Layer (`internal/domain/`):**
  - `roadmap.go`: `Roadmap`, `Station`, `Chapter` entities and `RoadmapRepository` / `RoadmapUsecase` interfaces.
  - `quest.go`: `Quest`, `UserQuest`, `NihongoNote`, `AcceptanceCriterion`, `StarterCode`, `TestSuite`, DTOs and `QuestRepository` / `UserQuestRepository` / `QuestUsecase` interfaces.
- [x] **B2: Repository Layer (`internal/repository/database/`):**
  - `roadmap_repository.go`: `GetByCareerPathID`, `GetByCareerPathSlug`, `GetFullSyllabus` with nested station/chapter/quest aggregation.
  - `quest_repository.go`: `GetByID`, `GetByChapterID`, `GetDailyQuests`, `ListQuests`, `GetNextSequentialQuest`.
  - `user_quest_repository.go`: `GetByUserAndQuest`, `UpsertUserQuest`, `MarkCompleted`, `CountCompletedByCareerPath`.
- [x] **B3: Usecase Layer (`internal/usecase/`):**
  - `roadmap_usecase.go`: `GetTrackRoadmap`, `GetActiveUserRoadmap`.
  - `quest_usecase.go`: `GetQuestDetails`, `GetDailyQuests`, `ListQuests`, `RunUnitTests`, `SubmitQuest` (+XP, +Gems, +Streak, +Readiness Score).
- [x] **B4: Delivery Layer (`internal/delivery/http/`):**
  - `roadmap_handler.go`: `/api/v1/roadmaps/active`, `/api/v1/roadmaps/:track_slug`.
  - `quest_handler.go`: `/api/v1/quests`, `/api/v1/quests/daily`, `/api/v1/quests/:id`, `/api/v1/quests/:id/run-tests`, `/api/v1/quests/:id/submit`.
  - Wired into `router.go` and `main.go`.
- [x] **B5: Automated Unit Tests:**
  - `roadmap_usecase_test.go`, `quest_usecase_test.go`, `roadmap_handler_test.go`, `quest_handler_test.go` — Semua lulus 100% (`go test -v ./...` PASS).

---

## 🎨 Riwayat Design System Kit & Auth Architecture

### [x] Phase 1: Inversi Token & CSS ke Clean Light Mode
- [x] Surface token: `ground: #FAFAF9`, `canvas: #FFFFFF`, `card: #FFFFFF`, `border: #E2E8F0`.
- [x] Text token: `primary: #0F172A`, `secondary: #475569`, `accent: #2563EB`.
- [x] Mobile touch physics: `-webkit-tap-highlight-color: transparent` pada selektor tombol 3D.
- [x] Utility form: `.input-duo` clean white with tactile focus ring.

### [x] Phase 2: Komponen Primitif UI
- [x] Logo: `variant="blue"` Electric Blue wordmark.
- [x] Input & AuthField: Focus ring `blue-600` / `blue-500/20`.
- [x] Card3D & Button3D: Clean light mode tactile physics (3D bevel drop shadow).
- [x] BadgePill: `blue`, `xp`, `streak`, `verified`, `neutral` kontras tinggi.
- [x] SpeechBubble: Light mode manga balloon dengan bevel halus.
- [x] Primitif baru: `<RoadmapNode3D>`, `<Modal3D>`, `<Skeleton3D>`.

### [x] Phase 3: Auth & Dashboard Headless Controller-Hook
- [x] `authService.ts`: login, register, getProfile, logout.
- [x] `validation.ts`: email, username, password validation utilities.
- [x] `useLogin.ts`: Form state, TanStack Query mutation, auto-redirect.
- [x] `useRegister.ts`: Form state, TanStack Query mutation, auto-login.
- [x] `useDashboard.ts`: Server state, live clock Tokyo/Jakarta, avatar & mascot selectors.
