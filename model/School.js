const mongoose = require('mongoose');
const Classes = require('../model/Classes');
const Students = require('../model/Student');
const Routes = require('../model/Routes');
const FeeType = require('../model/FeeType');
const RouteStudents = require('../model/RouteStudents');
const FeeChargeBatch = require('../model/FeeChargeBatch');
const FeeCharge = require('../model/FeeCharge');
const Sms = require('../model/Sms');

const ReceiptDetails = require('../model/ReceiptDetails');
const FeeReceived = require('../model/FeeReceived');

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
    sms: {
        type: String,
        default: "UjumbeSMS"
    },
    messages : {
        balance: {
            type: Number,
            default: 0
        },
        totalSent : {
            type: Number,
            default: 0
        },
        bought : {
            type: Number,
            default: 0
        },
        sent:[ Sms.schema ]
    },
    feeReceived: [FeeReceived.schema],
    receiptDetails: {
        receipt_no: {
            type: Number,
            default: 0
        },
        school_logo: {
            type: String,
            default: "none"
        }
    },
    feeCharge: [FeeCharge.schema],
    feeChargeBatch: [FeeChargeBatch.schema],
    routeStudents: [RouteStudents.schema],
    classes: [Classes.schema],
    feeTypes: [FeeType.schema],
    routes: [Routes.schema],
    students: [Students.schema]
},  { timestamps: true });

module.exports = mongoose.model('School', schoolSchema);