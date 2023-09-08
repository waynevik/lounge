const Classes = require('../model/Classes');
const School = require('../model/School');
const Student = require('../model/Student');
const User = require('../model/User');

const getAllStudents = async (req, res) => {
    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(403).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    if(req.body.tag == 1 || !req?.body?.tag) return res.status(200).json(school.students);

    if(!req?.body?.class_name) return res.status(400).json( {"message": "Class name is required"});

    const found = school.students.filter(item => item.class_name == req.body.class_name);
  
    return res.status(200).json(found);
}

const createNewStudent = async (req, res) => {
    
    if  (
            !req?.body.student_id || !req?.body?.class_name || !req?.body?.firstname || !req?.body.lastname || !req?.body?.othername || !req?.body?.details || 
            !req?.body.date_of_birth || !req?.body?.date_of_admission || !req?.body?.date_of_release || !req?.body.gender || !req?.body?.guardian_relationship || !req?.body?.guardian_name || 
            !req?.body.guardian_phone || !req?.body?.guardian_relationship_1 || !req?.body?.guardian_name_1 || !req?.body.guardian_phone_1 || !req?.body?.status || !req?.body?.initiator
        )

        return res.status(400).json({'message' : 'All data is required!'});
        
    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});

    const school = await School.findOne( {_id: school_details.school_id}).exec();
    
    const classCheck = school.classes.find(element => element.classname == req.body.class_name);

    if(!classCheck) return res.status(400).json({ "message": `class with name ${req.body.class_name} does not exists`, "res": "2"});

    const studentCheck = school.students.find(element => element.student_id == req.body.student_id);

    if(studentCheck) return res.status(409).json({ "message": `Student with student ID ${req.body.student_id} already exists`, "res": "2"});

    const studentDetail = {
        "student_id" : req.body.student_id,
        "class_name" : req.body.class_name,
        "firstname" : req.body.firstname,
        "lastname" : req.body.lastname,
        "othername" : req.body.othername,
        "details" : req.body.details,
        "date_of_birth" : req.body.date_of_birth,
        "date_of_admission" : req.body.date_of_admission,
        "date_of_release" : req.body.date_of_release,
        "gender" : req.body.gender,
        "guardian_relationship" : req.body.guardian_relationship,
        "guardian_name" : req.body.guardian_name,
        "guardian_phone" : req.body.guardian_phone,
        "guardian_relationship_1" : req.body.guardian_relationship_1,
        "guardian_name_1" : req.body.guardian_name_1,
        "guardian_phone_1" : req.body.guardian_phone_1,
        "status" : req.body.status,
        "initiator" : req.body.initiator
    }

    school.students.push( studentDetail );
    await school.save();
    res.status(201).json({"message": "student created succesfully"});
}

const updateStudent = async (req, res) => {
    if(!req?.body?.student_id) {
        return res.status(400).json({ 'message' : 'Student ID parameter is required'});
    }

    if(
        !req?.body?.class_name && !req?.body?.firstname && !req?.body.lastname && !req?.body?.othername && !req?.body?.details &&
        !req?.body.date_of_birth && !req?.body?.date_of_admission && !req?.body?.date_of_release && !req?.body.gender && !req?.body?.guardian_relationship && !req?.body?.guardian_name &&
        !req?.body.guardian_phone && !req?.body?.guardian_relationship_1 && !req?.body?.guardian_name_1 && !req?.body.guardian_phone_1 && !req?.body?.status && !req?.body?.initiator
        )    return res.status(400).json({ 'message' : 'details to update is required'});

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});

    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const found = school.students.find(element => element.student_id == req.body.student_id);
    if(!found) return res.status(400).json({ "message": `students with name ${req.body.student_id} does not exists`, "res": "2"});


    if (req.body?.class_name) found.class_name = req.body.class_name;
    if (req.body?.firstname) found.firstname = req.body.firstname;
    if (req.body?.lastname) found.lastname = req.body.lastname;
    if (req.body?.othername) found.othername = req.body.othername;
    if (req.body?.details) found.details = req.body.details;
    if (req.body?.date_of_birth) found.date_of_birth = req.body.date_of_birth;
    if (req.body?.date_of_admission) found.date_of_admission = req.body.date_of_admission;
    if (req.body?.date_of_release) found.date_of_release = req.body.date_of_release;
    if (req.body?.gender) found.gender = req.body.gender;
    if (req.body?.guardian_relationship) found.guardian_relationship = req.body.guardian_relationship;
    if (req.body?.guardian_name) found.guardian_name = req.body.guardian_name;
    if (req.body?.guardian_phone) found.guardian_phone = req.body.guardian_phone;
    if (req.body?.guardian_relationship_1) found.guardian_relationship_1 = req.body.guardian_relationship_1;
    if (req.body?.guardian_name_1) found.guardian_name_1 = req.body.guardian_name_1;
    if (req.body?.guardian_phone_1) found.guardian_phone_1 = req.body.guardian_phone_1;
    if (req.body?.status) found.status = req.body.status;
    if (req.body?.initiator) found.initiator = req.body.initiator;

    const result = await school.save();
    res.json(result);
}

const deleteStudent = async (req, res) => {
    if(!req?.body?.student_id) {
        return res.status(400).json({ 'message' : 'Student ID parameter is required'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();
    const found = school.students.find(element => element.student_id == req.body.student_id);
    if(!found) return res.status(400).json({ "message": `Student with ID ${req.body.student_id} does not exists`, "res": "2"});

    try {
        school.students.id(found._id).deleteOne();
        await school.save();
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);   
    }
  
}

const getStudent = async (req, res) => {

    if(!req?.body?.student_id) {
        return res.status(400).json({ 'message' : `Student with ID name is required`});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const found = school.students.find(element => element.student_id == req.body.student_id);

    if(!found) return res.status(404).json({ "message": `Student with ID ${req.body.student_id} does not exists`, "res": "2"});

    // get extra data
    // const class = await school.Classes.find(element)
   
    res.status(200).json(found);
}

const getExtraDataStudents = (student) => {



}

module.exports = {
    getAllStudents,
    createNewStudent,
    updateStudent,
    deleteStudent,
    getStudent
}