// -------------------------------
// IMPORTS
// -------------------------------
const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const fs = require("fs");

// -------------------------------
// LOAD SERVICE ACCOUNT
// -------------------------------
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

<<<<<<< HEAD

=======
>>>>>>> d835c88f4a49ed765a1336520ea4f7529684624a

// -------------------------------
// INIT FIREBASE ADMIN
// -------------------------------
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL

});

// -------------------------------
// EXPRESS SERVER SETUP
// -------------------------------
const app = express();
app.use(bodyParser.json());

// -------------------------------
// SIMPLE API KEY (security for ESP32)
// Replace with your own strong key
// -------------------------------
const API_KEY = "PARTH_ESP32_SUPERKEY_938573";


// -------------------------------
// AUTH MIDDLEWARE
// -------------------------------
function verifyApiKey(req, res, next) {
  const key = req.header("x-api-key");
  if (!key || key !== API_KEY)
    return res.status(401).json({ error: "Unauthorized" });

  next();
}

// -------------------------------
// FIREBASE DB REFERENCE
// -------------------------------
const db = admin.database();
const ref = db.ref("pet_data");  // folder in your database

// -------------------------------
// ROUTE: Write sensor data
// -------------------------------
app.post("/write", verifyApiKey, async (req, res) => {
  try {
    const data = req.body;

    const entry = {
      temperature: data.temperature || null,
      heart_rate: data.heart_rate || null,
      spo2: data.spo2 || null,
      gps: data.gps || null,
      accelerometer: data.accelerometer || null,
      timestamp: admin.database.ServerValue.TIMESTAMP
    };

    const newRef = await ref.push(entry);

    return res.json({ status: "ok", key: newRef.key });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
});

// -------------------------------
// HEALTH CHECK
// -------------------------------
app.get("/health", (req, res) => res.json({ status: "online" }));

// -------------------------------
// START SERVER
// -------------------------------
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
