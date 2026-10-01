/**
 * Website content. Everything here describes DRISYON capabilities — it intentionally
 * contains no client names, statistics, testimonials or claims of completed work.
 */

export type Solution = {
  slug: string;
  index: string;
  title: string;
  short: string;
  description: string;
  /** Five-step pipeline the explorer visualises: trigger → reason → workflow → action → outcome */
  flow: [string, string, string, string, string];
  useCases: string[];
  capabilities: string[];
};

/** Hero system stages and their column x-positions (fractions of the canvas width). */
export const HERO_STAGES = ["Input", "Super Intelligence", "Decision", "Action", "Outcome"] as const;
export const HERO_COLS = [0.1, 0.32, 0.53, 0.74, 0.92];

export const STAGE_NAMES =["Trigger", "Reason", "Workflow", "Action", "Outcome"] as const;

export const solutions: Solution[] = [
  {
    slug: "si-agents",
    index: "01",
    title: "SI Agents",
    short: "Systems that reason, act and execute business tasks.",
    description:
      "Autonomous or semi-autonomous agents that understand a goal, plan the steps, use your tools and complete the work — with humans in the loop where it matters.",
    flow: ["New request", "Understand goal", "Plan steps", "Use tools", "Task completed"],
    useCases: ["Research & briefing agents", "Lead qualification", "Internal operations assistants", "Multi-step task execution"],
    capabilities: ["Tool and API use", "Planning and reasoning", "Human-in-the-loop approvals", "Memory and context", "Guardrails and logging"],
  },
  {
    slug: "workflow-automation",
    index: "02",
    title: "Workflow Automation",
    short: "Repetitive multi-step processes, automated end to end.",
    description:
      "We map the steps your team repeats every day and turn them into reliable automated workflows that connect your apps, data and people.",
    flow: ["Form submitted", "Validate data", "Route & enrich", "Update systems", "Team notified"],
    useCases: ["Onboarding workflows", "Approvals and routing", "Data sync between tools", "Scheduled reporting"],
    capabilities: ["Process mapping", "App and API integrations", "Error handling and retries", "Notifications", "Monitoring"],
  },
  {
    slug: "intelligent-documents",
    index: "03",
    title: "Intelligent Document Systems",
    short: "Extract, understand, classify and act on information.",
    description:
      "Documents arrive in every format. We build systems that read them, pull out what matters, classify them and push the result into the right workflow.",
    flow: ["Document arrives", "Read & extract", "Classify & check", "Push to system", "Record ready"],
    useCases: ["Invoice and receipt processing", "Application and form intake", "Contract review support", "Knowledge search"],
    capabilities: ["Data extraction", "Classification", "Validation rules", "Search across documents", "Structured output"],
  },
  {
    slug: "conversational-ai",
    index: "04",
    title: "Conversational AI",
    short: "Conversations turned into actions and records.",
    description:
      "Chat and voice assistants that do more than answer — they capture intent, update records, book, follow up and hand over to people when needed.",
    flow: ["Customer message", "Detect intent", "Look up context", "Take action", "Record updated"],
    useCases: ["Customer support assistants", "Booking and enquiries", "Meeting notes to actions", "Internal help desks"],
    capabilities: ["Chat and voice interfaces", "Intent detection", "CRM and helpdesk updates", "Hand-off to humans", "Multilingual support"],
  },
  {
    slug: "business-process-automation",
    index: "05",
    title: "Business Process Automation",
    short: "People, systems, decisions and actions — connected.",
    description:
      "Whole processes, not single tasks. We connect departments, systems and decision points into one intelligent flow that is measurable and easy to improve.",
    flow: ["Process event", "Apply business rules", "Orchestrate teams", "Execute actions", "Process closed"],
    useCases: ["Order-to-fulfilment", "Procure-to-pay support", "Service request handling", "Compliance checklists"],
    capabilities: ["Orchestration", "Decision logic", "Role-based approvals", "Audit trails", "Dashboards"],
  },
  {
    slug: "custom-ai-systems",
    index: "06",
    title: "Custom AI Systems",
    short: "AI built around your specific requirements.",
    description:
      "When off-the-shelf tools don't fit, we design and build AI systems around your data, constraints and goals — from prototype to production.",
    flow: ["Business need", "Model & data design", "Build the system", "Integrate & deploy", "Measured value"],
    useCases: ["Decision-support systems", "Domain-specific assistants", "Prediction and scoring", "AI-enabled internal tools"],
    capabilities: ["Solution architecture", "Data pipelines", "Model selection", "Evaluation", "Deployment and scaling"],
  },
];

export const processSteps = [
  { n: "01", title: "Understand", text: "Understand the business process." },
  { n: "02", title: "Design", text: "Design the Super Intelligence and automation architecture." },
  { n: "03", title: "Build", text: "Develop agents, workflows and integrations." },
  { n: "04", title: "Deploy", text: "Put the system into the real workflow." },
  { n: "05", title: "Scale", text: "Improve, monitor and expand." },
];

/** Sample use cases — illustrative opportunities, not clients or completed implementations. */
export type UseCase = { title: string; text: string };
export type Industry = { name: string; summary: string; useCases: UseCase[] };

export const industries: Industry[] = [
  {
    name: "Finance",
    summary: "High-volume documents, checks and reporting that follow clear rules.",
    useCases: [
      { title: "Document & KYC intake", text: "Read submitted documents, extract details and flag what needs review." },
      { title: "Reconciliation support", text: "Match records across systems and surface the exceptions." },
      { title: "Report generation", text: "Assemble recurring reports from multiple data sources." },
      { title: "Customer query assistant", text: "Answer routine account questions and route the rest." },
    ],
  },
  {
    name: "Education",
    summary: "Admissions, enquiries and administration that repeat every term.",
    useCases: [
      { title: "Admissions & enquiries", text: "Respond to applicants, collect documents and track status." },
      { title: "Learning assistants", text: "Help learners find answers in course material." },
      { title: "Administrative workflows", text: "Automate scheduling, records and notifications." },
      { title: "Feedback analysis", text: "Summarise survey and feedback responses into themes." },
    ],
  },
  {
    name: "Healthcare",
    summary: "Intake, scheduling and paperwork around the care itself.",
    useCases: [
      { title: "Appointment & intake flows", text: "Book, remind and collect intake details before visits." },
      { title: "Document processing", text: "Classify and route forms, referrals and records." },
      { title: "Patient communication", text: "Send follow-ups and answer common non-clinical questions." },
      { title: "Operational reporting", text: "Compile daily and weekly operational summaries." },
    ],
  },
  {
    name: "Marketing",
    summary: "Content, research and reporting that scale with every campaign.",
    useCases: [
      { title: "Content workflows", text: "Draft, review and schedule content across channels." },
      { title: "Campaign reporting", text: "Pull results together and highlight what changed." },
      { title: "Audience research agents", text: "Gather and summarise market and competitor information." },
      { title: "Lead enrichment", text: "Add context to new leads before they reach sales." },
    ],
  },
  {
    name: "Sales",
    summary: "Qualification, follow-ups and CRM updates that slow the team down.",
    useCases: [
      { title: "Lead qualification", text: "Score and route incoming leads based on your criteria." },
      { title: "CRM updates from conversations", text: "Turn calls and emails into structured CRM records." },
      { title: "Proposal drafting", text: "Prepare first drafts from templates and deal details." },
      { title: "Follow-up sequences", text: "Trigger timely, personalised follow-ups automatically." },
    ],
  },
  {
    name: "E-commerce",
    summary: "Orders, catalogues and customer questions at volume.",
    useCases: [
      { title: "Order & returns automation", text: "Handle status updates, returns and refunds end to end." },
      { title: "Catalogue enrichment", text: "Generate and clean product descriptions and attributes." },
      { title: "Customer assistants", text: "Help shoppers find products and answer order questions." },
      { title: "Inventory alerts", text: "Watch stock levels and notify the right people." },
    ],
  },
  {
    name: "Customer Support",
    summary: "Repetitive tickets that pull agents away from complex cases.",
    useCases: [
      { title: "Ticket triage & routing", text: "Classify incoming tickets and send them to the right queue." },
      { title: "Assisted replies", text: "Draft accurate responses grounded in your knowledge base." },
      { title: "Knowledge-base search", text: "Let agents and customers find answers instantly." },
      { title: "Escalation summaries", text: "Summarise long threads before hand-off." },
    ],
  },
  {
    name: "Operations",
    summary: "Approvals, data movement and reporting between teams.",
    useCases: [
      { title: "Approvals & routing", text: "Move requests through the right approvers automatically." },
      { title: "Data sync between tools", text: "Keep records consistent across your systems." },
      { title: "Scheduled reporting", text: "Deliver recurring reports without manual effort." },
      { title: "Vendor & invoice handling", text: "Capture, check and route supplier documents." },
    ],
  },
  {
    name: "Real Estate",
    summary: "Enquiries, listings and documents across many properties.",
    useCases: [
      { title: "Enquiry follow-ups", text: "Respond to enquiries and schedule viewings." },
      { title: "Listing data workflows", text: "Prepare and update listing details across platforms." },
      { title: "Document handling", text: "Organise agreements and supporting documents." },
      { title: "Tenant communication", text: "Handle routine requests and reminders." },
    ],
  },
  {
    name: "Professional Services",
    summary: "Intake, research and admin around expert work.",
    useCases: [
      { title: "Client intake", text: "Collect information and documents from new clients." },
      { title: "Research & summaries", text: "Gather sources and produce structured summaries." },
      { title: "Time & billing workflows", text: "Reconcile time entries and prepare invoices." },
      { title: "Knowledge management", text: "Make past work searchable for the whole team." },
    ],
  },
];

/** Projects shown on /work. Add new entries here — each becomes a case study on the Work page. */
export type Work = {
  slug: string;
  name: string;
  label: string;
  domain: string;
  summary: string;
  /** Problem → Intelligence → Agent → Workflow → Result */
  flow: { key: string; text: string }[];
  /** Shown as a clearly marked placeholder tag while details are pending. Remove once complete. */
  status?: string;
  /** Path under /public, e.g. "/work/nipuna.png". Falls back to an abstract schematic + placeholder. */
  screenshot?: string;
};

export const works: Work[] = [
  {
    slug: "nipuna",
    name: "NIPUNA",
    label: "Featured solution",
    domain: "SI Agents in Fintech",
    summary:
      "NIPUNA brings SI agents into the world of fintech — a featured DRISYON build where intelligent agents meet financial workflows and practical, hands-on learning.",
    flow: [
      { key: "Problem", text: "The challenge the system is designed to address." },
      { key: "Intelligence", text: "How AI understands and reasons about the information." },
      { key: "Agent", text: "The SI agents and the roles they perform." },
      { key: "Workflow", text: "How agents, tools and people are connected." },
      { key: "Result", text: "The value delivered to learners and the business context." },
    ],
    status: "Full case study coming soon",
  },
];

/** Future-Ready Learners programmes. */
export const courses = [
  {
    code: "FDE",
    title: "Forward Deployed Engineering",
    text: "Take AI from prototype to production inside real business workflows.",
  },
  {
    code: "Agentic AI",
    title: "Agentic AI",
    text: "Design and build SI agents that reason, plan, use tools and act.",
  },
  {
    code: "Gen AI",
    title: "Generative AI",
    text: "Build practical applications with generative AI models.",
  },
];

export const corporateTopics = [
  "AI workshops",
  "Practical AI training",
  "Workflow automation awareness",
  "Productivity with AI",
  "Business use cases",
  "Team upskilling",
];

export const communityFormats = ["Meetups", "Workshops", "Live Builds", "Projects", "Discussions", "Networking"];

export const pillars = [
  { title: "Vision", icon: "eye" },
  { title: "Intelligence", icon: "brain" },
  { title: "Automation", icon: "bolt" },
  { title: "Action", icon: "play" },
] as const;

export type Founder = {
  id: string;
  name: string;
  role: string;
  initials: string;
  photo?: string;
  /** Optional external scheduler (Calendly, Cal.com…). When set, it replaces the built-in slot picker. */
  bookingUrl?: string;
};

/** Add a `photo` path (e.g. "/team/narayanamurthy.jpg") once official photographs are available. */
export const founders: Founder[] = [
  {
    id: "narayanamurthy",
    name: "T. Narayanamurthy",
    role: "Co-Founder",
    initials: "TN",
    bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL_NARAYANAMURTHY || undefined,
  },
  {
    id: "madhura-reddy",
    name: "K. Madhura Reddy",
    role: "Co-Founder",
    initials: "MR",
    photo: "/team/madhura-reddy.jpg",
    bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL_MADHURA_REDDY || undefined,
  },
];

export const interestOptions = [
  "Automation Services",
  "SI Agents",
  "Custom Automation",
  "Partnership",
  "Student Training",
  "Corporate Training",
  "Other",
] as const;
