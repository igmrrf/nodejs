const auth = require('../../../middleware/auth')
const {User} = require("../../../models/User")
const mongoose = require('mongoose')


describe("auth middleware", () => {
    it("should populate req.user with the payload of a valid JWT", () => {
        const payload = {_id: mongoose.Types.ObjectId().toHexString(), isAdmin: true};
        const token = new User(payload).generateAuthToken()
        const req = {
            header: jest.fn().mockReturnValue(token)
        }
        const res = {}
        const next = jest.fn()
        auth(req, res, next);
        expect(req.user).toBeDefined()
        expect(req.user).toHaveProperty('isAdmin',true)


    })

})

