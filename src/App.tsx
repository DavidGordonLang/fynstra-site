import React, { useEffect, useRef, useState } from "react";

/**
 * Fynstra — One-page marketing site (Copywriting-first)
 * - Stronger sage background gradient
 * - About = original airy layout + expandable principle cards (all expand together)
 * - Packages back to airy grid on desktop
 * - Open animation mirrors close (same timing, same curve, simultaneous overlay/panel)
 * - Service/package auto-scrolls into view on open (no cutoff)
 * - About cards: gradient fades in on hover and persists while expanded (BL ➜ TR)
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
const EASE = "cubic-bezier(0.22,0.61,0.36,1)";

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
const CALENDLY_URL = "https://calendly.com/fynstrabd/30min";

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
 * Expandable Card Grid (services/packages)
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
  overlayPhase,
  className = "",
  center = false,
  cols = { base: 1, md: 2, lg: 3 },
  headingStrong = true,
  groupId,
}: {
  items: CardItem[];
  openIndex: number | null;
  closingIndex: number | null;
  onToggle: (i: number | null) => void;
  overlayPhase: "open" | "closing" | "idle";
  className?: string;
  center?: boolean;
  cols?: { base: number; md: number; lg: number };
  headingStrong?: boolean;
  groupId: "services" | "packages";
}) {
  const gridCols = `grid-cols-${cols.base} md:grid-cols-${cols.md} lg:grid-cols-${cols.lg}`;

  const Item = ({ it, i }: { it: CardItem; i: number }) => {
    const isOpen = openIndex === i;
    const isClosing = closingIndex === i;
    const isActiveForPanel = isOpen || isClosing;

    const dimOthers = overlayPhase === "open" && !isActiveForPanel;

    // Ensure open anim doesn't pop in instantly
    const [entered, setEntered] = useState(false);
    useEffect(() => {
      if (isOpen) {
        setEntered(false);
        const id = requestAnimationFrame(() => setEntered(true));
        return () => cancelAnimationFrame(id);
      } else {
        setEntered(false);
      }
    }, [isOpen]);

    return (
      <div
        className={[
          "relative rounded-2xl border bg-white shadow-sm transition-opacity",
          "border-indigo-200",
          isActiveForPanel ? "z-[60]" : "z-0",
          dimOthers ? "opacity-40" : "opacity-100",
        ].join(" ")}
        style={{ transition: `opacity ${ANIM_MS}ms ${EASE}` }}
      >
        {/* Header */}
        <button
          id={`card-header-${groupId}-${i}`}
          type="button"
          aria-expanded={isOpen}
          aria-controls={`panel-${groupId}-${i}`}
          onClick={() => onToggle(isOpen ? null : i)}
          className="w-full text-left px-4 sm:px-5 py-3 sm:py-4 flex items-start gap-3"
        >
          <div className="flex-1">
            <div
              className={`font-semibold ${it.titleIsPurple ? "text-2xl" : "text-lg sm:text-xl"} ${
                it.titleIsPurple ? "" : headingStrong ? "text-slate-900" : "text-slate-800"
              }`}
              style={it.titleIsPurple ? { color: brand.purple } : undefined}
            >
              {it.title}
            </div>
            {it.subtitle && <div className="mt-0.5 text-sm text-slate-700">{it.subtitle}</div>}
          </div>

          <div className="ml-2 shrink-0 flex flex-col items-end">
            {it.rightMeta && <div className="text-[11px] sm:text-xs text-slate-500 mb-1">{it.rightMeta}</div>}
            <svg
              className={["h-5 w-5 text-slate-500 transition-transform", isOpen ? "rotate-180" : ""].join(" ")}
              style={{ transition: `transform ${ANIM_MS}ms ${EASE}` }}
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </button>

        {/* Floating expandable panel (kept mounted while closing) */}
        {isActiveForPanel && (
          <div
            id={`panel-${groupId}-${i}`}
            className={[
              "absolute left-0 right-0 z-[65] will-change-[transform,opacity]",
              "transform-gpu",
              "top-[calc(100%+0.5rem)]",
              isOpen ? "pointer-events-auto" : "pointer-events-none",
            ].join(" ")}
            style={{
              transition: `opacity ${ANIM_MS}ms ${EASE}, transform ${ANIM_MS}ms ${EASE}`,
              opacity: isOpen ? (entered ? 1 : 0) : 0,
              transform: isOpen
                ? entered
                  ? "translateY(0) scale(1)"
                  : "translateY(-4px) scale(0.985)"
                : "translateY(-4px) scale(0.985)",
            }}
            aria-hidden={!isOpen}
          >
            <div className="rounded-2xl border border-black/10 bg-white px-4 sm:px-5 py-4 shadow-xl">
              {it.panel}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={["grid gap-4 sm:gap-6", gridCols, center ? "place-items-center" : "", className].join(" ")}>
      {items.map((it, i) => (
        <Item key={it.title + ":" + i} it={it} i={i} />
      ))}
    </div>
  );
}

/* =========================
 * About principle cards (accordion; one open at a time)
 * =========================*/
function AboutPrinciples() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const GRAD_MS = 520;

  const Card = ({
    title,
    children,
    i,
  }: {
    title: string;
    children: React.ReactNode;
    i: number;
  }) => {
    const isOpen = openIndex === i;
    const toggle = () => setOpenIndex(isOpen ? null : i);

    return (
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        data-open={isOpen}
        className="about-card group relative overflow-hidden text-left rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"  // <-- no h-full
        style={{ transition: `box-shadow ${ANIM_MS}ms ${EASE}` }}
      >
        <div
          aria-hidden
          className="gradient-reveal pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(to top right, var(--fynstra-purple) 0%, var(--fynstra-lavender) 55%, var(--fynstra-blue) 100%)",
          }}
        />
        <style>{`
          .about-card .gradient-reveal { opacity: 0; transition: opacity ${GRAD_MS}ms ${EASE}; }
          .about-card:hover .gradient-reveal,
          .about-card:focus-visible .gradient-reveal,
          .about-card[data-open="true"] .gradient-reveal { opacity: .9; }
        `}</style>

        <div className="relative flex items-start justify-between gap-3 min-h-[36px]">
          <div className="text-lg sm:text-xl font-semibold text-slate-900">{title}</div>
          <svg
            className={["h-5 w-5 text-slate-600 transition-transform", isOpen ? "rotate-180" : ""].join(" ")}
            style={{ transition: `transform ${ANIM_MS}ms ${EASE}` }}
            viewBox="0 0 24 24"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </div>

        <div
          className="relative overflow-hidden mt-1"
          style={{
            transition: `max-height ${ANIM_MS}ms ${EASE}, opacity ${ANIM_MS}ms ${EASE}`,
            maxHeight: isOpen ? 220 : 0,
            opacity: isOpen ? 1 : 0,
          }}
        >
          <div className="mt-3 text-sm text-slate-700 leading-relaxed">{children}</div>
        </div>
      </button>
    );
  };

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-start"> {/* <-- items-start */}
      <Card i={0} title="Clear">
        <p>
          We use straightforward language to make your message easy to grasp at first glance. Clarity helps your
          audience act quickly and with confidence.
        </p>
      </Card>

      <Card i={1} title="Consistent">
        <p>
          Every piece of communication we write for you will follow the same rhythm, tone and structure. Consistency
          builds trust and strengthens your brand voice.
        </p>
      </Card>

      <Card i={2} title="Credible">
        <p>
          Our words are grounded in fact and intent. Credibility turns attention into belief, belief into trust and trust
          into action.
        </p>
      </Card>
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

  // Open indexes
  const [openService, setOpenService] = useState<number | null>(null);
  const [openPackage, setOpenPackage] = useState<number | null>(null);
  // Closing indexes (to animate out)
  const [closingService, setClosingService] = useState<number | null>(null);
  const [closingPackage, setClosingPackage] = useState<number | null>(null);

  // Overlay phase: drives opacity, blur, and sibling dim timing
  const [overlayPhase, setOverlayPhase] = useState<"open" | "closing" | "idle">("idle");
  const overlayMounted = overlayPhase !== "idle";

  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock scroll when cards or menu are open
  useEffect(() => {
    const lock = overlayPhase !== "idle" || mobileOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlayPhase, mobileOpen]);

  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");
    const hero = document.getElementById("hero-bg");
    const onScroll = () => {
      if (hero) (hero as HTMLElement).style.opacity = window.scrollY > 80 ? "0.7" : "1";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- Auto scroll helper (keeps the opened card comfortably in view)
  const scrollCardIntoView = (group: "services" | "packages", index: number) => {
    requestAnimationFrame(() => {
      const el = document.getElementById(`card-header-${group}-${index}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    });
  };

  // Services (copywriting only)
  const services: CardItem[] = [
    {
      title: "Copywriting",
      subtitle: "Clear, consistent language for web, product and campaigns.",
      rightMeta: <span>See packages below</span>,
      panel: (
        <div className="text-slate-700 space-y-3">
          <ul className="space-y-2">
            {["Web + landing pages", "Technical Documents", "Blogs, emails, proposals"].map((p) => (
              <li key={p} className="flex gap-2 items-start">
                <span className="mt-1 h-2 w-2 rounded-full" style={{ background: brand.purple }} />
                {p}
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-600">
            Pricing depends on research depth and revision cycles.
          </p>
        </div>
      ),
    },
  ];

// Packages
const packages: CardItem[] = [
  {
    title: "Budget",
    titleIsPurple: true,
    subtitle: "Short-form social copy (3–5 captions).",
    panel: (
      <div className="text-slate-700 space-y-3">
        <ul className="space-y-2">
          {[
            "Quick kickoff prompt + tone guide",
            "One revision round",
            "Delivery in editable doc + ready-to-paste set",
          ].map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span
                className="mt-1 h-2 w-2 rounded-full"
                style={{ background: brand.purple }}
              />
              {p}
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn btn-pri">
          Enquire
        </a>
      </div>
    ),
  },
  {
    title: "Starter",
    titleIsPurple: true,
    subtitle: "Web or blog copy up to 500 words.",
    panel: (
      <div className="text-slate-700 space-y-3">
        <ul className="space-y-2">
          {[
            "Light research + outline",
            "Two revision rounds",
            "SEO basics (title, meta, H-structure)",
          ].map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span
                className="mt-1 h-2 w-2 rounded-full"
                style={{ background: brand.purple }}
              />
              {p}
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn btn-pri">
          Enquire
        </a>
      </div>
    ),
  },
  {
    title: "Growth",
    titleIsPurple: true,
    subtitle: "In-depth article or full page (~1 000 words).",
    panel: (
      <div className="text-slate-700 space-y-3">
        <ul className="space-y-2">
          {[
            "Interview(s) or source pack review",
            "Messaging alignment + voice calibration",
            "Two revision rounds + visuals guidance",
          ].map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span
                className="mt-1 h-2 w-2 rounded-full"
                style={{ background: brand.purple }}
              />
              {p}
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn btn-pri">
          Enquire
        </a>
      </div>
    ),
  },
  {
    title: "Launch",
    titleIsPurple: true,
    subtitle: "Multi-page site or campaign set (~2 000 words).",
    panel: (
      <div className="text-slate-700 space-y-3">
        <ul className="space-y-2">
          {[
            "Homepage + 2–3 key pages or equivalent set",
            "Messaging framework + editorial notes",
            "Two rounds across the set",
          ].map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span
                className="mt-1 h-2 w-2 rounded-full"
                style={{ background: brand.purple }}
              />
              {p}
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn btn-pri">
          Enquire
        </a>
      </div>
    ),
  },
  {
    title: "Retainer",
    titleIsPurple: true,
    subtitle: "Regular content (~4 000 words/month).",
    panel: (
      <div className="text-slate-700 space-y-3">
        <ul className="space-y-2">
          {[
            "Monthly planning call + backlog",
            "Priority turnaround windows",
            "Carry-over up to 20% one month",
          ].map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span
                className="mt-1 h-2 w-2 rounded-full"
                style={{ background: brand.purple }}
              />
              {p}
            </li>
          ))}
        </ul>
        <a href="#contact" className="btn btn-pri">
          Enquire
        </a>
      </div>
    ),
  },
];

  /* ---------- Close helpers ---------- */

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

  const closeAllWithOverlay = () => {
    setOverlayPhase("closing");
    if (openService !== null) startCloseService(openService);
    if (openPackage !== null) startClosePackage(openPackage);
    setTimeout(() => setOverlayPhase("idle"), ANIM_MS);
  };

  /* ---------- Toggle handlers (with auto scroll) ---------- */

  const toggleService = (i: number | null) => {
    if (i === null) {
      if (openService !== null) closeAllWithOverlay();
      return;
    }
    if (openPackage !== null) {
      setClosingPackage(openPackage);
      setTimeout(() => setClosingPackage(null), ANIM_MS);
      setOpenPackage(null);
    }
    if (openService === null) {
      setOverlayPhase("open");
      setOpenService(i);
      scrollCardIntoView("services", i);
    } else if (openService === i) {
      closeAllWithOverlay();
    } else {
      const prev = openService;
      setClosingService(prev);
      setOpenService(null);
      setTimeout(() => {
        setClosingService(null);
        setOpenService(i);
        scrollCardIntoView("services", i);
      }, ANIM_MS);
      if (overlayPhase === "idle") setOverlayPhase("open");
    }
  };

  const togglePackage = (i: number | null) => {
    if (i === null) {
      if (openPackage !== null) closeAllWithOverlay();
      return;
    }
    if (openService !== null) {
      setClosingService(openService);
      setTimeout(() => setClosingService(null), ANIM_MS);
      setOpenService(null);
    }
    if (openPackage === null) {
      setOverlayPhase("open");
      setOpenPackage(i);
      scrollCardIntoView("packages", i);
    } else if (openPackage === i) {
      closeAllWithOverlay();
    } else {
      const prev = openPackage;
      setClosingPackage(prev);
      setOpenPackage(null);
      setTimeout(() => {
        setClosingPackage(null);
        setOpenPackage(i);
        scrollCardIntoView("packages", i);
      }, ANIM_MS);
      if (overlayPhase === "idle") setOverlayPhase("open");
    }
  };

  return (
    <div ref={containerRef} className="text-slate-100 site-bg selection:bg-indigo-200/60 min-h-screen">
      {/* Global styles */}
      <style>{`
      /* === Alkatra font (self-hosted) === */
@font-face {
  font-family: "Alkatra";
  src: url("/fonts/Alkatra/Alkatra-VariableFont_wght.ttf") format("truetype");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
/* Use Alkatra only when we opt-in */
.font-alkatra {
  font-family: "Alkatra", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
}
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

        /* Darker highlight for "clear, credible" */
        .heading-gradient {
          background: linear-gradient(
            90deg,
            #9FC8FF 0%,
            #A693FF 48%,
            #6A49E8 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* Buttons */
        .btn { display: inline-flex; align-items: center; justify-content: center; border-radius: 1rem; padding: .75rem 1.25rem; font-weight: 500; box-shadow: 0 1px 2px rgba(0,0,0,.06); transition: all .2s ease; }
        .btn-pri { background: var(--fynstra-purple); color: #fff; }
        .btn-pri:hover { filter: brightness(.95); }
        .btn-ghost { border: 1px solid rgba(0,0,0,.1); color: #0f172a; background: transparent; }
        .btn-ghost:hover { background: rgba(0,0,0,.04); }

        /* Site background — stronger soft sage gradient */
        .site-bg {
          background:
            radial-gradient(1200px 600px at 20% -10%, #EAF4ED 0%, transparent 60%),
            radial-gradient(1200px 700px at 100% 10%, #E6F1EA 0%, transparent 55%),
            linear-gradient(180deg, #F3F8F4 0%, #E7F1EA 40%, #F7FBF8 100%);
        }

        /* Hero card background: dark bottom-left, lighter toward top-right, with a soft logo lift top-left */
        .hero-card-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(80% 80% at 15% 25%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0) 60%),
            linear-gradient(
              to top right,
              rgba(84,54,201,0.95) 0%,
              rgba(124,92,240,0.88) 35%,
              rgba(168,140,255,0.70) 60%,
              rgba(200,187,255,0.55) 78%,
              rgba(207,228,255,0.45) 100%
            );
        }
        .hero-card-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(900px 900px at 85% 15%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 60%);
          pointer-events: none;
        }

        /* Reveal */
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity .6s ease, transform .6s ease; }
        .reveal-in { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* HEADER */}
      <Header logoSrc={logoSrc} fallbackLogo={fallbackLogo} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* HERO */}
      <Hero logoSrc={logoSrc} fallbackLogo={fallbackLogo} bannerLeft={bannerLeft} bannerRight={bannerRight} />

      {/* ABOUT */}
      <section id="about" className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-start">
            <div className="lg:col-span-5 reveal" data-reveal>
              <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900">About Fynstra</h2>
              <p className="mt-3 sm:mt-4 text-slate-800">
               Businesses often struggle to sound the way they want.  That’s why we built Fynstra.
                </p>
              <p className="mt-3 sm:mt-4 text-slate-800">
After years working across creative and corporate environments, we saw how often strong ideas were lost in translation. Communication is everything. Whether it’s an email campaign, a newsletter, a post on socials, or a blog sharing what your company does and why it matters. We make sure you’re heard and your message lands exactly as you intend it to.
                </p>
              <p className="mt-3 sm:mt-4 text-slate-800">  
Our team brings years of experience across regulatory compliance, business process design, and financial crime prevention. From AML and KYC oversight to communication frameworks in complex, fast-moving industries. That perspective shapes how we write: precise, structured, and always true to intent.
                  </p>
              <p className="mt-3 sm:mt-4 text-slate-800">
We take the time to understand your business, so we can speak from it the way it deserves. Concise, clear and always on point.
Clarity in content.
              </p>
            </div>

            <div className="lg:col-span-7 reveal" data-reveal>
              <AboutPrinciples />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES + PACKAGES */}
      <section id="services" className="py-16 sm:py-20 lg:py-24 relative">
        {/* Overlay */}
        {overlayMounted && (
          <button
            aria-label="Close expanded card"
            onClick={closeAllWithOverlay}
            className="fixed inset-0 z-[50]"
            style={{
              transition: `opacity ${ANIM_MS}ms ${EASE}, backdrop-filter ${ANIM_MS}ms ${EASE}`,
              background: "rgba(0,0,0,0.6)",
              opacity: overlayPhase === "open" ? 1 : 0,
              backdropFilter: overlayPhase === "open" ? "blur(4px)" : "blur(0px)",
              pointerEvents: overlayPhase === "open" ? "auto" : "none",
            }}
          />
        )}

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal" data-reveal>
            <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900">Services</h2>
            <p className="mt-3 max-w-2xl text-slate-800"></p>
          </div>

          {/* Single centered service card */}
          <div className="mt-8 sm:mt-10">
            <CardGrid
              items={services}
              openIndex={openService}
              closingIndex={closingService}
              onToggle={toggleService}
              overlayPhase={overlayPhase}
              center
              cols={{ base: 1, md: 1, lg: 1 }}
              headingStrong
              groupId="services"
            />
          </div>

          {/* Packages */}
          <div className="mt-10 sm:mt-12">
            <CardGrid
              items={packages}
              openIndex={openPackage}
              closingIndex={closingPackage}
              onToggle={togglePackage}
              overlayPhase={overlayPhase}
              headingStrong={false}
              cols={{ base: 1, md: 2, lg: 3 }}
              groupId="packages"
            />
          </div>

          <p className="mt-6 text-sm text-slate-600">
            
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
    <header className="sticky top-0 z-[70] backdrop-blur-sm bg-white/80 border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <img src={logoSrc} onError={(e) => ((e.currentTarget.src = fallbackLogo))} alt="Fynstra" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
          <span className="font-alkatra text-xl sm:text-3xl font-semibold text-slate-900 group-hover:text-slate-700 transition">Fynstra</span>
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
        className="md:hidden fixed inset-0 z-[80] bg-black/50 backdrop-blur-[2px]"
        style={{
          transition: `opacity ${ANIM_MS}ms ${EASE}`,
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      />

      {/* Mobile sheet */}
      <div
        className="md:hidden fixed top-16 inset-x-0 z-[85] px-4"
        style={{
          transition: `opacity ${ANIM_MS}ms ${EASE}, transform ${ANIM_MS}ms ${EASE}`,
          opacity: mobileOpen ? 1 : 0,
          transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
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
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-800 max-w-xl">
              We help businesses create copy that reads fast and feels right. Landing pages, product pages and content that
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
            {/* Card container unchanged; only the background inside is replaced */}
            <div className="relative rounded-3xl ring-1 ring-black/10 bg-white/60 backdrop-blur p-4 sm:p-6 shadow-xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                {/* Background matching the updated direction */}
                <div className="hero-card-bg" />
                {/* Foreground content */}
                <div className="relative z-10 h-full w-full flex flex-col items-start justify-center text-white px-6 sm:px-10">
                  <img
                    src={logoSrc}
                    onError={(e) => ((e.currentTarget.src = fallbackLogo))}
                    alt="Fynstra"
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-contain shadow-md ring-1 ring-white/40"
                  />
                  <div className="mt-3 text-xl sm:text-3xl font-semibold tracking-tight">Clarity through content</div>
                  <div className="mt-2 sm:mt-3 text-sm sm:text-base text-white/85 font-light">Copy • Strategy • Comms</div>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 text-slate-700 text-sm sm:text-base">
                With a genuine interest in your buisness, we'll make sure the message lands with your intent.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote:
        "I recently outsourced Fynstra to support one of my financial service clients with thought leadership blogs, and they were a dream to work with. Communication was effortless, they immediately understood the brand voice we were trying to convey, and the content they produced was outstanding with minimal (if any) edits. Highly recommend",
      author: "Jasmine Panayides • Founder, HR Writing Services",
    },
    {
      quote:
        "Clear process, sharp writing, zero fluff. They took a vague brief and turned it into something that just worked.",
      author: "James Kerr • Founder, North Studio",
    },
    {
      quote:
        "We’d struggled to explain what we do for years. Fynstra rewrote it in two pages, and clients instantly got it.",
      author: "Elena Petrova • COO, BrightLedger",
    },
  ];

  return (
    <section id="testimonials" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal" data-reveal>
          <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900">
            Kind words
          </h2>
          <p className="mt-3 text-slate-800 max-w-2xl">
            Real feedback from clients who’ve trusted us to make their message clear and credible.
          </p>
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, i) => (
            <figure key={i} className="reveal" data-reveal>
              <div className="rounded-2xl border border-black/10 bg-slate-50 p-5 sm:p-6 h-full">
                <blockquote className="text-slate-800">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm text-slate-500">
                  {t.author}
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
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xblzwzpk";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const formRef = useRef<HTMLFormElement | null>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!formRef.current) return;

    const fd = new FormData(formRef.current);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (!name || !email || !message) {
      setErrorMsg("Please add your name, email and a short message.");
      setStatus("error");
      return;
    }

    try {
      setStatus("sending");
      setErrorMsg("");

      // Honeypot check (basic spam guard)
      if (String(fd.get("_gotcha") || "").length > 0) {
        setStatus("success"); // silently pass
        formRef.current.reset();
        return;
      }

      // Submit to Formspree (AJAX). Accept header is enough; browser sets multipart boundary.
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });

      if (res.ok) {
        setStatus("success");
        formRef.current.reset();
        // auto-clear message after a few seconds
        setTimeout(() => setStatus("idle"), 3500);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(
          (data?.errors && data.errors[0]?.message) ||
            "Something went wrong sending your message. Please try again."
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-start">
          {/* Left copy */}
          <div className="reveal" data-reveal>
            <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900">Let’s talk</h2>
            <p className="mt-3 text-slate-800 max-w-xl">
              Two ways to connect: drop a note or book a quick intro call. We’ll keep it focused on goals, scope and timelines.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#calendly" className="btn btn-pri">Book a call</a>
              <a href="mailto:info@fynstra.co.uk" className="btn btn-ghost">Email us</a>
            </div>
            <div className="mt-8 sm:mt-10 text-sm text-slate-700">
              Prefer a simple brief? Add bullet points about your goals, audience, deliverables and deadline. We’ll reply with a scoped plan.
            </div>
          </div>

          {/* Right: Formspree form */}
          <div className="reveal" data-reveal>
            <form
              ref={formRef}
              onSubmit={onSubmit}
              action={FORMSPREE_ENDPOINT} // graceful fallback if JS is disabled
              method="POST"
              className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-sm"
              noValidate
            >
              {/* hidden helpers */}
              <input type="hidden" name="_subject" value="Fynstra website contact" />
              <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 gap-4">
                <label className="block">
                  <span className="text-sm text-slate-600">Name</span>
                  <input
                    name="name"
                    required
                    className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-900"
                    placeholder="Your name"
                    aria-invalid={status === "error" ? true : undefined}
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600">Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-900"
                    placeholder="you@company.com"
                    aria-invalid={status === "error" ? true : undefined}
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-slate-600">Project overview</span>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-slate-900"
                    placeholder="Goals, audience, deliverables, timeline"
                  />
                </label>

                <button
                  type="submit"
                  className="btn btn-pri w-full"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>

                {/* Inline feedback */}
                <div className="min-h-[1.25rem]" aria-live="polite">
                  {status === "error" && (
                    <p className="text-sm text-rose-600 mt-1">{errorMsg}</p>
                  )}
                  {status === "success" && (
                    <p className="text-sm text-emerald-600 mt-1">
                      Thanks! Your message has been sent.
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                We’ll reply from <span className="font-medium">info@fynstra.co.uk</span>. By submitting, you consent to us
                storing this info to respond to your enquiry.
              </p>
            </form>
          </div>
        </div>

        {/* Calendly embed */}
        <div id="calendly" className="mt-10 sm:mt-14 reveal" data-reveal>
          <div className="rounded-2xl overflow-hidden border border-black/10 bg-white shadow-sm">
            <div className="px-5 sm:px-6 py-4 border-b border-black/10 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">Scheduling</div>
                <div className="text-base sm:text-lg font-semibold text-slate-900">Book a 20-minute meeting</div>
              </div>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-pri"
              >
                Open in Calendly
              </a>
            </div>

            <div className="relative lg:aspect-[5/3] aspect-[16/9] bg-white overflow-hidden">
              <iframe
                title="Calendly booking"
                src={`${CALENDLY_URL}?embed_domain=fynstra.co.uk&embed_type=Inline`}
                className="absolute inset-0 w-full h-full border-0"
                allow="camera; microphone; fullscreen"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function Footer({ logoSrc, fallbackLogo }: { logoSrc: string; fallbackLogo: string }) {
  return (
    <footer className="py-8 sm:py-10 border-t border-black/5">
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
        <div className="text-slate-500 text-xs sm:text-sm">...</div>
      </div>
    </footer>
  );
}
