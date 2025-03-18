import { useEffect, useState } from 'react'
import { Search, Pencil, Trash2 } from 'lucide-react'
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

interface ExcelSource {
  id: number
  name: string
  fileName: string
}

export default function ExcelPage() {
  const [sourceName, setSourceName] = useState('')
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [excelSources, setExcelSources] = useState<ExcelSource[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedSources = localStorage.getItem('excelSources')
    if (savedSources) {
      setExcelSources(JSON.parse(savedSources))
    }
  }, [])

  // Save to localStorage whenever excelSources changes
  useEffect(() => {
    localStorage.setItem('excelSources', JSON.stringify(excelSources))
  }, [excelSources])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setExcelFile(event.target.files[0])
    }
  }

  const handleSave = () => {
    if (sourceName && excelFile) {
      if (editingId !== null) {
        // Update existing source
        setExcelSources((prev) =>
          prev.map((source) =>
            source.id === editingId
              ? { ...source, name: sourceName, fileName: excelFile.name }
              : source
          )
        )
      } else {
        // Add new source
        const newSource: ExcelSource = {
          id: Date.now(),
          name: sourceName,
          fileName: excelFile.name,
        }
        setExcelSources([...excelSources, newSource])
      }
      resetForm()
    }
  }

  const handleEdit = (id: number) => {
    const sourceToEdit = excelSources.find((source) => source.id === id)
    if (sourceToEdit) {
      setSourceName(sourceToEdit.name)
      setExcelFile(null)
      setEditingId(id)
      setIsDialogOpen(true) // Open dialog when editing
    }
  }

  const handleDelete = (id: number) => {
    setExcelSources(excelSources.filter((source) => source.id !== id))
  }

  const resetForm = () => {
    setSourceName('')
    setExcelFile(null)
    setEditingId(null)
    setIsDialogOpen(false)
  }

  const filteredSources = excelSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageLayout title='Excel Data'>
      <div className='mb-6 flex items-center justify-between'>
        {/* Search Bar */}
        <div className='relative w-64'>
          <Search className='absolute left-3 top-2.5 text-gray-500' size={18} />
          <Input
            type='text'
            placeholder='Search Sources'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='rounded-lg border py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Always Show "Add Source" Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className='rounded-lg bg-black px-4 py-2 text-white'
              onClick={() => resetForm()} // Reset form when adding new source
            >
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId !== null ? 'Edit Excel File' : 'Upload Excel File'}
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <Input
                type='text'
                placeholder='Name of the file'
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
              />
              <Input
                type='file'
                accept='.xls,.xlsx'
                onChange={handleFileChange}
              />
              <Button
                onClick={handleSave}
                disabled={!sourceName || (!excelFile && editingId === null)}
              >
                {editingId !== null ? 'Update' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Display Added Sources */}
      <div className='mt-6 space-y-2'>
        {filteredSources.length > 0 ? (
          filteredSources.map((source) => (
            <div
              key={source.id}
              className='flex items-center justify-between rounded-lg border p-4 shadow-sm'
            >
              <div>
                <p className='text-lg font-semibold'>{source.name}</p>
                <p>📂 File: {source.fileName}</p>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleEdit(source.id)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant='destructive'
                  size='icon'
                  onClick={() => handleDelete(source.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No Excel sources found.</p>
        )}
      </div>
    </PageLayout>
  )
}
