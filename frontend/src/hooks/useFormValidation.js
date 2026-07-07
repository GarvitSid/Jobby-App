import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

/**
 * Simple wrapper hook to create a react-hook-form instance wired to a Zod schema.
 * @param {object} schema - Zod schema
 * @param {object} options - options passed to useForm (e.g., defaultValues)
 */
export default function useFormValidation(schema, options = {}) {
  return useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    ...options,
  })
}
