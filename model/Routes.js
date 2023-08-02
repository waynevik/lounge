const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routesSchema = new Schema({
    route_name : {
        type: String,
        required: true,
        unique: true
    },
    details : {
        type: String,
        required: true
    },
},  { timestamps: true });

module.exports = mongoose.model('Routes', routesSchema);