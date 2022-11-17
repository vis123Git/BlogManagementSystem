const express = require('express');
const app = express();
const PORT = 5100;
const mongoose = require('mongoose');

var http = require('http').createServer(app)
var { Server, Socket } = require('socket.io')
var io = new Server(http, {})



// MONGOOSE CONNECTION
mongoose.connect("mongodb://127.0.0.1:27017/BMS").then(() => {
    console.log("Database connect");
});


//middelware
const isBlog = require('./middelwares/isBlog')
app.use(isBlog.isBlog)


//admin routes
const admin_route = require('./routes/adminRoute')
app.use('/', admin_route)

//user routes
const user_route = require('./routes/userRoute')
app.use('/', user_route)

//blog routes
const blogRoute = require('./routes/blogRoutes');
app.use('/', blogRoute)


io.on("connection", function (socket) {
    console.log("user connected");

    socket.on("new_post", function (formData) {
        // console.log("formData===", formData);
        socket.broadcast.emit("new_post", formData)
    });


    socket.on("new_comment", function (comment) {
        // console.log("comment===", comment);
        io.emit("new_comment", comment)
    });


    socket.on("new_reply", function (reply) {
        console.log("reply===", reply);
        io.emit("new_reply", reply)
    });

    socket.on("delete_post", function (postId) {
        console.log("postId===", postId);
        socket.broadcast.emit("delete_post", postId)
    });
})

//Listen server with http and socket.io
http.listen(PORT, () => {
    console.log(`Sever is listening to port ${PORT}`);
})


//Listen with express server
// app.listen(PORT, ()=> {
//     console.log(`Sever is listening to port ${PORT}`);
// })

