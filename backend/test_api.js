const email1 = "9391361665";
const email2 = "9391361665@gmail.com";
const password = "Nyra@1432";

async function testLogin(email) {
  try {
    console.log(`Trying login with ${email}`);
    const res = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log("Login response for", email, ":", data);
    
    if (data.accessToken) {
      console.log(`Sending log for ${email}...`);
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
  } catch(e) {
    console.error("Error with", email, ":", e.message);
  }
}

async function run() {
  await testLogin(email1);
  await testLogin(email2);
}

run();
