const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Post.find(JSON.parse(queryStr)).populate({
    path: 'author',
    select: 'name avatar'
  });

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Post.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const posts = await query;

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
  const post = await Post.findById(req.params.id)
    .populate({
      path: 'author',
      select: 'name avatar bio'
    })
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name avatar'
      }
    });

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  // Increment view count
  post.views += 1;
  await post.save();

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.author = req.user.id;

  const post = await Post.create(req.body);

  res.status(201).json({
    success: true,
    data: post
  });
});

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res, next) => {
  let post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is post author or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this post`,
        401
      )
    );
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
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is post author or admin
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this post`,
        401
      )
    );
  }

  await post.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get featured posts
// @route   GET /api/posts/featured
// @access  Public
exports.getFeaturedPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({ featured: true })
    .populate({
      path: 'author',
      select: 'name avatar'
    })
    .limit(5)
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

// @desc    Get related posts
// @route   GET /api/posts/:id/related
// @access  Public
exports.getRelatedPosts = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  const relatedPosts = await Post.find({
    _id: { $ne: req.params.id },
    category: post.category
  })
    .populate({
      path: 'author',
      select: 'name avatar'
    })
    .limit(3)
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: relatedPosts.length,
    data: relatedPosts
  });
});

// @desc    Like/unlike post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user has already liked this post
  const liked = await Like.findOne({
    post: req.params.id,
    user: req.user.id
  });

  if (liked) {
    // User has already liked, so unlike
    await liked.remove();
    post.likes -= 1;
    await post.save();

    return res.status(200).json({
      success: true,
      liked: false,
      totalLikes: post.likes
    });
  }

  // User hasn't liked, so add like
  await Like.create({
    post: req.params.id,
    user: req.user.id
  });

  post.likes += 1;
  await post.save();

  res.status(200).json({
    success: true,
    liked: true,
    totalLikes: post.likes
  });
});