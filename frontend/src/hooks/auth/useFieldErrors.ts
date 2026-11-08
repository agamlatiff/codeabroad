import { useCallback, useState } from 'react'

/**
 * Shared field-level error state for auth forms.
 */
export const useFieldErrors = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: message }))
  }, [])

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  return { fieldErrors, setFieldErrors, setFieldError, clearFieldError }
}

