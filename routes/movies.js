const router = require('express').Router();
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');

const {
  addMovieValidate,
  movieIdValidate,
} = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', addMovieValidate, addMovie);
router.delete('/:_id', movieIdValidate, deleteMovie);

module.exports = router;
