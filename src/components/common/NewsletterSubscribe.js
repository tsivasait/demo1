import React, { useState, useContext } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import ThemeContext from '../../context/ThemeContext';
import { toast } from 'react-toastify';

const NewsletterSubscribe = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    try {
      setLoading(true);
      await axios.post('/api/newsletter/subscribe', { email });
      
      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error(error.response?.data?.error || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      <div className="flex-grow relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className={`w-full px-4 py-3 rounded-md ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center"
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <>
            <FaPaperPlane className="mr-2" />
            Subscribe
          </>
        )}
      </button>
    </form>
  );
};

export default NewsletterSubscribe;