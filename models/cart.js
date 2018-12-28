const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);


module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, content) => {
            let cart = { product: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(content)
            }
            const existingProductIndex = cart.product.findIndex(prod => prod.id === id)
            const existingProduct = cart.product[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct }
                updatedProduct.qty += 1
                cart.product = [...cart.product];
                cart.product[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, itemPrice: productPrice, qty: 1 }
                cart.product = [...cart.product, updatedProduct]
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        })
    }
}
