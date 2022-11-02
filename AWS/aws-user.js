const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const { errorResponce } = require("../server-responce/error.js")
const { responce } = require("../server-responce/success.js")

const upload = multer({ storage: multer.memoryStorage() })

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const { dbUsers } = require("../database/schemas")

const s3 = new S3Client({
  region: process.env.awsRegion,
  credentials: {
    accessKeyId: process.env.awsAccessKeyId,
    secretAccessKey: process.env.awsSecretAccessKey
  }
})

const userUploadApp = express.Router()


//update user profile picture

userUploadApp.post("/:username", upload.single("photo"), async (req, res) => {
  if (!req.file.buffer) return errorResponce(res, "Cannot initiate file upload")

  const filename = `user-${req.params.username}-${Date.now()}-profile-pic.jpeg`

  try {

    //process incoming image
    const buffer = await sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 80 })
      .toBuffer()

    //send to aws s3 bucket
    const command = new PutObjectCommand({
      Bucket: process.env.awsBucketName,
      Key: filename,
      Body: buffer,
      mimetype: req.file.mimetype
    })

    await s3.send(command)

    await dbUsers.findOneAndUpdate({ username: req.params.username }, { photo: filename }, { runValidators: true })

    responce(res, "User profile picture updated")
  }
  catch (err) {
    errorResponce(res, `${err || "Internal server error"}`)
  }

})







module.exports = { userUploadApp, s3, upload }