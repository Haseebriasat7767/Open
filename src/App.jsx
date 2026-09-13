import { useMemo, useState } from 'react'
import { AGENTS, FEED, KPIS, replyFor } from './agents.js'

export default function App() {
  const [active, setActive] = useState('command')
  const [input, setInput] = useState('')
  const [log, setLog] = useState([
    {
      who: 'COMMAND',
      side: 'agent',
      text: 'AEGIS online. You are Commander. Six agents wait for duty: NEURAL (models), SCOUT (web), HUNTER (leads), LIAISON (clients & platforms), ATLAS (research & trends), AUDITOR (performance & budget). Issue an order.',
    },
  ])

  const agent = useMemo(
    () => AGENTS.find((a) => a.id === active),
    [active]
  )

  function send(text) {
    const q = (text ?? input).trim()
    if (!q) return
    const who = agent ? agent.name : 'COMMAND'
    setLog((l) => [
      ...l,
      { who: 'YOU', side: 'you', text: q },
      { who, side: 'agent', text: replyFor(active, q) },
    ])
    setInput('')
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="mark">Æ</div>
          <div>
            <h1>AEGIS COMMAND</h1>
            <span>Personal operations OS</span>
          </div>
        </div>
        <div className="status-pill">
          <span className="dot" />
          ALL AGENTS STANDBY · YOU ARE IN COMMAND
        </div>
      </header>

      <aside className="sidebar">
        <div className="section-label">Commander</div>
        <div
          className={`agent-card ${active === 'command' ? 'active' : ''}`}
          onClick={() => setActive('command')}
        >
          <div className="avatar" style={{ background: '#1c2433', color: '#e8c547' }}>YOU</div>
          <div className="agent-meta">
            <strong>Command desk</strong>
            <p>Issue orders · six agents execute</p>
          </div>
        </div>
        <div className="section-label">Six agents</div>
        {AGENTS.map((a) => (
          <div
            key={a.id}
            className={`agent-card ${active === a.id ? 'active' : ''}`}
            onClick={() => setActive(a.id)}
          >
            <div className="avatar" style={{ background: a.color + '22', color: a.color }}>
              {a.initials}
            </div>
            <div className="agent-meta">
              <strong>{a.name}</strong>
              <p>{a.role}</p>
            </div>
          </div>
        ))}
      </aside>

      <main className="main">
        <div className="hero">
          <h2>{agent ? `${agent.name} — ${agent.role}` : 'You command. They execute.'}</h2>
          <p>
            {agent
              ? agent.duty
              : 'One desk. Six specialists. Nothing publishes, spends, or emails without your order. This HQ is the operating picture — connect real APIs when you are ready to go live.'}
          </p>
        </div>
        <div className="kpis">
          {KPIS.map((k) => (
            <div className="kpi" key={k.l}>
              <div className="n">{k.n}</div>
              <div className="l">{k.l}</div>
            </div>
          ))}
        </div>
        {agent && (
          <div style={{ padding: '0 26px 4px', fontSize: 12, color: 'var(--muted)' }}>
            Access: {agent.access.join(' · ')}
          </div>
        )}
        <div className="workspace">
          <div className="log">
            {log.map((m, i) => (
              <div key={i} className={`msg ${m.side}`}>
                <div className="who">{m.who}</div>
                {m.text}
              </div>
            ))}
          </div>
          <div>
            <div className="chips">
              {[
                'Brief all six on this week',
                'Hunter: 20 SaaS leads',
                'Auditor: are we in budget?',
                'Atlas: what is trending?',
              ].map((c) => (
                <button key={c} className="chip" onClick={() => send(c)}>
                  {c}
                </button>
              ))}
            </div>
            <form
              className="composer"
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Issue an order to command or the selected agent…"
              />
              <button type="submit">Dispatch</button>
            </form>
          </div>
        </div>
      </main>

      <aside className="feed">
        <div className="section-label">Live ops feed</div>
        {FEED.map((f, i) => (
          <div className="feed-item" key={i}>
            <div className="t">{f.t}</div>
            <span className="tag">{f.tag}</span>
            {f.text}
          </div>
        ))}
      </aside>
    </div>
  )
}
