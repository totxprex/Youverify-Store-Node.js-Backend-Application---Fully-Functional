const jwt = require("jsonwebtoken")
const { dbUsers } = require("../../../database/schemas.js")
const { errorResponce } = require("../../../server-responce/error.js")
const { responce } = require("../../../server-responce/success.js")
const { sendMail } = require("../../../utilities/nodemailer.js")
const { emitEmailPage } = require("../../../view/emailHtml.js")



const initiate = function () {

  return async (req, res) => {
    try {
      const email = req.body.email
      if (!email) throw new Error("Email not found")

      const user = await dbUsers.findOne({ email: email })

      if (!user) throw new Error("User not found")

      const token = jwt.sign({ email: email }, process.env.jwtkey, { expiresIn: "15m" })

      const options = {
        from: "youverify@gmail.com",
        to: req.body.email,
        text: `Hello ${user.name}\n\nYou requested a change to your password.\n\nHere is your password change token: ${token}`,
        subject: "Youverify Password Request Change",
        html: emitEmailPage(`Hello ${user.name}<br><br>You requested a change to your password.<br><br>Here is your password change token: ${token}`)
      }

      sendMail(options)

      responce(res, "Reset token sent to user email")
    }

    catch (err) {
      errorResponce(res, `${err || "Error verifying email"}`)
    }
  }
}

module.exports = { initiate }