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
  { selection: "Update Employee Managers" },
  { selection: "View Employees by Manager" },
  { selection: "View Employees by Department" },
  { selection: "Delete Departments" },
  { selection: "Delete Roles" },
  { selection: "Delete Employees" },
  { selection: "View the Total Utilized Budget of a Department" },
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

async function changeRole() {
  let roleEntity = new role();
  sqlRole = roleEntity.viewRoles();

  await roleEntity.getData(sqlRole, function (err, roleData) {
    addEmployeePrompt(roleData);
  });
}

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

async function changeEmployeeManager(result) {
  let employeeEntity = new employee();
  let sql = employeeEntity.updateEmployeeManager();

  await employeeEntity.setData(sql, result).then(() => {});
}

async function changeManagerPrompt(employeeData) {
  let employeeEntity = new employee();
  sqlManager = employeeEntity.viewActiveManagers();

  await employeeEntity.getData(sqlManager, function (err, managerData) {
    inquirer
      .prompt(changeEmployeeQuestions(managerData, employeeData))
      .then((data) => {
        result = [data.manager, data.name];
        changeEmployeeManager(result);

        console.log(`Updated employee's manager.`);

        init();
      });
  });
}

async function changeManager() {
  let employeeEntity = new employee();
  sqlEmployee = employeeEntity.viewManagedEmployeeNames();

  await employeeEntity.getData(sqlEmployee, function (err, employeeData) {
    changeManagerPrompt(employeeData);
  });
}

const viewEmployeeByManagerQuestions = (managerData) => {
  const managerChoice = managerData.map((item, index) => {
    return {
      name: item.manager,
      value: item.id,
    };
  });

  return [
    {
      type: "list",
      message: "Which manager's employees do you want to view?",
      name: "manager",
      choices: managerChoice,
    },
  ];
};

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

async function employeeByManager() {
  let employeeEntity = new employee();
  sqlManager = employeeEntity.viewActiveManagers();

  await employeeEntity.getData(sqlManager, function (err, managerData) {
    inquirer
      .prompt(viewEmployeeByManagerQuestions(managerData))
      .then((data) => {
        result = [data.manager];
        viewEmployeeByManager(result);
      });
  });
}

const viewEmployeeByDepartmentQuestions = (departmentData) => {
  const departmentChoice = departmentData.map((item, index) => {
    return {
      name: item.name,
      value: item.id,
    };
  });

  return [
    {
      type: "list",
      message: "Which department's employees do you want to view?",
      name: "department",
      choices: departmentChoice,
    },
  ];
};

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

async function employeeByDepartment() {
  let employeeEntity = new employee();
  sqlDepartment = employeeEntity.viewDepartments();

  await employeeEntity.getData(sqlDepartment, function (err, departmentData) {
    inquirer
      .prompt(viewEmployeeByDepartmentQuestions(departmentData))
      .then((data) => {
        result = [data.department];
        viewEmployeeByDepartment(result);
      });
  });
}

const viewDepartmentBudgetQuestions = (departmentData) => {
  const departmentChoice = departmentData.map((item, index) => {
    return {
      name: item.name,
      value: item.id,
    };
  });

  return [
    {
      type: "list",
      message: "Which department's budget do you want to view?",
      name: "department",
      choices: departmentChoice,
    },
  ];
};

async function viewDepartmentBudget(result) {
  let employeeEntity = new employee();
  let sql = employeeEntity.viewDepartmentBudget();

  await employeeEntity.getData(
    sql,
    result,
    function (err, departmentBudgetData) {
      console.table(departmentBudgetData);
      init();
    }
  );
}

async function utilizedBudget() {
  let employeeEntity = new employee();
  sqlDepartment = employeeEntity.viewDepartments();

  await employeeEntity.getData(sqlDepartment, function (err, departmentData) {
    inquirer
      .prompt(viewDepartmentBudgetQuestions(departmentData))
      .then((data) => {
        result = [data.department];
        viewDepartmentBudget(result);
      });
  });
}

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
  let employeeEntity = new employee();
  sqlDepartment = employeeEntity.viewDepartments();

  await employeeEntity.getData(sqlDepartment, function (err, departmentData) {
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

// Initialize the program with the questions array
//  use the Inquirer Promise to senda the file name and entered data to the writeToFile method
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
  } else if (selection.transaction == 7) {
    await changeManager().then(() => {});
  } else if (selection.transaction == 8) {
    await employeeByManager().then(() => {});
  } else if (selection.transaction == 9) {
    await employeeByDepartment().then(() => {});

    init();
  } else if (selection.transaction == 10) {
    await deleteDepartmentPrompt().then(() => {});
  } else if (selection.transaction == 11) {
    await deleteRolePrompt().then(() => {});
  } else if (selection.transaction == 12) {
    await deleteEmployeePrompt().then(() => {});

    init();
  } else if (selection.transaction == 13) {
    await utilizedBudget().then(() => {});
  }
}
// Function call to initialize app
init();
