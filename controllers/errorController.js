const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrordDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  // console.log(errors);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError(`Invalid token Please login again`, 401);

const handleJWTExpiredError = () =>
  new AppError(`Your token has expired! please login again`, 401);

const sendErrorDev = (err, req, res) => {
  // for API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // for Rendering Website
  console.error('Error 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // 1) FOR the API
    if (err.isOperational) {
      // Operational, trusted error: send message to client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        msg: err.message,
      });
    }
    // Programming or other unknown error: dont leak error detatils
    // 1) Log error
    console.error(`ERROR 🪲`, err);

    // 2) send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
      msg: 'Something went very wrong',
    });
  }

  // 2) For Rendering website
  // Operational, trusted error: send message to client

  if (err.isOperational) {
    // Operational, trusted error: send message to client
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
      message: err.message,
    });
  }

  // Programming or other unknown error: dont leak error detatils
  // 1) Log error
  console.error(`ERROR 🪲`, err);

  // 2) send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Some thing went Wrong',
    message: 'Please try again later',
    msg: 'Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Something went Wrong!';

  if (process.env.NODE_ENV === 'devlopment') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);

    if (err.code === 11000) err = handleDuplicateFieldsDB(err);

    if (err._message === 'Validation failed')
      err = handleValidationErrordDB(err);

    if (err.name === 'JsonWebTokenError') err = handleJWTError();

    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();

    sendErrorProd(err, req, res);
  }
};
