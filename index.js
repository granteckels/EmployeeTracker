import inquirer from "inquirer";
import pg from 'pg';
import cliTable from 'cli-table3';

const { Client } = pg

const client = new Client({
    user: 'employee_tracker',
    password: 'employee_tracker',
    database: 'employee_tracker',
})
await client.connect();

async function ViewAllEmployees() {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title as title, department.name as department, role.salary as salary, manager.first_name || ' ' || manager.last_name as manager FROM employee\n"
        + "JOIN role ON role_id = role.id\n"
        + "JOIN department ON role.department = department.id\n"
        + "LEFT JOIN employee manager ON employee.manager_id = manager.id";

    const result = await client.query(query);

    return result.rows;
}

async function AddEmployee() {
    const employees = await ViewAllEmployees();
    const employeeNames = employees.map(row => row.first_name + ' ' + row.last_name);
    employeeNames.unshift('None');

    const roles = await ViewAllRoles();
    const roleTitles = roles.map(row => row.title);

    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'What is the employee\'s first name?'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the employee\'s last name?'
            },
            {
                type: 'list',
                name: 'roleTitle',
                message: 'What is the employee\'s role?',
                choices: roleTitles
            },
            {
                type: 'list',
                name: 'managerName',
                message: 'Who is th employee\'s manager?',
                choices: employeeNames
            },
        ])
        .then((answer) => {
            let managerId;
            if(answer.managerName !== 'None') {
                const [manager_first_name, manager_last_name] = answer.managerName.split(' ');
                managerId = employees.find(row => row.first_name === manager_first_name && row.last_name === manager_last_name).id;
            } else {
                managerId = 'NULL';
            }
            const roleId = roles.find(row => row.title === answer.roleTitle).id;
            const query = "INSERT INTO employee (first_name, last_name, role_id, manager_id)\n"
                + `VALUES ('${answer.firstName}', '${answer.lastName}', ${roleId}, ${managerId})`;

            console.log(query);
            client.query(query);
        })
}

async function UpdateEmployeeRole() {
    const employees = await ViewAllEmployees();
    const employeeNames = employees.map(row => row.first_name + ' ' + row.last_name);

    const roles = await ViewAllRoles();
    const roleTitles = roles.map(row => row.title);

    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'employeeName',
                message: 'Which employee\'s role do you want to update?',
                choices: employeeNames
            },
            {
                type: 'list',
                name: 'roleTitle',
                message: 'Which role do you want to assign the selected employee?',
                choices: roleTitles
            }
        ])
        .then((answer) => {
            const [first_name, last_name] = answer.employeeName.split(' ');
            const employeeId = employees.find(row => row.first_name === first_name && row.last_name === last_name).id;
            const roleId = roles.find(row => row.title === answer.roleTitle).id;
            const query = `UPDATE employee SET role_id=${roleId} WHERE id=${employeeId}`;

            client.query(query);
        })
}

async function ViewAllRoles() {
    const query = "SELECT role.id, title, salary, department.name as department FROM role\n"
        + "JOIN department ON department = department.id";

    const result = await client.query(query);

    return result.rows;
}

async function AddRole() {
    const departments = await ViewAllDepartments();
    const departmentNames = departments.map(row => row.name);

    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to?',
                choices: departmentNames
            }
        ])
        .then((answer) => {
            const departmentId = departments.find(row => row.name === answer.department).id;
            const query = "INSERT INTO role (title, salary, department)\n"
                + `VALUES ('${answer.title}', ${answer.salary}, ${departmentId})`;

            client.query(query);
        })
}

async function ViewAllDepartments() {
    const query = "SELECT * FROM department"

    const result = await client.query(query);

    return result.rows;
}

async function AddDepartment() {
    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
            }
        ])
        .then((answer) => {
            const query = "INSERT INTO department (name)\n"
                + `VALUES ('${answer.department}')`;
            
            client.query(query);
        })
}

class Cli {
    constructor() {
        this.exit = false;
    }

    startCli() {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        'View All Employees',
                        'Add Employee',
                        'Update Employee Role',
                        'View All Roles',
                        'Add Role',
                        'View All Departments',
                        'Add Department',
                        'Exit'
                    ],
                }
            ])
            .then((answer) => {
                switch (answer.action) {
                    case 'View All Employees':
                        ViewAllEmployees().then((result) => {
                            const table = new cliTable({
                                head: ['id', 'first_name', 'last_name', 'title', 'department', 'salary', 'manager'],
                                colWidths: [5, 20, 20, 40, 15, 10, 40],
                            });
                            result.forEach(row => {
                                table.push([row.id, row.first_name, row.last_name, row.title, row.department, row.salary, row.manager]);
                            });
                        
                            console.log(table.toString());
                            
                            this.startCli();
                        });
                        break;
                    case 'Add Employee':
                        AddEmployee().then(() => this.startCli());
                        break;
                    case 'Update Employee Role':
                        UpdateEmployeeRole().then(() => this.startCli());
                        break;
                    case 'View All Roles':
                        ViewAllRoles().then((result) => {
                            const table = new cliTable({
                                head: ['id', 'title', 'salary', 'department'],
                                colWidths: [5, 40, 10, 15],
                            });
                            result.forEach(row => {
                                table.push([row.id, row.title, row.salary, row.department]);
                            });
                        
                            console.log(table.toString());
                            
                            this.startCli();
                        });
                        break;
                    case 'Add Role':
                        AddRole().then(() => this.startCli());
                        break;
                    case 'View All Departments':
                        ViewAllDepartments().then((result) => {
                            const table = new cliTable({
                                head: ['id', 'department'],
                                colWidths: [5, 15],
                            });
                            result.forEach(row => {
                                table.push([row.id, row.name]);
                            });
                        
                            console.log(table.toString())

                            this.startCli();
                        });
                        break;
                    case 'Add Department':
                        AddDepartment().then(() => this.startCli());
                        break;
                    case 'Exit':
                        client.end();
                        process.exit();
                        break;
                }
            })
    }
}

new Cli().startCli();