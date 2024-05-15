const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;

    // check there is no user with the same email
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error);
        }

        // we already have such email in db
        if(results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        // hash password, how many times
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        // save user to db with hashed password
        db.query('INSERT INTO users SET ?', {
            name: name,
            email: email,
            password: hashedPassword
        }, (error, results) => {
            if(error){
                console.log(error);
            }else {
                return res.render('register', {
                    messageGood: 'User registered'
                });
            }
        })

    });
}

exports.login = (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;

    if (email && password) {

        let query = `
            SELECT * FROM users 
            WHERE email = "${email}"
        `;

        db.query(query, async (error, results) => {
            if(error) {
                console.log(error);
            }

            if(results.length > 0) {
                for(let count = 0; count < results.length; count++) {
                    // compare passwords
                    let passCompare = await bcrypt.compare(password, results[count].password)
                    if(passCompare) {
                        req.session.user_id = results[count].id;
                        req.flash('user', results[count].name);
                        res.redirect('/');
                    }else {
                        res.render('login', {
                            message: 'Invalid password'
                        });
                    }
                }
            } else {
                res.render('login', {
                    message: 'Invalid email'
                });
            }
        });
    } else {
        res.render('login', {
            message: 'Please enter email and password'
        });
    }
}