const mongoose = require('mongoose')
const { isEmail } = require('validator')
const bcrypt = require('bcrypt')
const adminSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
})

adminSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    console.log(this);
    next()
})

adminSchema.post('save', function (doc, next) {
    console.log(doc);
    next()
})

const AdminModel = mongoose.model("admin", adminSchema)
module.exports = AdminModel