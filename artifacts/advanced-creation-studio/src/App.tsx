import { type ReactNode, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Check,
  Menu,
  MoveRight,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Project = {
  name: string;
  type: string;
  year: string;
  description: string;
  url: string;
  art: 'orbit' | 'field' | 'signal' | 'frame';
};

const projects: Project[] = [
  {
    name: 'Afterglow',
    type: 'Digital identity / WebGL',
    year: '2024',
    description: 'A living launchpad for a new kind of listening experience.',
    url: 'afterglow.advancedcreationstudio.com',
    art: 'orbit',
  },
  {
    name: 'Field Notes',
    type: 'Editorial system / Product',
    year: '2024',
    description: 'Making the messy, meaningful work of climate research visible.',
    url: 'fieldnotes.advancedcreationstudio.com',
    art: 'field',
  },
  {
    name: 'Signal / 01',
    type: 'Creative technology / Installation',
    year: '2023',
    description: 'A responsive sound and light study for rooms that listen back.',
    url: 'signal01.advancedcreationstudio.com',
    art: 'signal',
  },
  {
    name: 'Morrow',
    type: 'Brand world / Commerce',
    year: '2023',
    description: 'An object-led universe for the things we carry forward.',
    url: 'morrow.advancedcreationstudio.com',
    art: 'frame',
  },
];

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="#top"
      className={`flex items-center gap-3 ${dark ? 'text-[#f2eddf]' : 'text-[#1d1a24]'}`}
      data-testid="link-logo"
      aria-label="Advanced Creation Studio home"
    >
      <span className={`grid h-9 w-9 place-items-center rounded-full border ${dark ? 'border-[#d8ff45]' : 'border-[#1d1a24]'}`}>
        <span className={`h-2.5 w-2.5 rounded-full ${dark ? 'bg-[#d8ff45]' : 'bg-[#e76f5c]'}`} />
      </span>
      <span className="text-[11px] font-semibold uppercase leading-[1.05] tracking-[.11em]">
        Advanced<br />Creation Studio
      </span>
    </a>
  );
}

function SectionLabel({ number, children, inverse = false }: { number: string; children: ReactNode; inverse?: boolean }) {
  return (
    <div className={`mono-face flex items-center gap-3 text-[10px] uppercase tracking-[.16em] ${inverse ? 'text-[#d8ff45]' : 'text-[#e76f5c]'}`}>
      <span>{number}</span>
      <span className={`h-px w-8 ${inverse ? 'bg-[#d8ff45]/60' : 'bg-[#e76f5c]/60'}`} />
      <span>{children}</span>
    </div>
  );
}

function ProjectArt({ kind }: { kind: Project['art'] }) {
  if (kind === 'orbit') {
    return (
      <div className="project-art relative h-full w-full overflow-hidden bg-[#24202e]">
        <div className="absolute inset-[14%] rounded-full border border-[#d8ff45]/50" />
        <div className="absolute inset-[25%] rounded-full border border-[#e76f5c]/65" />
        <div className="absolute left-[35%] top-[29%] h-[30%] w-[30%] rounded-full bg-[#d8ff45] shadow-[0_0_80px_rgba(216,255,69,.25)]" />
        <div className="absolute left-[8%] top-[52%] h-px w-[86%] rotate-[-25deg] bg-[#f2eddf]/50" />
        <div className="absolute right-[11%] top-[17%] h-2 w-2 rounded-full bg-[#e76f5c]" />
        <span className="mono-face absolute bottom-5 left-5 text-[9px] uppercase tracking-[.18em] text-[#f2eddf]/65">orbit / 44.2°</span>
      </div>
    );
  }
  if (kind === 'field') {
    return (
      <div className="project-art relative h-full w-full overflow-hidden bg-[#d4c8ae]">
        <div className="absolute left-[8%] top-[10%] h-[78%] w-[84%] border border-[#1d1a24]/35" />
        <div className="absolute left-[18%] top-[24%] h-[1px] w-[63%] rotate-[27deg] bg-[#e76f5c]" />
        <div className="absolute left-[15%] top-[45%] h-24 w-24 rounded-full border-[13px] border-[#1d1a24] opacity-90" />
        <div className="absolute bottom-[16%] right-[15%] h-12 w-40 border-b border-t border-[#1d1a24]" />
        <div className="absolute bottom-5 left-5 mono-face text-[9px] uppercase tracking-[.18em] text-[#1d1a24]/70">f/notes — open study</div>
      </div>
    );
  }
  if (kind === 'signal') {
    return (
      <div className="project-art relative h-full w-full overflow-hidden bg-[#e76f5c]">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 17px, #1d1a24 18px, transparent 19px)' }} />
        <div className="absolute left-[17%] top-[15%] h-[70%] w-[66%] border-[3px] border-[#d8ff45]">
          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1d1a24]" />
        </div>
        <div className="absolute bottom-5 right-5 mono-face text-[9px] uppercase tracking-[.18em] text-[#1d1a24]">signal / responsive</div>
      </div>
    );
  }
  return (
    <div className="project-art relative h-full w-full overflow-hidden bg-[#d8ff45]">
      <div className="absolute left-[12%] top-[14%] h-[72%] w-[76%] border-[2px] border-[#1d1a24]" />
      <div className="absolute left-[26%] top-[28%] h-[44%] w-[48%] bg-[#e76f5c]" />
      <div className="absolute left-[36%] top-[38%] h-[24%] w-[28%] border border-[#1d1a24] bg-[#d4c8ae]" />
      <span className="mono-face absolute bottom-5 left-5 text-[9px] uppercase tracking-[.18em] text-[#1d1a24]">morrow / objects</span>
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sent, setSent] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main id="top" className="studio-shell grain min-h-[100dvh] text-[#1d1a24]">
      <header className="absolute left-0 right-0 top-0 z-30 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Logo dark />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <a href="#studio" className="mono-face text-[10px] uppercase tracking-[.14em] text-[#f2eddf]/70 transition-colors hover:text-[#d8ff45]" data-testid="link-nav-studio">Studio</a>
          <a href="#work" className="mono-face text-[10px] uppercase tracking-[.14em] text-[#f2eddf]/70 transition-colors hover:text-[#d8ff45]" data-testid="link-nav-work">Work</a>
          <a href="#approach" className="mono-face text-[10px] uppercase tracking-[.14em] text-[#f2eddf]/70 transition-colors hover:text-[#d8ff45]" data-testid="link-nav-approach">Approach</a>
          <a href="#contact" className="group flex items-center gap-2 rounded-full border border-[#d8ff45] px-4 py-2 mono-face text-[10px] uppercase tracking-[.12em] text-[#d8ff45] transition-colors hover:bg-[#d8ff45] hover:text-[#1d1a24]" data-testid="link-nav-contact">
            Start a project <ArrowUpRight className="magnetic-arrow h-3.5 w-3.5" />
          </a>
        </nav>
        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-full border border-[#f2eddf]/40 text-[#f2eddf] md:hidden"
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      {menuOpen && (
        <div className="absolute inset-x-4 top-20 z-20 rounded-2xl border border-[#d8ff45]/60 bg-[#2a2535] p-5 shadow-2xl md:hidden" data-testid="menu-mobile">
          <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
            {['studio', 'work', 'approach', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} onClick={closeMenu} className="mono-face flex items-center justify-between border-b border-[#f2eddf]/15 pb-4 text-[11px] uppercase tracking-[.18em] text-[#f2eddf]" data-testid={`link-mobile-${item}`}>
                {item === 'contact' ? 'Start a project' : item}
                <ArrowUpRight className="h-4 w-4 text-[#d8ff45]" />
              </a>
            ))}
          </nav>
        </div>
      )}

      <section className="hero-grid relative min-h-[760px] bg-[#1d1a24] px-5 pb-16 pt-36 text-[#f2eddf] sm:px-8 lg:min-h-[820px] lg:px-12 lg:pt-44" aria-labelledby="hero-title">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between lg:min-h-[590px]">
          <div className="max-w-5xl">
            <div className="reveal-up flex items-center gap-3 text-[#d8ff45]">
              <Asterisk className="h-5 w-5" />
              <span className="mono-face text-[10px] uppercase tracking-[.18em]">Independent creative technology studio / 2025</span>
            </div>
            <h1 id="hero-title" className="display-face reveal-up reveal-delay-1 mt-7 max-w-[930px] text-[clamp(3.8rem,10vw,9.2rem)] leading-[.87]">
              Make it<br /><span className="text-[#d8ff45]">real.</span> Make it<br />remarkable.
            </h1>
          </div>
          <div className="mt-24 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
            <p className="reveal-up reveal-delay-2 max-w-[620px] text-xl leading-[1.15] text-[#f2eddf]/78 sm:text-2xl">
              Advanced Creation Studio brings the sharpness of a small team to ambitious ideas — from first signal to a digital experience people can feel.
            </p>
            <div className="reveal-up reveal-delay-3 flex items-end justify-between border-t border-[#f2eddf]/25 pt-4">
              <span className="mono-face max-w-[160px] text-[10px] uppercase leading-[1.5] tracking-[.14em] text-[#f2eddf]/55">Scroll to explore<br />the system</span>
              <a href="#studio" className="grid h-12 w-12 place-items-center rounded-full bg-[#e76f5c] text-[#1d1a24] transition-transform hover:-translate-y-1" data-testid="link-hero-scroll" aria-label="Scroll to studio">
                <ArrowDown className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="orb pointer-events-none absolute bottom-[17%] right-[7%] hidden h-24 w-24 rounded-full border border-[#e76f5c] lg:block" />
        <div className="pointer-events-none absolute bottom-[16%] right-[8.3%] hidden h-2 w-2 rounded-full bg-[#e76f5c] lg:block" />
      </section>

      <div className="overflow-hidden border-b border-[#1d1a24]/20 bg-[#d8ff45] py-3">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-8">
              <span className="mono-face text-[10px] uppercase tracking-[.2em]">Ideas with a pulse</span>
              <Asterisk className="h-4 w-4" />
              <span className="mono-face text-[10px] uppercase tracking-[.2em]">Direction / design / development</span>
              <Asterisk className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>

      <section id="studio" className="scroll-mt-8 px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
          <SectionLabel number="01">The studio</SectionLabel>
          <div>
            <h2 className="display-face max-w-4xl text-[clamp(2.8rem,6vw,6.3rem)] leading-[.91]">
              We turn the good idea in the room into the thing everyone remembers.
            </h2>
            <div className="mt-12 grid gap-8 border-t border-[#1d1a24]/20 pt-7 sm:grid-cols-2">
              <p className="text-lg leading-[1.35] text-[#1d1a24]/70">
                We are a compact, senior team for brands, founders, and cultural projects with somewhere new to go. We think in systems, but make for humans.
              </p>
              <p className="text-lg leading-[1.35] text-[#1d1a24]/70">
                Creative direction, design, development, and digital experiences — held together by one point of view. No handoffs into the fog.
              </p>
            </div>
            <figure className="mt-12 overflow-hidden border border-[#1d1a24]/20">
              <img
                src="/visuals/acs-studio-object.jpg"
                alt="A sculptural translucent object lit with chartreuse and coral light"
                className="h-auto w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
              <figcaption className="mono-face flex justify-between gap-4 border-t border-[#1d1a24]/20 px-4 py-3 text-[9px] uppercase tracking-[.14em] text-[#1d1a24]/55">
                <span>Studio material study</span><span>01 / 03</span>
              </figcaption>
            </figure>
            <a href="#contact" className="group mt-10 inline-flex items-center gap-3 border-b border-[#1d1a24] pb-2 text-sm font-semibold" data-testid="link-studio-contact">
              Bring us the hard part <ArrowUpRight className="magnetic-arrow h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-[#1d1a24]/20 bg-[#e76f5c] px-5 py-24 sm:px-8 lg:px-12 lg:py-32" aria-labelledby="capabilities-title">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <SectionLabel number="02">What we make</SectionLabel>
            <span className="mono-face text-[10px] uppercase tracking-[.14em] text-[#1d1a24]/55">One team, end to end</span>
          </div>
          <h2 id="capabilities-title" className="sr-only">Our capabilities</h2>
          <figure className="mt-14 grid overflow-hidden border border-[#1d1a24]/25 lg:grid-cols-[1.25fr_.75fr]">
            <img
              src="/visuals/acs-system-study.jpg"
              alt="Layered paper, wire, and luminous lines arranged as a tactile design system"
              className="h-full min-h-56 w-full object-cover"
            />
            <figcaption className="flex flex-col justify-between bg-[#1d1a24] p-6 text-[#f2eddf] sm:p-8">
              <span className="mono-face text-[9px] uppercase tracking-[.16em] text-[#d8ff45]">The work is the system</span>
              <span className="display-face mt-12 max-w-xs text-3xl leading-[.95]">Form, feeling, and function in the same room.</span>
            </figcaption>
          </figure>
          <div className="mt-16 grid divide-y divide-[#1d1a24]/25 border-y border-[#1d1a24]/25 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {[
              ['01', 'Creative direction', 'Find the signal. Name the feeling. Give the work a point of view that can hold up in the wild.'],
              ['02', 'Identity & design', 'Build visual systems with enough character to be recognized and enough range to stay alive.'],
              ['03', 'Digital experiences', 'Design and ship the places people meet your idea — websites, products, worlds, and everything between.'],
              ['04', 'Creative development', 'Make the beautiful thing work. Technical craft, motion, and weird little details included.'],
            ].map(([number, title, copy]) => (
              <article key={number} className="group flex min-h-[235px] flex-col justify-between p-6 transition-colors hover:bg-[#d8ff45] sm:p-8 lg:p-10" data-testid={`card-capability-${number}`}>
                <div className="flex items-start justify-between">
                  <span className="mono-face text-[10px] text-[#1d1a24]/55">{number}</span>
                  <ArrowUpRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <div>
                  <h3 className="display-face text-3xl">{title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-[1.4] text-[#1d1a24]/65">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="scroll-mt-8 bg-[#f2eddf] px-5 py-28 sm:px-8 lg:px-12 lg:py-40" aria-labelledby="work-title">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <SectionLabel number="03">Selected work</SectionLabel>
              <h2 id="work-title" className="display-face mt-7 max-w-3xl text-[clamp(3rem,7vw,7rem)] leading-[.88]">Some things<br /><span className="text-[#e76f5c]">we set in motion.</span></h2>
            </div>
            <p className="max-w-[220px] text-sm leading-[1.4] text-[#1d1a24]/60">A few worlds we have helped move from a sketch to a living URL.</p>
          </div>
          <div className="mt-20 grid gap-x-6 gap-y-16 sm:grid-cols-2">
            {projects.map((project, index) => (
              <article key={project.name} className={`project-card group ${index % 2 === 1 ? 'sm:mt-24' : ''}`} data-testid={`card-project-${project.name.toLowerCase().replaceAll(' ', '-')}`}>
                <button type="button" onClick={() => setSelectedProject(project)} className="block w-full text-left" data-testid={`button-project-${project.name.toLowerCase().replaceAll(' ', '-')}`}>
                  <div className="aspect-[1.18] overflow-hidden border border-[#1d1a24]/20">
                    <ProjectArt kind={project.art} />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="display-face text-3xl">{project.name}</h3>
                      <p className="mono-face mt-2 text-[9px] uppercase tracking-[.14em] text-[#1d1a24]/55">{project.type}</p>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#1d1a24]/30 transition-colors group-hover:border-[#1d1a24] group-hover:bg-[#d8ff45]"><ArrowUpRight className="magnetic-arrow h-4 w-4" /></span>
                  </div>
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="approach" className="scroll-mt-8 bg-[#1d1a24] px-5 py-28 text-[#f2eddf] sm:px-8 lg:px-12 lg:py-40" aria-labelledby="approach-title">
        <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
          <SectionLabel number="04" inverse>Our approach</SectionLabel>
          <div>
            <h2 id="approach-title" className="display-face max-w-4xl text-[clamp(2.9rem,6vw,6.2rem)] leading-[.9]">Small enough to care about every pixel. Serious enough to ship the whole idea.</h2>
            <figure className="mt-12 overflow-hidden border border-[#f2eddf]/20">
              <img
                src="/visuals/acs-horizon.jpg"
                alt="A luminous coral doorway opening toward a chartreuse horizon"
                className="aspect-[1.8] w-full object-cover"
              />
              <figcaption className="mono-face border-t border-[#f2eddf]/20 px-4 py-3 text-[9px] uppercase tracking-[.14em] text-[#f2eddf]/50">A way through / a way forward</figcaption>
            </figure>
            <div className="mt-16">
              {[
                ['01', 'Find the edge', 'We start with the tension in your idea — the part that feels most like you and least like everyone else.'],
                ['02', 'Make the system', 'A clear creative spine turns early sparks into a world: visual language, interaction rules, and a plan to make it real.'],
                ['03', 'Ship the feeling', 'We stay close through launch, polish the edges, and leave you with something that can keep moving without us.'],
              ].map(([number, title, copy]) => (
                <div key={number} className="grid gap-4 border-t border-[#f2eddf]/20 py-7 sm:grid-cols-[60px_1fr_1.4fr] sm:gap-8">
                  <span className="mono-face text-[10px] text-[#d8ff45]">{number}</span>
                  <h3 className="display-face text-2xl">{title}</h3>
                  <p className="max-w-md text-sm leading-[1.45] text-[#f2eddf]/60">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#1d1a24]/20 bg-[#d8ff45] px-5 py-24 sm:px-8 lg:px-12 lg:py-32" aria-labelledby="domain-title">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <SectionLabel number="05">The home base</SectionLabel>
            <h2 id="domain-title" className="display-face mt-7 max-w-2xl text-[clamp(3.2rem,7vw,7rem)] leading-[.86]">One domain.<br /><span className="text-[#e76f5c]">Many worlds.</span></h2>
          </div>
          <div>
            <p className="max-w-xl text-xl leading-[1.2] text-[#1d1a24]/75 sm:text-2xl">advancedcreationstudio.com is the front door. Every project can have its own address, its own atmosphere, its own living room.</p>
            <figure className="mt-10 overflow-hidden border border-[#1d1a24]/30">
              <img
                src="/visuals/acs-horizon.jpg"
                alt="A glowing opening representing a new project world"
                className="aspect-[1.7] w-full object-cover mix-blend-multiply"
              />
              <figcaption className="mono-face flex justify-between gap-4 border-t border-[#1d1a24]/30 px-4 py-3 text-[9px] uppercase tracking-[.14em] text-[#1d1a24]/60">
                <span>Project worlds, connected</span><span>ACS / DNS</span>
              </figcaption>
            </figure>
            <div className="mt-10 border-t border-[#1d1a24]/30 pt-5">
              <div className="mono-face flex items-center justify-between text-[10px] uppercase tracking-[.12em]">
                <span>Studio index</span><span>04 / 04</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {projects.map((project) => (
                  <button key={project.name} type="button" onClick={() => setSelectedProject(project)} className="rounded-full border border-[#1d1a24]/35 px-3 py-2 mono-face text-[9px] uppercase tracking-[.12em] transition-colors hover:bg-[#1d1a24] hover:text-[#d8ff45]" data-testid={`button-domain-${project.name.toLowerCase().replaceAll(' ', '-')}`}>
                    {project.name} ↗
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-8 bg-[#e76f5c] px-5 py-28 sm:px-8 lg:px-12 lg:py-40" aria-labelledby="contact-title">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[1fr_.65fr] lg:gap-24">
          <div>
            <SectionLabel number="06">Make contact</SectionLabel>
            <h2 id="contact-title" className="display-face mt-7 max-w-4xl text-[clamp(3.5rem,8vw,8.4rem)] leading-[.83]">Have a<br />good one?</h2>
            <p className="mt-8 max-w-md text-lg leading-[1.3] text-[#1d1a24]/72">Tell us what you are trying to make, change, or make impossible. We will tell you where to start.</p>
          </div>
          <div>
            {sent ? (
              <div className="border-t border-[#1d1a24]/30 pt-7" data-testid="status-contact-sent">
                <Check className="h-7 w-7" />
                <h3 className="display-face mt-5 text-4xl">That landed.</h3>
                <p className="mt-3 max-w-sm text-base text-[#1d1a24]/70">Your note is in the studio inbox. We will be in touch soon.</p>
                <button type="button" onClick={() => setSent(false)} className="mt-8 border-b border-[#1d1a24] pb-1 text-sm font-semibold" data-testid="button-contact-another">Send another note</button>
              </div>
            ) : (
              <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="border-t border-[#1d1a24]/30 pt-6" data-testid="form-contact">
                <label htmlFor="contact-email" className="mono-face text-[10px] uppercase tracking-[.15em]">Your email</label>
                <input id="contact-email" name="email" required type="email" placeholder="you@somewheregood.com" className="mt-5 w-full border-b border-[#1d1a24]/40 bg-transparent pb-4 text-xl outline-none placeholder:text-[#1d1a24]/40 focus:border-[#1d1a24]" data-testid="input-contact-email" />
                <label htmlFor="contact-brief" className="mono-face mt-10 block text-[10px] uppercase tracking-[.15em]">A little context</label>
                <textarea id="contact-brief" name="brief" required rows={3} placeholder="The thing we should make together is..." className="mt-5 w-full resize-none border-b border-[#1d1a24]/40 bg-transparent pb-4 text-xl outline-none placeholder:text-[#1d1a24]/40 focus:border-[#1d1a24]" data-testid="input-contact-brief" />
                <button type="submit" className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#1d1a24] px-6 py-3 text-sm font-semibold text-[#f2eddf] transition-transform hover:-translate-y-1" data-testid="button-contact-submit">
                  Send it over <MoveRight className="magnetic-arrow h-4 w-4 text-[#d8ff45]" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#1d1a24] px-5 py-10 text-[#f2eddf] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-10 sm:flex-row sm:items-end">
          <div>
            <Logo dark />
            <p className="mono-face mt-8 text-[10px] uppercase tracking-[.14em] text-[#f2eddf]/45">A small studio for large ideas.</p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <a href="mailto:hello@advancedcreationstudio.com" className="group flex items-center gap-2 text-sm hover:text-[#d8ff45]" data-testid="link-footer-email">hello@advancedcreationstudio.com <ArrowUpRight className="magnetic-arrow h-4 w-4" /></a>
            <div className="mono-face text-[9px] uppercase tracking-[.13em] text-[#f2eddf]/40">© 2025 ACS / All signals open</div>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-[1440px] justify-between border-t border-[#f2eddf]/15 pt-4 mono-face text-[9px] uppercase tracking-[.13em] text-[#f2eddf]/40">
          <span>Built for the next good thing</span>
          <a href="#top" data-testid="link-back-to-top">Back to top ↑</a>
        </div>
      </footer>

      {selectedProject && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#1d1a24]/75 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" data-testid="dialog-project">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto bg-[#f2eddf] p-5 sm:p-8">
            <button type="button" onClick={() => setSelectedProject(null)} aria-label="Close project details" className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-[#1d1a24]/30" data-testid="button-close-project"><X className="h-4 w-4" /></button>
            <div className="aspect-[1.7] pr-12"><ProjectArt kind={selectedProject.art} /></div>
            <div className="mt-7 flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="mono-face text-[9px] uppercase tracking-[.14em] text-[#e76f5c]">{selectedProject.year} / {selectedProject.type}</span>
                <h2 id="project-dialog-title" className="display-face mt-2 text-5xl">{selectedProject.name}</h2>
              </div>
              <span className="mono-face pt-2 text-[9px] uppercase tracking-[.1em] text-[#1d1a24]/55">Project index</span>
            </div>
            <p className="mt-5 max-w-lg text-lg leading-[1.3] text-[#1d1a24]/70">{selectedProject.description}</p>
            <div className="mt-8 flex items-center justify-between border-t border-[#1d1a24]/20 pt-5">
              <span className="mono-face text-[9px] uppercase tracking-[.1em] text-[#1d1a24]/55">{selectedProject.url}</span>
              <button type="button" onClick={() => setSelectedProject(null)} className="group flex items-center gap-2 text-sm font-semibold" data-testid="button-close-project-detail">Close <ArrowRight className="magnetic-arrow h-4 w-4" /></button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;