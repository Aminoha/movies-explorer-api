require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_URL } = require('./config');
const limiter = require('./middlewares/limiter');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());

mongoose.connect(DB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.use(helmet());

app.use(requestLogger);

app.use(router);
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT);
