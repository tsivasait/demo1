const Post = require('../models/Post');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments();

  const posts = await Post.find()
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit);

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: posts.length,
    pagination,
    data: posts
  });
});

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('author', 'name avatar');

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Increment views
  post.views += 1;
  await post.save();

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private/Admin
exports.createPost = asyncHandler(async (req, res, next) => {
  // Add author to req.body
  req.body.author = req.user.id;

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private/Admin
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is post author or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this post`, 401));
  }

  post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is post author or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this post`, 401));
  }

  await post.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Like post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Check if the post has already been liked by this user
  if (post.likes.some(like => like.user.toString() === req.user.id)) {
    return next(new ErrorResponse('Post already liked', 400));
  }

  post.likes.unshift({ user: req.user.id });
  await post.save();

  res.status(200).json({
    success: true,
    data: post.likes
  });
});

// @desc    Unlike post
// @route   PUT /api/posts/:id/unlike
// @access  Private
exports.unlikePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorResponse(`Post not found with id of ${req.params.id}`, 404));
  }

  // Check if the post has been liked by this user
  if (!post.likes.some(like => like.user.toString() === req.user.id)) {
    return next(new ErrorResponse('Post has not yet been liked', 400));
  }

  // Remove the like
  post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
  await post.save();

  res.status(200).json({
    success: true,
    data: post.likes
  });
});

// @desc    Get posts by category
// @route   GET /api/posts/category/:category
// @access  Public
exports.getPostsByCategory = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ category: req.params.category })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Public
exports.getPostsByUser = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ author: req.params.userId })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

// @desc    Get featured posts
// @route   GET /api/posts/featured
// @access  Public
exports.getFeaturedPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ featured: true })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});