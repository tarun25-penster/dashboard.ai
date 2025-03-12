import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CardsGrid() {
  const cards = [
    { title: 'Reddit', content: 'This is the first card.' },
    { title: 'News', content: 'This is the second card.' },
    { title: 'pdf', content: 'This is the third card.' },
    { title: 'Excel', content: 'This is the fourth card.' },
    { title: 'Google-sheets', content: 'This is the fifth card.' },
  ]

  return (
    <div className='grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3'>
      {cards.map((card, index) => (
        <Card key={index} className='shadow-lg transition-all hover:shadow-xl'>
          <CardHeader>
            <CardTitle>{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{card.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
