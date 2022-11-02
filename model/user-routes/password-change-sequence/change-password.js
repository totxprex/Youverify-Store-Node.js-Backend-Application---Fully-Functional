const jwt = require("jsonwebtoken")
const { dbUsers } = require("../../../database/schemas.js")
const { errorResponce } = require("../../../server-responce/error.js")
const { responce } = require("../../../server-responce/success.js")



function changePassword() {
  return async (req, res) => {
    try {
      const token = req.params.token
      const newPass = req.body.password

      jwt.verify(token, process.env.jwtkey, async (err, obj) => {
        if (err) throw new Error("Token authentication failed")

        const email = obj.email

        if (!email) throw new Error("Email not found")

        await dbUsers.findOneAndUpdate({ email: email }, {password: newPass})

        responce(res, "Password change successful")

      })
    }
    catch (err) {
      errorResponce(res, `${err || "Internal server error"}`)
    }
  }
}

module.exports = { changePassword }