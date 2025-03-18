import { useState, useEffect } from 'react'
import { Search, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import PageLayout from '@/components/layout/PageLayout'

interface PdfFile {
  name: string
  url: string
}

export default function PDFPage() {
  const [fileName, setFileName] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfList, setPdfList] = useState<PdfFile[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Load PDFs from localStorage on mount
  useEffect(() => {
    const savedPdfs = localStorage.getItem('pdfFiles')
    if (savedPdfs) {
      setPdfList(JSON.parse(savedPdfs))
    }
  }, [])

  // Save PDFs to localStorage
  const saveToLocalStorage = (pdfs: PdfFile[]) => {
    localStorage.setItem('pdfFiles', JSON.stringify(pdfs))
  }

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setPdfFile(event.target.files[0])
    }
  }

  // Handle save (add or edit)
  const handleSave = () => {
    if (!fileName || !pdfFile) return

    let updatedPdfs
    if (editIndex !== null) {
      // Editing an existing PDF
      updatedPdfs = [...pdfList]
      updatedPdfs[editIndex] = {
        name: fileName,
        url: URL.createObjectURL(pdfFile),
      }
      setEditIndex(null) // Reset edit mode
    } else {
      // Adding a new PDF
      const newPdf: PdfFile = {
        name: fileName,
        url: URL.createObjectURL(pdfFile),
      }
      updatedPdfs = [...pdfList, newPdf]
    }

    setPdfList(updatedPdfs)
    saveToLocalStorage(updatedPdfs) // Save changes to localStorage

    // Reset input fields
    setFileName('')
    setPdfFile(null)
    setIsDialogOpen(false)
  }

  // Handle edit
  const handleEdit = (index: number) => {
    setFileName(pdfList[index].name) // Set current name in input
    setEditIndex(index)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (index: number) => {
    const updatedPdfs = pdfList.filter((_, i) => i !== index)
    setPdfList(updatedPdfs)
    saveToLocalStorage(updatedPdfs) // Save changes to localStorage
  }

  // Filter PDFs based on search query
  const filteredPdfs = pdfList.filter((pdf) =>
    pdf.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageLayout title='PDF Management'>
      <div className='mb-6 flex items-center justify-between'>
        {/* Search Bar */}
        <div className='relative w-64'>
          <Search className='absolute left-3 top-2.5 text-gray-500' size={18} />
          <Input
            type='text'
            placeholder='Search PDFs'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='rounded-lg border py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Add/Edit Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='rounded-lg bg-black px-4 py-2 text-white'>
              {editIndex !== null ? 'Edit PDF' : 'Add PDF'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editIndex !== null ? 'Edit PDF' : 'Upload PDF'}
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <Input
                type='text'
                placeholder='Name of the file'
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
              <Input
                type='file'
                accept='application/pdf'
                onChange={handleFileChange}
              />
              <Button onClick={handleSave} disabled={!fileName || !pdfFile}>
                {editIndex !== null ? 'Update' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* List of PDFs */}
      <div className='mt-6 space-y-2'>
        {filteredPdfs.length > 0 ? (
          filteredPdfs.map((pdf, index) => (
            <div
              key={index}
              className='flex items-center justify-between rounded-lg border p-4 shadow-sm'
            >
              <p className='text-lg'>{pdf.name}</p>
              <div className='flex gap-2'>
                <a
                  href={pdf.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 underline'
                >
                  View PDF
                </a>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleEdit(index)}
                >
                  <Edit size={16} className='mr-1' /> Edit
                </Button>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => handleDelete(index)}
                >
                  <Trash2 size={16} className='mr-1' /> Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No PDFs found.</p>
        )}
      </div>
    </PageLayout>
  )
}
