const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const SiteSettings = require('../models/SiteSettings');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Get counts
  const postsCount = await Post.countDocuments();
  const usersCount = await User.countDocuments();
  const commentsCount = await Comment.countDocuments();
  
  // Get new counts for this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const newPostsThisWeek = await Post.countDocuments({
    createdAt: { $gte: oneWeekAgo }
  });
  
  const newUsersThisWeek = await User.countDocuments({
    createdAt: { $gte: oneWeekAgo }
  });
  
  const newCommentsThisWeek = await Comment.countDocuments({
    createdAt: { $gte: oneWeekAgo }
  });
  
  // Get recent activity
  const recentPosts = await Post.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('author', 'name');
    
  const recentComments = await Comment.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name')
    .populate('post', 'title');
    
  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5);
  
  // Format recent activity
  const recentActivity = [
    ...recentPosts.map(post => ({
      type: 'post',
      message: `New post "${post.title}" by ${post.author.name}`,
      time: post.createdAt.toLocaleString()
    })),
    ...recentComments.map(comment => ({
      type: 'comment',
      message: `New comment on "${comment.post.title}" by ${comment.user.name}`,
      time: comment.createdAt.toLocaleString()
    })),
    ...recentUsers.map(user => ({
      type: 'user',
      message: `New user ${user.name} registered`,
      time: user.createdAt.toLocaleString()
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);
  
  // Mock page views data (in a real app, you'd get this from analytics)
  const pageViews = 12500;
  const pageViewsIncrease = 15;
  
  res.status(200).json({
    success: true,
    data: {
      postsCount,
      usersCount,
      commentsCount,
      newPostsThisWeek,
      newUsersThisWeek,
      newCommentsThisWeek,
      pageViews,
      pageViewsIncrease,
      recentActivity
    }
  });
});

// @desc    Get site settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSiteSettings = asyncHandler(async (req, res, next) => {
  let settings = await SiteSettings.findOne();
  
  if (!settings) {
    // Create default settings if none exist
    settings = await SiteSettings.create({
      siteName: 'My Blog',
      siteDescription: 'A modern blog platform',
      logo: 'default-logo.png',
      favicon: 'default-favicon.ico',
      primaryColor: '#3490dc',
      secondaryColor: '#38b2ac',
      footerText: '© 2023 My Blog. All rights reserved.',
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      },
      featuredCategories: ['technology', 'lifestyle', 'business']
    });
  }
  
  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update site settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSiteSettings = asyncHandler(async (req, res, next) => {
  let settings = await SiteSettings.findOne();
  
  if (!settings) {
    settings = await SiteSettings.create(req.body);
  } else {
    settings = await SiteSettings.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true
    });
  }
  
  res.status(200).json({
    success: true,
    data: settings
  });
});