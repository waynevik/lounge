const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    othername: {
        type: String,
        required: true
    },
    position: {
        type: Array,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    special_role: {
        type: String,
        required: true
    },
    id_number: {
        type: String,
        required: true
    },
    id_tag: {
        type: String,
        required: true
    },
    phonenumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    weight: {
        type: String,
        required: true
    },
    team_id: {
        type: String,
        required: true
    },
    team_name: {
        type: String,
        required: true
    },
    team_level: {
        type: String,
        required: true
    }
},  { timestamps: true });

module.exports = mongoose.model('Player', playerSchema);