# 🛡️ Service Breakdown: Auth & User Service

**Service Domain:** Identity, Authentication, and User Profile  
**Status:** In Progress (Refactoring to 3-Pillar Normalized Architecture)  
**Last Updated:** 2026-10-26  
**Document Location:** `.agents/services/auth-and-user-service.md`  

---

## 📌 1. Service Overview & Bounded Context

Service ini mengelola siklus hidup identitas pengguna, autentikasi berbasis sesi JWT, profil pengembang publik, dan preferensi target karir luar negeri.

Sesuai cetak biru arsitektur **[ERD v2.1](file:///c:/Projects/codeabroad/.agents/docs/erd.md)**, service ini bertanggung jawab atas **Pillar 1** dan **Pillar 2**:
* **Pillar 1 (`users`):** Kredensial murni akun (`id`, `email`, `password_hash`, `created_at`, `updated_at`). Zero data leak.
* **Pillar 2 (`user_profiles`):** Profil publik dan preferensi onboarding (`name`, `username`, `bio`, `career_path_id`, `country_id`, `primary_stack`, `level`, `is_onboarded`).
* *(Catatan: Seluruh data gamifikasi seperti `xp`, `streak`, `gems`, dan `current_level` dialihkan ke **Pillar 3 (`user_gamification`)** dan dikelola oleh `GamificationService`).*

---

## 🚦 2. Status Implementasi Saat Ini (What Has Been Done)

### 2.1 Backend (Go / Gin / PostgreSQL / Redis)
* [x] **Autentikasi Inti:**
  * Endpoint `POST /api/v1/auth/register` (hashing Bcrypt, validasi unik email/username).
  * Endpoint `POST /api/v1/auth/login` (verifikasi password, generate Access Token + Refresh Token).
  * Endpoint `POST /api/v1/auth/refresh` (rotasi token sesi).
  * Endpoint `POST /api/v1/auth/logout` (revokasi token sesi via Redis blacklist).
* [x] **Manajemen Profil:**
  * Endpoint `GET /api/v1/users/me` (mengambil data profil user terautentikasi).
  * Endpoint `PATCH /api/v1/users/me` (memperbarui nama, bio, primary stack, career path).
* [x] **Log Aktivitas Belajar:**
  * Endpoint `GET /api/v1/users/me/activity-logs` (rekap histori 7 hari dan status streak harian).
* [!] **Klaim Hadiah Harian (Legacy):**
  * Endpoint `GET /api/v1/users/me/daily-rewards` dan `POST /api/v1/users/me/daily-rewards/claim` (masih menempel di `auth_handler.go` & `user_repository.go`).

### 2.2 Frontend (React / Vite / Zustand / Axios)
* [x] **Halaman Autentikasi:**
  * `LoginPage.tsx` (Login via email/password, toggle "Ingat Saya", validasi form).
  * `RegisterPage.tsx` (Registrasi akun baru, password strength check).
* [x] **Client Service & State:**
  * `authService.ts` (Axios client methods: `login`, `register`, `getProfile`, `updateProfile`, `getActivityLogs`, `logout`).
  * `useAuthStore.ts` (Zustand store untuk menyimpan token, user profile, dan status login).
  * `api.ts` (Axios interceptor untuk auto-inject JWT token dan auto-refresh saat token kedaluwarsa).
* [x] **Modal & Pengaturan:**
  * `ProfileSettingsModal.tsx` (Dialog edit nama, bio, dan stack).
  * `GameSidebarRail.tsx` & `GameTopBar.tsx` (Render avatar DiceBear SVG dinamis, streak badge, dan tombol logout).

---

## ⚠️ 3. Technical Debt Analysis

### 3.1 Data Modeling & Domain Monolith (Kritikal)
1. **Entitas `domain.User` Menggabungkan 3 Pilar Sekaligus:**
   * Di [backend/internal/domain/user.go](file:///c:/Projects/codeabroad/backend/internal/domain/user.go), struct `User` memiliki 23 field yang mencampur aduk kredensial, profil, dan statistik game (`XP`, `CurrentLevel`, `Streak`, `Gems`).
   * Setiap kali user menyelesaikan quest koding, method `UpdateGamification` mengunci dan memperbarui baris tabel `users`.
2. **Dead Fields (Sisa Arsitektur Lama):**
   * Field `github_url`, `linkedin_url`, dan `avatar_url` masih ada di struct dan database, padahal avatar sudah digenerate dinamis via DiceBear SVG dan link sosial tidak pernah dirender di UI.
   * Field `target_timeline` dan `language_level` diisi saat onboarding, namun tidak pernah dipakai di filter materi, rekomendasi quest, maupun kurikulum.
3. **Split-Brain Klaim Hadiah Harian (Golden Chest):**
   * Di `user_repository.go` terdapat method `ClaimDailyReward` yang memodifikasi XP user dan mencatat ke `user_activity_logs`.
   * Di saat yang sama, `gamification_repository.go` memiliki `ClaimDailyChest` yang mencatat ke `user_daily_chest_claims`. Ini menimbulkan duplikasi logika dan membingungkan arsitektur.

### 3.2 Pelanggaran Clean Architecture di Repository
1. **`UserRepository` Terlalu Gemuk (God Interface):**
   * Interface `UserRepository` di `domain/user.go` memiliki 12 method, termasuk urusan gamifikasi: `UpdateGamification`, `AddGems`, `ClaimDailyReward`, `GetDailyRewardsStatus`.
   * Urusan reward/gamifikasi seharusnya menjadi domain eksklusif `GamificationRepository`.

---

## 🔒 4. Security & Performance Issues

| Kategori | Isu yang Ditemukan | Risiko / Dampak | Solusi yang Diperlukan |
| :--- | :--- | :--- | :--- |
| **Security** | Field `password_hash` berpotensi bocor saat serialize internal jika DTO tidak dipisah | Data leakage kredensial sensitif | Pisahkan struct `UserAuth` (internal auth) dari `UserProfileResponse` (DTO publik). |
| **Security** | Email belum dinormalisasi ke `strings.ToLower()` sebelum query | Akun duplikat dengan variasi huruf kapital (misal `User@Mail.com` vs `user@mail.com`) | Tambahkan normalisasi `strings.ToLower(strings.TrimSpace(email))` di `auth_usecase.go`. |
| **Performance** | Row-Lock Contention pada tabel `users` | Setiap user mengerjakan quest koding atau klaim hadiah, baris `users` di-lock (`UPDATE users SET xp = ...`), memperlambat proses login dan verifikasi sesi token. | Pisahkan XP, Level, Streak, Gems ke tabel terpisah `user_gamification` (Pillar 3). |
| **Performance** | Query `GetProfileWithDetails` melakukan banyak `LEFT JOIN` yang memuat field mati | Overhead memory database dan transfer payload JSON yang tidak perlu | Rampingkan query SELECT hanya pada kolom aktif `user_profiles`. |
| **Cleanliness** | Frontend TypeScript type `User` di `types/auth.ts` masih memuat field usang | Menghasilkan TypeScript bloat dan tipe data opsional yang membingungkan | Rampingkan `User` interface di frontend agar 100% cocok dengan DTO backend. |

---

## 🗺️ 5. Step-by-Step Refactoring Roadmap (Rencana Tindakan)

Berikut urutan pengerjaan logis untuk memperbaiki **Auth & User Service** dari dasar (fondasi) hingga ke atas:

### Langkah 1: Rampingkan Domain Model & Interface (`domain/user.go`) 👈 **(Mulai Dari Sini)**
* Pisahkan entitas `User` murni kredensial (Pillar 1).
* Buat entitas `UserProfile` untuk profil & target karir (Pillar 2).
* Buat DTO terpisah untuk respons `ProfileResponse` (tanpa data game dan tanpa password).
* Bersihkan method gamifikasi (`UpdateGamification`, `AddGems`, `ClaimDailyReward`) dari `UserRepository` interface.

### Langkah 2: Rampingkan Usecase (`usecase/auth_usecase.go`)
* Pindahkan logika klaim reward harian murni ke `gamification_usecase.go`.
* Tambahkan sanitasi email (`strings.ToLower`).
* Pastikan `Register` membuat transaksi atomik untuk `users` dan inisialisasi awal profil.

### Langkah 3: Rampingkan Database Repository (`repository/database/user_repository.go`)
* Sesuaikan query `GetByID`, `GetByEmail`, `Create` agar hanya beroperasi pada kolom Pillar 1 (`users`).
* Buat method khusus untuk `user_profiles`.
* Hapus query-query gamifikasi yang sudah usang dari file ini.

### Langkah 4: Rampingkan Delivery HTTP Handler (`delivery/http/handler/auth_handler.go`)
* Hapus route `/users/me/daily-rewards` dari `auth_handler.go` (gunakan route gamifikasi).
* Pastikan serializer response mengembalikan DTO bersih.

### Langkah 5: Sinkronisasi Frontend Client & Types (`frontend/src/`)
* Rampingkan `types/auth.ts` (hapus `github_url`, `linkedin_url`, `avatar_url`, `target_timeline`, `language_level`).
* Bersihkan `authService.ts` dari method `claimDailyReward` (alihdayakan ke `gamificationService.ts`).
