const jwt = require("jsonwebtoken");

function auth(req, res, next) {
    const token = req.headers("x-auth-token");
    if (!token) return res.status(401).send("Access Denied. No token provided");
    try {
        const decoded = jwt.verify(token, config.get("vividly_jwtkey"));
        req.user = decoded;
        next();
    } catch (ex) {
        return res.status(400).send("Invalid Token");
    }
}
module.exports = auth;
 