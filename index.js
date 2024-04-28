const inquirer = require("inquirer");
const mysql = require("mysql2");
const { employee_db, department, role } = require("./lib/Employee_Management");

managementList = [
  { selection: "View All Employess" },
  { selection: "Add Employee" },
  { selection: "Update Employee Role" },
  { selection: "View All Roles" },
  { selection: "Add Role" },
  { selection: "View All Departments" },
  { selection: "Add Department" },
];

/*
main();

/*const mysql = require("mysql2");
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "M0sfet~24",
    database: "employee_db",
  },
  console.log(`Connected to the employee_db database.`)
);

// Query database
db.query("SELECT * FROM role", function (err, results) {
  let arrNoIndex = results.reduce((acc, { id, title, ...x }) => {
    acc[title] = x;
    return acc;
  }, {});

  console.table(arrNoIndex);
  console.table(results);
  console.log(results);
});

// Add the File System Package to create ad README.md file
// Add the Inquirer Package to prompt the user for a Professional ReadMe at the console
// Add my library to create the markdown for the ReadMe

const fs = require("fs");
const inquirer = require("inquirer");
const generateMarkdown = require("./utils/generateMarkdown");
*/

// All of the inquirer prompts use the message attribute to ask the question and use the name attribute to store the result in a variable
// Majority of the prompts are of the type input, where the user types in the information
// The input for GitHub and email will be appended to the Questions Section
// The type list will allow the user to select from a list the license they would like to use for their application
// Inquirer will prompt the array of questions through a promise
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
const questions = [
  {
    type: "list",
    name: "management",
    message: "What would you like to do? ",
    choices: managementList,
  },
];

// Initialize the program with the questions array
//  use the Inquirer Promise to send the file name and entered data to the writeToFile method
async function init() {
  const selection = await inquirer.prompt(makeList());
  let departmentEntity;
  let roleEntity;
  let sql = "";
  let result;
  let params = {};

  if (selection.transaction == 0) {
    console.log("here");
    init();
  } else if (selection.transaction == 1) {
    console.log("here");
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
    console.log("here");
  } else if (selection.transaction == 5) {
    departmentEntity = new department();
    sql = departmentEntity.viewDepartments();
    await departmentEntity.getData(sql, function (err, data) {
      console.table(data);
      init();
    });
    departmentEntity.closeConnection();
  } else if (selection.transaction == 6) {
    console.log("here");
  }
}
// Function call to initialize app
init();
