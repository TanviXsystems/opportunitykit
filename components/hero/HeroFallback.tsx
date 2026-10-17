/**
 * Polished 2D fallback for the hero scene — used when WebGL is
 * unavailable, when the 3D scene fails, or when the visitor prefers
 * reduced motion. It tells the same story with original SVG art.
 */
export default function HeroFallback() {
  return (
    <svg
      viewBox="0 0 800 520"
      className="h-full w-full"
      role="img"
      aria-label="Illustration: an overwhelmed hiring manager beside a wall of requirements, a student with scattered documents, and OpportunityKit's glowing bridge between them"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* ground */}
      <ellipse cx="400" cy="470" rx="360" ry="34" fill="#101a3a" />

      {/* bridge */}
      <path d="M 250 400 Q 400 250 550 400" fill="none" stroke="#2dd4bf" strokeWidth="7" strokeLinecap="round" opacity="0.9" />
      {Array.from({ length: 7 }).map((_, i) => {
        const t = i / 6;
        const x = 250 + (550 - 250) * t;
        const y = 400 - Math.sin(t * Math.PI) * 118;
        return <rect key={i} x={x - 9} y={y - 9} width="18" height="18" rx="5" fill="#14b8a6" />;
      })}
      <circle cx="400" cy="282" r="17" fill="#5eead4" opacity="0.95" />
      <circle cx="400" cy="282" r="26" fill="#2dd4bf" opacity="0.25" />

      {/* clear path */}
      <rect x="150" y="448" width="500" height="10" rx="5" fill="#2dd4bf" opacity="0.3" />

      {/* requirement wall (manager side) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect
          key={i}
          x={70 + ((i % 3) - 1) * 34}
          y={150 + Math.floor(i / 3) * 30}
          width="56"
          height="26"
          rx="3"
          fill={i % 4 === 0 ? '#fde68a' : '#fbf8f3'}
          opacity="0.95"
        />
      ))}

      {/* manager */}
      <g>
        <rect x="150" y="330" width="70" height="34" rx="10" fill="#1e2d63" />
        <rect x="185" y="360" width="12" height="52" fill="#16224d" />
        <rect x="118" y="360" width="12" height="52" fill="#16224d" />
        <rect x="150" y="280" width="70" height="70" rx="30" fill="#2dd4bf" />
        <circle cx="185" cy="245" r="30" fill="#f2c9a0" />
        <ellipse cx="185" cy="228" rx="32" ry="20" fill="#1e293b" />
        <circle cx="175" cy="245" r="3.5" fill="#0f172a" />
        <circle cx="195" cy="245" r="3.5" fill="#0f172a" />
        {/* long checklist */}
        <rect x="232" y="300" width="34" height="64" rx="4" fill="#fbf8f3" transform="rotate(-8 249 332)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="237" y={312 + i * 13} width="24" height="3.5" rx="1.5" fill="#94a3b8" transform="rotate(-8 249 332)" />
        ))}
      </g>

      {/* student */}
      <g>
        <rect x="560" y="330" width="70" height="34" rx="10" fill="#7c2d12" />
        <rect x="595" y="360" width="12" height="52" fill="#9a3412" />
        <rect x="528" y="360" width="12" height="52" fill="#9a3412" />
        <rect x="560" y="280" width="70" height="70" rx="30" fill="#ff6b5e" />
        <circle cx="595" cy="245" r="30" fill="#f2c9a0" />
        <circle cx="595" cy="222" r="26" fill="#f59e0b" />
        <circle cx="585" cy="245" r="3.5" fill="#0f172a" />
        <circle cx="605" cy="245" r="3.5" fill="#0f172a" />
        {/* laptop */}
        <rect x="576" y="330" width="46" height="4" rx="2" fill="#1e293b" />
        <rect x="580" y="306" width="38" height="26" rx="3" fill="#38bdf8" opacity="0.85" />
      </g>

      {/* scattered papers (student side) */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect
          key={i}
          x={520 + (i % 3) * 46}
          y={395 + (i % 2) * 20}
          width="34"
          height="42"
          rx="3"
          fill={i % 3 === 0 ? '#fde68a' : '#fbf8f3'}
          opacity="0.9"
          transform={`rotate(${(i % 3) * 14 - 14} ${540 + i * 12} 416)`}
        />
      ))}

      {/* floating requirement tags */}
      {['Python', 'CGPA 7.5+', 'B.Tech', '6 months'].map((t, i) => (
        <g key={t}>
          <rect x={250 + i * 95} y={96 + (i % 2) * 26} width="74" height="26" rx="13" fill={i % 2 ? '#f59e0b' : '#5eead4'} opacity="0.9" />
        </g>
      ))}

      {/* three-state results above the bridge */}
      {[
        ['#10b981', 330],
        ['#f43f5e', 392],
        ['#f59e0b', 454],
      ].map(([c, x]) => (
        <g key={String(x)}>
          <rect x={Number(x)} y={170} width="46" height="58" rx="8" fill={String(c)} />
          <rect x={Number(x) + 9} y={186} width="28" height="5" rx="2.5" fill="#fbf8f3" />
          <rect x={Number(x) + 9} y={198} width="20" height="5" rx="2.5" fill="#fbf8f3" />
        </g>
      ))}
    </svg>
  );
}
