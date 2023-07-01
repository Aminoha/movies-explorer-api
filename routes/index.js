const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { signinValidate, signupValidate } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');
const { NotFound } = require('../utils/errors/errors');

router.post('/signin', signinValidate, login);
router.post('/signup', signupValidate, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use('*', (req, res, next) => next(new NotFound('Ресурс не найден')));

module.exports = router;
