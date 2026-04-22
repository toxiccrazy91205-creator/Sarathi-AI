// app/page.js
import Link from 'next/link';
import {
  BrainCircuit,
  LineChart,
  Users,
  Target,
  ShieldCheck,
  PhoneCall,
  Mail,
  ArrowRight,
  CheckCircle2,
  Star,
  GraduationCap,
  Sparkles,
  Zap,
  BarChart3,
  Award,
  Lock,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Static Data ──────────────────────────────────────────────────────────────

const STATS = [
  { icon: Users, value: '2,400+', label: 'Assessments Completed' },
  { icon: GraduationCap, value: '18+', label: 'Partner Colleges' },
  { icon: CheckCircle2, value: '60', label: 'Psychometric Dimensions' },
];

const TESTIMONIALS = [
  {
    name: 'Rahul S.',
    college: 'SRM University · B.Tech CSE',
    avatar: 'RS',
    quote:
      'I was torn between an MBA and starting a venture. The 5-year roadmap broke it down quarter by quarter and told me exactly what to do in the next 30 days. The ₹99 I paid felt like a steal.',
  },
  {
    name: 'Priya M.',
    college: 'Delhi University · B.Com Hons',
    avatar: 'PM',
    quote:
      'The psychometric radar was unsettlingly accurate. It flagged my tendency to overthink before committing and recommended roles with structured decision-making. I avoided a wrong job offer because of it.',
  },
  {
    name: 'Aman K.',
    college: 'VIT Vellore · B.Tech ECE',
    avatar: 'AK',
    quote:
      'Within 15 minutes I had a clear Year 1 and Year 2 action plan. I had already landed two internship interviews at companies the report specifically recommended targeting.',
  },
];

const METHODOLOGY = [
  {
    icon: Target,
    title: 'Role-Level Precision',
    description:
      'We go beyond broad fields like "Engineering" or "Business." SARATHI maps your profile to specific job titles, team cultures, and company archetypes — so you apply smarter, not harder.',
    color: 'blue',
  },
  {
    icon: BrainCircuit,
    title: 'AI That Understands Context',
    description:
      'Our Gemini-powered engine does not just score you — it reasons about your trait combinations the way a seasoned career psychologist would, surfacing paths that generic tests miss entirely.',
    color: 'orange',
  },
  {
    icon: LineChart,
    title: 'A Plan, Not Just a Score',
    description:
      'Every report includes a quarterly execution plan: skills to build, certifications to pursue, communities to join, and milestones to hit — year by year for five years.',
    color: 'blue',
  },
];

const FAQS = [
  {
    q: 'Is my personal data secure?',
    a: 'Yes. We collect only the information needed to generate your report. All data is AES-256 encrypted in transit and at rest, and is never sold or shared with third parties.',
  },
  {
    q: 'How long does the assessment take?',
    a: 'Most students complete all 60 questions in 12 to 18 minutes. The questions are scenario-based and do not require any prior knowledge — just honest answers.',
  },
  {
    q: 'Do I have to pay before taking the test?',
    a: 'No. The assessment is completely free to take. You pay a one-time fee of ₹99 only at the end, to unlock and download your full personalised 5-Year PDF Roadmap.',
  },
  {
    q: 'How is SARATHI different from free tests like MBTI or 16Personalities?',
    a: 'Free personality tests tell you your type. SARATHI tells you what to do next. We combine 60 psychometric dimensions with real Indian career market data and AI reasoning to produce an actionable plan — not a label.',
  },
  {
    q: 'Can I retake the assessment?',
    a: 'Yes. We recommend revisiting every 6 to 12 months as your goals evolve. Each retake generates a fresh report, and your previous reports are saved in your dashboard.',
  },
  {
    q: 'What format is the final report?',
    a: 'You receive an interactive web dashboard and a beautifully formatted PDF. The PDF is yours to keep and share — with mentors, placement officers, or future employers.',
  },
];

const INSTITUTION_FEATURES = [
  'Cohort-level skill gap analytics by department and graduation year',
  'Predictive placement-readiness scoring updated in real time',
  'White-labeled portal with your institution\'s branding',
  'TPO dashboard with exportable reports for industry partners',
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Take the Assessment',
    desc: 'Answer 60 scenario-based psychometric questions crafted by career scientists and I/O psychologists. No right or wrong answers — just honest ones.',
    icon: BrainCircuit,
  },
  {
    step: '02',
    title: 'AI Builds Your Profile',
    desc: 'Gemini AI analyses your responses across 60 dimensions — personality, motivations, cognitive style, risk tolerance, and more — in seconds.',
    icon: Sparkles,
  },
  {
    step: '03',
    title: 'Receive Your 5-Year Roadmap',
    desc: 'Get a role-specific, quarter-by-quarter execution plan with skill benchmarks, communities to join, and milestones to hit every year.',
    icon: Target,
  },
];

const COLLEGES = [
  'SRM University',
  'Delhi University',
  'VIT Vellore',
  'Amity University',
  'KIIT',
  'Manipal',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <main>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section id="home" className="relative overflow-hidden bg-[#0A2351] py-24 lg:py-32">
          {/* Grid bg */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#F57D14] opacity-10 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-500 opacity-10 blur-[100px]" />

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-16 lg:grid-cols-2">

              {/* Left */}
              <div className="max-w-2xl">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-blue-200 backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-[#F57D14]" />
                  Gemini AI · 60 Psychometric Dimensions · Built for India
                </div>

                <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl xl:text-7xl">
                  Know Exactly Where{' '}
                  <span className="relative whitespace-nowrap text-[#F57D14]">
                    Your Career
                    <svg
                      className="absolute -bottom-2 left-0 w-full"
                      viewBox="0 0 300 12"
                      fill="none"
                      xmlns="[w3.org](http://www.w3.org/2000/svg)"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 9C60 3 150 1 298 9"
                        stroke="#F57D14"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.5"
                      />
                    </svg>
                  </span>{' '}
                  Is Headed
                </h1>

                <p className="mt-8 text-lg leading-relaxed text-white/70 sm:max-w-lg">
                  SARATHI is an AI-powered psychometric career platform built
                  specifically for Indian college students. In 15 minutes, we map
                  your personality, strengths, and motivations to a concrete
                  5-year roadmap — complete with role matches, quarterly
                  milestones, and the exact skills to build.
                </p>

                <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    className="h-14 rounded-full bg-[#F57D14] px-8 text-base font-bold text-white shadow-2xl shadow-[#F57D14]/30 transition-all hover:scale-105 hover:bg-[#dd6f11]"
                  >
                    <Link href="/assessment">
                      Start Free Assessment
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <a
                    href="/sample-report.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1 text-sm font-semibold text-white/60 transition-colors hover:text-white"
                  >
                    <span className="underline underline-offset-4">View a sample report</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>

                <p className="mt-5 text-sm font-medium text-white/40">
                  Free to take &nbsp;·&nbsp; Full PDF Roadmap for{' '}
                  <span className="text-white/70">₹99</span>
                  &nbsp;·&nbsp; No subscription
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8">
                  {[
                    { icon: Lock, text: 'AES-256 Encrypted' },
                    { icon: Zap, text: '15-Minute Test' },
                    { icon: Award, text: 'AI-Powered Insights' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-sm font-medium text-white/50">
                      <Icon className="h-4 w-4 text-[#F57D14]" />
                      {text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Dashboard card */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="absolute -top-4 -right-4 z-20 flex items-center gap-2 rounded-full bg-[#F57D14] px-4 py-2 text-xs font-bold text-white shadow-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                  </span>
                  Live AI Analysis
                </div>

                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
                  <div className="border-b border-white/10 bg-white/5 px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400/70" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                      <div className="h-3 w-3 rounded-full bg-green-400/70" />
                      <p className="ml-3 text-xs font-semibold text-white/40">
                        sarathi-ai.in · Career Report
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F57D14] text-sm font-extrabold text-white">
                        AK
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Aman K.</p>
                        <p className="text-xs text-white/50">VIT Vellore · B.Tech ECE</p>
                      </div>
                      <span className="ml-auto rounded-full bg-green-500/20 px-3 py-1 text-[10px] font-bold uppercase text-green-400">
                        Report Ready
                      </span>
                    </div>

                    <div className="rounded-2xl bg-white p-5">
                      <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Top Role Matches
                      </p>
                      <div className="space-y-4">
                        {[
                          { role: 'Technical Product Manager', pct: 93 },
                          { role: 'UX Research Lead', pct: 88 },
                          { role: 'Data Analyst', pct: 81 },
                        ].map(({ role, pct }) => (
                          <div key={role}>
                            <div className="mb-1 flex items-center justify-between">
                              <p className="text-xs font-semibold text-[#0A2351]">{role}</p>
                              <span className="text-xs font-extrabold text-[#F57D14]">{pct}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#F57D14] to-[#ffaa5e]"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-2xl bg-white/10 p-4">
                      <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-[#F57D14]" />
                      <div>
                        <p className="text-xs font-bold text-white">Year 1 Priority Action</p>
                        <p className="mt-1 text-[11px] leading-relaxed text-white/60">
                          High analytical drive + systems thinking detected. Build a
                          public GitHub portfolio with 2 data projects before semester end.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF BAR ──────────────────────────────────────────────── */}
        <section className="border-b border-slate-100 bg-white py-14">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="mb-10 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
              Trusted by students from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale">
              {COLLEGES.map((college) => (
                <span key={college} className="text-sm font-bold text-slate-700">
                  {college}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────────────────────────── */}
        <section className="bg-slate-50 py-14">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 md:divide-x md:divide-slate-200">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="group flex flex-col items-center gap-2 pt-4 md:pt-0">
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A2351]/5 transition-colors group-hover:bg-[#0A2351]">
                    <Icon className="h-6 w-6 text-[#F57D14]" />
                  </div>
                  <p className="text-4xl font-extrabold text-[#0A2351]">{value}</p>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
        <section className="bg-white py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#F57D14]">
                How It Works
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0A2351] sm:text-4xl">
                From Confusion to Clarity in 3 Steps
              </h2>
              <p className="mt-4 text-base text-slate-500">
                No counselor appointments. No vague advice. A personalized,
                AI-generated roadmap built around you.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }) => (
                <div
                  key={step}
                  className="relative rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0A2351] text-white">
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="text-5xl font-extrabold text-slate-100">{step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#0A2351]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── METHODOLOGY ───────────────────────────────────────────────────── */}
        <section id="methodology" className="scroll-mt-24 bg-slate-50 py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#F57D14]">
                Our Methodology
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0A2351] sm:text-4xl">
                The Science Behind Your Roadmap
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
                SARATHI combines validated psychometric frameworks — Big Five personality
                theory, Holland Codes, and Self-Determination Theory — with Gemini 2.5
                Flash to generate insights no generic test can match.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {METHODOLOGY.map(({ icon: Icon, title, description, color }) => (
                <div
                  key={title}
                  className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:-translate-y-1 hover:border-[#F57D14]/30 hover:shadow-xl"
                >
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-300 ${
                      color === 'orange'
                        ? 'bg-[#F57D14]/10 text-[#F57D14] group-hover:bg-[#F57D14] group-hover:text-white'
                        : 'bg-[#0A2351]/5 text-[#0A2351] group-hover:bg-[#0A2351] group-hover:text-white'
                    }`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A2351]">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
        <section id="about" className="scroll-mt-24 bg-[#0A2351] py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#F57D14]">
                Student Stories
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                What Students Are Saying
              </h2>
              <p className="mt-4 text-base text-white/50">
                Unfiltered feedback from students who found their direction with SARATHI.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-[#F57D14]/40 hover:bg
