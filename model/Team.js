const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    logo : {
        type: String,
        required: true
    },
    teamManager : {
        type: String,
        required: true
    },
    tm_name: {
        type: String,
        required: true
    },
    tm_id: {
        type: String,
        required: true
    }
},  { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);