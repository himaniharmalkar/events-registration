const { sql, poolPromise } = require("./db");

async function testDB() {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM users");
    console.log(result.recordset);
  } catch (err) {
    console.error("❌ Error querying database:", err);
  }
}

testDB();
