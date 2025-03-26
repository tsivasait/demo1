import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaRegClock, FaRegComment, FaRegHeart } from 'react-icons/fa';
import ThemeContext from '../../context/ThemeContext';

const PostCard = ({ post }) => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <article className={`rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <Link to={`/post/${post._id}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
          </div>
        </div>
      </Link>
      
      <div className="p-5">
        <Link to={`/post/${post._id}`}>
          <h3 className={`text-xl font-bold mb-2 hover:text-blue-600 transition-colors ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {post.title}
          </h3>
        </Link>
        
        <p className={`mb-4 line-clamp-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <img 
              src={post.author.avatar} 
              alt={post.author.name} 
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {post.author.name}
            </span>
          </div>
          
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center">
              <FaRegClock className="mr-1" />
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
        
        <div className={`flex items-center justify-between mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaRegHeart className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {post.likes}
              </span>
            </div>
            <div className="flex items-center">
              <FaRegComment className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {post.comments}
              </span>
            </div>
          </div>
          
          <Link 
            to={`/post/${post._id}`} 
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
};

// Helper function to get category color
const getCategoryColor = (category) => {
  const colors = {
    food: 'bg-green-500 text-white',
    travel: 'bg-purple-500 text-white',
    'social-media': 'bg-blue-500 text-white',
    news: 'bg-red-500 text-white',
    international: 'bg-yellow-500 text-white',
    facts: 'bg-indigo-500 text-white',
    default: 'bg-gray-500 text-white'
  };
  
  return colors[category.toLowerCase()] || colors.default;
};

export default PostCard;