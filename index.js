//import inquirer and mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");
//import the the models of a datbase and it's tables queries
const {
  employee_db,
  department,
  role,
  employee,
} = require("./lib/Employee_Management");
//Inquirer main menu list
managementList = [
  { selection: "View All Employees" },
  { selection: "Add Employee" },
  { selection: "Update Employee Role" },
  { selection: "View All Roles" },
  { selection: "Add Role" },
  { selection: "View All Departments" },
  { selection: "Add Department" },
  { selection: "Update Employee Managers" },
  { selection: "View Employees by Manager" },
  { selection: "View Employees by Department" },
  { selection: "Delete Departments" },
  { selection: "Delete Roles" },
  { selection: "Delete Employees" },
  { selection: "View the Total Utilized Budget of a Department" },
];

//map the data and index of the menu array and return the menu list to the console
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
//Inquirer question for adding a new department
const addDepartmentQuestions = [
  {
    type: "input",
    name: "departmentName",
    message: "What is the name of the department? ",
  },
];
//execute the query to add a department with the parameter result
async function addDepartment(result) {
  let departmentEntity = new department();
  let sql = departmentEntity.addDepartment();

  await departmentEntity.setData(sql, result).then(() => {
    console.log(`Added ${result} to the database.`);
  });
}
//save the user input from the department prompt and use it as a parameter
async function addDepartmentPrompt() {
  let result = [];
  await inquirer.prompt(addDepartmentQuestions).then((data) => {
    result = [data.departmentName];
    addDepartment(result);
    return data;
  });
  return true;
}
//map adding role array contents and index
const addRoleQuestions = (data) => {
  const choice = data.map((item, index) => {
    return {
      name: item.name,
      value: item.id,
    };
  });
  //inquirer menu for adding a role
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
//execute inserting a new role with a parameter
async function addRole(result) {
  let roleEntity = new role();
  let sql = roleEntity.addRole();

  await roleEntity.setData(sql, result).then(() => {});
}
//retrieve the department list to display in the menu then call the methods for the menu and exection of the query
async function addRolePrompt() {
  departmentEntity = new department();
  sql = departmentEntity.viewDepartments();
  await departmentEntity.getData(sql, function (err, departmentData) {
    inquirer.prompt(addRoleQuestions(departmentData)).then((data) => {
      result = [data.roleName, data.department, data.salary];
      addRole(result);
      console.log(`Added ${data.roleName} to the database.`);
      init();
    });
  });
}
//map the list and index for role
const addManagerQuestions = (roleData, managerData) => {
  const roleChoice = roleData.map((item, index) => {
    return {
      name: item.title,
      value: item.id,
    };
  });
  //map the list and index for managers
  const managerChoice = managerData.map((item, index) => {
    return {
      name: item.manager,
      value: item.id,
    };
  });
  //Inquirer questions to add a new employee
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
//excute the query with a parameter to add a new employee
async function addEmployee(result) {
  let employeeEntity = new employee();
  let sql = employeeEntity.addEmployee();

  await employeeEntity.setData(sql, result).then(() => {});
}
//retrieve the list of managers and run the methods for the menu and execution of the query
async function addManagerPrompt(roleData) {
  let employeeEntity = new employee();
  sqlManager = employeeEntity.viewManagers();

  await employeeEntity.getData(sqlManager, function (err, managerData) {
    inquirer.prompt(addManagerQuestions(roleData, managerData)).then((data) => {
      //if None is select the parameter is null, otherwise the manager id
      let managerId = null;
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
//retrieve the list of roles and pass it to addManagerPrompt
async function getEmployeeRole() {
  let roleEntity = new role();
  sqlRole = roleEntity.viewRoles();

  await roleEntity.getData(sqlRole, function (err, roleData) {
    addManagerPrompt(roleData);
  });
}
//map the data and index for roles and employees
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
  //menu questions for updating an employees role
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
//execute the query with parameters to update an employees role
async function changeEmployeeRole(result) {
  let employeeEntity = new employee();
  let sql = employeeEntity.updateEmployee();

  await employeeEntity.setData(sql, result).then(() => {});
}
//retrieve the employee name list
async function addEmployeePrompt(roleData) {
  let employeeEntity = new employee();
  sqlEmployee = employeeEntity.viewEmployeeNames();

  await employeeEntity.getData(sqlEmployee, function (err, employeeData) {
    inquirer
      .prompt(addEmployeeQuestions(roleData, employeeData))
      .then((data) => {
        result = [data.role, data.name];

        changeEmployeeRole(result);

        console.log(`Updated employee's role.`);

        init();
      });
  });
}
//retrieve the list of role and pass it to addEmployeePrompt
async function changeRole() {
  let roleEntity = new role();
  sqlRole = roleEntity.viewRoles();

  await roleEntity.getData(sqlRole, function (err, roleData) {
    addEmployeePrompt(roleData);
  });
}
//map the data and indexes for managers and employees
const changeEmployeeQuestions = (managerData, employeeData) => {
  const managerChoice = managerData.map((item, index) => {
    return {
      name: item.manager,
      value: item.id,
    };
  });

  const employeeChoice = employeeData.map((item, index) => {
    return {
      name: item.name,
      value: item.id,
    };
  });
  //display the menu to update an employees manager
  return [
    {
      type: "list",
      message: "Which employee's manager do you want to update?",
      name: "name",
      choices: employeeChoice,
    },
    {
      type: "list",
      message:
        "Which employee's manager do you want to assign to the selected user?",
      name: "manager",
      choices: managerChoice,
    },
  ];
};
//run the update query with parameters to change an employees manager
async function changeEmployeeManager(result) {
  let employeeEntity = new employee();
  let sql = employeeEntity.updateEmployeeManager();

  await employeeEntity.setData(sql, result).then(() => {});
}
//retrieve the list of managers and send it to include it in the menu
async function changeManagerPrompt(employeeData) {
  let employeeEntity = new employee();
  sqlManager = employeeEntity.viewActiveManagers();

  await employeeEntity.getData(sqlManager, function (err, managerData) {
    inquirer
      .prompt(changeEmployeeQuestions(managerData, employeeData))
      //call the method with the parameters selected by the user to run the query
      .then((data) => {
        result = [data.manager, data.name];
        changeEmployeeManager(result);

        console.log(`Updated employee's manager.`);

        init();
      });
  });
}
//retrieve a list of employees with managers
async function changeManager() {
  let employeeEntity = new employee();
  sqlEmployee = employeeEntity.viewManagedEmployeeNames();

  await employeeEntity.getData(sqlEmployee, function (err, employeeData) {
    changeManagerPrompt(employeeData);
  });
}
//map the data and index of managers
const viewEmployeeByManagerQuestions = (managerData) => {
  const managerChoice = managerData.map((item, index) => {
    return {
      name: item.manager,
      value: item.id,
    };
  });
  //generate inquirer menu
  return [
    {
      type: "list",
      message: "Which manager's employees do you want to view?",
      name: "manager",
      choices: managerChoice,
    },
  ];
};
//view the employees who work under the selected manager
async function viewEmployeeByManager(result) {
  let employeeEntity = new employee();
  let sql = employeeEntity.viewEmployeeNamesByManager();

  await employeeEntity.getData(
    sql,
    result,
    function (err, employeeBymanagerData) {
      console.table(employeeBymanagerData);
      init();
    }
  );
}
//retrieve employees who are managers and send it to the menu prompt
async function employeeByManager() {
  let employeeEntity = new employee();
  sqlManager = employeeEntity.viewActiveManagers();

  await employeeEntity.getData(sqlManager, function (err, managerData) {
    inquirer
      .prompt(viewEmployeeByManagerQuestions(managerData))
      //query the employees under the selected manager
      .then((data) => {
        result = [data.manager];
        viewEmployeeByManager(result);
      });
  });
}
//map the data and index for departments
const viewEmployeeByDepartmentQuestions = (departmentData) => {
  const departmentChoice = departmentData.map((item, index) => {
    return {
      name: item.name,
      value: item.id,
    };
  });
  //create the prompt to select from the list of departments
  return [
    {
      type: "list",
      message: "Which department's employees do you want to view?",
      name: "department",
      choices: departmentChoice,
    },
  ];
};
//run the query to view the employees with an override call to getData with paramaters
async function viewEmployeeByDepartment(result) {
  let employeeEntity = new employee();
  let sql = employeeEntity.viewEmployeesByDepartment();

  await employeeEntity.getData(
    sql,
    result,
    function (err, employeeByDepartmentData) {
      console.table(employeeByDepartmentData);
      init();
    }
  );
}
//pass the departments result to the menu
async function employeeByDepartment() {
  let departmentEntity = new department();
  sqlDepartment = departmentEntity.viewDepartments();

  await departmentEntity.getData(sqlDepartment, function (err, departmentData) {
    inquirer
      .prompt(viewEmployeeByDepartmentQuestions(departmentData))
      //pass the selected department as a parameter for the query
      .then((data) => {
        result = [data.department];
        viewEmployeeByDepartment(result);
      });
  });
}
//map the department data and indexes
const viewDepartmentBudgetQuestions = (departmentData) => {
  const departmentChoice = departmentData.map((item, index) => {
    return {
      name: item.name,
      value: item.id,
    };
  });
  //display the department selection list
  return [
    {
      type: "list",
      message: "Which department's budget do you want to view?",
      name: "department",
      choices: departmentChoice,
    },
  ];
};
//call the aggregate department budget query with the getdata parameter override
async function viewDepartmentBudget(result) {
  let departmentEntity = new department();
  let sql = departmentEntity.viewDepartmentBudget();

  await departmentEntity.getData(
    sql,
    result,
    function (err, departmentBudgetData) {
      console.table(departmentBudgetData);
      init();
    }
  );
}
//retrieve the departments for the user selection list
async function utilizedBudget() {
  let departmentEntity = new department();
  sqlDepartment = departmentEntity.viewDepartments();

  await departmentEntity.getData(sqlDepartment, function (err, departmentData) {
    inquirer
      .prompt(viewDepartmentBudgetQuestions(departmentData))
      //send the selected department parameter to the call to viewDepartmentBudget
      .then((data) => {
        result = [data.department];
        viewDepartmentBudget(result);
      });
  });
}
/*
  delete departments, roles, and employees are similar to the previous functions
  The selected department(id), role(id), and employee(id) are passed in as a parameter
  to delete the selection from the table
*/
const deleteDepartmentQuestions = (departmentData) => {
  const departmentChoice = departmentData.map((item, index) => {
    return {
      name: item.name,
      value: item.id,
    };
  });

  return [
    {
      type: "list",
      message: "Which department do you want to delete?",
      name: "department",
      choices: departmentChoice,
    },
  ];
};

async function deleteDepartment(result) {
  let departmentEntity = new department();
  let sql = departmentEntity.deleteDepartment();
  await departmentEntity.setData(sql, result).then(() => {
    init();
  });
}

async function deleteDepartmentPrompt() {
  let departmentEntity = new department();
  sqlDepartment = departmentEntity.viewDepartments();

  await departmentEntity.getData(sqlDepartment, function (err, departmentData) {
    inquirer.prompt(deleteDepartmentQuestions(departmentData)).then((data) => {
      result = [data.department];
      deleteDepartment(result);
    });
  });
}

const deleteRoleQuestions = (roleData) => {
  const roleChoice = roleData.map((item, index) => {
    return {
      name: item.title,
      value: item.id,
    };
  });

  return [
    {
      type: "list",
      message: "Which department do you want to delete?",
      name: "role",
      choices: roleChoice,
    },
  ];
};

async function deleteRole(result) {
  let roleEntity = new role();
  let sql = roleEntity.deleteRole();
  await roleEntity.setData(sql, result).then(() => {
    init();
  });
}

async function deleteRolePrompt() {
  let roleEntity = new role();
  sqlRole = roleEntity.viewRoles();

  await roleEntity.getData(sqlRole, function (err, roleData) {
    inquirer.prompt(deleteRoleQuestions(roleData)).then((data) => {
      result = [data.role];
      deleteRole(result);
    });
  });
}

const deleteEmployeeQuestions = (employeeData) => {
  const employeeChoice = employeeData.map((item, index) => {
    return {
      name: item.name,
      value: item.id,
    };
  });

  return [
    {
      type: "list",
      message: "Which employee do you want to delete?",
      name: "employee",
      choices: employeeChoice,
    },
  ];
};

async function deleteEmployee(result) {
  let employeeEntity = new employee();
  let sql = employeeEntity.deleteEmployee();
  await employeeEntity.setData(sql, result).then(() => {
    init();
  });
}

async function deleteEmployeePrompt() {
  let employeeEntity = new employee();
  sqlRole = employeeEntity.viewEmployeeNames();

  await employeeEntity.getData(sqlRole, function (err, employeeData) {
    inquirer.prompt(deleteEmployeeQuestions(employeeData)).then((data) => {
      result = [data.employee];
      deleteEmployee(result);
    });
  });
}

// Initialize the program with the main questions array
//  return the selection for further processing
async function init() {
  const selection = await inquirer.prompt(makeList());
  let departmentEntity;
  let roleEntity;
  let employeeEntity;
  let sql = "";

  //View all employees
  if (selection.transaction == 0) {
    employeeEntity = new employee();
    //call the select query for all of the employees
    sql = employeeEntity.viewEmployees();
    await employeeEntity.getData(sql, function (err, data) {
      console.table(data);
      init();
    });
    //Add Employee
  } else if (selection.transaction == 1) {
    await getEmployeeRole().then(() => {});
    //Update Employee Role
  } else if (selection.transaction == 2) {
    await changeRole().then(() => {});
    //View All Roles
  } else if (selection.transaction == 3) {
    roleEntity = new role();
    sql = roleEntity.viewRoles();
    //call the query to view all roles
    await roleEntity.getData(sql, function (err, data) {
      console.table(data);
      init();
    });
    //Add Role
  } else if (selection.transaction == 4) {
    await addRolePrompt().then(() => {});
    //View All Departments
  } else if (selection.transaction == 5) {
    departmentEntity = new department();
    sql = departmentEntity.viewDepartments();
    //call the query to view departments
    await departmentEntity.getData(sql, function (err, data) {
      console.table(data);
      init();
    });
    departmentEntity.closeConnection();
    //Add Department
  } else if (selection.transaction == 6) {
    await addDepartmentPrompt().then(() => {});

    init();
    //Update Employee Managers
  } else if (selection.transaction == 7) {
    await changeManager().then(() => {});
    //View Employees by manager
  } else if (selection.transaction == 8) {
    await employeeByManager().then(() => {});
    //View Employees by Department
  } else if (selection.transaction == 9) {
    await employeeByDepartment().then(() => {});

    //Delete Departments
  } else if (selection.transaction == 10) {
    await deleteDepartmentPrompt().then(() => {});
    //Delete Roles
  } else if (selection.transaction == 11) {
    await deleteRolePrompt().then(() => {});
    //Delete Employees
  } else if (selection.transaction == 12) {
    await deleteEmployeePrompt().then(() => {});
    //Total Utilized Budget
  } else if (selection.transaction == 13) {
    await utilizedBudget().then(() => {});
  }
}
// Function call to initialize app
init();
