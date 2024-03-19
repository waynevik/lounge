const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), teamController.handelGetTeams)
    .post(verifyRoles(ROLES_LIST.Admin), teamController.handelNewTeam)
    .patch(verifyRoles(ROLES_LIST.Admin), teamController.handelEditTeam)
    .delete(verifyRoles(ROLES_LIST.Admin), teamController.handleDeleteTeam)

module.exports = router;