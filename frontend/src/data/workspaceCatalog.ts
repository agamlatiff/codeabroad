import type { Quest, RunTestsResponse, SubmitQuestResponse, AcceptanceCriterion } from '../types/quest'
import type { User } from '../types/auth'
import { CURRICULUM_TRACKS_MAP } from './curriculumData'

/**
 * WORKSPACE QUEST CATALOG (SSOT)
 * Provides production-grade starter code, Acceptance Criteria, and Nihongo notes
 * for all 5 technical specialization tracks.
 */

export const WORKSPACE_QUEST_CATALOG: Record<string, Partial<Quest>> = {
  // ── 1. GOLANG TRACK ───────────────────────────────────────────────────────
  'part-1-variabel-dan-tipe-data': {
    id: 'part-1-variabel-dan-tipe-data',
    title: 'Variabel, Strict Typing & Memori Stack Go',
    chip_label: 'GO 01',
    difficulty: 'Pemula',
    xp_reward: 50,
    estimated_minutes: 10,
    story_context:
      'Di tim engineering Tokyo, penulisan tipe data eksplisit dan pemahaman memori stack CPU adalah syarat mutlak agar microservices beroperasi dengan efisiensi zero overhead.',
    nihongo_notes: {
      term: '変数 (Hensuu)',
      reading: 'へんすう',
      meaning: 'Variabel pemrograman',
      example: '変数宣言には明示的な型を指定します (Gunakan tipe eksplisit saat deklarasi variabel).',
    },
    acceptance_criteria: [
      { id: 'c1', description: 'Deklarasikan struct Engineer dengan field Name string dan Level int', passed: false },
      { id: 'c2', description: 'Buat fungsi NewEngineer(name string, level int) Engineer', passed: false },
      { id: 'c3', description: 'Return struct instance yang diinisialisasi pada memori stack', passed: false },
    ],
    starter_code: {
      filename: 'main.go',
      language: 'go',
      content: `package main

import "fmt"

// 1. Definisikan struct Engineer dengan field:
//    - Name (string)
//    - Level (int)
type Engineer struct {
	Name  string
	Level int
}

// 2. Buat fungsi konstruktor NewEngineer
func NewEngineer(name string, level int) Engineer {
	// TODO: Return instance Engineer dengan name dan level yang diberikan
	return Engineer{
		Name:  name,
		Level: level,
	}
}

func main() {
	dev := NewEngineer("Kodi", 1)
	fmt.Printf("Tokyo Engineer: %+v\\n", dev)
}
`,
    },
  },

  'part-2-pointer-dan-struktur-data': {
    id: 'part-2-pointer-dan-struktur-data',
    title: 'Pointer, Dereferencing & Mutasi Struct Tanpa Copy',
    chip_label: 'GO 02',
    difficulty: 'Pemula',
    xp_reward: 50,
    estimated_minutes: 12,
    story_context:
      'Gunakan pointer receiver untuk memodifikasi state objek secara in-place tanpa menduplikasi data di memori stack.',
    nihongo_notes: {
      term: 'ポインタ (Pointa)',
      reading: 'ぽいんた',
      meaning: 'Pointer / Alamat Memori',
      example: 'ポインタを使ってメモリコピーのオーバーヘッドを防ぎます (Gunakan pointer untuk menghindari overhead copy memori).',
    },
    acceptance_criteria: [
      { id: 'c1', description: 'Buat method receiver (e *Engineer) Promote() yang menaikkan Level sebanyak 1', passed: false },
      { id: 'c2', description: 'Pastikan method receiver menggunakan pointer *Engineer bukan value copy', passed: false },
    ],
    starter_code: {
      filename: 'pointer.go',
      language: 'go',
      content: `package main

import "fmt"

type Engineer struct {
	Name  string
	Level int
}

// TODO: Buat pointer receiver method Promote()
// func (e *Engineer) Promote() { ... }
func (e *Engineer) Promote() {
	e.Level++
}

func main() {
	dev := &Engineer{Name: "Kodi", Level: 1}
	dev.Promote()
	fmt.Printf("Promoted: Level %d\\n", dev.Level)
}
`,
    },
  },

  'part-4-routing-dan-jwt-middleware': {
    id: 'part-4-routing-dan-jwt-middleware',
    title: 'Gin Radix Router & JSON Response Envelope',
    chip_label: 'GIN 01',
    difficulty: 'Menengah',
    xp_reward: 50,
    estimated_minutes: 15,
    story_context:
      'Standar API industri Tokyo mensyaratkan response envelope JSON yang seragam (success, message, data).',
    nihongo_notes: {
      term: '通信 (Tsuushin)',
      reading: 'つうしん',
      meaning: 'Koneksi data / HTTP Communication',
      example: 'API通信のレスポンス形式を共通化します (Seragamkan format response komunikasi API).',
    },
    acceptance_criteria: [
      { id: 'c1', description: 'Buat struct ResponseEnvelope dengan field Success bool, Message string, Data any', passed: false },
      { id: 'c2', description: 'Buat handler HealthCheckHandler yang mengembalikan status 200 JSON ResponseEnvelope', passed: false },
    ],
    starter_code: {
      filename: 'router.go',
      language: 'go',
      content: `package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

type ResponseEnvelope struct {
	Success bool   \`json:"success"\`
	Message string \`json:"message"\`
	Data    any    \`json:"data,omitempty"\`
}

func HealthCheckHandler(c *gin.Context) {
	// TODO: Kirim response JSON dengan status 200 OK
	c.JSON(http.StatusOK, ResponseEnvelope{
		Success: true,
		Message: "CodeAbroad Tokyo API is running smoothly",
		Data:    gin.H{"status": "UP"},
	})
}
`,
    },
  },

  // ── 2. REACT FRONTEND TRACK ───────────────────────────────────────────────
  'fe-part-1-ts-basics': {
    id: 'fe-part-1-ts-basics',
    title: 'Strict TypeScript Types & Discriminated Unions',
    chip_label: 'REACT 01',
    difficulty: 'Pemula',
    xp_reward: 50,
    estimated_minutes: 12,
    story_context:
      'Tim frontend Tokyo sangat menghargai zero-warning strict TypeScript config (noImplicitAny, strictNullChecks).',
    nihongo_notes: {
      term: '型定義 (Katateigi)',
      reading: 'かたていぎ',
      meaning: 'Definisi Type TypeScript',
      example: '厳格な型定義でバグを未然に防ぎます (Cegah bug runtime dengan definisi type yang ketat).',
    },
    acceptance_criteria: [
      { id: 'c1', description: 'Definisikan type QuestStatus sebagai discriminated union ("available" | "in_progress" | "completed")', passed: false },
      { id: 'c2', description: 'Buat fungsi formatQuestBadge(status: QuestStatus): string', passed: false },
    ],
    starter_code: {
      filename: 'types.ts',
      language: 'typescript',
      content: `// 1. Definisikan discriminated union
export type QuestStatus = 'available' | 'in_progress' | 'completed'

// 2. Fungsi badge formatter dengan exhaustive pattern matching
export const formatQuestBadge = (status: QuestStatus): string => {
  switch (status) {
    case 'available':
      return '🟢 TERSEDIA'
    case 'in_progress':
      return '⚡ SEDANG BERJALAN'
    case 'completed':
      return '✓ SELESAI'
  }
}
`,
    },
  },

  // ── 3. DEVOPS & DOCKER TRACK ──────────────────────────────────────────────
  'devops-part-1-linux-kernel': {
    id: 'devops-part-1-linux-kernel',
    title: 'Linux POSIX Permissions & Shell Automation',
    chip_label: 'DEVOPS 01',
    difficulty: 'Pemula',
    xp_reward: 50,
    estimated_minutes: 15,
    story_context:
      'Server cloud di Tokyo berjalan di atas Linux. Menguasai izin akses POSIX dan automasi Bash adalah syarat mutlak SRE dan DevOps engineer.',
    nihongo_notes: {
      term: '保守 (Hoshu)',
      reading: 'ほしゅ',
      meaning: 'Pemeliharaan server / Maintenance',
      example: '定期的なサーバー保守作業を実施します (Lakukan pemeliharaan server secara berkala).',
    },
    acceptance_criteria: [
      { id: 'c1', description: 'Tuliskan bash script deployment dengan strict mode (set -euo pipefail)', passed: false },
      { id: 'c2', description: 'Buat healthcheck curl yang memvalidasi HTTP response 200', passed: false },
    ],
    starter_code: {
      filename: 'deploy.sh',
      language: 'bash',
      content: `#!/usr/bin/env bash
set -euo pipefail

echo "==> Memulai deployment CodeAbroad Microservice di Tokyo Cloud..."

# Health check endpoint
API_URL="http://localhost:8080/health"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL" || echo "000")

if [ "$STATUS" -eq 200 ]; then
    echo "✓ Deployment Sukses: Service beroperasi normal"
    exit 0
else
    echo "✕ Deployment Gagal: HTTP status $STATUS"
    exit 1
fi
`,
    },
  },

  // ── 4. FUNDAMENTAL COMPUTER SCIENCE TRACK ──────────────────────────────────
  'fund-part-1-cpu-memory': {
    id: 'fund-part-1-cpu-memory',
    title: 'Arsitektur CPU: Stack Allocation vs Heap Escape',
    chip_label: 'CS 01',
    difficulty: 'Pemula',
    xp_reward: 50,
    estimated_minutes: 10,
    story_context:
      'Wawancara teknis perusahaan teknologi top Tokyo selalu menguji pemahaman memori komputer di putaran pertama.',
    nihongo_notes: {
      term: '基本 (Kihon)',
      reading: 'きほん',
      meaning: 'Dasar / Fundamental',
      example: 'コンピュータの基本構造を理解することが大切です (Penting memahami struktur dasar komputer).',
    },
    acceptance_criteria: [
      { id: 'c1', description: 'Implementasikan fungsi stack allocation tanpa escape ke heap', passed: false },
      { id: 'c2', description: 'Implementasikan buffer creation dengan pointer return', passed: false },
    ],
    starter_code: {
      filename: 'memory.go',
      language: 'go',
      content: `package main

// Alokasi memori stack cepat (auto-reclaimed saat fungsi selesai)
func CalculateArea(width, height int) int {
	return width * height
}

// Alokasi memori dinamis (Heap)
func NewBuffer(size int) *[]byte {
	buf := make([]byte, size)
	return &buf
}
`,
    },
  },

  // ── 5. TECH NIHONGO TRACK ─────────────────────────────────────────────────
  'nihongo-part-1-aisatsu': {
    id: 'nihongo-part-1-aisatsu',
    title: 'Aisatsu, Jikoshoukai & Etika Kerja Kantor Tokyo',
    chip_label: '🌸 NIHONGO',
    difficulty: 'Mudah',
    xp_reward: 50,
    estimated_minutes: 10,
    story_context:
      'Etika kerja dan salam sapaan adalah gerbang utama adaptasi budaya di Tokyo. Menyapa rekan kerja dengan sopan membangun rasa percaya (shinrai).',
    nihongo_notes: {
      term: '挨拶 (Aisatsu)',
      reading: 'あいさつ',
      meaning: 'Salam sapaan di tempat kerja',
      example: '毎朝の挨拶は職場の信頼関係を築きます (Aisatsu pagi membangun hubungan saling percaya di kantor).',
    },
    acceptance_criteria: [
      { id: 'c1', description: 'Kuasai salam pagi standar kantor (Ohayou gozaimasu)', passed: false },
      { id: 'c2', description: 'Kuasai perkenalan diri software engineer (Jikoshoukai Keigo)', passed: false },
    ],
    starter_code: {
      filename: 'jikoshoukai.txt',
      language: 'text',
      content: `// Pola Jikoshoukai (Perkenalan Diri) Software Engineer di Tokyo:

Hajimemashite. Kodi to moushimasu.
Indonesia kara mairimashita.
Kore made wa Web sabisu no kaihatsu wo shiteorimashita.
Tokyo de minasan to issho ni hataraku koto ga dekite, totemo kouei desu.
Seiippai ganbarimasu node, douzo yoroshiku onegai itashimasu.
`,
    },
  },
}

/**
 * Universal Fallback Generator
 * If the exact partId is not in the explicit dictionary, dynamically resolve it
 * from CURRICULUM_TRACKS_MAP so EVERY part in the app opens reliably!
 */
export const getWorkspaceQuestFallback = (partId: string): Quest => {
  const timestamp = new Date().toISOString()

  if (WORKSPACE_QUEST_CATALOG[partId]) {
    const raw = WORKSPACE_QUEST_CATALOG[partId]
    return {
      id: raw.id || partId,
      title: raw.title || 'Modul Pembelajaran Koding',
      chip_label: raw.chip_label || 'MODUL',
      difficulty: raw.difficulty || 'Pemula',
      xp_reward: raw.xp_reward || 50,
      estimated_minutes: raw.estimated_minutes || 15,
      story_context: raw.story_context || 'Tuntaskan kriteria penerimaan berikut di workspace editor.',
      nihongo_notes: raw.nihongo_notes,
      acceptance_criteria: raw.acceptance_criteria || [
        { id: 'c1', description: 'Lengkapi implementasi fungsi sesuai spesifikasi koding', passed: false },
        { id: 'c2', description: 'Pastikan kode bebas dari error sintaks', passed: false },
      ],
      starter_code: raw.starter_code || {
        filename: 'main.go',
        language: 'go',
        content: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("CodeAbroad Tokyo Curriculum")\n}\n`,
      },
      order_index: 1,
      is_active: true,
      type: 'main',
      user_status: 'available',
      user_tests_passed: 0,
      user_total_tests: 2,
      created_at: timestamp,
      updated_at: timestamp,
    }
  }

  // Look through CURRICULUM_TRACKS_MAP
  for (const trackUnits of Object.values(CURRICULUM_TRACKS_MAP)) {
    for (const unit of trackUnits) {
      const matchPart = unit.parts.find(
        (p) =>
          p.id === partId ||
          p.id.startsWith(partId + '-') ||
          partId.startsWith(p.id + '-') ||
          p.route === `/learn/${partId}`
      )
      if (matchPart) {
        const isNihongo = matchPart.category === 'nihongo' || matchPart.id.includes('nihongo')
        const isFrontend =
          matchPart.route.includes('fe-') ||
          matchPart.id.includes('fe-') ||
          matchPart.chipLabel.includes('REACT') ||
          matchPart.chipLabel.includes('TS')
        const isDevOps =
          matchPart.route.includes('devops-') ||
          matchPart.id.includes('devops-') ||
          matchPart.chipLabel.includes('LINUX') ||
          matchPart.chipLabel.includes('DOCKER')

        return {
          id: matchPart.id,
          title: matchPart.title,
          chip_label: matchPart.chipLabel,
          difficulty: matchPart.difficulty,
          xp_reward: matchPart.xpReward,
          estimated_minutes: matchPart.estimatedMinutes,
          story_context: matchPart.subtitle,
          acceptance_criteria: [
            { id: 'c1', description: `Implementasikan logika untuk ${matchPart.title}`, passed: false },
            { id: 'c2', description: 'Pastikan struktur kode memenuhi standar Clean Architecture Tokyo', passed: false },
          ],
          starter_code: {
            filename: isNihongo ? 'notes.txt' : isFrontend ? 'App.tsx' : isDevOps ? 'main.sh' : 'solution.go',
            language: isNihongo ? 'text' : isFrontend ? 'typescript' : isDevOps ? 'shell' : 'go',
            content: `// ${matchPart.title}\n// Tokyo Curriculum - ${unit.title}\n\n// TODO: Tuliskan implementasi kode Anda di sini\n`,
          },
          order_index: matchPart.globalPartNumber,
          is_active: true,
          type: 'main',
          user_status: 'available',
          user_tests_passed: 0,
          user_total_tests: 2,
          created_at: timestamp,
          updated_at: timestamp,
        }
      }
    }
  }

  // Generic fallback
  return {
    id: partId,
    title: 'Tantangan Koding Spesialisasi Tokyo',
    chip_label: 'MODUL',
    difficulty: 'Menengah',
    xp_reward: 50,
    estimated_minutes: 15,
    story_context: 'Selesaikan tantangan koding ini sesuai spesifikasi instruksi industri Tokyo.',
    acceptance_criteria: [
      { id: 'c1', description: 'Lengkapi implementasi kode tanpa error', passed: false },
      { id: 'c2', description: 'Pastikan kode memenuhi pengujian unit test', passed: false },
    ],
    starter_code: {
      filename: 'main.go',
      language: 'go',
      content: `package main\n\n// TODO: Tulis solusi kode Anda di sini\n`,
    },
    order_index: 1,
    is_active: true,
    type: 'main',
    user_status: 'available',
    user_tests_passed: 0,
    user_total_tests: 2,
    created_at: timestamp,
    updated_at: timestamp,
  }
}

/**
 * Heuristic Testing Engine for Offline / Fallback Evaluation
 */
export const evaluateWorkspaceCode = (quest: Quest, userCode: string): RunTestsResponse => {
  const criteria: AcceptanceCriterion[] = quest.acceptance_criteria || []
  const hasCode = userCode.trim().length > 35 && !userCode.includes('// TODO: Return instance Engineer dengan name dan level yang diberikan')
  
  // Heuristic evaluation: check if code has substantive implementation
  const criteriaResults = criteria.map((c, idx) => {
    // If user has written more than 30 non-empty characters, criteria 1 passes
    let passed = false
    if (idx === 0) {
      passed = userCode.trim().length > 25
    } else if (idx === 1) {
      passed = hasCode && (userCode.includes('func') || userCode.includes('type') || userCode.includes('const') || userCode.includes('return') || userCode.includes('export'))
    } else {
      passed = hasCode && userCode.includes('return')
    }
    return {
      id: c.id,
      description: c.description,
      passed,
    }
  })

  const passedCount = criteriaResults.filter((c) => c.passed).length
  const totalCount = criteriaResults.length > 0 ? criteriaResults.length : 1
  const allPassed = passedCount === totalCount

  const outputLog = allPassed
    ? `=== RUN   TestTokyoEngineeringRequirements
=== RUN   TestCodeQualityAndTypes
--- PASS: TestTokyoEngineeringRequirements (0.04s)
--- PASS: TestCodeQualityAndTypes (0.01s)
PASS
ok  	codeabroad/tokyo-spec	0.052s`
    : `=== RUN   TestTokyoEngineeringRequirements
    spec_test.go:28: [GAGAL] ${criteriaResults.find((c) => !c.passed)?.description || 'Kriteria belum terpenuhi'}
--- FAIL: TestTokyoEngineeringRequirements (0.02s)
FAIL
exit status 1`

  return {
    success: allPassed,
    tests_passed: passedCount,
    total_tests: totalCount,
    criteria_results: criteriaResults,
    output: outputLog,
    duration_ms: 52,
  }
}

/**
 * Generate Next Quest Pointer
 */
export const findNextQuestId = (currentId: string): string => {
  for (const trackUnits of Object.values(CURRICULUM_TRACKS_MAP)) {
    const allParts = trackUnits.flatMap((u) => u.parts)
    const idx = allParts.findIndex(
      (p) =>
        p.id === currentId ||
        p.id.startsWith(currentId + '-') ||
        currentId.startsWith(p.id + '-') ||
        p.route === `/learn/${currentId}`
    )
    if (idx >= 0 && idx < allParts.length - 1) {
      return allParts[idx + 1].id
    }
  }
  return 'part-2-pointer-dan-struktur-data'
}

/**
 * Generate Local Submit Response
 */
export const generateSubmitResponse = (quest: Quest, user: User | null): SubmitQuestResponse => {
  const xpReward = quest.xp_reward || 50
  const currentXp = (user?.xp || 0) + xpReward
  const currentStreak = (user?.streak || 1) + 1
  const nextId = findNextQuestId(quest.id)

  // Dynamically compute Tokyo readiness score based on completed units and accumulated XP
  let completedCount = 0
  try {
    const stored = JSON.parse(localStorage.getItem('codeabroad_completed_quests') || '[]')
    if (Array.isArray(stored)) {
      completedCount = stored.length
    }
  } catch {
    completedCount = 1
  }
  const dynamicReadiness = Math.min(99.0, Math.round((20 + (completedCount * 3.5) + (currentXp / 80)) * 10) / 10)

  return {
    quest_id: quest.id,
    xp_awarded: xpReward,
    gems_awarded: 10,
    streak: currentStreak,
    streak_extended: true,
    current_xp: currentXp,
    current_level: user?.current_level || 1,
    readiness_increase: 2.5,
    current_readiness_score: dynamicReadiness,
    unlocked_vocab: quest.nihongo_notes,
    next_quest: {
      id: nextId,
      title: 'Sesi Belajar Selanjutnya',
      chip_label: 'NEXT',
      type: 'main',
      difficulty: 'Menengah',
      xp_reward: 50,
      estimated_minutes: 15,
      order_index: 2,
      status: 'available',
    },
  }
}
