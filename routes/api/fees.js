const express = require('express');
const router = express.Router();
const feesController = require('../../controllers/feesContolller.js');
const feeTypeController = require('../../controllers/feeTypeController.js');
const ROLES_LIST = require('../../config/roles_list.js');
const verifyRoles = require('../../middleware/verifyRoles.js');

router.route('/charge')
    .get(verifyRoles(ROLES_LIST.Admin), feesController.getChargedFees)
    .post(verifyRoles(ROLES_LIST.Admin), feesController.chargeFees)
    .put(verifyRoles(ROLES_LIST.Admin), feesController.updateFeeCharged)
    
router.route('/charge/delete')
    .post(verifyRoles(ROLES_LIST.Admin), feesController.deleteFeeCharged);

router.route('/receive')
    .get(verifyRoles(ROLES_LIST.Admin), feesController.getReceivedFees)
    .post(verifyRoles(ROLES_LIST.Admin), feesController.receiveFee)
    .put(verifyRoles(ROLES_LIST.Admin), feesController.updateReceivedFee)
    .delete(verifyRoles(ROLES_LIST.Admin), feesController.deleteReceiveFee)

router.route('/delete')
    .post(verifyRoles(ROLES_LIST.Admin), feesController.deleteReceiveFee)

router.route('/check')
    .get(verifyRoles(ROLES_LIST.Admin), feesController.getChargeGroups)
    .post(verifyRoles(ROLES_LIST.Admin), feesController.getStudentFees)

router.route('/type')
    .get(verifyRoles(ROLES_LIST.Admin), feeTypeController.getFeeTypes)
    .post(verifyRoles(ROLES_LIST.Admin), feeTypeController.createNewFeeType)
    .put(verifyRoles(ROLES_LIST.Admin), feeTypeController.updateFeeType)

module.exports =  router;