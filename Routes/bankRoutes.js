const express = require('express')
const { createDonor, updateDonor, deleteDonor, getDonors, getDonorDetails } = require("../Controller/donorController");
const { createBank, updateBank, deleteBank, getBanks, getBankDetails, getBankDonors, getDashboardData } = require('../Controller/bankController');

const router = express.Router()

router.post('/createBank', createBank);

router.patch('/updateBank/:bank_id', updateBank);

router.delete('/deleteBank/:bank_id', deleteBank);

router.post('/getBanks', getBanks);

router.post('/getBanksDonors/:bank_id', getBankDonors);

router.get('/getBank/:bank_id', getBankDetails);

router.get('/getDashboardData', getDashboardData);



//router.post('/assign_project/employee/:emp_id/project/:proj_id',assign_project);

module.exports = router