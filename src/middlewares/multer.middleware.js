import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
  
    filename: function (req, file, cb) {
      cb(null, file.originalname) ;
    }
  })
  
export const upload = multer({ 
    storage: storage 
})





// cb --> callback

// Passing null in the first position signifies that no error occurred.

// Advance ---> Preferable
/*
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  
  cb(null, file.fieldname + '-' + uniqueSuffix)
*/