const express = require('express')
const { createDonor, updateDonor, deleteDonor, getDonors, getDonorDetails } = require("../Controller/donorController");
const { createBank, updateBank, deleteBank, getBanks, getBankDetails } = require('../Controller/bankController');

const router = express.Router()

router.post('/createBank', createBank);

router.patch('/updateBank/:bank_id', updateBank);

router.delete('/deleteBank/:bank_id', deleteBank);

router.post('/getBanks', getBanks);

router.get('/getBank/:bank_id', getBankDetails);

//router.post('/assign_project/employee/:emp_id/project/:proj_id',assign_project);

module.exports = router