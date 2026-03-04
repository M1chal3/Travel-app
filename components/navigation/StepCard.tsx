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
    <div style={{
      minHeight: '100vh',
      background: isLast ? '#060f0a' : '#0d1117',
      fontFamily: 'system-ui, sans-serif',
      padding: '48px 24px 32px',
      maxWidth: 480,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Progress bar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}>
          <span style={{ color: '#8b949e', fontSize: 12 }}>
            Step {stepIndex + 1} of {totalSteps}
          </span>
          <span style={{ color: '#8b949e', fontSize: 12 }}>
            {progress}% done
          </span>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6 }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: i === stepIndex ? 3 : 1,
                height: 6,
                borderRadius: 3,
                background: i <= stepIndex
                  ? isLast ? '#4ade80' : '#f59e0b'
                  : '#21262d',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Big icon */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 32,
      }}>
        <div style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: '#161b22',
          border: `3px solid ${isLast ? '#4ade80' : '#f59e0b'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 44,
          boxShadow: `0 8px 32px ${isLast ? 'rgba(74,222,128,0.2)' : 'rgba(245,158,11,0.2)'}`,
        }}>
          {isLast ? '📍' : modeIcon(step.type)}
        </div>
      </div>

      {/* Main instruction */}
      <div style={{ flex: 1, textAlign: 'center' }}>
        <h2 style={{
          fontSize: 32,
          fontWeight: 800,
          color: '#f0f2ff',
          lineHeight: 1.2,
          marginBottom: 12,
          letterSpacing: '-0.5px',
        }}>
          {step.instruction}
        </h2>

        <p style={{
          color: '#8b949e',
          fontSize: 16,
          lineHeight: 1.6,
          marginBottom: 24,
        }}>
          {step.detail}
        </p>

        {/* Extra info badges */}
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: 32,
        }}>
          <span style={{
            background: '#161b22',
            border: '1px solid #30363d',
            color: '#8b949e',
            fontSize: 13,
            padding: '6px 14px',
            borderRadius: 20,
          }}>
            ⏱ {formatDuration(step.durationSeconds)}
          </span>

          {step.lineLabel && (
            <span style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: '#f59e0b',
              fontSize: 13,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 20,
            }}>
              {step.lineLabel}
            </span>
          )}

          {step.stopsCount && (
            <span style={{
              background: '#161b22',
              border: '1px solid #30363d',
              color: '#8b949e',
              fontSize: 13,
              padding: '6px 14px',
              borderRadius: 20,
            }}>
              {step.stopsCount} stops
            </span>
          )}

          {step.distanceMeters && (
            <span style={{
              background: '#161b22',
              border: '1px solid #30363d',
              color: '#8b949e',
              fontSize: 13,
              padding: '6px 14px',
              borderRadius: 20,
            }}>
              {step.distanceMeters}m
            </span>
          )}
        </div>

        {/* Helper buttons */}
        {!isLast && (
          <div style={{
            display: 'flex',
            gap: 10,
            marginBottom: 24,
          }}>
            {[
              { icon: '🗺️', label: 'Map' },
              { icon: '📸', label: 'Landmark' },
              { icon: '🔊', label: 'Read aloud' },
            ].map((btn, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: '#161b22',
                  border: '1px solid #30363d',
                  borderRadius: 12,
                  padding: '12px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 4 }}>{btn.icon}</div>
                <div style={{ color: '#8b949e', fontSize: 11, fontWeight: 500 }}>
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
          <div style={{
            color: '#0d1117',
            fontWeight: 800,
            fontSize: 18,
          }}>
            {isLast ? "You've arrived! 🎉" : 'Got it — next step'}
          </div>
          {!isLast && (
            <div style={{
              color: 'rgba(13,17,23,0.55)',
              fontSize: 13,
              marginTop: 3,
            }}>
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
        <span
          onClick={onReroute}
          style={{
            color: '#484f58',
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Something wrong? Reroute
        </span>
      </div>

    </div>
  )
}