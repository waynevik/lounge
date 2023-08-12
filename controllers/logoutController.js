const User = require('../model/User');

const handleLogout = async (req, res) => {
    //  on Client also delete the access token

    const cookies = req.cookies;
    console.log("here1");
    if(!cookies?.jwt) return res.sendStatus(204);  // no content
    const refreshToken =  cookies.jwt;
    console.log("here2");
    // is refresh token in DB?
    const foundUser = await User.findOne({ refreshToken }).exec();

    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:truey});
        return res.sendStatus(204);
    }  //forbiden

    // delete refresh token in db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);
  
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure:true}); //secure: true - only serves https
    res.sendStatus(204);
       
}

module.exports = { handleLogout }