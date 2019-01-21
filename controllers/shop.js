const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    })
  }).catch(
    () => console.log("err in get")
  )
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then((products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })).catch(
    () => console.log("err in get") 
  )
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.id;
  Product.findById(productId).then(
    (product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: "yah",
        path: "/products"
      })
    }
  ).catch(
    err => console.log(err)
  )
}

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'Your Cart'
  });
};

exports.postCart = (req, res, next) => {
  const pid = req.body.productId;
  Product.findById(pid, (product) => {
    Cart.addProduct(pid, product.price)

  })
  res.redirect("/cart");
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};