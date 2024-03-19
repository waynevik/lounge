const User = require('../model/User');
const bcrypt = require('bcrypt');
const validator = require('validator');

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const USER_REGEX = /^[A-z]{3,23}$/;    
const EMAIL_REGEX = /\S+@\S+\.\S+/;

const handleGetUsers = async (req, res) => {
    const users = await User.find();
    const tUsers = users.map( (user, index) => {
        // user = user.
        return {
            firstname: user.lastname,
            lastname: user.firstname,
            email: user.email,
            phone_number: user.phone_number,
            createdAt: user.createdAt,
            team: user.team,
            role: user.role,
            id: user._id,
            no: index+1
        };
    }); 
    res.status(200).json({message: "success", data: tUsers.reverse()});
}

const handleUserUpdate = async(req, res) => {
    if(!req?.body?.id || !req.body?.phone_number || !req.body?.firstname || !req.body?.lastname || !req.body?.role || typeof req.body.role !== 'number') {
        return res.status(400).json({ 'message' : 'All parameters are required'});
    }
    const userFind = await User.findOne({_id: req.body.id}).exec();

    if (!userFind) {
        return res.status(204).json({ "message": `User does not exist` });
    }

    try{
         // if (req.body?.hashedPwd) {userFind.firstname = await bcrypt.hash(req?.body?.pwd, 10);}
        userFind.phone_number = req.body.phone_number;
        userFind.firstname = req.body.firstname;
        userFind.lastname = req.body.lastname;
        userFind.role = req.body.role;
        await userFind.save();
        res.status(201).json({'success' : `User has been edited successfully`});

    }catch(err){
        res.status(500).json({'message' : 'An error has occurred try again later'});
    }   
}

const handleDeleteUser = async ( req, res ) => {
    if(!req?.body?.id ) {
        return res.status(400).json({ 'message' : 'All parameters are required'});
    }

    try {
        const userFind = await User.findOne({_id: req.body.id}).exec();
    
        if (!userFind) {
            return res.status(400).json({ "message": `User no longer exist` });
        }

        const result = await userFind.deleteOne({_id: req.body.id});

        res.status(201).json({ 'success' : `User has been deleted successfully` , userFind});
        
    } catch (error) {

        return res.status(400).json({ "message": `User does not exist` });

    }   
}

const handleNewUser = async (req, res) => {
    const { email, pwd, phone_number, firstname, lastname, role } = req.body;
    if(!email || !pwd || !phone_number || !firstname || !lastname || !role) return res.status(400).json({"message" : 'All data is required',  "code": "1"});  

    // check for duplicate usernames in db
    const duplicate =  await User.findOne({ email: email}).exec();
    if(!validator.isEmail(email)) return res.status(400).json( {"message": "Provide a valid email address", "code": "2" });
    if(duplicate) return res.status(409).json({message: `User with email - ${email} already exist`}); // conflict

    if(
        !USER_REGEX.test(firstname) || 
        !USER_REGEX.test(lastname) || 
        !PWD_REGEX.test(pwd) || 
        !EMAIL_REGEX.test(email)
    )
    return res.status(400).json( {"message": "One of the input is wrong", "code": "2" });

    try {
        // encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // create and store new user
        const userResult = await User.create({
             "email" : email, 
             "password" :  hashedPwd,
             "firstname": firstname,
             "lastname": lastname,
             "phone_number": phone_number, 
             role: role
        });
      
        res.status(201).json({'success' : `New user ${email} created`});

    } catch (err) {
        res.status(500).json({'message' : err.message});
    }
}

module.exports = { handleNewUser, handleUserUpdate, handleGetUsers, handleDeleteUser };