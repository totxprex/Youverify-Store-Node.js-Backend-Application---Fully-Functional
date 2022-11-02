const { dbTransactions } = require("../../database/schemas.js")
const { errorResponce } = require("../../server-responce/error.js")
const { responce } = require("../../server-responce/success.js")
const { sendMail } = require("../../utilities/nodemailer.js")
const { emitEmailPage } = require("../../view/emailHtml.js")


function createPaymentTransaction() {


  return async (req, res) => {
    try {
      const orderDetails = req.body

      const paymentObject = {
        order: orderDetails.orderID,
        paymentStatus: "fulfilled",
        amount: orderDetails.amount,
      }

      await dbTransactions.create(paymentObject)

      const options = {
        from: "youverify@gmail.com",
        to: req.body.email,
        text: `Hello ${req.body.name}!\n\nThanks for ordering the ${req.body.productName} product.\n\nBelow is the order details:\n\n-Order Id: ${orderDetails.orderID}\n-Customer Id: ${req.body.userID}\n-Amount: ${orderDetails.amount}`,
        subject: `Your Order ${orderDetails.orderID}!`,
        html: emitEmailPage(`Hello ${req.body.name}!<br><br>Thanks for ordering the ${req.body.productName} product.<br><br>Below is the order details:<br><br>-Order Id: ${orderDetails.orderID}<br>-Customer Id: ${req.body.userID}<br>-Amount: ${orderDetails.amount}`)
      }

      sendMail(options)

      responce(res, "Order created. Check your email for details...", orderDetails)
    }
    catch (err) {
      errorResponce(res, `${err || "Error making payment"}`)
    }
  }
}

module.exports = { createPaymentTransaction }