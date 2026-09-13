import { useEffect, useRef, useState } from 'react'

const CREW = [
  { id: 'scout', name: 'SCOUT', color: '#3ad7ee', role: 'Web' },
  { id: 'hunter', name: 'HUNTER', color: '#ff9a3c', role: 'Leads' },
  { id: 'liaison', name: 'LIAISON', color: '#ff6b9d', role: 'Clients' },
  { id: 'atlas', name: 'ATLAS', color: '#7aa8ff', role: 'Research' },
  { id: 'auditor', name: 'AUDITOR', color: '#f0d27a', role: 'Budget' },
]

const HEADLINES = [
  'SpaceX IPO raises $85.7B, valuation surpasses $2T.',
  'Apple CEO announces price hikes due to memory costs.',
  'Fox Corporation to acquire Roku for $22B.',
]

function route(text) {
  const t = text.toLowerCase()
  if (/lead|pipeline|sales|icp/.test(t)) return 'hunter'
  if (/web|search|site|browse|google/.test(t)) return 'scout'
  if (/social|client|post|whatsapp|email/.test(t)) return 'liaison'
  if (/budget|audit|spend|kpi|cost/.test(t)) return 'auditor'
  if (/trend|skill|research|opportunity/.test(t)) return 'atlas'
  return 'scout'
}

function jobLine(id, q) {
  return {
    scout: `scout.search("${q}")\n→ 14 pages, 3 competitor deltas`,
    hunter: `hunter.leads("${q}")\n→ 12 A-tier / 18 B-tier queued`,
    liaison: `liaison.draft("${q}")\n→ social + client drafts pending yes`,
    atlas: `atlas.brief("${q}")\n→ trend window + skill sprint`,
    auditor: `auditor.score("${q}")\n→ health 91 · remaining $8.4k`,
  }[id]
}

function speak(text, onend) {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 1.02
  u.onend = onend
  window.speechSynthesis.speak(u)
}

export default function App() {
  const canvasRef = useRef(null)
  const recRef = useRef(null)
  const [on, setOn] = useState(false)
  const [mode, setMode] = useState('idle')
  const [heard, setHeard] = useState('Voice always routes to NEURAL')
  const [tab, setTab] = useState('voice')
  const [busy, setBusy] = useState({})
  const [consoleText, setConsoleText] = useState(
    '# NEURAL CORE\n# Five agents under command\n# Hit START AI, then speak\n'
  )
  const [input, setInput] = useState('')
  const [clock, setClock] = useState('')

  useEffect(() => {
    const t = () => setClock(new Date().toUTCString().slice(17, 25) + ' UTC')
    t()
    const i = setInterval(t, 1000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    let raf
    const pts = Array.from({ length: 90 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 18 + Math.random() * 70,
      s: 0.006 + Math.random() * 0.012,
    }))
    const size = () => {
      c.width = c.clientWidth
      c.height = c.clientHeight
    }
    size()
    window.addEventListener('resize', size)
    const draw = () => {
      const w = c.width
      const h = c.height
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h / 2 - 10
      const boost = mode === 'listening' ? 1.25 : mode === 'talking' ? 1.12 : 1
      pts.forEach((p) => {
        p.a += p.s * (mode === 'idle' ? 1 : 2)
        const x = cx + Math.cos(p.a) * p.r * boost
        const y = cy + Math.sin(p.a) * p.r * 0.72 * boost
        ctx.fillStyle = 'rgba(58,215,238,0.75)'
        ctx.fillRect(x, y, 1.6, 1.6)
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
    }
  }, [mode])

  function listen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setHeard('Mic API missing — type below, Neural still commands the five.')
      return
    }
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.onresult = (e) => {
      let final = ''
      let live = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const x = e.results[i][0].transcript
        if (e.results[i].isFinal) final += x
        else live += x
      }
      if (live) setHeard(live)
      if (final.trim()) command(final.trim())
    }
    rec.onend = () => {
      if (on && mode !== 'talking') {
        try { rec.start() } catch {}
      }
    }
    recRef.current = rec
    rec.start()
    setMode('listening')
  }

  function command(q) {
    const id = route(q)
    const unit = CREW.find((c) => c.id === id)
    setBusy((b) => ({ ...b, [id]: true }))
    const out = jobLine(id, q)
    setConsoleText((t) => t + `\n> YOU: ${q}\nNEURAL → ${unit.name}\n${out}\n`)
    setHeard(q)
    setMode('talking')
    recRef.current?.stop()
    const line = `Command received. Dispatching ${unit.name}.`
    speak(line, () => {
      setBusy((b) => ({ ...b, [id]: false }))
      setMode('listening')
      try { recRef.current?.start() } catch { listen() }
    })
  }

  function start() {
    setOn(true)
    setMode('talking')
    speak('Neural online. Five agents under my command. Speak.', () => listen())
  }

  return (
    <div className="app">
      <header className="bar">
        <div className="bar-l">
          <div className="brand">N</div>
          <span className="brand-name">NEURAL COMMAND</span>
          <button className="ghost">Demo</button>
          <button className="ghost">Feedback</button>
        </div>
        <div className="bar-r">
          <span className="ver">{clock}</span>
          <span className="ver">v1.0 · core</span>
        </div>
      </header>

      <div className="grid">
        <aside className="col left">
          <div className="card">
            <h4>MEDIA LINK</h4>
            <div className="row"><span className="dot" /> <span className="muted">SYSTEM {on ? 'ONLINE' : 'OFFLINE'}</span></div>
          </div>
          <div className="card">
            <h4>SAT-LINK FEED</h4>
            <div className="muted" style={{ marginBottom: 8 }}>SATELLITE STREAM · 2D</div>
            <div className="map">
              <span className="hot" style={{ left: '28%', top: '42%' }} />
              <span className="hot" style={{ left: '58%', top: '38%' }} />
              <span className="hot" style={{ left: '72%', top: '55%' }} />
              <span className="hot" style={{ left: '44%', top: '60%' }} />
            </div>
          </div>
          <div className="card">
            <h4>TODAY HEADLINES</h4>
            {HEADLINES.map((h, i) => (
              <div className="head" key={i}><b>0{i + 1}</b>{h}</div>
            ))}
          </div>
        </aside>

        <section className="col mid">
          <div className="mid-top">
            <div className="circuits">
              {[
                ['MEMORY', '#3ad7ee'],
                ['SKILLS', '#3dff9a'],
                ['SOUL', '#ff9a3c'],
                ['SETTING', '#7aa8ff'],
              ].map(([n, c]) => (
                <div className="ckt" key={n}>
                  <i style={{ background: c }} /> {n}
                </div>
              ))}
            </div>
            <div className="orb-wrap">
              <div className="think">{mode === 'idle' ? 'STANDBY' : mode === 'listening' ? 'LISTENING' : 'THINKING'}</div>
              <canvas ref={canvasRef} className="particles" />
              {!on && <button className="start" onClick={start}>START AI</button>}
              {on && <button className="start" onClick={() => command(heard)}>DISPATCH</button>}
              <div className="heard">{heard}</div>
            </div>
          </div>

          <div className="town">
            <div className="town-h">
              <span>AGENT TOWN · UNDER NEURAL</span>
              <span>{Object.values(busy).some(Boolean) ? 'WORKING' : 'READY'} · 5/5 seat</span>
            </div>
            <div className="office">
              {CREW.map((c) => (
                <div key={c.id} className={`desk ${busy[c.id] ? 'busy' : ''}`}>
                  <div className="sprite" style={{ background: c.color }} />
                  <div className="name">{c.name} · {c.role}</div>
                </div>
              ))}
              <div className="desk">
                <div className="name">COMMAND DESK · YOU</div>
              </div>
            </div>
          </div>
        </section>

        <aside className="col right">
          <div className="tabs">
            {['voice', 'agent', 'notes'].map((t) => (
              <span key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t.toUpperCase()}</span>
            ))}
          </div>
          <div className="console">{consoleText}</div>
          <div className="tool">
            <strong>write_file</strong>
            <div className="muted" style={{ marginTop: 6 }}>
              Neural logs every dispatch. Scout / Hunter / Liaison / Atlas / Auditor never take voice — only Neural.
            </div>
          </div>
          <form
            className="chat"
            onSubmit={(e) => {
              e.preventDefault()
              if (!input.trim()) return
              if (!on) start()
              command(input.trim())
              setInput('')
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type instruction for Neural…"
            />
            <button type="button" className="mic" onClick={() => (on ? listen() : start())} title="Voice to Neural">
              ●
            </button>
          </form>
        </aside>
      </div>

      <footer className="foot">
        <span>N · {on ? 'online' : 'no model yet'} · CTX</span>
        <span><b>5/5</b> seat · {Object.values(busy).filter(Boolean).length}/5 busy</span>
        <span>CHAT · command Neural only</span>
      </footer>
    </div>
  )
}
