import React, { useEffect, useRef, useState } from "react";

/**
 * Fynstra — One-page marketing site
 * Stack: React + TailwindCSS (no extra deps)
 *
 * Mobile nav is now a fixed overlay (backdrop + slide-down panel).
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

// Lightweight SVG fallback tiles (keeps UI pretty if assets are missing)
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

const PUBLIC_LOGO = "/fynstra-logo.png"; // transparent PNG in /public
const fallbackLogo = svgTile(brand.lavender, brand.purple);
const defaultBannerLeft = svgTile(brand.blue, brand.lavender);
const defaultBannerRight = svgTile(brand.lavender, brand.purple);

const CALENDLY_URL = "https://calendly.com/"; // TODO: replace with your link

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

export default function FynstraSite({
  logoSrc = PUBLIC_LOGO,
  bannerLeft = defaultBannerLeft,
  bannerRight = defaultBannerRight,
}: {
  logoSrc?: string;
  bannerLeft?: string;
  bannerRight?: string;
}) {
  const containerRef = useScrollReveal();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Global effects
  useEffect(() => {
    document.documentElement.classList.add("scroll-smooth");

    // Darken hero on scroll
    const hero = document.getElementById("hero-bg");
    const handleScroll = () => {
      if (!hero) return;
      const y = window.scrollY;
      (hero as HTMLElement).style.opacity = y > 80 ? "0.7" : "1";
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Close mobile nav on hash change
    const onHash = () => setMobileOpen(false);
    window.addEventListener("hashchange", onHash);

    // Close on ESC
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    const { style } = document.body;
    if (mobileOpen) {
      style.overflow = "hidden";
    } else {
      style.overflow = "";
    }
    return () => {
      style.overflow = "";
    };
  }, [mobileOpen]);

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
            <img
              src={logoSrc}
              onError={(e) => ((e.currentTarget.src = fallbackLogo))}
              alt="Fynstra"
              className="h-12 w-12 object-contain relative top-1"
            />
            <span className="text-xl sm:text-2xl font-semibold text-slate-900 group-hover:text-slate-700 transition">
              Fynstra
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-slate-700">
            <a href="#about" className="hover:text-slate-900">About</a>
            <a href="#services" className="hover:text-slate-900">Services</a>
            <a href="#testimonials" className="hover:text-slate-900">Testimonials</a>
            <a href="#contact" className="hover:text-slate-900">Contact</a>
            <a href="#contact" className="btn btn-pri ml-2">Book a chat</a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl border border-black/10 text-slate-700 hover:bg-black/5"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-slate-700 rounded" />
              <span className="block h-0.5 w-5 bg-slate-700 rounded" />
              <span className="block h-0.5 w-5 bg-slate-700 rounded" />
            </div>
          </button>
        </div>
      </header>

      {/* MOBILE OVERLAY MENU */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Panel */}
          <div
            className="absolute left-0 right-0 top-0 origin-top translate-y-0 animate-[menuDown_180ms_ease-out] rounded-b-2xl bg-white shadow-xl border-b border-black/10"
          >
            <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={logoSrc}
                  onError={(e) => ((e.currentTarget.src = fallbackLogo))}
                  alt="Fynstra"
                  className="h-10 w-10 object-contain"
                />
                <span className="text-lg font-semibold text-slate-900">Menu</span>
              </div>
              <button
                className="inline-flex items-center justify-center p-2 rounded-xl border border-black/10 text-slate-700 hover:bg-black/5"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <span className="sr-only">Close</span>
                {/* X icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" className="text-slate-700">
                  <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <nav className="px-4 sm:px-6 lg:px-8 pb-6 pt-2">
              <a href="#about" onClick={() => setMobileOpen(false)} className="block py-3 text-slate-800 rounded-lg hover:bg-black/5">About</a>
              <a href="#services" onClick={() => setMobileOpen(false)} className="block py-3 text-slate-800 rounded-lg hover:bg:black/5 hover:bg-black/5">Services</a>
              <a href="#testimonials" onClick={() => setMobileOpen(false)} className="block py-3 text-slate-800 rounded-lg hover:bg-black/5">Testimonials</a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="block py-3 text-slate-800 rounded-lg hover:bg-black/5">Contact</a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="mt-3 btn btn-pri w-full">Book a chat</a>
            </nav>
          </div>

          {/* Keyframes (scoped) */}
          <style>{`
            @keyframes menuDown {
              from { transform: translateY(-12px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        {/* Background */}
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
            src={defaultBannerLeft}
            alt="Brand motif"
            className="absolute left-0 top-0 opacity-40 w-56 sm:w-72 md:w-96 -translate-x-[15%] -translate-y-[15%] blur-[1px]"
          />
          <img
            src={defaultBannerRight}
            alt="Brand motif"
            className="absolute right-[-20%] md:right-[-10%] bottom-[-28%] md:bottom-[-20%] opacity-50 w-[28rem] sm:w-[36rem] md:w-[48rem] rotate-6 blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/60 via-white/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 items-center">
            {/* Left column */}
            <div className="reveal" data-reveal>
              <h1 className="text-[2rem] sm:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight">
                Build momentum with <span className="heading-gradient">crisp, credible</span> communication.
              </h1>
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-700 max-w-xl">
                Fynstra helps growing teams turn complex ideas into clean, persuasive content. Copywriting, communication frameworks, and practical consulting that move the work forward.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
                <a href="#services" className="btn btn-pri">Explore services</a>
                <a href="#contact" className="btn btn-ghost">Get in touch</a>
              </div>

              {/* Logo only row */}
              <div className="mt-8 sm:mt-10 flex items-center gap-4">
                <img
                  src={logoSrc}
                  onError={(e) => ((e.currentTarget.src = fallbackLogo))}
                  alt="Fynstra"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-contain"
                />
              </div>
            </div>

            {/* Right column — branded card */}
            <div className="reveal" data-reveal>
              <div className="relative rounded-3xl ring-1 ring-black/10 bg-white/60 backdrop-blur p-4 sm:p-6 shadow-xl">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(135deg, var(--fynstra-blue), var(--fynstra-purple))" }}
                  />
                  <div className="absolute -top-16 -right-16 h-56 w-56 sm:h-64 sm:w-64 rounded-full bg-white/30 blur-3xl opacity-40" />
                  <div className="absolute -bottom-20 -left-20 h-64 w-64 sm:h-72 sm:w-72 rounded-full bg-[rgba(79,180,198,0.35)] blur-3xl opacity-50" />
                  <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-white scale-[1.2] sm:scale-[1.5]">
                    <img
                      src={logoSrc}
                      onError={(e) => ((e.currentTarget.src = fallbackLogo))}
                      alt="Fynstra"
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-contain shadow-md ring-1 ring-white/40"
                    />
                    <div className="mt-3 text-xl sm:text-3xl font-semibold tracking-tight text-center px-4">
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

      {/* ABOUT */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-start">
            <div className="lg:col-span-5 reveal" data-reveal>
              <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900">About Fynstra</h2>
              <p className="mt-3 sm:mt-4 text-slate-700">
                We pair sharp language with sensible structure. From copywriting to process-minded consulting, our work turns ambiguity into action. Clear artifacts, faster decisions, better outcomes.
              </p>
              <ul className="mt-5 sm:mt-6 space-y-3 text-slate-700">
                <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: brand.purple }}></span> Crisp copy and messaging frameworks</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: brand.purple }}></span> Practical consulting: strategy to operations</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: brand.purple }}></span> KYC/compliance support with plain-English communication</li>
              </ul>
            </div>
            <div className="lg:col-span-7 reveal" data-reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {["Clear", "Consistent", "Credible"].map((k, i) => (
                  <div key={k} className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-sm">
                    <div className="text-xs sm:text-sm text-slate-500">Principle {i + 1}</div>
                    <div className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">{k}</div>
                    <p className="mt-2 sm:mt-3 text-sm text-slate-600">We keep language simple, structure tidy, and promises realistic.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-16 sm:py-20 lg:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal" data-reveal>
            <h2 className="text-2xl sm:text-4xl font-semibold text-slate-900">Services</h2>
            <p className="mt-3 max-w-2xl text-slate-700">
              Choose a focused engagement or mix-and-match. Packages align with UK market rates and deliverables are clearly scoped.
            </p>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: "Copywriting",
                points: ["Web + landing pages", "About/Service pages", "Blogs, emails, proposals"],
                price: "See packages below",
              },
              {
                title: "Consulting",
                points: ["Process clarity", "Strategy to ops", "Client comms"],
                price: "Day rate (on request)",
              },
              {
                title: "Compliance Comms",
                points: ["KYC narratives", "Plain-English docs", "Training decks"],
                price: "Project-based",
              },
            ].map((card) => (
              <div key={card.title} className="reveal" data-reveal>
                <div className="h-full rounded-2xl border border-black/10 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition">
                  <div className="text-sm text-slate-500">Offering</div>
                  <h3 className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">{card.title}</h3>
                  <ul className="mt-3 sm:mt-4 space-y-2 text-slate-700">
                    {card.points.map((p) => (
                      <li key={p} className="flex gap-2 items-start">
                        <span className="mt-1 h-2 w-2 rounded-full" style={{ background: brand.purple }}></span>{p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 text-sm text-slate-600">{card.price}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Packages — updated ranges */}
          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { badge: "Entry", title: "Budget", desc: "Short-form social copy (3–5 captions).", price: "£80 – £120" },
              { badge: "Starter", title: "Starter", desc: "Web or blog copy up to 500 words.", price: "£200 – £300" },
              { badge: "Popular", title: "Growth", desc: "In-depth article or full page (~1 000 words).", price: "£400 – £600" },
              { badge: "For launches", title: "Launch", desc: "Multi-page site or campaign set (~2 000 words).", price: "£700 – £1 000" },
              { badge: "Ongoing", title: "Retainer", desc: "Regular content support (~4 000 words/month).", price: "£1 200 – £1 400 / month" },
            ].map((pkg) => (
              <div key={pkg.title} className="reveal" data-reveal>
                <div className="rounded-2xl border border-indigo-200 bg-white p-5 sm:p-6 shadow-sm">
                  <div className="text-xs sm:text-sm text-indigo-700">{pkg.badge}</div>
                  <h3 className="mt-1 text-lg sm:text-xl font-semibold text-slate-900">{pkg.title}</h3>
                  <p className="mt-2 text-slate-700">{pkg.desc}</p>
                  <div className="mt-4 text-slate-900 font-medium">{pkg.price}</div>
                  <a href="#contact" className="mt-4 sm:mt-5 inline-flex btn btn-pri">Enquire</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
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
                  <figcaption className="mt-4 text-sm text-slate-500">Client name • Role, Company</figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
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
              {/* Placeholder form (wire only). Swap for your favourite form tool or backend later. */}
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
                {/* Replace iframe src below with your Calendly link and show it when ready */}
                <iframe title="Calendly" src={CALENDLY_URL} className="w-full h-full hidden" />
                <div className="p-6 text-center">
                  Calendly embed goes here. Replace URL above and show the iframe when ready.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
          <div className="text-slate-500 text-xs sm:text-sm">Built with React + Tailwind. Deployed on Vercel.</div>
        </div>
      </footer>
    </div>
  );
}
