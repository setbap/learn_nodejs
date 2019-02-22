## Expess pagination

> ##### chizaee ke man yad gerftam

---

### PART 1

> ##### aval miam be unvane params ya query page ro moshakhas mikonim

```js
var perPage = 9;
var page = req.params.page || 1;
```

---

### PART 2

> ##### bad miaim bar asas un chizi ke mikhahim neshun bedim tedad ro joda mikonim

```javascript
Product.find({})
	.skip(perPage * page - perPage)
	.limit(perPage)
	.then((products) => {
		Product.countDocuments().exec(function(err, count) {
			if (err) return next(err);
			res.render("shop/product-list", {
				prods: products,
				pageTitle: "All Products",
				path: "/products",
				isAuthenticated: req.session.isLoggedIn,
				products: products,
				current: page,
				pages: Math.ceil(count / perPage),
			});
		});
	});
```

---

### PART 3

> ##### hala mobate khorojie vase in kar dakhel template dastor haye zir ro mizarim

```js
<% if (pages > 0) { %>
	<ul  class="pagination text-center">
	<% if (current == 1) { %>
	<li  class="disabled"><a>First</a></li>
	<% } else { %>
		<li><a  href="/products">First</a></li>
	<% } %>
	<% var i = (Number(current) > 5 ? Number(current) - 4 : 1) %>
	<% if (i !== 1) { %>
		<li  class="disabled"><a>...</a></li>
	<% } %>
	<% for (; i <= (Number(current) + 4) && i <= pages; i++) { %>
		<% if (i == current) { %>
			<li  class="active"><a><%= i %></a></li>
		<% } else { %>
		<li><a  href="/products?page=<%= i %>"><%= i %></a></li>
	<% } %>
	<% if (i == Number(current) + 4 && i < pages) { %>
		<li  class="disabled"><a>...</a></li>
		<% } %>
	<% } %>
	<% if (current == pages) { %>
		<li  class="disabled"><a>Last</a></li>
	<% } else { %>
		<li><a  href="/products?page=<%= pages %>">Last</a></li>
	<% } %>
	</ul>
<% } %>
```

---

> ##### alan safhe bandi ma kamel shode va mitavan baksh ejs (part3) ro be unvane include vared kard

[site ke in mataleb azash gerefte shode](https://evdokimovm.github.io/javascript/nodejs/mongodb/pagination/expressjs/ejs/bootstrap/2017/08/20/create-pagination-with-nodejs-mongodb-express-and-ejs-step-by-step-from-scratch.html)
