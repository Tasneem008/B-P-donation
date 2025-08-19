const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    hisId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    reqId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    acceptedDate: { type: Date, default: Date.now },
    status: { type: String, required:true }
});

module.exports = mongoose.model("History", historySchema);