const express = require('express');
const app = express();
const mongoose = require('./database/mongoose');

const TaskList = require('./database/models/taskList');
const Task = require('./database/models/task');
// app.listen(3000,function(){
//     console.log("Server started on port 3000");
// });


/*
CORS - Cross Origin Request Security
Backend - http://localhost:3000
Frontend - http://localhost:4200
*/ 
//Add Headers
// Add headers before the routes are defined
//3rd Party library , app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers','Origin', 'X-Requested-With,content-type,Accept');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//Example of middleware
app.use(express.json()); // or 3rd party liabrary body parser

//Routes of REST API Endpoints or RESTFull Webservices Endpoints
/*
TaskList - Create,Update,ReadTaskListById,ReadAllTaskLists
Task - Create,Update,ReadTaskById,ReadAllTask
*/

//Routes Or API endpoints Tasklist model
//Get All Task Lists
//https:localhost:3000/tasklists => [{},{}]
app.get('/tasklists', (req,res) => {
    TaskList.find({})
    
        .then((lists) => {
            res.status(200).send(lists);
        })
        .catch((error) => { 
            console.log(error);
            res.status(500);
        });
});

//Endpoint to get one tasklist by tasklistid
app.get('/tasklists/:tasklistId',(req,res) =>{
    let tasklistId = req.params.tasklistId;
    TaskList.find({ _id: tasklistId })
        .then((taskList) => { 
            res.status(200).send(taskList)
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });
})
//Route or Endpoint for creating a TaskList
app.post('/tasklists',(req,res) => {
//console.log("I am inside POST method");
console.log(req.body);
let taskListObj = {'title':req.body.title};
TaskList(taskListObj).save()

    .then((lists) => {
        res.status(201);
        res.send(lists);
     })
    .catch((error) => {
        console.log(error);
        res.status(500);
    });
});

//PUT is full update of object
app.put('/tasklists/:tasklistId', (req,res) => {
  TaskList.findOneAndUpdate({ _id: req.params.tasklistId }, { $set: req.body},{ 
    new : true })
    .then((tasklist) => {
        res.status(200).send(tasklist);
    })
    .catch((error) => {
        console.log(error);
        res.status(500);
    });
});

//PATCH partial object of update
app.patch('/tasklists/:tasklistId', (req,res) => {
    // TaskList.findOneAndUpdate({ _id: req.params.tasklistId}, { $set: req.body})
    
    TaskList.findByIdAndUpdate({_taskListId:req.params.tasklistId},{$set:req.body}, {
            new: true
        })
      .then((tasklist) => {
            res.status(200).send(tasklist);
      })
      .catch((error) => {
          console.log(error);
          res.status(500);
      });
  });

  //DELETE a tasklist By Id
app.delete('/tasklists/:tasklistId',(req,res) =>{
    
    //Delete all the tasks with in tasklist if tasklist is deleted
    const deleteAllContainingTask = (taskList) =>{
        Task.deleteMany({_taskListId: req.params.tasklistId })
        .then(() => {return taskList})
        .catch((error) => {
            console.log(error);
        })
    };

    const responseTaskList = TaskList.findByIdAndDelete(req.params.tasklistId)
        .then((taskList) => { 
            deleteAllContainingTask(taskList);
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        });
        res.status(200).send(responseTaskList)
});

//CRUD opreation for task, a task always belong to a TaskList
//GET all tasks for 1 TaskList , http://localhost:3000/tasklists/tasklistId/tasks
app.get('/tasklists/:tasklistId/tasks', (req,res) => {
    Task.find({ _taskListId: req.params.tasklistId })
        .then((tasks) => {
            res.status(200).send(tasks)
        })
        .catch((error) => {
            console.log(error);
            res.status(500);
        })
});
//create a task inside a particular Task List
app.post('/tasklists/:tasklistId/tasks',(req,res) => {
    console.log(req.body);

    let taskObj = {'title': req.body.title , '_taskListId':req.params.tasklistId};
    Task(taskObj).save()
    .then((task) => {
        res.status(201).send(task);
    })
    .catch((error) =>{
        console.log(error);
        res.status(500);
    });
});
//http://localhost:3000/tasklists/tasklistId/tasks/:taskId
//GET 1 task inside 1 TaskList
app.get('/tasklists/:tasklistId/tasks/:taskId',(req,res) =>{
    Task.findOne({_taskListId:req.params.tasklistId,_id:req.params.taskId})
    .then((task) => {
        res.status(200).send(task);
    })
    .catch((error) => {
        console.log(error);
        res.status(500);
    })
});

//update one task belonging one tasklist
app.patch('/tasklists/:tasklistId/tasks/:taskId', (req,res) => {
    // TaskList.findOneAndUpdate({ _id: req.params.tasklistId}, { $set: req.body})
    
    Task.findOneAndUpdate({ _taskListId: req.params.tasklistId, _id: req.params.taskId},{$set:req.body}, {
            new: true
        })
      .then((task) => {
            res.status(200).send(task);
      })
      .catch((error) => {
          console.log(error);
          res.status(500);
      });
});

//DELETE task inside a tasklist
app.delete('/tasklists/:tasklistId/tasks/:taskId',(req,res) => {
    Task.findOneAndDelete({_taskListId:req.params.tasklistId,_id:req.params.taskId})
    .then((task) => {
        res.status(200).send(task)
    })
    .catch((error) => {
        res.status(500);
        console.log(error);
    })
});
app.listen(3000 , () => {
    console.log("Server started on port 3000");
});