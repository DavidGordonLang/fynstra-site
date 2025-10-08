import React, { useEffect, useRef } from "react";

/**
 * Fynstra — One-page marketing site
 * Stack: React + TailwindCSS (no extra deps)
 *
 * Notes:
 * - Replace CALENDLY_URL with your real link when ready.
 * - Drop real logo/banner files into /public and update props if needed.
 */

// --- Brand system from your style guide ---
const brand = {
  blue: "#CFE4FF",
  lavender: "#C8BBFF",
  purple: "#7C5CF0",
  teal: "#4FB4C6",
  ink: "#222222",
  subtext: "#555555",
  bg: "#FAFAFA",
};

// Inline SVG fallbacks
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

const defaultLogo = svgTile(brand.lavender, brand.purple);
const defaultBannerLeft = svgTile(brand.blue, brand.lavender);
const defaultBannerRight = svgTile(brand.lavender, brand.purple);

const CALENDLY_URL = "https://calendly.com/"; // Replace when ready

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
            e.target.classList.add("reveal-in");
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

export default function FynstraSite({
  logoSrc = defaultLogo,
  bannerLeft = defaultBannerLeft,
  bannerRight = defaultBannerRight,
}: {
  logoSrc?: string;
  bannerLeft?: string;
  bannerRight?: string;
}) {
  const containerRef = useScrollReveal();

  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");

    // Sanity checks
    const ids = ["top", "about", "services", "testimonials", "contact"];
    const missing = ids.filter((id) => !document.getElementById(id));
    if (missing.length) console.warn("[Fynstra] Missing section ids:", missing.join(", "));

    // Darken hero on scroll
    const hero = document.getElementById("hero-bg");
    const handleScroll = () => {
      if (!hero) return;
      const y = window.scrollY;
      hero.style.opacity = y > 80 ? "0.7" : "1";
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="text-slate-100 bg-white selection:bg-indigo-200/60">
      {/* Global styles for brand tokens + buttons */}
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
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .reveal { opacity: 0; transform: translateY(12px); transition: opacity .6s ease, transform .6s ease; }
        .reveal-in { opacity: 1; transform: translateY(0); }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 1rem;
          padding: .75rem 1.25rem;
          font-weight: 500;
          box-shadow: 0 1px 2px rgba(0,0,0,.06);
          transition: all .2s ease;
        }
        .btn-pri { background: var(--fynstra-purple); color: #fff; }
        .btn-pri:hover { filter: brightness(.95); }
        .btn-ghost { border: 1px solid rgba(0,0,0,.1); color: #0f172a; background: transparent; }
        .btn-ghost:hover { background: rgba(0,0,0,.04); }
      `}</style>

      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur-sm bg-white/70 border-b border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <img src={logoSrc} alt="Fynstra" className="h-8 w-8 rounded-xl shadow-sm" />
            <span className="text-xl font-semibold text-slate-900 group-hover:text-slate-700 transition">Fynstra</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-slate-700">
            <a href="#about" className="hover:text-slate-900">About</a>
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#testimonials" className="hover:text-slate-900">Testimonials</a>
            <a href="#contact" className="hover:text-slate-900">Contact</a>
            <a href="#contact" className="btn btn-pri ml-2">Book a chat</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
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
            className="absolute left-0 top-0 opacity-40 w-72 sm:w-96 -translate-x-[15%] -translate-y-[15%] blur-[1px]"
          />
          <img
            src={bannerRight}
            alt="Brand motif"
            className="absolute right-[-10%] bottom-[-20%] opacity-50 w-[38rem] sm:w-[48rem] rotate-6 blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/50 via-white/30 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="reveal" data-reveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur px-3 py-1 text-sm text-slate-700 ring-1 ring-black/5 mb-5">
                <span className="h-2 w-2 rounded-full" style={{ background: brand.purple }} />
                Clarity through content
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight">
                Build momentum with <span className="heading-gradient">crisp, credible</span> communication.
              </h1>
              <p className="mt-5 text-lg text-slate-700 max-w-xl">
                Fynstra helps growing teams turn complex ideas into clean, persuasive content. Copywriting, communication frameworks, and practical consulting that move the work forward.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#services" className="btn btn-pri">Explore services</a>
                <a href="#contact" className="btn btn-ghost">Get in touch</a>
              </div>
              <div className="mt-10 flex items-center gap-4 text-sm text-slate-600">
                <img src={logoSrc} alt="Fynstra icon" className="h-8 w-8 rounded-xl" />
                <span>Fynstra • Clarity through content</span>
              </div>
            </div>
            <div className="reveal" data-reveal>
              <div className="relative rounded-3xl ring-1 ring-black/10 bg-white/60 backdrop-blur p-6 shadow-xl">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <div className="w-full h-full" style={{ background: "linear-gradient(135deg, var(--fynstra-blue), var(--fynstra-purple))" }} />
                </div>
                <div className="mt-4 text-slate-700">
                  Lean, modern, and fast to ship. This prototype mirrors the final structure we’ll deploy on Vercel.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other sections omitted for brevity — identical to previous version */}

    </div>
  );
}
