const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
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
    school_id : {
        type: String,
        required: true
    },
    roles: {
        User:{
            type:Number,
            default:6921
        },
        Editor: Number,
        Admin:Number
    },
    password : {
        type: String,
        required: true
    },
    refreshToken : String
});

module.exports = mongoose.model('User', userSchema);