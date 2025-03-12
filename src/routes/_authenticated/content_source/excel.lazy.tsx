import { createLazyFileRoute } from '@tanstack/react-router'
import ExcelPage from '@/features/content_source/pages/excel'

export const Route = createLazyFileRoute(
  '/_authenticated/content_source/excel'
)({
  component: ExcelPage,
})
