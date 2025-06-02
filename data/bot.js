const { Schema, model } = require("mongoose");

const usermodel = new Schema({
    _id:String,
    prefix:String,
    roleID:String,
    resons:Array,
}, { _id: false })



module.exports = model("bot-settings", usermodel );