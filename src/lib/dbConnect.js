const mongoose = require("mongoose");
// As next.js is an edge time framework, the database isn't continously connected 
const connection = {};
// check if connected to db
async function dbConnect() {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
// connect if not already connected
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected successfully");
  } catch (err) {
    console.log("Database connection failed", err);
    process.exit(1);
  }
}

module.exports = dbConnect;
