const email = "tsubramanyam071@gmail.com";
const password = "Nyra@1432";
const role = "user";

async function testApi() {
  try {
    console.log(`Registering ${email}`);
    const regRes = await fetch("http://localhost:5000/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });
    console.log("Register response:", await regRes.text());
    
    // Check what the OTP in the DB is
    const mongoose = require('mongoose');
    const uri = "mongodb+srv://tsubramanyam133_db_user:zmYt4aJkIzbAnsc9@cluster1.l0qwzqz.mongodb.net/sakhi_ai?appName=Cluster1";
    await mongoose.connect(uri);
    const user = await mongoose.connection.db.collection('users').findOne({ email });
    
    if (user && user.otp) {
      console.log(`Verifying OTP ${user.otp}`);
      const verRes = await fetch("http://localhost:5000/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: user.otp })
      });
      const data = await verRes.json();
      console.log("Verify response:", data);
      
      if (data.accessToken) {
        console.log(`Sending log...`);
        const logRes = await fetch("http://localhost:5000/api/v1/tracker/cycles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.accessToken}`
          },
          body: JSON.stringify({
            startDate: new Date().toISOString(),
            cycleLength: 28,
            periodLength: 5
          })
        });
        const logData = await logRes.json();
        console.log("Save log response:", logData);
      }
    }
    process.exit(0);
  } catch(e) {
    console.error("Error:", e.message);
    process.exit(1);
  }
}

testApi();
