
const mysql = require('mysql2');
const readline = require('readline');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'student_db'
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

connection.connect((err) => {
    if (err) {
        console.log('Connection failed:', err.message);
        rl.close();
        return;
    }

    console.log('Connected to MySQL successfully!');
    showMenu();
});

function showMenu() {
    console.log('\n--- Student Database Management ---');
    console.log('1. Insert Student');
    console.log('2. View Students');
    console.log('3. Update Student Course');
    console.log('4. Delete Student');
    console.log('5. Exit');

    rl.question('Enter your choice: ', (choice) => {
        if (choice === '1') {
            rl.question('Enter name: ', (name) => {
                rl.question('Enter roll number: ', (rollNo) => {
                    rl.question('Enter course: ', (course) => {
                        rl.question('Enter email: ', (email) => {
                            const sql = `INSERT INTO students
                                (name, roll_no, course, email)
                                VALUES (?, ?, ?, ?)`;

                            connection.query(
                                sql, [name, rollNo, course, email],
                                (err) => {
                                    if (err) console.log(err.message);
                                    else console.log('Student inserted!');
                                    showMenu();
                                }
                            );
                        });
                    });
                });
            });
        } else if (choice === '2') {
            connection.query('SELECT * FROM students', (err, rows) => {
                if (err) console.log(err.message);
                else console.table(rows);
                showMenu();
            });
        } else if (choice === '3') {
            rl.question('Enter student roll number: ', (rollNo) => {
                rl.question('Enter new course: ', (course) => {
                    connection.query(
                        'UPDATE students SET course = ? WHERE roll_no = ?',
                        [course, rollNo],
                        (err, result) => {
                            if (err) console.log(err.message);
                            else console.log('Rows updated:', result.affectedRows);
                            showMenu();
                        }
                    );
                });
            });
        } else if (choice === '4') {
            rl.question('Enter student roll number to delete: ', (rollNo) => {
                connection.query(
                    'DELETE FROM students WHERE roll_no = ?',
                    [rollNo],
                    (err, result) => {
                        if (err) console.log(err.message);
                        else console.log('Rows deleted:', result.affectedRows);
                        showMenu();
                    }
                );
            });
        } else if (choice === '5') {
            connection.end();
            rl.close();
            console.log('Database connection closed.');
        } else {
            console.log('Invalid choice. Try again.');
            showMenu();
        }
    });
}
