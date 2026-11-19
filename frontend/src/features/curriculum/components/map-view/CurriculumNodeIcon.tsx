/* eslint-disable react-refresh/only-export-components */
import type { FC, ReactNode } from 'react'
import {
  AirplaneTilt,
  BookOpen,
  BowlFood,
  Briefcase,
  Buildings,
  CalendarBlank,
  ChatCircleDots,
  ChatsCircle,
  Check,
  Clock,
  ClockCounterClockwise,
  CloudSun,
  Coffee,
  Compass,
  Cube,
  Gift,
  GraduationCap,
  Handshake,
  HandWaving,
  Hash,
  Heart,
  HourglassMedium,
  IdentificationCard,
  Laptop,
  Lightbulb,
  LinkSimple,
  ListChecks,
  MapPin,
  MapTrifold,
  Medal,
  MusicNote,
  Play,
  PlayCircle,
  Repeat,
  Scales,
  ShieldCheck,
  ShoppingBag,
  Signpost,
  Sparkle,
  Sun,
  Target,
  TextAa,
  ThumbsUp,
  Train,
  Translate,
  Trophy,
  UsersThree,
} from '@phosphor-icons/react'
import type { PathMapNode, MapNodeCategory } from '@/features/curriculum/types/curriculum'
import { MAP_MODAL_TOKENS } from '@/features/curriculum/tokens/curriculumTokens'

/**
 * Maps a backend lesson `icon_name` slug (SSOT) to a solid-rounded Phosphor icon.
 */
export function renderLessonThematicIcon(iconName: string | undefined, iconClass: string): ReactNode {
  switch (iconName) {
    case 'compass':
      return <Compass weight="fill" className={iconClass} />
    case 'translate':
      return <Translate weight="fill" className={iconClass} />
    case 'hand-waving':
      return <HandWaving weight="fill" className={iconClass} />
    case 'text-aa':
      return <TextAa weight="fill" className={iconClass} />
    case 'hash':
      return <Hash weight="bold" className={iconClass} />
    case 'identification-card':
      return <IdentificationCard weight="fill" className={iconClass} />
    case 'briefcase':
      return <Briefcase weight="fill" className={iconClass} />
    case 'cube':
      return <Cube weight="fill" className={iconClass} />
    case 'map-pin':
      return <MapPin weight="fill" className={iconClass} />
    case 'users-three':
      return <UsersThree weight="fill" className={iconClass} />
    case 'bowl-food':
      return <BowlFood weight="fill" className={iconClass} />
    case 'coffee':
      return <Coffee weight="fill" className={iconClass} />
    case 'music-note':
      return <MusicNote weight="fill" className={iconClass} />
    case 'chat-circle-dots':
      return <ChatCircleDots weight="fill" className={iconClass} />
    case 'repeat':
      return <Repeat weight="bold" className={iconClass} />
    case 'clock':
      return <Clock weight="fill" className={iconClass} />
    case 'train':
      return <Train weight="fill" className={iconClass} />
    case 'calendar-blank':
      return <CalendarBlank weight="fill" className={iconClass} />
    case 'hourglass-medium':
      return <HourglassMedium weight="fill" className={iconClass} />
    case 'map-trifold':
      return <MapTrifold weight="fill" className={iconClass} />
    case 'list-checks':
      return <ListChecks weight="bold" className={iconClass} />
    case 'buildings':
      return <Buildings weight="fill" className={iconClass} />
    case 'laptop':
      return <Laptop weight="fill" className={iconClass} />
    case 'signpost':
      return <Signpost weight="fill" className={iconClass} />
    case 'sparkle':
      return <Sparkle weight="fill" className={iconClass} />
    case 'thumbs-up':
      return <ThumbsUp weight="fill" className={iconClass} />
    case 'cloud-sun':
      return <CloudSun weight="fill" className={iconClass} />
    case 'scales':
      return <Scales weight="fill" className={iconClass} />
    case 'shopping-bag':
      return <ShoppingBag weight="fill" className={iconClass} />
    case 'sun':
      return <Sun weight="fill" className={iconClass} />
    case 'handshake':
      return <Handshake weight="fill" className={iconClass} />
    case 'play-circle':
      return <PlayCircle weight="fill" className={iconClass} />
    case 'shield-check':
      return <ShieldCheck weight="fill" className={iconClass} />
    case 'link-simple':
      return <LinkSimple weight="bold" className={iconClass} />
    case 'clock-counter-clockwise':
      return <ClockCounterClockwise weight="bold" className={iconClass} />
    case 'heart':
      return <Heart weight="fill" className={iconClass} />
    case 'target':
      return <Target weight="fill" className={iconClass} />
    case 'airplane-tilt':
      return <AirplaneTilt weight="fill" className={iconClass} />
    case 'medal':
      return <Medal weight="fill" className={iconClass} />
    case 'chats-circle':
      return <ChatsCircle weight="fill" className={iconClass} />
    case 'gift':
      return <Gift weight="fill" className={iconClass} />
    case 'lightbulb':
      return <Lightbulb weight="fill" className={iconClass} />
    case 'graduation-cap':
      return <GraduationCap weight="fill" className={iconClass} />
    case 'trophy':
      return <Trophy weight="fill" className={iconClass} />
    case 'book-open':
    default:
      return <BookOpen weight="fill" className={iconClass} />
  }
}

/**
 * Renders the solid-rounded thematic symbol inside each 3D map node disc.
 */
export const renderNodeSymbol = (node: PathMapNode, iconClass: string): ReactNode => {
  if (node.iconName) {
    return renderLessonThematicIcon(node.iconName, iconClass)
  }
  if (node.category === 'language') {
    return <Translate weight="fill" className={iconClass} />
  }
  return <BookOpen weight="fill" className={iconClass} />
}

/**
 * Renders the action icon inside the active popover CTA button.
 */
export const renderActionIcon = (category?: MapNodeCategory): ReactNode => {
  if (category === 'language') {
    return <Translate weight="bold" className="w-3.5 h-3.5" />
  }
  return <Play weight="fill" className="w-3.5 h-3.5" />
}

export interface CurriculumModalNodeIconProps {
  node: PathMapNode
  modalIconBg: string
}

/**
 * Renders the leading hero icon inside CurriculumNodeDetailModal.
 */
export const CurriculumModalNodeIcon: FC<CurriculumModalNodeIconProps> = ({
  node,
  modalIconBg,
}) => {
  if (node.isChest) {
    return (
      <div className={MAP_MODAL_TOKENS.milestones.chest}>
        <Gift weight="fill" className="w-6 h-6" />
      </div>
    )
  }

  if (node.isTrophy) {
    return (
      <div className={MAP_MODAL_TOKENS.milestones.trophy}>
        <Trophy weight="fill" className="w-6 h-6" />
      </div>
    )
  }

  return (
    <div className={`${MAP_MODAL_TOKENS.iconContainerBase} ${modalIconBg}`}>
      {node.status === 'completed' ? (
        <Check weight="bold" className="w-6 h-6 text-emerald-600" />
      ) : node.iconName ? (
        renderLessonThematicIcon(node.iconName, 'w-6 h-6')
      ) : node.category === 'language' ? (
        <Translate weight="fill" className="w-6 h-6" />
      ) : (
        <BookOpen weight="fill" className="w-6 h-6" />
      )}
    </div>
  )
}
