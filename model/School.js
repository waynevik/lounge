const mongoose = require('mongoose');
const Classes = require('../model/Classes');
const Schema = mongoose.Schema;

const schoolSchema = new Schema({
    school_name : {
        type: String,
        required: true
    },
    admin_email: {
        type: String,
        required: true
    },
    admin_name: {
        type: String,
        required: true
    },
    classes: [Classes.schema]
},  { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);