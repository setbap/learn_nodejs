const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const exp = products.findIndex(prod => prod.id === this.id);
        const updated = [...products];
        updated[exp] = this;
        fs.writeFile(p, JSON.stringify(updated), err => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          console.log(err);
        });
      }
    });
  }

  static del(prodId, cb) {
    getProductsFromFile(products => {
      const deletedItem = products.find(prod => prod.id === prodId);
      const upProd = products.filter(prod => prod.id !== prodId);
      fs.writeFile(p, JSON.stringify(upProd), err => {
        if (!err) {
          Cart.deleteProduct(prodId,  deletedItem.price)
        } else {
          console.log(err);
        }
      });
    })
    cb();

  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(Pid, cb) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === Pid);
      cb(product);
    })
  }
};
