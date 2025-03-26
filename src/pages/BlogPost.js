import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { FaRegClock, FaRegComment, FaRegHeart, FaHeart, FaShare, FaFacebook, FaTwitter, FaLinkedin, FaLink } from 'react-icons/fa';
import ThemeContext from '../context/ThemeContext';
import AuthContext from '../context/AuthContext';
import CommentSection from '../components/comments/CommentSection';
import RelatedPosts from '../components/posts/RelatedPosts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-toastify';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
        
        // Check if user has liked this post
        if (isAuthenticated && user) {
          const likeStatus = await axios.get(`/api/posts/${id}/like-status`);
          setLiked(likeStatus.data.liked);
        }
        
        // Fetch related posts
        const relatedRes = await axios.get(`/api/posts/${id}/related`);
        setRelatedPosts(relatedRes.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    // Scroll to top when post changes
    window.scrollTo(0, 0);
  }, [id, isAuthenticated, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to like posts');
      return;
    }
    
    try {
      const res = await axios.post(`/api/posts/${id}/like`);
      setLiked(res.data.liked);
      setPost(prev => ({
        ...prev,
        likes: res.data.totalLikes
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title;
    
    let shareUrl;
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        return;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <p className="mb-8">The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className={`transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Image */}
      <div className="w-full h-96 relative">
        <img 
          src={post.coverImage} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl">
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mb-4 ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center text-white">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{post.author.name}</p>
                  <div className="flex items-center text-sm text-gray-300">
                    <FaRegClock className="mr-1" />
                    {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row">
          {/* Article Content */}
          <article className="lg:w-2/3 lg:pr-12">
            <div className={`prose prose-lg max-w-none ${darkMode ? 'prose-invert' : ''}`} dangerouslySetInnerHTML={{ __html: post.content }} />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8">
                <h4 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link 
                      key={tag} 
                      to={`/tag/${tag}`}
                      className={`px-3 py-