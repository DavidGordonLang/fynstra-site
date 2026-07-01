import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  company,
  contact,
  hero,
  howWeWork,
  navItems,
  offers,
  problem,
  strengths,
  team,
  whoWeHelp,
  whyUs,
  workMapFragments,
  type NavItem,
  type RouteId,
  type Strength,
} from "./content/siteContent";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xblzwzpk";

type Route = NavItem & {
  eyebrow: string;
  title: string;
  description: string;
};

const routes: Route[] = [
  {
    ...navItems[0],
    eyebrow: hero.eyebrow,
    title: hero.title,
    description: hero.body,
  },
  {
    ...navItems[1],
    eyebrow: "Three connected strengths",
    title: "Support for the places where communication, quality and workflow meet.",
    description:
      "Fynstra is deliberately small and specialist. We help with content, documentation and operational structure when the work needs subject knowledge and practical delivery.",
  },
  {
    ...navItems[2],
    eyebrow: "Best-fit clients",
    title: whoWeHelp.title,
    description: whoWeHelp.paragraphs[0],
  },
  {
    ...navItems[3],
    eyebrow: "About Fynstra",
    title: "A small specialist team for complex work.",
    description:
      "Fynstra is currently being tested as a focused 90-day collaboration between David, Barbora and Jasmine.",
  },
  {
    ...navItems[4],
    eyebrow: "Contact",
    title: contact.title,
    description: contact.body,
  },
];

const routeByPath = new Map(routes.map((route) => [route.path, route]));
const routeById = new Map(routes.map((route) => [route.id, route]));

function routeFromPath(pathname: string): Route {
  const normalized = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return routeByPath.get(normalized) ?? routes[0];
}

function useRoute() {
  const [route, setRoute] = useState<Route>(() => routeFromPath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => setRoute(routeFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback(
    (path: string) => {
      const nextRoute = routeFromPath(path);
      if (nextRoute.path !== route.path) {
        window.history.pushState({}, "", nextRoute.path);
        setRoute(nextRoute);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [route.path]
  );

  return { route, navigate };
}

function useScrollReveal(routeId: RouteId) {
  const scopeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = scopeRef.current;
    if (!root) return;

    const elements = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.16 }
    );

    elements.forEach((element, index) => {
      element.classList.remove("reveal-in");
      element.style.setProperty("--reveal-delay", `${Math.min(index * 70, 280)}ms`);
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [routeId]);

  return scopeRef;
}

export default function FynstraSite() {
  const { route, navigate } = useRoute();
  const pageRef = useScrollReveal(route.id);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.title = route.id === "home" ? "Fynstra" : `${route.label} | Fynstra`;
    const meta = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (meta) meta.content = route.description;
  }, [route]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
      <Header
        activeRoute={route}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        navigate={navigate}
      />

      <main ref={pageRef} key={route.id} className="page-transition">
        {route.id === "home" && <HomePage navigate={navigate} />}
        {route.id === "what-we-do" && <WhatWeDoPage route={route} navigate={navigate} />}
        {route.id === "who-we-help" && <WhoWeHelpPage route={route} navigate={navigate} />}
        {route.id === "about" && <AboutPage route={route} navigate={navigate} />}
        {route.id === "contact" && <ContactPage route={route} />}
      </main>

      <Footer navigate={navigate} />
    </div>
  );
}

function Header({
  activeRoute,
  mobileOpen,
  setMobileOpen,
  navigate,
}: {
  activeRoute: Route;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  navigate: (path: string) => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setMobileOpen]);

  const handleNavigate = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <header className="site-header">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <RouteLink to="/" navigate={handleNavigate} className="brand-lockup" ariaLabel="Fynstra home">
          <img src={company.logoSrc} alt="" className="h-10 w-10 object-contain" />
          <span className="brand-wordmark">{company.name}</span>
        </RouteLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <RouteLink
              key={item.id}
              to={item.path}
              navigate={handleNavigate}
              className={`nav-link ${activeRoute.id === item.id ? "is-active" : ""}`}
              ariaCurrent={activeRoute.id === item.id ? "page" : undefined}
            >
              {item.label}
            </RouteLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`mailto:${company.email}`} className="quiet-link">
            {company.email}
          </a>
          <RouteLink to="/contact" navigate={handleNavigate} className="button button-primary">
            Start a conversation
          </RouteLink>
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className={`menu-toggle lg:hidden ${mobileOpen ? "is-open" : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span />
          <span />
        </button>
      </div>

      <div
        className={`mobile-menu-backdrop lg:hidden ${mobileOpen ? "is-open" : ""}`}
        onClick={() => setMobileOpen(false)}
      />
      <nav className={`mobile-menu lg:hidden ${mobileOpen ? "is-open" : ""}`} aria-label="Mobile navigation">
        <div className="mx-4 border border-[var(--line)] bg-[var(--paper)] p-3 shadow-[0_24px_70px_rgba(41,48,40,0.16)]">
          {navItems.map((item) => (
            <RouteLink
              key={item.id}
              to={item.path}
              navigate={handleNavigate}
              className={`mobile-nav-link ${activeRoute.id === item.id ? "is-active" : ""}`}
              ariaCurrent={activeRoute.id === item.id ? "page" : undefined}
            >
              {item.label}
            </RouteLink>
          ))}
          <RouteLink to="/contact" navigate={handleNavigate} className="button button-primary mt-3 w-full">
            Start a conversation
          </RouteLink>
        </div>
      </nav>
    </header>
  );
}

function RouteLink({
  to,
  navigate,
  children,
  className,
  ariaLabel,
  ariaCurrent,
}: {
  to: string;
  navigate: (path: string) => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  ariaCurrent?: "page";
}) {
  return (
    <a
      href={to}
      className={className}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

function HomePage({ navigate }: { navigate: (path: string) => void }) {
  return (
    <>
      <section className="hero-section">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
          <div className="max-w-2xl" data-reveal>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 className="mt-5 text-[2.7rem] font-semibold leading-[0.98] tracking-normal text-[var(--ink)] sm:text-6xl lg:text-7xl">
              {hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
              {hero.body}
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--muted-2)]">
              {hero.context}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" className="button button-primary" onClick={() => navigate("/contact")}>
                {hero.cta}
              </button>
              <button type="button" className="button button-secondary" onClick={() => navigate("/what-we-do")}>
                {hero.secondaryCta}
              </button>
            </div>
          </div>

          <div data-reveal>
            <ConnectedWorkMap />
          </div>
        </div>
      </section>

      <Section className="pt-4 sm:pt-8">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
          <div data-reveal>
            <p className="eyebrow">Where Fynstra helps</p>
            <h2 className="section-title mt-4">{problem.title}</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-[var(--muted)]" data-reveal>
            {problem.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section tinted>
        <SectionIntro
          eyebrow="What we connect"
          title="Communication, documentation and workflow are usually part of the same problem."
          body="The work can start in one place and quickly touch another. Fynstra is shaped around that reality."
        />
        <StrengthGrid />
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div data-reveal>
            <p className="eyebrow">Featured offers</p>
            <h2 className="section-title mt-4">Focused pieces of work, scoped before they start.</h2>
            <p className="mt-5 max-w-xl text-[var(--muted)]">
              Each offer is designed to produce a usable output rather than a vague strategy deck.
            </p>
            <button type="button" className="button button-secondary mt-7" onClick={() => navigate("/what-we-do")}>
              See all offers
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2" data-reveal>
            {offers.slice(0, 4).map((offer) => (
              <OfferCard key={offer.title} offer={offer} compact />
            ))}
          </div>
        </div>
      </Section>

      <ContactCta navigate={navigate} />
    </>
  );
}

function WhatWeDoPage({ route, navigate }: { route: Route; navigate: (path: string) => void }) {
  return (
    <>
      <PageHero route={route} />
      <Section>
        <div className="space-y-6">
          {strengths.map((strength, index) => (
            <StrengthDetail key={strength.title} strength={strength} index={index} />
          ))}
        </div>
      </Section>

      <Section tinted>
        <SectionIntro
          eyebrow="Featured offers"
          title="Practical offers for clearer messages, stronger documentation and smoother work."
          body="These are starting points, not a forced menu. The scope should follow the problem."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" data-reveal>
          {offers.map((offer) => (
            <OfferCard key={offer.title} offer={offer} />
          ))}
        </div>
      </Section>

      <HowWeWorkSection />
      <ContactCta navigate={navigate} />
    </>
  );
}

function WhoWeHelpPage({ route, navigate }: { route: Route; navigate: (path: string) => void }) {
  return (
    <>
      <PageHero route={route} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div data-reveal>
            <p className="eyebrow">Fit</p>
            <h2 className="section-title mt-4">Useful when the work needs subject knowledge and structure.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-[var(--muted)]" data-reveal>
            {whoWeHelp.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section tinted>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal>
            <p className="eyebrow">Sectors and teams</p>
            <h2 className="section-title mt-4">A good fit for process-heavy B2B work.</h2>
          </div>
          <div className="tag-grid" data-reveal>
            {whoWeHelp.sectors.map((sector) => (
              <span key={sector} className="sector-tag">
                {sector}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <SectionIntro
          eyebrow="Signals"
          title="The need usually shows up before the brief is neatly named."
          body="These are the kinds of patterns that tend to make Fynstra useful."
        />
        <div className="grid gap-4 md:grid-cols-2" data-reveal>
          {whoWeHelp.fitSignals.map((signal, index) => (
            <div key={signal} className="signal-card">
              <span className="signal-index">{String(index + 1).padStart(2, "0")}</span>
              <p>{signal}</p>
            </div>
          ))}
        </div>
      </Section>

      <ContactCta navigate={navigate} />
    </>
  );
}

function AboutPage({ route, navigate }: { route: Route; navigate: (path: string) => void }) {
  return (
    <>
      <PageHero route={route} />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-reveal>
            <p className="eyebrow">90-day collaboration</p>
            <h2 className="section-title mt-4">Three people testing one connected specialist offer.</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-[var(--muted)]" data-reveal>
            {whyUs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section tinted>
        <SectionIntro
          eyebrow="The team"
          title="Different strengths, deliberately connected."
          body="Each project has a clear owner, with the right support added when the client problem needs it."
        />
        <div className="grid gap-4 lg:grid-cols-3" data-reveal>
          {team.map((member) => (
            <article key={member.name} className="team-card">
              <div className="team-initial">{member.name.slice(0, 1)}</div>
              <h3>{member.name}</h3>
              <p className="mt-3 text-[var(--ink)]">{member.lead}</p>
              <p className="mt-5 text-sm leading-6 text-[var(--muted)]">{member.detail}</p>
            </article>
          ))}
        </div>
      </Section>

      <HowWeWorkSection />
      <ContactCta navigate={navigate} />
    </>
  );
}

function ContactPage({ route }: { route: Route }) {
  return (
    <>
      <PageHero route={route} compact />
      <Section className="pt-8">
        <ContactBlock />
      </Section>
    </>
  );
}

function PageHero({ route, compact = false }: { route: Route; compact?: boolean }) {
  return (
    <section className={`page-hero ${compact ? "is-compact" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="max-w-4xl" data-reveal>
          <p className="eyebrow">{route.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-[var(--ink)] sm:text-5xl lg:text-6xl">
            {route.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
            {route.description}
          </p>
        </div>
      </div>
    </section>
  );
}

function Section({
  children,
  tinted = false,
  className = "",
}: {
  children: React.ReactNode;
  tinted?: boolean;
  className?: string;
}) {
  return (
    <section className={`${tinted ? "section-tinted" : "section"} ${className}`}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">{children}</div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mb-10 max-w-3xl" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-4">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{body}</p>
    </div>
  );
}

function StrengthGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3" data-reveal>
      {strengths.map((strength) => (
        <article key={strength.title} className={`strength-card accent-${strength.accent}`}>
          <span className="strength-rule" />
          <h3>{strength.title}</h3>
          <p>{strength.summary}</p>
        </article>
      ))}
    </div>
  );
}

function StrengthDetail({ strength, index }: { strength: Strength; index: number }) {
  return (
    <article className={`detail-panel accent-${strength.accent}`} data-reveal>
      <div>
        <span className="detail-index">{String(index + 1).padStart(2, "0")}</span>
        <h2>{strength.title}</h2>
        <p>{strength.summary}</p>
      </div>
      <ul>
        {strength.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function OfferCard({ offer, compact = false }: { offer: (typeof offers)[number]; compact?: boolean }) {
  return (
    <article className={`offer-card ${compact ? "is-compact" : ""}`}>
      <span>{offer.signal}</span>
      <h3>{offer.title}</h3>
      <p>{offer.summary}</p>
    </article>
  );
}

function HowWeWorkSection() {
  return (
    <Section>
      <SectionIntro
        eyebrow="How we work"
        title="Simple scope, clear ownership and practical outputs."
        body="The process is intentionally straightforward, because the work itself is often complex enough."
      />
      <div className="workflow-list" data-reveal>
        {howWeWork.map((step, index) => (
          <article key={step} className="workflow-step">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <p>{step}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function ContactCta({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="cta-band">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
        <div data-reveal>
          <p className="eyebrow">Start small</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-[var(--ink)] sm:text-4xl">
            A short conversation is enough to see whether there is a useful fit.
          </h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end" data-reveal>
          <button type="button" className="button button-primary" onClick={() => navigate("/contact")}>
            {company.callLabel}
          </button>
          <a href={`mailto:${company.email}`} className="button button-secondary">
            Email Fynstra
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactBlock() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  const enquiryOptions = useMemo(() => contact.enquiryOptions, []);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const requiredFields = ["name", "email", "message"];
    const missingField = requiredFields.some((field) => !String(formData.get(field) ?? "").trim());

    if (missingField) {
      setStatus("error");
      setErrorMessage("Please add your name, email and a short message.");
      return;
    }

    if (String(formData.get("_gotcha") ?? "").length > 0) {
      setStatus("success");
      formRef.current.reset();
      return;
    }

    try {
      setStatus("sending");
      setErrorMessage("");
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { errors?: { message?: string }[] }
          | null;
        throw new Error(data?.errors?.[0]?.message ?? "Something went wrong sending your message.");
      }

      setStatus("success");
      formRef.current.reset();
      window.setTimeout(() => setStatus("idle"), 4200);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Network error. Please try again.");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
      <aside className="contact-aside" data-reveal>
        <p className="eyebrow">Contact</p>
        <h2>{contact.title}</h2>
        <p>{contact.guidance}</p>
        <div className="contact-methods">
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <a href={company.calendlyUrl} target="_blank" rel="noreferrer">
            Open Calendly
          </a>
        </div>
      </aside>

      <div className="space-y-5" data-reveal>
        <form ref={formRef} onSubmit={onSubmit} action={FORMSPREE_ENDPOINT} method="POST" className="contact-form">
          <input type="hidden" name="_subject" value="Fynstra website enquiry" />
          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span>Name</span>
              <input name="name" autoComplete="name" required placeholder="Your name" />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
            </label>
          </div>

          <label>
            <span>Company</span>
            <input name="company" autoComplete="organization" placeholder="Company or organisation" />
          </label>

          <label>
            <span>Useful enquiry option</span>
            <select name="enquiry_type" defaultValue={enquiryOptions[0]}>
              {enquiryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>What would be useful to look at?</span>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="A few lines about the issue, audience, workflow or content need."
            />
          </label>

          <button type="submit" className="button button-primary w-full justify-center" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send enquiry"}
          </button>

          <div className="min-h-6" aria-live="polite">
            {status === "success" && <p className="form-success">Thanks. Your message has been sent.</p>}
            {status === "error" && <p className="form-error">{errorMessage}</p>}
          </div>
        </form>

        <div className="calendly-panel">
          <div className="calendly-header">
            <div>
              <span>Scheduling</span>
              <h3>{company.callLabel}</h3>
            </div>
            <a href={company.calendlyUrl} target="_blank" rel="noreferrer" className="button button-secondary">
              Open Calendly
            </a>
          </div>
          <div className="calendly-frame">
            <iframe
              title="Fynstra Calendly booking"
              src={`${company.calendlyUrl}?embed_domain=fynstra.co.uk&embed_type=Inline`}
              allow="camera; microphone; fullscreen"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectedWorkMap() {
  const [movement, setMovement] = useState({ x: 0, y: 0 });

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
    setMovement({ x, y });
  };

  const cssVars = {
    "--mx": `${movement.x}px`,
    "--my": `${movement.y}px`,
  } as React.CSSProperties;

  return (
    <div className="work-map-wrap">
      <div
        className="work-map work-map-desktop"
        onPointerMove={onPointerMove}
        onPointerLeave={() => setMovement({ x: 0, y: 0 })}
        style={cssVars}
        aria-label="Connected Work Map showing messy inputs becoming communication, documentation and operations pathways"
      >
        <div className="work-map-grid" />
        <div className="map-caption map-caption-left">Messy inputs</div>
        <div className="map-caption map-caption-right">Clearer work</div>

        <div className="fragment-layer depth-back">
          {workMapFragments.slice(0, 5).map((fragment, index) => (
            <span key={fragment} className={`work-fragment fragment-${index + 1}`}>
              {fragment}
            </span>
          ))}
        </div>

        <svg className="map-lines" viewBox="0 0 760 520" role="presentation" aria-hidden="true">
          <path className="line line-muted" d="M96 122 C230 98, 258 160, 340 178" />
          <path className="line line-muted" d="M82 248 C196 244, 254 240, 340 252" />
          <path className="line line-muted" d="M112 386 C225 384, 266 332, 348 326" />
          <path className="line line-flow line-lavender" d="M340 178 C430 130, 456 128, 552 122" />
          <path className="line line-flow line-blue" d="M340 252 C430 248, 462 248, 552 250" />
          <path className="line line-flow line-teal" d="M348 326 C426 386, 474 382, 552 376" />
          <path className="line line-muted" d="M585 122 C650 150, 660 205, 684 250" />
          <path className="line line-muted" d="M585 376 C650 342, 660 294, 684 250" />
        </svg>

        <div className="node-cluster depth-front">
          {strengths.map((strength) => (
            <div key={strength.shortTitle} className={`map-node node-${strength.accent}`}>
              <span />
              <strong>{strength.shortTitle}</strong>
            </div>
          ))}
        </div>

        <div className="structured-panel depth-mid">
          <span>Organised outputs</span>
          <ul>
            <li>clearer messages</li>
            <li>stronger guidance</li>
            <li>smoother handoffs</li>
          </ul>
        </div>

        <div className="fragment-layer depth-front">
          {workMapFragments.slice(5).map((fragment, index) => (
            <span key={fragment} className={`work-fragment fragment-${index + 6}`}>
              {fragment}
            </span>
          ))}
        </div>
      </div>

      <div className="work-map-mobile" aria-label="Simplified Connected Work Map">
        <div className="mobile-inputs">
          <span>duplicated requests</span>
          <span>unclear guidance</span>
          <span>handoff delays</span>
        </div>
        <div className="mobile-path" />
        <div className="mobile-nodes">
          {strengths.map((strength) => (
            <span key={strength.shortTitle}>{strength.shortTitle}</span>
          ))}
        </div>
        <div className="mobile-outcome">Clearer work</div>
      </div>
    </div>
  );
}

function Footer({ navigate }: { navigate: (path: string) => void }) {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--paper)]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <RouteLink to="/" navigate={navigate} className="brand-lockup">
          <img src={company.logoSrc} alt="" className="h-8 w-8 object-contain" />
          <span className="brand-wordmark text-xl">{company.name}</span>
        </RouteLink>
        <div className="flex flex-col gap-3 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:gap-6">
          <span>&copy; {new Date().getFullYear()} Fynstra Ltd</span>
          <a href={`mailto:${company.email}`} className="hover:text-[var(--ink)]">
            {company.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
