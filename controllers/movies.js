const { ValidationError, CastError } = require('mongoose').Error;
const Movie = require('../models/movie');
const {
  InaccurateData,
  NotFound,
  NotPermission,
} = require('../utils/errors/errors');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      console.log(err);
      if (err instanceof ValidationError) {
        return next(
          new InaccurateData('Переданы некорректные данные при создании фильма'),
        );
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFound('Фильм с указанным _id не найдена');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new NotPermission('Нет прав на удаление чужой картчоки фильма');
      }
      return movie
        .deleteOne()
        .then(() => res.send({ message: 'Фильм удален' }))
        .catch(next);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return next(new InaccurateData('Некорректный id карточки фильма'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  addMovie,
  deleteMovie,
};
