const request = require('supertest')
const {Genre} = require('../../models/Genre')
const {User} = require('../../models/User')
let server;
let token;
describe('auth', () => {
    beforeEach(() => {
        server = require('../../src')
        token = new User().generateAuthToken()

    })
    afterEach(async () => {
        await Genre.deleteOne();
        server.close()
    })

    const exec = () =>
        request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: 'genre1'})


    it("should return 401 if no token", async () => {
        token = "";
        const res = await exec()
        expect(res.status).toBe(401)
    })
    it("should return 400 if token is set to null", async () => {
        token = null;
        const res = await exec()
        expect(res.status).toBe(400)
    })
    it("should return 400 if token is invalid", async () => {
        token = "kjdkalhkdjfhakdaj";

        const res = await exec()
        expect(res.status).toBe(400)
    })
    it("should return 200 if token is valid", async () => {


        const res = await exec()
        expect(res.status).toBe(200)
    })

})
