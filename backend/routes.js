const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("./db");

const router = express.Router();
const SECRET_KEY = "your_secret_key"; // Change this to a strong secret key

// **🔹 Signup API**
router.post("/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      console.log("📩 Received Signup Request:", req.body);  // Log request data
  
      if (!username || !email || !password) {
        return res.status(400).json({ error: "⚠️ Missing required fields!" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      
      console.log("🔐 Hashed Password:", hashedPassword); // Log hashed password
  
      const pool = await poolPromise;
      
      console.log("✅ Database Connected"); // Log if DB connection is successful
  
      const query = "INSERT INTO users (username, email, password) VALUES (@username, @email, @password)";
      
      console.log("📝 Running Query:", query); // Log query being executed
  
      await pool.request()
        .input("username", sql.VarChar, username)
        .input("email", sql.VarChar, email)
        .input("password", sql.VarChar, hashedPassword)
        .query(query);
  
      console.log("✅ User Registered Successfully!"); // Log success
  
      res.status(201).json({ message: "✅ User registered successfully!" });
  
    } catch (err) {
      console.error("❌ Signup Error:", err);  // Print full error details
      res.status(500).json({ error: "Signup failed!", details: err.message });
    }
  });
  
// **🔹 Login API**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const pool = await poolPromise;
    const result = await pool.request()
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM users WHERE email = @email");

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: "❌ User not found!" });
    }

    const user = result.recordset[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "❌ Incorrect password!" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "✅ Login successful!", token });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Login failed!" });
  }
});

module.exports = router;
