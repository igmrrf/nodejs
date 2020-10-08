const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const GenreRoutes = require("../routes/genre");
const CustomerRoutes = require("../routes/customer");
const MovieRoutes = require("../routes/movie");
const RentalRoutes = require("../routes/rental");
const UserRoutes = require("../routes/user");
const AuthRoutes = require("../routes/auth");
const Index = require("../routes");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(helmet());
  app.use(cors());
  app.use(express.static("public"));
  app.use("/", Index);
  app.use("/api/genres", GenreRoutes);
  app.use("/api/movies", MovieRoutes);
  app.use("/api/rentals", RentalRoutes);
  app.use("/api/customers", CustomerRoutes);
  app.use("/api/users", UserRoutes);
  app.use("/api/auth", AuthRoutes);
  app.use(error);
};
