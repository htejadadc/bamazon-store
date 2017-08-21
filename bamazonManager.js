var inquirer = require("inquirer");
var connection = require("./connection.js");

var resultsManager = new Promise(function(resolve, rejected) {
	connection.query("SELECT * FROM products", function(err, res) {			
		if (err) throw err;
		resolve(res);
	});
});

function updateDepartment() {
	
	var query = "SELECT department_name, SUM(product_sales) AS total_sales FROM products GROUP BY department_name";
	connection.query(query, function(err, res) {		
		if (err) throw err;		
		for(var i = 0; i < res.length; i++) {				
			connection.query("UPDATE departments SET over_head_costs=? WHERE department_name=?", [100, res[i].department_name], function(err){
				if (err) throw err;											
			});	
		};	
		addProduct();
	});
};

function managerPlatform() {
	inquirer.prompt([
		{
		type: "list",
		message: "Menu Options: ",
		name: "controlMenu",
		choices: [
			new inquirer.Separator(),
			"View Products for Sale",
			"View Low Inventory",
			"Add to Inventory",
			"Add New Product",
			new inquirer.Separator()
		]		
		}])
	.then(function (answer) {
		
		var cSelected = answer.controlMenu;
		switch(cSelected) {
			case "View Products for Sale": viewProducts();
				break;
			case "View Low Inventory": viewLowinvent();
				break;
			case "Add to Inventory": addInventory();
				break;
			case "Add New Product": updateDepartment();			
		}
	});
};

function viewProducts(){
	connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
		if (err) throw err;
		console.log("________________________________________________________\n" + "\n | Item ID | Product Name | Price | Stock Quantity");
		for (var i = 0; i < res.length; i++) {
			console.log(" | " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		}
		console.log("________________________________________________________\n");		
		managerPlatform();
	});
};

function viewLowinvent(){
	var lowInvent = 
	connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
		if (err) throw err;
		console.log("________________________________________________________\n" + "\n | Item ID | Product Name | Price | Stock Quantity");
		for (var i = 0; i < res.length; i++) {
			console.log(" | " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
		}
		console.log("________________________________________________________\n");		
		managerPlatform();
	});
};

function addInventory() {
	inquirer.prompt([
		{
		type: "input",
		message: "Please enter the Item ID for the product you would like to add to the stock: ",
		name: "itemId"
		},
		{
		type: "input",
		message: "Please enter quantity of Items you would like to add to the stock: ",
		name: "quantity"
		}])
	.then(function (answer) {
		var parseId = parseInt(answer.itemId);
		var parseQt = parseInt(answer.quantity);

		resultsManager.then(function(fulfilled) {				
			var finder = fulfilled.filter(function(i) {
				return i.item_id === parseId;		
			});		
			updateStock(parseQt, finder[0].stock_quantity, finder[0].item_id);
		});		
	});
};

function updateStock(quant, stock, id) {

	var stockUpdate = stock + quant;
	connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?", [stockUpdate, id], function(err){
		if (err) throw err;
		console.log("Stock has been replenished!");	
		managerPlatform();
	});
};

function addProduct() {
	connection.query("SELECT department_name FROM departments", function(err, res) {
		if (err) throw err;
		var choicesData = [];
		for (var i = 0; i < res.length; i++) {
			choicesData.push(res[i].department_name);
		}		
		inquirer.prompt([
			{
			type: "input",
			message: "Please enter the Description Name of the new Item: ",
			name: "itemName"
			},
			{
			type: "list",
			message: "Please choose the Department of the new Item: ",
			name: "itemDepart",
			choices: choicesData
			},
			{
			type: "input",
			message: "Please enter the Price of new Item: ",
			name: "itemPrice"
			},
			{
			type: "input",
			message: "Please enter the Quantity of new Item: ",
			name: "itemQuant"
			}])
		.then(function (answer) {
			connection.query("INSERT INTO products SET ?", {
				product_name: answer.itemName, 
				department_name: answer.itemDepart, 
				price: answer.itemPrice, 
				stock_quantity: answer.itemQuant
			}, function (err, res) {
				if (err) throw err;
				console.log("Product added to Store successfully!");
				managerPlatform();
			});
		});
	});
};

managerPlatform();