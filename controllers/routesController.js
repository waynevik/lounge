const School = require('../model/School');
const User = require('../model/User');

const getAllRoutes = async (req, res) => {
    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const routes = school.routes;
    const actualRoutes = [];
    routes.map((oneRoute, index) => {
        const route_name = oneRoute.route_name;
        const students =  (school.routeStudents.filter((student) => student.route_name == route_name)).length;
        const oneRouteNow =  {
            route_name : oneRoute.route_name,
            details : oneRoute.details,
            students: students
        }
        actualRoutes.push(oneRouteNow);
    });

    res.status(200).json({"res": "success", tag: "routesGet", "data": actualRoutes});
}

const createNewRoute = async (req, res) => {
    
    if(!req?.body.route_name || !req?.body?.details){
        return res.status(400).json({'message' : 'Route name and route details are required'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});

    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const found = school.routes.find(element => element.route_name == req.body.route_name);

    if(found) return res.status(409).json({ "message": `Route with name ${req.body.route_name} already exists`, "res": "2"});

    try{
        
        const values = {
            "route_name" : req.body.route_name,
            "details" : req.body.details,
        }

        school.routes.push(values );
        await school.save();

        res.status(200).json({"res": "success", tag: "routesNew"});

    } catch (err) {
        console.error(err);
        res.status(500).json({"message" : "error"});
    }
}

const updateRoute = async (req, res) => {
    if(!req?.body.route_name || !req?.body?.details){
        return res.status(400).json({'message' : 'Route name and route details are required'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});

    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const found = school.routes.find(element => element.route_name == req.body.route_name);

    if(!found) return res.status(409).json({ "message": `Route with name ${req.body.route_name} does not exists`, "res": "2"});

    found.details = req.body.details;

    await school.save();
    res.status(200).json({"message": `${req.body.details} route has been edited succesfully.`, tag : "routeEdit"});
}

const deleteRoute = async (req, res) => {
    if(!req?.body?.route_name) {
        return res.status(400).json({ 'message' : 'Route Name parameter is required'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();
    const found = school.routes.find(element => element.route_name == req.body.route_name);
    if(!found) return res.status(400).json({ "message": `Route with name ${req.body.route_name} does not exists`, "res": "2"});

    try {
        console.log(found);
        school.routes.id(found._id).deleteOne();
        school.routeStudents.map((value)=> {

            if(value.route_name === req.body.route_name){
                school.routeStudents.id(value._id).deleteOne();
            }
        });
        await school.save();
        res.status(200).json({"message": `${req.body.route_name} has been deleted successfully`, tag: "routerDelete"});
    } catch (error) {
        res.status(400).json({"message": `An error has occurred. Try again later`, tag: "routerDeleteError", "error": error});  
    }
}

const getOneRoute = async (req, res) => {
    if(!req?.body?.route_name) {
        return res.status(400).json({ 'message' : 'Route name is required'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const found = school.routes.find(element => element.route_name == req.body.route_name);

    if(!found) return res.status(404).json({ "message": `Routes with name ${req.body.route_name} does not exists`, "res": "2"});
    const routeStudents = school.routeStudents.filter((student) => (student.route_name == found.route_name));
    const routeStudentDetails = routeStudents.map((student) => {
        return school.students.find(foundStudent => foundStudent.student_id == student.student_id);
    });
   
    res.status(200).json({"res": "routes_students", "data": routeStudentDetails, tag : "routeStudentGet"});
}

module.exports = {
    getAllRoutes,
    createNewRoute,
    updateRoute,
    deleteRoute,
    getOneRoute
}