const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers
const {
  getDashboardStats,
  updateSiteSettings,
  getSiteSettings
} = require('../controllers/admin');

// Protect all routes
router.use(protect);
router.use(authorize('admin'));

// Get dashboard stats
router.get('/stats', getDashboardStats);

// Site settings routes
router.route('/settings')
  .get(getSiteSettings)
  .put(updateSiteSettings);

module.exports = router;