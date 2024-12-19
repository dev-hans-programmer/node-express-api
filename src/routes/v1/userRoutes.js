const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = require('../../controllers/userController');
const {
  signUp,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
} = require('../../controllers/authController');
const { AppRoles } = require('../../utils/common');

const router = express.Router();

// auth
router.post('/signup', signUp);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.patch('/reset-password/:token', resetPassword);

router.use(protect);

// these all are protected now
router.route('/me').get(getMe, getUser).patch(updateMe).delete(deleteMe);
router.patch('/update-password', updatePassword);

router.use(restrictTo(AppRoles.ADMIN));
// Admin Routes
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
