import { formatCurrency } from '../utils/format'

interface DonutSegment {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  segments: DonutSegment[]
  total: number
}

export function DonutChart({ segments, total }: DonutChartProps) {
  const size = 180
  const strokeWidth = 32
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2

  // Filter out zero-value segments for rendering
  const activeSegments = segments.filter((s) => s.value > 0)
  const segmentTotal = activeSegments.reduce((sum, s) => sum + s.value, 0)

  // Build stroke-dasharray offsets
  let cumulativePercent = 0
  const arcs = activeSegments.map((segment) => {
    const percent = segmentTotal > 0 ? segment.value / segmentTotal : 0
    const dashLength = percent * circumference
    const gapLength = circumference - dashLength
    const offset = -cumulativePercent * circumference + circumference * 0.25 // rotate -90deg start
    cumulativePercent += percent
    return { ...segment, dashLength, gapLength, offset }
  })

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={strokeWidth}
          />
          {/* Segments */}
          {arcs.map((arc, i) => (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arc.dashLength} ${arc.gapLength}`}
              strokeDashoffset={arc.offset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-400">Total</span>
          <span className="text-lg font-bold text-gray-900">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 w-full">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-2 min-w-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-xs text-gray-500 truncate">{segment.label}</span>
            <span className="text-xs font-semibold text-gray-700 ml-auto shrink-0">
              {formatCurrency(segment.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
