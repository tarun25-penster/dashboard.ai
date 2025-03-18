import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import ContentSourceForm from '@/components/forms/ContentSourceForm'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

interface DataSource {
  id: number
  name: string
 description: string;
}

const initialDataSources: DataSource[] = [
  { id: 1, name: 'PDF', description: 'Manage PDF Files' },
  { id: 2, name: 'Excel', description: 'Manage Excel Sheets' },
  { id: 3, name: 'Google Sheets', description: 'Manage Google Sheets' },
  { id: 4, name: 'Reddit', description: 'Fetch Reddit Data' },
  { id: 5, name: 'API', description: 'Manage API Data' },
  { id: 6, name: 'RSS Feeds', description: 'Manage RSS Feeds' },
]

export default function ContentSource() {
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<DataSource | null>(null)
  const [editedName, setEditedName] = useState('')
  const [editedDescription, setEditedDescription] = useState('')
  const [dataSources, setDataSources] = useState(initialDataSources)
  const router = useRouter()

  // Navigate to a specific content source page
  const handleNavigate = (source: DataSource) => {
    router.navigate({
      to: `/content_source/${source.name.toLowerCase().replace(/\s+/g, '_')}`,
      search: { name: source.name, description: source.description }, // Pass data
    })
  }

  // Open edit modal
  const handleEdit = (card: DataSource, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedCard(card)
    setEditedName(card.name)
    setEditedDescription(card.description)
    setEditOpen(true)
  }

  // Save changes from edit modal
  const handleSave = () => {
    if (selectedCard) {
      setDataSources((prev) =>
        prev.map((item) =>
          item.id === selectedCard.id
            ? { ...item, name: editedName, description: editedDescription }
            : item
        )
      )
    }
    setEditOpen(false)
    setSelectedCard(null)
  }

  // Handle adding a new content source
  const handleAddSource = (newSource: {
    name: string
    description: string
  }) => {
    const newId = dataSources.length + 1
    const newItem: DataSource = {
      id: newId,
      name: newSource.name,
      description: newSource.description,
    }

    setDataSources((prev) => [...prev, newItem])
    setOpen(false)

    // Navigate to the newly created source's page
    router.navigate({
      to: `/content_source/${newSource.name.toLowerCase().replace(/\s+/g, '_')}`,
    })
  }

  return (
    <>
      {/* Header */}
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* Page Title & Add Button */}
      <Main>
        <div className='mb-4 flex flex-wrap items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Content Sources
            </h2>
            <p className='text-muted-foreground'>
              Manage your content sources here.
            </p>
          </div>
          <Button onClick={() => setOpen(true)}>Add Source</Button>
        </div>
      </Main>

      {/* Content Source Cards */}
      <div className='mt-16 grid grid-cols-3 gap-4 p-6'>
        {dataSources.map((source) => (
          <Card
            key={source.id}
            className='relative cursor-pointer p-4 hover:shadow-lg'
            onClick={() => handleNavigate(source)}
          >
            <CardHeader>
              <CardTitle>{source.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{source.description}</p>
            </CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='absolute right-2 top-2'
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={(e) => handleEdit(source, e)}>
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Card>
        ))}
      </div>

      {/* Add Source Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Content Source</DialogTitle>
          </DialogHeader>
          <ContentSourceForm onAddSource={handleAddSource} />
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {selectedCard?.name}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder='Enter new name'
            />
            <Input
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder='Enter new description'
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant='default' onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
