## pdf kit

> ##### chizaee ke man yad gerftam
>
> vase nasb kardan az

```javascript
npm install pdfkit
```

```javascript
const PDFDocument = require("pdfkit");
```

```javascript
const pdfDoc = new PDFDocument();
```

_baraye tanzim kardane header az dastor haye paeen estefade mikonim_

> ##### pdf ro to browser neshan mide

```javascript
res.setHeader("Content-Type", "application/pdf");
res.setHeader("Content-Disposition", 'inline; filename="' + file.info + '"');
```

_ma baraye afzayesh sorat az halate stream file estefade mikonim._

> bayare path az ketab khone path estefade mikonim

```javascript
pdfDoc.pipe(fs.createWriteStream(pathOfFile));
pdfDoc.pipe(res);
```

> bazi az code haye qabele estefade

```javascript
pdfDoc.fontSize(26).text("Invoice", {
	underline: true,
});
```

```javascript
doc.save()
	.moveTo(100, 150)
	.lineTo(100, 250)
	.lineTo(200, 250)
	.fill("#FF3300");
```

```javascript
doc.circle(280, 200, 50).fill("#6600FF");
```

```javascript
doc.text("And here is some wrapped text...", 100, 300)
	.font("Times-Roman", 13)
	.moveDown()
	.text(lorem, {
		width: 412,
		align: "justify",
		indent: 30,
		columns: 2,
		height: 300,
		ellipsis: true,
	});
```

### _dar akhar az dastor zir baraye payan estefade mikonim_

```javascript
pdfDoc.end();
```

> -   [website](http://pdfkit.org/)
