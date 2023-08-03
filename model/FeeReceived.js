const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feeReceivedSchema = new Schema({
    student_id : {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    receipt_no: {
        type: String,
        required: true
    },
    date_received: {
        type: String,
        required: true
    },
    reference_no: {
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    }
},  { timestamps: true });

module.exports = mongoose.model('FeeReceived', feeReceivedSchema);