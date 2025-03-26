const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import controllers
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

// Routes with admin authorization
router.use(protect);
router.use(authorize('admin'));

// Get all users and create new user
router.route('/')
  .get(getUsers)
  .post(createUser);

// Get, update and delete single user
router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;