# CodeAbroad Design System Specification (v4.0 - Midnight Departure)

> **Visual Philosophy:** Atmospheric Japanese Night Journey + Mature Developer Gamification  
> **Color Direction:** Deep Midnight Navy (`#080D18`), Layered Night Surfaces (`#101827`, `#172236`), Subtle Blue-Gray Borders (`#27364D`), Cool White Typography (`#F1F5F9`)  
> **Brand Identity:** Electric Tech Blue (`#3B82F6`), Aviation Cyan (`#38BDF8`), Warm Amber Rewards (`#F5B942`), Restrained Emerald (`#10B981`)  
> **Narrative Metaphor:** Midnight Shinkansen & International Career Departure (`CGK ✈️ HND / Tokyo Tech Express`)  
> **Status:** Single Source of Truth (SSOT)  
> **Token Reference:** `frontend/src/tokens/index.ts` (`TOKENS`) & `frontend/src/index.css`  

---

## 🌌 1. Core Visual Principles & Atmospheric Guidelines

### 1.1 The Midnight Departure Aesthetic
- **Deep Midnight Canvas:** Base background menggunakan deep midnight navy pekat (`#080D18`), menciptakan suasana fokus kerja malam pengembang dan perjalanan kereta malam Jepang.
- **Hierarchical Dark Surfaces:** 
  - Primary Surface (`#101827`): Kartu utama, sidebar navigasi, dialog.
  - Elevated Surface (`#172236`): Slot interaktif, item list, card header, input slots.
  - Subtle Borders (`#27364D`): Garis pembatas tipis berpresisi tinggi yang menggantikan border tebal kartunis.
- **Cool White High-Contrast Typography:**
  - Teks utama (`#F1F5F9`): Kontras optimal untuk keterbacaan kode dan materi belajar.
  - Teks sekunder & deskripsi (`#94A3B8`): Muted slate yang tenang dan tidak melelahkan mata.
- **Action-Focused Hierarchy:** Tombol aksi belajar selanjutnya (*Continue Learning*) selalu menjadi elemen paling dominan dan mencolok di halaman.
- **Tactile Mature Gamification:** Gamifikasi ditekankan melalui umpan balik progres yang bermakna, reward stat, dan transisi halus—bukan sekadar bayangan tebal pada semua komponen.

### 1.2 Anti-AI Slop & Restraint Policy
- ❌ **NO Arbitrary Glassmorphism & Neon Glare:** Tidak menggunakan efek blur berlebih atau border neon terang di sembarang elemen.
- ❌ **NO Thick Borders Everywhere:** Hilangkan border kartun 2px–3px warna terang; gunakan `#27364D` yang elegan dan minimalis.
- ❌ **NO Generic SaaS Card Grids:** Tata letak modular dengan fokus utama pada alur belajar (Hero Command Center & Railway Journey).
- ❌ **NO Fake Data or Static Progress:** Semua progres belajar dan XP diikat ke API backend dan status pengguna riil.

---

## 🎨 2. Palette & Design Tokens

Source of Truth: `frontend/src/tokens/index.ts` (`TOKENS.colors`)

### 2.1 Surfaces & Canvas (Midnight Palette)
| Token Key | Tailwind / Hex | Role |
|---|---|---|
| `surface.ground` | `#080D18` | Base midnight canvas |
| `surface.card` | `#101827` | Primary surface for cards, sidebar, containers |
| `surface.elevated` | `#172236` | Secondary elevated surface, interactive tiles, inputs |
| `surface.border` | `#27364D` | Subtle blue-gray borders & dividers |
| `surface.borderHover`| `#3B82F6` | Active / focused border accent |

### 2.2 Brand & Accents
| Tone | Hex | Role |
|---|---|---|
| `brand.primary` | `#3B82F6` | Electric Blue: Primary CTA & dominant focus state |
| `brand.cyan` | `#38BDF8` | Tokyo Flight Route & Active Rail Indicator |
| `gamified.xp` | `#F5B942` | Warm Amber: XP rewards, star badges, chest tiers |
| `gamified.verified`| `#10B981` | Restrained Emerald: Completed stations & tests passing |
| `gamified.streak` | `#FB923C` | Flame Orange: Streak consistency counter |

### 2.3 Typography Contrast
| Token Key | Hex | Role |
|---|---|---|
| `text.primary` | `#F1F5F9` | Cool white for headlines, active values, high contrast |
| `text.secondary`| `#94A3B8` | Muted slate for subtext, metadata, timestamps |
| `text.muted` | `#64748B` | Subtle footnotes and disabled indicators |

---

## 🚄 3. Signature Elements

1. **Learning Command Center:**
   - Menyambut pengguna dengan nama dan modul aktif saat ini.
   - Menampilkan progres pelajaran aktual dan estimasi waktu.
   - Menyediakan satu tombol CTA dominan (*"LANJUTKAN KODING ▶"*).
   - Menghadirkan maskot Kodi secara anggun dan tidak mendominasi.

2. **Japanese Railway Journey Map (Yamanote Night Express):**
   - Geometri lintasan kereta malam menghubungkan stasiun kurikulum:
     - Stasiun Selesai: Indikator emerald (`#10B981`) & stempel kelulusan *合格*.
     - Stasiun Aktif: Node glowing electric blue (`#3B82F6`) dengan penanda kereta mini Shinkansen.
     - Stasiun Terkunci: Permukaan muted slate (`#27364D`) yang elegan.

3. **Career Passport (Dark Obsidian Edition):**
   - Dokumen perjalanan karier bertema paspor diplomatik internasional.
   - Background `#101827` dengan rute `CGK ✈️ HND`, barcode strip, dan progress bar kesiapan kerja Jepang.

4. **Actionable Daily Quests:**
   - Terkoneksi ke `useQuests()` dan countdown reset tengah malam JST.
   - Navigasi langsung ke workspace koding yang bersesuaian.
