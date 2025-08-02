const BloodRequest = require('../models/BloodRequest.js');
const User = require('../models/User.js');

exports.showBloodTypes = (req, res) => {
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  res.render('recipient-blood', { bloodTypes });
};

exports.showRequestForm = (req, res) => {
  const bloodType = req.params.bloodType;
  res.render('send-request', { bloodType });
};

exports.submitRequest = async (req, res) => {
  const { bloodType, hospital, location, description, requestedDate } = req.body;

  await BloodRequest.create({
    bloodType,
    recipientId: req.session.userId,
    hospital,
    location,
    description,
    requestedDate
  });

  res.send('Request submitted successfully!');
};
