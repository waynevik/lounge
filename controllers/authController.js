const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if(!email || !pwd) return res.status(400).json({"message" : 'User Name and Password are required.'});  

    const foundUser =  await User.findOne({ email: email}).exec();

    if(!foundUser) return res.status(400).json({"message" : 'Wrong username or password.'});  
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs here for authentications
        const accessToken = jwt.sign(
            {
                "UserInfo": 
                    { 
                        "email": foundUser.email,
                        "roles": roles
                    }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1000s'}
        );
        const refreshToken = jwt.sign(
            {"email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );

        //   Saving refresh token with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure:true, maxAge: 24 * 60 * 60 *1000}); //secure:true,
        res.json({ accessToken, roles, refreshToken});
    }else {
        res.sendStatus(400);
    }
}

module.exports = { handleLogin };