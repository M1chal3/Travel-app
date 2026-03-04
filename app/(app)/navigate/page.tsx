'use client'

import { useState } from 'react'
import { useLocation } from '../../../hooks/useLocation'
import { RouteOption, Journey } from '../../../types/core/journey'
import { getRoutes } from '../../../lib/transport'
import { RouteCard } from '../../../components/navigation/RouteCard'
import { StepCard } from '../../../components/navigation/StepCard'

// Three possible screens
type Screen = 'search' | 'routes' | 'guidance'

export default function NavigatePage() {
  const { coordinates, loading, error } = useLocation()

  const [screen, setScreen] = useState<Screen>('search')
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [routes, setRoutes] = useState<RouteOption[]>([])
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null)
  const [stepIndex, setStepIndex] = useState(0)

  // Step 1 — user hits search
  async function handleSearch() {
    if (!query.trim() || !coordinates) return
    setSearching(true)

    try {
      // Ask AI to understand what user typed
      const aiResponse = await fetch('/api/ai/understand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: query,
          userLocation: coordinates,
        }),
      })

      const intent = await aiResponse.json()

      // Get routes to that destination
      const foundRoutes = await getRoutes(coordinates, intent.destinationCoords)
      setRoutes(foundRoutes)
      setScreen('routes')

    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setSearching(false)
    }
  }

  // Step 2 — user picks a route
  function handleSelectRoute(route: RouteOption) {
    setSelectedRoute(route)
    setStepIndex(0)
    setScreen('guidance')
  }

  // Step 3 — user taps next step
  function handleNextStep() {
    if (!selectedRoute) return

    const isLast = stepIndex === selectedRoute.steps.length - 1

    if (isLast) {
      // Journey complete — go back to search
      setScreen('search')
      setQuery('')
      setRoutes([])
      setSelectedRoute(null)
      setStepIndex(0)
    } else {
      setStepIndex(stepIndex + 1)
    }
  }

  // Reroute — go back to route selection
  function handleReroute() {
    setScreen('routes')
    setStepIndex(0)
  }

  // ── Loading screen ──────────────────────────────────────
  if (loading) {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#0d1117',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        gap: 12,
      }}>
        <div style={{ fontSize: 32 }}>🌍</div>
        <p style={{ color: '#8b949e', fontSize: 16 }}>
          Getting your location...
        </p>
      </main>
    )
  }

  // ── Guidance screen ─────────────────────────────────────
  if (screen === 'guidance' && selectedRoute) {
    const currentStep = selectedRoute.steps[stepIndex]
    const isLast = stepIndex === selectedRoute.steps.length - 1

    return (
      <StepCard
        step={currentStep}
        stepIndex={stepIndex}
        totalSteps={selectedRoute.steps.length}
        onNext={handleNextStep}
        onReroute={handleReroute}
        isLast={isLast}
      />
    )
  }

  // ── Routes screen ───────────────────────────────────────
  if (screen === 'routes') {
    return (
      <main style={{
        minHeight: '100vh',
        background: '#0d1117',
        fontFamily: 'system-ui, sans-serif',
        padding: '48px 24px',
        maxWidth: 480,
        margin: '0 auto',
      }}>
        {/* Back button */}
        <button
          onClick={() => setScreen('search')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#f59e0b',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 20,
            padding: 0,
          }}
        >
          ← Change destination
        </button>

        <h2 style={{
          fontSize: 24,
          fontWeight: 800,
          color: '#f0f2ff',
          marginBottom: 6,
          letterSpacing: '-0.3px',
        }}>
          How do you want to go?
        </h2>
        <p style={{ color: '#8b949e', fontSize: 14, marginBottom: 24 }}>
          To <strong style={{ color: '#f0f2ff' }}>{query}</strong>
        </p>

        {routes.map((route, i) => (
          <RouteCard
            key={i}
            route={route}
            selected={selectedRoute?.type === route.type}
            onSelect={handleSelectRoute}
          />
        ))}
      </main>
    )
  }

  // ── Search screen (default) ─────────────────────────────
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0d1117',
      fontFamily: 'system-ui, sans-serif',
      padding: '48px 24px',
      maxWidth: 480,
      margin: '0 auto',
    }}>
      {/* Header */}
      <h1 style={{
        fontSize: 36,
        fontWeight: 800,
        color: '#f0f2ff',
        marginBottom: 8,
        letterSpacing: '-0.5px',
      }}>
        way<span style={{ color: '#f59e0b', fontStyle: 'italic' }}>far</span>
      </h1>

      {/* Location pill */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: '#161b22',
        border: '1px solid #30363d',
        borderRadius: 20,
        padding: '6px 14px',
        marginBottom: 32,
      }}>
        <div style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: coordinates ? '#4ade80' : '#ef4444',
        }} />
        <span style={{ color: '#8b949e', fontSize: 13 }}>
          {coordinates
            ? 'Location found'
            : error ?? 'No location'}
        </span>
      </div>

      {/* Input */}
      <textarea
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Where do you need to go? Type anything..."
        rows={3}
        style={{
          width: '100%',
          background: '#161b22',
          border: `1.5px solid ${query.trim() ? '#f59e0b' : '#30363d'}`,
          borderRadius: 14,
          padding: '14px 16px',
          color: '#f0f2ff',
          fontSize: 15,
          fontFamily: 'system-ui',
          resize: 'none',
          marginBottom: 12,
          outline: 'none',
          transition: 'border-color 0.15s',
        }}
      />

      {/* Quick suggestions */}
      <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 16,
      }}>
        {['Main train station', 'Airport', 'City centre', 'Hospital'].map((s, i) => (
          <div
            key={i}
            onClick={() => setQuery(s)}
            style={{
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: 20,
              padding: '6px 14px',
              fontSize: 13,
              color: '#8b949e',
              cursor: 'pointer',
            }}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Search button */}
      <button
        onClick={handleSearch}
        disabled={!query.trim() || !coordinates || searching}
        style={{
          width: '100%',
          background: query.trim() && coordinates
            ? 'linear-gradient(135deg, #f59e0b, #f97316)'
            : '#161b22',
          border: `1.5px solid ${query.trim() && coordinates ? '#f59e0b' : '#30363d'}`,
          borderRadius: 14,
          padding: '18px',
          color: query.trim() && coordinates ? '#0d1117' : '#484f58',
          fontWeight: 700,
          fontSize: 16,
          cursor: query.trim() && coordinates ? 'pointer' : 'default',
          transition: 'all 0.2s',
          boxShadow: query.trim() && coordinates
            ? '0 8px 32px rgba(245,158,11,0.25)'
            : 'none',
        }}
      >
        {searching ? 'Finding routes...' : 'Find my route →'}
      </button>
    </main>
  )
}