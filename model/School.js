const mongoose = require('mongoose');
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
    }
});

module.exports = mongoose.model('School', schoolSchema);