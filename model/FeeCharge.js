const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feeChargeSchema = new Schema({
    fee_charge_batch_id : {
        type: String,
        required: true
    },
    student_id: {
        type: String,
        required: true
    }
},  { timestamps: true });

module.exports = mongoose.model('FeeCharge', feeChargeSchema);