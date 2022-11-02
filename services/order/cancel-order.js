const express = require("express")
const { dbOrders } = require("../../database/schemas.js")
const { errorResponce } = require("../../server-responce/error.js")
const { responce } = require("../../server-responce/success.js")

const orderApp3 = express.Router()



//A route to cancel an order order

orderApp3.delete("/cancel/:orderID", async (req, res) => {

  try {
    const orderID = req.params.orderID

    const order = await dbOrders.findById(orderID)

    //disregard request if no order or the order is already completed

    if (!order || order.orderStatus === "completed" || order.orderStatus === "cancelled") return errorResponce(res, "Order already completed/cancelled or does not exist")


    await dbOrders.findByIdAndUpdate(orderID, { orderStatus: "cancelled" })

    responce(res, "Order cancelled")
  }

  catch (err) {
    errorResponce(res, "Error cancelling order")
  }

})






module.exports = { orderApp3 }