const FeeType = require('../model/FeeType');
const School = require('../model/School');
const User = require('../model/User');

const getFeeTypes = async (req, res) => {
    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();
    res.json(school.feeTypes);
}

const createNewFeeType = async (req, res) => {

    if(!req?.body.fee_name || !req?.body?.details){
        return res.status(400).json({'message' : 'Fee name and fee details are required'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});

    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const found = school.feeTypes.find(element => element.fee_name == req.body.fee_name);

    if(found) return res.status(409).json({ "message": `Fee type with name ${req.body.fee_name} already exists`, "res": "2"});

    try{
  
        const values = {
            "fee_name" : req.body.fee_name,
            "details" : req.body.details,
        }

        school.feeTypes.push(values );
        const result = await school.save();

        res.status(201).json({"result": result});
    } catch (err) {
        console.error(err);
        res.status(500).json({"message" : "error"});
    }
}

const updateFeeType = async (req, res) => {
    if(!req?.body.fee_name || !req?.body?.details){
        return res.status(400).json({'message' : 'Fee name and fee details are both required'});
    }
    
    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const feeType = school.feeTypes.find(element => element.fee_name == req.body.fee_name);
    if(!feeType) return res.status(400).json({ "message": `Fee Type with name ${req.body.fee_name} does not exists`, "res": "2"});

    console.log(feeType);

    feeType.details = req.body.details;
    const result = await school.save();
    res.json(result);
}


const getOneFeeType = async (req, res) => {
    if(!req?.params?.id) {
        return res.status(400).json({ 'message' : 'ID parameter is required'});
    }
    const employee = await Employee.findOne({_id: req.params.id}).exec();
    if (!employee) {
        return res.status(204).json({ "message": `Employee matches ID ${req.params.id}` });
    }
    res.json(employee);
}

module.exports = {
    getFeeTypes,
    createNewFeeType,
    updateFeeType,
    getOneFeeType
}