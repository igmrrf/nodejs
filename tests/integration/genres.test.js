const request = require('supertest')
const {Genre} = require('../../models/Genre')
const {User} = require('../../models/User')
const mongoose = require('mongoose')
let server;
describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../src');
    })
    afterEach(async () => {
        await Genre.deleteOne();
        server.close();



    })
    describe('GET/', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'}
            ])
            const res = await request(server).get('/api/genres')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy()
        })
    })

    describe('GET/:id', () => {
        it('should return genre with the id if valid ID', async () => {
            const genre = new Genre({name: 'genre1'})
            await genre.save()


            const res = await request(server).get(`/api/genres/${genre._id}`)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("name", genre.name)

        })


        it('should return status 404 with if invalid ID', async () => {

            const res = await request(server).get(`/api/genres/1`)
            expect(res.status).toBe(404)

        })
        it('should return status 404 with if genre isn"t found', async () => {
            const id = mongoose.Types.ObjectId()
            const res = await request(server).get(`/api/genres/id`)
            expect(res.status).toBe(404)

        })
    })


    describe("POSTS", () => {
        // Define the happy path, and in each test, we change
        // one parameter that clearly aligns with the name of the test
        let token;
        let name;
        beforeEach(() => {
            token = new User().generateAuthToken()
            name = "genre1"
        })
        const exec = async () => request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name})

        it("should return 401 if c lient isn't logged in", async () => {
            token = '';
            const res = await exec()
            expect(res.status).toBe(401)
        })

        it("should return 400 if genre is less than 5 characters", async () => {
            name = "1234"
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it("should return 400 if genre is more than 50 characters", async () => {
            name = new Array(72).join("a")
            const res = await exec()
            expect(res.status).toBe(400)
        })

        it("should save genre if valid", async () => {
            await exec()
            const genre = await Genre.find({name})
            expect(genre).not.toBeNull()
        })
        it("should return saved genre", async () => {
            const result = await exec()
            expect(result.body).toHaveProperty("name")
        })


    })
    describe('PUT /:id', () => {
        let token;
        let newName;
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({name: newName});
        }

        beforeEach(async () => {
            // Before each test we need to create a genre and
            // put it in the database.
            genre = new Genre({name: 'genre1'});
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id;
            newName = 'updatedName';
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            newName = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            newName = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 404 if id is invalid', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if genre with the given id was not found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should update the genre if input is valid', async () => {
            await exec();

            const updatedGenre = await Genre.findById(genre._id);

            expect(updatedGenre.name).toBe(newName.toLowerCase());
        });

        it('should return the updated genre if it is valid', async () => {
            const res = await exec();


            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', "genre1");
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let genre;
        let id;

        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .send();
        }

        beforeEach(async () => {
            // Before each test we need to create a genre and
            // put it in the database.
            genre = new Genre({name: 'genre1'});
            await genre.save();

            id = genre._id;
            token = new User({isAdmin: true}).generateAuthToken();
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 403 if the user is not an admin', async () => {
            token = new User({isAdmin: false}).generateAuthToken();

            const res = await exec();

            expect(res.status).toBe(403);
        });

        it('should return 404 if id is invalid', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with the given id was found', async () => {
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should delete the genre if input is valid', async () => {
            await exec();

            const genreInDb = await Genre.findById(id);

            expect(genreInDb).toBeNull();
        });

        it('should return the removed genre', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });
})


