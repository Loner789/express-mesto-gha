const router = require('express').Router();
const { cardValidation, idValidation } = require('../middlewares/validation');
const {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', cardValidation, createCard);
router.delete('/cards/:cardId', idValidation, deleteCard);
router.put('/cards/:cardId/likes', idValidation, addLike);
router.delete('/cards/:cardId/likes', idValidation, deleteLike);

module.exports = router;
