const Classes = require('../model/Classes');
const School = require('../model/School');
const User = require('../model/User');

const getAllClasses = async (req, res) => {
    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const classes = school.classes;
    const actualClasses = [];
    classes.map((oneClass, index) => {
        const class_name = oneClass.classname;

        const students =  (school.students.filter((student) => student.class_name == class_name)).length;
        const oneClassNow =  {
            classname : oneClass.classname,
            classlevel : oneClass.classlevel,
            classdetails: oneClass.classdetails,
            students: students
        }

        actualClasses.push(oneClassNow);
    });
    return res.status(200).json({ "data": actualClasses, "tag": "classGet"});
}

const createNewClass = async (req, res) => {
    
    if(!req?.body.classname || !req?.body?.classlevel || !req?.body?.classdetails){
        return res.status(400).json({'message' : 'All data is required!'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});

    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const found = school.classes.find(element => element.classname == req.body.classname);

    if(found) return res.status(409).json({ "message": `class with name ${req.body.classname} already exists`, "res": "2"});

    try{
  
        const values = {
            "classname" : req.body.classname,
            "classlevel" : req.body.classlevel,
            "classdetails" : req.body.classdetails
        }

        school.classes.push(values );
        const result = await school.save();

        res.status(201).json({"result": "res"});
    } catch (err) {
        console.error(err);
        res.status(500).json({"message" : "error"});
    }
}

const updateClass = async (req, res) => {
    if(!req?.body?.classname) {
        return res.status(400).json({ 'message' : 'Class Name parameter is required'});
    }

    if(!req?.body?.classlevel && !req?.body?.classdetails)    return res.status(400).json({ 'message' : 'class details or class level is required'});

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();
    console.log(school);
    const found = school.classes.find(element => element.classname == req.body.classname);
    if(!found) return res.status(400).json({ "message": `class with name ${req.body.classname} does not exists`, "res": "2"});


    if (req.body?.classlevel) found.classlevel = req.body.classlevel;
    if (req.body?.classdetails) found.classdetails = req.body.classdetails;

    const result = await school.save();
    return res.status(200).json({ "data": [], "tag": "classEdit"});
}

const deleteClass = async (req, res) => {
    if(!req?.body?.classname) {
        return res.status(400).json({ 'message' : 'Class Name parameter is required'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();
    const found = school.classes.find(element => element.classname == req.body.classname);
    if(!found) return res.status(400).json({ "message": `class with name ${req.body.classname} does not exists`, "res": "2"});

    const studentsinClass = school.students.find(element => element.class_name == req.body.classname);

    if(studentsinClass){
        return res.status(400).json({ "message": `Cannot delete a class that has students`, "tag": "classDelete"});
    }

    try {
        console.log(found);
        school.classes.id(found._id).deleteOne();
        await school.save();
        return res.status(200).json({ "message": `Class deleted succesfully.`, "tag": "classDelete"});
    } catch (error) {
        return res.status(400).json({ "message": `An error has occured.`, "tag": "classDelete"});  
    }

}

const getClass = async (req, res) => {
    if(!req?.params?.classname) {
        return res.status(400).json({ 'message' : 'Class name is required'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const found = school.classes.find(element => element.classname == req.params.classname);

    if(!found) return res.status(404).json({ "message": `class with name ${req.params.classname} does not exists`, "res": "2"});
   
    res.status(200).json(found);
}

module.exports = {
    getAllClasses,
    createNewClass,
    updateClass,
    deleteClass,
    getClass
}