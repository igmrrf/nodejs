# Node JS Complete Server Implementation

1. JavaScript(Language)
2. Node Js(Platform)
3. MongoDB(Database)
4. Jade/Pug(View)

## Project Structure

    |-config
        config.js
        custom-environment-variable.json
        default.json
        development.json
        production.json
    |-database
        index.js
    |-middleware
        auth.js
        logger.js
    |-models
        Customer.js
        Genre.js
        Movie.js
        Rental.js
        User.js
    |-public
        readme.md
        readme.txt
    |-routes
        auth.js
        customer.js
        genre.js
        index.js
        movie.js
        rental.js
        user.js
    |-src
        index.js
    |-views
        auths.pug
        customers.pug
        genres.pug
        index.pug
        movies.pug
        rentals.pug
        users.pug
    .gitignore
    package.json
    package-lock.json
    README.md

## Dependencies

        "@hapi/joi": "^17.1.1",
        "bcrypt": "^5.0.0",
        "body-parser": "^1.19.0",
        "config": "^3.3.1",
        "cors": "^2.8.5",
        "debug": "^4.1.1",
        "dotenv": "^8.2.0",
        "express": "^4.17.1",
        "fawn": "^2.1.5",
        "helmet": "^3.23.3",
        "joi-objectid": "^3.0.1",
        "jsonwebtoken": "^8.5.1",
        "lodash": "^4.17.19",
        "mongoose": "^5.9.21",
        "morgan": "^1.10.0",
        "pug": "^3.0.0"

Run the following in your terminal to install all the dependencies

```shell
npm install
```

But if you wish to install them yourself, make sure to add the version e.g

```shell
npm install lodash@4.17.19
```

# Starting the Server

Run the following to start,

```shell
npm start
```

Run this to start the server with all development features

```shell
npm run start:dev
```

## Endpoints

1. https://api.igmrrf.com/
2. https://api.igmrrf.com/auths
3. https://api.igmrrf.com/customers
4. https://api.igmrrf.com/genres
5. https://api.igmrrf.com/movies
6. https://api.igmrrf.com/rentals
7. https://api.igmrrf.com/users

### 1. Landing Route ("https://api.igmrrf.com/")

Request: No request headers or body is required

Response: returns a randomly generated jsonwebtoken

### 2. Auth Route("https://api.igmrrf.com/auths")
