import { assessmentQuestions } from '@/lib/psychometric-assessment'

export const ASSESSMENT_SESSION_STORAGE_KEY = 'sarathi-assessment-session-v1'

export const buildDefaultAssessmentValues = () => ({
  name: '',
  email: '',
  college: '',
  ...Object.fromEntries(assessmentQuestions.map((question) => [question.id, ''])),
})

const sanitizeAssessmentValues = (values = {}) => {
  const defaultValues = buildDefaultAssessmentValues()

  return Object.fromEntries(
    Object.entries(defaultValues).map(([key, fallbackValue]) => {
      const rawValue = values?.[key]
      return [key, typeof rawValue === 'string' ? rawValue : fallbackValue]
    })
  )
}

export const readAssessmentSession = () => {
  const emptySession = {
    currentStep: 0,
    values: buildDefaultAssessmentValues(),
  }

  if (typeof window === 'undefined') {
    return emptySession
  }

  try {
    const rawSession = window.localStorage.getItem(ASSESSMENT_SESSION_STORAGE_KEY)

    if (!rawSession) {
      return emptySession
    }

    const parsedSession = JSON.parse(rawSession)

    return {
      currentStep: Number.isFinite(parsedSession?.currentStep) ? Math.max(0, parsedSession.currentStep) : 0,
      values: sanitizeAssessmentValues(parsedSession?.values),
    }
  } catch (error) {
    console.error('Unable to read assessment session from localStorage:', error)
    return emptySession
  }
}

export const writeAssessmentSession = ({ currentStep = 0, values = {} }) => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(
      ASSESSMENT_SESSION_STORAGE_KEY,
      JSON.stringify({
        currentStep: Math.max(0, Number(currentStep) || 0),
        values: sanitizeAssessmentValues(values),
        updatedAt: new Date().toISOString(),
      })
    )
  } catch (error) {
    console.error('Unable to persist assessment session to localStorage:', error)
  }
}

export const clearAssessmentSession = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(ASSESSMENT_SESSION_STORAGE_KEY)
}
