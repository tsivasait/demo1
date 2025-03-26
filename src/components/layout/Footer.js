import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import ThemeContext from '../../context/ThemeContext';
import NewsletterSubscribe from '../common/NewsletterSubscribe';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Newsletter Section */}
      <div className={`py-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Get the latest posts and updates delivered straight to your inbox
            </p>
            <NewsletterSubscribe />
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="text-xl font-bold mb-4">About BlogSphere</h4>
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              A modern blogging platform featuring the latest content on food, travel, technology, and more.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-200">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 dark:text-pink-400 dark:hover:text-pink-300">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-400">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h4 className="text-xl font-bold mb-4">Categories</h4>
            <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>
                <Link to="/category/food" className="hover:text-blue-600 dark:hover:text-blue-400">Food</Link>
              </li>
              <li>
                <Link to="/category/travel" className="hover:text-blue-600 dark:hover:text-blue-400">Travel</Link>
              </li>
              <li>
                <Link to="/category/social-media" className="hover:text-blue-600 dark:hover:text-blue-400">Social Media</Link>
              </li>
              <li>
                <Link to="/category/news" className="hover:text-blue-600 dark:hover:text-blue-400">News</Link>
              </li>
              <li>
                <Link to="/category/international" className="hover:text-blue-600 dark:hover:text-blue-400">International</Link>
              </li>
              <li>
                <Link to="/category/facts" className="hover:text-blue-600 dark:hover:text-blue-400">Facts</Link>
              </li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold mb-4">Contact Us</h4>
            <address className={`not-italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p className="mb-2">123 Blog Street</p>
              <p className="mb-2">Content City, CC 12345</p>
              <p className="mb-2">Email: info@blogsphere.com</p>
              <p>Phone: (123) 456-7890</p>
            </address>
          </div>
        </div>
        
        {/* Copyright */}
        <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} text-center`}>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            © {currentYear} BlogSphere. All rights reserved. Made with <FaHeart className="inline text-red-500" /> by Your Name
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;