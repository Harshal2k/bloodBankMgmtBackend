const express = require('express')
const { createPatient, updatePatient, getPatients, getPatientDetails } = require('../Controller/patientController');

const router = express.Router()

router.post('/createPatient', createPatient);

router.patch('/updatePatient/:pid', updatePatient);

router.post('/getPatients', getPatients);

router.get('/getPatient/:pid', getPatientDetails);

//router.post('/assign_project/employee/:emp_id/project/:proj_id',assign_project);

module.exports = router