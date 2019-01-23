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
  const userId = req.user.id;
  req.user.createProduct({
      description,
      imageUrl,
      title,
      price,
    })
    // Product.create({
    //     description,
    //     imageUrl,
    //     title,
    //     price,
    //     userId,
    //   })
    .then(
      () => {
        console.log("product created")
        res.redirect('/')
      }
    ).catch(
      err => console.log("postAddProduct")
    )
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  const upTitle = req.body.title;
  const upPrice = req.body.price;
  const upImg = req.body.imageUrl;
  const upDesc = req.body.description;
  const userId = req.user.id;

  Product.findByPk(prodId)
    .then(prod => {
      prod.title = upTitle;
      prod.price = upPrice;
      prod.imageUrl = upImg;
      prod.description = upDesc;
      prod.userId = userId;
      prod.save();
    })
    .catch(
      err => console.log("err in post edit")

    )
  res.redirect('/admin/products');
}

exports.postDelProduct = (req, res, next) => {
  const prodId = req.body.prodId;
  Product.findByPk(prodId).then(prod => {
    prod.destroy();
    res.redirect('/admin/products');
  })

}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.prodId;
  req.user.getProducts({
    where: {
      id: prodId
    }
  }).then(products => {
    const product = products[0];
    if (!product) {
      return res.redirect("/")
    }
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: true,
      product: product
    })
  }).catch(
    () => console.log("err on edit prod")
  )
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};