const express = require("express")
const { dbOrders } = require("../../database/schemas.js")
const { errorResponce } = require("../../server-responce/error.js")
const { responce } = require("../../server-responce/success.js")

const orderApp2 = express.Router()



//A route that updates a pending order status and marks it as complete

orderApp2.patch("/complete/:orderID", async (req, res) => {

  try {
    const orderID = req.params.orderID

    const order = await dbOrders.findById(orderID)

    //ensure server does not complete an already complete order or a cancelled order
    if (!order || order.orderStatus === "completed" || order.orderStatus === "cancelled") return errorResponce(res, "Order already completed/cancelled or does not exist")


    await dbOrders.findByIdAndUpdate(orderID, { orderStatus: "completed" })

    responce(res, "Order marked as complete")
  }

  catch (err) {
    errorResponce(res, "Error completing order")
  }

})






module.exports = { orderApp2 }