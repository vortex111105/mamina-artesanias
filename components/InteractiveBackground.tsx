'use client'

export function InteractiveBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]" aria-hidden>
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
    </div>
  )
}
