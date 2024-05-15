const mysql = require("mysql2");

const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});

exports.success = (req, res) => {
    console.log(res);

    const user_id = req.session.user_id;

    db.query('SELECT * FROM carts WHERE user_id=?', [user_id], (error, cart_res) => {
            if (error) {
                console.log(error);
            }

        if (cart_res.length > 0) {
            let products = []

            cart_res.forEach(function (item) {
                products.push(item.prod_id);
            });

            db.query('DELETE FROM carts WHERE user_id=? AND prod_id IN (?)', [user_id, products], (error, results) => {
                if (error) {
                    console.log(error);
                }

                req.flash('messPayed', 'Payment success');
                return res.redirect('/');
            });
        } else {
            req.flash('messNotPayed', 'Your cart is empty');
            return res.redirect('/payment');
        }
    });
}