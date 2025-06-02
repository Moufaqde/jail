const { Schema, model } = require("mongoose");

const guildSettingSchema = new Schema({
  guildid: { type: String },
  memberid: {type:String},
  staffid:{type:String},
  expires: {
      type: Date,
      required: true,
    },
   current: {
      type: Boolean,
      required: true,
    },
		reason:{type:String},

}, { timestamps: true });




module.exports = model("mute-settings", guildSettingSchema );