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
      cb(null, results);
    });
  }

  async setData(sql, paramValues) {
    this.db.query(sql, paramValues, function (err, results) {
      if (err) {
        console.log(err);
        return err;
      } else {
        return;
      }
    });
  }
}

class department extends employee_db {
  viewDepartments() {
    const sql = "SELECT * FROM department;";
    return sql;
  }

  addDepartment() {
    const sql = `INSERT INTO department(name)
      values(?)`;
    return sql;
  }
}

class role extends employee_db {
  viewRoles() {
    const sql = `SELECT r.id, r.title, d.name as department, r.salary FROM
      role r inner join department d on r.department_id=d.id;`;
    return sql;
  }

  addRole() {
    const sql = `INSERT INTO role(title,department_id,salary)
      values(?,?,?)`;
    return sql;
  }
}

class employee extends employee_db {
  viewRoles() {
    //this.fields = ["id", "title", "department", "salary"];
    //super.fields = this.fields;
    //console.log(this.fields);
    const sql = `select e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, concat(m.first_name, ' ', m.last_name) as manager
    from employee e inner join role r on e.role_id = r.id
    inner join department d on r.department_id = d.id
    left join employee m on e.manager_id = m.id;`;
    return sql;
  }
}

module.exports = { employee_db, department, role, employee };
