const mongoose = require('mongoose');
const Classes = require('../model/Classes');
const Students = require('../model/Student');
const Routes = require('../model/Routes');
const FeeType = require('../model/FeeType');
const RouteStudents = require('../model/RouteStudents');

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
    routeStudents: [RouteStudents.schema],
    classes: [Classes.schema],
    feeTypes: [FeeType.schema],
    routes: [Routes.schema],
    students: [Students.schema]
},  { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);