const School = require('../model/School');
const User = require('../model/User');

const getChargedFees = async (req, res) => {
        
    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details)
        return res.status(400).json( {"message": "school_not found"});

    const school = await School.findOne( {_id: school_details.school_id}).exec();

    res.status(200).json({"data": school.feeChargeBatch});
}

const chargeFees = async (req, res) => {
    
    if  (
            !req?.body.fee_name || !req?.body?.charge_type || !req?.body?.fee_details || !req?.body?.amount 
        )

    return res.status(400).json({'message' : 'All data is required!'});
        
    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details)
        return res.status(400).json( {"message": "school_not found"});

    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const feeTypeCheck = school.feeTypes.find(element => element.fee_name == req.body.fee_name);

    if(!feeTypeCheck) 
        return res.status(400).json({ "message": `Fee with name ${req.body.fee_name} does not exists`, "res": "2"});

    const timestamp = Math.floor(Date.now() / 1000);

    if(req.body.charge_type == 1){
        if(!req?.body.class_name) return res.status(400).json({'message' : 'Class name is required to charge class!'}); 
        // is a class type
        const classCheck = school.classes.find(element => element.classname == req.body.class_name);

        if(!classCheck) return res.status(400).json({ "message": `Class with name ${req.body.class_name} does not exists`, "res": "2"});

        const isStudentExist = school.students.filter(student => student.class_name == req.body.class_name);
        if(isStudentExist.length == 0) return res.status(400).json({ "message": `There are no students in ${req.body.class_name}`, "res": "2"});
        
    try{ 

          school.feeChargeBatch.push({
            "timestamp": timestamp,
            "fee_name" : req.body.fee_name,
            "amount" : req.body.amount,
            "tag" : "Class",
            "tag_id" : classCheck.classname,
            "fee_details" : req.body.fee_details
          });
          
         await school.save();
         const lastAddedBatchID = school.feeChargeBatch.find(batch => batch.timestamp == timestamp);

        isStudentExist.map( ( student, index )=> {

            const feeCharge = {
                "student_id": student.student_id,
                "fee_charge_batch_id": lastAddedBatchID._id.toString()
            };

            school.feeCharge.push( feeCharge );

        });

        await school.save();
        res.status(200).json({ "message": `Class ${req.body.class_name} has been charged successfully.`});
    }
    catch( error){

          res.status(400).json({ "message": `error has occured try again later`});
    }

    }
    else if(req.body.charge_type == 2){
        // is a route type
        if(!req?.body.route_name) return res.status(400).json({'message' : 'Route name is required to charge class!'}); 
        // is a class type
        const routeCheck = school.routes.find(element => element.route_name == req.body.route_name);

        if(!routeCheck) return res.status(400).json({ "message": `Route with name ${req.body.route_name} does not exists`, "res": "2"});

        const isStudentExist = school.routeStudents.filter(student => student.route_name == req.body.route_name);
        if(isStudentExist.length == 0) return res.status(400).json({ "message": `There are no students in route ${req.body.route_name}`, "res": "2"});

        try{ 
    
              school.feeChargeBatch.push({
                "timestamp": timestamp,
                "fee_name" : req.body.fee_name,
                "amount" : req.body.amount,
                "tag" : "Route",
                "tag_id" : routeCheck.route_name,
                "fee_details" : req.body.fee_details
              });
              
             await school.save();
             const lastAddedBatchID = school.feeChargeBatch.find(batch => batch.timestamp == timestamp);
    
            isStudentExist.map( ( student, index )=> {
    
                const feeCharge = {
                    "student_id": student.student_id,
                    "fee_charge_batch_id": lastAddedBatchID._id.toString()
                };
    
                school.feeCharge.push( feeCharge );
    
            });
    
            await school.save();
            res.status(200).json({ "message": `Fees charged to students in route ${req.body.route_name} succesfully.`});
        }
        catch( error){
    
              res.status(400).json({ "message": `error has occured try again later`});
        }
    }
    else if(req.body.charge_type == 3){
        // is individual type
        if(!req?.body.student_id) return res.status(400).json({'message' : 'Student ID is required to charge student!'}); 
        const isStudentExist = school.students.find(student => student.student_id == req.body.student_id);

        if(!isStudentExist) return res.status(400).json({ "message": `Student with ID ${req.body.student_id} does not exist.`});

        try{
    
            school.feeChargeBatch.push({
              "timestamp": timestamp,
              "fee_name" : req.body.fee_name,
              "amount" : req.body.amount,
              "tag" : "Student",
              "tag_id" : isStudentExist.student_id,
              "fee_details" : req.body.fee_details
            });
            
            await school.save();
            const lastAddedBatchID = school.feeChargeBatch.find(batch => batch.timestamp == timestamp);

            const feeCharge = {
                "student_id": isStudentExist.student_id,
                "fee_charge_batch_id": lastAddedBatchID._id.toString()
            };

            school.feeCharge.push( feeCharge );
  
          await school.save();
          res.status(200).json({ "message": `Fees charged to student of ID  ${req.body.student_id} succesfully.`});

        }
        catch( error){

            res.status(400).json({ "message": `error has occured try again later`});

        }

    }
    else {
        res.status(400).json({"message": "An error has occured please try again later"});
    }    
}

const deleteFeeCharged = async (req, res) => {
    if(!req?.body?.batch_id) {
        return res.status(400).json({ 'message' : 'Fee Charge Batch ID parameter is required'});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const feeChargeBatch = school.feeChargeBatch.find(element => element._id == req.body.batch_id);
    if(!feeChargeBatch) return res.status(400).json({ "message": `Fee batch no longer exists`, "res": "2"});

    try {
        const studentsInBatch = school.feeCharge.filter(batch => batch.fee_charge_batch_id == feeChargeBatch._id);
        if(studentsInBatch.length == 0) return res.status(400).json({ "message": `There are no students in ${req.body.batch_id} batch`, "res": "2"});
        
        school.feeChargeBatch.id(feeChargeBatch._id).deleteOne();
        studentsInBatch.map( (charge, index) => {
            school.feeCharge.id(charge._id).deleteOne();
           
        });
        await school.save();
        res.status(200).json({ "message": "Fee charge batch deleted successfully"});
    } catch (error) {
        res.status(400).json({"message": "An error has occured please try again later"});   
    }
}

const updateFeeCharged = async (req, res) => {
    if(!req?.body?.batch_id) 
        return res.status(400).json({ 'message' : 'Fee Charge Batch ID parameter is required'});

    if ( !req?.body?.fee_details && !req?.body?.amount && !req?.body?.fee_name )

    return res.status(400).json({ 'message' : 'Either fee details, fee name or amount parameters is required'});

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school_not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const feeChargeBatch = school.feeChargeBatch.find(element => element._id == req.body.batch_id);
    if(!feeChargeBatch) return res.status(400).json({ "message": `Fee batch no longer exists`, "res": "2"});

    try {

        if (req.body?.fee_name) {

            const feeTypeCheck = school.feeTypes.find(element => element.fee_name == req.body.fee_name);

            if(!feeTypeCheck) 
                return res.status(400).json({ "message": `Fee with name ${req.body.fee_name} does not exists`, "res": "2"});

            feeChargeBatch.fee_name = req.body.fee_name;

        }
        if (req.body?.amount) feeChargeBatch.amount = req.body.amount;
        if (req.body?.fee_details) feeChargeBatch.fee_details = req.body.fee_details;
        await school.save();
        res.status(200).json({ "message": "Fee charge batch has been edited succesfully successfully"});
    } catch (error) {
        res.status(400).json({"message": "An error has occured please try again later"});   
    }
}

const receiveFee = async (req, res) => {
    if( !req?.body?.student_id || !req?.body?.amount || !req?.body?.details || !req?.body?.mode || !req?.body?.receipt_id || !req?.body?.date_received ) {
        return res.status(400).json({ 'message' : `Student with ID name is required`});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if( !school_details ) return res.status(400).json( {"message": "school not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const found = school.students.find(element => element.student_id == req.body.student_id);

    if(!found) return res.status(404).json({ "message": `Student with ID ${req.body.student_id} does not exists`, "res": "2"});
   
    res.status(200).json(found);
}

const updateReceivedFee = async (req, res) => {
    if(!req?.body?.student_id) {
        return res.status(400).json({ 'message' : `Student with ID name is required`});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const found = school.students.find(element => element.student_id == req.body.student_id);

    if(!found) return res.status(404).json({ "message": `Student with ID ${req.body.student_id} does not exists`, "res": "2"});
   
    res.status(200).json(found);
}

const delteReceiveFee = async (req, res) => {
    if(!req?.body?.student_id) {
        return res.status(400).json({ 'message' : `Student with ID name is required`});
    }

    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    const found = school.students.find(element => element.student_id == req.body.student_id);

    if(!found) return res.status(404).json({ "message": `Student with ID ${req.body.student_id} does not exists`, "res": "2"});
   
    res.status(200).json(found);
}

module.exports = {
    getChargedFees,
    chargeFees,
    updateFeeCharged,
    deleteFeeCharged,
    receiveFee,
    updateReceivedFee,
    delteReceiveFee
}