// Add the File System Package to create ad README.md file
// Add the Inquirer Package to prompt the user for a Professional ReadMe at the console
// Add my library to create the markdown for the ReadMe
/*
const fs = require("fs");
const inquirer = require("inquirer");
const generateMarkdown = require("./utils/generateMarkdown");

// All of the inquirer prompts use the message attribute to ask the question and use the name attribute to store the result in a variable
// Majority of the prompts are of the type input, where the user types in the information
// The input for GitHub and email will be appended to the Questions Section
// The type list will allow the user to select from a list the license they would like to use for their application
// Inquirer will prompt the array of questions through a promise
const questions = [
  {
    type: "input",
    name: "title",
    message: "What is the title of your project? ",
  },
  {
    type: "input",
    name: "description",
    message: "Please enter a description for your project: ",
  },
  {
    type: "input",
    name: "installation",
    message: "Please enter any installation instructions: ",
  },
  {
    type: "input",
    name: "usage",
    message: "Please provide usage information for the project: ",
  },
  {
    type: "list",
    name: "license",
    message: "Which license would you like to cover your application under? ",
    choices: ["BSD 3 - Clause License", "GNU GPL v3", "MIT", "None"],
  },
  {
    type: "input",
    name: "contributions",
    message: "Would you like to acknowledge contributors to the application?",
  },
  {
    type: "input",
    name: "tests",
    message: "Would you like to explain the testing for the application?",
  },
  {
    type: "input",
    name: "github",
    message:
      "Would you like to add your Github username from your Github profile?",
  },
  {
    type: "input",
    name: "email",
    message:
      "Would you like to add your email address for users to ask additional questions about the application?",
  },
];

// TODO: Create a function to write README file
function writeToFile(fileName, data) {
  //call to the generate Markdown library
  const markdownContent = generateMarkdown(data);
  //create the file with a callback function if an error occurs
  fs.writeFile(fileName, markdownContent, function (err) {
    if (err) throw err;
    // show we are done with the program
    console.log(`Please review ${fileName}!`);
  });
}

// Initialize the program with the questions array
//  use the Inquirer Promise to send the file name and entered data to the writeToFile method
function init(questions) {
  inquirer.prompt(questions).then((data) => {
    writeToFile("READMEExample.md", data);
  });
}

// Function call to initialize app
init(questions);
*/
