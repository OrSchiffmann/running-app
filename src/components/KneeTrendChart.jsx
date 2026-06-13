import React from 'react'

const CHART_H = 120
const CHART_W = 300
const PAD = { top: 10, right: 16, bottom: 24, left: 28 }

function formatLabel(dateStr) {
  const d = new Date(dateStr)
  return `${d.getDate()}/${d.getMonth() + 1}`
}

export default function KneeTrendChart({ data }) {
  if (!data || data.length < 2) return null

  const values = data.map((d) => d.value)
  const min = 1
  const max = 10
  const w = CHART_W - PAD.left - PAD.right
  const h = CHART_H - PAD.top - PAD.bottom

  const xScale = (i) => PAD.left + (i / (data.length - 1)) * w
  const yScale = (v) => PAD.top + ((max - v) / (max - min)) * h

  const points = data.map((d, i) => ({ x: xScale(i), y: yScale(d.value), ...d }))

  // SVG path
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaPath = [
    `M ${points[0].x} ${PAD.top + h}`,
    ...points.map((p) => `L ${p.x} ${p.y}`),
    `L ${points[points.length - 1].x} ${PAD.top + h}`,
    'Z',
  ].join(' ')

  // Colour zones
  function dotColor(v) {
    if (v <= 3) return '#22c55e'
    if (v <= 6) return '#f59e0b'
    return '#ef4444'
  }

  // Y grid lines at 2, 5, 8
  const gridLines = [2, 5, 8]

  // Show every N-th label to avoid crowding
  const step = Math.max(1, Math.ceil(data.length / 6))

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H}`}
        className="w-full"
        style={{ minWidth: 220 }}
        aria-hidden="true"
      >
        {/* Grid lines */}
        {gridLines.map((v) => (
          <g key={v}>
            <line
              x1={PAD.left}
              x2={PAD.left + w}
              y1={yScale(v)}
              y2={yScale(v)}
              stroke="#f3f4f6"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 4}
              y={yScale(v) + 4}
              textAnchor="end"
              fontSize={8}
              fill="#9ca3af"
            >
              {v}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="rgba(99,102,241,0.08)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#6366f1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={dotColor(p.value)} stroke="white" strokeWidth={1.5} />
            {/* X labels */}
            {i % step === 0 && (
              <text x={p.x} y={PAD.top + h + 14} textAnchor="middle" fontSize={8} fill="#9ca3af">
                {formatLabel(p.date)}
              </text>
            )}
          </g>
        ))}

        {/* Danger zone line at 7 */}
        <line
          x1={PAD.left}
          x2={PAD.left + w}
          y1={yScale(7)}
          y2={yScale(7)}
          stroke="#fca5a5"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        <text x={PAD.left + w + 2} y={yScale(7) + 4} fontSize={8} fill="#f87171">7</text>
      </svg>

      {/* Legend */}
      <div className="flex gap-4 justify-center text-xs text-gray-500 mt-1">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />1–3 טוב</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />4–6 בינוני</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />7–10 גבוה</span>
      </div>
    </div>
  )
}
