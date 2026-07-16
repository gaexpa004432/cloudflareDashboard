import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'

const projectData = [
  { id: 1, name: 'Syncly', type: 'Team workflow platform', stack: 'Spring Boot · React · MySQL', copy: 'A calm collaboration space that turns scattered requests into a focused weekly flow.' },
  { id: 2, name: 'Mori', type: 'Personal finance service', stack: 'Java · Oracle · Docker', copy: 'A practical money journal with clear spending patterns and private, reliable data.' },
  { id: 3, name: 'Hush', type: 'AI voice notes', stack: 'OpenAI · Whisper · React', copy: 'Fast, searchable voice capture for the thoughts that happen away from a keyboard.' },
]

const responses = {
  help: 'Available: about, career, skills, projects, project 1-3, contact, github, blog, resume, whoami, date, pwd, ls, cat [file], history, theme [dark|light], neofetch, clear, exit',
  about: 'Backend developer who enjoys building dependable systems and small, thoughtful interfaces. Based in Seoul.',
  career: '2024—now  Backend Developer  /  Building resilient internal tools\n2022—2024  Software Engineer / Shipping web services end to end',
  skills: 'BACKEND  Java · Spring · Spring Boot · MyBatis · Oracle · MySQL\nFRONTEND React · JavaScript · HTML · CSS\nDEVOPS    Git · Docker · Linux\nAI        OpenAI API · Whisper · OpenClaw',
  projects: '01  Syncly — team workflow platform\n02  Mori — personal finance service\n03  Hush — AI voice notes\n\nType project 1, 2, or 3 to explore.',
  contact: 'hello@yourdomain.dev\nSeoul, Republic of Korea',
  github: 'github.com/yourhandle',
  blog: 'blog.yourdomain.dev',
  resume: 'Opening resume preview…',
  whoami: 'visitor@cozy-room',
  pwd: 'C:\\Users\\visitor\\portfolio',
  ls: 'about.txt  career.txt  skills.txt  projects.txt  resume.pdf',
  'cat about.txt': 'A backend developer with a soft spot for clean APIs and warm interfaces.',
  'cat career.txt': '2024—now Backend Developer\n2022—2024 Software Engineer',
  'cat skills.txt': 'Java, Spring Boot, MySQL, React, Docker, Linux, OpenAI API',
  'cat projects.txt': 'Syncly\nMori\nHush',
  neofetch: "          .-''-.\n       .'  _  `-.     visitor@cozy-room\n      /   (o)   \\    -------------------\n     |     _     |    OS: Seoul Night 1.0\n      \\  `-'  /     Shell: cozy.exe\n       `-.__.-'      Theme: warm amber",
}

function Terminal({ onClose, onProject, onResume }) {
  const [lines, setLines] = useState(['Microsoft Windows [Version 11.0.22631.0]', '(c) Cozy Room Studio. All rights reserved.', '', 'Type “help” to see what is available.'])
  const [command, setCommand] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [light, setLight] = useState(false)
  const input = useRef(null)
  const log = useRef(null)

  useEffect(() => { input.current?.focus() }, [])
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' }) }, [lines])
  const execute = (raw) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    const added = [...lines, `C:\\Users\\visitor> ${raw}`]
    if (cmd === 'clear') setLines([])
    else if (cmd === 'exit') { setLines([...added, 'Closing terminal…']); setTimeout(onClose, 350) }
    else if (cmd === 'date') setLines([...added, new Date().toString()])
    else if (cmd === 'history') setLines([...added, history.map((item, i) => `${i + 1}  ${item}`).join('\n') || 'No previous commands.'])
    else if (cmd === 'theme light' || cmd === 'theme dark') { setLight(cmd.endsWith('light')); setLines([...added, `Terminal theme changed to ${cmd.split(' ')[1]}.`]) }
    else if (/^project [1-3]$/.test(cmd)) { const id = Number(cmd.at(-1)); setLines([...added, `Opening project ${id}…`]); setTimeout(() => onProject(id), 250) }
    else if (cmd === 'resume') { setLines([...added, responses.resume]); setTimeout(onResume, 350) }
    else setLines([...added, responses[cmd] || `‘${raw}’ is not recognized. Type help for commands.`])
    setHistory((old) => [...old, raw]); setHistoryIndex(-1); setCommand('')
  }
  return <div className={`terminal-modal ${light ? 'terminal-light' : ''}`} onClick={() => input.current?.focus()}>
    <div className="terminal-bar"><span><i></i><i></i><i></i> visitor@cozy-room — terminal</span><button onClick={onClose}>×</button></div>
    <div className="terminal-log" ref={log}>{lines.map((line, index) => <pre key={index}>{line}</pre>)}
      <div className="terminal-input"><span>C:\Users\visitor&gt;</span><input ref={input} value={command} onChange={(e) => setCommand(e.target.value)} onKeyDown={(e) => {
        if (e.key === 'Enter') execute(command)
        if (e.key === 'ArrowUp') { e.preventDefault(); const next = Math.min(historyIndex + 1, history.length - 1); setHistoryIndex(next); setCommand(history[history.length - 1 - next] || '') }
        if (e.key === 'ArrowDown') { e.preventDefault(); const next = Math.max(historyIndex - 1, -1); setHistoryIndex(next); setCommand(next < 0 ? '' : history[history.length - 1 - next]) }
        if (e.key === 'Tab') { e.preventDefault(); const match = Object.keys(responses).find((key) => key.startsWith(command.toLowerCase())); if (match) setCommand(match) }
      }} /><b></b></div>
    </div>
  </div>
}

function ProjectPage() {
  const navigate = useNavigate()
  const id = Number(location.pathname.split('/').at(-1))
  const project = projectData.find((item) => item.id === id) || projectData[0]
  return <main className="project-page"><button className="back" onClick={() => navigate('/')}>← Back to room</button><div className="project-card"><p className="eyebrow">SELECTED PROJECT / 0{project.id}</p><h1>{project.name}</h1><p className="lead">{project.copy}</p><div className="project-grid"><section><h2>Overview</h2><p>{project.type}. Designed with an emphasis on clarity, trust, and room to grow.</p></section><section><h2>Tech stack</h2><p>{project.stack}</p></section><section><h2>Key features</h2><p>Reliable API design, intentional UI states, and a deployment-ready delivery flow.</p></section><section><h2>What I learned</h2><p>Simple interfaces get better when the system underneath is carefully considered.</p></section></div></div></main>
}

function Room() {
  const navigate = useNavigate(); const [terminal, setTerminal] = useState(false); const [lit, setLit] = useState(true); const [weather, setWeather] = useState('rain'); const [bubble, setBubble] = useState(''); const [modal, setModal] = useState(''); const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const words = ['Need coffee…', 'Another bug…', 'Build succeeded.', 'meow.', 'Ship it.']
  const catClick = () => { setBubble(words[Math.floor(Math.random() * words.length)]); setTimeout(() => setBubble(''), 2600) }
  return <main className={`room ${lit ? '' : 'lights-off'} weather-${weather}`} onMouseMove={(e) => setMouse({ x: (e.clientX / innerWidth - .5) * 10, y: (e.clientY / innerHeight - .5) * 10 })}>
    <header><Link to="/" className="brand">JIHO<span>’s room</span></Link><p>backend developer · seoul</p><button className="sound" aria-label="Toggle sound">⌁</button></header>
    <div className="room-scene" style={{ '--mx': `${mouse.x}px`, '--my': `${mouse.y}px` }}>
      <div className="wall"></div><button className="window interactive" onClick={() => setModal('weather')} aria-label="Change window weather"><div className="sky"><span className="moon"></span><span className="cloud c1"></span><span className="cloud c2"></span><div className="city"></div><div className="rain"></div></div><small>window / weather</small></button>
      <div className="shelf interactive" onClick={() => setModal('career')} role="button" tabIndex="0"><span className="shelf-label">CAREER<br />SHELF</span><i></i><i></i><i></i><i></i><i></i><small>career</small></div>
      <div className="bed"><div className="pillow"></div><div className="blanket"></div></div><div className="lamp interactive" onClick={() => setLit(!lit)} role="button" tabIndex="0"><div></div><i></i><small>lamp</small></div>
      <div className="desk"><div className="desktop"></div><div className="leg l1"></div><div className="leg l2"></div><button className="resume interactive" onClick={() => setModal('resume')}><em>RESUME</em><b>JIHO KIM</b><small>resume</small></button><div className="book"></div><div className="mug">☕</div><div className="keyboard"><i></i><i></i><i></i><i></i><i></i><i></i></div><div className="mouse"></div></div>
      <button className="computer interactive" onClick={() => setTerminal(true)} aria-label="Open terminal"><div className="monitor top"><span>◌ system ready</span></div><div className="monitor bottom"><span>C:\_</span></div><div className="stand"></div><small>pc / terminal</small></button>
      <div className="plant"><i></i><i></i><i></i><b></b></div><button className="cat interactive" onClick={catClick} aria-label="Pet the cat"><div className="cat-tail"></div><div className="cat-body"><i></i><i></i><b></b></div><small>cat</small>{bubble && <span className="bubble">{bubble}</span>}</button>
    </div>
    <footer><span>click the objects</span><span>01:42 AM · {weather}</span></footer>
    {terminal && <Terminal onClose={() => setTerminal(false)} onProject={(id) => navigate(`/project/${id}`)} onResume={() => setModal('resume')} />}
    {modal && <div className="overlay" onClick={() => setModal('')}><div className="info-modal" onClick={(e) => e.stopPropagation()}><button onClick={() => setModal('')}>×</button>{modal === 'weather' && <><p className="eyebrow">OUTSIDE THE WINDOW</p><h2>Set the weather</h2><div className="choices">{['rain', 'night', 'snow', 'sunny'].map((item) => <button key={item} onClick={() => { setWeather(item); setModal('') }}>{item}</button>)}</div></>}{modal === 'career' && <><p className="eyebrow">CAREER TIMELINE</p><h2>Crafting calm software</h2><div className="timeline"><p><b>2024 — now</b>Backend Developer<br />Building dependable internal systems.</p><p><b>2022 — 2024</b>Software Engineer<br />Shipped customer-facing web services.</p></div></>}{modal === 'resume' && <><p className="eyebrow">RESUME</p><h2>Jiho Kim</h2><iframe className="resume-preview" src="/resume.pdf" title="Resume PDF preview" /><a className="download" href="/resume.pdf" download>Download PDF ↓</a></>}</div></div>}
  </main>
}

export default function App() { return <BrowserRouter><Routes><Route path="/" element={<Room />} /><Route path="/project/:id" element={<ProjectPage />} /></Routes></BrowserRouter> }
