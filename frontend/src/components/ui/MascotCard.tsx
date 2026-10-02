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
}

const poseImages: Record<KodiPose, string> = {
  welcome: doodleWelcome,
  coding: doodleCoding,
  celebrate: doodleCelebrate,
}

export const MascotCard = ({
  message = 'I am ready to help you code! Let’s prepare for Japan & Germany tech roles! 🚀',
  streak = 1,
  xp = 0,
  name = 'Kodi',
  pose = 'welcome',
}: MascotCardProps) => {
  const currentImg = poseImages[pose] || doodleWelcome

  return (
    <div className="p-6 rounded-3xl relative overflow-hidden flex flex-col items-center text-center bg-[#131622] border-2 border-slate-700/80 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
      {/* Background Soft Glow */}
      <div className="absolute -top-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Manga / Doodle Speech Bubble */}
      <div className="relative mb-3 max-w-sm px-4 py-2.5 rounded-2xl bg-white text-slate-950 border-2 border-slate-950 shadow-[3px_3px_0px_0px_#0f172a] font-semibold text-xs leading-relaxed animate-fade-in">
        <span>{message}</span>
        {/* Tail Bubble */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-slate-950 rotate-45" />
      </div>

      {/* Kodi 2D Doodle Mascot */}
      <div className="relative w-44 h-44 flex items-center justify-center my-2">
        <img
          src={currentImg}
          alt={`Kodi ${pose}`}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-200 select-none drop-shadow-md"
        />
      </div>

      <div className="mt-1">
        <h3 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
          {name} <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400 text-slate-950 font-bold border border-slate-900 shadow-[1px_1px_0px_0px_#000]">AI メンター</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">Your loyal mentor on CodeAbroad</p>
      </div>

      {/* Mini Stats Pills with Doodle Icons */}
      <div className="grid grid-cols-2 gap-3 w-full mt-5">
        <div className="p-3 rounded-2xl bg-[#1A1D2E] border-2 border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <DoodleFire className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-medium block">Streak</span>
            <span className="text-sm font-bold text-white">{streak} Days</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-[#1A1D2E] border-2 border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
            <DoodleStar className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[10px] text-slate-400 font-medium block">Total XP</span>
            <span className="text-sm font-bold text-white">{xp} XP</span>
          </div>
        </div>
      </div>
    </div>
  )
}
