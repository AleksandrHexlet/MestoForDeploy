const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, deleteCard, dislikeCard, likeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), deleteCard);
router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object()
      .keys({
        cardId: Joi.string().alphanum().length(24),
      })
      .unknown(true),
  }),
  dislikeCard,
);
router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  likeCard,
);

module.exports = router;
