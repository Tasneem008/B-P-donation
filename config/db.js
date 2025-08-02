const mongoose = require("mongoose");

const connectDB = async () => {
  const URI = process.env.MONGO_URL;
  try {
    const conn = await mongoose.connect(URI);
    console.log(conn.connection.host);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1); // process code 1 code means exit with failure, 0 means success.
  }
};

module.exports = connectDB;
