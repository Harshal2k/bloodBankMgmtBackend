const express = require('express')
const { createDonor, updateDonor, deleteDonor, getDonors, getDonorDetails } = require("../Controller/donorController");
const { createBloodBag, updateBloodBag, deleteBloodBag, getBloodBags, getBloodBagDetails } = require('../Controller/bloodBagController');

const router = express.Router()

router.post('/createBloodBag', createBloodBag);

router.patch('/updateBloodBag/:bag_id', updateBloodBag);

router.delete('/deleteBloodBag/:bag_id', deleteBloodBag);

router.get('/getBloodBag', getBloodBags);

router.get('/getBloodBag/:bag_id', getBloodBagDetails);

module.exports = router