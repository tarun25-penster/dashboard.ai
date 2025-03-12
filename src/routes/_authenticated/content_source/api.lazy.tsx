import { createLazyFileRoute } from '@tanstack/react-router'
import APIPage from '@/features/content_source/pages/api'

export const Route = createLazyFileRoute('/_authenticated/content_source/api')({
  component: APIPage,
})
