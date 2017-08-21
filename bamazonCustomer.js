var inquirer = require("inquirer");
var connection = require("./connection.js"); 
var cartUpdate = 0;

var resultsCustomer = new Promise(function(resolve, rejected) {
	connection.query("SELECT * FROM products", function(err, res) {			
		if (err) throw err;
		resolve(res);
	});
});

function openCart(){
	connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
		if (err) throw err;
		console.log("________________________________________________________\n" + "\n | Item ID | Product Name | Price");
		for (var i = 0; i < res.length; i++) {
			console.log(" | " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
		}
		console.log("________________________________________________________\n");
		orderPlatform();
	});
};
function closeCart() {
	console.log("The Total Value of your purchase is: $" + cartUpdate.toFixed(2));
};

function customerDisplay(squant, price, id) {

	var subTotal = squant * price;
	cartUpdate = cartUpdate + subTotal;

	console.log("The Value of your purchase is: $" + subTotal + "\n");
	inquirer.prompt([{
		type: "confirm",
		message: "Would you like to add more items?: ",
		name: "status",
		default: true
	}])
	.then(function(answer) {	
		if (answer.status) {
			openCart();
		} else {
			closeCart();
		}
	});	
};

function updateStockandsales(quant, stock, id, price, sales) {
	
	var stockUpdate = stock - quant;
	var salesUpdate = sales + (quant * price);
	
	connection.query("UPDATE products SET stock_quantity=?, product_sales=? WHERE item_id=?", [stockUpdate, salesUpdate, id], function(err){
		if (err) throw err;
		console.log("Order added to your cart successfully!");
		customerDisplay(quant, price, id);
	});
};

function orderPlatform() {
	inquirer.prompt([
		{
		type: "input",
		message: "Please enter the Item ID you would like to buy: ",
		name: "itemId"
		},
		{
		type: "input",
		message: "Please enter quantity of Items you would like to buy: ",
		name: "quantity"
		}])
	.then(function (answer) {
		var parseId = parseInt(answer.itemId);
		var parseQt = parseInt(answer.quantity);

		resultsCustomer.then(function(fulfilled) {				
			var finder = fulfilled.filter(function(i) {
				return i.item_id === parseId;		
			});		

			if (finder[0].stock_quantity < answer.quantity) {
				console.log("Insufficient quantity!");
				orderPlatform();
			} else {				
				updateStockandsales(parseQt, finder[0].stock_quantity, finder[0].item_id, finder[0].price, finder[0].product_sales);
			}

		});		
	});
};

openCart();