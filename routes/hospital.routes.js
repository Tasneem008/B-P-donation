const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospital.controller');

// Dashboard
router.get('/', hospitalController.getDashboard);

// Submit new blood request
router.post('/request-blood', hospitalController.requestBlood);

// Approve/Reject actions
router.post('/approve/:id', hospitalController.approveRequest);
router.post('/reject/:id', hospitalController.rejectRequest);

module.exports = router;

