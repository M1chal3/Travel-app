'use client'

import { RouteOption, Step, TransportMode } from '../../types/core/journey'

// Maps transport mode to an emoji
function modeIcon(mode: TransportMode): string {
  const icons: Record<TransportMode, string> = {
    walking: '🚶',
    tram: '🚃',
    metro: '🚇',
    bus: '🚌',
    train: '🚆',
    taxi: '🚖',
    ferry: '⛴️',
  }
  return icons[mode] ?? '🚶'
}

// Converts seconds to readable string
// 1140 → "19 min"
function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const hrs = Math.floor(mins / 60)
  const remaining = mins % 60
  return `${hrs}h ${remaining}min`
}

// A single step row inside the card
function StepRow({ step }: { step: Step }) {
  return (
    <div style={{
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      padding: '10px 0',
      borderBottom: '1px solid #21262d',
    }}>
      {/* Icon */}
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        background: '#21262d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 15,
        flexShrink: 0,
      }}>
        {modeIcon(step.type)}
      </div>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{ color: '#f0f2ff', fontSize: 14, fontWeight: 600 }}>
          {step.instruction}
        </div>
        <div style={{ color: '#8b949e', fontSize: 12, marginTop: 3 }}>
          {step.detail}
        </div>
        {/* Extra info — line label and stop count */}
        {step.lineLabel && (
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <span style={{
              background: '#21262d',
              color: '#f59e0b',
              fontSize: 11,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 6,
            }}>
              {step.lineLabel}
            </span>
            {step.stopsCount && (
              <span style={{
                background: '#21262d',
                color: '#8b949e',
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 6,
              }}>
                {step.stopsCount} stops
              </span>
            )}
          </div>
        )}
      </div>

      {/* Duration */}
      <div style={{ color: '#8b949e', fontSize: 12, flexShrink: 0 }}>
        {formatDuration(step.durationSeconds)}
      </div>
    </div>
  )
}

// The accent color per route type
function routeColor(type: RouteOption['type']): string {
  if (type === 'easiest') return '#6366f1'
  if (type === 'fastest') return '#f59e0b'
  return '#4ade80'
}

// Props this component accepts
interface RouteCardProps {
  route: RouteOption
  onSelect: (route: RouteOption) => void
  selected: boolean
}

export function RouteCard({ route, onSelect, selected }: RouteCardProps) {
  const color = routeColor(route.type)

  return (
    <div
      onClick={() => onSelect(route)}
      style={{
        background: '#161b22',
        border: `2px solid ${selected ? color : '#30363d'}`,
        borderRadius: 16,
        padding: '18px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        marginBottom: 12,
      }}
    >
      {/* Card header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            color,
            fontWeight: 800,
            fontSize: 16,
            textTransform: 'capitalize',
          }}>
            {route.type}
          </span>
          {route.type === 'easiest' && (
            <span style={{
              background: `${color}18`,
              color,
              fontSize: 10,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 20,
              border: `1px solid ${color}44`,
            }}>
              RECOMMENDED
            </span>
          )}
        </div>

        {/* Price + duration badges */}
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{
            background: 'rgba(74,222,128,0.1)',
            color: '#4ade80',
            fontSize: 13,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 20,
          }}>
            €{route.totalPriceEUR}
          </span>
          <span style={{
            background: '#21262d',
            color: '#8b949e',
            fontSize: 13,
            padding: '3px 10px',
            borderRadius: 20,
          }}>
            {formatDuration(route.totalDurationSeconds)}
          </span>
        </div>
      </div>

      {/* Steps */}
      {route.steps.map((step, i) => (
        <StepRow key={i} step={step} />
      ))}

      {/* Transfers */}
      <div style={{ marginTop: 10, color: '#484f58', fontSize: 12 }}>
        {route.transferCount === 0
          ? 'No transfers'
          : `${route.transferCount} transfer${route.transferCount > 1 ? 's' : ''}`}
      </div>
    </div>
  )
}