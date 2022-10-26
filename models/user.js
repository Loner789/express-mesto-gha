const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isURL, isEmail } = require('validator');
const AuthError = require('../errors/AuthError');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (link) => isURL(link),
      message: 'Некорректный url-адрес.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Некорректный email.',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, {
  versionKey: false,
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new AuthError('Передан неверный логин или пароль.');

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new AuthError('Передан неверный логин или пароль.');

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
