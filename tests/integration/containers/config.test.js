const configurations = require('../../../containers/config')
const config = require('config')
const express = require('express')
let app;
describe("Configurations", () => {
    beforeEach(() => app = express())


    it("throws an error is mail.password is not defined", () => {
        configurations(app)
        if (!config.get("vividly_jwtkey")) {
            throw new Error("FATAL ERROR: JWTKEY is not defined");
        }
    })

    it("throws an erro if mail.password is not define", () => {
        if (!config.get("mail.password")) {
            throw new Error("FATAL ERROR: Mail Password is not defined");
        }
    })

    it("throws an erro if mail.password is not define", () => {
        if (app.get("env") === "development") {
            app.use(morgan("tiny"));
            debug("Morgan Enabled");
        }
    })

})
