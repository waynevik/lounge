const School = require('../model/School');
const User = require('../model/User');

const getAllRoutes = async (req, res) => {
    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();
    res.json(school.routes);
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
        const result = await school.save();

        res.status(201).json({"result": result});

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

    const result = await school.save();
    res.status(200).json({"message": `${req.body.details} route has been edited succesfully.`});
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
        await school.save();
        res.status(200).json({"message": `${req.body.route_name} has been deleted successfully`});
    } catch (error) {
        res.sendStatus(400);   
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
   
    res.status(200).json(found);
}

module.exports = {
    getAllRoutes,
    createNewRoute,
    updateRoute,
    deleteRoute,
    getOneRoute
}