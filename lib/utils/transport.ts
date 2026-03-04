import { TransportMode } from '../../types/core/journey'

export function modeIcon(mode: TransportMode): string {
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

export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const hrs = Math.floor(mins / 60)
  const remaining = mins % 60
  return `${hrs}h ${remaining}min`
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${meters}m`
  return `${(meters / 1000).toFixed(1)}km`
}