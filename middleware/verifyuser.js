const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                console.log("Any"+err)
                return res.status(403).json({ message: "Invalid Token" })
            }
            console.log("Out if!!!!!!!!: "+ user)
            req.user = user;
            next()
        })
    }
    else{
        return res.status(404).json({ message: "Please provide authorization Token" })
    }
}

module.exports = verifyUser;