const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null,title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const upTitle = req.body.title;
  const upPrice = req.body.price;
  const upImg = req.body.imageUrl;
  const upDesc = req.body.description;
  const upProd = new Product(prodId, upTitle, upImg, upDesc, upPrice);
  upProd.save();
  res.redirect('/admin/products');
} 

exports.postDelProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  Product.del(prodId, () => {
    res.redirect('/admin/products');
  })
  
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.prodId;
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect("/")
    }
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: true,
      product: product
    })
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};