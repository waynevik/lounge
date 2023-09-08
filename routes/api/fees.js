const express = require('express');
const router = express.Router();
const feesController = require('../../controllers/feesContolller.js');
const feeTypeController = require('../../controllers/feeTypeController.js');
const ROLES_LIST = require('../../config/roles_list.js');
const verifyRoles = require('../../middleware/verifyRoles.js');

router.route('/')
    .get(verifyRoles(ROLES_LIST.Admin), feesController.getChargedFees)
    .post(verifyRoles(ROLES_LIST.Admin), feesController.chargeFees)
    .put(verifyRoles(ROLES_LIST.Admin), feesController.updateFeeCharged)
    .delete(verifyRoles(ROLES_LIST.Admin), feesController.deleteFeeCharged);

router.route('/receive')
    .post(verifyRoles(ROLES_LIST.Admin), feesController.receiveFee)
    .put(verifyRoles(ROLES_LIST.Admin), feesController.updateReceivedFee)
    .delete(verifyRoles(ROLES_LIST.Admin), feesController.deleteReceiveFee)

router.route('/check')
    .post(verifyRoles(ROLES_LIST.Admin), feesController.getStudentFees)


router.route('/type')
    .get(verifyRoles(ROLES_LIST.Admin), feeTypeController.getFeeTypes)
    .post(verifyRoles(ROLES_LIST.Admin), feeTypeController.createNewFeeType)
    .put(verifyRoles(ROLES_LIST.Admin), feeTypeController.updateFeeType)

module.exports =  router;