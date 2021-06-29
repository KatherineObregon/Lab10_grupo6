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


app.listen(8090, function(){
    console.log("servidor arrancado...");
});
