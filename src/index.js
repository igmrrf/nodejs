require("express-async-errors");
const winston = require("winston");
const config = require("config");
const joi = require("@hapi/joi");
joi.objectId = require("joi-objectid")(joi);
require("../database");
const debug = require("debug")("app:index");
const cf = require("../config/config");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const GenreRoutes = require("../routes/genre");
const CustomerRoutes = require("../routes/customer");
const MovieRoutes = require("../routes/movie");
const RentalRoutes = require("../routes/rental");
const UserRoutes = require("../routes/users");
const AuthRoutes = require("../routes/auth");
const Index = require("../routes");
const error = require("../middleware/error");

debug(cf.jwt);
debug(cf.port);

winston.add(winston.transports.File, {filename: "logfile.log"})

const app = express();
const PORT = cf.port;
if (!config.get("vividly_jwtkey")) {
    console.error("FATAL ERROR: JWTKEY is not defined");
    process.exit(1);
}

if (!config.get("mail.password")) {
    console.error("FATAL ERROR: Mail Password is not defined");
    process.exit(1);
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(express.static("public"));

debug("Application Name: " + config.get("name"));
debug("Mail Password: " + config.get("mail.password"));
if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    debug("Morgan Enabled");
}

app.set("view engine", "pug");
app.set("views", "./views");

app.use("/", Index);
app.use("/api/genres", GenreRoutes);
app.use("/api/movies", MovieRoutes);
app.use("/api/rentals", RentalRoutes);
app.use("/api/customers", CustomerRoutes);
app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRoutes);

app.use(error);

app.listen(PORT, () =>
    debug(`Server is running on port ${PORT} and on ${app.get("env")} grounds`)
);
