import { createLazyFileRoute } from '@tanstack/react-router'
import PDFPage from '@/features/content_source/pages/pdf'

export const Route = createLazyFileRoute('/_authenticated/content_source/pdf')({
  component: PDFPage,
})


