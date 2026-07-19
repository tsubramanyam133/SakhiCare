const mongoose = require('mongoose');

const uri = "mongodb+srv://tsubramanyam133_db_user:zmYt4aJkIzbAnsc9@cluster1.l0qwzqz.mongodb.net/sakhi_ai?appName=Cluster1";

async function run() {
  await mongoose.connect(uri);
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log("Users:");
  console.dir(users, { depth: null });
  process.exit(0);
}

run().catch(console.dir);
