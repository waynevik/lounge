const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const receiptDetailsSchema = new Schema({
    receipt_no : {
        type: Number,
        required: true,
        default:0
    },
    school_logo: {
        type: String,
        required: true,
    }
},  { timestamps: true });

module.exports = mongoose.model('ReceiptDetails', receiptDetailsSchema);