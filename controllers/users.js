const mongoose = require('mongoose');
const User = require('../models/user');
const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректный _id пользователя.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка валидации.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((newProfile) => res.send(newProfile))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка валидации.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректный _id пользователя.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((newAvatar) => res.send(newAvatar))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка валидации.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректный _id пользователя.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
