var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host     : "localhost",
	user     : "root",
	password : "",
	database : "bamazon"
});
 
var cartUpdate = 0;

connection.connect();

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
	console.log("The Total Value of your purchase is: $" + cartUpdate);
};

function customerDisplay(squant, price) {
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

function updateStock(quant, stock, id, price) {

	var stockUpdate = stock - quant;
	connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [stockUpdate, id], function(err){
		if (err) throw err;
		console.log("Order added to your cart successfully!");
		customerDisplay(quant, price);
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
				updateStock(parseQt, finder[0].stock_quantity, finder[0].item_id, finder[0].price);
			}

		});		
	});
};

openCart();