var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var activeUsers = [];
var messages = [];

app.get('/', function(req, res) {
    res.render('index');
})

var server = app.listen(8000, function() {
    console.log('listening on 8000');
});

var io = require('socket.io').listen(server);
io.sockets.on('connection', function(socket) {
    console.log('Socket connection made');
    console.log('Client socket ID: ', socket.id);

    socket.on('new_user_connected', function(data) {
        var newUser = 
            {name: data.name,
            id: socket.id,};
        console.log("Welcome: ", newUser);
        activeUsers.push(newUser);
        socket.emit('user_id', {id: socket.id});
        // emit all of the message objects
        socket.emit('allMessages', {messages: messages});
    })

    socket.on('newMessage', function(data) {
        var newMessage = data.message;
        messages.push(data.message);
        io.emit('messageAdded', {message: newMessage});
    })
})