const express = require("express")
const productApp3 = express.Router()
const { dbProducts, dbUsers } = require("../../database/schemas.js")
const { errorResponce } = require("../../server-responce/error.js")
const { responce } = require("../../server-responce/success.js")


//Finding by ID and advanced querying

productApp3.get("/find/advanced/:userID", async (req, res) => {

  try {
    const userID = req.params.userID

    const user = await dbUsers.findById(userID)
    if (user.role !== "admin") throw new Error("Only Admins Can Edit a Product")

    const excludedFields = ["limit", "page", "sort", "fields"]

    const query = { ...req.query }

    excludedFields.forEach(function (e) {
      delete query[e]
    })

    const filteredQuery = JSON.stringify(query).replace(/\b(lt|lte|gt|gte)\b/g, (match) => `$${match}`)

    const startFinding = dbProducts.find(JSON.parse(filteredQuery))

    if (req.query.page) {
      const limit = Number(req.query.limit)
      const skip = Number(req.query.page - 1) * Number(req.query.limit)

      startFinding.skip(skip).limit(limit)
    }

    if (req.query.sort) {
      console.log("in")
      startFinding.sort(req.query.sort.replaceAll(",", ` `))
    }

    if (req.query.fields) {
      startFinding.select(req.query.fields.replaceAll(",", ` `))
    }

    const data = await startFinding

    responce(res, "Found product(s)", data)

  }

  catch (err) {
    errorResponce(res, `${err || "Error finding product"}`)
  }

})





//find a product by ID params
productApp3.get("/find/:productID", async (req, res) => {
  try {
    const id = req.params.productID

    const data = await dbProducts.findById(id)

    responce(res, "Found a product by ID", data)
  }

  catch (err) {
    errorResponce(res, `${err || "Error finding product"}`)
  }
})




//search a product by search tag

productApp3.get("/tagfind", async (req, res) => {
  try {
    const tag = req.query.tag

    const data = await dbProducts.find({ tags: tag })

    responce(res, "Found product(s) by tag name", data)
  }

  catch (err) {
    errorResponce(res, `${err || "Error finding product"}`)
  }
})









module.exports = { productApp3 }