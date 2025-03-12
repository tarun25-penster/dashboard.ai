import { createLazyFileRoute } from '@tanstack/react-router'
import Demo from '@/features/demo'

export const Route = createLazyFileRoute('/_authenticated/demo/')({
  component: Demo,
})

