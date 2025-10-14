import React, { useEffect, useRef, useState } from "react";

/**
 * Fynstra — One-page marketing site (Copywriting-first)
 * - Premium expand/collapse with smooth open/close
 * - Overlay stays mounted through fade-out (no snap)
 * - Mobile menu preserved
 */

const brand = {
  blue: "#CFE4FF",
  lavender: "#C8BBFF",
  purple: "#7C5CF0",
  teal: "#4FB4C6",
  ink: "#222222",
  subtext: "#555555",
  bg: "#FAFAFA",
};

const ANIM_MS = 420;
const EASE = "[cubic-bezier(0.22,0.61,0.36,1)]";

const svgTile = (a: string, b: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${a}'/>
          <stop offset='100%' stop-color='${b}'/>
        </linearGradient>
      </defs>
      <rect width='320' height='320' rx='36' fill='url(#g)'/>
    </svg>`
  );

const PUBLIC_LOGO = "/fynstra-logo.png";
const fallbackLogo = svgTile(brand.lavender, brand.purple);
const defaultBannerLeft = svgTile(brand.blue, brand.lavender);
const defaultBannerRight = svgTile(brand.lavender, brand.purple);
const CALENDLY_URL = "https://calendly.com/";

function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const els = root.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("reveal-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return containerRef;
}

/* =========================
 * Expandable Card Grid
 * =========================*/

type CardItem = {
  title: string;
  subtitle?: string;
  rightMeta?: React.ReactNode;
  panel: React.ReactNode;
  titleIsPurple?: boolean;
};

function CardGrid({
  items,
  openIndex,
  closingIndex,
  onToggle,
  anyOpen,
  className = "",
  center = false,
  cols = { base: 1, md: 2, lg: 3 },
  headingStrong = true,
}: {
  items: CardItem[];
  openIndex: number | null;
  closingIndex: number | null;
  onToggle: (i: number | null) => void;
  anyOpen: boolean;
  className?: string;
  center?: boolean;
  cols?: { base: number; md: number; lg: number };
  headingStrong?: boolean;
}) {
  const gridCols = `grid-cols-${cols.base} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg}`;

  return (
    <div
      className={[
        "grid gap-4 sm:gap-6",
        gridCols,
        center ? "place-items-center" : "",
        className,
      ].join(" ")}
    >
      {items.map((it, i) => {
        const isOpen = openIndex === i;
        const isClosing = closingIndex === i;
        const isActiveForPanel = isOpen || isClosing; // keep mounted during close
        const dimOthers = anyOpen && !isActiveForPanel;

        return (
          <div
            key={it.title + i}
            className={[
              "relative rounded-2xl border bg-white shadow-sm transition-opacity",
              "border-indigo-200",
              isActiveForPanel ? "z-[60]" : "z-0",
              dimOthers ? "opacity-40" : "opacity-100",
              `duration-[${ANIM_MS}ms] ease-${EASE}`,
              center ? "w-full max-w-2xl" : "w-full",
            ].join(" ")}
          >
            {/* Header */}
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`panel-${i}`}
              onClick={() => onToggle(isOpen ? null : i)}
              className="w-full text-left px-4 sm:px-5 py-3 sm:py-4 flex items-start gap-3"
            >
              <div className="flex-1">
                <div
                  className={`font-semibold ${
                    it.titleIsPurple ? "text-2xl" : "text-lg sm:text-xl"
                  } ${it.titleIsPurple ? "" : headingStrong ? "text-slate-900" : "text-slate-800"}`}
                  style={it.titleIsPurple ? { color: brand.purple } : undefined}
                >
                  {it.title}
                </div>
                {it.subtitle && (
                  <div className="mt-0.5 text-sm text-slate-700">{it.subtitle}</div>
                )}
              </div>

              <div className="ml-2 shrink-0 flex flex-col items-end">
                {it.rightMeta && (
                  <div className="text-[11px] sm:text-xs text-slate-500 mb-1">
                    {it.rightMeta}
                  </div>
                )}
                <svg
                  className={[
                    "h-5 w-5 text-slate-500 transition-transform",
                    isOpen ? "rotate-180" : "",
                    `duration-[${ANIM_MS}ms] ease-${EASE}`,
                  ].join(" ")}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </button>

            {/* Floating expandable panel */}
            {isActiveForPanel && (
              <div
                id={`panel-${i}`}
                className={[
                  "absolute left-0 right-0 z-[65] will-change-[transform,opacity]",
                  "transition-all transform-gpu",
                  `duration-[${ANIM_MS}ms] ease-${EASE}`,
                  isOpen
                    ? "pointer-events-auto top-[calc(100%+0.5rem)] opacity-100 translate-y-0 scale-[1] shadow-xl"
                    : "pointer-events-none top-[calc(100%+0.5rem)] opacity-0 -translate-y-1 scale-[0.98]",
                ].join(" ")}
                aria-hidden={!isOpen}
              >
                <div className="rounded-2xl border border-black/10 bg-white px-4 sm:px-5 py-4">
                  {it.panel}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* =========================
 * App
 * =========================*/

export default function App({
  logoSrc = PUBLIC_LOGO,
  bannerLeft = defaultBannerLeft,
  bannerRight = defaultBannerRight,
}: {
  logoSrc?: string;
  bannerLeft?: string;
  bannerRight?: string;
}) {
  const containerRef = useScrollReveal();

  // open indexes
  const [openService, setOpenService] = useState<number | null>(null);
  const [openPackage, setOpenPackage] = useState<number | null>(null);

  // closing indexes (animate out smoothly)
  const [closingService, setClosingService] = useState<number | null>(null);
  const [closingPackage, setClosingPackage] = useState<number | null>(null);

  const [mobileOpen, setMobileOpen] = useState(false);

  // consider "open" while any is open or closing (keeps siblings dim)
  const anyOpen =
    openService !== null ||
    openPackage !== null ||
    closingService !== null ||
    closingPackage !== null;

  // Backdrop visibility (linger after anyOpen goes false so fade completes)
  const [backdropVisible, setBackdropVisible] = useState(false);
  useEffect(() => {
    if (anyOpen) setBackdropVisible(true);
    else {
      const t = setTimeout(() => setBackdropVisible(false), ANIM_MS + 80);
      return () => clearTimeout(t);
    }
  }, [anyOpen]);

  // lock scroll when cards or menu are open
  useEffect(() => {
    document.body.style.overflow = anyOpen || mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [anyOpen, mobileOpen]);

  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
    const hero = document.getElementById("hero-bg");
    const onScroll = () => {
      if (hero) (hero as HTMLElement).style.opacity = window.scrollY > 80 ? "0.7" : "1";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- Services: Copywriting only (centered)
  const services: CardItem[] = [
    {
      title: "Copywriting",
      subtitle: "Clear, consistent language for web, product and campaigns.",
      rightMeta: <span>See packages below</span>,
      panel: (
        <div className="text-slate-700 space-y-3">
          <ul className="space-y-2">
            {[
              "Web + landing pages",
              "About / Service pages",
              "Blogs, emails, proposals",
            ].map((p) => (
              <li key={p} className="flex gap-2 items-start">
                <span
                  className="mt-1 h-2 w-2 rounded-full"
                  style={{ background: brand.purple }}
                />
                {p}
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-600">
            Pricing depends on research depth, voice development and revision
            cycles. See packages for typical ranges.
          </p>
        </div>
      ),
    },
  ];

  // --- Packages
  const packages: CardItem[] = [
    {
      title: "Budget",
      titleIsPurple: true,
      subtitle: "Short-form social copy (3–5 captions).",
      panel: (
        <div className="text-slate-700 space-y-3">
          <div className="text-slate-900 font-medium">£80 – £120</div>
          <ul className="space-y-2">
            {[
              "Quick kickoff prompt + tone guide",
              "One revision round",
              "Delivery in editable doc + ready-to-paste set",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full" style={{ background: brand.purple }} />
                {p}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-pri">Enquire</a>
        </div>
      ),
    },
    {
      title: "Starter",
      titleIsPurple: true,
      subtitle: "Web or blog copy up to 500 words.",
      panel: (
        <div className="text-slate-700 space-y-3">
          <div className="text-slate-900 font-medium">£200 – £300</div>
          <ul className="space-y-2">
            {[
              "Light research + outline",
              "Two revision rounds",
              "SEO basics (title, meta, H-structure)",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full" style={{ background: brand.purple }} />
                {p}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-pri">Enquire</a>
        </div>
      ),
    },
    {
      title: "Growth",
      titleIsPurple: true,
      subtitle: "In-depth article or full page (~1 000 words).",
      panel: (
        <div className="text-slate-700 space-y-3">
          <div className="text-slate-900 font-medium">£400 – £600</div>
          <ul className="space-y-2">
            {[
              "Interview(s) or source pack review",
              "Messaging alignment + voice calibration",
              "Two revision rounds + visuals guidance",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full" style={{ background: brand.purple }} />
                {p}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-pri">Enquire</a>
        </div>
      ),
    },
    {
      title: "Launch",
      titleIsPurple: true,
      subtitle: "Multi-page site or campaign set (~2 000 words).",
      panel: (
        <div className="text-slate-700 space-y-3">
          <div className="text-slate-900 font-medium">£700 – £1 000</div>
          <ul className="space-y-2">
            {[
              "Homepage + 2–3 key pages or equivalent set",
              "Messaging framework + editorial notes",
              "Two rounds across the set",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full" style={{ background: brand.purple }} />
                {p}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-pri">Enquire</a>
        </div>
      ),
    },
    {
      title: "Retainer",
      titleIsPurple: true,
      subtitle: "Regular content (~4 000 words/month).",
      panel: (
        <div className="text-slate-700 space-y-3">
          <div className="text-slate-900 font-medium">£1 200 – £1 400 / month</div>
          <ul className="space-y-2">
            {[
              "Monthly planning call + backlog",
              "Priority turnaround windows",
              "Carry-over up to 20% one month",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full" style={{ background: brand.purple }} />
                {p}
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-pri">Enquire</a>
        </div>
      ),
    },
  ];

  // Backdrop + close helpers
  const startCloseService = (idx: number) => {
    setClosingService(idx);
    setOpenService(null);
    setTimeout(() => setClosingService(null), ANIM_MS);
  };
  const startClosePackage = (idx: number) => {
    setClosingPackage(idx);
    setOpenPackage(null);
    setTimeout(() => setClosingPackage(null), ANIM_MS);
  };

  const toggleService = (i: number | null) => {
    if (i === null) {
      if (openService !== null) startCloseService(openService);
      return;
    }
    if (openPackage !== null) startClosePackage(openPackage);
    if (openService === null) {
      setOpenService(i);
    } else if (openService === i) {
      startCloseService(openService);
    } else {
      const prev = openService;
      startCloseService(prev);
      setTimeout(() => setOpenService(i), ANIM_MS + 20);
    }
  };

  const togglePackage = (i: number | null) => {
    if (i === null) {
      if (openPackage !== null) startClosePackage(openPackage);
      return;
    }
    if (openService !== null) startCloseService(openService);
    if (openPackage === null) {
      setOpenPackage(i);
    } else if (openPackage === i) {
      startClosePackage(openPackage);
    } else {
      const prev = openPackage;
      startClosePackage(prev);
      setTimeout(() => setOpenPackage(i), ANIM_MS + 20);
    }
  };

  return (
    <div ref={containerRef} className="text-slate-100 bg-white selection:bg-indigo-200/60">
      {/* Global styles */}
      <style>{`
        :root {
          --fynstra-blue: ${brand.blue};
          --fynstra-lavender: ${brand.lavender};
          --fynstra-purple: ${brand.purple};
          --fynstra-teal: ${brand.teal};
          --fynstra-text: ${brand.ink};
          --fynstra-subtext: ${brand.subtext};
          --fynstra-bg: ${brand.bg};
          --font-primary: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        }
        body, * { font-family: var(--font-primary); }
        .heading-gradient {
          background: linear-gradient(90deg, var(--fynstra-blue) 0%, var(--fynstra-lavender) 50%, var(--fynstra-purple) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity .6s ease, transform .6s ease; }
        .reveal-in { opacity: 1; transform: translateY(0); }
        .btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 1rem; padding: .75rem 1.25rem; font-weight: 500; box-shadow: 0 1px 2px rgba(0,0,0,.06); transition: all .2s ease; }
        .btn-pri { background: var(--fynstra-purple); color: #fff; }
        .btn-pri:hover { filter: brightness(.95); }
        .btn-ghost { border: 1px solid rgba(0,0,0,.1); color: #0f172a; background: transparent; }
        .btn-ghost:hover { background: rgba(0,0,0,.04); }
      `}</style>

      {/* HEADER */}
      <Header
        logoSrc={logoSrc}
        fallbackLogo={fallbackLogo}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* HERO */}
      <Hero
        logoSrc={logoSrc}
        fallbackLogo={fallbackLogo}
        bannerLeft={bannerLeft}
        bannerRight={bannerRight}
      />

      {/* ABOUT */}
      <About />

      {/* SERVICES + PACKAGES */}
      <section id="services" className="py-16 sm:py-20 lg:py-24 bg-slate-50 relative">
        {/* Overlay now stays mounted through fade: render when anyOpen OR backdropVisible */}
        {(anyOpen || backdropVisible) && (
          <button
            aria-label="Close expanded card"
            onClick={() => {
              if (openService !== null) startCloseService(openService);
              if (openPackage !== null) startClosePackage(openPackage);
            }}
            className={[
              "fixed inset-0 z-[50] transition-opacity backdrop-blur-sm",
              anyOpen ? "bg-black/60 opacity-100 pointer-events-auto" : "bg-black/60 opacity-0 pointer-events-none",
              `duration-[${ANIM_MS}ms] ease-${EASE}`,
            ].join(" ")}
          />
        )}

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal" data-reveal>
            <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900">Services</h2>
            <p className="mt-3 max-w-2xl text-slate-700">
              We’re currently focused on copywriting for early traction.
            </p>
          </div>

          {/* Single centered service card */}
          <div className="mt-8 sm:mt-10">
            <CardGrid
              items={services}
              openIndex={openService}
              closingIndex={closingService}
              onToggle={toggleService}
              anyOpen={anyOpen}
              center
              cols={{ base: 1, md: 1, lg: 1 }}
              headingStrong
            />
          </div>

          {/* Packages */}
          <div className="mt-10 sm:mt-12">
            <CardGrid
              items={packages}
              openIndex={openPackage}
              closingIndex={closingPackage}
              onToggle={togglePackage}
              anyOpen={anyOpen}
              headingStrong={false}
              cols={{ base: 1, md: 2, lg: 3 }}
            />
          </div>

          <p className="mt-6 text-sm text-slate-500">
            Ranges are indicative; we’ll confirm scope and a fixed quote after a short brief.
          </p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CONTACT */}
      <Contact />

      {/* FOOTER */}
      <Footer logoSrc={logoSrc} fallbackLogo={fallbackLogo} />
    </div>
  );
}

/* =========================
 * Subcomponents
 * =========================*/

function Header({
  logoSrc,
  fallbackLogo,
  mobileOpen,
  setMobileOpen,
}: {
  logoSrc: string;
  fallbackLogo: string;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-[70] backdrop-blur-sm bg-white/70 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <img
            src={logoSrc}
            onError={(e) => ((e.currentTarget.src = fallbackLogo))}
            alt="Fynstra"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
          />
          <span className="text-xl sm:text-2xl font-semibold text-slate-900 group-hover:text-slate-700 transition">
            Fynstra
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-slate-700">
          <a href="#about" className="hover:text-slate-900">About</a>
          <a href="#services" className="hover:text-slate-900">Services</a>
          <a href="#testimonials" className="hover:text-slate-900">Testimonials</a>
          <a href="#contact" className="hover:text-slate-900">Contact</a>
          <a href="#contact" className="btn btn-pri ml-2">Book a chat</a>
        </nav>

        <button
          type="button"
          aria-label="Open menu"
          className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-slate-600 hover:bg-slate-100"
          onClick={() => setMobileOpen(true)}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={[
          "md:hidden fixed inset-0 z-[80] bg-black/50 transition-opacity backdrop-blur-[2px]",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          `duration-[${ANIM_MS}ms] ease-${EASE}`,
        ].join(" ")}
      />

      {/* Mobile sheet */}
      <div
        className={[
          "md:hidden fixed top-16 inset-x-0 z-[85] px-4",
          "transition-all",
          `duration-[${ANIM_MS}ms] ease-${EASE}`,
          mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-lg text-slate-900">
          <a href="#about" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-lg hover:bg-slate-50">About</a>
          <a href="#services" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-lg hover:bg-slate-50">Services</a>
          <a href="#testimonials" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-lg hover:bg-slate-50">Testimonials</a>
          <a href="#contact" onClick={() => setMobileOpen(false)} className="block px-2 py-2 rounded-lg hover:bg-slate-50">Contact</a>
          <a href="#contact" onClick={() => setMobileOpen(false)} className="mt-3 btn btn-pri w-full">Book a chat</a>
        </div>
      </div>
    </header>
  );
}

function Hero({
  logoSrc,
  fallbackLogo,
  bannerLeft,
  bannerRight,
}: {
  logoSrc: string;
  fallbackLogo: string;
  bannerLeft: string;
  bannerRight: string;
}) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          id="hero-bg"
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(90deg, var(--fynstra-blue) 0%, var(--fynstra-lavender) 50%, var(--fynstra-purple) 100%)",
          }}
        />
        <img
          src={bannerLeft}
          alt="Brand motif"
          className="absolute left-0 top-0 opacity-40 w-56 sm:w-72 md:w-96 -translate-x-[15%] -translate-y-[15%] blur-[1px]"
        />
        <img
          src={bannerRight}
          alt="Brand motif"
          className="absolute right-[-20%] md:right-[-10%] bottom-[-28%] md:bottom-[-20%] opacity-50 w-[28rem] sm:w-[36rem] md:w-[48rem] rotate-6 blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/60 via-white/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="reveal" data-reveal>
            <h1 className="text-[2rem] sm:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight">
              Convert with <span className="heading-gradient">clear, credible</span> copy.
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-700 max-w-xl">
              We help startups ship copy that reads fast and feels right — landing pages, product pages, and content that
              moves the work forward.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
              <a href="#services" className="btn btn-pri">Explore services</a>
              <a href="#contact" className="btn btn-ghost">Get in touch</a>
            </div>
            <div className="mt-8 sm:mt-10 flex items-center gap-4">
              <img
                src={logoSrc}
                onError={(e) => ((e.currentTarget.src = fallbackLogo))}
                alt="Fynstra"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-contain"
              />
            </div>
          </div>

          <div className="reveal" data-reveal>
            <div className="relative rounded-3xl ring-1 ring-black/10 bg-white/60 backdrop-blur p-4 sm:p-6 shadow-xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--fynstra-blue), var(--fynstra-purple))",
                  }}
                />
                <div className="absolute -top-16 -right-16 h-56 w-56 sm:h-64 sm:w-64 rounded-full bg-white/30 blur-3xl opacity-40" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 sm:h-72 sm:w-72 rounded-full bg-[rgba(79,180,198,0.35)] blur-3xl opacity-50" />
                <div className="relative z-10 h-full w-full flex flex-col items-start justify-center text-white px-6 sm:px-10">
                  <img
                    src={logoSrc}
                    onError={(e) => ((e.currentTarget.src = fallbackLogo))}
                    alt="Fynstra"
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-contain shadow-md ring-1 ring-white/40"
                  />
                  <div className="mt-3 text-xl sm:text-3xl font-semibold tracking-tight">
                    Clarity through content
                  </div>
                  <div className="mt-2 sm:mt-3 text-sm sm:text-base text-white/85 font-light">
                    Copy • Strategy • Comms
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 1px 1px, rgba(255,255,255,.8) 1px, transparent 1px)",
                    backgroundSize: "6px 6px",
                  }}
                />
              </div>
              <div className="mt-3 sm:mt-4 text-slate-700 text-sm sm:text-base">
                Lean, modern, and fast to ship. This prototype mirrors the final structure we’ll deploy on Vercel.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          <div className="lg:col-span-5 reveal" data-reveal>
            <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900">About Fynstra</h2>
            <p className="mt-3 sm:mt-4 text-slate-700">
              We pair sharp language with sensible structure. From web copy to content systems, our work turns ambiguity
              into action. Clear artifacts, faster decisions, better outcomes.
            </p>
            <ul className="mt-5 sm:mt-6 space-y-3 text-slate-700">
              <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: brand.purple }}></span> Crisp copy and messaging frameworks</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: brand.purple }}></span> Practical guidance: structure, tone, voice</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: brand.purple }}></span> Lightweight process that respects your time</li>
            </ul>
          </div>
          <div className="lg:col-span-7 reveal" data-reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Clear", "Consistent", "Credible"].map((k) => (
                <div key={k} className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-sm">
                  <div className="text-lg sm:text-xl font-semibold text-slate-900">{k}</div>
                  <p className="mt-2 sm:mt-3 text-sm text-slate-600">
                    We keep language simple, structure tidy, and promises realistic.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal" data-reveal>
          <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900">Kind words</h2>
          <p className="mt-3 text-slate-700 max-w-2xl">
            Placeholders until we add real quotes. Keep it concise and outcome-focused.
          </p>
        </div>
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <figure key={i} className="reveal" data-reveal>
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-5 sm:p-6 h-full">
                <blockquote className="text-slate-700">
                  “Fynstra made our message clearer and our rollout smoother. The copy just worked.”
                </blockquote>
                <figcaption className="mt-4 text-sm text-slate-500">
                  Client name • Role, Company
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-start">
          <div className="reveal" data-reveal>
            <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900">Let’s talk</h2>
            <p className="mt-3 text-slate-700 max-w-xl">
              Two ways to connect: drop a note or book a quick intro call. We’ll keep it focused on goals, scope, and timelines.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#calendly" className="btn btn-pri">Book a call</a>
              <a href="mailto:info@fynstra.co.uk" className="btn btn-ghost">Email us</a>
            </div>
            <div className="mt-8 sm:mt-10 text-sm text-slate-600">
              Prefer a simple brief? Add bullet points about your goals, audience, deliverables, and deadline — we’ll reply with a scoped plan.
            </div>
          </div>

          <div className="reveal" data-reveal>
            <form className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="text-sm text-slate-600">Name</span>
                  <input
                    className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-600">Email</span>
                  <input
                    type="email"
                    className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="you@company.com"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-slate-600">Project overview</span>
                  <textarea
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="Goals, audience, deliverables, timeline"
                  />
                </label>
                <button type="button" className="btn btn-pri w-full">Send (placeholder)</button>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                This form is a front-end placeholder. Swap for a real form handler (Formspree, Resend, serverless function) when we go live.
              </p>
            </form>
          </div>
        </div>

        {/* Calendly placeholder */}
        <div id="calendly" className="mt-10 sm:mt-14 reveal" data-reveal>
          <div className="rounded-2xl overflow-hidden border border-black/10 bg-white shadow-sm">
            <div className="px-5 sm:px-6 py-4 border-b border-black/10 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Scheduling</div>
                <div className="text-base sm:text-lg font-semibold text-slate-900">Book a 20-minute intro</div>
              </div>
              <a href={CALENDLY_URL} className="btn btn-pri">Open Calendly</a>
            </div>
            <div className="aspect-[16/9] bg-slate-50 flex items-center justify-center text-slate-500">
              <iframe title="Calendly" src={CALENDLY_URL} className="w-full h-full hidden" />
              <div className="p-6 text-center">
                Calendly embed goes here. Replace URL above and show the iframe when ready.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ logoSrc, fallbackLogo }: { logoSrc: string; fallbackLogo: string }) {
  return (
    <footer className="py-8 sm:py-10 bg-white border-t border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3">
          <img
            src={logoSrc}
            onError={(e) => ((e.currentTarget.src = fallbackLogo))}
            alt="Fynstra"
            className="h-6 w-6 sm:h-7 sm:w-7 rounded-xl object-contain"
          />
          <span className="text-slate-700 text-sm sm:text-base">© {new Date().getFullYear()} Fynstra Ltd</span>
        </div>
        <div className="text-slate-500 text-xs sm:text-sm">
          Built with React + Tailwind. Deployed on Vercel.
        </div>
      </div>
    </footer>
  );
}