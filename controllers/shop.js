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
  Product.findByPk(productId).then(
    (product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: "yah",
        path: "/products"
      })
    }
  ).catch(
    err => console.log("getProduct")
  )
}

exports.getCart = (req, res, next) => {
  req.user.getCart().then(cart =>
    cart.getProducts().then(prods => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: prods
      });
    })
  ).catch();
};

exports.postCart = (req, res, next) => {
  const pid = req.body.productId;
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({
        where: {
          id: pid
        }
      })
    })
    .then(prods => {
      let prod
      if (prods.length > 0) {
        prod = prods[0];
      }
      let qty = 1;
      if (prod) {
        qty = prod.cartItem.quantity + 1
      }

      return Product.findByPk(pid).then(
        pprods => {
          return fetchedCart.addProducts(pprods, {
            through: {
              quantity: qty
            }
          })
        }
      ).catch(err => console.log(err))


    })

    .then(() => res.redirect("/cart"))
    .catch(err => console.log("----------------------------------------"))
}


exports.postCartDeleteProduct = (req, res, next) => {
  const pid = req.body.productId;
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({
        where: {
          id: pid
        }
      })
    })
    .then(prods => {
      let prod
      if (prods.length > 0) {
        prod = prods[0];
      }
      let qty = 1;
      if (prod) {
        if (prod.cartItem.quantity == 1) {
          return prod.cartItem.destroy()
        } else {
          qty = prod.cartItem.quantity - 1;
        }
      }

      return Product.findByPk(pid).then(
        pprods => {
          return fetchedCart.addProducts(pprods, {
            through: {
              quantity: qty
            }
          })
        }
      ).catch(err => console.log(err))


    })

    .then(() => res.redirect("/cart"))
    .catch(err => console.log("----------------------------------------"))



}

exports.postCartDeleteProductAll = (req, res, next) => {
  const pid = req.body.productId;

  req.user.getCart()
    .then(cart => {
      return cart.getProducts({
        where: {
          id: pid
        }
      })
    })
    .then(prods => {
      let prod
      if (prods.length > 0) {
        prod = prods[0];
      }
      if (prod) {
        return prod.cartItem.destroy()
      }

    })

    .then(() => res.redirect("/cart"))
    .catch(err => console.log("----------------------------------------"))



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