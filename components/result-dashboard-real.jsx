'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BadgeIndianRupee,
  BrainCircuit,
  Compass,
  Lightbulb,
  LockKeyhole,
  Network,
  Sparkles,
  Target,
  ArrowRight,
  Loader2,
  BookOpen,
  TrendingUp,
  Timer,
  Activity,
  Globe,
  Users,
  Award,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const hasRealAiAnalysis = (analysis) =>
  Boolean(
    analysis?.user_archetype &&
    analysis?.executive_summary &&
    Array.isArray(analysis?.top_career_matches)
  )

const parseExecutiveSummary = (raw) => {
  if (!raw) return []
  if (typeof raw === 'string') {
    return raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  }
  // Gemini sometimes returns { paragraph_1: "...", paragraph_2: "..." }
  if (typeof raw === 'object') {
    return Object.values(raw).filter(Boolean)
  }
  return []
}

const safeText = (val) => {
  if (!val) return null
  if (typeof val === 'string') return val
  if (typeof val === 'object') return Object.values(val).filter(Boolean).join(' — ')
  return String(val)
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────
const SectionHeading = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A2351] text-[#F57D14]">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <h2 className="text-xl font-bold text-[#0A2351]">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  </div>
)

const BlindSpotItem = ({ text, isSevere }) => (
  <li className="flex gap-3 pb-3">
    <span className="mt-1 shrink-0">
      {isSevere
        ? <AlertTriangle className="h-4 w-4 text-red-500" />
        : <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-orange-400" />
      }
    </span>
    <span className={`text-sm leading-relaxed ${isSevere ? 'text-red-700 font-medium' : 'text-orange-900/80'}`}>
      {text}
    </span>
  </li>
)

// ─────────────────────────────────────────────
// LOADING STATE
// ─────────────────────────────────────────────
const LoadingView = ({ analyzing }) => (
  <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#F57D14]/10 text-[#F57D14]">
      <BrainCircuit className="h-10 w-10 animate-pulse" />
    </div>
    <h1 className="text-2xl font-bold text-[#0A2351]">
      {analyzing ? 'Building Your 5-Year Vision...' : 'Loading Your Roadmap...'}
    </h1>
    <p className="mt-2 text-slate-500 max-w-md">
      {analyzing
        ? 'Our AI is analyzing 60 data points to build your custom career transformation roadmap. This takes about 30 seconds.'
        : 'Fetching your results...'}
    </p>
    <div className="mt-8 flex items-center gap-2 text-[#F57D14] font-medium">
      <Loader2 className="h-4 w-4 animate-spin" />
      {analyzing ? 'AI Processing...' : 'Loading...'}
    </div>
  </div>
)

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const ResultDashboardReal = ({ assessmentId, onReady, isPdfMode }) => {
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [locked, setLocked] = useState(false)
  const [assessment, setAssessment] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadResult = async () => {
      if (!assessmentId) {
        setError('No assessment ID found.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/results/${assessmentId}`)
        const data = await response.json()

        if (response.status === 402) {
          setLocked(true)
          setLoading(false)
          return
        }

        if (!response.ok) throw new Error(data?.error || 'Failed to load dashboard')

        const currentAssessment = data?.assessment

        if (hasRealAiAnalysis(currentAssessment?.ai_analysis)) {
          setAssessment(currentAssessment)
          setLoading(false)
        } else {
          setAnalyzing(true)
          const roadmapResponse = await fetch('/api/generate-roadmap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ assessmentId }),
          })

          let roadmapData = {}
          try {
            const text = await roadmapResponse.text()
            roadmapData = JSON.parse(text)
          } catch {
            throw new Error(
              "The AI took too long to respond. Please click 'Retake' to resume."
            )
          }

          if (!roadmapResponse.ok)
            throw new Error(roadmapData?.error || 'AI generation failed')

          setAssessment(roadmapData?.assessment)
          setAnalyzing(false)
          setLoading(false)
        }
      } catch (err) {
        setError(err.message)
        setLoading(false)
        setAnalyzing(false)
      }
    }

    loadResult()
  }, [assessmentId])

  useEffect(() => {
    if (!loading && !analyzing && !error && !locked && assessment) {
      if (onReady) onReady()
    }
  }, [loading, analyzing, error, locked, assessment, onReady])

  // ── Derived data ──────────────────────────────────────────
  const studentName = useMemo(
    () => assessment?.users?.name || assessment?.user?.name || 'Student',
    [assessment]
  )
  const analysis = assessment?.ai_analysis || {}
  const profile = analysis?.psychometric_profile || {}
  const roadmap = analysis?.five_year_roadmap || {}
  const immediateAction = analysis?.immediate_action_plan || {}
  const executiveSummaryParagraphs = parseExecutiveSummary(analysis?.executive_summary)

  const rawScores = analysis?.radar_chart_scores || {}
  const chartData = [
    { subject: 'Personality',  score: Number(rawScores['Personality'])           || 0, fullMark: 100 },
    { subject: 'Aptitude',     score: Number(rawScores['Aptitude'])               || 0, fullMark: 100 },
    { subject: 'Motivation',   score: Number(rawScores['Motivation'])             || 0, fullMark: 100 },
    { subject: 'Interests',    score: Number(rawScores['Career Interests'])       || 0, fullMark: 100 },
    { subject: 'Behaviour',    score: Number(rawScores['Behavioural Tendencies']) || 0, fullMark: 100 },
  ]

  const blindSpots = (analysis?.potential_blind_spots || []).map((spot) => ({
    text: safeText(spot),
    isSevere: safeText(spot)?.toUpperCase().includes('SEVERE'),
  }))

  const roadmapSteps = [
    { label: 'Year 1', title: 'Foundation & Skill Launch',       key: 'year_1', icon: Target,    color: 'bg-blue-600'    },
    { label: 'Year 2', title: 'Skill Application & Execution',   key: 'year_2', icon: BookOpen,  color: 'bg-indigo-500'  },
    { label: 'Year 3', title: 'Market Acceleration',             key: 'year_3', icon: Sparkles,  color: 'bg-[#F57D14]'  },
    { label: 'Year 4', title: 'Strategic Positioning',           key: 'year_4', icon: TrendingUp, color: 'bg-amber-500' },
    { label: 'Year 5', title: 'Leadership & Mastery',            key: 'year_5', icon: Network,   color: 'bg-[#0A2351]'  },
  ].map((s) => ({
    ...s,
    data: roadmap?.[s.key] || roadmap?.[s.label] || roadmap?.[`Year_${s.key.slice(-1)}`],
  })).filter((s) => s.data)

  // ── Guard states ──────────────────────────────────────────
  if (loading || analyzing) return <LoadingView analyzing={analyzing} />

  if (error) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Card className="mx-auto max-w-md border-red-100 bg-red-50 p-8">
          <p className="font-bold text-red-600">{error}</p>
          <Button asChild className="mt-6 bg-[#0A2351]">
            <Link href="/assessment">Retake Assessment</Link>
          </Button>
        </Card>
      </div>
    )
  }

  if (locked) {
    return (
      <div className="container mx-auto py-20 text-center">
        <Card className="mx-auto max-w-lg p-10 shadow-xl">
          <LockKeyhole className="mx-auto h-12 w-12 text-[#F57D14]" />
          <h2 className="mt-6 text-2xl font-bold text-[#0A2351]">Unlock Your Full Roadmap</h2>
          <p className="mt-4 text-slate-600">
            Complete your one-time contribution to access your full 5-year vision and PDF download.
          </p>
          <Button asChild className="mt-8 h-12 w-full bg-[#F57D14] hover:bg-[#dd6f11]">
            <Link href={`/checkout?assessmentId=${assessmentId}`}>Unlock Now</Link>
          </Button>
        </Card>
      </div>
    )
  }

  // ── Main render ───────────────────────────────────────────
  return (
    <main className={isPdfMode ? 'h-max bg-white' : 'min-h-screen bg-slate-50 py-8'}>
      {isPdfMode && (
        <style dangerouslySetInnerHTML={{ __html: `
          .avoid-break { page-break-inside: avoid !important; break-inside: avoid !important; }
        `}} />
      )}

      <div className={`container mx-auto ${isPdfMode ? 'px-0 max-w-none pb-4' : 'space-y-8 px-4 sm:px-6 lg:px-8'}`}>

        {/* ── HERO BANNER ── */}
        <section className={`avoid-break bg-[#0A2351] text-white shadow-2xl shadow-[#0A2351]/20
          ${isPdfMode ? 'rounded-xl p-6 mb-5' : 'rounded-[2rem] p-8 sm:p-12 relative overflow-hidden mb-8'}`}>
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#F57D14]">
              <Sparkles className="h-3 w-3" /> Real-Time AI Analysis
            </div>
            <h1 className={`font-extrabold tracking-tight text-white ${isPdfMode ? 'text-3xl' : 'text-4xl sm:text-5xl'}`}>
              {studentName}, you are a{' '}
              <span className="text-[#F57D14]">{analysis.user_archetype}</span>
            </h1>
            <p className={`text-white/70 leading-relaxed ${isPdfMode ? 'mt-4 text-base' : 'mt-6 text-lg'}`}>
              This transformation strategy was custom-built using your unique psychometric
              signature, mapping your future within the Indian job market.
            </p>
          </div>
          {!isPdfMode && (
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          )}
        </section>

        {/* ── EXECUTIVE SUMMARY ── */}
        <section className="avoid-break">
          <SectionHeading icon={BrainCircuit} title="Strategic Executive Summary" subtitle="How SARATHI interprets your unique behavioral fingerprint." />
          <Card className="border-0 shadow-sm">
            <CardContent className={`text-slate-700 leading-relaxed space-y-4 ${isPdfMode ? 'p-5 text-base' : 'p-8 text-lg'}`}>
              {executiveSummaryParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* ── RADAR CHART + PSYCHOMETRIC DNA ── */}
        <div className={isPdfMode ? 'block' : 'grid gap-6 lg:grid-cols-2'}>

          <section className="avoid-break">
            <SectionHeading icon={Activity} title="Psychometric Dimensions" />
            <Card className="border-0 bg-[#0A2351]/5 shadow-none">
              <CardContent className="p-4">
                <div className="h-[260px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Radar name="Score" dataKey="score" stroke="#F57D14" fill="#F57D14" fillOpacity={0.4} isAnimationActive={false} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                {/* Dimension scores as pills */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {chartData.map((d) => (
                    <div key={d.subject} className="flex items-center gap-1.5 rounded-full bg-white border border-slate-100 px-3 py-1">
                      <span className="text-xs font-bold text-[#0A2351]">{d.subject}</span>
                      <span className="text-xs font-bold text-[#F57D14]">{d.score}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="avoid-break">
            <SectionHeading icon={Compass} title="Psychometric DNA" />
            <Card className="border-0 bg-[#0A2351]/5 shadow-none">
              <CardContent className="p-5 space-y-5">
                {profile.dominant_personality_traits?.length > 0 && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Dominant Personality Traits</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.dominant_personality_traits.map((trait) => (
                        <span key={trait} className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#0A2351] shadow-sm border border-slate-100">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {profile.learning_style && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Preferred Learning Style</label>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600 font-medium italic">{profile.learning_style}</p>
                  </div>
                )}
                {/* NEW: work environment fit */}
                {profile.work_environment_fit && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Ideal Work Environment</label>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{profile.work_environment_fit}</p>
                  </div>
                )}
                {/* NEW: collaboration style */}
                {profile.collaboration_style && (
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Collaboration Style</label>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{profile.collaboration_style}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>

        {/* ── CAREER MATCHES ── */}
        <section className="avoid-break">
          <SectionHeading icon={Target} title="Recommended Career Paths" subtitle="Matched to your specific psychometric scores." />
          <div className={isPdfMode ? 'block space-y-4' : 'grid gap-6 md:grid-cols-3'}>
            {(analysis.top_career_matches || []).map((match, i) => (
              <Card key={i} className={`border-0 shadow-sm border-l-4 border-l-[#F57D14] ${isPdfMode ? 'mb-4' : 'hover:shadow-md transition-all'}`}>
                <CardContent className={isPdfMode ? 'p-4' : 'p-6'}>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Prime Match</p>
                  <h3 className="text-xl font-bold text-[#0A2351] mb-2">{match.career_title}</h3>
                  <p className="text-sm text-slate-500 mb-3">{match.match_reason || match.why_it_fits}</p>
                  {/* NEW: growth path */}
                  {match.growth_path && (
                    <p className="text-xs text-slate-400 mb-3 italic">{match.growth_path}</p>
                  )}
                  <div className="flex items-center gap-2 font-bold text-[#0A2351] text-sm mb-3">
                    <BadgeIndianRupee className="h-4 w-4 text-[#F57D14]" />
                    {match.starting_salary_inr}
                  </div>
                  {/* NEW: key certifications */}
                  {match.key_certifications?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Key Certifications</p>
                      <div className="flex flex-wrap gap-1">
                        {match.key_certifications.map((cert) => (
                          <span key={cert} className="rounded-md bg-[#0A2351]/5 px-2 py-0.5 text-[10px] font-bold text-[#0A2351]">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── GROWTH WARNINGS ── */}
        {blindSpots.length > 0 && (
          <section className="avoid-break">
            <SectionHeading icon={Lightbulb} title="Growth Warnings" subtitle="Specific risks identified in your psychometric profile." />
            <Card className="border-0 bg-orange-50/60 shadow-sm border border-orange-100">
              <CardContent className={isPdfMode ? 'p-4' : 'p-6'}>
                <ul className="space-y-2">
                  {blindSpots.map((spot, i) => (
                    <BlindSpotItem key={i} text={spot.text} isSevere={spot.isSevere} />
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── IMMEDIATE ACTION PLAN ── */}
        {immediateAction?.next_30_days && (
          <section className="avoid-break">
            <SectionHeading icon={Timer} title="Immediate Action Plan" />
            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-600 to-teal-800 text-white">
              <CardContent className={isPdfMode ? 'p-5' : 'p-8'}>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-1">Next 30 Days</p>
                    <p className="text-lg font-bold">{immediateAction.next_30_days}</p>
                  </div>
                  {/* NEW: next_90_days field */}
                  {immediateAction.next_90_days && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-1">Next 90 Days</p>
                      <p className="text-base font-medium text-white/90">{immediateAction.next_90_days}</p>
                    </div>
                  )}
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-sm text-emerald-100">
                      <span className="font-bold text-white">Success Metric: </span>
                      {immediateAction.success_metric}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* ── INDIA VS ABROAD GUIDANCE ── */}
        {/* NEW: renders the new india_vs_abroad_guidance field */}
        {analysis.india_vs_abroad_guidance && (
          <section className="avoid-break">
            <SectionHeading icon={Globe} title="India vs Abroad — Your Path" subtitle="Based on your Q60 response and global ambition score." />
            <Card className="border-0 shadow-sm bg-blue-50/50 border border-blue-100">
              <CardContent className={isPdfMode ? 'p-4' : 'p-6'}>
                <p className="text-sm leading-relaxed text-slate-700">{analysis.india_vs_abroad_guidance}</p>
              </CardContent>
            </Card>
          </section>
        )}

        {isPdfMode && (
          <div className="html2pdf__page-break" style={{ pageBreakBefore: 'always', display: 'block', height: '1px' }} />
        )}

        {/* ── 5-YEAR ROADMAP ── */}
        <section className={isPdfMode ? 'pt-4' : 'mt-4'}>
          <SectionHeading icon={TrendingUp} title="Your 5-Year Career Transformation" subtitle="A milestone-by-milestone plan mapped to your profile." />
          <div className={isPdfMode ? 'block space-y-4' : 'grid gap-6 lg:grid-cols-3'}>
            {roadmapSteps.map((step, i) => (
              <Card key={i} className={`border-0 shadow-lg bg-white overflow-hidden ${isPdfMode ? 'mb-4' : ''}`}>
                <div className={`h-2 w-full ${step.color}`} />
                <CardHeader className={isPdfMode ? 'p-4 pb-2' : ''}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${step.color}`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{step.label}</p>
                      <CardTitle className="text-lg text-[#0A2351]">{step.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className={isPdfMode ? 'p-4 pt-0' : ''}>
                  <p className="text-sm leading-relaxed text-slate-600">{step.data}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}

export default ResultDashboardReal
