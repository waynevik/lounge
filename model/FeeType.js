const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feeTypeSchema = new Schema({
    fee_name : {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    }
},  { timestamps: true });

module.exports = mongoose.model('FeeType', feeTypeSchema);