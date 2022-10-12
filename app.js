const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { handleNotFoundError } = require('./errors/errors');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6345c9d15ddb63ed311ff8d5',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => handleNotFoundError(res, 'Запрошен несуществующий роут.'));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT);
