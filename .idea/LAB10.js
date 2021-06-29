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


app.listen(8090, function(){
    console.log("servidor arrancado...");
});
