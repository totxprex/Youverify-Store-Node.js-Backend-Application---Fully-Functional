

const responce = function (resObj, message, data) {
  return resObj.status(200).header({
    "content-type": "application/json"
  }).send({
    status: message || "Request succesful",
    data: data || "No data"
  })
}

module.exports = { responce }