const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeStudentsSchema = new Schema({
    student_id : {
        type: String,
        required: true,
        unique: true
    },
    route_name : {
        type: String,
        required: true,
    }
},  { timestamps: true });

module.exports = mongoose.model('RouteStudents', routeStudentsSchema);