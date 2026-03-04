import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0d1117',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h1 style={{ fontSize: 48, fontWeight: 800, color: '#f0f2ff' }}>
        way<span style={{ color: '#f59e0b', fontStyle: 'italic' }}>far</span>
      </h1>
      <p style={{ color: '#8b949e', marginTop: 12, fontSize: 16 }}>
        your travel companion
      </p>
      <Link href="/navigate" style={{
        marginTop: 32,
        background: '#f59e0b',
        color: '#0d1117',
        padding: '14px 32px',
        borderRadius: 12,
        fontWeight: 700,
        fontSize: 16,
        textDecoration: 'none',
      }}>
        Open App →
      </Link>
    </main>
  )
}