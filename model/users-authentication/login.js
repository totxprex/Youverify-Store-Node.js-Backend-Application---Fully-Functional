const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { dbUsers } = require("../../database/schemas.js")
const { errorResponce } = require("../../server-responce/error.js")
const { responce } = require("../../server-responce/success.js")


const login = function () {
  return async (req, res) => {
    if (!req.body.loginPassword || !req.params.username) return errorResponce(res, "Incorrect user details")

    try {
      const username = req.params.username
      const password = req.body.loginPassword

      const startFindingUser = dbUsers.findOne({ username: username }).select("+password")

      const user = await startFindingUser

      if (!user) return errorResponce(res, "Username or password incorrect")

      if (!user.active) return errorResponce(res, "User account inactive")

      const verify = await bcrypt.compare(password, user.password)

      if (!verify) return errorResponce(res, "Username or password incorrect")

      const token = jwt.sign({ username: username }, process.env.jwtkey, {
        expiresIn: "24h"
      })

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: false,
        secure: false,
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      })

      responce(res, "User verified and logged in", { username: username, token: token })
    }

    catch {
      errorResponce(res, "Error loggin in user")
    }

  }
}




module.exports = { login }
