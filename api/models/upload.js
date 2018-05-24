const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const uploadSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:{type:String, required:true},
    imageFile:{type:String, required:true}
    
})

module.exports= mongoose.model('Upload', uploadSchema)