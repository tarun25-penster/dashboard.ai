import { useState } from 'react'

const initialSlides = [
  {
    img: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
    description: 'Welocome To My Homes',
    cta: 'Next',
  },
  {
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
    description: 'Step 2: Add your connections',
    cta: 'Next',
  },
  {
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    description: 'Step 3: Start networking',
    cta: 'Finish',
  },
]

export default function TextCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < initialSlides.length - 1 ? prev + 1 : 0))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : initialSlides.length - 1))
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4'>
      <div className='relative w-full max-w-2xl rounded-lg bg-gray-100 p-8 text-center shadow-lg'>
        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className='absolute left-4 top-1/2 -translate-y-1/2 transform text-2xl'
        >
          ◀
        </button>

        {/* Slide Content */}
        <img
          src={initialSlides[currentIndex].img}
          alt='Step'
          className='mb-6 h-64 w-full rounded-md object-cover'
        />
        <p className='text-2xl font-semibold'>
          {initialSlides[currentIndex].description}
        </p>
        <button
          onClick={nextSlide}
          className='mt-6 rounded-lg bg-blue-500 px-6 py-3 text-lg text-white'
        >
          {initialSlides[currentIndex].cta}
        </button>

        <button
          onClick={nextSlide}
          className='absolute right-4 top-1/2 -translate-y-1/2 transform text-2xl'
        >
          ▶
        </button>
      </div>

      {/* Slide Indicator */}
      <div className='mt-4 text-lg text-gray-600'>
        {currentIndex + 1} / {initialSlides.length}
      </div>

      {/* Progress Bar */}
      <div className='mt-2 h-3 w-full max-w-2xl rounded-full bg-gray-300'>
        <div
          className='h-3 rounded-full bg-blue-500'
          style={{
            width: `${((currentIndex + 1) / initialSlides.length) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  )
}
