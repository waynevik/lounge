const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classesSchema = new Schema({
    classname : {
        type: String,
        required: true,
        unique: true
    },
    level : {
        type: String,
        required: true
    },
    details : {
        type: String,
        required: true
    }
},  { timestamps: true });

module.exports = mongoose.model('Classes', classesSchema);