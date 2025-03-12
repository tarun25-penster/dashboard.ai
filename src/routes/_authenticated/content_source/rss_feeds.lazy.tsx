import { createLazyFileRoute } from '@tanstack/react-router'
import RSSFeedsPage from '@/features/content_source/pages/rssfeed'

export const Route = createLazyFileRoute(
  '/_authenticated/content_source/rss_feeds',
)({
  component: RSSFeedsPage,
})

