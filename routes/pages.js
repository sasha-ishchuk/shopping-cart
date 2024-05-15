const express = require('express')
const bcrypt = require("bcryptjs");
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

const router = express.Router();

// main/user page
router.get('/', function(req, res, next) {

    const user = req.flash('user');
    const messPayed = req.flash('messPayed');
    res.render('index', {
        session: req.session,
        user: user,
        messPayed: messPayed
    });
});

// register page
router.get('/register', (req, res) => {
    res.render('register');
});

// login page
router.get('/login', (req, res) => {
    res.render('login');
});

// shop page
router.get('/shop', (req, res) => {
    let query = `SELECT id, name, description, price, stock  FROM products`;

    db.query(query, (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            const messBad = req.flash('messBad');
            const messGood = req.flash('messGood');
            res.render('shop', {
                session: req.session,
                results: results,
                messGood: messGood,
                messBad: messBad
            });
        }
    });
});

// shop page
router.get('/cart', (req, res) => {
    console.log(res);

    const user_id = req.session.user_id;

    db.query(`SELECT prod_id, amount FROM carts WHERE user_id = ?`, [user_id], (error, prod_results) => {
        if (error) {
            console.log(error);
        }

        if(prod_results.length > 0) {

            const products = [];
            const amounts = {};

            prod_results.forEach(function(item){
                products.push(item.prod_id);
                amounts[item.prod_id] = item.amount;
            });

            db.query(`SELECT * FROM products WHERE id IN (?)`, [products], (error, results) => {
                if (error) {
                    console.log(error);
                }

                if (results.length > 0) {
                    const messGood = req.flash('messGood');
                    res.render('cart', {
                        session: req.session,
                        results: results,
                        amounts: amounts,
                        messGood: messGood
                    });
                }
            });
        } else {
            const messGood = req.flash('messGood');
            return res.render('cart', {
                message: 'Your cart is empty :(',
                session: req.session,
                results: 0,
                messGood: messGood
            });
        }
    });
});

// payment page
router.get('/payment', (req, res) => {

    const messNotPayed = req.flash('messNotPayed');
    res.render('payment', {
        session: req.session,
        messNotPayed: messNotPayed
    });
});

module.exports = router;
