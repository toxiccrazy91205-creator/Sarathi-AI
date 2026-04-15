import { NextResponse } from 'next/server'

import { getSupabaseAdmin } from '../../../lib/supabase'
import { assessmentQuestions } from '../../../lib/psychometric-assessment'

export const runtime = 'nodejs'

const SYSTEM_PROMPT = `You are an expert Career Counselor for the SARATHI App, specializing in the Indian job market. 
Analyze the provided user answers to a 6-part psychometric assessment.
Output a highly personalized, structured JSON response with exactly this format:
{
  "user_archetype": "A catchy 2-3 word title",
  "executive_summary": "3-paragraph summary of core strengths, work style, and primary motivations",
  "psychometric_profile": {
    "dominant_personality_traits": ["Trait 1", "Trait 2"],
    "core_motivators": ["Motivator 1", "Motivator 2"],
    "learning_style": "How they best absorb information"
  },
  "top_career_matches": [
    {
      "career_title": "Specific Role",
      "why_it_fits": "2 sentences explaining the match",
      "starting_salary_inr": "Realistic range in INR (e.g., ₹6L - ₹12L PA)",
      "growth_potential": "High/Medium/Low"
    }
  ],
  "one_year_roadmap": {
    "q1_focus": "Skills to learn",
    "q2_focus": "Projects to build",
    "q3_focus": "Networking/internships",
    "q4_focus": "Application prep"
  },
  "potential_blind_spots": ["Constructive feedback on areas they might struggle"]
}`

const assessmentSelect = '*, users(id, email, name, college, created_at)'

const jsonResponse = (payload, status = 200) => {
  const response = NextResponse.json(payload, { status })
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

const hasRealAiAnalysis = (analysis) => {
  return Boolean(
    analysis?.user_archetype &&
      typeof analysis?.executive_summary === 'string' &&
      Array.isArray(analysis?.top_career_matches)
  )
}

const normalizeAssessment = (row) => {
  const user = row?.users || row?.user || null
  const answers = row?.raw_answers || row?.answers_json || {}
  const aiAnalysis = row?.ai_analysis_result || row?.ai_analysis || null

  return {
    id: row?.id,
    user_id: row?.user_id,
    payment_status: row?.payment_status,
    created_at: row?.created_at,
    answers_json: answers,
    ai_analysis: aiAnalysis,
    user,
  }
}

const buildAssessmentContext = (row) => {
  const answers = row?.raw_answers || row?.answers_json || {}

  return assessmentQuestions.map((question) => {
    const selectedValue = answers?.[question.id] || null
    const selectedOption = question.options?.find((option) => option.value === selectedValue)

    return {
      question_id: question.id,
      question_number: question.question_number,
      section: question.section_title,
      question: question.question,
      question_description: question.section_description,
      response_type: question.input_type,
      selected_option_value: question.input_type === 'choice' ? selectedValue : null,
      selected_option_label: question.input_type === 'choice' ? selectedOption?.label || null : null,
      response_text: question.input_type === 'text' ? selectedValue : null,
      all_options: (question.options || []).map((option) => ({
        value: option.value,
        label: option.label,
      })),
    }
  })
}

const buildUserPrompt = (payload) => {
  return (
    'Assessment context for SARATHI:\n' +
    JSON.stringify(
      {
        student_profile: payload?.student_profile || {},
        assessment_context: payload?.assessment_context || [],
      },
      null,
      2
    ) +
    '\n\nReturn only valid JSON matching the required structure.'
  )
}

const extractJson = (rawText) => {
  const text = String(rawText || '').trim()

  if (!text) {
    throw new Error('Empty AI response received')
  }

  let cleaned = text

  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/, '').trim()
  }

  try {
    return JSON.parse(cleaned)
  } catch {
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')

    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1))
    }

    throw new Error(`Unable to parse AI JSON: ${cleaned}`)
  }
}

const getEmergentResponseText = async (payload) => {
  const response = await fetch('https://integrations.emergentagent.com/llm/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.EMERGENT_LLM_KEY}`,
    },
    body: JSON.stringify({
      model: 'gemini/gemini-2.5-pro',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: buildUserPrompt(payload),
        },
      ],
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data?.error?.message || data?.error || 'Emergent AI request failed')
  }

  const content = data?.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('Emergent AI returned an empty response')
  }

  return content
}

const getGeminiResponseText = async (payload) => {
  // Switching to Gemini 2.5 Flash - the most reliable model for 2026
  const modelName = 'gemini-2.5-flash'; 
  const apiURL = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ 
          text: `${SYSTEM_PROMPT}\n\nIMPORTANT: Return the response strictly as a valid JSON object.\n\nStudent Assessment Data:\n${buildUserPrompt(payload)}` 
        }]
      }],
      generationConfig: {
        temperature: 0.7
      }
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Gemini API failed');
  }

  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!content) {
    throw new Error('AI returned an empty roadmap');
  }

  return content;
};
const generateRoadmapRaw = async (payload) => {
  if (process.env.EMERGENT_LLM_KEY) {
    return extractJson(await getEmergentResponseText(payload))
  }

  if (process.env.GEMINI_API_KEY) {
    return extractJson(await getGeminiResponseText(payload))
  }

  throw new Error('Missing EMERGENT_LLM_KEY or GEMINI_API_KEY')
}

const toStringValue = (value, fallback = '') => {
  if (typeof value === 'string') {
    return value.trim() || fallback
  }

  if (value === null || value === undefined) {
    return fallback
  }

  return String(value)
}

const toStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => toStringValue(item)).filter(Boolean)
  }

  const singleValue = toStringValue(value)
  return singleValue ? [singleValue] : []
}

const normalizeAiPayload = (analysis) => {
  if (!analysis || typeof analysis !== 'object') {
    return null
  }

  const profile = analysis?.psychometric_profile || {}
  const roadmap = analysis?.one_year_roadmap || analysis?.roadmap || {}
  const rawCareerMatches = Array.isArray(analysis?.top_career_matches)
    ? analysis.top_career_matches
    : analysis?.top_career_matches
      ? [analysis.top_career_matches]
      : []

  const normalizedCareerMatches = rawCareerMatches
    .map((item) => ({
      career_title: toStringValue(item?.career_title || item?.title),
      why_it_fits: toStringValue(item?.why_it_fits || item?.why),
      starting_salary_inr: toStringValue(item?.starting_salary_inr || item?.salary_range),
      growth_potential: toStringValue(item?.growth_potential),
    }))
    .filter((item) => item.career_title && item.why_it_fits)

  return {
    user_archetype: toStringValue(analysis?.user_archetype),
    executive_summary: toStringValue(analysis?.executive_summary || analysis?.summary),
    psychometric_profile: {
      dominant_personality_traits: toStringArray(profile?.dominant_personality_traits),
      core_motivators: toStringArray(profile?.core_motivators),
      learning_style: toStringValue(profile?.learning_style),
    },
    top_career_matches: normalizedCareerMatches,
    one_year_roadmap: {
      q1_focus: toStringValue(roadmap?.q1_focus || roadmap?.q1),
      q2_focus: toStringValue(roadmap?.q2_focus || roadmap?.q2),
      q3_focus: toStringValue(roadmap?.q3_focus || roadmap?.q3),
      q4_focus: toStringValue(roadmap?.q4_focus || roadmap?.q4),
    },
    potential_blind_spots: toStringArray(analysis?.potential_blind_spots),
  }
}

const validateAiPayload = (analysis) => {
  if (!analysis || typeof analysis !== 'object') {
    return false
  }

  return Boolean(
    analysis.user_archetype &&
      analysis.executive_summary &&
      analysis.psychometric_profile?.learning_style &&
      analysis.top_career_matches?.length &&
      analysis.one_year_roadmap?.q1_focus &&
      analysis.one_year_roadmap?.q2_focus &&
      analysis.one_year_roadmap?.q3_focus &&
      analysis.one_year_roadmap?.q4_focus &&
      analysis.potential_blind_spots?.length
  )
}

const generateValidatedRoadmap = async (payload) => {
  let lastResponse = null

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const rawResponse = await generateRoadmapRaw(payload)
    const normalizedResponse = normalizeAiPayload(rawResponse)
    lastResponse = normalizedResponse || rawResponse

    if (validateAiPayload(normalizedResponse)) {
      return normalizedResponse
    }
  }

  throw new Error(`AI returned an unexpected JSON structure: ${JSON.stringify(lastResponse)}`)
}

const updateAnalysisRecord = async (supabase, assessmentId, aiAnalysis) => {
  let result = await supabase
    .from('assessments')
    .update({ ai_analysis_result: aiAnalysis })
    .eq('id', assessmentId)
    .select(assessmentSelect)
    .single()

  if (result?.error?.message?.includes('ai_analysis_result')) {
    result = await supabase
      .from('assessments')
      .update({ ai_analysis: aiAnalysis })
      .eq('id', assessmentId)
      .select(assessmentSelect)
      .single()
  }

  return result
}

export async function OPTIONS() {
  return jsonResponse({ ok: true })
}

export async function POST(request) {
  try {
    const body = await request.json()
    const assessmentId = body?.assessmentId
    const force = Boolean(body?.force)

    if (!assessmentId) {
      return jsonResponse({ error: 'assessmentId is required' }, 400)
    }

    if (!process.env.EMERGENT_LLM_KEY && !process.env.GEMINI_API_KEY) {
      return jsonResponse({ error: 'Missing EMERGENT_LLM_KEY or GEMINI_API_KEY' }, 500)
    }

    const supabase = getSupabaseAdmin()
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select(assessmentSelect)
      .eq('id', assessmentId)
      .single()

    if (assessmentError) {
      const status = assessmentError?.code === 'PGRST116' ? 404 : 500
      return jsonResponse({ error: 'Unable to load assessment for AI analysis', details: assessmentError.message }, status)
    }

    if (!assessment?.payment_status) {
      return jsonResponse({ error: 'Payment required before generating the roadmap' }, 402)
    }

    const normalized = normalizeAssessment(assessment)
    const existingAnalysis = normalized?.ai_analysis

    if (!force && hasRealAiAnalysis(existingAnalysis)) {
      return jsonResponse({ ok: true, assessment: normalized, cached: true })
    }

    if (!normalized?.answers_json || Object.keys(normalized.answers_json).length === 0) {
      return jsonResponse({ error: 'No assessment answers found for this record' }, 400)
    }

    const aiAnalysis = await generateValidatedRoadmap({
      session_id: `sarathi-roadmap-${assessment.id}`,
      assessment_id: assessment.id,
      student_profile: {
        name: normalized?.user?.name || 'Student',
        email: normalized?.user?.email || '',
        college: normalized?.user?.college || '',
      },
      assessment_context: buildAssessmentContext(assessment),
    })

    const { data: updatedAssessment, error: updateError } = await updateAnalysisRecord(
      supabase,
      assessmentId,
      aiAnalysis
    )

    if (updateError) {
      return jsonResponse({ error: 'Unable to save AI roadmap', details: updateError.message }, 500)
    }

    return jsonResponse({
      ok: true,
      assessment: normalizeAssessment(updatedAssessment),
      cached: false,
    })
  } catch (error) {
    console.error('Generate roadmap API error:', error)
    return jsonResponse({ error: 'Unable to generate AI roadmap', details: error?.message || 'Unknown error' }, 500)
  }
}
