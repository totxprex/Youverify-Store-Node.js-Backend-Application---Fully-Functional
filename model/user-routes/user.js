const express = require("express")
const { dbUsers } = require("../../database/schemas.js")
const { errorResponce } = require("../../server-responce/error.js")
const { responce } = require("../../server-responce/success.js")

const userApp = express.Router()


userApp.route("/:username?")
  .get(async (req, res) => {

    try {

      if (req.params.username) {
        const username = req.params.username

        const user = await dbUsers.findOne({ username: username })

        responce(res, "Found a user by username", user)
      }

      else if (req.query.id) {
        const id = req.query.id

        console.log(id)

        const user = await dbUsers.findById(id)

        responce(res, "Found a user by ID", user)
      }
    }
    catch (err) {
      errorResponce(res, "User not found")
    }
  })
  .patch(async (req, res) => {
    if (!req.body?.email) return errorResponce(res, "Email not in request")

    try {
      const email = req.body.email
      const username = req.params.username

      const user = await dbUsers.findOne({ username: username })

      if (!user) throw new Error("User not found in this database")

      const data = await dbUsers.findOneAndUpdate({ username: username }, { email: email }, { runValidators: true, new: true })

      responce(res, "Email updated", data)
    }
    catch (err) {
      errorResponce(res, `${err || "Error updating user's email"}`)
    }
  })
  .delete(async (req, res) => {
    try {
      const username = req.params.username

      const user = await dbUsers.findOne({ username: username })

      if (!user) throw new Error("User not found in this database")

      await dbUsers.findOneAndUpdate({ username: username }, { active: false })

      res.status(204).send({
        status: "User account deleted and inactive"
      })

    }
    catch (err) {
      errorResponce(res, `${err || "Internal server error"}`)
    }
  })



module.exports = { userApp }