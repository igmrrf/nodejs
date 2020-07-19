require("dotenv").config();
const winston = require("winston");
const express = require("express");
const app = express();

require("../containers/logging")();
require("../containers/database")();
require("../containers/routes")(app);
require("../containers/config")(app);
require("../containers/validate")();

app.set("view engine", "pug");
app.set("views", "./views");

const PORT = process.env.PORT;
app.listen(PORT, () =>
  winston.info(
    `Server is running on port ${PORT} and on ${app.get("env")} grounds`
  )
);
