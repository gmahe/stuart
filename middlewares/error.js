// const winston = require("winston");

module.exports = function (err, req, res, next) {
  // winston.error(err.message, err);

  // TODO
  // Make more specified error message.

  res.status(500).send({ error: "Something has failed." });
};
