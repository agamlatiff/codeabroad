import { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import type { FC } from 'react'
import {
  BookOpen,
  Sparkle,
  FileText,
  Copy,
  Check,
  X,
} from '@phosphor-icons/react'
import { Button3D } from '../../ui/Button3D'
import { triggerHaptic } from '../../../utils/haptics'

export interface GuidebookActiveUnit {
  unitTitle: string
  unitNumber: number
  tag: string
}

export interface RoadmapGuidebookModalProps {
  activeGuidebook: GuidebookActiveUnit | null
  trackSlug?: string
  onClose: () => void
}

export const RoadmapGuidebookModal: FC<RoadmapGuidebookModalProps> = ({
  activeGuidebook,
  trackSlug = 'golang',
  onClose,
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState(false)

  const guidebookContent = useMemo(() => {
    if (!activeGuidebook) return null

    if (trackSlug === 'frontend') {
      return {
        concept:
          'Arsitektur komponen React modern menggunakan TypeScript tipe ketat, composable custom hooks, dan render pipeline yang optimal.',
        codeSnippet: `// TypeScript Typed Component & Custom Hook
export interface DevProps {
  name: string
  level: 'junior' | 'senior'
}

export const useTokyoDev = (props: DevProps) => {
  const [isReady, setIsReady] = useState(true)
  return { isReady, role: \`Tokyo \${props.level} \${props.name}\` }
}`,
        tokyoTip:
          'Tim engineering Tokyo sangat mengutamakan zero type errors (strict mode: true) dan semantic accessibility di komponen frontend.',
      }
    }

    if (trackSlug === 'devops') {
      return {
        concept:
          'Infrastruktur cloud modern, containerization Docker multi-stage build, daemon systemd, dan deployment otomatis via CI/CD pipelines.',
        codeSnippet: `# Multi-stage Dockerfile Standar Produksi
FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o /api ./cmd/main.go

FROM scratch
COPY --from=builder /api /api
ENTRYPOINT ["/api"]`,
        tokyoTip:
          'Di tim infra Tokyo, ukuran container sekecil mungkin (distroless/scratch) dan log JSON terstruktur (datadog/cloudwatch) adalah kewajiban.',
      }
    }

    // Default: Golang
    if (activeGuidebook.unitNumber === 1) {
      return {
        concept:
          'Dasar alokasi memori Go (Heap vs Stack), pointer dereferencing, struct memory alignment, dan penanganan error eksplisit if err != nil.',
        codeSnippet: `// Pointer & Struct Initialization
type TokyoEngineer struct {
    Name  string \`json:"name"\`
    Stack string \`json:"stack"\`
}

func NewEngineer(name string) *TokyoEngineer {
    // Alokasi pointer aman di Heap melalui escape analysis
    return &TokyoEngineer{Name: name, Stack: "Golang"}
}`,
        tokyoTip:
          'Selalu periksa err segera setelah fungsi dieksekusi. Jangan abaikan error dengan blank identifier (_) pada kode produksi Tokyo.',
      }
    }

    if (activeGuidebook.unitNumber === 2) {
      return {
        concept:
          'Gin routing engine, JWT middleware authentication flow, REST envelope standard, dan database pgxpool connection management.',
        codeSnippet: `// Custom Auth Middleware di Gin
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        if token == "" {
            c.AbortWithStatusJSON(401, gin.H{"error": "Unauthorized"})
            return
        }
        c.Next()
    }
}`,
        tokyoTip:
          'Format respon JSON tim backend Tokyo wajib konsisten: { "success": true, "data": ... } dengan status HTTP tepat (200, 201, 401, 404).',
      }
    }

    return {
      concept:
        'Concurrency Go dengan goroutines, channels berpenyangga (buffered), worker pool pattern, serta sinkronisasi menggunakan sync.WaitGroup dan context cancellation.',
      codeSnippet: `// Worker Pool Pattern
func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for j := range jobs {
        results <- j * 2
    }
}`,
      tokyoTip:
        'Hindari goroutine leak dengan selalu menyertakan context.WithTimeout pada operasi database dan external HTTP request.',
    }
  }, [activeGuidebook, trackSlug])

  const handleCopyCode = () => {
    if (!guidebookContent?.codeSnippet) return
    triggerHaptic('tap')
    void navigator.clipboard.writeText(guidebookContent.codeSnippet)
    setCopiedSnippet(true)
    setTimeout(() => setCopiedSnippet(false), 2000)
  }

  if (!activeGuidebook || !guidebookContent || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-pop relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer transition-colors"
        >
          <X weight="bold" className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-[0_3px_0_0_#1E3A8A]">
            <BookOpen weight="bold" className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-brand font-black uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              {activeGuidebook.tag} • BUKU PANDUAN
            </span>
            <h3 className="font-brand font-black text-lg text-slate-900 leading-tight mt-1">
              {activeGuidebook.unitTitle}
            </h3>
          </div>
        </div>

        {/* Konsep Inti */}
        <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-1">
          <h4 className="font-brand font-black text-xs text-blue-950 flex items-center gap-1.5">
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-blue-600" />
            <span>Konsep Kunci Modul</span>
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {guidebookContent.concept}
          </p>
        </div>

        {/* Cheatsheet Sintaks */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-brand font-black text-slate-800 flex items-center gap-1.5">
              <FileText weight="bold" className="w-3.5 h-3.5 text-slate-500" />
              <span>Contekan Sintaks Standar</span>
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-brand font-black px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              {copiedSnippet ? (
                <>
                  <Check weight="bold" className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy weight="bold" className="w-3 h-3 text-slate-500" />
                  <span>Salin Kode</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3.5 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-2xl overflow-x-auto shadow-inner leading-relaxed">
            <code>{guidebookContent.codeSnippet}</code>
          </pre>
        </div>

        {/* Tokyo Engineering Tips */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1 text-xs">
          <span className="font-brand font-black text-amber-900 flex items-center gap-1.5 text-[11px]">
            <span>🇯🇵 Standar Industri Tokyo</span>
          </span>
          <p className="text-slate-700 font-medium leading-relaxed">
            {guidebookContent.tokyoTip}
          </p>
        </div>

        <Button3D
          variant="blue"
          size="md"
          fullWidth
          onClick={onClose}
          className="py-2.5 font-black text-xs shadow-[0_3px_0_0_#1D4ED8]"
        >
          MENGERTI, KEMBALI KE PETA BELAJAR
        </Button3D>
      </div>
    </div>,
    document.body
  )
}
