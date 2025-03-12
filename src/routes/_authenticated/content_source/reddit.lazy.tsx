import { createLazyFileRoute } from '@tanstack/react-router'
import RedditPage from '@/features/content_source/pages/reddit'

export const Route = createLazyFileRoute(
  '/_authenticated/content_source/reddit'
)({
  component: RedditPage,
})
