export interface AuthDividerProps {
  text?: string
  className?: string
}

export const AuthDivider = ({ text = 'atau', className = 'my-4' }: AuthDividerProps) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-slate-200" />
    </div>
    <div className="relative flex justify-center text-xs">
      <span className="bg-[#FAFAF9] md:bg-white lg:bg-[#FAFAF9] px-3 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
        {text}
      </span>
    </div>
  </div>
)
