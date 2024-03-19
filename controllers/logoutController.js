const User = require('../model/User');

const handleLogout = async (req, res) => {
    const user_details = await User.findOne( {email: req.email}).exec();
    if(!user_details) return res.status(400).json( {"message": "User not found"});

    try {
        user_details.refreshToken = '';
        await user_details.save();
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:true}); //secure: true - only serves https
        return res.status(200).json( {"message": "Logout Success", tag: "logout"});
    } catch (error) {
        return res.status(400).json( {"message": "Error occurred", tag: "logout"});
    }       
}

module.exports = { handleLogout }