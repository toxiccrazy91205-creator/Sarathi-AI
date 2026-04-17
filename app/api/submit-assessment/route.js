const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert([{
        user_id: userId,
        raw_answers: answers, 
        payment_status: true
      }])
