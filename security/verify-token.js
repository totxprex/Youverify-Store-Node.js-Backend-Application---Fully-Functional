const { errorResponce } = require("../server-responce/error.js")
const jwt = require("jsonwebtoken")

function verifyToken() {

  return (req, res, next) => {

    jwt.verify(req.params.token, process.env.jwtkey, (err, obj) => {
      if (err) return errorResponce(res, "User authentication failed")
      else {
        req.userObj = obj
        next()
      }
    })

  }
}

module.exports = { verifyToken }