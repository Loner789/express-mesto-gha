const mongoose = require('mongoose');
const Card = require('../models/card');
const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Ошибка валидации.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((element) => res.send(element));
      } else {
        res.status(BAD_REQUEST_ERROR).send({ message: 'Недостаточно прав для удаления карточки.' });
      }
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректный _id карточки.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректный _id карточки.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: 'Некорректный _id карточки.' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  addLike,
  deleteLike,
};
