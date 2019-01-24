const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./util/database");
const errorController = require('./controllers/error');

const User = require('./models/user');
const Product = require('./models/product');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use((req, res, next) => {
    User.findByPk(1)
        .then(
            (user) => {
                req.user = user;
                next();
            }
        ).catch(
            () => console.log("err in use in user")
        )
});

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));



app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product , {through:CartItem});
Product.belongsToMany(Cart , {through:CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Product.belongsToMany(Order , {through:OrderItem});
Order.belongsToMany(Product , {through:OrderItem});



sequelize
    // .sync({force:true})
    .sync()
    .then(
        res => {
            return User.findByPk(1)
        }
    )
    .then(
        usr => {
            if (!usr) {
                return User.create({
                    name: "sina",
                    email: "ebr.sina@gamil.com"
                });
            }
            return usr;
        }
    )
    // .then(
    //     usr => {
    //         // console.log(usr);
    //         return usr.createCart();
    //     }
    // )
    .then(
        usr => {
            // console.log(usr);
            app.listen(4000);
        }
    )
    .catch(
        err => console.log(err)

    );