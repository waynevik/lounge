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
    phone_number: {
        type: String,
        required: true
    },
    team : {
        type: String,
        required: false,
        default: "none"
    },
    team_id : {
        type: String,
        required: false,
        default: "none"
    },
    role: {
            type: Number,
            required: true,
    },
    password : {
        type: String,
        required: true
    },
    refreshToken : String,
    
},  { timestamps: true });

module.exports = mongoose.model('User', userSchema);