const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const smsSchema = new Schema({
    message : {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    num: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    tag_id: {
        type: String,
        required: true
    }
},  { timestamps: true });

module.exports = mongoose.model('Sms', smsSchema);