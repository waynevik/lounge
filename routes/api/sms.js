const express = require('express');
const router = express.Router();
const smsController = require('../../controllers/smsController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), smsController.getSmsSent)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), smsController.sendSms)

module.exports =  router;