# CodeAbroad Design System Specification (v3.0 - Clean Light Mode)

> **Visual Philosophy:** 90% Duolingo Tactile 3D Taste (Clean Light Mode) + 10% CodeAbroad Electric Blue Identity  
> **Color Mode:** Clean Light Mode (`#FAFAF9` canvas, `#FFFFFF` crisp cards, Slate text `#0F172A`)  
> **Brand Companion:** Kodi (The Friendly, Tech-Savvy Developer Companion)  
> **Narrative Metaphor:** Global Developer Boarding Pass (`CGK ✈️ NRT/HND/BER/SIN`)  
> **Status:** Single Source of Truth (SSOT)  
> **Token Reference:** `frontend/src/tokens/index.ts` (`TOKENS`) & `frontend/src/index.css`  

---

## 🎨 1. Core Visual Principles & Anti-AI Slop Manifesto

### 1.1 The Duolingo Tactile 3D Taste (Clean Light Mode)
- **Radiant Light Canvas:** Latar belakang canvas putih-hangat (`#FAFAF9`), kartu putih bersih (`#FFFFFF`), dengan garis batas halus berkualitas tinggi (`#E2E8F0` / `#CBD5E1`).
- **Deep Slate Typography:** Teks menggunakan kontras tinggi dengan warna slate gelap (`#0F172A` untuk heading, `#475569` untuk body) agar sangat mudah dan nyaman dibaca.
- **Physical 3D Tactile Physics:** Tombol dan kartu interaktif memiliki kedalaman bayangan fisik tebal 4px–6px di bagian bawah yang amblas saat diklik/tap (`active:translate-y-1 active:shadow-none`).
- **Comfortable Friendly Geometry:** Sudut membulat yang ramah dan organik (`rounded-2xl` dan `rounded-3xl`).
- **Focused Gamified Stages:** Setiap layar, step, dan kartu memiliki **satu objektif utama yang jelas**.
- **Tactile Haptic Feedback:** Interaksi sentuh pada perangkat mobile memicu getaran taktil fisik (`triggerHaptic`).

### 1.2 The 10% CodeAbroad Soul
- **Electric Tech Blue / Cobalt Palette:** Menggantikan hijau neon Duolingo dengan **Electric Blue** (`#2563EB`, `#3B82F6`) dan **Neon Cyan** (`#38BDF8`), menciptakan kesan modern khas teknologi penerbangan dan hub engineering global.
- **Kodi Mascot Integration:** Maskot Kodi menemani pengguna di setiap pencapaian, panduan, dan selebrasi level.
- **Global Flight Metaphor:** Alur belajar disimulasikan sebagai tahapan boarding penerbangan internasional (`CGK ➔ NRT/HND/BER/SIN`), visa kerja, dan tiket keberangkatan.

### 1.3 Anti-AI Slop Manifesto
Untuk menjaga kualitas visual premium dan menghindari tampilan template generik:
- ❌ **NO Generic SaaS Bullet Cards:** Dilarang membuat kartu dengan bullet points teks generik tak bermakna atau centang checklist palsu.
- ❌ **NO Arbitrary Gray Icon Boxes:** Dilarang meletakkan kotak icon abu-abu acak sebagai hiasan kosong.
- ❌ **NO Cluttered Multi-Column Widgets:** Dilarang menumpuk banyak widget dashboard yang membingungkan fokus pengguna.
- ❌ **NO Lazy Responsive Stacking:** Jangan sekadar menumpuk 2 kolom desktop menjadi kolom vertikal panjang di mobile. Terapkan task-first UX dengan target sentuh min 44px.
- ❌ **NO Matcha Green Logos:** Logo `codeabroad` wajib selalu menggunakan **Slate Obsidian (`variant="slate"`)** atau **Electric Blue (`variant="blue"`)**, tidak pernah hijau.
- ❌ **NO Neo-Brutalist Harsh Black Shadows:** Gunakan colored 3D bevel shadows (`shadow-[0_4px_0_0_#CBD5E1]` atau `#1D4ED8`), bukan kotak hitam pekat `4px 4px 0 0 #0F172A`.

---

## 🌈 2. Color System & Design Tokens

Source of Truth: `frontend/src/tokens/index.ts` (`TOKENS.colors`)

### 2.1 Surfaces & Canvas (Clean Light Mode)
| Token Key | Tailwind Class | Hex / Value | Peruntukan |
|---|---|---|---|
| `surface.ground` | `bg-[#FAFAF9]` | `#FAFAF9` | Canvas latar belakang utama halaman |
| `surface.canvas` | `bg-white` | `#FFFFFF` | Latar kontainer utama |
| `surface.card` | `bg-white` | `#FFFFFF` | Kartu utama, tiket boarding, modal window |
| `surface.elevated` | `bg-slate-100` | `#F1F5F9` / `#F8FAFC` | Kotak opsi pilihan, slot input, header frame |
| `surface.border` | `border-slate-200` | `#E2E8F0` | Garis tepi kartu dan divider standar |
| `surface.borderHover` | `border-slate-300` | `#CBD5E1` | Garis tepi saat hover |
| `surface.borderFocus` | `border-blue-600` | `#2563EB` | Ring fokus keyboard / form input |

### 2.2 Brand Primary: Electric Tech Blue
| Tone | Hex | Role |
|---|---|---|
| `brand[50]` | `#EFF6FF` | Subtle light mode badge and highlight backgrounds |
| `brand[100]` | `#DBEAFE` | Soft blue card background fill |
| `brand[500]` | `#3B82F6` | Vibrant electric blue accent |
| `brand[600]` | `#2563EB` | **Core Brand Blue** (Primary button surface, focus rings) |
| `brand[700]` | `#1D4ED8` | **3D Tactile Shadow Bevel Depth** (Bottom physical border) |
| `brand[800]` | `#1E40AF` | Pressed active state background |

### 2.3 Gamification Palette
| Role | Tone / Hex | Bevel Depth Shadow | Peruntukan |
|---|---|---|---|
| **XP Gold** | `#F59E0B` (Amber-500) | `#B45309` (Amber-700) | Poin pengalaman (XP), bintang reward |
| **Streak Fire** | `#FB923C` (Orange-400) | `#C2410C` (Orange-700) | Api konsistensi harian |
| **Verified / Pass** | `#10B981` (Emerald-500) | `#047857` (Emerald-700) | Lulus tes koding, visa eligibility |
| **Tokyo Route Cyan** | `#38BDF8` (Sky-400) | `#0284C7` (Sky-600) | Rute penerbangan, badge aksen |

---

## 🧱 3. Daftar Komponen Primitif UI (`components/ui/`)

| Komponen | Kegunaan | Props Kunci |
|---|---|---|
| **`<Button3D>`** | Tombol fisik membal dengan bevel bayangan 3D | `variant` (`blue`, `cyan`, `white`, `emerald`, `amber`, `rose`, `ghost`), `size` (`sm`, `md`, `lg`), `loading` |
| **`<Card3D>`** | Kartu putih bersih dengan sudut `rounded-3xl` dan bevel tactile | `variant` (`white`, `slate`, `blue`), `glow` |
| **`<RoadmapNode3D>`** | Node pohon kurikulum ala Duolingo | `status` (`completed`, `active`, `locked`), `number`, `title`, `xp`, `popoverText` |
| **`<Modal3D>`** | Dialog popover Clean Light Mode dengan aksi taktil | `isOpen`, `onClose`, `title`, `subtitle`, `footer`, `maxWidth` |
| **`<Skeleton3D>`** | Loading placeholder rounded dengan animasi pulse | `variant` (`card`, `text`, `circle`, `button`, `metric`) |
| **`<Input>`** | Form field berlatar putih dengan ring Electric Blue | `label`, `icon`, `isPassword`, `error` |
| **`<BadgePill>`** | Kapsul status kontras tinggi Clean Light Mode | `variant` (`blue`, `xp`, `streak`, `verified`, `neutral`, `error`), `size` |
| **`<MetricTile>`** | Kotak stat 2x2 scannable untuk dashboard | `label`, `value`, `subtitle`, `variant`, `surface: 'light'` |
| **`<ProgressBar3D>`** | Bar progres rounded dengan track groove dan gloss shine | `value`, `max`, `size`, `variant`, `showLabel` |
| **`<KodiMascot>`** | Maskot Kodi dengan emosi, aura, dan balon dialog | `emotion` (`welcome`, `celebrate`, `coding`, `proud`), `speechText` |
| **`<SpeechBubble>`** | Balon dialog komik Duolingo dengan ekor terarah | `direction`, `variant: 'light'` |
| **`<Logo>`** | Logo resmi CodeAbroad | `variant: 'blue' \| 'slate' \| 'white'`, `size` |
| **`<UserAvatar>`** | Avatar profil pengguna dengan DiceBear fallback | `user`, `size`, `style`, `showBadge` |

---

## 💻 4. Contoh Penggunaan Komponen Primitif

```tsx
import { 
  Button3D, 
  Card3D, 
  RoadmapNode3D, 
  Modal3D, 
  Skeleton3D,
  ProgressBar3D 
} from '@/components/ui'

// 1. Tombol 3D Primary
<Button3D variant="blue" size="md">
  Mulai Belajar Sekarang
</Button3D>

// 2. Node Roadmap Duolingo
<RoadmapNode3D
  status="active"
  number={1}
  title="Clean Architecture & Gin"
  xp={80}
  popoverText="Mulai Quest"
  onClick={() => handleStartLesson(1)}
/>

// 3. Kartu Kontainer 3D
<Card3D variant="white">
  <h3 className="text-lg font-black text-slate-900">Kurikulum Tokyo</h3>
  <ProgressBar3D value={60} max={100} variant="blue" showLabel />
</Card3D>
```
