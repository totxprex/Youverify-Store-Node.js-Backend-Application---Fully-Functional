const express = require("express")
const productApp2 = express.Router()
const { dbProducts, dbUsers } = require("../../database/schemas.js")
const { errorResponce } = require("../../server-responce/error.js")
const { responce } = require("../../server-responce/success.js")



productApp2.patch("/edit/:userID/:productID", async (req, res) => {
  if (!req.body) return errorResponce(res, `No query`)

  //Exceptions to what an admin can edit in a product
  if (req.body._id || req.body.orders || req.body.tags || req.body.adminID || req.body.productImage || req.body.productName) return errorResponce(res, `No query`)


  //convert price to number
  if (req.body.price) req.body.price = Number(req.body.price)

  try {
    const userID = req.params.userID
    const productID = req.params.productID

    const user = await dbUsers.findById(userID)

    if (user.role !== "admin") throw new Error("Only Admins Can Edit a Product")

    const editedProduct = await dbProducts.findByIdAndUpdate(productID, req.body, { runValidators: true, new: true })

    responce(res, `${user.name} edited a product`, editedProduct)
  }

  catch (err) {
    errorResponce(res, `${err || "Error editing product"}`)
  }

})


module.exports = { productApp2 }