import { useEffect, useRef, useState } from 'react'

const CREW = [
  { id: 'scout', name: 'SCOUT', role: 'Web surface', idle: 'Watching the web.' },
  { id: 'hunter', name: 'HUNTER', role: 'Leads', idle: 'Pipeline cold. Awaiting Neural.' },
  { id: 'liaison', name: 'LIAISON', role: 'Clients & platforms', idle: 'Draft queue empty.' },
  { id: 'atlas', name: 'ATLAS', role: 'Research & trends', idle: 'Scanning opportunity map.' },
  { id: 'auditor', name: 'AUDITOR', role: 'Budget & audit', idle: 'Books closed. Health 91.' },
]

function route(text) {
  const t = text.toLowerCase()
  if (/lead|client list|pipeline|icp|sales/.test(t)) return 'hunter'
  if (/web|search|site|competitor|google|browse/.test(t)) return 'scout'
  if (/social|whatsapp|instagram|client|reply|post|email/.test(t)) return 'liaison'
  if (/trend|skill|research|opportunity|market/.test(t)) return 'atlas'
  if (/budget|audit|spend|kpi|cost|money/.test(t)) return 'auditor'
  return 'atlas'
}

function work(id, q) {
  const map = {
    scout: `Web scan for “${q}”. Top surfaces tagged. Report back to Neural.`,
    hunter: `Lead batch opened for “${q}”. 12 A-tier, 18 B-tier. Nothing sent.`,
    liaison: `Drafts queued for “${q}”. Platforms wait for your yes.`,
    atlas: `Trend brief on “${q}”. Window and skill sprint attached.`,
    auditor: `Audit on “${q}”. Remaining $8.4k. Under cap. No extra tools.`,
  }
  return map[id]
}

function speak(text, onend) {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 1.02
  u.pitch = 0.95
  u.onend = onend
  window.speechSynthesis.speak(u)
}

export default function App() {
  const canvasRef = useRef(null)
  const recRef = useRef(null)
  const [on, setOn] = useState(false)
  const [mode, setMode] = useState('idle') // idle | listening | talking
  const [heard, setHeard] = useState('Voice always hits NEURAL. Five agents work under it.')
  const [clock, setClock] = useState('')
  const [log, setLog] = useState([
    { w: 'NEURAL', t: 'Core online. Speak after Start AI. I command Scout, Hunter, Liaison, Atlas, Auditor.' },
  ])
  const [jobs, setJobs] = useState({})

  useEffect(() => {
    const tick = () => setClock(new Date().toUTCString().replace('GMT', 'UTC'))
    tick()
    const i = setInterval(tick, 1000)
    return () => clearInterval(i)
  }, [])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    let raf
    const pts = Array.from({ length: 70 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 40 + Math.random() * 90,
      s: 0.004 + Math.random() * 0.01,
      z: Math.random(),
    }))
    function draw() {
      const { width: w, height: h } = c
      ctx.clearRect(0, 0, w, h)
      const cx = w / 2
      const cy = h * 0.42
      pts.forEach((p) => {
        p.a += p.s * (mode === 'listening' ? 2.4 : mode === 'talking' ? 1.6 : 1)
        const x = cx + Math.cos(p.a) * p.r * (mode === 'idle' ? 1 : 1.15)
        const y = cy + Math.sin(p.a) * p.r * 0.55
        ctx.fillStyle = `rgba(62,232,255,${0.15 + p.z * 0.7})`
        ctx.beginPath()
        ctx.arc(x, y, mode === 'listening' ? 2.4 : 1.6, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    function size() {
      c.width = c.clientWidth
      c.height = c.clientHeight
    }
    size()
    window.addEventListener('resize', size)
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
    }
  }, [mode])

  function listen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      setHeard('This browser has no speech recognition. Type is not used — voice only to Neural.')
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
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t
        else live += t
      }
      if (live) setHeard(live)
      if (final.trim()) neural(final.trim())
    }
    rec.onerror = () => setMode('idle')
    rec.onend = () => {
      if (on && mode !== 'talking') {
        try { rec.start() } catch {}
      }
    }
    recRef.current = rec
    rec.start()
    setMode('listening')
  }

  function neural(q) {
    setHeard(q)
    setLog((l) => [...l, { w: 'YOU', t: q }])
    const id = route(q)
    const unit = CREW.find((c) => c.id === id)
    setJobs((j) => ({ ...j, [id]: 'busy' }))
    const line = `Command received. Dispatching ${unit.name}. ${work(id, q)}`
    setMode('talking')
    recRef.current?.stop()
    speak(line, () => {
      setJobs((j) => ({ ...j, [id]: 'done' }))
      setLog((l) => [...l, { w: 'NEURAL', t: line }, { w: unit.name, t: work(id, q) }])
      setMode('listening')
      try { recRef.current?.start() } catch { listen() }
    })
  }

  function start() {
    setOn(true)
    speak('Neural online. Five agents under my command. Speak.', () => listen())
    setMode('talking')
  }

  return (
    <div className="hud">
      <header className="top">
        <div className="logo">
          <div className="hex">N</div>
          <div>
            <h1>NEURAL CORE</h1>
            <small>Voice to Neural · five agents under command</small>
          </div>
        </div>
        <div className="clock">{clock}</div>
      </header>

      <div className="stage">
        <canvas ref={canvasRef} className="orb" />
        <div className="transcript">
          {log.slice(-8).map((m, i) => (
            <div className="bubble" key={i}>
              <div className="w">{m.w}</div>
              {m.t}
            </div>
          ))}
        </div>
        <div className="core">
          <div className={`ring ${mode}`}>
            <div>
              <div className="core-label">NEURAL</div>
              <div className="core-sub">{mode === 'listening' ? 'LISTENING' : mode === 'talking' ? 'SPEAKING' : 'STANDBY'}</div>
            </div>
          </div>
          {!on && (
            <button className="start" onClick={start}>
              START AI
            </button>
          )}
          <div className="heard">{heard}</div>
        </div>
      </div>

      <div className="crew">
        {CREW.map((c) => (
          <div key={c.id} className={`unit ${jobs[c.id] === 'busy' ? 'busy' : ''}`}>
            <div className="badge">UNDER NEURAL · {jobs[c.id] === 'busy' ? 'WORKING' : jobs[c.id] === 'done' ? 'REPORT IN' : 'STANDBY'}</div>
            <h3>{c.name}</h3>
            <div className="role">{c.role}</div>
            <p>{jobs[c.id] === 'done' ? 'Task complete. Awaiting next Neural order.' : c.idle}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
