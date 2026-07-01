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
  items: string[];
  accent: "lavender" | "blue" | "teal";
};

export type Offer = {
  title: string;
  summary: string;
  signal: string;
};

export type TeamMember = {
  name: string;
  lead: string;
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
  eyebrow: "Specialist support for complex work",
  title: "Clearer communication. Better operations. Practical tools.",
  body:
    "Fynstra helps businesses dealing with complex work explain what they do, improve how work moves through their teams and introduce practical tools where they add real value.",
  context:
    "We work with organisations in fintech, regtech, compliance, HR tech and process-heavy services where clear communication, strong subject knowledge and practical delivery all matter.",
  cta: "Book a 20-minute introductory call",
  secondaryCta: "Explore what we do",
};

export const problem = {
  title: "Complex work becomes harder when the message or process breaks down.",
  paragraphs: [
    "Complex businesses often have good products, strong people and useful expertise, but the way that expertise is explained or delivered can become unclear.",
    "Messaging becomes too technical. Internal guidance becomes inconsistent. Customers are asked for information more than once. Teams lose time to rework, handoffs and unclear ownership.",
    "The answer is not always more content, more software or more AI. The first step is understanding where the work, message or process is breaking down.",
  ],
};

export const strengths: Strength[] = [
  {
    title: "Specialist content and communication",
    shortTitle: "Communication",
    summary:
      "Website messaging, thought leadership, technical explainers, case studies, founder-led content, newsletters and campaign content.",
    items: [
      "Website and service-page messaging",
      "Thought leadership and technical explainers",
      "Case studies, newsletters and campaign content",
      "Founder-led and specialist B2B content",
    ],
    accent: "lavender",
  },
  {
    title: "Compliance, quality and documentation",
    shortTitle: "Compliance & Documentation",
    summary:
      "AML and KYC content, SOPs, checklists, QA support, training materials, internal guidance and compliance-facing explainers.",
    items: [
      "AML, KYC and onboarding content",
      "SOPs, checklists and internal guidance",
      "QA support and coaching materials",
      "Compliance-facing explainers and review support",
    ],
    accent: "blue",
  },
  {
    title: "Operations, workflow and practical tools",
    shortTitle: "Operations & Tools",
    summary:
      "Process mapping, workflow reviews, document-intake reviews, MI, backlog visibility, handoff improvement and practical AI review where the problem is clear.",
    items: [
      "Workflow and handoff reviews",
      "Document-intake and backlog visibility",
      "MI and operational structure",
      "Practical tool review where it genuinely helps",
    ],
    accent: "teal",
  },
];

export const whoWeHelp = {
  title: "Built for teams where the work is complex, regulated or process-heavy.",
  paragraphs: [
    "We are best suited to businesses where the work is complex, regulated, technical or process-heavy.",
    "This includes fintech, regtech, compliance consultancies, HR tech, recruitment technology, B2B SaaS, document-heavy professional services and teams dealing with quality, rework or operational pressure.",
    "We are not trying to be a general marketing agency or a broad AI consultancy. The strongest fit is with organisations that need clearer communication, better internal structure or more practical ways of managing work.",
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
  fitSignals: [
    "Your subject matter is valuable but hard to explain.",
    "Customers or internal teams keep asking for the same clarification.",
    "Guidance exists, but it is inconsistent or hard to use.",
    "A workflow has visible friction, rework or unclear ownership.",
  ],
};

export const offers: Offer[] = [
  {
    title: "Specialist content package",
    summary:
      "A practical content package for businesses that need clearer positioning, thought leadership, technical explainers and LinkedIn or campaign support.",
    signal: "Positioning, explainers and campaign support",
  },
  {
    title: "Fintech and compliance content support",
    summary:
      "Articles, explainers, guidance and review support for businesses writing about AML, KYC, onboarding, fraud, compliance or financial-crime topics.",
    signal: "AML, KYC, onboarding and fraud topics",
  },
  {
    title: "Financial-crime quality support",
    summary:
      "QA reviews, SOPs, checklists, coaching materials and practical improvement support for AML, KYC or compliance operations.",
    signal: "QA, SOPs, checklists and coaching materials",
  },
  {
    title: "Workflow friction review",
    summary:
      "A focused review of one workflow to identify delays, handoff issues, rework, visibility gaps and practical improvement options.",
    signal: "One workflow, clear friction, practical options",
  },
  {
    title: "Website messaging refresh",
    summary:
      "Clearer homepage, service-page and about-page messaging for businesses that know what they do but struggle to explain it clearly.",
    signal: "Homepage, service pages and about-page clarity",
  },
  {
    title: "Practical AI workflow review",
    summary:
      "A contained review of where AI, automation or simpler process changes could reduce manual work safely.",
    signal: "Only where the problem is clear",
  },
];

export const howWeWork = [
  "We start with a short introductory call to understand the issue and confirm whether there is a sensible fit.",
  "If there is, we agree the scope, the lead person, the deliverables and the price before work begins.",
  "Each project has one clear owner, with the right support added where needed. That might mean content led by Jasmine, compliance input from Barbora or workflow and systems input from David.",
  "The aim is always to produce practical outputs: clearer copy, better guidance, stronger documentation, a more useful workflow or a contained tool recommendation.",
];

export const team: TeamMember[] = [
  {
    name: "David",
    lead: "Operations, workflow, MI, systems thinking, practical AI and product/tool development.",
    detail:
      "David brings operations, workflow, MI, systems thinking and practical AI implementation.",
  },
  {
    name: "Barbora",
    lead:
      "AML, KYC, financial-crime quality, QA, SAR-related work, SOPs, analyst coaching and compliance operations.",
    detail:
      "Barbora brings hands-on financial-crime, AML, KYC, QA and compliance operations experience, with the ability to support both delivery work and specialist content.",
  },
  {
    name: "Jasmine",
    lead:
      "Specialist B2B content, HR tech, SaaS, thought leadership, website messaging, case studies and content strategy.",
    detail:
      "Jasmine brings specialist content strategy, commercial writing and experience helping B2B businesses communicate more clearly.",
  },
];

export const whyUs = [
  "Fynstra brings together three different but connected strengths.",
  "The value is not three separate services under one name. The value is being able to combine communication, subject expertise and operational thinking when the client problem needs it.",
];

export const contact = {
  title: "Start with a short conversation.",
  body:
    "If your business needs clearer communication, stronger compliance content, better internal guidance or a practical review of how work moves through your team, we can start with a short conversation.",
  guidance:
    "Use the form below or email us to book a 20-minute introductory call.",
  enquiryOptions: [
    "Content and communication",
    "Fintech or compliance content",
    "AML/KYC quality support",
    "Workflow review",
    "Practical AI or tools",
    "Not sure yet",
  ],
};

export const workMapFragments = [
  "unclear messaging",
  "duplicated requests",
  "inconsistent guidance",
  "handoff delays",
  "rework",
  "technical explainers",
  "AML/KYC notes",
  "workflow steps",
  "backlog visibility",
  "document intake",
];
