const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feeChargeBatchSchema = new Schema({
    fee_name : {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    tag_id: {
        type: String,
        required: true
    },
    fee_details: {
        type: String,
        required: true
    }

},  { timestamps: true });

module.exports = mongoose.model('FeeChargeBatch', feeChargeBatchSchema);