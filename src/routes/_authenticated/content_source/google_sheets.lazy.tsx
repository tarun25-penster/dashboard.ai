import { createLazyFileRoute } from '@tanstack/react-router'
import GoogleSheetsPage from '@/features/content_source/pages/googlesheets'

export const Route = createLazyFileRoute(
  '/_authenticated/content_source/google_sheets'
)({
  component: GoogleSheetsPage,
})
