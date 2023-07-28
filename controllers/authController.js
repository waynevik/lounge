const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if(!email || !pwd) return res.status(400).json({"message" : 'User Name and Password are required.'});  

    const foundUser =  await User.findOne({ email: email}).exec();

    if(!foundUser) return res.sendStatus(401);
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match) {
        const roles = Object.values(foundUser.roles);
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
            {"username": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );

        //   Saving refresh token with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None',  maxAge: 24 * 60 * 60 *1000}); //secure:true,
        res.json({ accessToken});
    }else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };