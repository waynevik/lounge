const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), playerController.handelGetAllPlayers);    
router.route('/team')
    .get(verifyRoles(ROLES_LIST.TMANAGER), playerController.handelTeamPlayers)
    .post(verifyRoles(ROLES_LIST.TMANAGER), playerController.handelNewPlayer)
    .patch(verifyRoles(ROLES_LIST.TMANAGER), playerController.handleEditPlayer)
    .delete(verifyRoles(ROLES_LIST.TMANAGER), playerController.handleDeletePlayer);

module.exports = router;