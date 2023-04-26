const express = require('express')
const { createDonor, updateDonor, deleteDonor, getDonors, getDonorDetails } = require("../Controller/donorController");

const router = express.Router()

router.post('/createDonor', createDonor);

router.patch('/updateDonor/:donor_id', updateDonor);

router.delete('/deleteDonor/:donor_id', deleteDonor);

router.get('/getDonors', getDonors);

router.get('/getDonor/:donor_id', getDonorDetails);

//router.post('/assign_project/employee/:emp_id/project/:proj_id',assign_project);

module.exports = router