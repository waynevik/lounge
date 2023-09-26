const express = require('express');
const router = express.Router();
const studentsController = require('../../controllers/studentsController.js');
const ROLES_LIST = require('../../config/roles_list.js');
const verifyRoles = require('../../middleware/verifyRoles.js');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), studentsController.getAllStudents)
    .post(verifyRoles(ROLES_LIST.Admin), studentsController.createNewStudent)
    .put(verifyRoles(ROLES_LIST.Admin), studentsController.updateStudent)

router.route('/delete')
    .post(studentsController.deleteStudent);

router.route('/one')
    .get(studentsController.getStudent);

module.exports =  router;