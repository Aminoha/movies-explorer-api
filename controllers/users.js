const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { ValidationError } = require('mongoose').Error;
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET = 'JWT_SECRET' } = process.env;
const { MY_SECRET_KEY } = require('../config');

const {
  InaccurateData,
  Conflict,
  NotFound,
} = require('../utils/errors/errors');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFound('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь по указанному _id не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        return next(
          new InaccurateData(
            'Переданы некорректные данные при обновлении данных профиля пользователя',
          ),
        );
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict('Пользователь с таким email уже существует'));
      }
      if (err instanceof ValidationError) {
        return next(
          new InaccurateData(
            'Переданы некорректные данные при создании пользователя',
          ),
        );
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : MY_SECRET_KEY,
        {
          expiresIn: '7d',
        },
      );
      res.send({ _id: token });
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateUser,
  getCurrentUser,
  login,
};
