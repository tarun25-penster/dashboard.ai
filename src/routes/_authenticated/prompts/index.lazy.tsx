import { createLazyFileRoute } from '@tanstack/react-router'
import prompts from '@/features/prompts'

export const Route = createLazyFileRoute('/_authenticated/prompts/')({
  component: prompts,
})
