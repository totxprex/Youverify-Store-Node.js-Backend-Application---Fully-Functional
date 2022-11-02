const express = require("express")
const dotenv = require("dotenv")
const app = express()
const mongoose = require("mongoose")
const morgan = require("morgan")
const cors = require("cors")
const helmet = require("helmet")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
dotenv.config({ path: "./config.env" })


const apiVersion = process.env.apiVersion


const { signUp } = require("./model/users-authentication/signup.js")
const { login } = require("./model/users-authentication/login.js")
const { verifyKey } = require("./security/verify-key.js")
const { hashPassword } = require("./security/encrypt-password.js")
const { verifyToken } = require("./security/verify-token")
const { userApp } = require("./model/user-routes/user.js")
const { initiate } = require("./model/user-routes/password-change-sequence/initiate.js")
const { changePassword } = require("./model/user-routes/password-change-sequence/change-password.js")
const { userUploadApp } = require("./AWS/aws-user.js")
const { getAwsUrl } = require("./AWS/getSignedURL.js")
const { productApp } = require("./services/product/create-a-product")
const { productApp2 } = require("./services/product/edit-a-product.js")
const { productApp3 } = require("./services/product/find-a-product.js")
const { orderApp } = require("./services/order/create-order.js")
const { orderApp2 } = require("./services/order/complete-order.js")
const { orderApp3 } = require("./services/order/cancel-order.js")


app.listen(5500, process.env.testserverDomain, () => {
  console.log(`Youverify server started at ${process.env.testserverDomain}`)
})

//connecting mongodb using mongoose
mongoose.connect(process.env.mongodb, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Youverify database connected")).catch((err) => {
  console.log(err)
})



//first-contact middlewares
app.use(morgan("dev"))
app.use(express.json())
app.use(express.static("./public"))
app.use(cors({
  methods: ["POST", "GET", "PATCH", "DELETE", "PUT"],
  credentials: true,
  origin: "*"
}))
app.use(helmet())



//custom middlewares for authentication and verification

//verify custom key for all routes
app.param("key", verifyKey())

//Hash a password on arrival to the server and before moving to next middleware
app.use(hashPassword())



//verify token on arrival
app.param("token", verifyToken())





//sign-up a user
app.post(`/youverify/api/${apiVersion}/:key/signup`, signUp())



//login a user by verifying and decrypting hashed password and then sending a unique token for further access to server's resources
app.post(`/youverify/api/${apiVersion}/:key/login/:username`, login())




//The user app Router
app.use(`/youverify/api/${apiVersion}/:key/:token/route/user`, userApp)




//Password change sequence

//initiate password change by verifying user email and sending unique token to user's email address
app.post(`/youverify/api/${apiVersion}/:key/route/pass/change/initiate`, initiate())


//change password with token
app.patch(`/youverify/api/${apiVersion}/:key/route/pass/change/change/:token`, changePassword())




//Router for user profile picture upload
app.use(`/youverify/api/${apiVersion}/:key/route/user/pic/:token`, userUploadApp)



//get a signed url for any image in youverify AWS Bucket
app.get(`/youverify/api/${apiVersion}/:key/aws/signed/:filename/:token`, getAwsUrl())






//Product Serveices Router - Only Admins in Database Can Access the Product pool to add, delete, and modify a product

//create a product
app.use(`/youverify/api/${apiVersion}/:key/route/product/admin/:token`, productApp)

//Edit a product
app.use(`/youverify/api/${apiVersion}/:key/route/product/admin/:token`, productApp2)

//For querying and finding products. Advanced query for more advanced search
app.use(`/youverify/api/${apiVersion}/:key/route/product/admin/:token`, productApp3)




//Router for Order Sequence

//Create an order sequence
app.use(`/youverify/api/${apiVersion}/route/:key/:token/order`, orderApp)


//Complete an order sequence
app.use(`/youverify/api/${apiVersion}/route/:key/:token/order`, orderApp2)

//Cancel an order
app.use(`/youverify/api/${apiVersion}/route/:key/:token/order`, orderApp3)









































app.use((_req, res) => {
  res
    .status(404)
    .header({ "content-type": "application/json" })
    .send("Route not found in this server")
})