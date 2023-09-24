const School = require('../model/School');
const User = require('../model/User');

const addStudentToRoute = async (req, res) => {
    try{    if(!req?.body?.route_name || !req?.body?.student_id) {
            return res.status(400).json({ 'message' : 'Route name and Student ID is required'});
        }

        const school_details = await User.findOne( {email: req.email}).exec();
        if(!school_details) return res.status(400).json( {"message": "school_not found"});
        const school = await School.findOne( {_id: school_details.school_id}).exec();

        const foundRoute = school.routes.find(element => element.route_name == req.body.route_name);

        if(!foundRoute) return res.status(404).json({ "message": `Route with name ${req.body.route_name} does not exists`, "res": "2"});

        const foundStudent = school.students.find(element => element.student_id == req.body.student_id);

        if(!foundStudent) return res.status(404).json({ "message": `Student with ID ${req.body.student_id} does not exists`, "res": "2"});

        const foundStudentInRoute = school.routeStudents.find(element => element.student_id == req.body.student_id);

        if(foundStudentInRoute) return res.status(409).json({ "message": `Student with ID ${req.body.student_id} is already added in route ${foundStudentInRoute.route_name}`, "res": "2"});
    
        const values = {
            "student_id" : req.body.student_id,
            "route_name" : req.body.route_name
        }

        school.routeStudents.push(values );
        await school.save();
        res.status(200).json({"message": "Student has been added to route", tag: 'routeStudentAdd'});
    }
    catch(error){
        res.status(400).json({"message": "an error has occured try agin later", tag: 'routeStudentAdd'});   
    }
}    

const removeStudentFromRoute = async (req, res) => {
    if(!req?.body?.student_id) {
        return res.status(400).json({ 'message' : 'Student ID is required'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const foundStudentInRoute = school.routeStudents.find(element => element.student_id == req.body.student_id);

    if(!foundStudentInRoute) return res.status(400).json({ "message": `Student with ID ${req.body.student_id} does not exist`, "res": "2"});
   
    try {
        school.routeStudents.id(foundStudentInRoute._id).deleteOne();
        await school.save();
        res.status(200).json({"res": "route_remove", "message": `${req.body.student_id} has been removed from ${foundStudentInRoute.route_name} route successfully`, tag: 'routeStudentRemove'});
    } catch (error) {
        res.status(400).json({"message": "an error has occured try agin later", tag: 'routeStudentRemove'});   
    }
}    

module.exports = {
    addStudentToRoute,
    removeStudentFromRoute
}