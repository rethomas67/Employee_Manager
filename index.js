const inquirer = require("inquirer");
const mysql = require("mysql2");
const {
  employee_db,
  department,
  role,
  employee,
} = require("./lib/Employee_Management");

managementList = [
  { selection: "View All Employees" },
  { selection: "Add Employee" },
  { selection: "Update Employee Role" },
  { selection: "View All Roles" },
  { selection: "Add Role" },
  { selection: "View All Departments" },
  { selection: "Add Department" },
];

const makeList = () => {
  const choice = managementList.map((selection, index) => {
    return {
      name: `${selection.selection}`,
      value: index,
    };
  });
  return {
    type: "list",
    message: "Which order to pick",
    name: "transaction",
    choices: choice,
  };
};

const addDepartmentQuestions = [
  {
    type: "input",
    name: "departmentName",
    message: "What is the name of the department? ",
  },
];

async function addDepartment(result) {
  let departmentEntity = new department();
  let sql = departmentEntity.addDepartment();

  await departmentEntity.setData(sql, result).then(() => {
    console.log(`Added ${result} to the database.`);
  });
}

async function addDepartmentPrompt() {
  let result = [];
  await inquirer.prompt(addDepartmentQuestions).then((data) => {
    result = [data.departmentName];
    addDepartment(result);
    return data;
  });
  return true;
}

const addRoleQuestions = (data) => {
  const choice = data.map((item, index) => {
    return {
      name: item.name,
      value: item.id,
    };
  });

  return [
    {
      type: "input",
      name: "roleName",
      message: "What is the name of the role? ",
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role? ",
    },
    {
      type: "list",
      message: "Which department does the role belong to?",
      name: "department",
      choices: choice,
    },
  ];
};

async function addRole(result) {
  let roleEntity = new role();
  let sql = roleEntity.addRole();

  await roleEntity.setData(sql, result).then(() => {});
}

async function addRolePrompt() {
  departmentEntity = new department();
  sql = departmentEntity.viewDepartments();
  await departmentEntity.getData(sql, function (err, departmentData) {
    inquirer.prompt(addRoleQuestions(departmentData)).then((data) => {
      result = [data.roleName, data.department, data.salary];
      addRole(result);
      console.log("a");
      console.log(`Added ${data.roleName} to the database.`);
      init();
    });
  });
}

const addManagerQuestions = (roleData, managerData) => {
  const roleChoice = roleData.map((item, index) => {
    return {
      name: item.title,
      value: item.id,
    };
  });

  const managerChoice = managerData.map((item, index) => {
    return {
      name: item.manager,
      value: item.id,
    };
  });

  return [
    {
      type: "input",
      name: "firstName",
      message: "What is the employess first name? ",
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employess last name? ",
    },
    {
      type: "list",
      message: "What is the employees role?",
      name: "role",
      choices: roleChoice,
    },
    {
      type: "list",
      message: "Who is the employees manager?",
      name: "manager",
      choices: managerChoice,
    },
  ];
};

async function addEmployee(result) {
  let employeeEntity = new employee();
  let sql = employeeEntity.addEmployee();

  await employeeEntity.setData(sql, result).then(() => {});
}

async function addManagerPrompt(roleData) {
  let employeeEntity = new employee();
  sqlManager = employeeEntity.viewManagers();

  await employeeEntity.getData(sqlManager, function (err, managerData) {
    inquirer.prompt(addManagerQuestions(roleData, managerData)).then((data) => {
      let managerId = null;
      console.log(data.manager);
      if (data.manager > 0) {
        managerId = data.manager;
      }
      result = [data.firstName, data.lastName, data.role, managerId];
      addEmployee(result);

      console.log(`Added ${data.firstName} ${data.lastName} to the database.`);

      init();
    });
  });
}

async function getEmployeeRole() {
  let roleEntity = new role();
  sqlRole = roleEntity.viewRoles();

  await roleEntity.getData(sqlRole, function (err, roleData) {
    addManagerPrompt(roleData);
  });
}

const addEmployeeQuestions = (roleData, managerData) => {
  const roleChoice = roleData.map((item, index) => {
    return {
      name: item.title,
      value: item.id,
    };
  });

  const employeeChoice = managerData.map((item, index) => {
    return {
      name: item.name,
      value: item.id,
    };
  });

  return [
    {
      type: "list",
      message: "Which employee's role do you want to update?",
      name: "name",
      choices: employeeChoice,
    },
    {
      type: "list",
      message:
        "Which employee's role do you want to assign to the selected user?",
      name: "role",
      choices: roleChoice,
    },
  ];
};

async function changeEmployeeRole(result) {
  let employeeEntity = new employee();
  let sql = employeeEntity.updateEmployee();

  await employeeEntity.setData(sql, result).then(() => {});
}

async function addEmployeePrompt(roleData) {
  let employeeEntity = new employee();
  sqlEmployee = employeeEntity.viewEmployeeNames();
  console.log(sqlEmployee);

  await employeeEntity.getData(sqlEmployee, function (err, employeeData) {
    inquirer
      .prompt(addEmployeeQuestions(roleData, employeeData))
      .then((data) => {
        result = [data.role, data.name];
        console.log(result);
        changeEmployeeRole(result);

        console.log(`Updated employee's role.`);

        init();
      });
  });
}

async function changeRole() {
  let roleEntity = new role();
  sqlRole = roleEntity.viewRoles();

  await roleEntity.getData(sqlRole, function (err, roleData) {
    addEmployeePrompt(roleData);
  });
}

// Initialize the program with the questions array
//  use the Inquirer Promise to send the file name and entered data to the writeToFile method
async function init() {
  const selection = await inquirer.prompt(makeList());
  let departmentEntity;
  let roleEntity;
  let employeeEntity;
  let sql = "";

  if (selection.transaction == 0) {
    employeeEntity = new employee();
    sql = employeeEntity.viewEmployees();
    await employeeEntity.getData(sql, function (err, data) {
      console.table(data);
      init();
    });
  } else if (selection.transaction == 1) {
    await getEmployeeRole().then(() => {});
  } else if (selection.transaction == 2) {
    await changeRole().then(() => {});
  } else if (selection.transaction == 3) {
    roleEntity = new role();
    sql = roleEntity.viewRoles();
    await roleEntity.getData(sql, function (err, data) {
      console.table(data);
      init();
    });
  } else if (selection.transaction == 4) {
    await addRolePrompt().then(() => {});
  } else if (selection.transaction == 5) {
    departmentEntity = new department();
    sql = departmentEntity.viewDepartments();
    await departmentEntity.getData(sql, function (err, data) {
      console.table(data);
      init();
    });
    departmentEntity.closeConnection();
  } else if (selection.transaction == 6) {
    await addDepartmentPrompt().then(() => {});

    init();
  }
}
// Function call to initialize app
init();
