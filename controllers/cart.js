const mysql = require("mysql2");

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

exports.add = (req, res) => {
    console.log(res);

    const prod_id = req.body.id;
    const user_id = req.session.user_id;

    db.query('SELECT id, stock FROM products WHERE id = ?', [prod_id], (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {

            if(results[0].stock === 0){
                req.flash('messBad', 'No such product on stock');
                return res.redirect('/shop');
            }else {

                db.query('SELECT * FROM carts WHERE user_id=? AND prod_id=?', [user_id, prod_id], (error, cart_res) => {
                    if (error) {
                        console.log(error);
                    }

                    if (cart_res.length > 0) {
                        db.query('UPDATE carts SET amount = amount + 1 WHERE user_id=? AND prod_id=?',
                            [user_id, prod_id], (error, results) => {
                                if (error) {
                                    console.log(error);
                                }

                                db.query('UPDATE products SET stock = stock - 1 WHERE id=?', [prod_id], (error, results) => {
                                    if (error) {
                                        console.log(error);
                                    }
                                    req.flash('messGood', 'Added product to cart');
                                    return res.redirect('/shop');
                                });
                            });
                    } else if (cart_res.length === 0) {
                        db.query('INSERT INTO carts SET ?', {
                            user_id: user_id,
                            prod_id: prod_id,
                            amount: 1
                        }, (error, results) => {
                            if (error) {
                                console.log(error);
                            }

                            db.query('UPDATE products SET stock = stock - 1 WHERE id=?', [prod_id], (error, results) => {
                                if (error) {
                                    console.log(error);
                                }
                                req.flash('messGood', 'Added product to cart');
                                return res.redirect('/shop');
                            });
                        });
                    }
                });
            }
        }
    });
}

exports.remove = (req, res) => {
    console.log(res);

    const prod_id = req.body.id;
    const user_id = req.session.user_id;

    db.query('SELECT id, user_id, prod_id, amount FROM carts WHERE user_id=? AND prod_id=?',
        [user_id, prod_id], (error, cart_res) => {
        if (error) {
            console.log(error);
        }

        if(cart_res[0].amount > 1){
            db.query('UPDATE carts SET amount = amount - 1 WHERE user_id=? AND prod_id=?',
                [user_id, prod_id], (error, results) => {
                    if (error) {
                        console.log(error);
                    }
                    db.query('UPDATE products SET stock = stock + 1 WHERE id=?', [prod_id], (error, results) => {
                        if (error) {
                            console.log(error);
                        }
                        req.flash('messGood', 'Removed product from cart');
                        return res.redirect('/cart');
                    });
                });

        }else {
            db.query('DELETE FROM carts WHERE user_id=? AND prod_id=?', [user_id, prod_id], (error, results) => {
                if (error) {
                    console.log(error);
                }

                db.query('UPDATE products SET stock = stock + 1 WHERE id=?', [prod_id], (error, results) => {
                    if (error) {
                        console.log(error);
                    }
                    req.flash('messGood', 'Removed product from cart');
                    return res.redirect('/cart');
                });
            });
        }
    });
}