const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

//get generate msg as obj
const { generateMsg, generateLocationMsg } = require('./utils/message')
const {Users} = require('./utils/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
//
var server = http.createServer(app);
//create web socket server
//socket.emit - emit to single connection
//io.emit - emit to every single connection
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

//listen to events
io.on('connection', (socket) => {
    console.log('user connect');

    socket.on('join', (params, callback) => {
        //TODO: add validations for names

        //remove from other rooms
        users.removeUser(socket.id);
        //add use to list
        users.addUser(socket.id,params.name,params.room)
        //join room
        socket.join(params.room);
        //update list
        io.to(params.room).emit('updatedList', users.getUsersList(params.room));
        //to all when join chat app
        socket.emit('newMessage', generateMsg('Admin', 'Welcome to Chat App'));
        //for new user join
        socket.broadcast.to(params.room).emit('newMessage', generateMsg('Admin', params.name + ' joined'));
        callback();
    });




    //listen to createMsg event
    socket.on('createMessage', (msg, callback) => {
        //get user who send msg
       var user = users.getUser(socket.id);

       if (user && msg.text !=="") {
           //emit to everyone with io.emit
           //emit just to room
        io.to(user.room).emit('newMessage', generateMsg(user.name, msg.text));
       }

        
        callback();

    });

    //send location
    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);

        if (user) {
            //emit to everyone with io.emit
            //emit just to room
            io.to(user.room).emit('newLocationMessage', generateLocationMsg(user.name, coords.lattitude, coords.longitude))
        }
    });


    //when user disconect
    socket.on('disconnect', () => {
        console.log('User was disconected');
        var user = users.removeUser(socket.id);
        
        if (user) {
            io.to(user.room).emit('updatedList', users.getUsersList(user.room));
            io.to(user.room).emit('newMessage', generateMsg('Admin ',user.name +'has left.'));

        }
    });
});


app.get('/home', (req, res) => {
    res.send('index mada faka');
});

server.listen(port, () => {
    console.log('listening ${port}');
});