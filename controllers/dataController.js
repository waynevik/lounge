const { log } = require('console');
const School = require('../model/School');
const User = require('../model/User');

const setup = async (req, res) => {

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const data = {
        "firstname": school_details.firstname,
        "lastname": school_details.lastname,
        "school_name": school.school_name,
        "balance": school.messages.balance,
        "students_no" : school.students.length,
        "classes" : school.classes.length
    }

    return res.status(200).json( {"message": data});
}


module.exports = { setup }