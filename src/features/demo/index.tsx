import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Sample carousel data with images
const carouselItems = [
  { id: 1, image: '/images/image1.jpg' },
  { id: 2, image: '/images/image2.jpg' },
  { id: 3, image: '/images/image3.jpg' },
]

const LinkedInCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <div
      className='relative mx-auto w-full max-w-2xl overflow-hidden rounded-md'
      style={{
        backgroundImage: `url('/images/background.avif')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Main carousel slide */}
      <div className='relative flex h-[400px] w-full items-center justify-center'>
        <img
          src={carouselItems[currentIndex].image}
          alt={`Slide ${currentIndex + 1}`}
          className='h-full w-full object-cover'
        />
      </div>

      {/* Navigation arrows */}
      <button
        className='absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-black bg-opacity-70 text-white'
        onClick={goToPrevious}
      >
        <ChevronLeft className='h-5 w-5' />
      </button>

      <button
        className='absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-black bg-opacity-70 text-white'
        onClick={goToNext}
      >
        <ChevronRight className='h-5 w-5' />
      </button>

      {/* Bottom progress bar and controls */}
      <div className='flex items-center justify-between bg-gray-800 p-2 text-white'>
        <div className='text-xs'>
          {currentIndex + 1} / {carouselItems.length}
        </div>

        <div className='mx-4 flex-1'>
          <div className='h-1.5 w-full rounded-full bg-gray-600'>
            <div
              className='h-1.5 rounded-full bg-white'
              style={{
                width: `${(100 / carouselItems.length) * (currentIndex + 1)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinkedInCarousel
