const { dbOrders } = require("../../../database/schemas.js")
const { errorResponce } = require("../../../server-responce/error.js")

const createOrder = function () {

  return async (req, res, next) => {

    try {

      const order = req.body

      const orderCreated = await dbOrders.create(order)

      req.body.orderID = orderCreated._id

      next()
    }

    catch (err) {
      errorResponce(res, `${err || "Error Creating order"}`)
    }
  }
}

module.exports = { createOrder }