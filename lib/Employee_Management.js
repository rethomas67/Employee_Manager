//import mysql
const mysql = require("mysql2");
//Database Entity
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
  //Disconnect
  closeConnection() {
    this.db.end((error) => {
      if (error) {
        console.log(error);
      }
    });
  }
  //For selection queries with a callback to return the results
  async getData(sql, cb) {
    this.db.query(sql, function (err, results) {
      cb(null, results);
    });
  }
  //override getData with parameters
  async getData(sql, paramValues, cb) {
    this.db.query(sql, paramValues, function (err, results) {
      cb(null, results);
    });
  }
  //Updates, Deletions, and Inserts with parameters
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
//Department Queries
class department extends employee_db {
  //Select wildcard
  viewDepartments() {
    const sql = "SELECT * FROM department;";
    return sql;
  }
  //Add to the table with the prepared statement value will go into name
  addDepartment() {
    const sql = `INSERT INTO department(name)
      values(?)`;
    return sql;
  }
  //Delete to the table with the prepared statement where the value is id
  deleteDepartment() {
    const sql = `delete from department
    where id=?`;
    return sql;
  }
  //aggregate by department. Group by the department and sum the salary
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
//role queries
class role extends employee_db {
  //select join with roles table and department table
  viewRoles() {
    const sql = `SELECT r.id, r.title, d.name as department, r.salary FROM
      role r inner join department d on r.department_id=d.id;`;
    return sql;
  }
  //Add data to role with the prepared statement values
  addRole() {
    const sql = `INSERT INTO role(title,department_id,salary)
      values(?,?,?)`;
    return sql;
  }
  //Delete from role with the prepared statement id
  deleteRole() {
    const sql = `delete from role
    where id=?`;
    return sql;
  }
}
//Employee queries
class employee extends employee_db {
  //select all employees with join to role,department,and self join to employee for managers
  viewEmployees() {
    const sql = `select e.id, e.first_name, e.last_name, r.title, d.name as department, r.salary, concat(m.first_name, ' ', m.last_name) as manager
    from employee e inner join role r on e.role_id = r.id
    inner join department d on r.department_id = d.id
    left join employee m on e.manager_id = m.id;`;
    return sql;
  }
  //select employees from a given department
  viewEmployeesByDepartment() {
    const sql = `select e.id, e.first_name, e.last_name, d.name as department
    from employee e inner join role r on e.role_id = r.id
    inner join department d on r.department_id = d.id
    where d.id=?`;
    return sql;
  }

  viewManagers() {
    //Union query with first row without a manager, then the list with manager_id null for managers
    const sql = `select 0 as id, 'None' as manager
        UNION
        select e.id, CONCAT(e.first_name,' ', e.last_name) AS manager
    from employee e
    WHERE manager_id is null;`;
    return sql;
  }

  viewActiveManagers() {
    //Append first name and last name as a column for managers. Id is null for managers
    const sql = `
    select e.id, CONCAT(e.first_name,' ', e.last_name) AS manager
    from employee e
    WHERE manager_id is null;`;
    return sql;
  }
  //Adding employees with the prepared statement values
  addEmployee() {
    const sql = `INSERT INTO employee(first_name,last_name,role_id,manager_id)
    values(?,?,?,?)`;
    return sql;
  }
  //View all employee names append first name and last name as column
  viewEmployeeNames() {
    const sql = `select e.id, CONCAT(e.first_name,' ', e.last_name) as name
    from employee e`;
    return sql;
  }
  //View employees who have a manager, managerid is not null
  viewManagedEmployeeNames() {
    const sql = `select e.id, CONCAT(e.first_name,' ', e.last_name) as name
    from employee e
    where manager_id is not null`;
    return sql;
  }
  //View all employees under a manager
  viewEmployeeNamesByManager() {
    const sql = `select e.id, CONCAT(e.first_name,' ', e.last_name) as name
    from employee e
    where manager_id=?`;
    return sql;
  }
  //update the employees role
  updateEmployee() {
    const sql = `UPDATE employee
    set role_id=?
    where id=?`;
    return sql;
  }
  //update the employees manager
  updateEmployeeManager() {
    const sql = `UPDATE employee
    set manager_id=?
    where id=?`;
    return sql;
  }
  //Delete an employee
  deleteEmployee() {
    const sql = `delete from employee
    where id=?`;
    return sql;
  }
}
//Export the database classes
module.exports = { employee_db, department, role, employee };
