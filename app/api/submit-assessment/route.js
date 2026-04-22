import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '../../../lib/supabase'

const EXPECTED_ANSWER_COUNT = 60

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, college, answers } = body

    // ── 1. Input validation ──────────────────────────────────────────
    if (!name || !email || !college) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, college' },
        { status: 400 }
      )
    }

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Answers must be an array' },
        { status: 400 }
      )
    }

    // Critical: ensure all 60 answers are present so Gemini gets
    // correctly aligned question→answer mapping
    if (answers.length !== EXPECTED_ANSWER_COUNT) {
      return NextResponse.json(
        {
          error: `Expected ${EXPECTED_ANSWER_COUNT} answers, received ${answers.length}. Assessment incomplete.`,
        },
        { status: 400 }
      )
    }

    // Ensure no null/undefined slots in the array
    const hasEmptyAnswers = answers.some(
      (a) => a === null || a === undefined || a === ''
    )
    if (hasEmptyAnswers) {
      return NextResponse.json(
        { error: 'All 60 questions must be answered before submitting.' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // ── 2. Upsert user ───────────────────────────────────────────────
    let userId = null

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      userId = existingUser.id

      const { error: updateError } = await supabase
        .from('users')
        .update({ name, college })
        .eq('id', userId)

      if (updateError) {
        console.error('Failed to update user details:', updateError)
      }
    } else {
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{ name, email, college }])
        .select('id')
        .single()

      if (userError) {
        return NextResponse.json(
          { error: 'Failed to create user', details: userError.message },
          { status: 500 }
        )
      }
      userId = newUser.id
    }

    // ── 3. Duplicate assessment guard ────────────────────────────────
    // If the student already has a completed + paid assessment,
    // return the existing one instead of creating a duplicate
    const { data: existingAssessment } = await supabase
      .from('assessments')
      .select('id, ai_analysis_result')
      .eq('user_id', userId)
      .eq('payment_status', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (existingAssessment) {
      // Student is re-submitting — update their answers but keep the same row
      const { error: updateError } = await supabase
        .from('assessments')
        .update({
          raw_answers: answers,
          ai_analysis_result: null, // Clear old AI result so it regenerates
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingAssessment.id)

      if (updateError) {
        console.error('Failed to update existing assessment:', updateError)
        return NextResponse.json(
          { error: 'Failed to update assessment', details: updateError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({ assessmentId: existingAssessment.id })
    }

    // ── 4. Create new assessment ─────────────────────────────────────
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert([
        {
          user_id: userId,
          raw_answers: answers,
          payment_status: true, // TODO: wire to real payment before go-live
        },
      ])
      .select('id')
      .single()

    if (assessmentError) {
      return NextResponse.json(
        { error: 'Failed to save assessment', details: assessmentError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ assessmentId: assessment.id })

  } catch (error) {
    console.error('Submit Assessment Error:', error)
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    )
  }
}
