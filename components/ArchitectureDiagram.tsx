/**
 * Architecture diagram: the OpportunityKit pipeline.
 * Student Profile + Opportunity Description → Requirement Extraction →
 * Validated Structured Requirements → Eligibility Rules Engine →
 * Explained Results → Preparation Checklist
 */
export default function ArchitectureDiagram() {
  const box = (x: number, y: number, w: number, h: number, fill: string, stroke: string) => (
    <rect x={x} y={y} width={w} height={h} rx={10} fill={fill} stroke={stroke} strokeWidth={1.5} />
  );
  const label = (x: number, y: number, lines: string[], bold = true) => (
    <text x={x} y={y} textAnchor="middle" fontSize={12} fontWeight={bold ? 700 : 400} fill="#1e293b">
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 15}>
          {l}
        </tspan>
      ))}
    </text>
  );
  const caption = (x: number, y: number, text: string) => (
    <text x={x} y={y} textAnchor="middle" fontSize={10} fill="#64748b">
      {text}
    </text>
  );
  const arrow = (x1: number, y1: number, x2: number, y2: number) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#6366f1" strokeWidth={2} markerEnd="url(#ok-arrow)" />
    </g>
  );

  return (
    <svg viewBox="0 0 1000 250" className="h-auto w-full" role="img" aria-label="Architecture diagram: Student Profile and Opportunity Description feed Requirement Extraction, which produces Validated Structured Requirements for the Eligibility Rules Engine, which produces Explained Results, which drive the Preparation Checklist.">
      <defs>
        <marker id="ok-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
        </marker>
      </defs>

      {/* inputs */}
      {box(10, 30, 140, 70, '#eef2ff', '#c7d2fe')}
      {label(80, 58, ['Student', 'Profile'])}
      {caption(80, 88, 'skills · CGPA · degree · docs')}
      {box(10, 150, 140, 70, '#eef2ff', '#c7d2fe')}
      {label(80, 178, ['Opportunity', 'Description'])}
      {caption(80, 208, 'scattered sources & formats')}

      {/* extraction */}
      {box(200, 90, 150, 70, '#e0e7ff', '#a5b4fc')}
      {label(275, 118, ['Requirement', 'Extraction'])}
      {caption(275, 148, 'validated parsing')}

      {/* validated requirements */}
      {box(400, 90, 150, 70, '#e0e7ff', '#a5b4fc')}
      {label(475, 118, ['Validated', 'Structured', 'Requirements'])}
      {caption(475, 158, 'typed schemas (zod)')}

      {/* rules engine */}
      {box(600, 90, 150, 70, '#e0e7ff', '#a5b4fc')}
      {label(675, 118, ['Eligibility', 'Rules Engine'])}
      {caption(675, 148, 'explicit, testable rules')}

      {/* explained results */}
      {box(800, 90, 150, 70, '#f0fdf4', '#bbf7d0')}
      {label(875, 118, ['Explained', 'Results'])}
      {caption(875, 140, 'MATCH · MISMATCH ·')}
      {caption(875, 152, 'MISSING INFORMATION')}

      {/* checklist */}
      {box(800, 185, 150, 55, '#fffbeb', '#fde68a')}
      {label(875, 208, ['Preparation', 'Checklist'])}
      {caption(875, 230, 'gaps → next steps')}

      {/* arrows */}
      {arrow(150, 65, 200, 115)}
      {arrow(150, 185, 200, 135)}
      {arrow(350, 125, 400, 125)}
      {arrow(550, 125, 600, 125)}
      {arrow(750, 125, 800, 125)}
      {arrow(875, 160, 875, 185)}

      {/* status dots */}
      <circle cx={812} cy={170} r={4} fill="#10b981" />
      <circle cx={828} cy={170} r={4} fill="#f43f5e" />
      <circle cx={844} cy={170} r={4} fill="#f59e0b" />
    </svg>
  );
}
