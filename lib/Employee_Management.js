const mysql = require("mysql2");
class employee_db {
  constructor() {
    this.id = 0;
    //connect to the database
    this.db = mysql.createConnection(
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

  closeConnection() {
    this.db.end((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log("connection closed");
      }
    });
  }

  getData(sql) {
    console.log(sql);
    this.db.query(sql, function (err, results) {
      console.table(results);
    });
  }
}

class department extends employee_db {
  viewDepartments() {
    const sql = "SELECT * FROM department;";
    return sql;
  }
}

module.exports = { employee_db, department };
