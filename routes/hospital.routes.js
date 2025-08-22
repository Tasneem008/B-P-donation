const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospital.controller.js');

// Dashboard
router.get('/dashboard', hospitalController.getDashboard);

// Submit new blood request
router.post('/', hospitalController.requestBlood);

// Approve/Reject actions
router.post('/approve/:id', hospitalController.approveRequest);
router.post('/reject/:id', hospitalController.rejectRequest);

router.get('/donor-request', hospitalController.getDonorRequestsPage)

module.exports = router;

