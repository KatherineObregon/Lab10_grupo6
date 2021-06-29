const express = require('express');
const app = express();
//conexion a base de datos
const mysql = require("mysql2");

//usar form-data
const multer = require("multer");
const upload = multer();

let conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'lab10_employees'
});

//PREGUNTA 1:
app.get("/empleados/get",function(request, response){
    var query = "select EmployeeID, LastName, FirstName, Title from employees";
    conn.query(query, function(error, data){
        if(error) throw error;
        response.json(data);
    });
});

//PREGUNTA 6:
app.post("/categorias/create", upload.none(), function(req, res){

    var name = req.body.name;
    var description = req.body.description;
    var picture = req.body.picture;
    var extension = picture.substring(picture.length - 4, picture.length)
    if(extension == ".jpg" || extension == ".png"){

        var query = "insert into categories(CategoryName, Description, Picture) values (?, ?, ?)"
        var params = [name, description, picture];
        conn.query(query, params, function(error, data){
            if(error){
                var resJson = {
                    status : "error",
                    message : error.details[0].message
                };
                res.status(400).json(resJson);
            }else{
                var resJson = {
                    status : "ok",
                    message : "Category created"
                };
                res.json(resJson);
            }
        });
    }else{
        var resJson = {
            status : "error",
            message : "Picture name doesn't have correct extension"
        };

        res.status("400").json(resJson);
    }
});

//PREGUNTA 3
app.get('/empleados/getByTitle/:title', (req, res) => {
    let Title = req.params.title;
    let query = "SELECT * FROM lab10_employees.employees where Title = ?";
    let parameters = [Title];
    conn.query(query, parameters, function (err, results) {
        if (err) throw err;
        let employeeList = [];
        for (var j = 0; j < results.length; j++) {
            employee = {
                'EmployeeID': results[j]['EmployeeID'],
                'LastName': results[j]['LastName'],
                'FirstName': results[j]['FirstName'],
                'Title': results[j]['Title']
            };
            employeeList.push(employee);
        }
        res.json(employeeList);
    });
})

//Pregunta 2
app.get("/empleados/getManagerEmployees/:id",function(request, response){

    let managerId= request.params.id;
    let query = "select EmployeeID, LastName, FirstName, Title from employees where  ReportsTo = ?";
    let params= [managerId];

    conn.query(query, params, function(error, data){
        if(error) throw error;
        response.json(data);
    });
});
//Pregunta 5

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
