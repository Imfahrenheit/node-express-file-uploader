const express = require('express')
const router = express.Router()
const Upload= require('../models/upload')
const mongoose= require('mongoose')
mongoose.Promise = global.Promise;
const multer = require("multer");
const path = require("path");
const fs = require('fs')




mongoose.connect("mongodb://TM:123456@ds227740.mlab.com:27740/shop-rest-api");




// using multer to store files in a static folder

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) =>{
    cb(null, new Date().toISOString()+ path.extname(file.originalname));
  }
});
// filtering accepted file types in storage 

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// passes all arg to multer storage
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});


// root get route
router.get('/', (req, res, next) => {

  Upload.find()
    .select("name _id imageFile")

    .exec()
    .then(docs => {
      if(docs.length>0){
      let response = { count: docs.length, uploads: docs.map(doc => {
          return { name: doc.name, imageFile: doc.imageFile, id: doc._id };
        }) }
      res.status(200).json({ response });
      }
        else { let response= {message:"no image is uploded"} ;
      res.status(200).json({ response });};
      
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });


})

// root post route
router.post('/', upload.single('file') ,(req, res, next) => {
  console.log(req.file)
  const upload = new Upload({
    _id: new mongoose.Types.ObjectId(),
    name: req.file.filename,
    imageFile: req.file.path
  });
  upload
    .save()
    .then(result => {
      res
        .status(201)
        .json({
          message: "new file upload is uploaded",
          newUpload: {
            name: result.name,
            id: result._id,
            imagePath: result.imageFile
            
          }
        });
     
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });

  
});

// root /:Id route 
router.get("/:Id", (req, res, next) => {
  const id = req.params.Id
  Upload.findById(id)
    .select("name _id imageFile")
    .exec()
    .then(doc => {
      if (doc) {
        res
          .status(200)
          .json({
            upload: doc,
            
          });
      } else {
        res.status(500).json({ message: "no file found for this id" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  
});



// product delete route
router.delete("/:Id", async(req, res, next) => {
  const id = req.params.Id;
  const file = await Upload.findById(id).select("name _id imageFile").exec();
  console.log('this the file ', file.name)

  Upload.remove({ _id: id })
    .exec()
    .then(doc => {
      fs.unlink("./uploads/" + file.name, err => {
        if (err) {
          console.log("failed to delete local image:" + err);
        } else {
          console.log("successfully deleted local image");
        }
      });
      res.status(200).json({
      message: file.name + " is deleted" });
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
  
});


module.exports= router;