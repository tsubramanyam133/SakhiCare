const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MONGO_URI is not defined in environment");
  process.exit(1);
}

async function run() {
  await mongoose.connect(uri);
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log("Users:");
  console.dir(users, { depth: null });
  process.exit(0);
}

run().catch(console.dir);
