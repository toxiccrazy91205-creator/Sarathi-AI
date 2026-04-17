import { NextResponse } from 'next/server'
// 🚀 Reusing the existing Supabase connection you already have
import { getSupabaseAdmin } from '../../../lib/supabase'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, whatsapp, college, answers } = body
    const supabase = getSupabaseAdmin()

    // 1. Save the student to your 'users' table
    // (We add a temporary email format just in case your database requires an email column)
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{ 
        name: name, 
        college: college, 
        email: `${whatsapp}@temp-sarathi.com` 
      }])
      .select('id')
      .single()

    const userId = user ? user.id : null

    // 2. Save the 60 answers into the 'assessments' table
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert([{
        user_id: userId,
        answers_json: answers,
        payment_status: true // 🔓 Bypassing the ₹99 paywall for your presentation
      }])
      .select('id')
      .single()

    if (assessmentError) {
      throw assessmentError
    }

    // 3. Return the new Assessment ID back to the frontend
    return NextResponse.json({ assessmentId: assessment.id })

  } catch (error) {
    console.error('Submit Assessment Error:', error)
    return NextResponse.json({ error: 'Failed to save assessment data' }, { status: 500 })
  }
}
