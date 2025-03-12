import { createLazyFileRoute } from '@tanstack/react-router'
import ContentSource from '@/features/content_source'

export const Route = createLazyFileRoute('/_authenticated/content_source/')({
  component: ContentSource,
})
