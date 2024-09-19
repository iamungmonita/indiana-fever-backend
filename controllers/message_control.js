const MessageModel = require("../models/message");

module.exports.send_message = async (req, res) => {
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
        const { name, email, message } = req.body
        const sender = await MessageModel.create({ name, email, message })
        res.status(201).json({
            sender: sender
        })
    }
    catch (err) {
        res.status(400).json({ error: err })
    }
}
module.exports.receive_message = async (req, res) => {
    try {
        const receiver = await MessageModel.find()
        res.status(201).json({
            receiver: receiver
        })

    }
    catch (err) {
        res.status(400).json({ error: err })
    }
}
