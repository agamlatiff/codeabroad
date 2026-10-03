import doodleWelcome from '../../assets/kodi/doodle-welcome.png'
import doodleCoding from '../../assets/kodi/doodle-coding.png'
import doodleCelebrate from '../../assets/kodi/doodle-celebrate.png'
import { DoodleFire, DoodleStar } from './DoodleIcons'

export type KodiPose = 'welcome' | 'coding' | 'celebrate'

interface MascotCardProps {
  message?: string
  streak?: number
  xp?: number
  name?: string
  pose?: KodiPose
  variant?: 'mint' | 'sky' | 'white'
}

const poseImages: Record<KodiPose, string> = {
  welcome: doodleWelcome,
  coding: doodleCoding,
  celebrate: doodleCelebrate,
}

export const MascotCard = ({
  message = 'Ready to conquer tech interviews for Japan & Germany? Let’s do it! 🚀',
  streak = 1,
  xp = 0,
  name = 'Kodi',
  pose = 'welcome',
  variant = 'mint',
}: MascotCardProps) => {
  const currentImg = poseImages[pose] || doodleWelcome

  const bgStyles = {
    mint: 'bg-[#EDF7F2] border-2 border-[#D1EBDD]',
    sky: 'bg-[#F0F7FF] border-2 border-[#D6E8FC]',
    white: 'bg-white border-2 border-slate-200 shadow-sm',
  }[variant]

  return (
    <div className={`p-6 rounded-3xl relative overflow-hidden flex flex-col items-center text-center transition-all ${bgStyles}`}>
      {/* Speech Bubble */}
      <div className="relative mb-3 max-w-sm px-4 py-2.5 rounded-2xl bg-white text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0F172A] font-bold text-xs leading-relaxed animate-fade-in z-10">
        <span>{message}</span>
        {/* Tail Bubble */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-slate-900 rotate-45" />
      </div>

      {/* Kodi 2D Doodle Mascot */}
      <div className="relative w-44 h-44 flex items-center justify-center my-2">
        <img
          src={currentImg}
          alt={`Kodi ${pose}`}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-200 select-none drop-shadow-sm"
        />
      </div>

      <div className="mt-1">
        <h3 className="text-base font-black text-slate-900 flex items-center justify-center gap-1.5">
          {name} <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-white font-bold">AI メンター</span>
        </h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Your loyal mentor on CodeAbroad</p>
      </div>

      {/* Mini Stats Pills */}
      <div className="grid grid-cols-2 gap-3 w-full mt-5">
        <div className="p-3 rounded-2xl bg-white border-2 border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
            <DoodleFire className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Streak</span>
            <span className="text-sm font-black text-slate-900">{streak} Days 🔥</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border-2 border-slate-200/80 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-50 border border-yellow-200 flex items-center justify-center shrink-0">
            <DoodleStar className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total XP</span>
            <span className="text-sm font-black text-slate-900">{xp} XP ★</span>
          </div>
        </div>
      </div>
    </div>
  )
}
