const inquirer = require("inquirer");

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
// Without using async/await:
inquirer.prompt({
    type: 'input',
    name: 'account',
    message: 'What is the account?'
}).then(answers => {
    return getList().then(list => {
        return inquirer.prompt(genList(list)).then( answers1 => {
            return answers1.orders
        })
    })
}).then(id => {
    return inquirer.prompt(confirmUpdate(id))
}).then(answers => {
    // it's not easy to access the order id selected
    if(answers.toUpdate) {
        return 'to update'
    } else {
        return 'NOT to update'
    }
}).then(console.log)

const genList = (list) => {
  const choices = list.map((item, index) => {
    return {
      key: index,
      name: `${item.id}: ${item.quantity}@${item.price}`,
      value: item.id,
    };
  });
  return {
    type: "rawlist",
    message: "Which order to pick",
    name: "orders",
    choices: choices,
  };
};

const getList = () => {
  return Promise.resolve([
    {
      id: "A001",
      quantity: 20,
      price: 103,
    },
    {
      id: "A002",
      quantity: 75,
      price: 2.03,
    },
    {
      id: "A003",
      quantity: 16,
      price: 900.01,
    },
  ]);
};
const confirmUpdate = (id) => {
  return {
    type: "confirm",
    name: "toUpdate",
    message: `Would you like to update ${id}?`,
  };
};
*/

/*
// async/await awesomeness
async function main() {
  const getAccount = await inquirer.prompt({
    type: "input",
    name: "account",
    message: "What is the account?",
  });
  const orderList = await getList();
  const getOrder = await inquirer.prompt(genList(orderList));
  const getConfirm = await inquirer.prompt(confirmUpdate(getOrder.orders));

  if (getConfirm.toUpdate) {
    console.log(
      "to update",
      getOrder.orders,
      "for account",
      getAccount.account
    );
    main();
  } else {
    console.log("NOT to update", getOrder.orders);
  }
}
main();
*/
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
  if (selection.transaction == 1) {
    console.log("here");
  }
}

// Function call to initialize app
init();
