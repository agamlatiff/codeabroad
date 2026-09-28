# Design System
# CodeAbroad

**Version:** 2.0  
**Last Updated:** 2026-09-28  
**Visual Reference:** [Raycast](https://www.raycast.com/) (Obsidian Dark, Glassmorphism, Micro-Glows, Keyboard-first)  
**Component Architecture:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI + Tailwind CSS + CVA)

---

## 1. Brand Identity & Design Principles

### Brand Philosophy
- **Precision & Speed:** Fast, distraction-free, keyboard-accessible like a professional developer tool.
- **Atmospheric Gaming:** Sleek obsidian surfaces accented by vibrant, luminescent progress markers and RPG mechanics.
- **Empowering & Direct:** Career progression presented with clean metrics, country roadmaps, and actionable quests.

### Key Visual Pillars (The Raycast Feel)
1. **Ultra-Dark Obsidian Layers:** Deep layered blacks with subtle elevation (`#08090C`, `#0E1117`, `#161922`) instead of flat gray blocks.
2. **Subtle Hairline Borders:** `border-white/[0.08]` and high-contrast active states.
3. **Luminescent Accents:** Soft radial glows and gradient highlights on hover, focus, and achievement milestones.
4. **Command Palette First:** Fast global navigation and action execution via `Cmd/Ctrl + K`.
5. **Tactile Micro-interactions:** Smooth spring animations, crisp keyboard shortcut indicators (`<Kbd>`), and subtle active tap scales (`active:scale-[0.98]`).

---

## 2. Color Tokens (shadcn/ui HSL Variables)

Configured for Tailwind CSS with CSS custom properties in `src/index.css`. All colors use HSL format without `deg` or `%` units to support Tailwind opacity modifier syntax (e.g., `hsl(var(--primary) / 0.9)`).

### CSS Custom Properties (`src/index.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Base Obsidian Surfaces */
    --background: 228 14% 4%;           /* #08090C (Canvas Obsidian) */
    --foreground: 210 20% 98%;          /* #F8FAFC (Crisp White Text) */

    --card: 225 14% 7%;                 /* #0E1117 (Elevated Surface) */
    --card-foreground: 210 20% 98%;

    --popover: 225 14% 7%;
    --popover-foreground: 210 20% 98%;

    /* Brand & Accents (Raycast Coral / Red Accent) */
    --primary: 0 100% 69%;              /* #FF6363 (Raycast Coral) */
    --primary-foreground: 0 0% 100%;

    --secondary: 224 13% 14%;           /* #1A1E29 (Muted Panel) */
    --secondary-foreground: 210 20% 90%;

    --muted: 224 13% 14%;
    --muted-foreground: 218 11% 65%;    /* #9CA3AF (Secondary Label) */

    --accent: 224 13% 18%;              /* #222736 (Hover / Focus State) */
    --accent-foreground: 210 20% 98%;

    --destructive: 0 84% 60%;           /* #EF4444 */
    --destructive-foreground: 210 20% 98%;

    --border: 224 13% 16%;              /* Equivalent to border-white/[0.08] */
    --input: 224 13% 16%;
    --ring: 0 100% 69%;                 /* Primary Coral focus ring */

    --radius: 0.625rem;                 /* 10px standard radius */

    /* Gamification & Progress Tokens */
    --xp-gold: 43 96% 56%;              /* #F5A623 (XP, Level, Badges) */
    --streak-fire: 25 95% 53%;          /* #F97316 (Daily Login Streaks) */
    --country-japan: 348 83% 58%;       /* #EF4466 (Tokyo Crimson) */
    --country-germany: 45 93% 47%;      /* #EAB308 (Berlin Gold) */
    --country-singapore: 350 89% 60%;   /* #F43F5E (Singapore Coral) */
  }
}
```

### Color Palette Quick Reference
| Token | HSL | Hex Equivalent | Usage |
|-------|-----|----------------|-------|
| `background` | `228 14% 4%` | `#08090C` | Main application canvas |
| `card` | `225 14% 7%` | `#0E1117` | Card surfaces, modals, popovers |
| `primary` | `0 100% 69%` | `#FF6363` | Primary CTAs, active highlights, Raycast glow |
| `secondary` | `224 13% 14%` | `#1A1E29` | Inactive chips, secondary buttons |
| `border` | `224 13% 16%` | `#222634` | Hairline dividers and container outlines |
| `xp-gold` | `43 96% 56%` | `#F5A623` | XP progress bars, level badges, coin rewards |
| `streak-fire` | `25 95% 53%` | `#F97316` | Active login streak flame counter |

---

## 3. Typography

- **Headings & UI Sans:** `Inter` or `Geist Sans` with tight tracking (`tracking-tight`)
- **Code & Keyboard Shortcuts:** `JetBrains Mono` or `Geist Mono`

```css
/* Typography setup in tailwind.config.ts */
fontFamily: {
  sans: ["Inter", "sans-serif"],
  mono: ["JetBrains Mono", "monospace"],
}
```

### Type Scale
| Token | Size | Weight | Tracking | Usage |
|-------|------|--------|----------|-------|
| `text-4xl` | 36px | Bold (700) | `tracking-tight` | Page titles, hero banners |
| `text-2xl` | 24px | Semibold (600) | `tracking-tight` | Section headings, dialog titles |
| `text-lg` | 18px | Medium (500) | normal | Card titles, modal headers |
| `text-sm` | 14px | Regular (400) / Medium (500) | normal | Body text, inputs, buttons, menu items |
| `text-xs` | 12px | Medium (500) | normal | Badges, timestamps, helper text |
| `text-[10px]` | 10px | Semibold (600) | `tracking-wide` | Keyboard shortcut keys (`<Kbd>`) |

---

## 4. Component Architecture (shadcn/ui Implementation)

### 4.1 Utility: `cn` Helper (`src/lib/utils.ts`)
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### 4.2 Button (`src/components/ui/button.tsx`)
Built with `class-variance-authority` (CVA) and Radix Slot:
```tsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,99,99,0.3)] hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(255,99,99,0.5)]",
        secondary:
          "bg-secondary text-secondary-foreground border border-white/[0.08] hover:bg-secondary/80 hover:border-white/15",
        outline:
          "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_12px_rgba(239,68,68,0.3)]",
        raycast:
          "bg-white/[0.05] border border-white/10 backdrop-blur-md text-foreground hover:bg-white/[0.1] hover:border-white/20 shadow-sm",
        gold:
          "bg-amber-500 text-black font-semibold shadow-[0_0_15px_rgba(245,166,35,0.35)] hover:bg-amber-400 hover:shadow-[0_0_25px_rgba(245,166,35,0.5)]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

---

### 4.3 Keyboard Keycap (`src/components/ui/kbd.tsx`)
Essential for the Raycast keyboard-driven UX:
```tsx
import { cn } from "@/lib/utils";

interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

export function Kbd({ children, className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/10 bg-white/[0.06] px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}
```

---

### 4.4 Command Menu (`src/components/ui/command.tsx`)
Raycast-style Command Palette powered by `cmdk`:
```tsx
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from "@/components/ui/command";

export function GlobalCommandMenu() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search quests, roadmaps... (⌘K)" />
      <CommandList>
        <CommandEmpty>No matching results.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigate("/quests")}>
            <span>All Quests</span>
            <CommandShortcut>⌘Q</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate("/roadmaps")}>
            <span>Country Roadmaps</span>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleStartDailyQuest()}>
            <span>Continue Daily Quest</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
```

---

### 4.5 Card (`src/components/ui/card.tsx`)
Glassmorphic card surface with Raycast specular hairline border:
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/[0.08] bg-card/80 backdrop-blur-xl text-card-foreground shadow-sm transition-all duration-200 hover:border-white/20",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}
```

---

### 4.6 Badge (`src/components/ui/badge.tsx`)
```tsx
import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        main: "border-sky-500/20 bg-sky-500/10 text-sky-400",
        side: "border-purple-500/20 bg-purple-500/10 text-purple-400",
        daily: "border-amber-500/20 bg-amber-500/10 text-amber-400",
        xp: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400 font-mono",
        completed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
        locked: "border-white/5 bg-white/5 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

---

### 4.7 Gamification Components

#### Quest Card (`QuestCard`)
```tsx
<QuestCard
  title="Setup Go Clean Architecture"
  type="main"
  status="available" // "locked" | "available" | "in_progress" | "completed"
  xpReward={150}
  targetCountry="japan"
  estimatedMinutes={45}
  onStart={() => {}}
/>
```
- **Visuals:**
  - `available`: Subtle hairline border, glowing primary button on hover.
  - `locked`: `opacity-50`, padlock icon, interaction disabled.
  - `completed`: Subtle emerald border, checkmark icon, muted XP badge.

#### XP Progress Bar (`XPBar`)
- Uses `@radix-ui/react-progress`.
- Progress indicator features a radiant gold glow:
  `shadow-[0_0_12px_rgba(245,166,35,0.4)] bg-gradient-to-r from-amber-500 to-yellow-400`.
- Includes current XP, maximum XP for current level, and Level Badge.

#### Streak Counter (`StreakCounter`)
- Flame icon with dynamic breathing glow when active.
- Glassmorphic chip: `bg-white/[0.04] border border-orange-500/20 text-orange-400`.
- Warning pulse when streak is expiring within 3 hours.

---

## 5. Layout & Shell Architecture

### Desktop Layout (>= 768px)
- **Sticky Top Bar (`h-14`):**
  - Brand Logo + Breadcrumbs
  - Global `⌘K` Command Search Bar trigger (Raycast style)
  - Quick Streak Counter (`🔥 7`) + XP Pill (`⭐ Lvl 5`) + User Profile Avatar
- **Sidebar (`w-60`):**
  - Navigation links with keyboard shortcuts displayed via `<Kbd>`
  - Country track selector (🇯🇵 Japan, 🇩🇪 Germany, 🇸🇬 Singapore)
- **Main Viewport:** Max width `1200px`, centered with fluid padding.

### Mobile Layout (< 768px)
- **Top Header:** Logo + Command menu trigger icon + User avatar.
- **Content Area:** Full width with `px-4`.
- **Bottom Navigation Bar:** Quick access tabs (Home, Quests, Roadmaps, Profile).

---

## 6. Motion & Animation (Framer Motion)

| Interaction | Duration | Transition Style |
|-------------|----------|------------------|
| Button Press / Tap | Instant (`active:scale-[0.98]`) | Ease-out |
| Command Palette Open | 150ms | `spring(stiffness: 400, damping: 30)` |
| Card Hover Glow | 200ms | `ease-out` |
| Quest Completed Celebration | 800ms | Confetti + XP float-up counter |
| Level Up Dialog | 500ms | Scale bounce + radial gold bloom |

---

## 7. Required NPM Dependencies

```bash
# Core Primitives & Styling
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-progress @radix-ui/react-dropdown-menu @radix-ui/react-tooltip
npm install class-variance-authority clsx tailwind-merge
npm install cmdk
npm install lucide-react
npm install framer-motion
npm install canvas-confetti @types/canvas-confetti
```
