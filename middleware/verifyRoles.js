const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.role) return res.sendStatus(401);

        console.log(req.role);
        const rolesArray = [...allowedRoles];
        console.log(rolesArray);
        console.log(req.role);

        // const result = req.roles.map(role => rolesArray.includes(role)).find( val => val === true);


        // if(!result) return res.sendStatus(401);
        if(!rolesArray.includes(req.role)) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;