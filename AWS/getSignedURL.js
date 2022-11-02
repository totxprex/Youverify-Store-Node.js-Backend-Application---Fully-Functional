const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const { GetObjectCommand } = require("@aws-sdk/client-s3")
const { s3 } = require("./aws-user.js")
const { errorResponce } = require("../server-responce/error.js")
const { responce } = require("../server-responce/success.js")


const getAwsUrl = function () {

  return async (req, res) => {
    try {
      const filename = req.params.filename

      const command = new GetObjectCommand({
        Bucket: process.env.awsBucketName,
        Key: filename
      })

      const url = await getSignedUrl(s3, command, { expiresIn: 10000 })

      responce(res, "Image URL", url)
    }

    catch (err) {
      errorResponce(res, `${err || "Internal server error"}`)
    }
  }
}


module.exports = { getAwsUrl }