
const multer = require('multer')

// initialization multer disk storage
// make destination file for upload
const storage = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null, "uploads")
    },
    filename: function(req,file,cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({storage:storage})

module.exports = upload