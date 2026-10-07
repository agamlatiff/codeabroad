import { useEffect, useRef, useState } from 'react'

export interface FlightRoadmapGraphicProps {
  countryCode?: string
  className?: string
  isLanding?: boolean
}

export const FlightRoadmapGraphic = ({
  countryCode = 'JP',
  className = 'w-full h-auto',
  isLanding = false,
}: FlightRoadmapGraphicProps) => {
  const isJapan = countryCode.toUpperCase() === 'JP'
  const isGermany = countryCode.toUpperCase() === 'DE'
  const destAirport = isJapan ? 'NRT' : isGermany ? 'BER' : 'SIN'
  const destCity = isJapan ? 'Tokyo' : isGermany ? 'Berlin' : 'Singapore'
  const destCountry = isJapan ? 'Japan' : isGermany ? 'Germany' : 'Singapore'

  const landingCoords = isJapan
    ? { x: 705, y: 145 }
    : isGermany
    ? { x: 685, y: 145 }
    : { x: 680, y: 140 }

  const flightPathD = `M 95 160 C 180 50, 240 160, 360 85 C 460 20, 580 55, ${landingCoords.x} ${landingCoords.y}`

  const pathRef = useRef<SVGPathElement | null>(null)
  const planeRef = useRef<SVGGElement | null>(null)
  const activeTrailRef = useRef<SVGPathElement | null>(null)
  const [hasLanded, setHasLanded] = useState(false)
  // Track last transform string so React reconciliation does not snap the plane back
  const lastTransformRef = useRef<string>('translate(95, 160) rotate(-52)')

  // Seamless Path-Following Flight Engine
  useEffect(() => {
    const path = pathRef.current
    const plane = planeRef.current
    if (!path || !plane) return

    const totalLength = path.getTotalLength()

    if (activeTrailRef.current) {
      activeTrailRef.current.style.strokeDasharray = `${totalLength}`
    }

    const setPlaneAtDistance = (dist: number) => {
      const p = path.getPointAtLength(dist)
      // Centered difference avoids tangent collapse and flat snapping at dist = 0 or dist = totalLength
      const delta = 1.5
      const pBefore = path.getPointAtLength(Math.max(0, dist - delta))
      const pAfter = path.getPointAtLength(Math.min(totalLength, dist + delta))
      const angle = Math.atan2(pAfter.y - pBefore.y, pAfter.x - pBefore.x) * (180 / Math.PI)
      
      const transformStr = `translate(${p.x}, ${p.y}) rotate(${angle})`
      lastTransformRef.current = transformStr
      plane.setAttribute('transform', transformStr)

      if (activeTrailRef.current) {
        activeTrailRef.current.style.strokeDashoffset = `${totalLength - dist}`
      }
    }

    // While not landing: plane remains 100% grounded at Jakarta runway (dist = 0)
    if (!isLanding) {
      setHasLanded(false)
      setPlaneAtDistance(0)
      return
    }

    // While isLanding is active: cinematic 1.45s smooth S-curve flight with easeInOutCubic
    let animId: number
    const duration = 1450
    const startTime = performance.now()

    const animateFlight = (now: number) => {
      const elapsed = now - startTime
      const rawProgress = Math.min(elapsed / duration, 1)

      // Cinematic easeInOutCubic easing
      const ease =
        rawProgress < 0.5
          ? 4 * rawProgress * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2

      const currentDist = ease * totalLength
      setPlaneAtDistance(currentDist)

      if (rawProgress < 1) {
        animId = requestAnimationFrame(animateFlight)
      } else {
        setHasLanded(true)
      }
    }

    animId = requestAnimationFrame(animateFlight)
    return () => cancelAnimationFrame(animId)
  }, [isLanding])

  return (
    <div className="w-full flex items-center justify-center select-none overflow-hidden py-1">
      <svg viewBox="0 0 820 230" className={className} fill="none">
        <defs>
          {/* Sky Atmospheric Gradient */}
          <linearGradient id="scenicSkyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="0.7" />
            <stop offset="35%" stopColor="#F8FAFC" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#EEF2FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FAF5FF" stopOpacity="0.75" />
          </linearGradient>

          {/* Flight Path Active Ribbon */}
          <linearGradient id="scenicFlightGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="45%" stopColor="#3B82F6" />
            <stop offset="80%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Monas Golden Flame Radial */}
          <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="monasGoldFlame" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="45%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#FEF08A" />
          </linearGradient>

          {/* Wisma 46 Blue Glass Tower */}
          <linearGradient id="wismaGlassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0369A1" />
          </linearGradient>

          {/* Mt Fuji Twilight Gradient */}
          <linearGradient id="fujiTwilightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#DBEAFE" />
            <stop offset="60%" stopColor="#BFDBFE" />
            <stop offset="100%" stopColor="#F1F5F9" />
          </linearGradient>

          {/* Airplane Jet Contrail */}
          <linearGradient id="contrailGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.5" />
          </linearGradient>

          {/* Airplane Elevation Drop Shadow */}
          <filter id="planeShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="4" floodColor="#0F172A" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* ── SKY ATMOSPHERE BACKDROP ── */}
        <rect x="15" y="15" width="790" height="180" rx="20" fill="url(#scenicSkyGrad)" />

        {/* ── BASELINE HORIZON LINE ── */}
        <line x1="25" y1="195" x2="795" y2="195" stroke="#E2E8F0" strokeWidth="1.5" />

        {/* ══════════════════════════════════════════════════════════════
            SISI KIRI: JAKARTA (WARM GOLDEN SUNSET & SUDIRMAN SKYLINE)
            ══════════════════════════════════════════════════════════════ */}
        <g id="jakarta-landmarks">
          {/* Warm Jakarta Sunset Ambient Halo */}
          <circle cx="85" cy="115" r="55" fill="url(#flameGlow)" opacity="0.35" />

          {/* Sudirman High-Rise Tower 1 (Latar Kiri) */}
          <rect x="25" y="130" width="24" height="65" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="31" y1="140" x2="43" y2="140" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="31" y1="152" x2="43" y2="152" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="31" y1="164" x2="43" y2="164" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="31" y1="176" x2="43" y2="176" stroke="#E2E8F0" strokeWidth="1" />

          {/* Sudirman Modern High-Rise Tower 2 */}
          <rect x="42" y="112" width="22" height="83" rx="2" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
          <line x1="48" y1="124" x2="58" y2="124" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="48" y1="138" x2="58" y2="138" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="48" y1="152" x2="58" y2="152" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="48" y1="166" x2="58" y2="166" stroke="#CBD5E1" strokeWidth="1" />
          <line x1="48" y1="180" x2="58" y2="180" stroke="#CBD5E1" strokeWidth="1" />

          {/* Wisma 46 (BNI City) - Ikon Sailboat Sudirman */}
          <path d="M 125 195 V 98 C 125 98, 140 82, 158 78 V 195 Z" fill="url(#wismaGlassGrad)" opacity="0.85" />
          <path d="M 125 195 V 98 C 125 98, 140 82, 158 78 V 195 Z" fill="none" stroke="#0284C7" strokeWidth="1.2" />
          {/* Glass Louver Lines */}
          <line x1="132" y1="110" x2="150" y2="106" stroke="#BAE6FD" strokeWidth="1" opacity="0.8" />
          <line x1="132" y1="125" x2="152" y2="121" stroke="#BAE6FD" strokeWidth="1" opacity="0.8" />
          <line x1="132" y1="140" x2="152" y2="136" stroke="#BAE6FD" strokeWidth="1" opacity="0.8" />
          <line x1="132" y1="155" x2="152" y2="151" stroke="#BAE6FD" strokeWidth="1" opacity="0.8" />
          <line x1="132" y1="170" x2="152" y2="166" stroke="#BAE6FD" strokeWidth="1" opacity="0.8" />

          {/* MONUMEN NASIONAL (MONAS) */}
          {/* Base Plinth */}
          <rect x="64" y="185" width="42" height="10" rx="1.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          {/* Cawan Megah Monas */}
          <path d="M 58 185 L 70 162 H 100 L 112 185 Z" fill="#F8FAFC" stroke="#475569" strokeWidth="1.5" />
          <rect x="72" y="160" width="26" height="3" fill="#CBD5E1" />
          {/* Obelisk Tubuh Menara */}
          <path d="M 80 160 L 82.5 75 H 87.5 L 90 160 Z" fill="#FFFFFF" stroke="#475569" strokeWidth="1.5" />
          <line x1="85" y1="75" x2="85" y2="160" stroke="#94A3B8" strokeWidth="1" />
          {/* Pelataran Puncak (Viewing Platform) */}
          <rect x="80" y="71" width="10" height="4" rx="1" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
          {/* Lidah Api Emas Kemerdekaan */}
          <path d="M 83 71 C 79 58, 83 50, 85 40 C 87 49, 91 58, 87 71 Z" fill="url(#monasGoldFlame)" stroke="#D97706" strokeWidth="1" />

          {/* Jakarta Departure Beacon Node */}
          <circle cx="95" cy="160" r="5" fill="#4F46E5" />
          <circle cx="95" cy="160" r="10" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.75" />

          {/* Typography Label */}
          <text x="95" y="210" fill="#0F172A" fontSize="12" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">
            CGK
          </text>
          <text x="95" y="222" fill="#64748B" fontSize="9.5" fontWeight="600" textAnchor="middle">
            Jakarta, ID
          </text>
        </g>

        {/* ══════════════════════════════════════════════════════════════
            SISI KANAN: DESTINASI (TOKYO / BERLIN / SINGAPORE)
            ══════════════════════════════════════════════════════════════ */}
        <g id="destination-landmarks">
          {isJapan && (
            <>
              {/* GUNUNG FUJI - Twilight Japanese Silhouette */}
              <path
                d="M 590 195 C 640 192, 675 82, 690 72 C 705 82, 740 192, 790 195 Z"
                fill="url(#fujiTwilightGrad)"
                stroke="#A5B4FC"
                strokeWidth="1.2"
              />
              {/* Tudung Salju Ikonik Fuji (Snowcap Summit) */}
              <path
                d="M 672 98 C 680 84, 686 76, 690 76 C 694 76, 700 84, 708 98 L 700 108 L 690 102 L 680 108 Z"
                fill="#FFFFFF"
                stroke="#818CF8"
                strokeWidth="1.2"
              />

              {/* Shinjuku Modern Glass Towers */}
              <rect x="735" y="125" width="26" height="70" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="741" y1="138" x2="755" y2="138" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="741" y1="152" x2="755" y2="152" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="741" y1="166" x2="755" y2="166" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="741" y1="180" x2="755" y2="180" stroke="#CBD5E1" strokeWidth="1" />

              {/* TOKYO TOWER CRIMSON AUTENTIK (Red Lattice & Observation Decks) */}
              {/* Kaki Melengkung Parabolik */}
              <path d="M 625 195 C 631 170, 638 138, 641 112 H 651 C 654 138, 661 170, 667 195" fill="none" stroke="#EF4444" strokeWidth="2.2" />
              <path d="M 631 195 Q 646 168 661 195" stroke="#EF4444" strokeWidth="1.5" fill="none" />
              {/* Struktur Kisi-Kisi Diagonal */}
              <line x1="629" y1="175" x2="663" y2="175" stroke="#EF4444" strokeWidth="1.2" />
              <line x1="629" y1="175" x2="659" y2="152" stroke="#EF4444" strokeWidth="1" />
              <line x1="663" y1="175" x2="633" y2="152" stroke="#EF4444" strokeWidth="1" />
              <line x1="634" y1="152" x2="658" y2="152" stroke="#FFFFFF" strokeWidth="2" />
              <line x1="636" y1="132" x2="656" y2="132" stroke="#EF4444" strokeWidth="1.2" />
              {/* Main Observatory (Dek Observasi Bawah) */}
              <rect x="637" y="108" width="18" height="8" rx="1.5" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
              <line x1="639" y1="112" x2="653" y2="112" stroke="#F8FAFC" strokeWidth="1" />
              {/* Batang Menara Atas & Band Putih */}
              <path d="M 642 108 L 644 64 H 648 L 650 108 Z" fill="#EF4444" />
              <rect x="643.5" y="78" width="5" height="12" fill="#FFFFFF" />
              {/* Top Deck Pod */}
              <rect x="643.5" y="60" width="5" height="4" rx="1" fill="#1E293B" />
              {/* Antena Spire & Red Beacon Light */}
              <line x1="646" y1="60" x2="646" y2="38" stroke="#EF4444" strokeWidth="1.8" />
              <circle cx="646" cy="38" r="2.5" fill="#EF4444" />
              <circle cx="646" cy="38" r="6" stroke="#EF4444" strokeWidth="1" opacity="0.4" />
            </>
          )}

          {isGermany && (
            <>
              {/* Berlin TV Tower & Brandenburg Gate */}
              <line x1="620" y1="195" x2="620" y2="45" stroke="#94A3B8" strokeWidth="1.8" />
              <circle cx="620" cy="85" r="9" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
              <rect x="650" y="155" width="75" height="40" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="662" y1="160" x2="662" y2="195" stroke="#94A3B8" strokeWidth="2" />
              <line x1="675" y1="160" x2="675" y2="195" stroke="#94A3B8" strokeWidth="2" />
              <line x1="688" y1="160" x2="688" y2="195" stroke="#94A3B8" strokeWidth="2" />
              <line x1="701" y1="160" x2="701" y2="195" stroke="#94A3B8" strokeWidth="2" />
              <line x1="714" y1="160" x2="714" y2="195" stroke="#94A3B8" strokeWidth="2" />
            </>
          )}

          {!isJapan && !isGermany && (
            <>
              {/* Singapore Marina Bay Sands */}
              <rect x="640" y="130" width="16" height="65" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="664" y="125" width="16" height="70" rx="2" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" />
              <rect x="688" y="130" width="16" height="65" rx="2" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
              <path d="M 632 125 C 660 115, 700 115, 725 125 Z" fill="#1E293B" />
            </>
          )}

          {/* Destination Touchdown Beacon Node */}
          <circle cx={landingCoords.x} cy={landingCoords.y} r="5" fill="#0F172A" />
          <circle
            cx={landingCoords.x}
            cy={landingCoords.y}
            r={hasLanded ? 18 : 10}
            stroke="#4F46E5"
            strokeWidth={hasLanded ? 2.5 : 1.5}
            strokeDasharray={hasLanded ? 'none' : '3 2'}
            className="transition-all duration-700"
            opacity={hasLanded ? 0.95 : 0.65}
          />

          {/* Typography Label */}
          <text x={landingCoords.x} y="210" fill="#0F172A" fontSize="12" fontWeight="800" textAnchor="middle" letterSpacing="0.05em">
            {destAirport}
          </text>
          <text x={landingCoords.x} y="222" fill="#64748B" fontSize="9.5" fontWeight="600" textAnchor="middle">
            {destCity}, {destCountry === 'Japan' ? 'JP' : destCountry === 'Germany' ? 'DE' : 'SG'}
          </text>
        </g>

        {/* ══════════════════════════════════════════════════════════════
            SCENIC S-CURVE FLIGHT CORRIDOR (RUTE BERKELOK PANJANG)
            ══════════════════════════════════════════════════════════════ */}
        {/* Soft Ambient Airway Guidance Ribbon */}
        <path
          d={flightPathD}
          stroke="#EEF2FF"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Active Trajectory Dashed Path */}
        <path
          ref={pathRef}
          d={flightPathD}
          stroke="url(#scenicFlightGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="6 6"
        />

        {/* Real-time Glowing Flight Progress Trail */}
        <path
          ref={activeTrailRef}
          d={flightPathD}
          stroke="#4F46E5"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          style={{ transition: 'none' }}
        />

        {/* ── INTERMEDIATE SCENIC WAYPOINT MARKERS ── */}
        <g transform="translate(260, 115)">
          <circle cx="0" cy="0" r="3.5" fill="#818CF8" />
          <circle cx="0" cy="0" r="7" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="2 2" />
        </g>
        <g transform="translate(480, 42)">
          <circle cx="0" cy="0" r="3.5" fill="#818CF8" />
          <circle cx="0" cy="0" r="7" stroke="#C7D2FE" strokeWidth="1" strokeDasharray="2 2" />
        </g>

        {/* ══════════════════════════════════════════════════════════════
            AIRLINER VECTOR: LIQUID-SMOOTH S-CURVE FLIGHT ENGINE
            ══════════════════════════════════════════════════════════════ */}
        <g
          ref={planeRef}
          filter="url(#planeShadow)"
          transform={lastTransformRef.current}
        >
          {/* Aerodynamic Contrail Stream behind Tail */}
          <line x1="-42" y1="0" x2="-18" y2="0" stroke="url(#contrailGrad)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Left Wing & Jet Engine */}
          <path d="M 2 -2 L -8 -17 L -4 -17 L 6 -2 Z" fill="#4338CA" />
          <rect x="-3" y="-12" width="8" height="3" rx="1.5" fill="#312E81" />

          {/* Right Wing & Jet Engine */}
          <path d="M 2 2 L -8 17 L -4 17 L 6 2 Z" fill="#4338CA" />
          <rect x="-3" y="9" width="8" height="3" rx="1.5" fill="#312E81" />

          {/* Horizontal Tail Stabilizers */}
          <path d="M -15 -1 L -21 -8 L -18 -8 L -12 -1 Z" fill="#4F46E5" />
          <path d="M -15 1 L -21 8 L -18 8 L -12 1 Z" fill="#4F46E5" />

          {/* Main Fuselage Body (Aligned centered along y = 0) */}
          <path
            d="M 18 0 C 14 -3, 2 -3.2, -16 -2 C -20 -1.5, -22 -0.8, -23 0 C -22 0.8, -20 1.5, -16 2 C 2 3.2, 14 3, 18 0 Z"
            fill="#FFFFFF"
            stroke="#4F46E5"
            strokeWidth="1.5"
          />

          {/* Cockpit Windshield Visor */}
          <path d="M 11 -1.5 Q 13 0 11 1.5 L 9 1 Q 11 0 9 -1 Z" fill="#1E1B4B" />

          {/* Center Airline Stripe Accent */}
          <line x1="-14" y1="0" x2="8" y2="0" stroke="#4F46E5" strokeWidth="1.2" />

          {/* Navigation Radar Pulse Ring */}
          <circle cx="0" cy="0" r="14" stroke="#6366F1" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        </g>
      </svg>
    </div>
  )
}
