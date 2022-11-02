const errorResponce = function (resOBJ, errorMessage) {
  return resOBJ.status(404).header({
    "content-type": "application/json"
  }).send({
    status: "Error",
    reason: errorMessage || "Internal server error"
  })
}

module.exports = { errorResponce }