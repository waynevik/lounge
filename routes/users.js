const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyRoles = require('../middleware/verifyRoles');
const ROLES_LIST = require('../config/roles_list');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), usersController.handleGetUsers)
    .post(verifyRoles(ROLES_LIST.Admin), usersController.handleNewUser)
    .patch(verifyRoles(ROLES_LIST.Admin), usersController.handleUserUpdate)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.handleDeleteUser)

module.exports = router;