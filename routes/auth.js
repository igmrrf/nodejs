const bcrypt = require("bcrypt");
const config = require("config");
const joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/User");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({ email: email });
  if (!user) return res.status(400).send("Invalid email or password");
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");
  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
