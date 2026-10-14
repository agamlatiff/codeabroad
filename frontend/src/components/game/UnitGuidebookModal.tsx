import { useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  BookOpen,
  Code,
  ChatCircleText,
  Copy,
  Check,
  Sparkle,
  Lightbulb,
} from '@phosphor-icons/react'
import { triggerHaptic } from '../../utils/haptics'
import { SpeechBubble } from '../ui/SpeechBubble'
import doodleProud from '../../assets/kodi/doodle-proud.png'

export interface GuidebookContent {
  summary: string
  keyConcepts: { title: string; explanation: string }[]
  codeSnippet: {
    language: string
    title: string
    code: string
  }
  nihongoNotes: {
    kanji: string
    romaji: string
    meaning: string
    workplaceUsage: string
  }[]
}

const GUIDEBOOK_DATA: Record<number, GuidebookContent> = {
  1: {
    summary:
      'Unit 1 membahas fondasi arsitektur runtime Go, alokasi memori stack vs heap, serta penggunaan pointer idiomatik yang menjadi standar wajib coding interview di Tokyo.',
    keyConcepts: [
      {
        title: 'Stack vs Heap & Escape Analysis',
        explanation:
          'Go mengalokasikan variabel lokal di Stack yang sangat cepat dan otomatis dibersihkan. Jika pointer variabel dikembalikan keluar scope fungsi, Go Compiler memindahkannya ke Heap (Escape Analysis).',
      },
      {
        title: 'Pointer & Nil Safety',
        explanation:
          'Gunakan tanda & untuk mereferensikan alamat memori dan * untuk mengakses nilai di alamat tersebut. Selalu periksa nil pointer sebelum melakukan dereference untuk menghindari panic runtime.',
      },
      {
        title: 'Struct Composition vs Inheritance',
        explanation:
          'Go tidak memiliki class atau pewarisan bertingkat. Sebagai gantinya, Go menggunakan struct embedding untuk komposisi yang bersih dan decoupled.',
      },
    ],
    codeSnippet: {
      language: 'go',
      title: 'pointer_and_struct_idiom.go',
      code: `package main

import "fmt"

type Engineer struct {
    Name    string
    Level   int
    Stack   string
}

// Receiver method pointer: memutasi objek secara efisien tanpa copy data
func (e *Engineer) LevelUp(bonus int) {
    if e == nil {
        return // Nil safety guard
    }
    e.Level += bonus
}

func main() {
    lead := &Engineer{Name: "Budi", Level: 1, Stack: "Golang"}
    lead.LevelUp(2)
    fmt.Printf("Tokyo Engineer: %s, Level: %d\\n", lead.Name, lead.Level)
}`,
    },
    nihongoNotes: [
      {
        kanji: 'ポインタ',
        romaji: 'Pointa',
        meaning: 'Pointer (Penunjuk Alamat Memori)',
        workplaceUsage: 'ポインタ渡しで実装してください (Tolong implementasikan dengan pointer pass-by-reference).',
      },
      {
        kanji: '朝会 (ちょうかい)',
        romaji: 'Choukai',
        meaning: 'Morning Standup Meeting',
        workplaceUsage: '毎朝9時半から朝会を始めます (Standup meeting pagi dimulai setiap pukul 09:30).',
      },
      {
        kanji: 'よろしくお願いします',
        romaji: 'Yoroshiku onegai shimasu',
        meaning: 'Mohon kerjasamanya / Mohon review kodenya',
        workplaceUsage: 'PRを作成しました。レビューよろしくお願いします (Saya sudah membuat PR. Mohon bantuannya untuk di-review).',
      },
    ],
  },
  2: {
    summary:
      'Unit 2 berfokus pada pembangunan RESTful API enterprise dengan framework Gin, middleware authentication JWT, dan arsitektur Clean Architecture yang memisahkan Handler, Usecase, dan Repository.',
    keyConcepts: [
      {
        title: 'Gin Routing & DTO Binding',
        explanation:
          'Gin menyediakan routing engine bertipe radix tree dengan performa tinggi. Gunakan ShouldBindJSON untuk validasi otomatis payload DTO request masuk.',
      },
      {
        title: 'JWT Authentication Guard Middleware',
        explanation:
          'Header Authorization Bearer token diurai dan divalidasi. User ID dan klaim hak akses diinjeksikan ke dalam gin.Context menggunakan c.Set("user_id", id).',
      },
      {
        title: 'Clean Architecture Pattern',
        explanation:
          'Handler HTTP hanya bertanggung jawab atas parsing JSON. Logika bisnis diatur di Usecase/Service, dan operasi database dipisahkan di Repository.',
      },
    ],
    codeSnippet: {
      language: 'go',
      title: 'jwt_auth_middleware.go',
      code: `package middleware

import (
    "net/http"
    "strings"
    "github.com/gin-gonic/gin"
)

func AuthGuard() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
                "success": false,
                "message": "Token otentikasi tidak ditemukan",
            })
            return
        }
        tokenString := strings.TrimPrefix(authHeader, "Bearer ")
        // Simpan token context ke pipeline
        c.Set("valid_token", tokenString)
        c.Next()
    }
}`,
    },
    nihongoNotes: [
      {
        kanji: '認証 (にんしょう)',
        romaji: 'Ninshou',
        meaning: 'Authentication (Otentikasi)',
        workplaceUsage: 'JWTで認証機能を実装しました (Saya sudah mengimplementasikan otentikasi dengan JWT).',
      },
      {
        kanji: 'プルリク (PR)',
        romaji: 'Pururiku',
        meaning: 'Pull Request',
        workplaceUsage: 'プルリクの確認をお願いします (Tolong periksa pull request saya).',
      },
      {
        kanji: 'デプロイ',
        romaji: 'Depuroi',
        meaning: 'Deployment',
        workplaceUsage: 'ステージング環境へデプロイ完了しました (Deployment ke staging environment sudah selesai).',
      },
    ],
  },
  3: {
    summary:
      'Unit 3 menguasai concurrency tingkat tinggi di Golang: goroutines, channels, sync.WaitGroup, serta pola Worker Pool untuk memproses ribuan beban kerja komputasi async secara paralel tanpa memory leak.',
    keyConcepts: [
      {
        title: 'Goroutines vs OS Threads',
        explanation:
          'Goroutine hanya membutuhkan memori awal ~2KB (dibandingkan thread OS sebesar 1-2MB). Go Scheduler memetakan ribuan goroutine ke beberapa thread CPU fisik secara M:N multiplexing.',
      },
      {
        title: 'Channels & CSP Concurrency',
        explanation:
          '"Do not communicate by sharing memory; instead, share memory by communicating." Channels menjamin aliran data aman antar goroutine tanpa lock mutex.',
      },
      {
        title: 'Worker Pool Pattern',
        explanation:
          'Membatasi jumlah goroutine yang berjalan sekaligus untuk menghindari resource exhaustion ketika memproses batching query database atau panggilan API pihak ketiga.',
      },
    ],
    codeSnippet: {
      language: 'go',
      title: 'worker_pool_pattern.go',
      code: `package main

import (
    "fmt"
    "sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for j := range jobs {
        results <- j * 2 // Proses payload
    }
}

func main() {
    const numJobs = 10
    const numWorkers = 3
    jobs := make(chan int, numJobs)
    results := make(chan int, numJobs)
    var wg sync.WaitGroup

    for w := 1; w <= numWorkers; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }

    for j := 1; j <= numJobs; j++ {
        jobs <- j
    }
    close(jobs)
    wg.Wait()
    close(results)
}`,
    },
    nihongoNotes: [
      {
        kanji: '並行処理 (へいこうしょり)',
        romaji: 'Heikou shori',
        meaning: 'Concurrency Processing',
        workplaceUsage: '並行処理でスループットを3倍に改善しました (Kami meningkatkan throughput 3 kali lipat dengan concurrency).',
      },
      {
        kanji: '負荷分散 (ふかぶんさん)',
        romaji: 'Fuka bunsan',
        meaning: 'Load Balancing / Distribusi Beban',
        workplaceUsage: 'ワーカープールで負荷分散を行います (Melakukan distribusi beban dengan worker pool).',
      },
    ],
  },
}

export interface UnitGuidebookModalProps {
  isOpen: boolean
  onClose: () => void
  unitNumber: number
  unitTitle: string
}

export const UnitGuidebookModal = ({
  isOpen,
  onClose,
  unitNumber,
  unitTitle,
}: UnitGuidebookModalProps) => {
  const [activeTab, setActiveTab] = useState<'concepts' | 'code' | 'nihongo'>('concepts')
  const [isCopied, setIsCopied] = useState(false)

  if (!isOpen) return null

  const content = GUIDEBOOK_DATA[unitNumber] || GUIDEBOOK_DATA[1]

  const handleCopyCode = () => {
    triggerHaptic('success')
    navigator.clipboard.writeText(content.codeSnippet.code)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Card (Duolingo 3D Tactile) */}
      <div className="relative bg-white border-2 border-slate-200/90 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl z-10 animate-in zoom-in-95 duration-200">
        {/* ── 1. HEADER MODAL ── */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between border-b-2 border-blue-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-xs">
              <BookOpen weight="fill" className="w-5 h-5 text-amber-300" />
            </div>
            <div className="truncate">
              <span className="text-[11px] font-brand font-black text-blue-200 tracking-wider block">
                BUKU PANDUAN UNIT 0{unitNumber}
              </span>
              <h3 className="font-brand font-black text-base sm:text-lg text-white truncate">
                {unitTitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap')
              onClose()
            }}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:translate-y-0.5 border border-white/20 flex items-center justify-center text-white cursor-pointer transition-all shrink-0"
            title="Tutup Panduan"
          >
            <X weight="bold" className="w-5 h-5" />
          </button>
        </div>

        {/* ── 2. KODI QUICK INTRO ── */}
        <div className="px-5 sm:px-6 py-4 bg-blue-50/60 border-b border-slate-200/80 flex items-center gap-4">
          <img
            src={doodleProud}
            alt="Kodi Guidebook"
            className="w-12 h-12 object-contain shrink-0 drop-shadow-2xs"
          />
          <SpeechBubble direction="left" variant="light" className="py-1.5 px-3 max-w-xl text-xs font-semibold text-slate-800 shadow-2xs">
            {content.summary}
          </SpeechBubble>
        </div>

        {/* ── 3. TABS NAVIGASI ── */}
        <div className="flex items-center border-b border-slate-200 px-5 sm:px-6 pt-3 gap-2 bg-slate-50/60 select-none">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap')
              setActiveTab('concepts')
            }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-brand font-black border-b-2 transition-all cursor-pointer ${
              activeTab === 'concepts'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lightbulb weight="bold" className="w-4 h-4" />
            <span>Konsep Kunci</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap')
              setActiveTab('code')
            }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-brand font-black border-b-2 transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code weight="bold" className="w-4 h-4" />
            <span>Contekan Kode</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap')
              setActiveTab('nihongo')
            }}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-brand font-black border-b-2 transition-all cursor-pointer ${
              activeTab === 'nihongo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ChatCircleText weight="bold" className="w-4 h-4" />
            <span>Nihongo IT Tokyo</span>
          </button>
        </div>

        {/* ── 4. TAB CONTENTS (SCROLLABLE) ── */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 max-h-[50vh]">
          {/* TAB 1: KONSEP KUNCI */}
          {activeTab === 'concepts' && (
            <div className="space-y-3.5">
              {content.keyConcepts.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-blue-300 transition-colors space-y-1 shadow-2xs"
                >
                  <h4 className="font-brand font-black text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg bg-blue-100 text-blue-600 text-[10px] flex items-center justify-center font-mono">
                      0{idx + 1}
                    </span>
                    <span>{item.title}</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium pl-7">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: CONTEKAN KODE STANDAR TOKYO */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-500">
                  📄 {content.codeSnippet.title}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-brand font-black transition-all cursor-pointer shadow-2xs active:translate-y-0.5"
                >
                  {isCopied ? (
                    <>
                      <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy weight="bold" className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-2xl bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-x-auto border-2 border-slate-800 shadow-md">
                <pre>
                  <code>{content.codeSnippet.code}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: NIHONGO IT & BUDAYA KANTOR */}
          {activeTab === 'nihongo' && (
            <div className="space-y-3">
              {content.nihongoNotes.map((vocab, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-gradient-to-r from-red-50/50 via-white to-amber-50/30 border border-red-200/80 space-y-2 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-japanese font-black text-base text-red-950 block">
                        {vocab.kanji}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        {vocab.romaji}
                      </span>
                    </div>
                    <span className="text-xs font-brand font-black text-red-700 bg-red-100/80 px-2.5 py-0.5 rounded-lg border border-red-200">
                      {vocab.meaning}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-red-100 text-xs text-slate-700 font-medium">
                    <span className="text-slate-400 font-bold block text-[10px] mb-0.5">
                      PENGGUNAAN DI KANTOR TOKYO:
                    </span>
                    &quot;{vocab.workplaceUsage}&quot;
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 5. FOOTER ACTION ── */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Sparkle weight="fill" className="w-4 h-4 text-amber-500" />
            <span>Pelajari sebelum mengerjakan ujian koding</span>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap')
              onClose()
            }}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 active:translate-y-0.5 text-white font-brand font-black text-xs rounded-xl shadow-[0_3px_0_0_#1D4ED8] transition-all cursor-pointer"
          >
            SAYA MENGERTI 👍
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
