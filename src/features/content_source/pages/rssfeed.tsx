import { useState, useEffect } from 'react'
import { Link, Edit, Trash2 } from 'lucide-react'
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

interface RssSource {
  name: string
  source_type: 'rss'
  config: {
    url: string
  }
  secrets: Record<string, unknown>
}

export default function RSSFeedsPage() {
  const [rssSource, setRssSource] = useState<RssSource>({
    name: '',
    source_type: 'rss',
    config: { url: '' },
    secrets: {},
  })

  const [rssList, setRssList] = useState<RssSource[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null) // Track which feed is being edited

  // Load RSS feeds from localStorage on mount
  useEffect(() => {
    const savedFeeds = localStorage.getItem('rssFeeds')
    if (savedFeeds) {
      setRssList(JSON.parse(savedFeeds))
    }
  }, [])

  // Save RSS feeds to localStorage
  const saveToLocalStorage = (feeds: RssSource[]) => {
    localStorage.setItem('rssFeeds', JSON.stringify(feeds))
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRssSource((prev) => ({
      ...prev,
      ...(name === 'url'
        ? { config: { ...prev.config, url: value } }
        : { [name]: value }),
    }))
  }

  // Handle save (add or update)
  const handleSave = () => {
    if (!rssSource.name || !rssSource.config.url) return

    let updatedFeeds
    if (editIndex !== null) {
      // Editing existing feed
      updatedFeeds = [...rssList]
      updatedFeeds[editIndex] = rssSource
      setEditIndex(null) // Reset edit mode
    } else {
      // Adding a new feed
      updatedFeeds = [...rssList, rssSource]
    }

    setRssList(updatedFeeds)
    saveToLocalStorage(updatedFeeds) // Save changes to localStorage

    // Reset form after saving
    setRssSource({
      name: '',
      source_type: 'rss',
      config: { url: '' },
      secrets: {},
    })
    setIsDialogOpen(false)
  }

  // Handle edit
  const handleEdit = (index: number) => {
    setRssSource(rssList[index]) // Load feed details into the form
    setEditIndex(index)
    setIsDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (index: number) => {
    const updatedFeeds = rssList.filter((_, i) => i !== index)
    setRssList(updatedFeeds)
    saveToLocalStorage(updatedFeeds) // Save changes to localStorage
  }

  return (
    <PageLayout title='RSS Feeds Management'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-xl font-bold'>RSS Feeds Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className='rounded-lg bg-black px-4 py-2 text-white'
            >
              {editIndex !== null ? 'Edit RSS Feed' : 'Add RSS Feed'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editIndex !== null ? 'Edit RSS Feed' : 'Add RSS Feed'}
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <Input
                type='text'
                placeholder='Name'
                name='name'
                value={rssSource.name}
                onChange={handleChange}
              />
              <Input
                type='text'
                placeholder='RSS Feed URL'
                name='url'
                value={rssSource.config.url}
                onChange={handleChange}
              />
              <Button
                onClick={handleSave}
                disabled={!rssSource.name || !rssSource.config.url}
              >
                {editIndex !== null ? 'Update' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className='mt-6 space-y-2'>
        {rssList.length > 0 ? (
          rssList.map((rss, index) => (
            <div
              key={index}
              className='flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm'
            >
              <div>
                <p className='text-lg font-semibold'>{rss.name}</p>
                <p className='flex items-center'>
                  <Link className='mr-2 text-gray-500' size={16} />
                  <span className='text-gray-700'>URL: </span>
                  <a
                    href={rss.config.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='ml-1 text-blue-600 hover:underline'
                  >
                    {rss.config.url}
                  </a>
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
          <p className='text-gray-500'>No RSS feeds found.</p>
        )}
      </div>
    </PageLayout>
  )
}
