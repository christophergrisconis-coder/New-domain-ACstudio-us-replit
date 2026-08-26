import { type ReactNode, useEffect, useRef, useState } from 'react';
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
import { CinematicBackground } from '@/components/cinematic-background';
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
  image: string;
  imageAlt: string;
  accent: string;
};

const projects: Project[] = [
  {
    name: 'Afterglow',
    type: 'Digital identity / WebGL',
    year: '2024',
    description: 'A living launchpad for a new kind of listening experience.',
    url: 'afterglow.advancedcreationstudio.com',
    image: '/visuals/acs-ai-collaboration.jpg',
    imageAlt: 'A creative team collaborating around AI-assisted data visualizations',
    accent: '#d8ff45',
  },
  {
    name: 'Field Notes',
    type: 'Editorial system / Product',
    year: '2024',
    description: 'Making the messy, meaningful work of climate research visible.',
    url: 'fieldnotes.advancedcreationstudio.com',
    image: '/visuals/acs-app-building.jpg',
    imageAlt: 'Hands sketching app flows and responsive website wireframes beside a laptop',
    accent: '#e76f5c',
  },
  {
    name: 'Signal / 01',
    type: 'Creative technology / Installation',
    year: '2023',
    description: 'A responsive sound and light study for rooms that listen back.',
    url: 'signal01.advancedcreationstudio.com',
    image: '/visuals/acs-future-signal.jpg',
    imageAlt: 'A prototype website being presented to a collaborative makerspace group',
    accent: '#d8ff45',
  },
  {
    name: 'Morrow',
    type: 'Brand world / Commerce',
    year: '2023',
    description: 'An object-led universe for the things we carry forward.',
    url: 'morrow.advancedcreationstudio.com',
    image: '/visuals/acs-access-design.jpg',
    imageAlt: 'Hands arranging tactile interface cards and adaptive technology tools',
    accent: '#e76f5c',
  },
];

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

function ScrollEngine() {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(3));
      const parallaxY = Math.max(-24, Math.min(24, window.scrollY * -0.012));
      document.documentElement.style.setProperty('--parallax-y', `${parallaxY}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="#top"
      className={`focus-ring flex items-center gap-3 ${dark ? 'text-[#eee7d5]' : 'text-[#0a0a0a]'}`}
      data-testid="link-logo"
      aria-label="Advanced Creation Studio home"
    >
      <span className={`grid h-9 w-9 place-items-center rounded-full border ${dark ? 'border-[#d8ff45]' : 'border-[#0a0a0a]'}`}>
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

function Reveal({ children, className = '', delay = '' }: { children: ReactNode; className?: string; delay?: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} ${delay} ${className}`}>{children}</div>;
}

function ImageChapter({
  src,
  alt,
  label,
  caption,
  className = '',
  imageClassName = '',
}: {
  src: string;
  alt: string;
  label: string;
  caption: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <figure className={`image-frame relative ${className}`}>
      <div className="motion-picture absolute inset-0" aria-hidden="true">
        <span className="motion-picture-sheen" />
      </div>
      <img src={src} alt={alt} className={`editorial-image parallax-media motion-picture-image h-full w-full object-cover ${imageClassName}`} />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#0a0a0a]/75 to-transparent px-4 pb-4 pt-14 text-[#eee7d5]">
        <span className="mono-face text-[9px] uppercase tracking-[.13em]">{label}</span>
        <span className="max-w-[175px] text-right text-xs italic leading-[1.1]">{caption}</span>
      </figcaption>
    </figure>
  );
}

function ProjectArt({ project }: { project: Project }) {
  return (
    <div className="project-art relative h-full w-full overflow-hidden bg-[#0a0a0a]">
      <img src={project.image} alt={project.imageAlt} className="motion-picture-image h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#0a0a0a]/10 mix-blend-multiply" />
      <span className="mono-face absolute bottom-4 left-4 bg-[#eee7d5] px-2 py-1 text-[9px] uppercase tracking-[.15em] text-[#0a0a0a]">{project.year} / {project.name}</span>
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main id="top" className="studio-shell grain min-h-[100dvh] text-[#0a0a0a]">
      <ScrollEngine />
      <header className="absolute left-0 right-0 top-0 z-30 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Logo dark />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          <a href="#studio" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/70 transition-colors hover:text-[#d8ff45]" data-testid="link-nav-studio">Studio</a>
          <a href="#work" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/70 transition-colors hover:text-[#d8ff45]" data-testid="link-nav-work">Work</a>
          <a href="#approach" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/70 transition-colors hover:text-[#d8ff45]" data-testid="link-nav-approach">Approach</a>
          <a href="#contact" className="focus-ring group flex items-center gap-2 rounded-full border border-[#d8ff45] px-4 py-2 mono-face text-[10px] uppercase tracking-[.12em] text-[#d8ff45] transition-colors hover:bg-[#d8ff45] hover:text-[#0a0a0a]" data-testid="link-nav-contact">
            Start a project <ArrowUpRight className="magnetic-arrow h-3.5 w-3.5" />
          </a>
        </nav>
        <button
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-[#eee7d5]/40 text-[#eee7d5] md:hidden"
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      {menuOpen && (
        <div className="absolute inset-x-4 top-20 z-20 rounded-xl border border-[#d8ff45]/60 bg-[#332b40] p-5 shadow-2xl md:hidden" data-testid="menu-mobile">
          <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
            {['studio', 'work', 'approach', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} onClick={closeMenu} className="focus-ring mono-face flex items-center justify-between border-b border-[#eee7d5]/15 pb-4 text-[11px] uppercase tracking-[.18em] text-[#eee7d5]" data-testid={`link-mobile-${item}`}>
                {item === 'contact' ? 'Start a project' : item}
                <ArrowUpRight className="h-4 w-4 text-[#d8ff45]" />
              </a>
            ))}
          </nav>
        </div>
      )}

      <section className="hero-grid relative min-h-[820px] px-5 pb-16 pt-36 text-[#eee7d5] sm:px-8 lg:min-h-[950px] lg:px-12 lg:pt-44" aria-labelledby="hero-title">
        <div className="hero-ambient pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <CinematicBackground />
        </div>
        <div className="editorial-wrap relative flex min-h-[650px] flex-col justify-between">
          <div className="relative z-10 max-w-6xl">
            <Reveal className="flex items-center gap-3 text-[#d8ff45]">
              <Asterisk className="h-5 w-5" />
              <span className="mono-face text-[10px] uppercase tracking-[.18em]">Independent creative technology studio / 2025</span>
            </Reveal>
            <Reveal delay="reveal-delay-1">
              <h1 id="hero-title" className="display-face hero-giant mt-9 max-w-[1100px]">
                Make it <span className="serif-face font-normal italic text-[#d8ff45]">real.</span><br />
                Make it<br />
                <span className="relative inline-block">remarkable<span className="absolute -right-3 -top-3 h-3 w-3 rounded-full bg-[#e76f5c] sm:-right-6 sm:-top-5 sm:h-5 sm:w-5" /></span>
              </h1>
            </Reveal>
          </div>
          <div className="relative z-10 mt-20 grid gap-10 lg:grid-cols-[1fr_280px] lg:items-end">
            <Reveal delay="reveal-delay-2">
              <p className="max-w-[620px] text-xl leading-[1.1] text-[#eee7d5]/76 sm:text-2xl">
                Advanced Creation Studio brings the sharpness of a small team to ambitious ideas — from first signal to a digital experience people can feel.
              </p>
            </Reveal>
            <Reveal delay="reveal-delay-3" className="flex items-end justify-between border-t border-[#eee7d5]/25 pt-4">
              <span className="mono-face max-w-[150px] text-[10px] uppercase leading-[1.5] tracking-[.14em] text-[#eee7d5]/55">Scroll to enter<br />the studio</span>
              <a href="#studio" className="focus-ring grid h-14 w-14 place-items-center rounded-full bg-[#e76f5c] text-[#0a0a0a] transition-transform hover:-translate-y-1" data-testid="link-hero-scroll" aria-label="Scroll to studio">
                <ArrowDown className="h-5 w-5" />
              </a>
            </Reveal>
          </div>
          <div className="orbital pointer-events-none absolute -right-5 top-[34%] hidden h-72 w-72 rounded-full border border-[#e76f5c]/80 lg:block" />
          <div className="pointer-events-none absolute right-[10%] top-[49%] hidden h-3 w-3 rounded-full bg-[#e76f5c] lg:block" />
          <div className="pointer-events-none absolute bottom-0 right-[37%] hidden h-48 w-px bg-[#eee7d5]/15 lg:block"><div className="scroll-line h-full w-full bg-[#d8ff45]" /></div>
        </div>
        <span className="vertical-label mono-face absolute bottom-16 right-5 text-[9px] uppercase tracking-[.2em] text-[#eee7d5]/45 lg:right-12">Issue 05 / The useful strange</span>
      </section>

      <div className="overflow-hidden border-b border-[#0a0a0a]/20 bg-[#d8ff45] py-3" aria-label="Studio principles">
        <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-8">
              <span className="mono-face text-[10px] uppercase tracking-[.2em]">Ideas with a pulse</span><Asterisk className="h-4 w-4" />
              <span className="mono-face text-[10px] uppercase tracking-[.2em]">Direction / design / development</span><Asterisk className="h-4 w-4" />
            </div>
          ))}
        </div>
      </div>

      <section id="studio" className="scroll-mt-8 px-5 py-28 sm:px-8 lg:px-12 lg:py-44">
        <div className="editorial-wrap grid gap-16 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
          <Reveal><SectionLabel number="01">The studio</SectionLabel></Reveal>
          <div>
            <Reveal>
              <h2 className="display-face max-w-4xl text-[clamp(3rem,7vw,7.4rem)] leading-[.86]">
                We turn the good idea in the room into the thing <span className="serif-face font-normal italic text-[#e76f5c]">everyone</span> remembers.
              </h2>
            </Reveal>
            <Reveal delay="reveal-delay-1" className="mt-12 grid gap-8 border-t border-[#0a0a0a]/20 pt-7 sm:grid-cols-2">
              <p className="text-lg leading-[1.35] text-[#0a0a0a]/70">We are a compact, senior team for brands, founders, and cultural projects with somewhere new to go. We think in systems, but make for humans.</p>
              <p className="text-lg leading-[1.35] text-[#0a0a0a]/70">Creative direction, design, development, and digital experiences — held together by one point of view. No handoffs into the fog.</p>
            </Reveal>
            <Reveal delay="reveal-delay-2" className="mt-14">
              <ImageChapter src="/visuals/acs-ai-collaboration.jpg" alt="A creative team collaborating around AI-assisted data visualizations" label="Human + machine / 01" caption="The best intelligence is shared." className="h-[480px] sm:h-[620px]" imageClassName="scale-[1.12] object-[58%_54%]" />
            </Reveal>
            <Reveal delay="reveal-delay-3">
              <a href="#contact" className="focus-ring group mt-10 inline-flex items-center gap-3 border-b border-[#0a0a0a] pb-2 text-sm font-semibold" data-testid="link-studio-contact">
                Bring us the hard part <ArrowUpRight className="magnetic-arrow h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[#0a0a0a]/20 bg-[#e76f5c] px-5 py-28 sm:px-8 lg:px-12 lg:py-36" aria-labelledby="capabilities-title">
        <div className="editorial-wrap">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <Reveal><SectionLabel number="02">What we make</SectionLabel></Reveal>
            <span className="mono-face text-[10px] uppercase tracking-[.14em] text-[#0a0a0a]/55">One team, end to end</span>
          </div>
          <h2 id="capabilities-title" className="sr-only">Our capabilities</h2>
          <Reveal className="mt-14">
            <div className="grid overflow-hidden border border-[#0a0a0a]/25 lg:grid-cols-[1.25fr_.75fr]">
              <ImageChapter src="/visuals/acs-app-building.jpg" alt="Hands sketching app flows and responsive website wireframes beside a laptop" label="Build in public / 02" caption="The mess is where the method begins." className="h-[340px] lg:h-[500px]" imageClassName="object-[50%_55%]" />
              <div className="flex flex-col justify-between bg-[#0a0a0a] p-6 text-[#eee7d5] sm:p-10">
                <span className="mono-face text-[9px] uppercase tracking-[.16em] text-[#d8ff45]">The work is the system</span>
                <span className="display-face mt-12 max-w-xs text-4xl leading-[.92]">Form, feeling, and function in the same room.</span>
              </div>
            </div>
          </Reveal>
          <div className="mt-16 grid divide-y divide-[#0a0a0a]/25 border-y border-[#0a0a0a]/25 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
            {[
              ['01', 'Creative direction', 'Find the signal. Name the feeling. Give the work a point of view that can hold up in the wild.'],
              ['02', 'Identity & design', 'Build visual systems with enough character to be recognized and enough range to stay alive.'],
              ['03', 'Digital experiences', 'Design and ship the places people meet your idea — websites, products, worlds, and everything between.'],
              ['04', 'Creative development', 'Make the beautiful thing work. Technical craft, motion, and weird little details included.'],
            ].map(([number, title, copy], index) => (
              <Reveal key={number} delay={index % 2 ? 'reveal-delay-1' : ''}>
                <article className="group flex min-h-[240px] flex-col justify-between p-6 transition-colors hover:bg-[#d8ff45] sm:p-8 lg:p-10" data-testid={`card-capability-${number}`}>
                  <div className="flex items-start justify-between"><span className="mono-face text-[10px] text-[#0a0a0a]/55">{number}</span><ArrowUpRight className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100" /></div>
                  <div><h3 className="display-face text-3xl">{title}</h3><p className="mt-3 max-w-md text-sm leading-[1.4] text-[#0a0a0a]/65">{copy}</p></div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-[#0a0a0a] px-5 py-24 text-[#eee7d5] sm:px-8 lg:px-12 lg:py-32">
        <div className="editorial-wrap grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <div className="relative z-10 -mr-0 lg:-mr-24">
              <p className="mono-face text-[10px] uppercase tracking-[.18em] text-[#d8ff45]">A useful interruption / 03</p>
              <h2 className="display-face mt-7 text-[clamp(3.5rem,8vw,8.5rem)] leading-[.78]">Make the<br /><span className="serif-face font-normal italic text-[#e76f5c]">strange</span> useful.</h2>
              <p className="mt-8 max-w-sm text-lg leading-[1.25] text-[#eee7d5]/60">The best digital work carries a little friction. Something to look at twice. Something that refuses to flatten.</p>
            </div>
          </Reveal>
          <Reveal delay="reveal-delay-2">
            <ImageChapter src="/visuals/acs-learning-lab.jpg" alt="Adult learners collaborating in a bright community technology classroom" label="Learning together / 03" caption="Keep the evidence of the hand." className="h-[470px] rotate-2 sm:h-[620px] lg:ml-10" imageClassName="scale-[1.08]" />
          </Reveal>
        </div>
      </section>

      <section id="work" className="scroll-mt-8 bg-[#eee7d5] px-5 py-28 sm:px-8 lg:px-12 lg:py-44" aria-labelledby="work-title">
        <div className="editorial-wrap">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <Reveal><SectionLabel number="04">Selected work</SectionLabel></Reveal>
              <Reveal delay="reveal-delay-1"><h2 id="work-title" className="display-face mt-7 max-w-4xl text-[clamp(3.4rem,8vw,8.4rem)] leading-[.8]">Some things<br /><span className="serif-face font-normal italic text-[#e76f5c]">we set in motion.</span></h2></Reveal>
            </div>
            <Reveal delay="reveal-delay-2"><p className="max-w-[220px] text-sm leading-[1.4] text-[#0a0a0a]/60">A few worlds we have helped move from a sketch to a living URL.</p></Reveal>
          </div>
          <div className="mt-20 grid gap-x-6 gap-y-16 sm:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.name} delay={index === 1 || index === 3 ? 'reveal-delay-1' : ''} className={index % 2 === 1 ? 'sm:mt-24' : ''}>
                <article className="project-card group" data-testid={`card-project-${project.name.toLowerCase().replaceAll(' ', '-')}`}>
                  <button type="button" onClick={() => setSelectedProject(project)} className="focus-ring block w-full text-left" data-testid={`button-project-${project.name.toLowerCase().replaceAll(' ', '-')}`}>
                    <div className="aspect-[1.18] overflow-hidden border border-[#0a0a0a]/20"><ProjectArt project={project} /></div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div><h3 className="display-face text-3xl">{project.name}</h3><p className="mono-face mt-2 text-[9px] uppercase tracking-[.14em] text-[#0a0a0a]/55">{project.type}</p></div>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#0a0a0a]/30 transition-colors group-hover:border-[#0a0a0a] group-hover:bg-[#d8ff45]"><ArrowUpRight className="magnetic-arrow h-4 w-4" /></span>
                    </div>
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="approach" className="scroll-mt-8 bg-[#0a0a0a] px-5 py-28 text-[#eee7d5] sm:px-8 lg:px-12 lg:py-44" aria-labelledby="approach-title">
        <div className="editorial-wrap grid gap-16 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
          <Reveal><SectionLabel number="05" inverse>Our approach</SectionLabel></Reveal>
          <div>
            <Reveal><h2 id="approach-title" className="display-face max-w-4xl text-[clamp(3rem,7vw,7.2rem)] leading-[.83]">Small enough to care about every pixel. Serious enough to ship the <span className="serif-face font-normal italic text-[#d8ff45]">whole idea.</span></h2></Reveal>
            <Reveal delay="reveal-delay-1" className="mt-14">
              <ImageChapter src="/visuals/acs-reentry-pathway.jpg" alt="A person walking toward an open doorway in a welcoming community technology center" label="A way through / 04" caption="A way through is a way forward." className="h-[330px] sm:h-[490px]" imageClassName="object-[54%_50%]" />
            </Reveal>
            <div className="mt-16">
              {[
                ['01', 'Find the edge', 'We start with the tension in your idea — the part that feels most like you and least like everyone else.'],
                ['02', 'Make the system', 'A clear creative spine turns early sparks into a world: visual language, interaction rules, and a plan to make it real.'],
                ['03', 'Ship the feeling', 'We stay close through launch, polish the edges, and leave you with something that can keep moving without us.'],
              ].map(([number, title, copy], index) => (
                <Reveal key={number} delay={index === 1 ? 'reveal-delay-1' : ''}>
                  <div className="grid gap-4 border-t border-[#eee7d5]/20 py-7 sm:grid-cols-[60px_1fr_1.4fr] sm:gap-8">
                    <span className="mono-face text-[10px] text-[#d8ff45]">{number}</span><h3 className="display-face text-2xl">{title}</h3><p className="max-w-md text-sm leading-[1.45] text-[#eee7d5]/60">{copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[#0a0a0a]/20 bg-[#d8ff45] px-5 py-28 sm:px-8 lg:px-12 lg:py-36" aria-labelledby="domain-title">
        <div className="editorial-wrap grid gap-14 lg:grid-cols-[.95fr_1.05fr] lg:items-end">
          <div>
            <Reveal><SectionLabel number="06">The home base</SectionLabel></Reveal>
            <Reveal delay="reveal-delay-1"><h2 id="domain-title" className="display-face mt-7 max-w-2xl text-[clamp(3.4rem,8vw,8.2rem)] leading-[.78]">One domain.<br /><span className="serif-face font-normal italic text-[#e76f5c]">Many worlds.</span></h2></Reveal>
          </div>
          <div>
            <Reveal><p className="max-w-xl text-xl leading-[1.15] text-[#0a0a0a]/75 sm:text-2xl">advancedcreationstudio.com is the front door. Every project can have its own address, its own atmosphere, its own living room.</p></Reveal>
            <Reveal delay="reveal-delay-1" className="mt-10">
              <ImageChapter src="/visuals/acs-future-signal.jpg" alt="A prototype website being presented to a collaborative makerspace group" label="Project worlds, connected / 05" caption="A shared address. Many ways forward." className="h-[380px] sm:h-[520px]" imageClassName="object-[53%_50%] mix-blend-multiply" />
            </Reveal>
            <Reveal delay="reveal-delay-2" className="mt-10 border-t border-[#0a0a0a]/30 pt-5">
              <div className="mono-face flex items-center justify-between text-[10px] uppercase tracking-[.12em]"><span>Studio index</span><span>04 / 04</span></div>
              <div className="mt-5 flex flex-wrap gap-2">
                {projects.map((project) => (
                  <button key={project.name} type="button" onClick={() => setSelectedProject(project)} className="focus-ring rounded-full border border-[#0a0a0a]/35 px-3 py-2 mono-face text-[9px] uppercase tracking-[.12em] transition-colors hover:bg-[#0a0a0a] hover:text-[#d8ff45]" data-testid={`button-domain-${project.name.toLowerCase().replaceAll(' ', '-')}`}>
                    {project.name} <ArrowUpRight aria-hidden="true" className="inline h-3 w-3" />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-8 bg-[#e76f5c] px-5 py-28 sm:px-8 lg:px-12 lg:py-44" aria-labelledby="contact-title">
        <div className="editorial-wrap grid gap-14 lg:grid-cols-[1fr_.65fr] lg:gap-24">
          <div><Reveal><SectionLabel number="07">Make contact</SectionLabel></Reveal><Reveal delay="reveal-delay-1"><h2 id="contact-title" className="display-face mt-7 max-w-4xl text-[clamp(4rem,10vw,10rem)] leading-[.75]">Have a<br /><span className="serif-face font-normal italic">good one?</span></h2></Reveal><Reveal delay="reveal-delay-2"><p className="mt-8 max-w-md text-lg leading-[1.3] text-[#0a0a0a]/72">Tell us what you are trying to make, change, or make impossible. We will tell you where to start.</p></Reveal></div>
          <div>
            {sent ? (
              <div className="border-t border-[#0a0a0a]/30 pt-7" data-testid="status-contact-sent">
                <Check className="h-7 w-7" /><h3 className="display-face mt-5 text-4xl">That landed.</h3><p className="mt-3 max-w-sm text-base text-[#0a0a0a]/70">Your note is in the studio inbox. We will be in touch soon.</p>
                <button type="button" onClick={() => setSent(false)} className="focus-ring mt-8 border-b border-[#0a0a0a] pb-1 text-sm font-semibold" data-testid="button-contact-another">Send another note</button>
              </div>
            ) : (
              <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="border-t border-[#0a0a0a]/30 pt-6" data-testid="form-contact">
                <label htmlFor="contact-email" className="mono-face text-[10px] uppercase tracking-[.15em]">Your email</label>
                <input id="contact-email" name="email" required type="email" placeholder="you@somewheregood.com" className="focus-ring mt-5 w-full border-b border-[#0a0a0a]/40 bg-transparent pb-4 text-xl outline-none placeholder:text-[#0a0a0a]/40 focus:border-[#0a0a0a]" data-testid="input-contact-email" />
                <label htmlFor="contact-brief" className="mono-face mt-10 block text-[10px] uppercase tracking-[.15em]">A little context</label>
                <textarea id="contact-brief" name="brief" required rows={3} placeholder="The thing we should make together is..." className="focus-ring mt-5 w-full resize-none border-b border-[#0a0a0a]/40 bg-transparent pb-4 text-xl outline-none placeholder:text-[#0a0a0a]/40 focus:border-[#0a0a0a]" data-testid="input-contact-brief" />
                <button type="submit" className="focus-ring group mt-9 inline-flex items-center gap-3 rounded-full bg-[#0a0a0a] px-6 py-3 text-sm font-semibold text-[#eee7d5] transition-transform hover:-translate-y-1" data-testid="button-contact-submit">Send it over <MoveRight className="magnetic-arrow h-4 w-4 text-[#d8ff45]" /></button>
              </form>
            )}
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-b border-[#eee7d5]/15 bg-[#0a0a0a] py-5 text-[#eee7d5]" aria-hidden="true">
        <div className="marquee-track reverse flex w-max items-center gap-12 whitespace-nowrap opacity-75">
          {[0, 1, 2, 3].map((item) => <span key={item} className="flex items-center gap-4 serif-face text-3xl italic sm:text-5xl">Built for the next good thing <Asterisk aria-hidden="true" className="h-6 w-6 text-[#d8ff45] sm:h-8 sm:w-8" /></span>)}
        </div>
      </div>

      <footer className="bg-[#0a0a0a] px-5 py-10 text-[#eee7d5] sm:px-8 lg:px-12">
        <div className="editorial-wrap flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
          <div><Logo dark /><p className="mono-face mt-8 text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/45">A small studio for large ideas.</p></div>
          <div className="flex flex-col gap-3 sm:items-end"><a href="mailto:admnowner@advancedcreationstudio.com" className="focus-ring group flex items-center gap-2 text-sm hover:text-[#d8ff45]" data-testid="link-footer-email">admnowner@advancedcreationstudio.com <ArrowUpRight className="magnetic-arrow h-4 w-4" /></a><div className="mono-face text-[9px] uppercase tracking-[.13em] text-[#eee7d5]/40">© 2025 ACS / All signals open</div></div>
        </div>
        <div className="editorial-wrap mt-12 flex justify-between border-t border-[#eee7d5]/15 pt-4 mono-face text-[9px] uppercase tracking-[.13em] text-[#eee7d5]/40"><span>Built for the next good thing</span><a href="#top" className="focus-ring" data-testid="link-back-to-top">Back to top ↑</a></div>
      </footer>

      {selectedProject && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#0a0a0a]/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" data-testid="dialog-project">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto bg-[#eee7d5] p-5 shadow-[0_30px_100px_rgba(0,0,0,.35)] sm:p-8">
            <button type="button" onClick={() => setSelectedProject(null)} aria-label="Close project details" className="focus-ring absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-[#0a0a0a]/30 bg-[#eee7d5]/80" data-testid="button-close-project"><X className="h-4 w-4" /></button>
            <div className="aspect-[1.7] pr-12"><ProjectArt project={selectedProject} /></div>
            <div className="mt-7 flex flex-wrap items-start justify-between gap-4"><div><span className="mono-face text-[9px] uppercase tracking-[.14em] text-[#e76f5c]">{selectedProject.year} / {selectedProject.type}</span><h2 id="project-dialog-title" className="display-face mt-2 text-5xl">{selectedProject.name}</h2></div><span className="mono-face pt-2 text-[9px] uppercase tracking-[.1em] text-[#0a0a0a]/55">Project index</span></div>
            <p className="mt-5 max-w-lg text-lg leading-[1.3] text-[#0a0a0a]/70">{selectedProject.description}</p>
            <div className="mt-8 flex items-center justify-between border-t border-[#0a0a0a]/20 pt-5"><span className="mono-face max-w-[68%] truncate text-[9px] uppercase tracking-[.1em] text-[#0a0a0a]/55">{selectedProject.url}</span><button type="button" onClick={() => setSelectedProject(null)} className="focus-ring group flex items-center gap-2 text-sm font-semibold" data-testid="button-close-project-detail">Close <ArrowRight className="magnetic-arrow h-4 w-4" /></button></div>
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