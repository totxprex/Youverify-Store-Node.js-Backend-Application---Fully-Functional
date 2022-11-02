const express = require("express")
const sharp = require("sharp")


const { s3 } = require("../../AWS/aws-user.js")
const { PutObjectCommand } = require("@aws-sdk/client-s3")
const productApp = express.Router()


const { dbProducts, dbUsers } = require("../../database/schemas.js")
const { errorResponce } = require("../../server-responce/error.js")
const { responce } = require("../../server-responce/success.js")
const { upload } = require("../../AWS/aws-user")



//An admin ID must be provided to add a product to the database. Images added with every product to AWS

productApp.post("/add/:adminId", upload.single("productImage"), async (req, res) => {

  try {
    if (!req.file?.buffer) throw new Error("Product image must be included")

    if (!req.body.productName) throw new Error("Product details not included")

    const product = req.body
    const adminID = req.params.adminId


    const filename = `product-${req.body.productName.replaceAll(` `, `-`)}-${adminID}-${Date.now()}.jpeg`

    const user = await dbUsers.findById(adminID)

    if (user.role !== "admin") throw new Error("Only Admins Can Add a Product")

    product.adminID = adminID
    product.price = Number(product.price)
    product.productImage = filename


    //converting the products tags to an Array 
    product.tags = product.tags.replaceAll(` `, "").split(",")


    const buffer = await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toBuffer()

    //add product to aws bucket
    const command = new PutObjectCommand({
      Key: filename,
      mimetype: req.file.buffer,
      Body: buffer,
      Bucket: process.env.awsBucketName
    })

    await dbProducts.create(product)

    await s3.send(command)

    responce(res, `${user.name} added a product to the pool`, product)

  }

  catch (err) {
    errorResponce(res, `${err || "Error creating product"}`)
  }

})




module.exports = { productApp }