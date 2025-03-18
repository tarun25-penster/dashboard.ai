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

interface GoogleSheetSource {
  id: number
  name: string
  sheetId: string
}

export default function GoogleSheetsPage() {
  const [sourceName, setSourceName] = useState('')
  const [sheetId, setSheetId] = useState('')
  const [sheetSources, setSheetSources] = useState<GoogleSheetSource[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSources = localStorage.getItem('googleSheetSources')
    if (savedSources) {
      setSheetSources(JSON.parse(savedSources))
    }
  }, [])

  // Save data to localStorage whenever sheetSources changes
  useEffect(() => {
    if (sheetSources.length > 0) {
      localStorage.setItem('googleSheetSources', JSON.stringify(sheetSources))
    }
  }, [sheetSources])

  const handleSave = () => {
    if (sourceName && sheetId) {
      if (editingId !== null) {
        // Update existing source
        setSheetSources((prev) =>
          prev.map((source) =>
            source.id === editingId
              ? { ...source, name: sourceName, sheetId }
              : source
          )
        )
      } else {
        // Add new source
        const newSource: GoogleSheetSource = {
          id: Date.now(),
          name: sourceName,
          sheetId,
        }
        setSheetSources([...sheetSources, newSource])
      }
      resetForm()
    }
  }

  const handleEdit = (id: number) => {
    const sourceToEdit = sheetSources.find((source) => source.id === id)
    if (sourceToEdit) {
      setSourceName(sourceToEdit.name)
      setSheetId(sourceToEdit.sheetId)
      setEditingId(id)
      setIsDialogOpen(true) // Open modal when editing
    }
  }

  const handleDelete = (id: number) => {
    const updatedSources = sheetSources.filter((source) => source.id !== id)
    setSheetSources(updatedSources)
    localStorage.setItem('googleSheetSources', JSON.stringify(updatedSources))
  }

  const resetForm = () => {
    setSourceName('')
    setSheetId('')
    setEditingId(null)
    setIsDialogOpen(false)
  }

  const filteredSources = sheetSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageLayout title='Google Sheets Data'>
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

        {/* Add Source Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className='rounded-lg bg-black px-4 py-2 text-white'
              onClick={resetForm}
            >
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId !== null ? 'Edit Google Sheet' : 'Add Google Sheet'}
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <Input
                type='text'
                placeholder='Name of the sheet'
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
                autoFocus
              />
              <Input
                type='text'
                placeholder='Google Sheet ID'
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
              />
              <Button onClick={handleSave} disabled={!sourceName || !sheetId}>
                {editingId !== null ? 'Update' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Display Saved Sheets */}
      <div className='mt-6 space-y-2'>
        {filteredSources.length > 0 ? (
          filteredSources.map((source) => (
            <div
              key={source.id}
              className='flex items-center justify-between rounded-lg border p-4 shadow-sm'
            >
              <div>
                <p className='text-lg font-semibold'>{source.name}</p>
                <p>
                  📄 Sheet ID:{' '}
                  <a
                    href={`https://docs.google.com/spreadsheets/d/${source.sheetId}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    {source.sheetId}
                  </a>
                </p>
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
          <p className='text-gray-500'>No Google Sheets found.</p>
        )}
      </div>
    </PageLayout>
  )
}
