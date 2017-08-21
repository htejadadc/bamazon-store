var inquirer = require("inquirer");
var connection = require("./connection.js");

function updateDepartment() {
	
	var query = "SELECT department_name, SUM(product_sales) AS total_sales FROM products GROUP BY department_name";
	connection.query(query, function(err, res) {		
		if (err) throw err;		
		for(var i = 0; i < res.length; i++) {				
			connection.query("UPDATE departments SET over_head_costs=? WHERE department_name=?", [100, res[i].department_name], function(err){
				if (err) throw err;											
			});	
		};	
		viewProducts();	
	});
};

function supervisorPlatform() {
	inquirer.prompt([
		{
		type: "list",
		message: "Menu Options: ",
		name: "controlMenu",
		choices: [
			new inquirer.Separator(),
			"View Products Sales by Department",
			"Create New Department",
			new inquirer.Separator()
		]		
		}])
	.then(function (answer) {
		
		var cSelected = answer.controlMenu;
		switch(cSelected) {
			case "View Products Sales by Department": updateDepartment();
				break;
			case "Create New Department": createDepartment();						
		}
	});
};

function viewProducts(){

	var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(products.product_sales) AS total_sales ";
	query += "FROM departments LEFT JOIN products ON (departments.department_name = products.department_name) GROUP BY departments.department_name ";
	query += "ORDER BY departments.department_id";
	
	connection.query(query, function(err, res) {
		
		if (err) throw err;
		console.log("________________________________________________________\n" + "\n | Dept. ID | Dept. Name | Overhead Costs | Product Sales | Total Profit");
		for (var i = 0; i < res.length; i++) {
			console.log(" | " + res[i].department_id + " | " + res[i].department_name + " | " + res[i].over_head_costs + 
				" | " + res[i].total_sales + " | " + (res[i].total_sales - res[i].over_head_costs).toFixed(2));	
		}
		console.log("________________________________________________________\n");
		supervisorPlatform();
	});
};

function createDepartment() {
	inquirer.prompt([
		{
		type: "input",
		message: "Please enter Name of Department to be created: ",
		name: "departmentName"
		}])
	.then(function (answer) {
		connection.query("INSERT INTO departments SET department_name=?", [answer.departmentName], function (err, res) {
			if (err) throw err;
			console.log("Department created successfully!");
			supervisorPlatform();
		});
	});
};

supervisorPlatform();