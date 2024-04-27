const mysql = require("mysql2");
class employee_db {
  constructor() {
    this.id = 0;
    const db = mysql.createConnection(
      {
        host: "localhost",
        // MySQL username,
        user: "root",
        // MySQL password
        password: "BCS$2024",
        database: "employee_db",
      },
      console.log(`Connected to the employee_db database.`)
    );
  }
  config() {}
}

module.exports = { employee_db };
