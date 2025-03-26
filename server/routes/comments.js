const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

// Import controllers
const {
  getComments,
  getComment,
  addComment,
  updateComment,
  deleteComment
} = require('../controllers/comments');

// Get all comments
router.route('/')
  .get(getComments)
  .post(protect, addComment);

// Get, update and delete single comment
router.route('/:id')
  .get(getComment)
  .put(protect, updateComment)
  .delete(protect, deleteComment);

module.exports = router;