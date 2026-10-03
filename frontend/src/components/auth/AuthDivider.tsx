export const AuthDivider = ({ text = 'OR' }: { text?: string }) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-slate-200" />
    </div>
    <div className="relative flex justify-center text-xs">
      <span className="bg-white px-3 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
        {text}
      </span>
    </div>
  </div>
)
