const nodemailer = require("nodemailer")


function sendMail(options) {

  const Transport = nodemailer.createTransport({
    auth: {
      user: process.env.mailtrapusername,
      pass: process.env.mailtrappass
    },
    host: "smtp.mailtrap.io",
    port: 465,
    secure: false
  })

  Transport.sendMail(options).then(() => {
    console.log("Email sent")
  }).catch((err) => {
    console.log(err)
  })

}

module.exports = { sendMail }