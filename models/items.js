const mongoose = require('mongoose')

const itemsSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String
})

const itemsModel = mongoose.model('item', itemsSchema)
module.exports = itemsModel