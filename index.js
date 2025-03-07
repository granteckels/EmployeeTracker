import inquirer from "inquirer";
import pg from 'pg';
const { Client } = pg

const client = new Client({
    user: 'employee_tracker',
    password: 'employee_tracker',
    database: 'employee_tracker',
})
await client.connect();

async function ViewAllEmployees() {
    const query = "SELECT * FROM department"

    const result = await client.query(query);
    console.log('\nid department');
    console.log('-- ----------');
    result.rows.forEach(row => {
        console.log(`${row.id} ${row.name}`);
    });
    console.log('');
}

async function ViewAllRoles() {
    const query = "SELECT * FROM role"

    const result = await client.query(query);
    console.log('\nid title salary department');
    console.log('-- ----- ------ ----------');
    result.rows.forEach(row => {
        console.log(`${row.id} ${row.title} ${row.salary} ${row.department}`);
    });
    console.log('');
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
                        ViewAllEmployees().then(() => this.startCli());
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
                        console.log('VAD');
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