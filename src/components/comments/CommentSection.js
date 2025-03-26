import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { FaReply, FaThumbsUp, FaRegThumbsUp } from 'react-icons/fa';
import ThemeContext from '../../context/ThemeContext';
import AuthContext from '../../context/AuthContext';
import { toast } from 'react-toastify';

const CommentSection = ({ postId, comments: initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const { isAuthenticated, user } = useContext(AuthContext);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info('Please login to comment');
      return;
    }
    
    if (!newComment.trim()) return;
    
    try {
      setLoading(true);
      const res = await axios.post(`/api/posts/${postId}/comments`, {
        content: newComment
      });
      
      setComments([res.data, ...comments]);
      setNewComment('');
      toast.success('Comment posted successfully');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e, commentId) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.info('Please login to reply');
      return;
    }
    
    if (!replyContent.trim()) return;
    
    try {
      setLoading(true);
      const res = await axios.post(`/api/posts/${postId}/comments/${commentId}/replies`, {
        content: replyContent
      });
      
      // Update the comments state with the new reply
      const updatedComments = comments.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, res.data]
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
      setReplyContent('');
      setReplyTo(null);
      toast.success('Reply posted successfully');
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isAuthenticated) {
      toast.info('Please login to like comments');
      return;
    }
    
    try {
      const res = await axios.post(`/api/posts/${postId}/comments/${commentId}/like`);
      
      // Update the comments state with the new like status
      const updatedComments = comments.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            likes: res.data.totalLikes,
            liked: res.data.liked
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
    } catch (error) {
      console.error('Error liking comment:', error);
      toast.error('Failed to like comment');
    }
  };

  return (
    <div className="mt-12">
      <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Comments ({comments.length})
      </h3>
      
      {/* Comment Form */}
      <div className={`mb-8 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
        <h4 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Leave a Comment
        </h4>
        
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here..."
              className={`w-full px-4 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              rows="4"
              required
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {loading ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Please login to leave a comment
            </p>
            <Link
              to="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
          </div>
        )}
      </div>
      
      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment._id} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
              {/* Comment Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h5 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {comment.user.name}
                    </h5>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {format(new Date(comment.createdAt), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Comment Content */}
              <div className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {comment.content}
              </div>
              
              {/* Comment Actions */}
              <div className="flex items-center mt-4 space-x-4">
                <button
                  onClick={() => handleLikeComment(comment._id)}
                  className="flex items-center space-x-1"
                >
                  {comment.liked ? (
                    <FaThumbsUp className="text-blue-500" />
                  ) : (
                    <FaRegThumbsUp className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                  )}
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {comment.likes || 0}
                  </span>
                </button>
                
                <button
                  onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                  className="flex items-center space-x-1"
                >
                  <FaReply className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Reply
                  </span>
                </button>
              </div>
              
              {/* Reply Form */}
              {replyTo === comment._id && isAuthenticated && (
                <div className="mt-4 pl-6 border-l-2 border-gray-300 dark:border-gray-700">
                  <form onSubmit={(e) => handleSubmitReply(e, comment._id)}>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Reply to ${comment.user.name}...`}
                      className={`w-full px-4 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      rows="3"
                      required
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <button
                        type="button"
                        onClick={() => setReplyTo(null)}
                        className={`px-4 py-1 rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
                      >
                        {loading ? 'Posting...' : 'Post Reply'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l-2 border-gray-300 dark:border-gray-700 space-y-4">
                  {comment.replies.map(reply => (
                    <div key={reply._id} className="pt-4">
                      <div className="flex items-start">
                        <img
                          src={reply.user.avatar}
                          alt={reply.user.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <h6 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {reply.user.name}
                          </h6>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {format(new Date(reply.createdAt), 'MMM d, yyyy • h:mm a')}
                          </p>
                          <div className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {reply.content}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <p>Be the first to comment on this post!</p>
        </div>
      )}
    </div>
  );
};

export default CommentSection;