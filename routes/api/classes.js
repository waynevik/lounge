const express = require('express');
const router = express.Router();
const classesController = require('../../controllers/classesController.js');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), classesController.getAllClasses)
    .post(verifyRoles(ROLES_LIST.Admin), classesController.createNewClass)
    .put(verifyRoles(ROLES_LIST.Admin), classesController.updateClass)
    .delete(verifyRoles(ROLES_LIST.Admin), classesController.deleteClass);

router.route('/delete')
    .post(verifyRoles(ROLES_LIST.Admin), classesController.deleteClass);

    
router.route('/:classname')
    .get(classesController.getClass);

module.exports =  router;