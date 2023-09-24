const express = require('express');
const router = express.Router();
const routesController = require('../../controllers/routesController.js');
const routesStudentController = require('../../controllers/routeStudentsController.js');
const ROLES_LIST = require('../../config/roles_list.js');
const verifyRoles = require('../../middleware/verifyRoles.js');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), routesController.getAllRoutes)
    .post(verifyRoles(ROLES_LIST.Admin), routesController.createNewRoute)
    .put(verifyRoles(ROLES_LIST.Admin), routesController.updateRoute)
    .delete(verifyRoles(ROLES_LIST.Admin), routesController.deleteRoute);

router.route('/delete')
    .post(routesController.deleteRoute);

router.route('/one')
    .post(routesController.getOneRoute);

router.route('/students')
    .post(verifyRoles(ROLES_LIST.Admin), routesStudentController.addStudentToRoute)
    .delete(verifyRoles(ROLES_LIST.Admin), routesStudentController.removeStudentFromRoute);

router.route('/students/remove')
    .post(verifyRoles(ROLES_LIST.Admin), routesStudentController.removeStudentFromRoute);

module.exports =  router;