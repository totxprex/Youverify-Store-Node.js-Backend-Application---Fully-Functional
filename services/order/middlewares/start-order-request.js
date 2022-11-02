const { dbUsers, dbProducts } = require("../../../database/schemas.js")
const { errorResponce } = require("../../../server-responce/error.js")

//Validate order
function orderStart() {

  return async (req, res, next) => {
    const orderDetails = req.body

    try {

      //verify that the product exist in database
      const product = await dbProducts.findById(orderDetails.productID)

      if (!product) throw new Error("Product does not exist")

      //verify that user exist
      const user = await dbUsers.findById(orderDetails.userID)

      if (!user) throw new Error("User does not exist")

      //Memoizing user credentials for next middlewares to send order details
      req.body.email = user.email
      req.body.name = user.name
      req.body.productName = product.productName
      req.body.userID = user._id


      //If all checks out, set initial order status
      req.body.orderStatus = "pending"

      //If all is still going well, move to next middleware
      next()

    }
    catch (err) {
      errorResponce(res, `${err || "Error Creating order"}`)
    }
  }
}




module.exports = { orderStart }