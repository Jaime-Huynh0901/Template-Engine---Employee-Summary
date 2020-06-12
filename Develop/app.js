const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");

const employeeQuestions = [
    {
        type: "input",
        name: "name",
        message: "Enter employee name:",
        validate: async (input) => {
            if (input == "") {
                return "Please enter a name.";
            }
            return true;
        }
    },
    {
        type: 'input',
        name: 'id',
        message: 'Enter your id: '
    },
    {
        type: 'input',
        name: 'email',
        message: 'Enter their email: ',
        validate: async (input) => {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)) {
                return true;
            }
            return 'Please enter a valid email address. ';
        }
    },
    {
        type: 'list',
        name: 'role',
        message: 'What is their role?',
        choices: ['Manager', 'Engineer', 'Intern']
    },
    {
        when: input => {
            return input.role == "Manager"
        },
        type: 'input',
        name: 'officeNumber',
        message: 'enter your office number:',
    },
    {
        when: input => {
            return input.role == 'Engineer'
        },
        type: 'input',
        name: 'github',
        message: 'Engineer, enter your github username:',
        validate: async (input) => {
            if (input == '' || /\s/.test(input)) {
                return 'Please enter a valid GitHub username';
            }
            return true;
        }
    },
    {
        when: input => {
            return input.role == "Intern"
        },
        type: 'input',
        name: 'school',
        message: 'Intern, enter your school name:',
        validate: async (input) => {
            if (input == '') {
                return "Please enter a name.";
            }
            return true;
        }
    },
    {
        type: 'confirm',
        name: 'addAnother',
        message: 'Add another team member?',
        default: true
      }
];

const answersArray = [];
generateHTML();

function generateHTML() {
    inquirer.prompt(employeeQuestions)
        .then(answer => {
            answersArray.push(answer);
            if (answer.addAnother) {
                generateHTML();
            } 
            else {
                const generatedList = generateTeam(answersArray);
                const generatedFile = render(generatedList);
                // console.log(generatedFile);

                if (!fs.existsSync(OUTPUT_DIR)){
                    fs.mkdirSync(OUTPUT_DIR);
                };
                fs.writeFile(outputPath, generatedFile, 'utf8', (error) => {
                    if (error)  {
                        throw error; 
                    }
                });
            }
        });
}

function generateTeam(arraylist) {
    const teamList = [];
    arraylist.forEach(data => {
        const { role, name ,id, email, officeNumber, github, school} = data;

        switch (role) {
            case 'Manager':
                const manager = new Manager(name, id, email, officeNumber);
                teamList.push(manager);
                break;
            
            case 'Engineer':
                const engineer = new Engineer(name, id, email, github);
                teamList.push(engineer);
                break;

            case 'Intern':
                const intern = new Intern(name, id, email, school);
                teamList.push(intern);
                break;
        };
    });

    // console.log(teamList);
    return teamList;
}
