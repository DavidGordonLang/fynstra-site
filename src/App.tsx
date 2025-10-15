import React, { useEffect, useRef, useState } from "react";

/**
 * Fynstra — One-page marketing site (Copywriting-first)
 * - Stronger sage background gradient
 * - About = original airy layout + expandable principle cards (all expand together)
 * - Packages back to airy grid on desktop
 * - Open animation mirrors close (same timing, same curve, simultaneous overlay/panel)
 * - Service/package auto-scrolls into view on open (no cutoff)
 * - About cards: gradient fades in on hover and persists while expanded (BL ➜ TR)
 * - Hero: new banner-style gradient background inspired by uploaded visual
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
 * About principle cards
 * =========================*/

function AboutPrinciples() {
  const [open, setOpen] = useState(false);
  const toggleAll = () => setOpen((v) => !v);
  const GRAD_MS = 520;
  const Card = ({ title }: any) => (
    <button
      type="button"
      onClick={toggleAll}
      aria-expanded={open}
      data-open={open}
      className="about-card group relative overflow-hidden text-left rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
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
      <div className="relative flex items-start justify-between gap-3">
        <div className="text-lg sm:text-xl font-semibold text-slate-900">{title}</div>
        <svg
          className={["h-5 w-5 text-slate-600 transition-transform", open ? "rotate-180" : ""].join(" ")}
          style={{ transition: `transform ${ANIM_MS}ms ${EASE}` }}
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          transition: `max-height ${ANIM_MS}ms ${EASE}, opacity ${ANIM_MS}ms ${EASE}`,
          maxHeight: open ? 200 : 0,
          opacity: open ? 1 : 0,
        }}
      >
        <p className="mt-3 text-sm text-slate-700">
          We keep language simple, structure tidy, and promises realistic.
        </p>
      </div>
    </button>
  );
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <Card title="Clear" /> <Card title="Consistent" /> <Card title="Credible" />
    </div>
  );
}

/* =========================
 * App wrapper
 * =========================*/

export default function App({
  logoSrc = PUBLIC_LOGO,
  bannerLeft,
  bannerRight,
}: any) {
  const containerRef = useScrollReveal();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div ref={containerRef} className="text-slate-100 site-bg selection:bg-indigo-200/60 min-h-screen">
      <style>{`
        :root {
          --fynstra-blue: ${brand.blue};
          --fynstra-lavender: ${brand.lavender};
          --fynstra-purple: ${brand.purple};
          --fynstra-teal: ${brand.teal};
        }
        body,*{font-family:"Segoe UI","Helvetica Neue",Arial,sans-serif}
        .heading-gradient{background:linear-gradient(90deg,var(--fynstra-blue)0%,var(--fynstra-lavender)50%,var(--fynstra-purple)100%);
          -webkit-background-clip:text;background-clip:text;color:transparent;}
        .site-bg{
          background:radial-gradient(1200px600pxat20%-10%,#EAF4ED0%,transparent60%),
          radial-gradient(1200px700pxat100%10%,#E6F1EA0%,transparent55%),
          linear-gradient(180deg,#F3F8F40%,#E7F1EA40%,#F7FBF8100%);
        }
        .hero-petal{position:absolute;border-radius:9999px;pointer-events:none;filter:blur(20px);}
        .hero-grain{pointer-events:none;mix-blend-mode:overlay;opacity:.06;
          background-image:radial-gradient(circle at 1px 1px,rgba(255,255,255,.9)1px,transparent1px);
          background-size:6px 6px;}
      `}</style>

      <Header logoSrc={logoSrc} fallbackLogo={fallbackLogo} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Hero logoSrc={logoSrc} fallbackLogo={fallbackLogo} />
      <AboutPrinciples />
      <Footer logoSrc={logoSrc} fallbackLogo={fallbackLogo} />
    </div>
  );
}

/* =========================
 * Header
 * =========================*/

function Header({ logoSrc, fallbackLogo }: any) {
  return (
    <header className="sticky top-0 z-[70] backdrop-blur-sm bg-white/80 border-b border-black/5">
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
      </div>
    </header>
  );
}

/* =========================
 * HERO — new banner-style gradient
 * =========================*/

function Hero({ logoSrc, fallbackLogo }: any) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          id="hero-bg"
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(115deg, var(--fynstra-blue) 0%, #CFC6FF 38%, #A48CF6 63%, var(--fynstra-purple) 88%)",
          }}
        />
        <div
          aria-hidden
          className="hero-petal"
          style={{
            right: "-18%",
            top: "-8%",
            width: "110vmin",
            height: "110vmin",
            background:
              "radial-gradient(closest-side at 58% 58%, rgba(124,92,240,.92), rgba(124,92,240,.55) 58%, rgba(124,92,240,0) 65%)",
            opacity: 0.75,
          }}
        />
        <div
          aria-hidden
          className="hero-petal"
          style={{
            right: "-6%",
            top: "22%",
            width: "95vmin",
            height: "95vmin",
            background:
              "radial-gradient(closest-side at 42% 42%, rgba(124,92,240,.85), rgba(124,92,240,.45) 55%, rgba(124,92,240,0) 63%)",
            opacity: 0.55,
          }}
        />
        <div
          aria-hidden
          className="hero-petal"
          style={{
            right: "6%",
            bottom: "-8%",
            width: "82vmin",
            height: "82vmin",
            background:
              "radial-gradient(closest-side at 50% 50%, rgba(200,187,255,.75), rgba(200,187,255,.35) 58%, rgba(200,187,255,0) 66%)",
            opacity: 0.45,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/35 via-white/18 to-transparent" />
        <div className="absolute inset-0 hero-grain" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div className="reveal" data-reveal>
            <h1 className="text-[2rem] sm:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight">
              Convert with <span className="heading-gradient">clear, credible</span> copy.
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-800 max-w-xl">
              We help startups ship copy that reads fast and feels right — landing pages, product pages, and content that
              moves the work forward.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
              <a href="#services" className="btn btn-pri">
                Explore services
              </a>
              <a href="#contact" className="btn btn-ghost">
                Get in touch
              </a>
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
        </div>
      </div>
    </section>
  );
}

/* =========================
 * FOOTER
 * =========================*/

function Footer({ logoSrc, fallbackLogo }: any) {
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
          <span className="text-slate-700 text-sm sm:text-base">
            © {new Date().getFullYear()} Fynstra Ltd
          </span>
        </div>
        <div className="text-slate-500 text-xs sm:text-sm">
          Built with React + Tailwind. Deployed on Vercel.
        </div>
      </div>
    </footer>
  );
}