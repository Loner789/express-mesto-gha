const BAD_REQUEST_ERROR = 400;
const NOT_FOUND_ERROR = 404;
const INTERNAL_SERVER_ERROR = 500;

const handleBadRequestError = (res, errorMessage) => {
  res.status(BAD_REQUEST_ERROR).send({ message: `Произошла ошибка. Переданы некорректные данные. ${errorMessage}` });
};

const handleNotFoundError = (res, errorMessage) => {
  res.status(NOT_FOUND_ERROR).send({ message: `Произошла ошибка. ${errorMessage}` });
};

const handleDefaultError = (res) => {
  res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
};

const handleError = (err, res, errorMessage) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    handleBadRequestError(res, errorMessage);
  } else if (err.name === 'NotFound') {
    handleNotFoundError(res, errorMessage);
  } else {
    handleDefaultError(res);
  }
};

module.export = { handleNotFoundError, handleDefaultError, handleError };
