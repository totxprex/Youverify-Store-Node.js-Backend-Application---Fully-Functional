const express = require("express")

const orderApp = express.Router()

//importing our order middlewares
const { createOrder } = require("./middlewares/create-order.js")
const { orderStart } = require("./middlewares/start-order-request.js")
const { createPaymentTransaction } = require("../payment/transactions.js")
const { letAllCollectionsKnow } = require("./middlewares/let-all-collections-know")


orderApp.post("/create", orderStart(), createOrder(), letAllCollectionsKnow(), createPaymentTransaction())







module.exports = { orderApp }