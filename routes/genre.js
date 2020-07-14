const express = require("express");
const asyncMiddleware = require("../middleware/async");
const Auth = require("../middleware/auth");
const Admin = require("../middleware/admin");
const debug = require("debug")("app:route:genre");
const router = express.Router();
const { Genre, validate } = require("../models/Genre");

router.get(
    "/",
    asyncMiddleware(async (req, res) => {
        const genre = await Genre.find().sort("name");
        res.send(genre);
    })
);

// router.get("/", async (req, res) => {
//     Genre.find((err, genre) => {
//         if (err) return res.status(500).send("Something Broke 2");
//         return res.status(200).send(genre);
//     });
// });

router.get(
    "/:id",
    asyncMiddleware(async (req, res) => {
        const genre = await Genre.findById(req.params.id);
        if (!genre)
            return res
                .status(404)
                .send({ success: false, message: "Genre could not be found" });
        res.status(200).send(genre);
    })
);

router.post(
    "/",
    Auth,
    asyncMiddleware(async (req, res) => {
        const { error } = validate(req.body);
        if (error)
            return res
                .status(400)
                .send({ success: false, message: error.details[0].message });
        debug("Validated");
        const genre = new Genre({
            name: req.body.name,
        });
        await genre.save();
        res.send(genre);
    })
);

router.put(
    "/:id",
    Auth,
    asyncMiddleware(async (req, res) => {
        const { error } = validate(req.body);
        if (error)
            return res
                .statusCode(400)
                .send({ success: false, message: error.details[0].message });
        try {
            const genre = await Genre.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
            });
            if (!genre)
                return res
                    .status(404)
                    .send({
                        success: false,
                        message: "Genre could not be found",
                    });
            res.send(genre);
        } catch (e) {
            debug(e);
            res.send({
                status: false,
                message: "There was an error",
            });
            return;
        }
    })
);

router.delete(
    "/:id",
    [Auth, Admin],
    asyncMiddleware(async (req, res) => {
        const genre = await Genre.findByIdAndRemove(req.params.id);
        if (!genre)
            return res
                .status(404)
                .send({ success: false, message: "Genre could not be found" });

        res.status(200).send(genre);
    })
);

module.exports = router;
