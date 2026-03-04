'use client'

import { Step, TransportMode } from '../../types/core/journey'
import { modeIcon, formatDuration } from '../../lib/utils/transport'

interface StepCardProps {
  step: Step
  stepIndex: number
  totalSteps: number
  onNext: () => void
  onReroute: () => void
  isLast: boolean
}

export function StepCard({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onReroute,
  isLast,
}: StepCardProps) {
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100)

  return (
  <div className="page-wrapper">
    <div className="blob-wrapper">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
    </div>
    <main className="page content" style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Progress */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="muted">Step {stepIndex + 1} of {totalSteps}</span>
          <span className="muted">{progress}% done</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} style={{
              flex: i === stepIndex ? 3 : 1,
              height: 6,
              borderRadius: 3,
              background: i <= stepIndex
                ? isLast ? 'var(--green)' : 'var(--amber)'
                : 'var(--border)',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>
      </div>

      {/* Big icon */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
        <div style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: 'var(--card)',
          border: `3px solid ${isLast ? 'var(--green)' : 'var(--amber)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 44,
          boxShadow: isLast
            ? '0 8px 32px rgba(74,222,128,0.2)'
            : '0 8px 32px rgba(245,158,11,0.2)',
        }}>
          {isLast ? '📍' : modeIcon(step.type)}
        </div>
      </div>

      {/* Instruction */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <h2 style={{
          fontSize: 32,
          fontWeight: 800,
          color: 'var(--text)',
          lineHeight: 1.2,
          marginBottom: 12,
          letterSpacing: '-0.5px',
        }}>
          {step.instruction}
        </h2>

        <p style={{
          color: 'var(--muted)',
          fontSize: 16,
          lineHeight: 1.6,
          marginBottom: 24,
        }}>
          {step.detail}
        </p>

        {/* Badges */}
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 32,
        }}>
          <span className="badge badge-muted">
            ⏱ {formatDuration(step.durationSeconds)}
          </span>
          {step.lineLabel && (
            <span className="badge badge-amber">
              {step.lineLabel}
            </span>
          )}
          {step.stopsCount && (
            <span className="badge badge-muted">
              {step.stopsCount} stops
            </span>
          )}
          {step.distanceMeters && (
            <span className="badge badge-muted">
              {step.distanceMeters}m
            </span>
          )}
        </div>

        {/* Helper buttons */}
        {!isLast && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            {[
              { icon: '🗺️', label: 'Map' },
              { icon: '📸', label: 'Landmark' },
              { icon: '🔊', label: 'Read aloud' },
            ].map((btn, i) => (
              <div key={i} className="card" style={{
                flex: 1,
                textAlign: 'center',
                cursor: 'pointer',
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{btn.icon}</div>
                <div className="muted" style={{ fontSize: 11, fontWeight: 500 }}>
                  {btn.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        style={{
          width: '100%',
          background: isLast
            ? 'linear-gradient(135deg, #4ade80, #22c55e)'
            : 'linear-gradient(135deg, #f59e0b, #f97316)',
          border: 'none',
          borderRadius: 16,
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: isLast
            ? '0 8px 32px rgba(74,222,128,0.25)'
            : '0 8px 32px rgba(245,158,11,0.25)',
          marginBottom: 16,
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ color: '#0d1117', fontWeight: 800, fontSize: 18 }}>
            {isLast ? "You've arrived! 🎉" : 'Got it — next step'}
          </div>
          {!isLast && (
            <div style={{ color: 'rgba(13,17,23,0.55)', fontSize: 13, marginTop: 3 }}>
              {stepIndex + 2} of {totalSteps} remaining
            </div>
          )}
        </div>
        {!isLast && (
          <span style={{ color: 'rgba(13,17,23,0.6)', fontSize: 24 }}>›</span>
        )}
      </button>

      {/* Reroute */}
      <div style={{ textAlign: 'center' }}>
        <span onClick={onReroute} className="muted" style={{ cursor: 'pointer', fontSize: 13 }}>
          Something wrong? Reroute
        </span>
      </div>

    </main>
  </div>
)
}