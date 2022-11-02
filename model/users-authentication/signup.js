const { dbUsers } = require("../../database/schemas.js")
const { errorResponce } = require("../../server-responce/error.js")
const { responce } = require("../../server-responce/success.js")
const { sendMail } = require("../../utilities/nodemailer.js")
const { emitEmailPage } = require("../../view/emailHtml.js")


const signUp = function () {

  return async (req, res) => {
    if (!req.body.name) return errorResponce(res, "Details incorrect")

    try {
      await dbUsers.create(req.body)

      const options = {
        from: "youverify@gmail.com",
        to: req.body.email,
        text: `Hello ${req.body.name}!\n\nThanks for signing up to Youverify store, your one stop platform for premium products. Browse our array of product catalogues, purchase, and ensure you never miss out on trending products!`,
        subject: "Welcome to Youverify Store!",
        html: emitEmailPage(`Hello ${req.body.name}!<br><br>Thanks for signing up to Youverify store, your one stop platform for premium products. Browse our array of product catalogues, purchase, and ensure you never miss out on trending products!`)
      }

      sendMail(options)
      responce(res, "User created")
    }
    catch (err) {
      errorResponce(res, err.message)
    }
  }
}


module.exports = { signUp }