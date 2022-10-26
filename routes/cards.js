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
router.delete('/cards/:_id', idValidation, deleteCard);
router.put('/cards/:_id/likes', idValidation, addLike);
router.delete('/cards/:_id/likes', idValidation, deleteLike);

module.exports = router;
