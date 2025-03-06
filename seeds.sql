\c employee_tracker;

INSERT INTO department (name)
VALUES 
	('Operations'),
	('Finance'),
	('HR');

INSERT INTO role (title, salary, department)
VALUES 
	('Line Assembler', 50000, 1),
	('Safety Inspector', 60000, 1),
	('Quality Control Specialist', 70000, 1),
	('Accountant', 40000, 2),
	('Business Analyst', 50000, 2),
	('Recruiter', 70000, 3),
	('Benefits Management', 40000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
	('Shyanne', 'Leach', 3, NULL),
	('Valentina', 'Bailey', 2, 1),
	('Anderson', 'Morales', 1, 1),
	('Andre', 'Peterson', 1, 1),
	('Craig', 'Haney', 5, 1),
	('Roy', 'Norris', 4, 5),
	('Damaris', 'Walker', 4, 5),
	('Shaun', 'Dudley', 6, 1),
	('Erica', 'Morton', 7, 8);
