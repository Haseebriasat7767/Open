export const AGENTS = [
  {
    id: 'neural',
    name: 'NEURAL',
    role: 'AI Model Bridge',
    initials: 'NR',
    color: '#9b7dff',
    duty: 'Routes your orders to Claude, GPT, Gemini and other models. Drafts, reasons, codes, and synthesizes answers under your command.',
    access: ['Claude', 'GPT-class models', 'Local LLMs', 'Prompt vault'],
  },
  {
    id: 'scout',
    name: 'SCOUT',
    role: 'Web & Surface Intel',
    initials: 'SC',
    color: '#4fd1c5',
    duty: 'Sees and handles the web: search, competitor pages, SERP shifts, site health, and anything you ask it to watch.',
    access: ['Web search', 'Site crawl notes', 'Watchlists', 'Page snapshots'],
  },
  {
    id: 'hunter',
    name: 'HUNTER',
    role: 'Lead Generation',
    initials: 'HT',
    color: '#ff9f43',
    duty: 'Builds pipeline: ICP lists, outbound angles, enrichment, and weekly lead batches for your business.',
    access: ['ICP playbooks', 'Lead lists', 'Outreach sequences', 'CRM notes'],
  },
  {
    id: 'liaison',
    name: 'LIAISON',
    role: 'Clients & Platforms',
    initials: 'LN',
    color: '#ff6b9d',
    duty: 'Talks to clients in your voice and drafts posts for social and every connected platform — you approve before anything goes live.',
    access: ['Inbox drafts', 'Social calendars', 'Client threads', 'Platform queue'],
  },
  {
    id: 'atlas',
    name: 'ATLAS',
    role: 'Research & Opportunity',
    initials: 'AT',
    color: '#54a0ff',
    duty: 'Skill improvement, trend radar, and how to grab the next opportunity for the business.',
    access: ['Trend briefs', 'Skill tracks', 'Opportunity map', 'Competitor intel'],
  },
  {
    id: 'auditor',
    name: 'AUDITOR',
    role: 'Performance & Budget',
    initials: 'AD',
    color: '#e8c547',
    duty: 'Audits overall performance: what is in budget, what is leaking, KPIs vs plan, and weekly scorecards.',
    access: ['Budget ledger', 'KPI scorecard', 'Burn vs plan', 'Risk flags'],
  },
]

export const KPIS = [
  { n: '6', l: 'Agents online' },
  { n: '42', l: 'Leads in pipeline' },
  { n: '$8.4k', l: 'Budget remaining' },
  { n: '91', l: 'Ops health score' },
]

export const FEED = [
  { t: 'AUDITOR · 2m', tag: 'BUDGET', text: 'Ad spend is 12% under weekly cap. Room to test one more Hunter sequence.' },
  { t: 'HUNTER · 11m', tag: 'LEADS', text: '18 new ICP matches in SaaS ops. 6 scored A-tier. Awaiting your dispatch.' },
  { t: 'ATLAS · 28m', tag: 'TREND', text: 'Short-form B2B teardown content is spiking. Window ~10 days before saturation.' },
  { t: 'LIAISON · 1h', tag: 'CLIENT', text: 'Draft reply for Acme renewal sitting in queue. Tone: firm, generous on timeline.' },
  { t: 'SCOUT · 2h', tag: 'WEB', text: 'Competitor pricing page changed overnight. Atlas tagged for opportunity brief.' },
  { t: 'NEURAL · 3h', tag: 'MODEL', text: 'Claude brief compiled for tomorrow’s product narrative. Ready on command.' },
]

const replies = {
  neural: (q) =>
    `NEURAL standing by. I would route this through Claude for reasoning, then a second pass for tightness.\n\nOrder received: “${q}”\n\nDeliverable: structured answer + options A/B, no live API keys stored in this demo. Wire your model keys in Settings when you go live.`,
  scout: (q) =>
    `SCOUT on the surface. I would search, snapshot, and watch.\n\nQuery: “${q}”\n\nPlan: 1) web scan  2) competitor delta  3) watchlist. This HQ is a command simulation — connect search later for live pages.`,
  hunter: (q) =>
    `HUNTER loaded. Building leads under your ICP.\n\nBrief: “${q}”\n\nToday’s batch (demo): 12 A-tier, 18 B-tier. Channels: LinkedIn + warm intro. Nothing sends without your yes.`,
  liaison: (q) =>
    `LIAISON here. Clients and platforms stay in draft until you approve.\n\nAsk: “${q}”\n\nI would queue: 1 client reply, 2 social posts, 1 follow-up. You remain the only publisher.`,
  atlas: (q) =>
    `ATLAS on research. Skills, trends, grab-shots.\n\nFocus: “${q}”\n\nSignal: demand is moving toward proof-led content and faster delivery. Opportunity: ship a 7-day skill sprint + one public teardown.`,
  auditor: (q) =>
    `AUDITOR on the books.\n\nAsk: “${q}”\n\nScorecard (demo): health 91, remaining $8.4k, ads under cap, Hunter ROI watch. Flag: do not add a seventh tool this month.`,
  command: (q) =>
    `COMMAND received. I am your personal assistant. Six agents execute only on your order.\n\n“${q}”\n\nI will split this: NEURAL reasons, SCOUT checks the web, HUNTER fills pipeline, LIAISON drafts client/social, ATLAS hunts the trend, AUDITOR keeps budget honest. Pick an agent on the left or keep commanding me.`,
}

export function replyFor(agentId, q) {
  const fn = replies[agentId] || replies.command
  return fn(q)
}
