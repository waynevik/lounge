const User = require('../model/User');
const School = require('../model/School');

const handleLogout = async (req, res) => {
    const school_details = await User.findOne( {email: req.email}).exec();
    if(!school_details) return res.status(400).json( {"message": "school not found"});
    const school = await School.findOne( {_id: school_details.school_id}).exec();

    try {
        school_details.refreshToken = '';
        await school_details.save();
        
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:true}); //secure: true - only serves https
        return res.status(200).json( {"message": "Logout Success", tag: "logout"});
    } catch (error) {
        return res.status(400).json( {"message": "Error occured", tag: "logout"});
    }       
}

module.exports = { handleLogout }