import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Sample carousel data with images
const carouselItems = [
  { id: 1, image: "/images/image1.jpg" },
  { id: 2, image: "/images/image2.jpg" },
  { id: 3, image: "/images/image3.jpg" },
];

const LinkedInCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-md overflow-hidden"
      style={{
        backgroundImage: `url('/images/background.avif')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative h-[400px] w-full flex items-center justify-center">
        <img
          src={carouselItems[currentIndex].image}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <button
        className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center"
        onClick={goToNext}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="bg-gray-800 text-white p-2 flex items-center justify-between">
        <div className="text-xs">
          {currentIndex + 1} / {carouselItems.length}
        </div>

        <div className="flex-1 mx-4">
          <div className="w-full bg-gray-600 rounded-full h-1.5">
            <div
              className="bg-white h-1.5 rounded-full"
              style={{
                width: `${(100 / carouselItems.length) * (currentIndex + 1)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInCarousel;
