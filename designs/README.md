# 🎨 CodeAbroad — Design Workspace (`pen.dev`)

Folder ini berisi file-file desain kanvas berekstensi `.pen` untuk platform **CodeAbroad**, yang dikelola menggunakan **pen.dev CLI** / Desktop App.

Desain merujuk langsung pada spesifikasi di [docs/design-system.md](../docs/design-system.md) dan [docs/prd.md](../docs/prd.md).

---

## 📁 Struktur Folder Desain

```text
codeabroad/
├── designs/
│   ├── README.md               # Dokumentasi panduan & perintah pen.dev
│   ├── previews/               # Hasil export gambar (PNG/WEBP) untuk review cepat
│   ├── onboarding.pen          # Flow registrasi, pilih negara target (🇯🇵/🇩🇪/🇸🇬) & track
│   ├── dashboard.pen           # Dashboard utama (XP Bar, Streak, Readiness Score)
│   ├── quest-map.pen           # Visual Quest Tree, Main Quest, Side & Daily Quests
│   └── profile.pen             # Halaman profil developer & badges achievement
```

---

## 🎨 Design Tokens (Spesifikasi Cepat)

- **Mode**: Dark Mode
- **Main Background**: `#0F172A` (Slate 900)
- **Card Background**: `#1E293B` (Slate 800)
- **Border / Divider**: `#334155` (Slate 700)
- **Brand Primary**: `#3B82F6` (Blue 500)
- **Brand Accent**: `#6366F1` (Indigo 500)
- **XP / Level Gold**: `#EAB308` (Yellow 500)
- **Streak Fire**: `#F59E0B` (Amber 500)
- **Country Highlights**:
  - 🇯🇵 Japan: `#DC2626`
  - 🇩🇪 Germany: `#CA8A04`
  - 🇸🇬 Singapore: `#E11D48`

---

## 🚀 Perintah CLI Siap Pakai

Akun Anda sudah terotentikasi di CLI (`pen status` ● Active). Jalankan perintah di bawah dari root proyek `codeabroad`:

### 1. Generate Screen Dashboard Utama
```bash
pen --out designs/dashboard.pen --export designs/previews/dashboard.png --prompt "Create a modern dark-mode gamified developer learning dashboard for CodeAbroad. Background #0F172A, cards #1E293B, border #334155. Top Navbar with logo 'CodeAbroad', streak counter (fire icon #F59E0B), and XP status (Level 12, XP bar in #EAB308). Readiness Score widget for Japan (#DC2626), Germany (#CA8A04), Singapore (#E11D48). Active Quest Card with CTA button in brand blue #3B82F6. Daily quests checklist with XP tags."
```

### 2. Generate Screen Quest Map & Tree
```bash
pen --out designs/quest-map.pen --export designs/previews/quest-map.png --prompt "Create a gamified quest roadmap canvas for web developers. Dark theme #0F172A. Sequential node-based quest tree showing unlocked nodes in #3B82F6 and completed nodes with green checkmarks #22C55E. Sidebar showing quest details, estimated completion time, XP reward, and a 'Start Quest' button."
```

### 3. Generate Screen Onboarding Flow
```bash
pen --out designs/onboarding.pen --export designs/previews/onboarding.png --prompt "Create an onboarding step screen for CodeAbroad. Dark theme #0F172A. Three selectable country cards with flags: Japan, Germany, Singapore. Below that, 4 track selector buttons: Frontend, Backend, Fullstack, DevOps. Primary action button 'Continue' in #3B82F6."
```

### 4. Generate Screen Profile & Achievements
```bash
pen --out designs/profile.pen --export designs/previews/profile.png --prompt "Create a developer profile and achievements screen for CodeAbroad. Dark theme #0F172A. Includes user avatar, level badge (Level 12 Explorer), GitHub and LinkedIn links, career goal summary, readiness radar chart or progress bar, and unlocked milestone badges grid with gold accents #EAB308."
```

---

## 🛠️ Modifikasi & Ekspor Lanjutan

- **Mengubah file yang sudah ada**:
  ```bash
  pen --in designs/dashboard.pen --out designs/dashboard.pen --prompt "Add a leaderboard preview widget at the bottom right"
  ```
- **Export ulang ke format lain**:
  ```bash
  pen --in designs/dashboard.pen --export designs/previews/dashboard.webp --export-type webp --export-scale 2
  ```
- **Interactive Shell**:
  ```bash
  pen interactive -o designs/dashboard.pen
  ```
