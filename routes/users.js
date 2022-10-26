const router = require('express').Router();
const { idValidation, userProfileValidation, userAvatarValidation } = require('../middlewares/validation');
const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', idValidation, getUserById);
router.patch('/users/me', userProfileValidation, updateUserProfile);
router.patch('/users/me/avatar', userAvatarValidation, updateUserAvatar);

module.exports = router;
