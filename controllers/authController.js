const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if(!email || !pwd) return res.status(400).json({"message" : 'User Name and Password are required.'});  
    const foundUser =  await User.findOne({ email: email}).exec();

    if(!foundUser) return res.status(400).json({"message" : 'Wrong username or password.'});  
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);

    const role = foundUser.role;

    if(match) {
        // create JWTs here for authentications
        const accessToken = jwt.sign(
            {
                "UserInfo": 
                    { 
                        "email": foundUser.email,
                        "role": role
                    }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '100000s' }
        );
        const refreshToken = jwt.sign(
            {"email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        //   Saving refresh token with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure:true, maxAge: 24 * 60 * 60 *1000}); //secure:true,
        res.json({ accessToken, role, refreshToken });
    }else {
        res.sendStatus(400);
    }
}

const handleUserDetails = async (req, res) => {
    const user_details = await User.findOne( {email: req.email}).exec();
    if(!user_details) return res.status(400).json( {"message": "User not found"});

    res.status(200).json(user_details);
}

module.exports = { handleLogin, handleUserDetails };