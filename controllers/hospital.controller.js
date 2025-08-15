const BloodRequest = require('../models/BloodRequest');

exports.getDashboard = async (req, res) => {
  try {
    const totalUnits = 120; // Placeholder, can be calculated if you have stock collection
    const donorPending = 14; // Example static value, you can make it dynamic
    const recipientPending = await BloodRequest.countDocuments({ status: 'Pending' });
    const recipientFulfilled = await BloodRequest.countDocuments({ status: 'Fulfilled' });

    // Fetch all requests for the table
    const requests = await BloodRequest.find().sort({ createdAt: -1 });

    res.render('hospital-panel', {
      data: {
        availableUnits: totalUnits,
        donorPending,
        recipientPending,
        recipientFulfilled
      },
      requests
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.requestBlood = async (req, res) => {
  try {
    const { bloodType, quantity, urgency, notes } = req.body;

    const newRequest = new BloodRequest({
      bloodType,
      quantity,
      urgency,
      notes
    });

    await newRequest.save();
    res.redirect('/hospital');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Approve a blood request
exports.approveRequest = async (req, res) => {
  try {
    await BloodRequest.findByIdAndUpdate(req.params.id, { status: 'Fulfilled' });
    res.redirect('/hospital');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Reject a blood request
exports.rejectRequest = async (req, res) => {
  try {
    await BloodRequest.findByIdAndUpdate(req.params.id, { status: 'Rejected' });
    res.redirect('/hospital');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
