const mysql = require("mysql2");
class employee_db {
  constructor() {
    let fields = [];

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
      }
    });
  }

  async getData(sql, cb) {
    this.db.query(sql, function (err, results) {
      //console.log(results);
      //console.log(this.fields + "abc");
      cb(null, results);
    });
    //console.table(reslt);
    //return reslt;
  }
}

class department extends employee_db {
  viewDepartments() {
    const sql = "SELECT * FROM department;";
    return sql;
  }
}

class role extends employee_db {
  viewRoles() {
    this.fields = ["id", "title", "department", "salary"];
    super.fields = this.fields;
    console.log(this.fields);
    const sql = `SELECT r.id, r.title, d.name as department, r.salary FROM
      role r inner join department d on r.department_id=d.id;`;
    return sql;
  }
}

module.exports = { employee_db, department, role };
