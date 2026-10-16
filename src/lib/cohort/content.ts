/**
 * Cloud Security Cohort 01: course page content, ported from Talia's drisyon-cyber-cohort page.
 * Prices and dates live in ./pricing.ts.
 */

export const facts = [
  { label: "Starts", value: "Sun, 1 Nov 2026" },
  { label: "Duration", value: "6 months · Nov–Apr" },
  { label: "Schedule", value: "Weekends, IST" },
  { label: "Cohort", value: "30 seats only" },
];

export const who = [
  { title: "You are", items: ["DevOps, SRE, platform or cloud engineer", "2–10 years in IT operations or delivery", "Moving toward DevSecOps, cloud security or SOC roles"] },
  { title: "You bring", items: ["Comfort with Linux and the command line", "TCP/IP and networking basics", "Working use of AWS, Azure or GCP"] },
  { title: "You leave with", items: ["Up to 6 OEM certifications", "A 10-piece security portfolio from real tools", "A capstone you can walk an interviewer through"] },
];

export const hours = [
  { h: 40, title: "Live hands-on labs", text: "10 weekend sessions, 4 hours each" },
  { h: 20, title: "Certification and lab clinics", text: "Exam prep, lab catch-up, capstone reviews" },
  { h: 30, title: "Industry lab immersion", text: "Three 10-hour blocks on licensed enterprise tools" },
];

export type Session = { id: string; t: string; tools: string; out: string; ops: string };
export type Month = { m: string; when: string; title: string; chips: string[]; lab?: string; s: Session[] };

export const months: Month[] = [
  {
    m: "Month 1", when: "Nov 2026", title: "Foundations and the perimeter", chips: ["NSE 1", "NSE 2"],
    s: [
      { id: "S01", t: "Threat lifecycle, lab setup and telemetry basics", tools: "Wazuh · Elastic · Wireshark", out: "Topology diagram, log inventory, baseline events", ops: "Ship container and CI runner logs to the SIEM" },
      { id: "S02", t: "Network security (NGFW): policy, segmentation, visibility", tools: "FortiGate · Palo Alto · Sophos", out: "Firewall policy set, annotated logs, change notes", ops: "Policy-as-code review in a pull request" },
    ],
  },
  {
    m: "Month 2", when: "Dec 2026", title: "Applications and endpoints", chips: ["SC-900"], lab: "Industry lab · Block 1",
    s: [
      { id: "S03", t: "Web application firewall: deployment and tuning", tools: "FortiWeb · Cloudflare · Barracuda WAF", out: "WAF tuning report, blocked-events analysis", ops: "WAF rules shipped with the app's IaC" },
      { id: "S04", t: "Endpoint security (EDR): alert triage and containment", tools: "SentinelOne · CrowdStrike", out: "Triage worksheet, containment evidence, IOC list", ops: "EDR coverage for build agents and bastions" },
    ],
  },
  {
    m: "Month 3", when: "Jan 2027", title: "Testing what you ship", chips: ["Qualys VMDR"],
    s: [
      { id: "S05", t: "Application security: DAST scan, validate, report", tools: "Burp Suite · Qualys · Metasploit · OWASP ZAP", out: "Mini VAPT report, validated findings, remediation proof", ops: "ZAP baseline scan as a pipeline gate" },
      { id: "S06", t: "Zero Trust and IAM: access governance essentials", tools: "Zscaler · Okta · SailPoint", out: "Access matrix, access-review decisions", ops: "Least-privilege roles for pipelines and service accounts" },
    ],
  },
  {
    m: "Month 4", when: "Feb 2027", title: "Cloud and data", chips: ["PANW Network Security Pro"], lab: "Industry lab · Block 2",
    s: [
      { id: "S07", t: "Cloud security and CASB: misconfiguration and controls", tools: "Netskope CASB", out: "Five-item misconfiguration checklist, cloud baseline controls sheet", ops: "Misconfig checks before terraform apply" },
      { id: "S08", t: "Data security (DLP) and email security", tools: "Netskope · Forcepoint · Barracuda Email · FortiMail", out: "DLP rule evidence, email-security decision tree", ops: "Secret and PII leakage checks on repos and buckets" },
    ],
  },
  {
    m: "Month 5", when: "Mar 2027", title: "Investigate and respond", chips: ["PANW Security Operations Pro"],
    s: [
      { id: "S09", t: "Digital forensics: acquire, preserve, analyse, timeline", tools: "FTK Imager · MSAB · OpenText · Autopsy", out: "Hashes, chain-of-custody form, incident timeline", ops: "Snapshot-based evidence capture for cloud VMs" },
      { id: "S10", t: "SOC and SOAR: detection engineering, playbooks, capstone", tools: "Seceon · Wazuh · ELK (Sigma)", out: "Detection rule, SIEM dashboard, SOAR playbook", ops: "Detections stored and versioned in Git" },
    ],
  },
  { m: "Month 6", when: "Apr 2027", title: "Capstone and SOC floor", chips: ["Capstone defence", "Portfolio review"], lab: "Industry lab · Block 3", s: [] },
];

export const capstone =
  "Finish the capstone: detect, contain and report a staged cloud breach end to end, then defend it on the SOC floor in front of practitioners. Portfolio review and demo day close the cohort.";

export const labBlocks = [
  { when: "Block 1 · December", title: "Perimeter and endpoint", text: "Next-gen firewall policy, WAF tuning and EDR triage on licensed FortiGate, Palo Alto, FortiWeb, SentinelOne and CrowdStrike consoles." },
  { when: "Block 2 · February", title: "Identity, cloud and data", text: "Zero Trust access, CASB posture checks and DLP rules on Zscaler, Okta, Netskope and Forcepoint, against cloud workloads you deploy." },
  { when: "Block 3 · April", title: "Forensics and the SOC floor", text: "Evidence acquisition with FTK Imager and MSAB, then a live detection and response shift on Seceon SIEM/SOAR. Capstone defence happens here." },
];

export const tools = [
  "FortiGate", "Palo Alto NGFW", "FortiWeb", "Cloudflare WAF", "SentinelOne", "CrowdStrike", "Burp Suite", "Qualys", "Zscaler", "Okta",
  "SailPoint", "Netskope", "Forcepoint", "FortiMail", "FTK Imager", "MSAB", "Autopsy", "Seceon", "Wazuh", "ELK + Sigma",
];

export const trainerFacts = [
  { big: "8–10+", text: "years of industry experience, per trainer" },
  { big: "Hands-on", text: "trainers who run firewalls, SOCs and investigations on the job, not just teach them" },
  { big: "Dedicated", text: "the same mentors for all six months, reviewing every deliverable and your capstone" },
];

export const certs = [
  { oem: "Fortinet", title: "NSE 1 — Threat Landscape", text: "Threat actors, attack methods, cybersecurity first principles.", when: "Month 1" },
  { oem: "Fortinet", title: "NSE 2 — Technical Introduction", text: "Core security technologies and career pathways.", when: "Month 1" },
  { oem: "Microsoft", title: "SC-900 Security, Compliance & Identity", text: "Entra ID, Zero Trust, Defender, Purview.", when: "Month 2" },
  { oem: "Qualys", title: "VMDR", text: "Asset inventory, scanning, prioritisation, patch workflows.", when: "Month 3" },
  { oem: "Palo Alto Networks", title: "Network Security Professional", text: "NGFW, cloud-delivered security, SASE, enterprise DLP.", when: "Month 4 · ~32h 30m self-paced" },
  { oem: "Palo Alto Networks", title: "Security Operations Professional", text: "SOC processes, investigations, automation, Cortex.", when: "Month 5 · ~5h 15m self-paced" },
];

export const faq = [
  { q: "When do sessions run?", a: "Live labs run on weekends in IST, about two per month. Clinics fill the weeks in between. The full calendar goes out at orientation on 1 November. There is no session on Diwali weekend." },
  { q: "What if I miss a session?", a: "Each lab is recorded, and the next clinic slot is used to finish the missed deliverable with a mentor. Industry lab blocks are in person and are scheduled with four weeks' notice." },
  { q: "Do I need my own cloud account or licences?", a: "No. Lab environments and all enterprise tool access are provided. A laptop with 16 GB RAM and a stable connection is enough." },
  { q: "Why only 30 seats?", a: "Industry lab consoles and mentor time are limited. Thirty keeps every learner hands-on during each block." },
  { q: "Which certificate do I get?", a: "A Drisyon completion certificate on finishing all ten deliverables and the capstone, plus the OEM certifications you pass through each vendor's own platform." },
  { q: "Can my company sponsor me or send a team?", a: "Yes. A GST tax invoice can be issued to your employer, and one order can cover up to 10 seats. For larger teams, talk to us." },
];
