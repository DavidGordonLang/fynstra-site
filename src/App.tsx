import React, { useEffect, useRef } from "react";

/**
 * Fynstra — One-page marketing site
 * Stack: React + TailwindCSS (no extra deps)
 *
 * Notes:
 * - Replace CALENDLY_URL with your real link when ready.
 * - Ensure /public/fynstra-logo.png exists for the real logo.
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

// Inline SVG fallbacks (render cleanly before assets are added)
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

// If you have /public/fynstra-logo.png, we’ll prefer that; otherwise fallback to SVG tile
const PUBLIC_LOGO = "/fynstra-logo.png";
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
  logoSrc = PUBLIC_LOGO || defaultLogo,
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

    // Sanity “tests”
    const ids = ["top", "about", "services", "testimonials", "contact"];
    const missing = ids.filter((id) => !document.getElementById(id));
    if (missing.length) console.warn("[Fynstra] Missing section ids:", missing.join(", "));

    const sectionCount = document.querySelectorAll("section").length;
    if (sectionCount < 5) console.warn("[Fynstra] Expected >= 5 <section> elements, found:", sectionCount);

    // Darken hero on scroll
    const hero = document.getElementById("hero-bg");
    const handleScroll = () => {
      if (!hero) return;
      const y = window.scrollY;
      hero.style.opacity = y > 80 ? "0.7" : "1";
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
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
            <img
              src={logoSrc}
              alt="Fynstra"
              className="h-12 w-12 object-contain relative top-1"
            />
            <span className="text-2xl font-semibold text-slate-900 group-hover:text-slate-700 transition">
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
        </div>
      </header>

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

        {/* Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="reveal" data-reveal>
              {/* Removed the small badge chip above the headline */}
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

              {/* Replaced text line with the actual logo only */}
              <div className="mt-10 flex items-center gap-4">
                <img
                  src={logoSrc}
                  alt="Fynstra"
                  className="h-10 w-10 rounded-xl object-contain"
                />
              </div>
            </div>

            <div className="reveal" data-reveal>
              <div className="relative rounded-3xl ring-1 ring-black/10 bg-white/60 backdrop-blur p-6 shadow-xl">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <div
                    className="w-full h-full"
                    style={{ background: "linear-gradient(135deg, var(--fynstra-blue), var(--fynstra-purple))" }}
                  />
                </div>
                <div className="mt-4 text-slate-700">
                  Lean, modern, and fast to ship. This prototype mirrors the final structure we’ll deploy on Vercel.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 reveal" data-reveal>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">About Fynstra</h2>
              <p className="mt-4 text-slate-700">
                We pair sharp language with sensible structure. From copywriting to process-minded consulting, our work turns ambiguity into action. Clear artifacts, faster decisions, better outcomes.
              </p>
              <ul className="mt-6 space-y-3 text-slate-700">
                <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: brand.purple }}></span> Crisp copy and messaging frameworks</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: brand.purple }}></span> Practical consulting: strategy into operations</li>
                <li className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 rounded-full" style={{ background: brand.purple }}></span> KYC/compliance support with plain-English communication</li>
              </ul>
            </div>
            <div className="lg:col-span-7 reveal" data-reveal>
              <div className="grid sm:grid-cols-3 gap-4">
                {["Clear", "Consistent", "Credible"].map((k, i) => (
                  <div key={k} className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                    <div className="text-sm text-slate-500">Principle {i + 1}</div>
                    <div className="mt-1 text-xl font-semibold text-slate-900">{k}</div>
                    <p className="mt-3 text-sm text-slate-600">We keep language simple, structure tidy, and promises realistic.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal" data-reveal>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">Services</h2>
            <p className="mt-3 max-w-2xl text-slate-700">Choose a focused engagement or mix-and-match. Packages align with UK market rates and deliverables are clearly scoped.</p>
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Copywriting",
                points: ["Web + landing pages", "About/Service pages", "Blogs, emails, proposals"],
                price: "From £250",
              },
              {
                title: "Consulting",
                points: ["Process clarity", "Strategy to ops", "Client comms"],
                price: "Day rate on request",
              },
              {
                title: "Compliance Comms",
                points: ["KYC narratives", "Plain-English docs", "Training decks"],
                price: "Project based",
              },
            ].map((card) => (
              <div key={card.title} className="reveal" data-reveal>
                <div className="h-full rounded-2xl border border-black/10 bg-white p-6 shadow-sm hover:shadow-md transition">
                  <div className="text-sm text-slate-500">Offering</div>
                  <h3 className="mt-1 text-xl font-semibold text-slate-900">{card.title}</h3>
                  <ul className="mt-4 space-y-2 text-slate-700">
                    {card.points.map((p) => (
                      <li key={p} className="flex gap-2 items-start"><span className="mt-1 h-2 w-2 rounded-full" style={{ background: brand.purple }}></span>{p}</li>
                    ))}
                  </ul>
                  <div className="mt-6 text-sm text-slate-600">{card.price}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Packages row */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="reveal" data-reveal>
              <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
                <div className="text-sm text-indigo-700">Popular</div>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Growth Package</h3>
                <p className="mt-2 text-slate-700">~1,000 words: a page set or long-form article with light research and brand-tuned voice. Two rounds of edits.</p>
                <div className="mt-4 text-slate-900 font-medium">£500 – £700</div>
                <a href="#contact" className="mt-5 btn btn-pri">Start a brief</a>
              </div>
            </div>
            <div className="reveal" data-reveal>
              <div className="rounded-2xl border border-indigo-200 bg-white p-6 shadow-sm">
                <div className="text-sm text-indigo-700">For launches</div>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Launch Set</h3>
                <p className="mt-2 text-slate-700">~2,000 words: homepage + About + Services or equivalent. Messaging framework + editorial guidelines.</p>
                <div className="mt-4 text-slate-900 font-medium">£900 – £1,200</div>
                <a href="#contact" className="mt-5 btn btn-pri">Talk scope</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="reveal" data-reveal>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">Kind words</h2>
            <p className="mt-3 text-slate-700 max-w-2xl">Placeholders until we add real quotes. Keep it concise and outcome-focused.</p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <figure key={i} className="reveal" data-reveal>
                <div className="rounded-2xl border border-black/10 bg-slate-50 p-6 h-full">
                  <blockquote className="text-slate-700">“Fynstra made our message clearer and our rollout smoother. The copy just worked.”</blockquote>
                  <figcaption className="mt-4 text-sm text-slate-500">Client name • Role, Company</figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 sm:py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="reveal" data-reveal>
              <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">Let’s talk</h2>
              <p className="mt-3 text-slate-700 max-w-xl">Two ways to connect: drop a note or book a quick intro call. We’ll keep it focused on goals, scope, and timelines.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#calendly" className="btn btn-pri">Book a call</a>
                <a href="mailto:hello@fynstra.co.uk" className="btn btn-ghost">Email us</a>
              </div>
              <div className="mt-10 text-sm text-slate-600">Prefer a simple brief? Add bullet points about your goals, audience, deliverables, and deadline — we’ll reply with a scoped plan.</div>
            </div>

            <div className="reveal" data-reveal>
              {/* Placeholder form (wire only). Swap for your favourite form tool or backend later. */}
              <form className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 gap-4">
                  <label className="block">
                    <span className="text-sm text-slate-600">Name</span>
                    <input className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Your name" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-600">Email</span>
                    <input type="email" className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="you@company.com" />
                  </label>
                  <label className="block">
                    <span className="text-sm text-slate-600">Project overview</span>
                    <textarea rows={4} className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" placeholder="Goals, audience, deliverables, timeline" />
                  </label>
                  <button type="button" className="btn btn-pri w-full">Send (placeholder)</button>
                </div>
                <p className="mt-3 text-xs text-slate-500">This form is a front-end placeholder. Swap for a real form handler (Formspree, Beehiiv, Resend, serverless function) when we go live.</p>
              </form>
            </div>
          </div>

          {/* Calendly placeholder */}
          <div id="calendly" className="mt-14 reveal" data-reveal>
            <div className="rounded-2xl overflow-hidden border border-black/10 bg-white shadow-sm">
              <div className="px-6 py-4 border-b border-black/10 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500">Scheduling</div>
                  <div className="text-lg font-semibold text-slate-900">Book a 20-minute intro</div>
                </div>
                <a href={CALENDLY_URL} className="btn btn-pri">Open Calendly</a>
              </div>
              <div className="aspect-[16/9] bg-slate-50 flex items-center justify-center text-slate-500">
                {/* Replace iframe src below with your Calendly link and remove the placeholder overlay */}
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
      <footer className="py-10 bg-white border-t border-black/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logoSrc} alt="Fynstra" className="h-7 w-7 rounded-xl object-contain" />
            <span className="text-slate-700">© {new Date().getFullYear()} Fynstra Ltd</span>
          </div>
          <div className="text-slate-500 text-sm">Built with React + Tailwind. Deployed on Vercel.</div>
        </div>
      </footer>
    </div>
  );
}
