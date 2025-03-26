import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/posts/PostCard';
import FeaturedPostSlider from '../components/posts/FeaturedPostSlider';
import CategoryFilter from '../components/filters/CategoryFilter';
import NewsletterSubscribe from '../components/common/NewsletterSubscribe';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ThemeContext from '../context/ThemeContext';

const HomePage = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const { darkMode } = useContext(ThemeContext);
  
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'food', name: 'Food' },
    { id: 'travel', name: 'Travel' },
    { id: 'social-media', name: 'Social Media' },
    { id: 'news', name: 'News' },
    { id: 'international', name: 'International' },
    { id: 'facts', name: 'Facts' }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const featuredRes = await axios.get('/api/posts/featured');
        setFeaturedPosts(featuredRes.data);
        
        const postsRes = await axios.get('/api/posts', {
          params: { 
            category: activeCategory !== 'all' ? activeCategory : undefined,
            limit: 9
          }
        });
        setPosts(postsRes.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeCategory]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className={`transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section with Featured Posts */}
      <section className="w-full">
        {loading ? (
          <div className="h-96 flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <FeaturedPostSlider posts={featuredPosts} />
        )}
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />

        {/* Posts Grid */}
        {loading ? (
          <div className="h-96 flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            
            {posts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">
                  No posts found in this category
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-500">
                  Try selecting a different category or check back later
                </p>
              </div>
            )}
            
            {posts.length > 0 && (
              <div className="text-center mt-10">
                <Link 
                  to={activeCategory !== 'all' ? `/category/${activeCategory}` : '/posts'}
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View More Posts
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Newsletter Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Subscribe to Our Newsletter
            </h2>
            <p className={`mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Get the latest posts and updates delivered straight to your inbox
            </p>
            <NewsletterSubscribe />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;