const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken =  async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401); 
    const refreshToken =  cookies.jwt;

    const foundUser =  await User.findOne({ refreshToken}).exec();
    if(!foundUser) return res.status(403).json({"message": "not found"});  //forbiden

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET, 
        (err, decoded) => {

            if(err || foundUser.email !== decoded.email) return res.sendStatus(403);
         
            const role = foundUser.role;

            const accessToken = jwt.sign(
                {
                    "UserInfo": 
                        { 
                            "email": foundUser.email,
                            "role": role
                        }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '100000s'}
            );
            res.json({accessToken, role});
        }
    )
}

module.exports = { handleRefreshToken }