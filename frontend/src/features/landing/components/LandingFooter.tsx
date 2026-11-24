import { Link } from 'react-router-dom'
import { ArrowUp } from '@phosphor-icons/react'
import { Logo } from '@/shared/components/ui/Logo'

interface FooterLinkItem {
  label: string
  to: string
  isHash?: boolean
}

interface FooterColumn {
  title: string
  links: readonly FooterLinkItem[]
}

const FOOTER_COLUMNS: readonly FooterColumn[] = [
  {
    title: 'Modul Belajar',
    links: [
      { label: 'Peta Kurikulum', to: '/curriculum' },
      { label: 'Flashcard', to: '/flashcards' },
      { label: 'Panduan Grammar', to: '/grammar' },
      { label: 'Papan Aksara', to: '/kana/hiragana' },
    ],
  },
  {
    title: 'Jelajahi',
    links: [
      { label: 'Pilihan Bahasa', to: '#bahasa', isHash: true },
      { label: 'Fitur Utama', to: '#fitur', isHash: true },
      { label: 'Coba Live', to: '#coba-kilat', isHash: true },
      { label: 'Metode Belajar', to: '#metode', isHash: true },
    ],
  },
  {
    title: 'Akun & Akses',
    links: [
      { label: 'Masuk', to: '/login' },
      { label: 'Daftar Gratis', to: '/register' },
    ],
  },
]

export const LandingFooter = () => {
  return (
    <footer className="bg-white border-t border-black/10 overflow-x-clip">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-10 pb-8 sm:pt-14 sm:pb-10 space-y-8 sm:space-y-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
            <Logo size="sm" variant="blue" linkTo="/" />
            <p className="text-sm text-[#475569] leading-relaxed max-w-sm">
              Misi Merantalk adalah membantu pembelajar Indonesia menguasai bahasa asing secara
              bertahap untuk studi, sertifikasi, dan karier internasional.
            </p>
            <span className="inline-flex flex-wrap items-center gap-x-1.5 rounded-full border border-slate-200 bg-[#F8FAFC] px-3.5 py-1.5 text-xs font-semibold text-[#475569] max-w-full">
              <span>Tanpa Kartu Kredit</span>
              <span aria-hidden="true">•</span>
              <span>Unit 1 Terbuka Gratis</span>
            </span>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {FOOTER_COLUMNS.map((column, index) => {
              const isThirdColumn = index === 2
              return (
                <div
                  key={column.title}
                  className={
                    isThirdColumn
                      ? 'col-span-2 sm:col-span-1 pt-2 border-t border-slate-100 sm:border-t-0 sm:pt-0'
                      : undefined
                  }
                >
                  <h3 className="text-xs font-brand font-black uppercase tracking-wider text-[#1E293B] mb-3 sm:mb-3.5">
                    {column.title}
                  </h3>
                  <ul
                    className={
                      isThirdColumn
                        ? 'flex flex-wrap gap-x-6 gap-y-2.5 sm:block sm:space-y-2.5'
                        : 'space-y-2.5'
                    }
                  >
                    {column.links.map((item) => (
                      <li key={item.to}>
                        {item.isHash ? (
                          <a
                            href={item.to}
                            className="landing-link-sweep inline-block text-sm text-[#475569] hover:text-[#1E293B] font-medium transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            to={item.to}
                            className="landing-link-sweep inline-block text-sm text-[#475569] hover:text-[#1E293B] font-medium transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        <div className="border-t border-slate-200/80 pt-5 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-[#64748B] text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Merantalk · Belajar bahasa lintas jalur sertifikasi global
          </p>
          <a
            href="#hero-section"
            className="landing-link-sweep font-semibold text-[#1E293B] inline-flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
          >
            <span>Kembali ke atas</span>
            <ArrowUp weight="bold" className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
