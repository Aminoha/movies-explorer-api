const jwt = require('jsonwebtoken');

const { Unauthorized } = require('../utils/errors/errors');
const { MY_SECRET_KEY } = require('../config');

const { NODE_ENV, JWT_SECRET = 'JWT_SECRET' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : MY_SECRET_KEY);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
    return;
  }

  req.user = payload;
  next();
};
