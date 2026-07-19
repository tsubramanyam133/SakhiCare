const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const uri = "mongodb+srv://tsubramanyam133_db_user:zmYt4aJkIzbAnsc9@cluster1.l0qwzqz.mongodb.net/sakhi_ai?appName=Cluster1";
const jwtSecret = "sakhi_super_secret_key_8f92a1b4c3d5e6f7g8h9";
const email = "tsubramanyam133@gmail.com";

async function testApi() {
  try {
    await mongoose.connect(uri);
    const user = await mongoose.connection.db.collection('users').findOne({ email });
    if (!user) {
      console.log("User not found!");
      process.exit(1);
    }
    
    console.log(`Found user ${user.email} with ID ${user._id}`);
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      jwtSecret,
      { expiresIn: '15m' }
    );
    
    console.log(`Sending log for ${email}...`);
    const logRes = await fetch("http://localhost:5000/api/v1/tracker/cycles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        startDate: new Date().toISOString(),
        cycleLength: 28,
        periodLength: 5
      })
    });
    const logData = await logRes.json();
    console.log("Save log response:", logData);
    
    process.exit(0);
  } catch(e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
}

testApi();
