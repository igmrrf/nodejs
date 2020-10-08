const express = require("express");
const { Genre } = require("../models/Genre");
const Auth = require("../middleware/auth");
const debug = require("debug")("app:route:movie");
const router = express.Router();
const { Movie, validate } = require("../models/Movie");

router.get("/", async (req, res) => {
    const movies = await Movie.find().sort("name");
    res.send(movies);
});

router.get("/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
        return res
            .status(404)
            .send({ success: false, message: "movie could not be found" });
    res.status(200).send(movie);
});

router.post("/", Auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res
            .status(400)
            .send({ success: false, message: error.details[0].message });
    debug("Validated");
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Invalid genre Id");
    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });
    await movie.save();
    res.send(movie);
});

router.put("/:id", Auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res
            .status(400)
            .send({ success: false, message: error.details[0].message });
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id);
        if (!movie)
            return res.status(404).send({
                success: false,
                message: "movie could not be found",
            });
        res.send(movie);
    } catch (e) {
        debug(e);
        res.send({
            status: false,
            message: "There was an error",
        });
        return;
    }
});

router.delete("/:id", Auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie)
        return res
            .status(404)
            .send({ success: false, message: "movie could not be found" });

    res.status(200).send(movie);
});

module.exports = router;
