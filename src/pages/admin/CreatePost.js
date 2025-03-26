import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import { FaImage, FaTags, FaCheck } from 'react-icons/fa';
import ThemeContext from '../../context/ThemeContext';
import { toast } from 'react-toastify';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    tags: '',
    featured: false
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const { title, excerpt, content, coverImage, category, tags, featured } = formData;

  const categories = [
    { id: 'food', name: 'Food' },
    { id: 'travel', name: 'Travel' },
    { id: 'social-media', name: 'Social Media' },
    { id: 'news', name: 'News' },
    { id: 'international', name: 'International' },
    { id: 'facts', name: 'Facts' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditorChange = (content) => {
    setFormData(prevState => ({
      ...prevState,
      content
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prevState => ({
          ...prevState,
          coverImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !excerpt || !content || !coverImage || !category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Format tags as array
      const formattedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      const postData = {
        ...formData,
        tags: formattedTags
      };
      
      const res = await axios.post('/api/posts', postData);
      
      toast.success('Post created successfully');
      navigate(`/post/${res.data.data._id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label 
            htmlFor="title" 
            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>
        
        {/* Excerpt */}
        <div>
          <label 
            htmlFor="excerpt" 
            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Excerpt * <span className="text-xs text-gray-500">(Brief summary, max 200 characters)</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={excerpt}
            onChange={handleChange}
            rows="3"
            maxLength="200"
            className={`w-full px-4 py-2 rounded-md border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>
        
        {/* Cover Image */}
        <div>
          <label 
            htmlFor="coverImage" 
            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Cover Image *
          </label>
          <div className="flex items-center space-x-4">
            <label 
              className={`flex items-center justify-center px-4 py-2 border border-dashed rounded-md cursor-pointer ${
                darkMode 
                  ? 'border-gray-600 hover:border-gray-500' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <FaImage className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                {imagePreview ? 'Change Image' : 'Select Image'}
              </span>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </label>
            
            {imagePreview && (
              <div className="relative h-20 w-32">
                <img 
                  src={imagePreview} 
                  alt="Cover preview" 
                  className="h-full w-full object-cover rounded-md"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Category */}
        <div>
          <label 
            htmlFor="category" 
            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-md border ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Tags */}
        <div>
          <label 
            htmlFor="tags" 
            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Tags <span className="text-xs text-gray-500">(Comma separated)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaTags className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            </div>
            <input
              type="text"
              id="tags"
              name="tags"
              value={tags}
              onChange={handleChange}
              placeholder="e.g. cooking, recipes, healthy"
              className={`w-full pl-10 px-4 py-2 rounded-md border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>
        
        {/* Featured */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={featured}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label 
            htmlFor="featured" 
            className={`ml-2 block text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Featured post (will appear in the featured section)
          </label>
        </div>
        
        {/* Content Editor */}
        <div>
          <label 
            htmlFor="content" 
            className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Content *
          </label>
          <Editor
            apiKey="your-tinymce-api-key"
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help',
              skin: darkMode ? 'oxide-dark' : 'oxide',
              content_css: darkMode ? 'dark' : 'default'
            }}
            value={content}
            onEditorChange={handleEditorChange}
          />
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Post...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Publish Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;