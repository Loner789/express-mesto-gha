const User = require('../models/user');
const { handleDefaultError, handleError } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => res.send(users))
    .catch(() => handleDefaultError());
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => handleError(err, res, 'Пользователь не найден.'));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => handleError(err, res, 'Не удалось создать нового пользователя.'));
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((newProfile) => res.send(newProfile))
    .catch((err) => handleError(err, res, 'Не удалось обновить данные пользователя.'));
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((newAvatar) => res.send(newAvatar))
    .catch((err) => handleError(err, res, 'Не удалось обновить аватар.'));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
