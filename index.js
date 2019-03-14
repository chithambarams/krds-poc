//dependencies required for the app
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var con = require('./db');
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//render css files
app.use(express.static("public"));

//placeholders for added task
var task = [];
//placeholders for removed task
var complete = [];


//post route for adding new task 
app.post("/addtask", function(req, res) {
    var newTask = req.body.newtask;
    
    //add the new task from the post route
    var today = new Date();
    var dt = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
    var sql = "INSERT INTO `todo_list`(`todo_list`, `status`, `date_created`) VALUES ?";
    var values = [[newTask,'0',dt]];
    con.query(sql, [values],function (err, result) {
        if (err) throw err;
    });
    
    task.push(newTask);
    res.redirect("/");
});

app.post("/removetask", function(req, res) {

    var task_id = req.body.id;

    var today = new Date();
    var dt = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
    var sql = "DELETE FROM todo_list WHERE id=?";
    var values = [task_id];
    con.query(sql, values,function (err, result) {
        if (err) throw err;
    });

    var cnt_sql = "SELECT COUNT(*) AS cnt FROM todo_list WHERE status=1";
    con.query(cnt_sql, function (err_cnt, result_cnt) {
        if (err_cnt) throw err_cnt;
        cnt = result_cnt[0].cnt;
        res.send({task_id,cnt});
    });
});

app.post("/updatetask", function(req, res) {

    var task_id = req.body.id;

    var today = new Date();
    var dt = today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
    var sql = "UPDATE todo_list SET status=? WHERE id=?";
    var values = [1,task_id];
    con.query(sql, values,function (err, result) {
        if (err) throw err;
    });
    var cnt = 0;
    var cnt_sql = "SELECT COUNT(*) AS cnt FROM todo_list WHERE status=1";
    con.query(cnt_sql, function (err_cnt, result_cnt) {
        if (err_cnt) throw err_cnt;
        cnt = result_cnt[0].cnt;
        res.send({task_id,cnt});
    });
});

//render the ejs and display added task, completed task
app.get("/", function(req, res) {
    
        con.query("SELECT (SELECT COUNT(*) FROM todo_list WHERE status=1) AS cnt, ID,todo_list,status,date_created FROM todo_list ORDER BY ID DESC", function (err, result, fields) {
        if (err) throw err;
        //Return the fields object:
        var task_array = []; var cnt = 0;
        var completed_array = []; 
        var i = 0; var k = 0;
        Object.keys(result).forEach(function(key) {
            var row = result[key];
            if((row.status == 0) || (row.status == 1))
            {
                task_array.push({"todo_list":row.todo_list,"date_created":row.date_created,"id":row.ID,"status":row.status});
                cnt = row.cnt;
                k++;
            }
            else
            {
                completed_array.push({"todo_list":row.todo_list,"date_created":row.date_created,"id":row.ID,"status":row.status});
                cnt = row.cnt;
            }
            
            i++;
        });
        res.render("index", { task: task_array, complete: completed_array,cnt:k,cnt:cnt });
    });
    
});

//set app to listen on port 3000
app.listen(process.env.PORT || 4000, function(){
    console.log('Your node js server is running');
});
