const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const debug = require("debug")("app:route:user");
const router = express.Router();
const _ = require("lodash");
const { User, validate } = require("../models/User");

router.post("/", async (req, res) => {
    const { name, email, password } = req.body;
    const { error } = validate(req.body);
    if (error)
        return res
            .status(400)
            .send({ success: false, message: error.details[0].message });
    debug("Validated");
    let user = await User.findOne({ email: email });
    if (user) return res.status(400).send("User already exists");

    user = new User({
        name,
        email,
        password,
    });
    debug("User Created");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();
    debug("User Saved");
    token = user.generateAuthToken();
    res.header("x-auth-token", token).send(
        _.pick(user, ["_id", "name", "email"])
    );
});

module.exports = router;
