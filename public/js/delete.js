const deleter = (me) => {
	const pid = me.parentNode.querySelector("[name=prodId]").value;
	const token = me.parentNode.querySelector("[name=_csrf]").value;

	fetch(`/admin/delete-product/${pid}`, {
		headers: {
			"CSRF-Token": token,
		},
		method: "DELETE",
	})
		.then((res) => {
			return res.json();
		})
		.then((end) => {
			if (end.status == 200) {
				console.log("yessss");
				return me.parentNode.parentNode.remove();
			}
			console.log("whops");
		})
		.catch((res) => console.log("err"));
};
