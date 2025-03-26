import React, { useContext } from 'react';
import ThemeContext from '../../context/ThemeContext';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  const { darkMode } = useContext(ThemeContext);
  
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category.id
              ? 'bg-blue-600 text-white'
              : darkMode
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;