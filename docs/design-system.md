# Design System
# CodeAbroad

**Version:** 1.0  
**Last Updated:** 2026-09-28  
**Stack:** React + Tailwind CSS

---

## Brand Identity

### Brand Personality
- **Ambitious** — For people who aim high (working abroad)
- **Playful** — Gamified, fun, not boring like typical learning platforms
- **Trustworthy** — Structured, reliable, professional
- **Energetic** — Motivating, action-oriented

### Brand Voice
- Encouraging, not preachy
- Direct and clear
- Celebratory on achievements
- Casual but professional (not too formal)

---

## Color Palette

### Primary Colors
| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| **Brand Blue** | `#3B82F6` | `blue-500` | Primary actions, CTAs, links |
| **Brand Indigo** | `#6366F1` | `indigo-500` | Accents, highlights |
| **Dark BG** | `#0F172A` | `slate-900` | Main background (dark mode) |
| **Card BG** | `#1E293B` | `slate-800` | Card backgrounds |
| **Surface** | `#334155` | `slate-700` | Borders, dividers |

### Semantic Colors
| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| **Success** | `#22C55E` | `green-500` | Quest completed, streak active |
| **Warning** | `#F59E0B` | `amber-500` | Streak at risk, warnings |
| **Danger** | `#EF4444` | `red-500` | Errors, destructive actions |
| **XP Gold** | `#EAB308` | `yellow-500` | XP points, achievements |

### Country Colors
| Country | Color | Hex |
|---------|-------|-----|
| 🇯🇵 Japan | Crimson Red | `#DC2626` |
| 🇩🇪 Germany | Dark Gold | `#CA8A04` |
| 🇸🇬 Singapore | Coral Red | `#E11D48` |

### Text Colors
| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| **Primary Text** | `#F1F5F9` | `slate-100` | Main body text |
| **Secondary Text** | `#94A3B8` | `slate-400` | Subtitles, descriptions |
| **Muted Text** | `#64748B` | `slate-500` | Placeholders, disabled |

---

## Typography

### Font Family
```css
/* Primary — for headings */
font-family: 'Inter', sans-serif;

/* Monospace — for code snippets */
font-family: 'JetBrains Mono', monospace;
```

### Type Scale
| Name | Size | Weight | Tailwind | Usage |
|------|------|--------|----------|-------|
| `display` | 48px | 800 | `text-5xl font-extrabold` | Hero headings |
| `h1` | 36px | 700 | `text-4xl font-bold` | Page titles |
| `h2` | 28px | 700 | `text-3xl font-bold` | Section headings |
| `h3` | 22px | 600 | `text-2xl font-semibold` | Card titles |
| `h4` | 18px | 600 | `text-lg font-semibold` | Sub-headings |
| `body` | 16px | 400 | `text-base` | Body text |
| `small` | 14px | 400 | `text-sm` | Labels, captions |
| `xs` | 12px | 400 | `text-xs` | Badges, timestamps |

---

## Spacing System

Uses Tailwind's default 4px base unit.

| Token | px | Tailwind | Usage |
|-------|----|----------|-------|
| `xs` | 4px | `p-1` | Tight spacing (badges) |
| `sm` | 8px | `p-2` | Small components |
| `md` | 16px | `p-4` | Default padding |
| `lg` | 24px | `p-6` | Card padding |
| `xl` | 32px | `p-8` | Section padding |
| `2xl` | 48px | `p-12` | Page sections |

---

## Components

### Button

```tsx
// Variants
<Button variant="primary">Start Quest</Button>
<Button variant="secondary">View Details</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger">Delete</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

**Styles:**
| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `primary` | `blue-500` | white | none |
| `secondary` | `slate-700` | `slate-100` | `slate-600` |
| `ghost` | transparent | `slate-300` | none |
| `danger` | `red-500` | white | none |

---

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Quest Title</CardTitle>
    <CardBadge variant="main">Main Quest</CardBadge>
  </CardHeader>
  <CardBody>
    Content goes here
  </CardBody>
  <CardFooter>
    <Button>Complete</Button>
  </CardFooter>
</Card>
```

**Style:** `bg-slate-800 rounded-xl border border-slate-700 p-6`

---

### Badge

```tsx
<Badge variant="main">Main Quest</Badge>
<Badge variant="side">Side Quest</Badge>
<Badge variant="daily">Daily Quest</Badge>
<Badge variant="completed">Completed</Badge>
<Badge variant="locked">Locked</Badge>
```

| Variant | Color |
|---------|-------|
| `main` | `blue-500` |
| `side` | `indigo-500` |
| `daily` | `amber-500` |
| `completed` | `green-500` |
| `locked` | `slate-600` |

---

### XP Bar (Progress Bar)

```tsx
<XPBar current={1350} max={2000} level={5} />
```

**Style:** Animated fill, gold gradient, with level badge on the right.

---

### Streak Counter

```tsx
<StreakCounter count={7} isActive={true} />
```

**Style:** 🔥 icon with count. Active = `text-amber-500`, Broken = `text-slate-500`.

---

### Quest Card

```tsx
<QuestCard
  title="Learn Git Basics"
  type="main"
  status="available"
  xpReward={100}
  estimatedMinutes={60}
  difficulty="beginner"
  onComplete={() => {}}
/>
```

**States:**
- `locked` → Grayed out, lock icon, no action
- `available` → Full color, "Start Quest" button
- `completed` → Green checkmark, `opacity-60`

---

## Icons

Use **Lucide React** for all icons. No mixing icon libraries.

```bash
npm install lucide-react
```

**Key icons used:**
| Icon | Usage |
|------|-------|
| `Flame` | Streak |
| `Star` | XP / achievements |
| `Lock` | Locked quests |
| `CheckCircle` | Completed |
| `Trophy` | Achievements |
| `Map` | Roadmap / path |
| `Globe` | Country / abroad |
| `Zap` | Daily quest |
| `ChevronRight` | Navigation |

---

## Layout

### Sidebar Width: `256px` (desktop)
### Main Content Max Width: `1280px`
### Mobile Breakpoint: `768px` (md)

### Page Layout (Desktop)
```
┌────────────────────────────────────────┐
│           Top Navigation Bar           │
├─────────┬──────────────────────────────┤
│         │                              │
│ Sidebar │      Main Content Area       │
│ (256px) │      (flex-1, max-w-5xl)     │
│         │                              │
└─────────┴──────────────────────────────┘
```

### Page Layout (Mobile)
```
┌────────────────────────────────────────┐
│           Top Navigation Bar           │
├────────────────────────────────────────┤
│                                        │
│          Main Content Area             │
│                                        │
├────────────────────────────────────────┤
│         Bottom Navigation Bar          │
└────────────────────────────────────────┘
```

---

## Dark Mode

The app is **dark mode only** (no light mode for MVP). This simplifies development and fits the gaming aesthetic.

**Background layers:**
```
Page BG:   slate-900  (#0F172A)
Card BG:   slate-800  (#1E293B)
Input BG:  slate-700  (#334155)
Border:    slate-700  (#334155)
```

---

## Animation Guidelines

- Use **Tailwind transitions** for hover states: `transition-all duration-200`
- Use **Framer Motion** for:
  - Quest completion celebration
  - Level up animation
  - Achievement unlocked popup
  - Page transitions
- Keep animations under **300ms** for UI interactions
- Celebration animations can be up to **1000ms**

```bash
npm install framer-motion
```
