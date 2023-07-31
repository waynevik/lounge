const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    student_id : {
        type: String,
        required: true
    },
    class_name : {
        type: String,
        required: true
    },
    firstname : {
        type: String,
        required: true
    },
    lastname : {
        type: String,
        required: true
    },
    othername : {
        type: String,
        required: true
    },
    details : {
        type: String,
        required: true
    },
    date_of_birth : {
        type: String,
        required: true
    },
    date_of_admission : {
        type: String,
        required: true
    },
    date_of_release : {
        type: String,
        required: true
    },
    gender : {
        type: String,
        required: true
    },
    guardian_relationship : {
        type: String,
        required: true
    },
    guardian_name : {
        type: String,
        required: true
    },
    guardian_phone : {
        type: String,
        required: true
    },
    guardian_relationship_1 : {
        type: String,
        required: true
    },
    guardian_name_1 : {
        type: String,
        required: true
    },
    guardian_phone_1 : {
        type: String,
        required: true
    },
    status : {
        type: String,
        required: true
    },
    initiator : {
        type: String,
        required: true
    },
},  { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);