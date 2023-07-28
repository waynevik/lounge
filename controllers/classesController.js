const Classes = require('../model/Classes');
const School = require('../model/School');
const User = require('../model/User');

const getAllClasses = async (req, res) => {
    const school = await School.find( {_id: '64c274198f2b62bfa85d494c'});
    const classes = await Classes.find({school_id: school});
    if(!classes) return res.status(204).json( {'message' : 'No Classes', 'code': '0'});
    res.json(classes);
}

const createNewClass = async (req, res) => {
    
    if(!req?.body.classname || !req?.body?.classlevel || !req?.body?.classdetails){
        return res.status(400).json({'message' : 'All data is required!'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});

    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const checkClass = await School.findOne().exec();
    const found = school.classes.find(element => element.classname == req.body.classname);

    console.log(found);

    try{
  
        const values = {
            "classname" : req.body.classname,
            "level" : req.body.classname,
            "details" : req.body.classname
        }

        school.classes.push(values );
        // const result = await school.save();

        res.status(201).json({"result": "res"});
    } catch (err) {
        console.error(err);
        res.status(500).json({"message" : "error"});
    }
}

const updateClass = async (req, res) => {
    if(!req?.body?.id) {
        return res.status(400).json({ 'message' : 'ID parameter is required'});
    }
    
    const employee = await Employee.findOne({_id: req.body.id}).exec();
    if (!employee) {
        return res.status(204).json({ "message": `Employee matches ID ${req.body.id}` });
    }

    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;

    const result = await employee.save();
    res.json(result);
}

const deleteClass = async (req, res) => {
    // if(!req?.body?.id) return res.status(400).json({ 'message': `Employee ID ${req.bosy.id} not found`});

    //  const employee = await Employee.findOne({_id: req.body.id}).exec();

    // if (!employee) {
    //     return res.status(204).json({ "message": `Employee matches ID ${req.body.id}` });
    // }
    // const result = await employee.deleteOne({_id: req.body.id});
    // res.json(result);
}

const getClass = async (req, res) => {
    // if(!req?.params?.id) {
    //     return res.status(400).json({ 'message' : 'ID parameter is required'});
    // }
    // const employee = await Employee.findOne({_id: req.params.id}).exec();
    // if (!employee) {
    //     return res.status(204).json({ "message": `Employee matches ID ${req.params.id}` });
    // }
    // res.json(employee);
}

module.exports = {
    getAllClasses,
    createNewClass,
    updateClass,
    deleteClass,
    getClass
}