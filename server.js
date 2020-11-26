const express = require('express');
const { emit } = require('process');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.set('view engine', 'ejs');
app.use(express.static('public'));
var ids = [];

app.get('/', (req, res) => {
  res.render('room',{id:ids})
});

io.on('connection', socket => {

  socket.on("connected", id=>{
    socket.username = id;
    ids.push(id);
    socket.broadcast.emit("connected",id);
  });

  socket.on("hangup",() => {
    io.emit("hangup");
  });

  socket.on("disconnect",() => {
    var index = ids.indexOf(socket.username);
    ids.splice(index,1);
  });
});

server.listen(3000)