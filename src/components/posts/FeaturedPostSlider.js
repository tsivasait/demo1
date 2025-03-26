import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ThemeContext from '../../context/ThemeContext';

const FeaturedPostSlider = ({ posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { darkMode } = useContext(ThemeContext);
  
  // Auto-slide every 5 seconds
  useEffect(() => {
    if (posts.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % posts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [posts.length]);
  
  const goToPrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex === 0 ? posts.length - 1 : prevIndex - 1));
  };
  
  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % posts.length);
  };
  
  if (!posts || posts.length === 0) {
    return null;
  }
  
  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden">
      {/* Slides */}
      {posts.map((post, index) => (
        <div
          key={post._id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="relative h-full">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-70"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
              <div className="container mx-auto">
                <div className="max-w-3xl">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full mb-4">
                    {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    {post.title}
                  </h2>
                  <p className="text-gray-200 mb-6 line-clamp-2 md:line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center mb-6">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-white font-medium">{post.author.name}</p>
                      <p className="text-gray-300 text-sm">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={`/post/${post._id}`}
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Read Article
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      {posts.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Previous slide"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
            aria-label="Next slide"
          >
            <FaChevronRight size={24} />
          </button>
        </>
      )}
      
      {/* Indicators */}
      {posts.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {posts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedPostSlider;