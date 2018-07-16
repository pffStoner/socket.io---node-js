const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

//get generate msg as obj
const {generateMsg,generateLocationMsg} = require('./utils/message')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
//
var server = http.createServer(app);
//create web socket server
//socket.emit - emit to single connection
//io.emit - emit to every single connection
var io = socketIO(server);

app.use(express.static(publicPath));

//listen to events
io.on('connection',(socket) => {
    console.log('user connect');

    socket.emit('newMessage', {
        from: 'dsd'
    });
    //for new user join
    socket.broadcast.emit('newMessage', generateMsg('Admin','new user joined'));


    //listen to createMsg event
    socket.on('createMessage', (msg, callback ) =>{
        console.log("Mesaage", msg);
        callback();
        //emit to everyone with io.emit
        io.emit('newMessage', generateMsg(msg.from, msg.text));
    });

    //send location
     socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMsg('Admin',coords.lattitude,coords.longitude))
     });


    //when user disconect
    socket.on('disconnect', () =>{
        console.log('User was disconected');
        
    });
});


app.get('/home', (req, res) =>{
    res.send('index mada faka');
});

server.listen(port, () =>{
    console.log('listening ${port}');
});