const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getPostsByCategory,
  getPostsByUser,
  getFeaturedPosts
} = require('../controllers/posts');

// Get all posts
router.get('/', getPosts);

// Get featured posts
router.get('/featured', getFeaturedPosts);

// Get posts by category
router.get('/category/:category', getPostsByCategory);

// Get posts by user
router.get('/user/:userId', getPostsByUser);

// Get single post
router.get('/:id', getPost);

// Create new post - private/admin
router.post('/', protect, authorize('admin'), createPost);

// Update post - private/admin
router.put('/:id', protect, authorize('admin'), updatePost);

// Delete post - private/admin
router.delete('/:id', protect, authorize('admin'), deletePost);

// Like post - private
router.put('/:id/like', protect, likePost);

// Unlike post - private
router.put('/:id/unlike', protect, unlikePost);

module.exports = router;