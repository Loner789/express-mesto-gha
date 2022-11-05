const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes');
const centralizedErrorHandler = require('./middlewares/centralizedErrorHandler');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandler);

app.listen(PORT);
