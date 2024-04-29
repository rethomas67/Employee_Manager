const mysql = require("mysql2");
class employee_db {
  constructor() {
    let fields = [];

    //connect to the database
    this.db = mysql.createConnection({
      host: "localhost",
      // MySQL username,
      user: "root",
      // MySQL password
      password: "BCS$2024",
      database: "employee_db",
    });
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

  async getData(sql, paramValues, cb) {
    this.db.query(sql, paramValues, function (err, results) {
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
  deleteDepartment() {
    const sql = `delete from department
    where id=?`;
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
  deleteRole() {
    const sql = `delete from role
    where id=?`;
    return sql;
  }
}

class employee extends employee_db {
  viewEmployees() {
    const sql = `select e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, concat(m.first_name, ' ', m.last_name) as manager
    from employee e inner join role r on e.role_id = r.id
    inner join department d on r.department_id = d.id
    left join employee m on e.manager_id = m.id;`;
    return sql;
  }
  viewEmployeesByDepartment() {
    const sql = `select e.id, e.first_name, e.last_name, d.name as department
    from employee e inner join role r on e.role_id = r.id
    inner join department d on r.department_id = d.id
    where d.id=?`;
    return sql;
  }
  viewDepartments() {
    const sql = `select id, name from department`;
    return sql;
  }
  viewManagers() {
    const sql = `select 0 as id, 'None' as manager
        UNION
        select e.id, CONCAT(e.first_name,' ', e.last_name) AS manager
    from employee e
    WHERE manager_id is null;`;
    return sql;
  }

  viewActiveManagers() {
    const sql = `
    select e.id, CONCAT(e.first_name,' ', e.last_name) AS manager
    from employee e
    WHERE manager_id is null;`;
    return sql;
  }

  addEmployee() {
    const sql = `INSERT INTO employee(first_name,last_name,role_id,manager_id)
    values(?,?,?,?)`;
    return sql;
  }
  viewEmployeeNames() {
    const sql = `select e.id, CONCAT(e.first_name,' ', e.last_name) as name
    from employee e`;
    return sql;
  }
  viewManagedEmployeeNames() {
    const sql = `select e.id, CONCAT(e.first_name,' ', e.last_name) as name
    from employee e
    where manager_id is not null`;
    return sql;
  }
  viewEmployeeNamesByManager() {
    const sql = `select e.id, CONCAT(e.first_name,' ', e.last_name) as name
    from employee e
    where manager_id=?`;
    return sql;
  }
  updateEmployee() {
    const sql = `UPDATE employee
    set role_id=?
    where id=?`;
    return sql;
  }
  updateEmployeeManager() {
    const sql = `UPDATE employee
    set manager_id=?
    where id=?`;
    return sql;
  }

  deleteEmployee() {
    const sql = `delete from employee
    where id=?`;
    return sql;
  }
  viewDepartmentBudget() {
    const sql = `select  d.name,sum(salary) as total_utilized_budget
    from employee e inner join role r on e.role_id = r.id
    inner join department d on r.department_id = d.id
    where d.id=?
    group by  d.name
    
    `;
    return sql;
  }
}

module.exports = { employee_db, department, role, employee };
