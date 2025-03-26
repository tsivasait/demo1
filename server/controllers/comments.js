const Comment = require('../models/Comment');
const Post = require('../models/Post');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get comments
// @route   GET /api/comments
// @route   GET /api/posts/:postId/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
  if (req.params.postId) {
    const comments = await Comment.find({ post: req.params.postId })
      .populate({
        path: 'user',
        select: 'name avatar'
      });

    return res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single comment
// @route   GET /api/comments/:id
// @access  Public
exports.getComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).populate({
    path: 'user',
    select: 'name avatar'
  });

  if (!comment) {
    return next(new ErrorResponse(`No comment found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: comment
  });
});

// @desc    Add comment
// @route   POST /api/posts/:postId/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  
  if (req.params.postId) {
    req.body.post = req.params.postId;
  }

  // Check if post exists
  const post = await Post.findById(req.body.post);
  if (!post) {
    return next(new ErrorResponse(`No post found with id of ${req.body.post}`, 404));
  }

  const comment = await Comment.create(req.body);

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse(`No comment found with id of ${req.params.id}`, 404));
  }

  // Make sure user is comment owner
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update this comment', 401));
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: comment
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorResponse(`No comment found with id of ${req.params.id}`, 404));
  }

  // Make sure user is comment owner
  if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to delete this comment', 401));
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});