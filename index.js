const express = require('express');
const app = express();
const PORT = 5100;
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/BMS").then(()=> {
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
const blogRoute = require('./routes/blogRoutes')
app.use('/', blogRoute)



app.listen(PORT, ()=> {
    console.log(`Sever is listening to port ${PORT}`);
})

