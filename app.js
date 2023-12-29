const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const app = express();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Tb15092003!",
    database: "testdb"
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

connection.connect(function(err) {
    (err) ? console.log(err) : console.log(connection);
});

app.get('/api/users', (req, res) => {
    var sql = "SELECT users.*, role_user.role_id, roles.name AS role FROM users, roles, role_user WHERE users.id=role_user.user_id AND role_user.role_id=roles.id";
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json({users: results});
    });
});

app.post('/api/users/insert', function(req, res) {
    var sql = "INSERT "
            + "INTO users(name, password, email, ten, sdt, cmnd, ngaysinh, thangsinh, namsinh, khoi_id, cap1, cap2) "
            + "VALUES('"
            + req.body.name + "','" 
            + req.body.password + "','" 
            + req.body.email + "','"
            + "' '" + "','"
            + "' '" + "','"
            + "' '" + "','"
            + "0" + "','"
            + 0 + "','"
            + 0 + "','"
            + 0 + "','"
            + 0 + "','"
            + 0 + "')";
    connection.query(sql, function (err, results) {
        if(err) throw err;
        sql = "SELECT * FROM roles";
        connection.query(sql, function (err, results) {
            if (err) {
                throw err;
            }
            results.some((value, index) => {
                if (req.body.role == value.name) {
                    var userID = 0;
                    var roleID = value.id;

                    sql = "SELECT id, name FROM users";
                    connection.query(sql, function (err, results) {
                        if (err) {
                            throw err;
                        }
                        results.some((value, index) => {
                            if (req.body.name == value.name) {
                                userID = value.id;
                                sql = "INSERT "
                                    + "INTO role_user(user_id, role_id) "
                                    + "VALUES('"
                                    + userID + "','" 
                                    + roleID + "')";
                                connection.query(sql, function (err, results) {
                                    if(err) throw err;
                                    res.json({users: results});
                                });
                            }
                        });
                    });
                }
            });
        });
    });
});

app.post('/api/users/edit', (req, res) => {
    var sql = "UPDATE users SET "
            + "name='" + req.body.name + "',"
            + "password='" + req.body.password + "',"
            + "email='" + req.body.email + "'"
            + "WHERE id='" + req.body.id + "'";
    connection.query(sql, function(err, results) {
        if (err) throw err;
        sql = "SELECT * FROM roles";
        connection.query(sql, function (err, results) {
            if (err) {
                throw err;
            }
            results.some((value, index) => {
                if (req.body.role == value.name) {
                    console.log(value.name + value.id);
                    sql = "UPDATE role_user SET "
                        + "role_id='" + value.id + "'"
                        + "WHERE user_id='" + req.body.id + "'";
                    connection.query(sql, function (err, results) {
                        if (err) {
                            throw err;
                        }
                        res.json({users: results});
                    });
                }
            });
        });
    });
});

app.post('/api/users/delete', (req, res) => {
    var sql = "DELETE FROM users "
            + "WHERE id='" + req.body.id + "'";
    connection.query(sql, function(err, results) {
        if (err) throw err;
        sql = "DELETE FROM role_user "
            + "WHERE user_id='" + req.body.id + "'";
        connection.query(sql, function(err, results) {
            if (err) {
                throw err;
            }
            res.json({users: results});
        })
    });
});

app.get('/api/questions', (req, res) => {
    var sql = "SELECT questions.*, subjects.id, subjects.name AS subject FROM questions, subjects WHERE questions.subject_id=subjects.id";
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json({questions: results});
    });
});

app.post('/api/questions/insert', function(req, res) {
    var sql = "INSERT "
            + "INTO questions(question, option1, option2, option3, option4, answer, subject_id) "
            + "VALUES('"
            + req.body.question + "','" 
            + req.body.option1 + "','" 
            + req.body.option2 + "','"
            + req.body.option3 + "','"
            + req.body.option4 + "','"
            + req.body.answers + "','"
            + req.body.subject_id + "')";
    connection.query(sql, function (err, results) {
        if(err) throw err;
        res.json({questions: results});
    });
});

app.post('/api/questions/edit', (req, res) => {
    var sql = "UPDATE questions SET "
            + "question='" + req.body.question + "',"
            + "option1='" + req.body.option1 + "',"
            + "option2='" + req.body.option2 + "',"
            + "option3='" + req.body.option3 + "',"
            + "option4='" + req.body.option4 + "',"
            + "answers='" + req.body.answers + "',"
            + "subject_id='" + req.body.subject_id + "'"
            + "WHERE id='" + req.body.id + "'";
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json({questions: results});
    });
});

app.post('/api/questions/delete', (req, res) => {
    var sql = "DELETE FROM questions "
            + "WHERE id='" + req.body.id + "'";
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json({questions: results});
    });
});

app.get('/api/answers', (req, res) => {
    var sql = "SELECT * FROM answers";
    connection.query(sql, function(err, results) {
        if (err) throw err;
        res.json({answers: results});
    });
});

app.listen(4000, () => console.log('App listening on port 4000'));