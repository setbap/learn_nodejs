const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		comments: [
			{
				content: { type: String, required: true },
				userId: {
					type: Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			},
		],
	},
	{ timestamps: true },
);
productSchema.methods.addComment = function(content, userId) {
	this.comments.push({
		content,
		userId,
	});
	return this.save();
};

module.exports = mongoose.model("Product", productSchema);

// const mongodb = require('mongodb');

// class Product {
//   constructor(title, price, description, imageUrl, id) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     if (id) {
//       this.id = mongodb.ObjectID(id)
//     }
//   }

//   save() {
//     const db = getDb();
//     if (this.id) {
//       return db.collection('products').updateOne({
//         _id: this.id
//       }, {
//         $set: this
//       }).then(resualt => {
//         console.log("updated")
//       }).catch();
//     } else {
//       return db.collection('products').insertOne(this).then(resualt => {
//         console.log("added")
//       }).catch();
//     }

//   }

//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products').find().toArray()
//       .then(resualt => {
//         console.log("fetchAll")
//         return resualt;
//       }).catch();
//   }

//   static findByPk(prodId) {
//     const db = getDb();
//     return db.collection('products').find({
//         _id: new mongodb.ObjectID(prodId)
//       })
//       .next()
//       .then(resualt => {
//         console.log("findByPk")
//         return resualt;
//       }).catch();
//   }

//   static DeleteById(prodId) {
//     const db = getDb();
//     const myId = new mongodb.ObjectID(prodId);
//     return db.collection('products').deleteOne({
//         _id: myId
//       })
//       .then(() => console.log("deleted"))
//       .catch(() => console.log("err in delete"))
//   }
// }

// // const Product = sequelize.define('product', {
// //   id: {
// //     type: Sequelize.INTEGER,
// //     primaryKey: true,
// //     autoIncrement: true,
// //     allowNull: false,
// //   },
// //   title: {
// //     allowNull: false,
// //     type: Sequelize.STRING
// //   },
// //   price: {
// //     allowNull: false,
// //     type: Sequelize.DOUBLE
// //   },
// //   imageUrl: {
// //     allowNull: false,
// //     type: Sequelize.STRING
// //   },
// //   description: {
// //     allowNull: false,
// //     type: Sequelize.TEXT
// //   },
// // });

// module.exports = Product;
