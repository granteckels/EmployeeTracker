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

async function ViewAllRoles() {
    const query = "SELECT role.id, title, salary, department.name as department FROM role\n"
        + "JOIN department ON department = department.id";

    const result = await client.query(query);

    const table = new cliTable({
        head: ['id', 'title', 'salary', 'department'],
        colWidths: [5, 25, 10, 15],
    });
    result.rows.forEach(row => {
        table.push([row.id, row.title, row.salary, row.department]);
    });

    console.log(table.toString());
}

async function ViewAllDepartments() {
    const query = "SELECT * FROM department"

    const result = await client.query(query);

    const table = new cliTable({
        head: ['id', 'department'],
        colWidths: [5, 15],
    });
    result.rows.forEach(row => {
        table.push([row.id, row.name]);
    });

    console.log(table.toString());
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
                // console.log(answer)
                switch (answer.action) {
                    case 'View All Employees':
                        console.log('VAE');
                        break;
                    case 'Add Employee':
                        console.log('AE');
                        break;
                    case 'Update Employee Role':
                        console.log('UER');
                        break;
                    case 'View All Roles':
                        ViewAllRoles().then(() => this.startCli());
                        break;
                    case 'Add Role':
                        console.log('AR');
                        break;
                    case 'View All Departments':
                        ViewAllDepartments().then(() => this.startCli());
                        break;
                    case 'Add Department':
                        console.log('AD');
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