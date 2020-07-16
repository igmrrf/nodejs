require("express-async-errors");
require("dotenv").config();
require("../database");
const debug = require("debug")("app:app");
const express = require("express");
const app = express();
require("../containers/errorHandler")(app);
require("../containers/routes")(app);

app.set("view engine", "pug");
app.set("views", "./views");
const PORT = process.env.PORT;

app.listen(PORT, () =>
    debug(`Server is running on port ${PORT} and on ${app.get("env")} grounds`)
);
