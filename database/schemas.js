const mongoose = require("mongoose")
const validator = require("validator")


const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
    maxlength: 300
  },
  email: {
    type: String,
    validate: {
      validator: validator.isEmail,
      message: "Error validating user email"
    }
  },
  mobile: {
    type: String,
    default: "",
    trim: true
  },
  username: {
    type: String,
    required: [true, "A username must be specified"],
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false,
    required: [true, "A password must be specified"]
  },
  orders: [{
    type: mongoose.Schema.ObjectId,
    ref: "orders"
  }],
  transactions: [{
    type: mongoose.Schema.ObjectId,
    ref: "transactions"
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  role: {
    type: String,
    enum: ["customer", "admin", "ceo"],
    default: "customer"
  },
  active: {
    type: Boolean,
    default: true
  },
  photo: {
    type: String,
    default: ""
  },
  products: [{
    type: mongoose.Schema.ObjectId,
    ref: "products"
  }]
})

usersSchema.index({ username: 1 }, { unique: true })





const ordersSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    required: [true, "No user in order"]
  },
  productID: {
    type: mongoose.Schema.ObjectId,
    ref: "products",
    required: [true, "No product in order"]
  },
  orderStatus: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    required: [true, "An order must have a status"]
  },
  orderCreationDate: {
    type: Date,
    default: Date.now()
  },
  amount: {
    type: Number,
    required: [true, "An order must have an amount"]
  }
})



const productsSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, "A product must have a name"],
    maxlength: 500,
    trim: true
  },
  price: {
    type: Number,
    required: [true, "A product must have a price"],
    max: 1000000
  },
  rating: {
    type: Number,
    default: 1,
    max: 6
  },
  shortDescription: {
    type: String,
    required: [true, "A product must have a short description"],
    maxlength: 5000,
  },
  longDescription: {
    type: String,
    maxlength: 1200,
    trim: true,
    default: "Nil"
  },
  externalStoreName: String,
  website: String,
  tags: [String],
  productImage: {
    type: String,
    trim: true,
    required: [true, "A product image must be included"]
  },
  orders: [{
    type: mongoose.Schema.ObjectId,
    ref: "orders"
  }],
  adminID: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    required: [true, "A product must have an adminID"]
  }
})

productsSchema.index({ productName: 1 }, { unique: true })




//A mongoose middleware that intercepts every product added and then adds a reference to it in the Users database

productsSchema.post("save", async (obj, next) => {
  const productID = obj._id
  const userID = obj.adminID

  try {

    const { products } = await dbUsers.findById(userID)
    products.push(productID)

    await dbUsers.findByIdAndUpdate(userID, { products: products }, { runValidators: true })

    next()
  }
  catch (err) {
    console.log(err)
  }
})




const transactionsSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: "orders",
    required: [true, "A transaction must have an order"]
  },
  paymentStatus: {
    type: String,
    enum: ["fulfilled", "rejected", "reversed"],
    required: [true, "A transaction must have a status"]
  },
  amount: {
    type: String,
    required: [true, "A transaction must have an amount"]
  },
  paymentDate: {
    type: Date,
    default: Date.now()
  }
})




//Collection Models

const dbUsers = mongoose.model("users", usersSchema)
const dbProducts = mongoose.model("products", productsSchema)
const dbOrders = mongoose.model("orders", ordersSchema)
const dbTransactions = mongoose.model("transactions", transactionsSchema)




module.exports = { dbUsers, dbProducts, dbOrders, dbTransactions }