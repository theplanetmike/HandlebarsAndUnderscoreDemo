function Item(props) {
	var retObj = {};
	retObj.display = function() {
		var source = $('#itemTemplate').html();
		var compiled = Handlebars.compile(source);
		var finishedHtml = compiled(this);
		$('#outlet').append(finishedHtml);
	};

	for(var prop in props) {
		retObj[prop] = props[prop];
	}
	return retObj;
}