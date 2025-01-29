const mongoose = require("mongoose")


const OrderSchema = new mongoose({
    userId : {type: String, required: true},
    status : {type: String, enum:['pending', 'accepted', 'preparing', 'delivered'], default:'pending'},
    createdAt : {type: Date, default: Date.now}
})

module.exports = mongoose.model('Order', OrderSchema);