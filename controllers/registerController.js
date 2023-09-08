const User = require('../model/User');
const School = require('../model/School');
const bcrypt = require('bcrypt');
const validator = require('validator');

const handelNewUser =  async (req, res) => {
    const { email, pwd, school_name, firstname, lastname } = req.body;
    if(!email || !pwd || !school_name || !firstname || !lastname) return res.status(400).json({"message" : 'All data is required',  "code": "1"});  

    // check for duplicate usernames in db
    const duplicate =  await User.findOne({ email: email}).exec();
    if(!validator.isEmail(email)) return res.status(400).json( {"message": "Provide a valid email address", "code": "2" });
    if(duplicate) return res.sendStatus(409); // conflict

    const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
    const SCHOOL_REGEX = /^[A-z][A-z0-9-_ ]{3,53}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    const EMAIL_REGEX = /\S+@\S+\.\S+/;

    if(
        !USER_REGEX.test(firstname) || 
        !USER_REGEX.test(lastname) || 
        !SCHOOL_REGEX.test(school_name) || 
        !PWD_REGEX.test(pwd) || 
        !EMAIL_REGEX.test(email)
    )
    return res.status(400).json( {"message": "One of the input is wrong", "code": "2" });

    try {
        // encrypt password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // create school
        const school_result = await School.create({        
            "school_name" : school_name, 
            "admin_name" : firstname+" "+lastname, 
            "admin_email" : email, 
        });

        const school_id = school_result._id.toString();

        // create and store new user
        const userResult = await User.create({
             "email" : email, 
             "password" :  hashedPwd,
             "firstname": firstname,
             "lastname": lastname,
             "school_id": school_id
        });

        // const clusterResult = await 

        console.log(userResult);
      
        res.status(201).json({'success' : `New user ${email} created`});

    } catch (err) {
        res.status(500).json({'message error' : err.message});
    }
}

module.exports = { handelNewUser };