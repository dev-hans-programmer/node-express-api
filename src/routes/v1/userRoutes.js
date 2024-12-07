const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../../controllers/userController');
const {
  signUp,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../../controllers/authController');

const router = express.Router();

// auth
router.post('/signup', signUp);
router.post('/login', login);

router.post('/forget-password', forgetPassword);
router.patch('/reset-password/:token', resetPassword);

router.patch('/update-password', protect, updatePassword);
router.patch('/update-me', protect, updateMe);
router.delete('/delete-me', protect, deleteMe);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
