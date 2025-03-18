import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Config {
  url?: string
  endpoint?: string
  params?: { categories?: string; limit?: number }
  subreddit?: string
  limit?: number
  max_allowed_size?: string
  file?: File
}

interface Secrets {
  api_key?: string
  client_id?: string
  client_secret?: string
}

type SourceType =
  | 'rss'
  | 'news_api'
  | 'reddit'
  | 'pdf'
  | 'excel'
  | 'google_sheets'
  | 'api'

interface SourceData {
  SourceType: unknown
  name: string
  sourceType: SourceType
  config: Config
  secrets: Secrets
  description: string
}

const initialSource: SourceData = {
  name: '',
  sourceType: 'rss',
  config: {},
  secrets: {},
  SourceType: undefined,
  description: '',
}

export default function ContentSourceForm({
  onAddSource,
}: {
  onAddSource: (data: SourceData) => void
}) {
  const [source, setSource] = useState<SourceData>(initialSource)

  // Handle text and dropdown changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setSource((prev) => ({
      ...prev,
      [name]: name === 'sourceType' ? (value as SourceType) : value,
    }))
  }

  // Handle config input fields
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSource((prev) => ({
      ...prev,
      config: { ...prev.config, [name]: value },
    }))
  }

  // Handle file uploads for PDF, Excel, and Google Sheets
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = {
      pdf: 'application/pdf',
      excel: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ],
      google_sheets: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
      ],
    }

    if (source.sourceType === 'pdf' && file.type !== validTypes.pdf) {
      alert('Please upload a valid PDF file.')
      return
    }

    if (
      source.sourceType === 'excel' &&
      !validTypes.excel.includes(file.type)
    ) {
      alert('Please upload a valid Excel file (.xlsx, .csv).')
      return
    }

    if (
      source.sourceType === 'google_sheets' &&
      !validTypes.google_sheets.includes(file.type)
    ) {
      alert('Please upload a valid Google Sheets file (.xlsx, .csv).')
      return
    }

    setSource((prev) => ({
      ...prev,
      config: { ...prev.config, file },
    }))
  }

  // Save source to local storage in specific folders
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const folderKey = `contentSources_${source.SourceType}`
    const storedSources = JSON.parse(localStorage.getItem(folderKey) || '[]')

    const updatedSources = [...storedSources, source]

    localStorage.setItem(folderKey, JSON.stringify(updatedSources))

    onAddSource(source)
    setSource(initialSource)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 rounded-lg border p-6 shadow'
    >
      <div>
        <Label>Name</Label>
        <Input
          type='text'
          name='name'
          value={source.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor='sourceType'>Source Type</Label>
        <select
          id='sourceType'
          name='sourceType'
          value={source.sourceType}
          onChange={handleChange}
          className='w-full rounded border p-2'
        >
          <option value='rss'>RSS</option>
          <option value='news_api'>News API</option>
          <option value='reddit'>Reddit</option>
          <option value='pdf'>PDF</option>
          <option value='excel'>Excel</option>
          <option value='google_sheets'>Google Sheets</option>
          <option value='api'>API</option>
        </select>
      </div>

      <div>
        <Label>Configuration</Label>

        {source.sourceType === 'rss' && (
          <Input
            type='text'
            name='url'
            value={source.config.url || ''}
            onChange={handleConfigChange}
            placeholder='RSS Feed URL'
            required
          />
        )}

        {(source.sourceType === 'news_api' || source.sourceType === 'api') && (
          <>
            <Input
              type='text'
              name='endpoint'
              value={source.config.endpoint || ''}
              onChange={handleConfigChange}
              placeholder='API Endpoint'
              required
            />
            <Input
              type='text'
              name='categories'
              value={source.config.params?.categories || ''}
              onChange={handleConfigChange}
              placeholder='Categories'
            />
          </>
        )}

        {source.sourceType === 'reddit' && (
          <>
            <Input
              type='text'
              name='subreddit'
              value={source.config.subreddit || ''}
              onChange={handleConfigChange}
              placeholder='Subreddit Name'
              required
            />
            <Input
              type='number'
              name='limit'
              value={source.config.limit || 1}
              onChange={handleConfigChange}
              placeholder='Limit'
            />
          </>
        )}

        {(source.sourceType === 'pdf' ||
          source.sourceType === 'excel' ||
          source.sourceType === 'google_sheets') && (
          <div>
            <Label>Upload File</Label>
            <Input
              type='file'
              accept={
                source.sourceType === 'pdf' ? 'application/pdf' : '.xlsx,.csv'
              }
              onChange={handleFileChange}
              required
            />
            {source.config.file && (
              <p>Uploaded File: {source.config.file.name}</p>
            )}
          </div>
        )}
      </div>

      {(source.sourceType === 'news_api' ||
        source.sourceType === 'reddit' ||
        source.sourceType === 'api') && (
        <div>
          <Label>Secrets</Label>
          <Input
            type='text'
            name='api_key'
            value={source.secrets.api_key || ''}
            onChange={handleConfigChange}
            placeholder='API Key'
            required
          />
        </div>
      )}

      <Button type='submit' variant='default'>
        Save Source
      </Button>
    </form>
  )
}
