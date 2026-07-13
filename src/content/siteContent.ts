export type RouteId = "home" | "what-we-do" | "who-we-help" | "about" | "contact";

export type NavItem = {
  id: RouteId;
  label: string;
  path: string;
};

export type Strength = {
  title: string;
  shortTitle: string;
  summary: string;
  accent: "lavender" | "blue" | "teal";
};

export type Offer = {
  title: string;
  summary: string;
};

export type TeamMember = {
  name: string;
  detail: string;
};

export const company = {
  name: "Fynstra",
  logoSrc: "/fynstra-logo.png",
  email: "info@fynstra.co.uk",
  calendlyUrl: "https://calendly.com/fynstrabd/30min",
  callLabel: "Book a 20-minute introductory call",
};

export const navItems: NavItem[] = [
  { id: "home", label: "Home", path: "/" },
  { id: "what-we-do", label: "What We Do", path: "/what-we-do" },
  { id: "who-we-help", label: "Who We Help", path: "/who-we-help" },
  { id: "about", label: "About", path: "/about" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export const hero = {
  eyebrow: "Fynstra",
  title: "Clearer communication. Better operations. Practical tools.",
  body:
    "We help businesses dealing with complex work explain what they do, improve how work moves through their teams and introduce practical tools where they add real value.",
  context:
    "That is the gap we close for organisations in fintech, regtech, compliance, HR tech and process-heavy services where clear communication, strong subject knowledge and practical delivery all matter.",
  cta: "Explore what we do",
  secondaryCta: "",
};

export const problem = {
  title: "Expertise isn't the problem. Translation is.",
  paragraphs: [
    "You know your stuff. Your team knows your stuff. But somewhere between \"we understand this\" and \"everyone else does too,\" some of that clarity doesn't quite make the journey.",
    "Messaging becomes too technical. Internal guidance becomes inconsistent. Customers are asked for information more than once. Teams lose time to rework, handoffs and unclear ownership.",
    "The answer is not always more content, more software or more AI. The first step is understanding where the work, message or process is breaking down.",
  ],
  cta: "Why work with us",
};

export const strengths: Strength[] = [
  {
    title: "Specialist content and communication",
    shortTitle: "Communication",
    summary:
      "Website messaging, thought leadership, technical explainers, case studies, founder-led content, newsletters and campaign content.",
    accent: "lavender",
  },
  {
    title: "Compliance, quality and documentation",
    shortTitle: "Compliance & Documentation",
    summary:
      "AML and KYC content, SOPs, checklists, QA support, training materials, internal guidance and compliance-facing explainers.",
    accent: "blue",
  },
  {
    title: "Operations, workflow and practical tools",
    shortTitle: "Operations & Tools",
    summary:
      "Process mapping, workflow reviews, document-intake reviews, MI, backlog visibility, handoff improvement and practical AI review where the problem is clear.",
    accent: "teal",
  },
];

export const whoWeHelp = {
  title: "Who We Help",
  paragraphs: [
    "If your work is complex, regulated, technical or process-heavy, you're exactly who we built Fynstra for.",
    "This includes fintech, regtech, compliance consultancies, HR tech, B2B SaaS, document-heavy professional services and teams dealing with quality, rework or operational pressure.",
    "We are not trying to be a general marketing agency or a broad AI consultancy. We're the strongest fit for organisations that need clearer communication, better internal structure or more practical ways of managing work.",
  ],
  sectors: [
    "Fintech",
    "Regtech",
    "Compliance consultancies",
    "HR tech",
    "Recruitment technology",
    "B2B SaaS",
    "Document-heavy professional services",
    "Quality, rework or operational-pressure teams",
  ],
};

export const offers: Offer[] = [
  {
    title: "Specialist B2B content package",
    summary:
      "A practical content package for businesses that need clearer positioning, thought leadership, technical explainers and LinkedIn or campaign support.",
  },
  {
    title: "Fintech and compliance content support",
    summary:
      "Articles, explainers, guidance and review support for businesses writing about AML, KYC, onboarding, fraud, compliance or financial-crime topics.",
  },
  {
    title: "Financial-crime quality support",
    summary:
      "QA reviews, SOPs, checklists, coaching materials and practical improvement support for AML, KYC or compliance operations.",
  },
  {
    title: "Workflow friction review",
    summary:
      "A focused review of one workflow to identify delays, handoff issues, rework, visibility gaps and practical improvement options.",
  },
  {
    title: "Website messaging refresh",
    summary:
      "Clearer homepage, service-page and about-page messaging for businesses that know exactly what they do and just need it said as clearly.",
  },
  {
    title: "Practical AI workflow review",
    summary:
      "A contained review of where AI, automation or simpler process changes could reduce manual work safely.",
  },
];

export const howWeWork = [
  "We start with a short introductory call to understand the issue and confirm whether there is a sensible fit.",
  "We agree the scope, the lead person, the deliverables and the price before work begins.",
  "Each project has one clear owner, with the right support added where needed. That might mean content led by Jasmine, compliance input from Barbora or workflow and systems input from David.",
  "The aim is always to produce practical outputs: clearer copy, better guidance, stronger documentation, a more useful workflow or a contained tool recommendation.",
];

export const team: TeamMember[] = [
  {
    name: "Barbora",
    detail:
      "Barbora brings hands-on experience in financial-crime, AML, KYC, QA and compliance operations. She works across both delivery and specialist content.",
  },
  {
    name: "Jasmine",
    detail:
      "Jasmine brings the words: the specialist content strategy, commercial writing and experience helping B2B businesses communicate their message more clearly.",
  },
  {
    name: "David",
    detail:
      "David brings the systems: operations, workflow, MI, systems thinking and practical AI implementation. If something's clogged, he finds out where.",
  },
];

export const whyUs = [
  "Three people. Three strengths. One team.",
  "The value is not three separate services under one name. The value is being able to combine communication, subject expertise and operational thinking when the client problem needs it.",
];

export const contact = {
  title: "Contact",
  body:
    "Need clearer communication, stronger compliance content, better internal guidance, or a straight look at how work moves through your team? Let's start with a conversation.",
  guidance:
    "Use the form below, or email us directly to book a 20-minute introductory call.",
  enquiryOptions: [
    "content and communication",
    "fintech or compliance content",
    "AML/KYC quality support",
    "workflow review",
    "practical AI or tools",
    "not sure yet",
  ],
};

export const pageCta = {
  title: "Let's talk",
  body:
    "Need clearer communication, stronger compliance content, or a straight look at how work moves through your team? Start with a conversation.",
  primaryLabel: "Book a 20-minute introductory call",
  secondaryLabel: "Email Fynstra",
};
