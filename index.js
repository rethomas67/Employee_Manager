const inquirer = require("inquirer");
const mysql = require("mysql2");
const {
  employee_db,
  department,
  role,
  employee,
} = require("./lib/Employee_Management");

managementList = [
  { selection: "View All Employess" },
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
      message: "What dept",
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

const addEmployeeQuestions = (data) => {
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
      message: "What dept",
      name: "department",
      choices: choice,
    },
  ];
};

async function addEmployee(result) {
  let roleEntity = new role();
  let sql = roleEntity.addRole();

  await roleEntity.setData(sql, result).then(() => {});
}

async function addEmployeePrompt() {
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
    sql = employeeEntity.viewRoles();
    await employeeEntity.getData(sql, function (err, data) {
      console.table(data);
      init();
    });
  } else if (selection.transaction == 1) {
    await addEmployeePrompt().then(() => {});
  } else if (selection.transaction == 2) {
    console.log("here");
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
    await addDepartmentPrompt().then(() => {
      console.log("here2");
      //console.log(data);
    });

    init();
  }
}
// Function call to initialize app
init();
