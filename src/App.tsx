import Hero from './components/Hero'
import Roadmap from './components/Roadmap'
import EvalLab from './components/EvalLab'
import Reveal from './components/Reveal'
import { Certs, Footer, Lessons, Pipeline } from './components/Sections'

function Nav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0b0c]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#c9a84c] font-mono text-[13px] font-bold text-[#0a0b0c]">
            R
          </span>
          <span className="font-mono text-[13px] font-semibold tracking-[0.18em] text-[#faf7f2] uppercase">
            RAG Roadmap
          </span>
        </a>
        <div className="hidden items-center gap-7 text-sm text-[#8f8c85] md:flex">
          <a href="#roadmap" className="transition-colors duration-200 hover:text-[#faf7f2]">
            Roadmap
          </a>
          <a href="#eval-lab" className="transition-colors duration-200 hover:text-[#faf7f2]">
            Eval Lab
          </a>
          <a href="#lessons" className="transition-colors duration-200 hover:text-[#faf7f2]">
            Lessons
          </a>
          <a href="#credentials" className="transition-colors duration-200 hover:text-[#faf7f2]">
            Credentials
          </a>
        </div>
        <a
          href="#roadmap"
          className="rounded-full bg-[#c9a84c] px-4 py-2 text-[13px] font-semibold text-[#0a0b0c] transition-all duration-200 ease-out hover:bg-[#e3c878] active:scale-[0.97]"
        >
          Start the roadmap
        </a>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-[#0a0b0c] text-[#c9c6bf]">
      <Nav />
      <Hero />
      <main>
        <Reveal>
          <Roadmap />
        </Reveal>
        <Reveal>
          <EvalLab />
        </Reveal>
        <Reveal>
          <Pipeline />
        </Reveal>
        <Reveal>
          <Lessons />
        </Reveal>
        <Reveal>
          <Certs />
        </Reveal>
      </main>
      <Footer />
    </div>
  )
}
