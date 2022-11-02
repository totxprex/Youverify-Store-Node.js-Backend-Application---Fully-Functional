const { errorResponce } = require("../server-responce/error.js")
const bcrypt = require("bcryptjs")

function hashPassword() {

  return async function (req, res, next) {
    if (req.body.password) {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12)
        req.body.password = hashedPassword
        next()
      }
      catch {
        errorResponce(res, "Internal server error")
      }
    }
    else next()
  }
}

module.exports = { hashPassword }