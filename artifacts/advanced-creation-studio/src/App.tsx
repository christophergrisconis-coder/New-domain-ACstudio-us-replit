import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Asterisk,
  Check,
  Globe,
  Lock,
  Menu,
  MoveRight,
  Search,
  Shield,
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
  image: string;
  imageAlt: string;
  accent: string;
};

const projects: Project[] = [
  {
    name: 'Lawyers Legal Beef (L.L.B)',
    type: 'Legal Intelligence / SaaS Platform',
    year: '2026',
    description: '4th Circuit case law database, courtroom PWA offline sync, and automated legal practice tools.',
    url: 'llb.acstudioapps.us',
    image: '/visuals/acs-ai-collaboration.jpg',
    imageAlt: 'Lawyers Legal Beef legal briefing and precedent engine interface',
    accent: '#d8ff45',
  },
  {
    name: 'Star Buster',
    type: 'WebGL Interactive Game / Web App',
    year: '2026',
    description: 'An arcade space exploration adventure with live player telemetry and power-up progression.',
    url: 'starbuster.acstudioapps.us',
    image: '/visuals/acs-future-signal.jpg',
    imageAlt: 'Star Buster deep-space navigation game experience',
    accent: '#6aa8ff',
  },
  {
    name: 'CodeLabs Editorial',
    type: 'Interactive Developer Curriculum & AI Lab',
    year: '2026',
    description: 'Code terminology lessons, practice terminals, and offline LabRat AI coding assistant.',
    url: 'codelabs.acstudioapps.us',
    image: '/visuals/acs-learning-lab.jpg',
    imageAlt: 'CodeLabs interactive learning environment',
    accent: '#6aa8ff',
  },
  {
    name: 'NexusLore',
    type: 'Secret Hunting & Interactive Game Guides',
    year: '2026',
    description: 'Interactive walkthroughs, real-time secret discovery boards, and collaborative puzzle solvers.',
    url: 'nexuslore.acstudioapps.us',
    image: '/visuals/acs-glass-form.jpg',
    imageAlt: 'NexusLore secret hunting and walkthrough portal',
    accent: '#e76f5c',
  },
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
      href="/"
      className={`focus-ring flex items-center gap-3 ${dark ? 'text-[#eee7d5]' : 'text-[#201a2a]'}`}
      data-testid="link-logo"
      aria-label="Advanced Creation Studio home"
    >
      <span className={`grid h-9 w-9 place-items-center rounded-full border ${dark ? 'border-[#d8ff45]' : 'border-[#201a2a]'}`}>
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
      <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-[#201a2a]/75 to-transparent px-4 pb-4 pt-14 text-[#eee7d5]">
        <span className="mono-face text-[9px] uppercase tracking-[.13em]">{label}</span>
        <span className="max-w-[175px] text-right text-xs italic leading-[1.1]">{caption}</span>
      </figcaption>
    </figure>
  );
}

function ProjectArt({ project }: { project: Project }) {
  return (
    <div className="project-art relative h-full w-full overflow-hidden bg-[#201a2a]">
      <img src={project.image} alt={project.imageAlt} className="motion-picture-image h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#201a2a]/10 mix-blend-multiply" />
      <span className="mono-face absolute bottom-4 left-4 bg-[#eee7d5] px-2 py-1 text-[9px] uppercase tracking-[.15em] text-[#201a2a]">{project.year} / {project.name}</span>
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
    <main id="top" className="studio-shell grain min-h-[100dvh] text-[#201a2a]">
      <ScrollEngine />
      <header className="absolute left-0 right-0 top-0 z-30 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Logo dark />
        
        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            <a href="#studio" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/70 transition-colors hover:text-[#d8ff45]" data-testid="link-nav-studio">Studio</a>
            <a href="#reentry" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/70 transition-colors hover:text-[#d8ff45]" data-testid="link-nav-reentry">Re-entry</a>
            <a href="#work" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/70 transition-colors hover:text-[#d8ff45]" data-testid="link-nav-work">Work</a>
            <a href="#approach" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/70 transition-colors hover:text-[#d8ff45]" data-testid="link-nav-approach">Approach</a>
            <a href="#contact" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/70 transition-colors hover:text-[#d8ff45]" data-testid="link-nav-contact">Contact</a>
          </nav>

          {/* Top Right Centered Prominent PROJECTS Button / Tab */}
          <a
            href="/projects"
            className="focus-ring group relative flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-[#d8ff45] via-[#e76f5c] to-[#6aa8ff] p-[2px] shadow-[0_4px_24px_rgba(216,255,69,0.35)] transition-all hover:scale-105 hover:shadow-[0_8px_32px_rgba(216,255,69,0.5)]"
            data-testid="link-nav-projects-tab"
          >
            <div className="flex flex-col items-center justify-center rounded-[10px] bg-[#201a2a] px-4 py-1.5 transition-colors group-hover:bg-[#2a2238]">
              <span className="mono-face text-[8px] uppercase tracking-[.20em] text-[#d8ff45] font-medium leading-none">
                Check out our
              </span>
              <span className="display-face text-base font-extrabold uppercase leading-tight tracking-wider text-[#eee7d5] group-hover:text-[#d8ff45] flex items-center gap-1 mt-0.5">
                PROJECTS <ArrowUpRight className="h-3.5 w-3.5 text-[#d8ff45] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </a>

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
        </div>
      </header>

      {menuOpen && (
        <div className="absolute inset-x-4 top-20 z-20 rounded-xl border border-[#d8ff45]/60 bg-[#332b40] p-5 shadow-2xl md:hidden" data-testid="menu-mobile">
          <nav className="flex flex-col gap-4" aria-label="Mobile navigation">
            <a href="/projects" onClick={closeMenu} className="focus-ring flex items-center justify-between rounded-lg bg-[#d8ff45] p-3 text-[#201a2a] font-bold">
              <div>
                <div className="text-[9px] uppercase tracking-[.18em]">Check out our</div>
                <div className="text-lg uppercase font-extrabold">PROJECTS</div>
              </div>
              <ArrowUpRight className="h-5 w-5" />
            </a>
            {['studio', 'reentry', 'work', 'approach', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} onClick={closeMenu} className="focus-ring mono-face flex items-center justify-between border-b border-[#eee7d5]/15 pb-3 text-[11px] uppercase tracking-[.18em] text-[#eee7d5]" data-testid={`link-mobile-${item}`}>
                {item === 'contact' ? 'Start a project' : item === 'reentry' ? 'Re-entry' : item}
                <ArrowUpRight className="h-4 w-4 text-[#d8ff45]" />
              </a>
            ))}
            <a href="/privacy" onClick={closeMenu} className="mono-face text-[10px] uppercase tracking-[.18em] text-[#d8ff45]">
              Privacy Policy →
            </a>
          </nav>
        </div>
      )}

      <section className="hero-grid relative min-h-[820px] px-5 pb-16 pt-36 text-[#eee7d5] sm:px-8 lg:min-h-[950px] lg:px-12 lg:pt-44" aria-labelledby="hero-title">
        <div className="hero-ambient pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <img className="hero-mission-image hero-mission-image-one" src="/visuals/acs-ai-collaboration.jpg" alt="" />
          <img className="hero-mission-image hero-mission-image-two" src="/visuals/acs-app-building.jpg" alt="" />
          <img className="hero-mission-image hero-mission-image-three" src="/visuals/acs-learning-lab.jpg" alt="" />
          <img className="hero-mission-image hero-mission-image-four" src="/visuals/acs-reentry-pathway.jpg" alt="" />
          <img className="hero-mission-image hero-mission-image-five" src="/visuals/acs-access-design.jpg" alt="" />
          <img className="hero-mission-image hero-mission-image-six" src="/visuals/acs-future-signal.jpg" alt="" />
          <div className="ambient-orb ambient-orb-one" />
          <div className="ambient-orb ambient-orb-two" />
          <div className="ambient-scanline" />
        </div>
        <div className="editorial-wrap relative flex min-h-[650px] flex-col justify-between">
          <div className="relative z-10 max-w-6xl">
            <Reveal className="flex items-center gap-3 text-[#d8ff45]">
              <Asterisk className="h-5 w-5" />
              <span className="mono-face text-[10px] uppercase tracking-[.18em]">Independent creative technology studio / 2026</span>
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
              <a href="#studio" className="focus-ring grid h-14 w-14 place-items-center rounded-full bg-[#e76f5c] text-[#201a2a] transition-transform hover:-translate-y-1" data-testid="link-hero-scroll" aria-label="Scroll to studio">
                <ArrowDown className="h-5 w-5" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="studio" className="scroll-mt-8 px-5 py-28 sm:px-8 lg:px-12 lg:py-44">
        <div className="editorial-wrap grid gap-16 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
          <div className="flex flex-col">
            <Reveal><SectionLabel number="01">The studio</SectionLabel></Reveal>
            <Reveal delay="reveal-delay-2" className="hidden lg:block mt-auto pt-24">
              <ImageChapter 
                src="/visuals/acs-studio-object.jpg" 
                alt="Abstract studio object signifying creation" 
                label="Object / 00" 
                caption="Form meets function." 
                className="h-[420px] w-full grayscale-[0.3]" 
                imageClassName="scale-[1.15] object-center" 
              />
            </Reveal>
          </div>
          <div>
            <Reveal>
              <h2 className="display-face max-w-4xl text-[clamp(3rem,7vw,7.4rem)] leading-[.86]">
                We turn the good idea in the room into the thing <span className="serif-face font-normal italic text-[#e76f5c]">everyone</span> remembers.
              </h2>
            </Reveal>
            <Reveal delay="reveal-delay-1" className="mt-12 grid gap-8 border-t border-[#201a2a]/20 pt-7 sm:grid-cols-2">
              <p className="text-lg leading-[1.35] text-[#201a2a]/70">We are a compact, senior team for brands, founders, and cultural projects with somewhere new to go. We think in systems, but make for humans.</p>
              <p className="text-lg leading-[1.35] text-[#201a2a]/70">Creative direction, design, development, and digital experiences — held together by one point of view. No handoffs into the fog.</p>
            </Reveal>
            <Reveal delay="reveal-delay-2" className="mt-14">
              <ImageChapter src="/visuals/acs-ai-collaboration.jpg" alt="A creative team collaborating around AI-assisted data visualizations" label="Human + machine / 01" caption="The best intelligence is shared." className="h-[480px] sm:h-[620px]" imageClassName="scale-[1.12] object-[58%_54%]" />
            </Reveal>
            <Reveal delay="reveal-delay-3">
              <a href="#contact" className="focus-ring group mt-10 inline-flex items-center gap-3 border-b border-[#201a2a] pb-2 text-sm font-semibold" data-testid="link-studio-contact">
                Bring us the hard part <ArrowUpRight className="magnetic-arrow h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-[#201a2a]/20 bg-[#e76f5c] px-5 py-28 sm:px-8 lg:px-12 lg:py-36" aria-labelledby="capabilities-title">
        <div className="editorial-wrap">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <Reveal><SectionLabel number="02">What we make</SectionLabel></Reveal>
            <span className="mono-face text-[10px] uppercase tracking-[.14em] text-[#201a2a]/55">One team, end to end</span>
          </div>
          <h2 id="capabilities-title" className="sr-only">Our capabilities</h2>

          <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Brand systems', 'Visual identity, logo systems, typography, design tokens, and launch guidelines for new platforms.'],
              ['Web & WebGL', 'High-performance web apps, landing worlds, WebGL shaders, and bespoke responsive systems.'],
              ['SaaS & Product', 'Full-stack software design, offline-first PWAs, case law engines, and dashboard suites.'],
              ['AI & Education', 'Interactive AI learning tools, model integration, LabRat assistants, and curriculum hubs.'],
            ].map(([title, desc], idx) => (
              <Reveal key={title} delay={idx > 0 ? `reveal-delay-${idx}` : ''}>
                <div className="border-t border-[#201a2a]/25 pt-6">
                  <span className="mono-face text-[10px] uppercase tracking-[.14em] text-[#201a2a]/60">0{idx + 1}</span>
                  <h3 className="display-face mt-4 text-2xl font-bold">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#201a2a]/75">{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="scroll-mt-8 px-5 py-28 sm:px-8 lg:px-12 lg:py-44" aria-labelledby="work-title">
        <div className="editorial-wrap">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <Reveal><SectionLabel number="03">Selected work</SectionLabel></Reveal>
              <Reveal delay="reveal-delay-1"><h2 id="work-title" className="display-face mt-7 max-w-4xl text-[clamp(3.4rem,8vw,8.4rem)] leading-[.8]">Some things<br /><span className="serif-face font-normal italic text-[#e76f5c]">we set in motion.</span></h2></Reveal>
            </div>
            <Reveal delay="reveal-delay-2">
              <a href="/projects" className="focus-ring inline-flex items-center gap-2 rounded-full bg-[#201a2a] px-6 py-3 mono-face text-[10px] uppercase tracking-[.14em] text-[#d8ff45] transition-transform hover:-translate-y-1">
                View all projects →
              </a>
            </Reveal>
          </div>
          <div className="mt-20 grid gap-x-6 gap-y-16 sm:grid-cols-2">
            {projects.slice(0, 4).map((project, index) => (
              <Reveal key={project.name} delay={index === 1 || index === 3 ? 'reveal-delay-1' : ''} className={index % 2 === 1 ? 'sm:mt-24' : ''}>
                <article className="project-card group" data-testid={`card-project-${project.name.toLowerCase().replaceAll(' ', '-')}`}>
                  <button type="button" onClick={() => setSelectedProject(project)} className="focus-ring block w-full text-left" data-testid={`button-project-${project.name.toLowerCase().replaceAll(' ', '-')}`}>
                    <div className="aspect-[1.18] overflow-hidden border border-[#201a2a]/20"><ProjectArt project={project} /></div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div><h3 className="display-face text-3xl">{project.name}</h3><p className="mono-face mt-2 text-[9px] uppercase tracking-[.14em] text-[#201a2a]/55">{project.type}</p></div>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#201a2a]/30 transition-colors group-hover:border-[#201a2a] group-hover:bg-[#d8ff45]"><ArrowUpRight className="magnetic-arrow h-4 w-4" /></span>
                    </div>
                  </button>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="approach" className="scroll-mt-8 bg-[#201a2a] px-5 py-28 text-[#eee7d5] sm:px-8 lg:px-12 lg:py-44" aria-labelledby="approach-title">
        <div className="editorial-wrap grid gap-16 lg:grid-cols-[.72fr_1.28fr] lg:gap-24">
          <Reveal><SectionLabel number="04" inverse>Our approach</SectionLabel></Reveal>
          <div>
            <Reveal><h2 id="approach-title" className="display-face max-w-4xl text-[clamp(3rem,7vw,7.2rem)] leading-[.83]">Small enough to care about every pixel. Serious enough to ship the <span className="serif-face font-normal italic text-[#d8ff45]">whole idea.</span></h2></Reveal>
            <Reveal delay="reveal-delay-1" className="mt-14">
              <ImageChapter src="/visuals/acs-reentry-pathway.jpg" alt="A person walking toward an open doorway in a welcoming community technology center" label="A way through / 04" caption="A way through is a way forward." className="h-[330px] sm:h-[490px]" imageClassName="object-[54%_50%]" />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-mt-8 bg-[#e76f5c] px-5 py-28 sm:px-8 lg:px-12 lg:py-44" aria-labelledby="contact-title">
        <div className="editorial-wrap grid gap-14 lg:grid-cols-[1fr_.65fr] lg:gap-24">
          <div><Reveal><SectionLabel number="05">Make contact</SectionLabel></Reveal><Reveal delay="reveal-delay-1"><h2 id="contact-title" className="display-face mt-7 max-w-4xl text-[clamp(4rem,10vw,10rem)] leading-[.75]">Have a<br /><span className="serif-face font-normal italic">good one?</span></h2></Reveal><Reveal delay="reveal-delay-2"><p className="mt-8 max-w-md text-lg leading-[1.3] text-[#201a2a]/72">Tell us what you are trying to make, change, or make impossible. We will tell you where to start.</p></Reveal></div>
          <div>
            {sent ? (
              <div className="border-t border-[#201a2a]/30 pt-7" data-testid="status-contact-sent">
                <Check className="h-7 w-7" /><h3 className="display-face mt-5 text-4xl">That landed.</h3><p className="mt-3 max-w-sm text-base text-[#201a2a]/70">Your note is in the studio inbox. We will be in touch soon.</p>
                <button type="button" onClick={() => setSent(false)} className="focus-ring mt-8 border-b border-[#201a2a] pb-1 text-sm font-semibold" data-testid="button-contact-another">Send another note</button>
              </div>
            ) : (
              <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="border-t border-[#201a2a]/30 pt-6" data-testid="form-contact">
                <label htmlFor="contact-email" className="mono-face text-[10px] uppercase tracking-[.15em]">Your email</label>
                <input id="contact-email" name="email" required type="email" placeholder="you@somewheregood.com" className="focus-ring mt-5 w-full border-b border-[#201a2a]/40 bg-transparent pb-4 text-xl outline-none placeholder:text-[#201a2a]/40 focus:border-[#201a2a]" data-testid="input-contact-email" />
                <label htmlFor="contact-brief" className="mono-face mt-10 block text-[10px] uppercase tracking-[.15em]">A little context</label>
                <textarea id="contact-brief" name="brief" required rows={3} placeholder="The thing we should make together is..." className="focus-ring mt-5 w-full resize-none border-b border-[#201a2a]/40 bg-transparent pb-4 text-xl outline-none placeholder:text-[#201a2a]/40 focus:border-[#201a2a]" data-testid="input-contact-brief" />
                <button type="submit" className="focus-ring group mt-9 inline-flex items-center gap-3 rounded-full bg-[#201a2a] px-6 py-3 text-sm font-semibold text-[#eee7d5] transition-transform hover:-translate-y-1" data-testid="button-contact-submit">Send it over <MoveRight className="magnetic-arrow h-4 w-4 text-[#d8ff45]" /></button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#201a2a] px-5 py-10 text-[#eee7d5] sm:px-8 lg:px-12">
        <div className="editorial-wrap flex flex-col justify-between gap-10 sm:flex-row sm:items-end">
          <div><Logo dark /><p className="mono-face mt-8 text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/45">A small studio for large ideas.</p></div>
          <div className="flex flex-col gap-3 sm:items-end">
            <a href="mailto:admnowner@advancedcreationstudio.com" className="focus-ring group flex items-center gap-2 text-sm hover:text-[#d8ff45]" data-testid="link-footer-email">
              admnowner@advancedcreationstudio.com <ArrowUpRight className="magnetic-arrow h-4 w-4" />
            </a>
            <div className="flex gap-6 mono-face text-[9px] uppercase tracking-[.13em] text-[#eee7d5]/50">
              <a href="/projects" className="hover:text-[#d8ff45]">Projects</a>
              <a href="/privacy" className="hover:text-[#d8ff45]">Privacy Policy</a>
            </div>
            <div className="mono-face text-[9px] uppercase tracking-[.13em] text-[#eee7d5]/40">© 2026 ACS / All signals open</div>
          </div>
        </div>
      </footer>

      {selectedProject && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#201a2a]/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" data-testid="dialog-project">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto bg-[#eee7d5] p-5 shadow-[0_30px_100px_rgba(0,0,0,.35)] sm:p-8">
            <button type="button" onClick={() => setSelectedProject(null)} aria-label="Close project details" className="focus-ring absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-[#201a2a]/30 bg-[#eee7d5]/80" data-testid="button-close-project"><X className="h-4 w-4" /></button>
            <div className="aspect-[1.7] pr-12"><ProjectArt project={selectedProject} /></div>
            <div className="mt-7 flex flex-wrap items-start justify-between gap-4"><div><span className="mono-face text-[9px] uppercase tracking-[.14em] text-[#e76f5c]">{selectedProject.year} / {selectedProject.type}</span><h2 id="project-dialog-title" className="display-face mt-2 text-5xl">{selectedProject.name}</h2></div><span className="mono-face pt-2 text-[9px] uppercase tracking-[.1em] text-[#201a2a]/55">Project index</span></div>
            <div className="mt-8 flex items-center justify-between border-t border-[#201a2a]/20 pt-5"><a href={`https://${selectedProject.url}`} target="_blank" rel="noopener noreferrer" className="mono-face max-w-[68%] truncate text-[10px] uppercase tracking-[.1em] text-[#201a2a] hover:text-[#e76f5c] inline-flex items-center gap-1.5 font-bold">{selectedProject.url} <ArrowUpRight className="h-3 w-3" /></a><button type="button" onClick={() => setSelectedProject(null)} className="focus-ring group flex items-center gap-2 text-sm font-semibold" data-testid="button-close-project-detail">Close <ArrowRight className="magnetic-arrow h-4 w-4" /></button></div>
          </div>
        </div>
      )}
    </main>
  );
}

function ProjectsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ['All', 'Subdomains', 'Legal & SaaS', 'Gaming & WebGL', 'Editorial & Labs'];

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase()) ||
                          p.type.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'All') return true;
    if (filter === 'Subdomains') return p.url.includes('acstudioapps.us');
    if (filter === 'Legal & SaaS') return p.type.includes('Legal') || p.type.includes('SaaS');
    if (filter === 'Gaming & WebGL') return p.type.includes('WebGL') || p.type.includes('Game');
    if (filter === 'Editorial & Labs') return p.type.includes('Editorial') || p.type.includes('Lab');
    return true;
  });

  return (
    <main className="studio-shell grain min-h-[100dvh] bg-[#201a2a] text-[#eee7d5]">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between border-b border-[#eee7d5]/15 px-5 py-6 sm:px-8 lg:px-12">
        <Logo dark />
        <div className="flex items-center gap-6">
          <a href="/" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/70 transition-colors hover:text-[#d8ff45]">
            ← Back to Home
          </a>
          <a href="/privacy" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#d8ff45] hover:underline">
            Privacy Policy
          </a>
        </div>
      </header>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="editorial-wrap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionLabel number="01" inverse>Studio Directory</SectionLabel>
              <h1 className="display-face mt-6 text-[clamp(2.8rem,7vw,6.5rem)] leading-[.85]">
                Check out our <br />
                <span className="serif-face font-normal italic text-[#d8ff45]">PROJECTS</span>
              </h1>
            </div>
            <p className="max-w-md text-lg leading-relaxed text-[#eee7d5]/75">
              Explore the software, SaaS platforms, and interactive experiences built by Advanced Creation Studio. Each project runs on its canonical address under <span className="font-mono text-[#d8ff45]">acstudioapps.us</span>.
            </p>
          </div>

          {/* Privacy Policy Banner */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#d8ff45]/40 bg-[#282135] p-5 shadow-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-[#d8ff45]" />
              <div>
                <h4 className="text-sm font-semibold text-[#eee7d5]">User Privacy & Security Guaranteed</h4>
                <p className="text-xs text-[#eee7d5]/70">All apps hosted under acstudioapps.us adhere to strict data privacy protocols.</p>
              </div>
            </div>
            <a href="/privacy" className="focus-ring inline-flex items-center gap-2 rounded-full border border-[#d8ff45] px-4 py-2 mono-face text-[10px] uppercase tracking-[.12em] text-[#d8ff45] transition-colors hover:bg-[#d8ff45] hover:text-[#201a2a]">
              Read Privacy Policy <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Filter & Search Bar */}
          <div className="mt-12 flex flex-col gap-6 border-b border-[#eee7d5]/15 pb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`focus-ring rounded-full px-4 py-2 mono-face text-[10px] uppercase tracking-[.14em] transition-all ${
                    filter === cat
                      ? 'bg-[#d8ff45] text-[#201a2a] font-bold shadow-md'
                      : 'border border-[#eee7d5]/25 text-[#eee7d5]/70 hover:border-[#eee7d5] hover:text-[#eee7d5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-full border border-[#eee7d5]/30 bg-[#282135] px-4 py-2 pl-10 text-xs text-[#eee7d5] placeholder-[#eee7d5]/40 outline-none focus:border-[#d8ff45]"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#eee7d5]/40" />
            </div>
          </div>

          {/* Grid of Projects */}
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <article key={project.name} className="project-card group flex flex-col justify-between rounded-xl border border-[#eee7d5]/20 bg-[#282135] p-5 transition-all hover:border-[#d8ff45]">
                <div>
                  <div className="aspect-[1.4] overflow-hidden rounded-lg border border-[#eee7d5]/15">
                    <ProjectArt project={project} />
                  </div>
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <span className="mono-face text-[9px] uppercase tracking-[.14em] text-[#e76f5c]">{project.year}</span>
                      <span className="mono-face text-[9px] uppercase tracking-[.14em] text-[#d8ff45]">{project.type}</span>
                    </div>
                    <h3 className="display-face mt-2 text-2xl font-bold text-[#eee7d5]">{project.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#eee7d5]/70">{project.description}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-[#eee7d5]/15 pt-4">
                  <a
                    href={`https://${project.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-1.5 mono-face text-[10px] font-bold uppercase tracking-[.12em] text-[#d8ff45] hover:underline"
                  >
                    {project.url} <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="focus-ring mono-face text-[9px] uppercase tracking-[.12em] text-[#eee7d5]/50 hover:text-[#eee7d5]"
                  >
                    Quick View
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Dialog Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#201a2a]/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto bg-[#eee7d5] p-5 text-[#201a2a] shadow-2xl sm:p-8 rounded-xl">
            <button type="button" onClick={() => setSelectedProject(null)} className="focus-ring absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-[#201a2a]/30 bg-[#eee7d5]/80"><X className="h-4 w-4" /></button>
            <div className="aspect-[1.7] pr-12"><ProjectArt project={selectedProject} /></div>
            <div className="mt-7 flex flex-wrap items-start justify-between gap-4">
              <div><span className="mono-face text-[9px] uppercase tracking-[.14em] text-[#e76f5c]">{selectedProject.year} / {selectedProject.type}</span><h2 className="display-face mt-2 text-4xl">{selectedProject.name}</h2></div>
            </div>
            <p className="mt-4 text-base leading-relaxed text-[#201a2a]/80">{selectedProject.description}</p>
            <div className="mt-8 flex items-center justify-between border-t border-[#201a2a]/20 pt-5">
              <a href={`https://${selectedProject.url}`} target="_blank" rel="noopener noreferrer" className="mono-face text-[11px] font-bold uppercase tracking-[.1em] text-[#201a2a] hover:text-[#e76f5c] inline-flex items-center gap-1.5">
                Launch {selectedProject.url} <ArrowUpRight className="h-4 w-4" />
              </a>
              <button type="button" onClick={() => setSelectedProject(null)} className="focus-ring flex items-center gap-2 text-sm font-semibold">Close <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#eee7d5]/15 bg-[#201a2a] px-5 py-10 text-[#eee7d5] sm:px-8 lg:px-12">
        <div className="editorial-wrap flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="mono-face text-[10px] uppercase tracking-[.14em] text-[#eee7d5]/50">
            © 2026 Advanced Creation Studio — All Signals Open
          </div>
          <div className="flex gap-6 mono-face text-[10px] uppercase tracking-[.14em]">
            <a href="/" className="hover:text-[#d8ff45]">Home</a>
            <a href="/projects" className="text-[#d8ff45]">Projects</a>
            <a href="/privacy" className="hover:text-[#d8ff45]">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function PrivacyPolicyPage() {
  return (
    <main className="studio-shell grain min-h-[100dvh] bg-[#eee7d5] text-[#201a2a]">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between border-b border-[#201a2a]/15 px-5 py-6 sm:px-8 lg:px-12">
        <Logo />
        <div className="flex items-center gap-6">
          <a href="/projects" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#201a2a]/70 hover:text-[#e76f5c]">
            ← Back to Projects
          </a>
          <a href="/" className="focus-ring mono-face text-[10px] uppercase tracking-[.14em] text-[#201a2a]/70 hover:text-[#e76f5c]">
            Home
          </a>
        </div>
      </header>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="editorial-wrap max-w-4xl">
          <SectionLabel number="PRIVACY">Data Protection & User Trust</SectionLabel>
          <h1 className="display-face mt-6 text-[clamp(2.5rem,6vw,5rem)] leading-[.9]">
            Privacy Policy
          </h1>
          <p className="mono-face mt-4 text-xs uppercase tracking-[.15em] text-[#201a2a]/60">
            Effective Date: January 1, 2026 | Domain: acstudioapps.us
          </p>

          <div className="mt-12 space-y-10 text-base leading-relaxed text-[#201a2a]/80">
            <section className="border-t border-[#201a2a]/15 pt-6">
              <h2 className="display-face text-2xl font-bold text-[#201a2a]">1. Overview & Scope</h2>
              <p className="mt-3">
                Advanced Creation Studio ("ACS", "we", "us", or "our") operates <span className="font-mono text-[#e76f5c]">acstudioapps.us</span> and all associated subdomain web applications (including <span className="font-mono">llb.acstudioapps.us</span>, <span className="font-mono">starbuster.acstudioapps.us</span>, <span className="font-mono">codelabs.acstudioapps.us</span>, and <span className="font-mono">nexuslore.acstudioapps.us</span>). We are committed to maintaining the highest level of user privacy and transparency.
              </p>
            </section>

            <section className="border-t border-[#201a2a]/15 pt-6">
              <h2 className="display-face text-2xl font-bold text-[#201a2a]">2. Data Collection Practices</h2>
              <p className="mt-3">
                We design our applications to minimize data collection. Most studio tools and PWAs operate with browser-local state (IndexedDB and LocalStorage), ensuring your active sessions, notes, case law searches, and game progress remain private to your local browser environment.
              </p>
              <ul className="mt-4 list-disc pl-6 space-y-2">
                <li><strong>Local Storage:</strong> Used to maintain offline availability for PWA applications.</li>
                <li><strong>Inquiries & Briefs:</strong> When you voluntarily submit a project inquiry, we collect your email address and project description solely to respond to your request.</li>
                <li><strong>No Telemetry Selling:</strong> We do NOT sell, monetize, or share your personal information or telemetry to third-party ad networks.</li>
              </ul>
            </section>

            <section className="border-t border-[#201a2a]/15 pt-6">
              <h2 className="display-face text-2xl font-bold text-[#201a2a]">3. Progressive Web App (PWA) Security</h2>
              <p className="mt-3">
                All PWA apps hosted under acstudioapps.us utilize encrypted TLS connections (HTTPS) and isolated service workers to ensure that offline data caching complies with modern browser security standards.
              </p>
            </section>

            <section className="border-t border-[#201a2a]/15 pt-6">
              <h2 className="display-face text-2xl font-bold text-[#201a2a]">4. Contact & Data Inquiries</h2>
              <p className="mt-3">
                If you have privacy questions or wish to request data erasure, contact our administrative desk:
              </p>
              <div className="mt-4 rounded-lg border border-[#201a2a]/20 bg-[#eee7d5] p-4 font-mono text-sm">
                Email: <a href="mailto:admnowner@advancedcreationstudio.com" className="text-[#e76f5c] underline">admnowner@advancedcreationstudio.com</a><br />
                Domain Host: acstudioapps.us<br />
                Entity: Advanced Creation Studio
              </div>
            </section>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#201a2a]/15 bg-[#eee7d5] px-5 py-10 text-[#201a2a] sm:px-8 lg:px-12">
        <div className="editorial-wrap flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div className="mono-face text-[10px] uppercase tracking-[.14em] text-[#201a2a]/60">
            © 2026 Advanced Creation Studio — All Rights Reserved
          </div>
          <div className="flex gap-6 mono-face text-[10px] uppercase tracking-[.14em]">
            <a href="/" className="hover:text-[#e76f5c]">Home</a>
            <a href="/projects" className="hover:text-[#e76f5c]">Projects</a>
            <a href="/privacy" className="text-[#e76f5c]">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/privacy" component={PrivacyPolicyPage} />
        <Route path="/privacy-policy" component={PrivacyPolicyPage} />
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