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

interface RedditSource {
  name: string
  source_type: string
  config: {
    subreddit: string
    limit: number
  }
  secrets: {
    client_id: string
    client_secret: string
  }
}

export default function RedditPage() {
  const [sourceName, setSourceName] = useState('')
  const [subreddit, setSubreddit] = useState('')
  const [limit, setLimit] = useState(1)
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [redditSources, setRedditSources] = useState<RedditSource[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Load sources from localStorage on mount
  useEffect(() => {
    const savedSources = localStorage.getItem('redditSources')
    if (savedSources) {
      setRedditSources(JSON.parse(savedSources))
    }
  }, [])

  // Save sources to localStorage
  const saveToLocalStorage = (sources: RedditSource[]) => {
    localStorage.setItem('redditSources', JSON.stringify(sources))
  }

  // Handle save (add or edit)
  const handleSave = () => {
    if (!sourceName || !subreddit || !clientId || !clientSecret) return

    let updatedSources
    if (editIndex !== null) {
      // Edit existing source
      updatedSources = [...redditSources]
      updatedSources[editIndex] = {
        name: sourceName,
        source_type: 'reddit',
        config: { subreddit, limit },
        secrets: { client_id: clientId, client_secret: clientSecret },
      }
      setEditIndex(null)
    } else {
      // Add new source
      const newSource: RedditSource = {
        name: sourceName,
        source_type: 'reddit',
        config: { subreddit, limit },
        secrets: { client_id: clientId, client_secret: clientSecret },
      }
      updatedSources = [...redditSources, newSource]
    }

    setRedditSources(updatedSources)
    saveToLocalStorage(updatedSources)

    // Reset fields
    setSourceName('')
    setSubreddit('')
    setLimit(1)
    setClientId('')
    setClientSecret('')
    setIsDialogOpen(false)
  }

  // Handle edit
  const handleEdit = (index: number) => {
    const source = redditSources[index]
    setSourceName(source.name)
    setSubreddit(source.config.subreddit)
    setLimit(source.config.limit)
    setClientId(source.secrets.client_id)
    setClientSecret(source.secrets.client_secret)
    setEditIndex(index)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (index: number) => {
    const updatedSources = redditSources.filter((_, i) => i !== index)
    setRedditSources(updatedSources)
    saveToLocalStorage(updatedSources)
  }

  // Filter sources by search query
  const filteredSources = redditSources.filter((source) =>
    source.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageLayout title='Reddit Data'>
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

        {/* Add/Edit Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='rounded-lg bg-black px-4 py-2 text-white'>
              {editIndex !== null ? 'Edit Source' : 'Add Source'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editIndex !== null
                  ? 'Edit Reddit Source'
                  : 'Add Reddit Source'}
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <Input
                type='text'
                placeholder='Name of the source'
                value={sourceName}
                onChange={(e) => setSourceName(e.target.value)}
              />
              <Input
                type='text'
                placeholder='Subreddit name'
                value={subreddit}
                onChange={(e) => setSubreddit(e.target.value)}
              />
              <Input
                type='number'
                placeholder='Limit'
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              />
              <Input
                type='text'
                placeholder='Client ID'
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
              <Input
                type='text'
                placeholder='Client Secret'
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
              <Button
                onClick={handleSave}
                disabled={
                  !sourceName || !subreddit || !clientId || !clientSecret
                }
              >
                {editIndex !== null ? 'Update' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Display Added Sources */}
      <div className='mt-6 space-y-2'>
        {filteredSources.length > 0 ? (
          filteredSources.map((source, index) => (
            <div
              key={index}
              className='flex items-center justify-between rounded-lg border p-4 shadow-sm'
            >
              <div>
                <p className='text-lg font-semibold'>{source.name}</p>
                <p>
                  🔗 Subreddit:{' '}
                  <span className='text-blue-500'>
                    r/{source.config.subreddit}
                  </span>
                </p>
                <p>📌 Limit: {source.config.limit}</p>
                <p className='text-gray-500'>
                  Client ID: {source.secrets.client_id}
                </p>
                <p className='text-gray-500'>
                  Client Secret: {source.secrets.client_secret}
                </p>
              </div>
              <div className='flex gap-2'>
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
          <p className='text-gray-500'>No Reddit sources found.</p>
        )}
      </div>
    </PageLayout>
  )
}
