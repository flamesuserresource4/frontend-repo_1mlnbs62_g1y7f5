import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Nav({ links }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/70 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          <img src="/logo.svg" alt="Qarakal" className="h-8 w-8" />
          <span className="font-semibold tracking-tight text-gray-900">Qarakal</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-700">
          {links?.map((l, i) => (
            <a key={i} href={l.href || '#'} className="hover:text-gray-900 transition-colors">{l.label}</a>
          ))}
          <a href="#contact" className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-black">Contact</a>
        </nav>
      </div>
    </header>
  )
}

function Hero({ title, subtitle }) {
  return (
    <section id="home" className="relative isolate pt-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(75%_60%_at_50%_0%,rgba(59,130,246,0.35),transparent)]" />
      <div className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
          {title || 'Quantitative Computing for the Frontier'}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-blue-100/90 leading-relaxed max-w-3xl mx-auto">
          {subtitle || 'We build high-performance AI and systems for capital and computation.'}
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a href="#contact" className="px-5 py-3 rounded-lg bg-white text-gray-900 font-medium shadow-sm hover:shadow transition">Get in touch</a>
          <a href="#about" className="px-5 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10 transition">Learn more</a>
        </div>
      </div>
    </section>
  )
}

function Section({ title, body }) {
  if (!title && !body) return null
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 border-t border-gray-200">
      {title && <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{title}</h2>}
      {body && <p className="mt-4 text-gray-600 leading-7 whitespace-pre-line">{body}</p>}
    </section>
  )
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' })
  const [status, setStatus] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`${BACKEND}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Failed to submit')
      setStatus('sent')
      setForm({ name: '', email: '', company: '', message: '' })
    } catch (e) {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Let’s build together</h3>
          <p className="mt-4 text-gray-600">Tell us about your problem space and we’ll share how our quantitative systems and AI infrastructure can help.</p>
          <ul className="mt-6 space-y-2 text-gray-700">
            <li>• Research partnerships</li>
            <li>• Applied AI systems</li>
            <li>• Infrastructure and performance</li>
          </ul>
        </div>
        <form onSubmit={submit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-slate-900" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-slate-900" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-slate-900" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea rows="4" className="mt-1 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-slate-900" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required />
            </div>
          </div>
          <button disabled={status==='sending'} className="mt-4 w-full rounded-lg bg-gray-900 text-white py-2.5 hover:bg-black disabled:opacity-60">{status==='sending'?'Sending...':'Send message'}</button>
          {status==='sent' && <p className="text-green-600 text-sm mt-3">Thanks — we’ll be in touch soon.</p>}
          {status==='error' && <p className="text-red-600 text-sm mt-3">Something went wrong. Please try again.</p>}
        </form>
      </div>
    </section>
  )
}

export default function App() {
  const [content, setContent] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${BACKEND}/api/scrape`)
        const data = await res.json()
        setContent(data)
      } catch (e) {
        setContent(null)
      }
    }
    load()
  }, [])

  const links = content?.nav?.length ? content.nav : [
    { label: 'About', href: '#about' },
    { label: 'Research', href: '#research' },
    { label: 'Careers', href: '#careers' },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav links={links} />
      <Hero title={content?.hero?.heading || content?.title} subtitle={content?.hero?.subheading || content?.description} />

      <section id="about">
        <Section title={content?.sections?.[0]?.title || 'About'} body={content?.sections?.[0]?.body} />
      </section>

      {content?.sections?.slice(1, 4)?.map((s, i) => (
        <Section key={i} title={s.title} body={s.body} />
      ))}

      <section id="careers">
        <Section title={"Careers"} body={"We’re always looking for exceptional builders across research, engineering, and systems. If you love hard problems and elegant systems, reach out."} />
      </section>

      <Contact />

      <footer className="mt-16 border-t border-gray-200">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-gray-500 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Qarakal. All rights reserved.</p>
          <a href="#home" className="hover:text-gray-700">Back to top</a>
        </div>
      </footer>
    </div>
  )
}
