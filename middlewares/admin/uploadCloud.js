const streamUpload = require("../../helper/stremUpload_helper")


module.exports.uploadSingle = (req, res, next) => {
  if(!req.file){
    next()
  }
  else{
    async function upload(req) {
      let result = await streamUpload.streamUpload(req.file.buffer);
      req.body[req.file.fieldname] = result.url
      next()
    }
    upload(req);
  }
}