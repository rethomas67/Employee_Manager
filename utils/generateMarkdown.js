// create an array of objects containing each license's name, url, and badge link
const licenses = [
  {
    name: "BSD 3 - Clause License",
    url: "https://opensource.org/licenses/BSD-3-Clause",
    badge: "https://img.shields.io/badge/License-BSD%203--Clause-blue.svg",
  },
  {
    name: "GNU GPL v3",
    url: "https://www.gnu.org/licenses/gpl-3.0",
    badge: "https://img.shields.io/badge/License-LGPL%20v3-blue.svg",
  },
  {
    name: "MIT",
    url: "https://opensource.org/licenses/MIT",
    badge: "https://img.shields.io/badge/License-MIT-yellow.svg",
  },
  { name: "None", url: "", badge: "" },
];

// Creates a license badge, if a license was chosen
function renderLicenseBadge(license) {
  // search the array for the user's license selection
  var license = licenses.find((l) => l.name == license);
  //initialize the result to an empty string
  var licenseBadge = "";

  // if a license was selected build the string for the displayed text and the link for the actual license badge
  if (license.name != "None") {
    licenseBadge = "![License](" + license.badge + ")";
  }
  return licenseBadge;
}

// Creates a license link, if a license was chosen
function renderLicenseLink(license) {
  // search the array for the user's license selection
  var licenseUrl = licenses.find((l) => l.name == license);
  //initialize the result to an empty string
  var licenselink = "";

  // if a license was selected build the string for the markdown file to create the link
  if (licenseUrl.name != "None") {
    licenselink = "(" + licenseUrl.url + ")";
  }
  return licenselink;
}

// Creates the license display, in which the user will click to view the actual license URL
function renderLicenseSection(license) {
  // search the array for the user's license selection
  var licenseSelection = licenses.find((l) => l.name == license);
  //initialize the result to an empty string
  var licenseText = "";
  var licenseCoverage = "This application is covered by ";
  // if a license was selected build the string for the markdown file to display the selected license
  if (licenseSelection.name != "None") {
    licenseText = licenseCoverage + "[" + licenseSelection.name + ".]";
  }
  return licenseText;
}

// Generate the markdown
function generateMarkdown(data) {
  //the license, the license link, and the license badge methods
  const licenseSection = renderLicenseSection(data.license);
  const licenseLink = renderLicenseLink(data.license);
  const licenseText = licenseSection + licenseLink;
  const licenseBadge = renderLicenseBadge(data.license);

  // the questions section
  var emailText = "";
  var githubText = "";

  //add the markdown text if an email was entered
  if (data.email.length > 0) {
    emailText = `For additional questions about the application, please reach out to me at: ${data.email}.`;
  }
  //add the markdown text if a GitHub profile was added
  if (data.github.length > 0) {
    githubText = `The Github repository for the application can be forked or reviewed at: [Github](${data.github}).`;
  }

  // returns the markdown string to write to the .md file
  // the dynamic data variables is added to the text
  // The license badge is added toward the top of the file
  // Table of Contents are added with a link to navigate to the section
  // The license section displays the license and when clicked, opens the url
  // If a GitHub profile or email was entered, the entry(ies) are added to the questions section
  return `# ${data.title} 
  \n ${licenseBadge}\n
  \n## Description
    \n### ${data.description} \n
    \n## Table of Contents
    \n### [Installation](#installation)
    \n### [Usage](#usage)
    \n### [Contributions](#contributions)
    \n### [Questions](#questions)
    \n
    \n## Installation
    \n### ${data.installation} \n
    \n## Usage
    \n### ${data.usage} \n
    \n## License
    \n### ${licenseText} \n
    \n## Contributions
    \n### ${data.contributions} \n
    \n## Tests
    \n### ${data.tests} \n
    \n## Questions
    \n### ${githubText} 
    \n### ${emailText}

`;
}

// Export this library to be used in other applications
module.exports = generateMarkdown;
