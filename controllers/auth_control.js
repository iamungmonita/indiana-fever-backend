const { compare } = require('bcrypt')
const jwt = require('jsonwebtoken')


const AdminModel = require('../models/admin')

require('dotenv').config()

const secret_key = process.env.SECRET_KEY
const age = 3 * 24 * 60 * 60

const createToken = (id, username) => {
    return jwt.sign({ id, username }, secret_key, { expiresIn: age })
}

const handleError = (err) => {
    console.log(err.message, err.code);
    const error = { username: '', email: '', password: '' }
    if (err.code === 11000) {
        error.email = 'this email is already registered'
        return error
    }
    if (err.message.includes('admins validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message
        })
        return error
    }

}
module.exports.register = async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        );
        res.setHeader(
            "Access-Control-Allow-Headers",
            "X-Requested-With, Content-Type",
        );
        res.setHeader("Access-Control-Allow-Credentials", true);
        const { username, email, password } = req.body
        const admin = await AdminModel.create({ username, email, password })
        const token = createToken(admin._id, admin.username)
        res.cookie('admin', token, { maxAge: age * 1000, httpOnly: true, sameSite: 'Lax' })
        res.status(201).json({
            admin: {
                username: admin.username,
                id: admin._id,
                token: token
            }
        })
    }
    catch (err) {
        const error = handleError(err)
        res.status(400).json({ error: error })
    }
}
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await AdminModel.findOne({ email })
        if (admin) {
            if (await compare(password, admin.password)) {
                const token = createToken(admin._id, admin.username)
                res.cookie('admin', token, { maxAge: age * 1000, httpOnly: true, sameSite: 'Lax' })
                res.status(200).json({ admin: { username: admin.username, token: token } })
            }
            else {
                res.status(401).json({ error: { password: 'incorrect password' } })
            }
        }
        else {
            res.status(401).json({ error: { email: 'this admin does not exist' } })
        }
    }
    catch (err) {
        const error = handleError(err)
        res.status(401).json({ error: error })
    }
}

module.exports.logout = async (req, res) => {
    res.cookie('admin', '', { maxAge: 1, httpOnly: true, sameSite: 'Lax' })
    res.send('removed')
}

module.exports.cookie = async (req, res) => {
    const cookie = req.cookies.admin
    if (cookie) {
        jwt.verify(cookie, secret_key, (err, decodedToken) => {
            if (err) {
                res.status(401).json({ error: err.message })
            } else {
                res.status(201).json({ decodedToken: decodedToken })
            }
        })
    }
    else {
        res.status(400).json({ error: 'token does not exist' })
    }
}