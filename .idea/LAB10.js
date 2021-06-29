const express = require('express');
const app = express();
const mysql = require("mysql2");

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lab10_employees'
});

app.get("/empleados/get",function(request, response){
    var query = "select EmployeeID, LastName, FirstName, Title from employees";
    conn.query(query, function(error, data){
        if(error) throw error;
        response.json(data);
    });
});

app.get("/empleados/getManagerEmployees/:id",function(request, response){

    let managerId= request.params.id;
    let query = "select EmployeeID, LastName, FirstName, Title from employees where  ReportsTo = ?";
    let params= [managerId];

    conn.query(query, params, function(error, data){
        if(error) throw error;
        response.json(data);
    });
});

app.get("/productos/get",function(request, response){

    let pageNumber = request.query.page;

    let indice = 10*(pageNumber-1);


    let query = "select ProductID, ProductName, UnitPrice, UnitsInStock from products limit ?, 10";
    let params= [indice];

    conn.query(query, params, function(error, data){
        if(error) throw error;
        response.json(data);
    });
});

app.listen(8090, function(){
    console.log("servidor arrancado...");
});
