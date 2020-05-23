/* eslint-disable no-unused-vars */
const card = require('../models/cards');
const { BadRequestError } = require('../constructorError/error');
const { IdNotFoundError } = require('../constructorError/error');


module.exports.getCards = (req, res, next) => {
  card
    .find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      const err = new BadRequestError(`Карточки с id: ${req.params.cardId} не существуют`);
      return next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;

  const { name, link } = req.body;
  card
    .create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch(next);
  // .catch(() => {
  //   const err = new BadRequestError('Не возможно создать карточку');
  //   return next(err);
  // });
};
module.exports.deleteCard = (req, res, next) => {
  card
    .findById(req.params.id)
    // eslint-disable-next-line consistent-return
    .then((cardWithId) => {
      if (cardWithId) {
        const { owner } = cardWithId;
        return owner;
      }
    })
    .then((owner) => {
      if (req.user._id === owner.toString()) {
        return card.findByIdAndRemove(req.params.id);
      }
      const err = new BadRequestError(
        'Чтобы удалить карточку,вам необходимо быть её владельцем',
      );
      return next(err);
    })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
    })
    .catch(() => {
      const err = new BadRequestError(`Карточки с id: ${req.params.id} не существует`);
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true })
    .then((like) => {
      if (like) {
        res.send({ data: like });
      } else {
        throw new IdNotFoundError(`Карточки с id: ${req.params.cardId} не существует`);
      }
    })
    // eslint-disable-next-line no-undef
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((like) => {
      if (like) {
        res.send({ data: like });
      } else {
        throw new IdNotFoundError(`Карточки с id: ${req.params.cardId} не существует`);
      }
    })
    .catch(next);
};
