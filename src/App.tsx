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
  type NavItem,
  type RouteId,
  type Strength,
} from "./content/siteContent";

// Formspree handles email delivery; the recipient inbox is configured in Formspree, not in this repo.
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
    eyebrow: "What We Do",
    title: "What We Do",
    description: "We help businesses in three connected areas.",
  },
  {
    ...navItems[2],
    eyebrow: "Who We Help",
    title: whoWeHelp.title,
    description: whoWeHelp.paragraphs[0],
  },
  {
    ...navItems[3],
    eyebrow: "Why Us",
    title: "Why Us",
    description: whyUs[0],
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
        <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-12 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="max-w-2xl" data-reveal>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 className="hero-title" aria-label={hero.title}>
              <span>Clearer communication.</span>
              <span className="hero-title-accent">Better operations.</span>
              <span>Practical tools.</span>
            </h1>
            <p className="hero-copy">{hero.body}</p>
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

      <Section className="section-problem pt-4 sm:pt-8">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
          <div data-reveal>
            <p className="eyebrow">Problem</p>
            <h2 className="section-title mt-4">{problem.title}</h2>
          </div>
          <div className="problem-copy" data-reveal>
            <p>{problem.paragraphs[0]}</p>
            <ul>
              {problem.paragraphs.slice(1).map((paragraph) => (
                <li key={paragraph}>{paragraph}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tinted className="section-work">
        <SectionIntro
          eyebrow="What We Do"
          title="We help businesses in three connected areas."
        />
        <StrengthGrid />
      </Section>

      <Section className="section-offers">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div data-reveal>
            <p className="eyebrow">Featured Offers</p>
            <h2 className="section-title mt-4">Featured Offers</h2>
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
      <Section className="section-work-detail">
        <div className="space-y-6">
          {strengths.map((strength, index) => (
            <StrengthDetail key={strength.title} strength={strength} index={index} />
          ))}
        </div>
      </Section>

      <Section tinted className="section-offers">
        <SectionIntro
          eyebrow="Featured Offers"
          title="Featured Offers"
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
      <Section className="section-fit">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div data-reveal>
            <p className="eyebrow">Who We Help</p>
            <h2 className="section-title mt-4">Who We Help</h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-[var(--muted)]" data-reveal>
            {whoWeHelp.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section tinted className="section-tags">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div data-reveal>
            <p className="eyebrow">Who We Help</p>
            <h2 className="section-title mt-4">Includes</h2>
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

      <ContactCta navigate={navigate} />
    </>
  );
}

function AboutPage({ route, navigate }: { route: Route; navigate: (path: string) => void }) {
  void navigate;

  return (
    <>
      <PageHero route={route} />

      <Section tinted className="section-team">
        <SectionIntro
          eyebrow="Why Us"
          title="Barbora / Jasmine / David"
        />
        <div className="grid gap-4 lg:grid-cols-3" data-reveal>
          {team.map((member) => (
            <article key={member.name} className={`team-card team-card-${member.name.toLowerCase()}`}>
              <div className="team-initial">{member.name.slice(0, 1)}</div>
              <h3>{member.name}</h3>
              <p className="mt-3 text-[var(--ink)]">{member.detail}</p>
            </article>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-lg leading-8 text-[var(--muted)]" data-reveal>
          {whyUs[1]}
        </p>
      </Section>
    </>
  );
}

function ContactPage({ route }: { route: Route }) {
  void route;

  return (
    <>
      <Section className="section-contact pt-8 sm:pt-12">
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
          <h1 className="page-title">{route.title}</h1>
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

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="mb-10 max-w-3xl" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-4">{title}</h2>
      {body && <p className="section-intro-copy">{body}</p>}
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
      <ServiceMiniature index={index} accent={strength.accent} />
    </article>
  );
}

function ServiceMiniature({ index, accent }: { index: number; accent: Strength["accent"] }) {
  const contentDraftItems = ["Website messaging", "Technical explainer", "Case study draft", "Campaign note"];
  const checklistItems = ["AML/KYC", "SOP", "QA review", "Checklist", "Training note"];

  return (
    <div className={`service-miniature service-miniature-${accent}`} aria-hidden="true">
      {index === 0 && (
        <div className="miniature-content">
          {contentDraftItems.map((item, itemIndex) => (
            <span key={item} className={`mini-draft-row mini-draft-row-${itemIndex + 1}`}>
              <b>{item}</b>
              <i />
            </span>
          ))}
          <span className="mini-line mini-line-title" />
          <span className="mini-line mini-line-long" />
          <span className="mini-line mini-line-mid" />
          <span className="mini-line mini-line-short" />
          <span className="mini-type-cursor" />
          <span className="mini-annotation mini-annotation-a" />
          <span className="mini-annotation-line" />
          <span className="mini-content-block mini-content-block-a" />
          <span className="mini-content-block mini-content-block-b" />
        </div>
      )}

      {index === 1 && (
        <div className="miniature-checklist">
          {checklistItems.map((item) => (
            <span key={item} className="mini-check-row">
              <i />
              <b>{item}</b>
              <em />
            </span>
          ))}
          <span className="mini-review-mark" />
          <span className="mini-section-rule" />
        </div>
      )}

      {index === 2 && (
        <div className="miniature-workflow">
          <span className="mini-work-cluster">
            <b>Messy workflow</b>
            <i />
            <i />
            <i />
          </span>
          <span className="mini-process-node mini-process-intake">Intake</span>
          <span className="mini-process-node mini-process-review">Review</span>
          <span className="mini-process-node mini-process-handoff">Handoff</span>
          <span className="mini-process-node mini-process-mi">MI / Backlog</span>
          <span className="mini-process-node mini-process-result">Clean result</span>
          <span className="mini-process-line mini-process-line-a" />
          <span className="mini-process-line mini-process-line-b" />
          <span className="mini-process-line mini-process-line-c" />
          <span className="mini-process-line mini-process-line-d" />
          <span className="mini-process-line mini-process-line-e" />
        </div>
      )}
    </div>
  );
}

function OfferCard({ offer, compact = false }: { offer: (typeof offers)[number]; compact?: boolean }) {
  return (
    <article className={`offer-card ${compact ? "is-compact" : ""}`}>
      <h3>{offer.title}</h3>
      <p>{offer.summary}</p>
    </article>
  );
}

function HowWeWorkSection() {
  return (
    <Section className="section-process">
      <SectionIntro
        eyebrow="How We Work"
        title="How We Work"
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
          <p className="eyebrow">Contact</p>
          <h2 className="cta-title">Contact</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">{contact.body}</p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">{contact.guidance}</p>
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
        <p>{contact.body}</p>
        <p>{contact.guidance}</p>
        <div className="contact-methods">
          <a href={`mailto:${company.email}`} className="contact-method">
            <span>Email</span>
            {company.email}
          </a>
          <a href={company.calendlyUrl} target="_blank" rel="noreferrer" className="contact-method">
            <span>Calendly</span>
            Open Calendly
          </a>
        </div>
      </aside>

      <form ref={formRef} onSubmit={onSubmit} action={FORMSPREE_ENDPOINT} method="POST" className="contact-form" data-reveal>
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
    </div>
  );
}

function ConnectedWorkMap() {
  const [movement, setMovement] = useState({ x: 0, y: 0 });
  const [mobileSettled, setMobileSettled] = useState(false);
  const mobileMapRef = useRef<HTMLDivElement>(null);
  const desktopInputLabels = ["Draft", "Intake", "Notes", "Guidance", "Rework", "Handoff", "Backlog"];
  const mobileInputLabels = ["Draft", "Intake", "Notes", "Handoff"];

  useEffect(() => {
    const element = mobileMapRef.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMobileSettled(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMobileSettled(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const replayMobileMap = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setMobileSettled(false);
    window.setTimeout(() => setMobileSettled(true), 70);
  };

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
        tabIndex={0}
        aria-label="Connected Work Map showing messy inputs becoming communication, documentation and operations pathways"
      >
        <div className="map-paper" />
        <div className="map-energy" aria-hidden="true" />

        <div className="document-field depth-back" aria-hidden="true">
          {desktopInputLabels.map((label, index) => (
            <div key={label} className={`doc-fragment doc-fragment-${index + 1}`}>
              <b>{label}</b>
              <span />
              <i />
              <i />
              <em />
            </div>
          ))}
        </div>

        <svg className="map-lines" viewBox="0 0 760 520" role="presentation" aria-hidden="true">
          <defs>
            <linearGradient id="desktopPathLavender" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,253,248,0.52)" />
              <stop offset="100%" stopColor="rgba(222,215,255,0.96)" />
            </linearGradient>
            <linearGradient id="desktopPathBlue" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,253,248,0.5)" />
              <stop offset="100%" stopColor="rgba(201,230,255,0.92)" />
            </linearGradient>
            <linearGradient id="desktopPathTeal" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,253,248,0.5)" />
              <stop offset="100%" stopColor="rgba(191,244,240,0.92)" />
            </linearGradient>
          </defs>
          <path className="line line-intake line-intake-top" d="M206 105 C258 112 300 164 340 224" />
          <path className="line line-intake line-intake-mid" d="M206 258 C252 250 298 250 340 250" />
          <path className="line line-intake line-intake-low" d="M206 408 C258 382 302 326 340 278" />
          <path className="line line-draw line-lavender" d="M374 232 C438 154 520 116 650 116" />
          <path className="line line-draw line-blue" d="M374 252 C464 252 536 252 654 252" />
          <path className="line line-draw line-teal" d="M374 272 C438 350 520 398 652 398" />
          <circle className="map-point point-a" cx="360" cy="252" r="3.4" />
          <circle className="map-point point-b" cx="650" cy="116" r="3" />
          <circle className="map-point point-c" cx="654" cy="252" r="3" />
          <circle className="map-point point-d" cx="652" cy="398" r="3" />
        </svg>

        <div className="map-anchor depth-mid" aria-hidden="true">
          <span />
          <img src={company.logoSrc} alt="" />
        </div>

        <div className="outcome-field depth-front">
          {strengths.map((strength) => (
            <div key={strength.shortTitle} className={`outcome-zone outcome-${strength.accent}`}>
              <span aria-hidden="true" />
              <strong>{strength.shortTitle}</strong>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={mobileMapRef}
        className={`work-map-mobile ${mobileSettled ? "is-settled" : ""}`}
        aria-label="Replay Connected Work Map animation"
        role="button"
        tabIndex={0}
        onClick={replayMobileMap}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            replayMobileMap();
          }
        }}
      >
        <div className="mobile-paper" />
        <div className="mobile-map-energy" aria-hidden="true" />
        <div className="mobile-doc-field" aria-hidden="true">
          {mobileInputLabels.map((label, index) => (
            <div key={label} className={`mobile-doc mobile-doc-${index + 1}`}>
              <b>{label}</b>
              <span />
              <i />
              <i />
            </div>
          ))}
        </div>
        <svg className="mobile-lines" viewBox="0 0 320 380" aria-hidden="true">
          <path className="mobile-line mobile-intake-a" d="M70 38 C96 96 130 118 160 148" />
          <path className="mobile-line mobile-intake-b" d="M250 52 C222 98 194 120 160 148" />
          <path className="mobile-line mobile-intake-c" d="M118 94 C134 120 146 134 160 148" />
          <path className="mobile-line mobile-lavender" d="M160 170 C126 206 108 226 98 264" />
          <path className="mobile-line mobile-blue" d="M160 170 C160 212 160 232 160 282" />
          <path className="mobile-line mobile-teal" d="M160 170 C194 206 214 230 224 300" />
          <circle className="mobile-point mobile-point-main" cx="160" cy="164" r="3.4" />
        </svg>
        <div className="mobile-anchor" aria-hidden="true">
          <span />
          <img src={company.logoSrc} alt="" />
        </div>
        <div className="mobile-zone-stack">
          {strengths.map((strength) => (
            <span key={strength.shortTitle} className={`mobile-zone mobile-zone-${strength.accent}`}>
              <i aria-hidden="true" />
              {strength.shortTitle}
            </span>
          ))}
        </div>
        <span className="mobile-output-rule" aria-hidden="true" />
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
