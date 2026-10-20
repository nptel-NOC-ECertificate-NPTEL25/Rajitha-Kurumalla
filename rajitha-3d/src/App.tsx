import { lazy, Suspense, useState } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
const HeroScene = lazy(() => import('./HeroScene'))
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight,
  Box, Building2, CheckCircle2, Download, ExternalLink,
  Layers3, Mail, Menu, MoveUpRight, X
} from 'lucide-react'
import './App.css'

const A = '/assets/'
const CURRENT_YEAR = new Date().getFullYear()

const projects = [
  {
    title: 'Multi-Storey Building',
    category: 'Structural Design',
    image: 'tekla-multistorey-model.jpg',
    number: '01',
    description: 'A multi-level structural model developed in Tekla Structural Designer, showcasing building levels and the structural framing arrangement.',
    tools: 'Tekla Structural Designer',
  },
  {
    title: 'Steel Industrial Shed',
    category: 'Steel Structures',
    image: 'tekla-pitched-roof-frame.jpg',
    number: '02',
    description: 'A pitched-roof steel frame with columns, roof members and bracing for an industrial building structure.',
    tools: 'Tekla Structural Designer',
  },
  {
    title: 'Foundation Design',
    category: 'Foundation Design',
    image: 'tekla-frame-pad-bases.jpg',
    number: '03',
    description: 'A structural frame and isolated pad foundation model illustrating the connection between column supports and foundations.',
    tools: 'Tekla Structural Designer',
  },
  {
    title: 'Structural Analysis',
    category: 'Structural Design',
    image: 'tekla-analysis-results.jpg',
    number: '04',
    description: 'Structural analysis results displaying member forces and deformation output for a framed building model.',
    tools: 'Tekla Structural Designer',
  },
  {
    title: 'Design Status Review',
    category: 'Structural Design',
    image: 'tekla-design-status.jpg',
    number: '05',
    description: 'A design status view identifying passing, failing and beyond-scope members for further engineering review.',
    tools: 'Tekla Structural Designer',
  },
  {
    title: 'Member Analysis Detail',
    category: 'Structural Design',
    image: 'tekla-analysis-results-detail.jpg',
    number: '06',
    description: 'A closer view of structural analysis results, including member moments, deflection and reaction values.',
    tools: 'Tekla Structural Designer',
  },
]

const filters = ['All Projects', 'Structural Design', 'Steel Structures', 'Foundation Design']


function App() {
  const [filter, setFilter] = useState('All Projects')
  const [selected, setSelected] = useState<(typeof projects)[number] | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleModalKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') setSelected(null)
  }

  const visibleProjects = projects.filter(
    (project) => filter === 'All Projects' || project.category === filter
  )

  const handleContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = encodeURIComponent(`Portfolio enquiry — ${data.get('name')}`)
    const body = encodeURIComponent(
      `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`
    )
    window.location.href = `mailto:rajithakurumalla@gmail.com?subject=${subject}&body=${body}`
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('rajithakurumalla@gmail.com')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = 'mailto:rajithakurumalla@gmail.com'
    }
  }

  const navLinks = [
    ['About', '#about'],
    ['Projects', '#projects'],
    ['Credentials', '#credentials'],
    ['Contact', '#contact'],
  ]

  return (
    <main>
      <div className="noise" />
      <header className="nav">
        <a className="brand" href="#home" aria-label="Rajitha home">
          <span className="brand-mark">R<span>.</span></span>
          <span className="brand-name">RAJITHA <span>KURUMALLA</span></span>
        </a>
        <nav id="primary-navigation" className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {navLinks.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <a className="nav-cta" href="#contact">Let's Connect <ArrowUpRight size={15} /></a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen} aria-controls="primary-navigation">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <motion.div className="eyebrow" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="status-dot" /> STRUCTURAL DESIGN · BIM · ENGINEERING
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.12 }}>
            Engineering<br />
            <span className="serif">the extraordinary.</span>
          </motion.h1>
          <motion.p className="hero-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            I'm Rajitha Kurumalla. I explore the intersection of structural
            engineering, digital modelling and the built environment —
            turning complex structures into clear, thoughtful designs.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <a href="#projects" className="button button-light">Explore my work <ArrowDownRight size={17} /></a>
            <a href="/assets/rajitha-kurumalla-resume.pdf" className="button button-outline" target="_blank" rel="noreferrer">
              Resume <Download size={16} />
            </a>
          </motion.div>
          <div className="hero-meta">
            <div><span className="meta-label">FOCUS</span><span>Structural modelling</span></div>
            <div><span className="meta-label">TOOLKIT</span><span>Tekla · CAD · BIM</span></div>
            <div><span className="meta-label">APPROACH</span><span>Precision by design</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-grid" />
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="scene-label scene-label-top"><span>STRUCTURE_001</span><span>3D MODEL</span></div>
          <div className="scene-canvas"><Suspense fallback={<div className="scene-fallback">Loading 3D structural model…</div>}><HeroScene /></Suspense></div>
          <div className="scene-label scene-label-bottom"><span>FRAME SYSTEM</span><span>ROTATE TO EXPLORE ↗</span></div>
          <div className="floating-tag"><Box size={15} /><span>Built in 3D</span></div>
          <div className="coordinate">X 00.12<br />Y 04.80<br />Z 12.40</div>
        </div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO DISCOVER</span><ArrowDown size={15} /></a>
      </section>

      <section className="intro section-wrap" id="about">
        <div className="section-kicker"><span>01 / THE APPROACH</span><span>ABOUT ME</span></div>
        <div className="intro-grid">
          <div className="portrait-frame">
            <img src={`${A}rajitha-portrait.jpg`} alt="Portrait of Rajitha Kurumalla" />
            <div className="portrait-caption"><span>RAJITHA KURUMALLA</span><span>STRUCTURAL DESIGN ENTHUSIAST</span></div>
          </div>
          <div className="intro-copy">
            <p className="small-overline">DESIGN MEETS ENGINEERING</p>
            <h2>Good structures<br />start with <span className="serif">good thinking.</span></h2>
            <p className="body-copy">My work focuses on understanding how structures behave, how loads travel through a frame, and how digital tools help communicate an engineering idea. I use structural modelling and analysis projects to develop practical design understanding.</p>
            <p className="body-copy">From steel frames to multi-storey models, every project is an opportunity to connect analytical thinking with the real world of construction.</p>
            <div className="skill-list">
              <span><Layers3 size={14} /> Structural modelling</span>
              <span><Building2 size={14} /> Steel & building frames</span>
              <span><Box size={14} /> 3D visualisation</span>
            </div>
            <a className="text-link" href="#projects">Discover the projects <ArrowRight size={16} /></a>
          </div>
        </div>
      </section>

      <section className="profile-section section-wrap" id="profile">
        <div className="section-kicker">
          <span>02 / QUALIFICATIONS</span>
          <span>EDUCATION & TECHNICAL PROFILE</span>
        </div>

        <div className="section-heading profile-heading">
          <div>
            <p className="small-overline">THE FOUNDATION</p>
            <h2>Knowledge into <span className="serif">practice.</span></h2>
          </div>
          <p className="heading-note">
            Civil engineering education, project-based learning and technical
            exposure supporting an entry-level career in structural detailing and BIM.
          </p>
        </div>

        <div className="profile-columns">
          <div className="profile-panel">
            <p className="small-overline">EDUCATION</p>
            <article className="profile-entry">
              <span className="profile-date">2022 — 2026</span>
              <h3>B.Tech, Civil Engineering</h3>
              <p>Aditya Engineering College</p>
              <span className="profile-result">CGPA: 7.62</span>
            </article>
            <article className="profile-entry">
              <span className="profile-date">2020 — 2022</span>
              <h3>Intermediate · MPC</h3>
              <p>Madhuri Junior College</p>
              <span className="profile-result">75%</span>
            </article>
            <article className="profile-entry">
              <span className="profile-date">2019 — 2020</span>
              <h3>SSC</h3>
              <p>ZPHS Jaddangi</p>
              <span className="profile-result">96%</span>
            </article>
          </div>

          <div className="profile-panel">
            <p className="small-overline">INTERNSHIP & PROJECT WORK</p>
            <article className="profile-entry">
              <span className="profile-date">MAY — JUN 2025</span>
              <h3>Structural Integrity Monitoring & Crack Detection Intern</h3>
              <p>Aditya University</p>
              <p className="profile-detail">
                Eight-week internship focused on crack detection, structural
                health monitoring, crack patterns and reinforced-concrete failure behaviour.
              </p>
            </article>
            <article className="profile-entry">
              <span className="profile-date">ACADEMIC PROJECT</span>
              <h3>Glass Fibre Reinforced Concrete Beams</h3>
              <p className="profile-detail">
                Studied strength and crack behaviour at varying glass-fibre proportions.
                The project identified 1% glass fibre as the best-performing proportion
                among the proportions tested.
              </p>
            </article>
            <article className="profile-entry">
              <span className="profile-date">40 HOURS · SEP 2025</span>
              <h3>Tekla Structural Design & Analysis</h3>
              <p>Vaanahaa Education and Innovation Labs</p>
              <p className="profile-detail">
                Project-based learning in steel-frame and multi-storey building modelling.
              </p>
            </article>
          </div>
        </div>

        <div className="technical-profile">
          <div>
            <p className="small-overline">SOFTWARE & TOOLS</p>
            <h3>Technical toolkit</h3>
            <p className="profile-detail">
              Familiarity based on the skills listed in the resume; proficiency
              levels are not independently assessed.
            </p>
          </div>
          <div className="technical-tags">
            <span>Tekla Structures</span>
            <span>Tekla Structural Designer</span>
            <span>AutoCAD</span>
            <span>Revit</span>
            <span>ETABS</span>
            <span>STAAD.Pro</span>
            <span>SketchUp</span>
            <span>BIM Fundamentals</span>
            <span>Microsoft Excel</span>
            <span>Microsoft Word</span>
            <span>PowerPoint</span>
            <span>Structural Detailing Fundamentals</span>
            <span>Concrete Testing Concepts</span>
            <span>Structural Health Monitoring</span>
          </div>
        </div>

        <div className="training-strip">
          <p className="small-overline">ADDITIONAL LEARNING</p>
          <div><span>2024</span><strong>Building Information Modelling in AEC</strong><small>L&T EduTech · Feb–Aug 2024</small></div>
          <div><span>2024</span><strong>Structural Analysis Using ETABS</strong><small>APSSDC, Aditya University · Sep–Oct 2024</small></div>
          <div><span>2023</span><strong>3D Modelling Using SketchUp</strong><small>Sreshta Engineers / Aditya Engineering College · Aug 2023</small></div>
          <div><span>2026</span><strong>AutoCAD Essentials</strong><small>SourceCAD / LinkedIn Learning · Sep 2026</small></div>
        </div>

        <p className="profile-membership">
          Professional membership: Indian Concrete Institute (ICI) Student Member ·
          Oct 2023 – Sep 2026
        </p>
      </section>

      <section className="projects-section section-wrap" id="projects">
        <div className="section-kicker"><span>02 / SELECTED WORK</span><span>PROJECT ARCHIVE</span></div>
        <div className="section-heading">
          <div><p className="small-overline">A STUDY IN STRUCTURE</p><h2>Work in <span className="serif">progress.</span></h2></div>
          <p className="heading-note">A collection of structural modelling, analysis and design studies developed in Tekla Structural Designer.</p>
        </div>
        <div className="filters">
          {filters.map((item) => (
            <button key={item} className={filter === item ? 'filter active' : 'filter'} onClick={() => setFilter(item)}>{item}</button>
          ))}
          <span className="project-count">{String(visibleProjects.length).padStart(2, '0')} PROJECTS</span>
        </div>
        <motion.div layout className="project-grid">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project) => (
              <motion.article layout key={project.number} className="project-card" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
                <button className="project-image" onClick={() => setSelected(project)} aria-label={`View ${project.title}`}>
                  <img src={`${A}${project.image}`} alt={project.title} loading="lazy" />
                  <span className="image-index">{project.number} / 06</span>
                  <span className="image-open"><MoveUpRight size={20} /></span>
                </button>
                <div className="project-info">
                  <div><span className="project-category">{project.category}</span><h3>{project.title}</h3></div>
                  <button className="project-arrow" onClick={() => setSelected(project)} aria-label={`Open ${project.title}`}><ArrowUpRight size={19} /></button>
                </div>
                <p className="project-tool">{project.tools}</p>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <section className="credentials section-wrap" id="credentials">
        <div className="section-kicker"><span>03 / LEARNING</span><span>TECHNICAL DEVELOPMENT</span></div>
        <div className="credential-grid">
          <div className="credential-copy">
            <p className="small-overline">BUILDING CAPABILITY</p>
            <h2>Learning through<br /><span className="serif">real projects.</span></h2>
            <p className="body-copy">Practical project-based learning in structural design and analysis, supported by digital modelling exercises.</p>
            <div className="credential-line"><CheckCircle2 size={17} /><div><strong>Structural Design & Analysis using Tekla Structural Designer</strong><span>Project-Based Learning Program · 40 hours</span></div></div>
            <div className="credential-line"><CheckCircle2 size={17} /><div><strong>Structural modelling and design review</strong><span>Frame systems · Analysis results · Foundation models</span></div></div>
            <a className="text-link" href={`${A}tekla-certificate.jpg`} target="_blank" rel="noreferrer">View certificate <ExternalLink size={15} /></a>
          </div>
          <button className="certificate-preview" onClick={() => setSelected({ title: 'Tekla Structural Design Certificate', category: 'Certificate', image: 'tekla-certificate.jpg', number: 'C1', description: 'Certificate of completion for a 40-hour Project Based Learning Program on Structural Design and Analysis using Tekla Structural Designer.', tools: 'Vaanahaa Education and Innovation Labs' })}>
            <img src={`${A}tekla-certificate.jpg`} alt="Certificate of completion for Tekla Structural Design and Analysis" loading="lazy" />
            <span className="certificate-overlay">VIEW CREDENTIAL <ArrowUpRight size={16} /></span>
          </button>
        </div>
      </section>

      <section className="contact-section section-wrap" id="contact">
        <div className="section-kicker"><span>04 / GET IN TOUCH</span><span>CONTACT</span></div>
        <div className="contact-grid">
          <div>
            <p className="small-overline">HAVE A PROJECT IN MIND?</p>
            <h2>Let's build<br />something <span className="serif">meaningful.</span></h2>
            <p className="body-copy">Interested in structural design, engineering projects or professional collaboration? Start a conversation.</p>
            <button className="email-link" onClick={copyEmail}><Mail size={17} /> {copied ? 'Copied to clipboard' : 'rajithakurumalla@gmail.com'} <ArrowUpRight size={16} /></button>
          </div>
          <form className="contact-form" onSubmit={handleContact}>
            <label>Your name<input name="name" placeholder="How should I address you?" required /></label>
            <label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
            <label>Tell me about it<textarea name="message" rows={4} placeholder="A little about your project..." required /></label>
            <button className="button button-light" type="submit">Prepare email <ArrowUpRight size={16} /></button>
            <p className="form-note">Opens your default email application.</p>
          </form>
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="#home"><span className="brand-mark">R<span>.</span></span><span className="brand-name">RAJITHA <span>KURUMALLA</span></span></a>
        <span>STRUCTURE · PRECISION · POSSIBILITY</span>
        <div className="footer-links">
          <a href="https://linkedin.com/in/rajitha-kurumalla" target="_blank" rel="noreferrer">LINKEDIN <ExternalLink size={13} /></a>
          <a href="mailto:rajithakurumalla@gmail.com">EMAIL <Mail size={13} /></a>
          <a href="#home" className="back-top">BACK TO TOP <ArrowUpRight size={14} /></a>
        </div>
        <span className="copyright">© {CURRENT_YEAR} RAJITHA KURUMALLA</span>
      </footer>

      <AnimatePresence>
        {selected && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
            <motion.div className="project-modal" role="dialog" aria-modal="true" aria-label={selected.title} onKeyDown={handleModalKeyDown} initial={{ opacity: 0, y: 25, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15 }} onClick={(event) => event.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close project"><X size={20} /></button>
              <img src={`${A}${selected.image}`} alt={selected.title} />
              <div className="modal-content">
                <span className="project-category">{selected.category} · {selected.number}</span>
                <h2>{selected.title}</h2>
                <p>{selected.description}</p>
                <span className="modal-tool">TOOLS / {selected.tools}</span>
                <a href={`${A}${selected.image}`} target="_blank" rel="noreferrer" className="text-link">Open full image <ExternalLink size={15} /></a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
