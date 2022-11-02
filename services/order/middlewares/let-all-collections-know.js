const { dbProducts, dbUsers } = require("../../../database/schemas.js")
const { errorResponce } = require("../../../server-responce/error.js")


//This middlewares creates references in the user and products collection in the database about the new order to be created. If something goes wrong, the order will not be created


function letAllCollectionsKnow() {

  return async (req, res, next) => {
    try {
      const orderID = req.body.orderID

      //update the particular product with the orderID just generated in the last middleware

      const product = await dbProducts.findById(req.body.productID)

      const productOrders = [...product.orders]

      productOrders.push(orderID)

      await dbProducts.findByIdAndUpdate(req.body.productID, { orders: productOrders })


      //update the users data
      const { orders } = await dbUsers.findById(req.body.userID)
      orders.push(orderID)

      await dbUsers.findByIdAndUpdate(req.body.userID, { orders: orders })

      next()
    }
    catch (err) {
      errorResponce(res, `${err || "Error Creating order"}`)
    }
  }
}


module.exports = { letAllCollectionsKnow }