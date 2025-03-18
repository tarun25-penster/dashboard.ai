import { useState, useEffect } from 'react'
import { Eye, EyeOff, Search, Trash, Pencil } from 'lucide-react'
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

interface ApiSource {
  name: string
  source_type: string
  config: {
    endpoint: string
  }
  secrets: {
    api_key: string
  }
}

export default function APIPage() {
  const [apiSource, setApiSource] = useState<ApiSource>({
    name: '',
    source_type: 'news_api',
    config: { endpoint: '' },
    secrets: { api_key: '' },
  })

  const [apiList, setApiList] = useState<ApiSource[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showKeys, setShowKeys] = useState<Record<number, boolean>>({})
  const [editIndex, setEditIndex] = useState<number | null>(null)

  // Load from localStorage
  useEffect(() => {
    const storedAPIs = localStorage.getItem('apiList')
    if (storedAPIs) {
      setApiList(JSON.parse(storedAPIs))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('apiList', JSON.stringify(apiList))
  }, [apiList])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setApiSource((prev) => ({ ...prev, [name]: value }))
  }

  const handleNestedChange = (
    key: keyof ApiSource,
    field: string,
    value: string
  ) => {
    setApiSource((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] && typeof prev[key] === 'object' ? prev[key] : {}),
        [field]: value,
      },
    }))
  }

  const handleSave = () => {
    if (
      apiSource.name &&
      apiSource.config.endpoint &&
      apiSource.secrets.api_key
    ) {
      if (editIndex !== null) {
        // Edit existing API
        const updatedList = [...apiList]
        updatedList[editIndex] = apiSource
        setApiList(updatedList)
      } else {
        // Add new API
        setApiList([...apiList, apiSource])
      }
      setApiSource({
        name: '',
        source_type: 'news_api',
        config: { endpoint: '' },
        secrets: { api_key: '' },
      })
      setEditIndex(null)
      setIsDialogOpen(false)
    }
  }

  const handleEdit = (index: number) => {
    setApiSource(apiList[index])
    setEditIndex(index)
    setIsDialogOpen(true)
  }

  const handleDelete = (index: number) => {
    const updatedList = apiList.filter((_, i) => i !== index)
    setApiList(updatedList)
  }

  const filteredAPIs = apiList.filter((api) =>
    api.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <PageLayout title='API Management'>
      <div className='mb-6 flex items-center justify-between'>
        {/* Search Bar */}
        <div className='relative w-64'>
          <Search className='absolute left-3 top-2.5 text-gray-500' size={18} />
          <Input
            type='text'
            placeholder='Search API Sources'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='rounded-lg border py-2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Add/Edit Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='rounded-lg bg-black px-4 py-2 text-white'>
              {editIndex !== null ? 'Edit API Source' : 'Add API Source'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editIndex !== null ? 'Edit API Source' : 'Add API Source'}
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-4'>
              <Input
                type='text'
                placeholder='Name'
                name='name'
                value={apiSource.name}
                onChange={handleChange}
              />
              <Input
                type='text'
                placeholder='API Endpoint'
                value={apiSource.config.endpoint}
                onChange={(e) =>
                  handleNestedChange('config', 'endpoint', e.target.value)
                }
              />
              <Input
                type='password'
                placeholder='API Key'
                value={apiSource.secrets.api_key}
                onChange={(e) =>
                  handleNestedChange('secrets', 'api_key', e.target.value)
                }
              />
              <Button
                onClick={handleSave}
                disabled={
                  !apiSource.name ||
                  !apiSource.config.endpoint ||
                  !apiSource.secrets.api_key
                }
              >
                {editIndex !== null ? 'Update' : 'Save'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Display API Sources */}
      <div className='mt-6 space-y-2'>
        {filteredAPIs.length > 0 ? (
          filteredAPIs.map((api, index) => (
            <div
              key={index}
              className='flex items-center justify-between rounded-lg border p-4 shadow-sm'
            >
              <div>
                <p className='text-lg font-semibold'>{api.name}</p>
                <p>
                  🔗 Endpoint:{' '}
                  <span className='text-gray-700'>{api.config.endpoint}</span>
                </p>
                <p className='flex items-center'>
                  🔑 API Key:{' '}
                  <span className='ml-2 text-gray-700'>
                    {showKeys[index] ? api.secrets.api_key : '••••••••'}
                  </span>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() =>
                      setShowKeys((prev) => ({
                        ...prev,
                        [index]: !prev[index],
                      }))
                    }
                  >
                    {showKeys[index] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </p>
              </div>

              {/* Edit & Delete Buttons */}
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => handleEdit(index)}
                >
                  <Pencil size={18} />
                </Button>
                <Button
                  variant='destructive'
                  size='icon'
                  onClick={() => handleDelete(index)}
                >
                  <Trash size={18} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-500'>No API sources found.</p>
        )}
      </div>
    </PageLayout>
  )
}
