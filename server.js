const express = require("express");
const bodyParser = require("body-parser");
// const winston = require("winston");

const error = require("./middlewares/error");
require("express-async-errors"); // Wrap route handler code at runtime. (try/catch await code)

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require("./routes/dispatcherRoutes")(app);
require("./routes/stuartRoutes")(app);

// winston.add(winston.transports.MongoDB, {
//   db: keys.mongoURL,
//   level: "info",
// });

app.use(error);
module.exports = app;
