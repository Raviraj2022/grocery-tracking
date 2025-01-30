const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    userName : {type:String, required:true},
    password : {type: String, required: true, unique: true},
    role: { type: String, enum: ['user', 'driver'], required: true }, 
})

module.exports = mongoose.model('User', userSchema);