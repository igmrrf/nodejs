const { User } = require("../../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("Testing the User model", () => {
  it("returns an encripted token", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("vividly_jwtkey"));
    expect(decoded).toMatchObject(payload);
  });
});
