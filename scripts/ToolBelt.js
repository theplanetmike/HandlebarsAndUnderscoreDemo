//register addButton Handlebars partial
Handlebars.registerPartial('addButton', $('#addTemplate').html());
//register removeButton Handlebars partial
Handlebars.registerPartial('removeButton', $('#removeTemplate').html());

if (!window.localStorage.cart)
	window.localStorage.cart = ["-1"]; //sets up local storage if it doesn't exist

var ToolBelt = {
	curView: '',
	items : [],
	load : function(callback) {

		var apiKey = '1woeqYY4Ki83qo8AOHgUgfaMBKeFT2iqZRuaEdPQx0wM'; //got this from the URL for publishing the Google spreadsheet
		var googleUrl = 'https://spreadsheets.google.com/feeds/list/@apiKey/od6/public/values?alt=json-in-script';

		var finishedUrl = googleUrl.replace('@apiKey', apiKey);

		function parseGoogleData(data) {
			//change $.each to _.each
			var tempArr = [];
			_.each(data.feed.entry, function(val) {
				var obj = {};
				for(var key in val) {
					var matched = key.match(/gsx\$/);
					if(matched) {
						obj[key.slice(4)] = val[key].$t;
					}     
				}

				tempArr.push(new Item(obj));
			});
			return tempArr;
		}

		$.ajax({
			url : finishedUrl,
		    dataType : 'jsonp',
		    success : function(data) {
				ToolBelt.items = parseGoogleData(data);
				ToolBelt.getCart();
				callback();
		    },
			error : function(err) {
				console.log(err);
			}
		  });
	},

	addItem : function() {
		//no changes
		//get elements
		var obj = {
			id : '' + (ToolBelt.items.length + 1),
		    firstname: $('#firstname').val(),
		    lastname: $('#lastname').val(),
		    phonenum: $('#phonenum').val(),
		    age: $('#age').val(),
			marstatus: $('#marstatus').val(),
		    gender: $('#gender').val(),
			inCart : false
		}
		var item = new Item(obj);
		ToolBelt.items.push(item);
		ToolBelt.clearInputs();
	},

	clearInputs : function() {
		var inputs = $('input');
		_.each(inputs, function(theVal) {
			$(theVal).val('');
		});
	},

	cartAction : function(id) {
		//loop through ToolBelt.items
        _.each(ToolBelt.items, function(val){
			//if the current element.id matches the argument id
        	if(val.id === id)
				//set the elements.inCart property to the opposite of itself
            	val.inCart = !val.inCart;
				//call ToolBelt.reload();
				ToolBelt.reload();
        });
		//call ToolBelt.saveCart();
		ToolBelt.saveCart();
	},

	showAll : function() {
		//set ToolBelt.curView to 'all'
		ToolBelt.curView = 'all';

		//no other changes - but I did switch to underscorejs
		$('#outlet').empty();
		_.each(ToolBelt.items, function(val) {
			val.display();
		});
	},

	showCart : function() {
		//set ToolBelt.curview to 'cart'
		ToolBelt.curView = 'cart';

		//no other changes - but I did switch to underscorejs
		$('#outlet').empty();
		_.each(ToolBelt.items, function(val) {
			if(val.inCart)
				val.display();
		});
	},

	showAdmin : function() {
		//set ToolBelt.curview to 'admin'
		ToolBelt.curView = 'admin';

		//no other changes
		var body = $('#outlet').empty();
		var template = $('#adminTemplate').html();
		var compiled = Handlebars.compile(template);
		body.append(compiled());
	},

	reload : function() {
		//switch statement testing ToolBelt.curView
		switch(ToolBelt.curView) {
			case 'cart':
				ToolBelt.showCart();
				break;
			case 'admin':
				ToolBelt.showAdmin();
				break;
			case 'all':
			default: //I did it this way so that if there's a problem it defaults to showing all. Don't really need case 'all' but wanted to be explicit.
				ToolBelt.showAll();
		}

	},

	saveCart : function() {
		//make a temp array
		tempArr = [];

		//_.each through ToolBelt.items
		_.each(ToolBelt.items, function(val) {
			//if the element.inCart property is true
			if(val.inCart) {
				//push element.id to the temp array
				tempArr.push(val.id);
			}
		});

		//Finally, JSON.stringify the temp array and assign to window.localStorage.cart
		window.localStorage.cart =  JSON.stringify(tempArr);
	},

	getCart : function() {
		//JSON.parse window.localStorage.cart and set to a local variable
		var cartArray = JSON.parse(window.localStorage.cart);
		//_.each through ToolBelt.items
		_.each(ToolBelt.items, function(val) {
			//if the element.id is in the local cart variable
			//if($.inArray(val.id, cartArray) >= 0) {
			if(_.contains(cartArray, val.id) === true) {
				//set element.inCart to true
				val.inCart = true;
			}
		});
	}, 

	emptyCart : function() {
		//set each element.inCart to false in ToolBelt.items
		_.each(ToolBelt.items, function(val) {
			val.inCart = false;
		});

		//call ToolBelt.saveCart() or set window.localStorage.cart to an empty string
		ToolBelt.saveCart();

		//call ToolBelt.reload()
		ToolBelt.reload();
	}
}