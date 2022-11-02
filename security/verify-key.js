const { errorResponce } = require("../server-responce/error.js")

function verifyKey() {

  return (req, res, next) => {
    if (req.params.key !== "1680") return errorResponce(res, "Invalid server key")
    else next()
  }
}

module.exports = { verifyKey }