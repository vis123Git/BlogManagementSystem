const express = require('express');
const user_route = express();
const path = require('path');
const multer = require('multer');

const config = require('../config/config')
const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.use(express.static('public'));

const session = require('express-session')
user_route.use(session({
    secret: config.sessionSecret,
    resave : true,
    saveUninitialized : true
}))

const adminLoginAuth = require('../middelwares/adminLoginAuth')

// const storage = multer.diskStorage({
//     destination : function(req, file, cb){
//         cb(null, path.join(__dirname,'../public/images'), function(err, success){
//             if (err) {
//                 throw err;
//               }
//         });
//     },
//     filename : function(req, file ,  cb){
//         const name = Date.now()+ '-' + file.originalname

//         // console.log("name", name);
//         cb(null,name);
//     }
// });

// const upload = multer({storage:storage});

user_route.set('view engine', 'ejs');
user_route.set('views', './views');

const userController =  require('../controllers/userController');

user_route.get('/login', adminLoginAuth.isLogout, userController.loadLogin);
user_route.get('/logout', adminLoginAuth.isLogin, userController.logout);

user_route.post('/login', userController.verifyLogin);

user_route.get('/profile', userController.profile);
user_route.get('/forget-password', adminLoginAuth.isLogout, userController.forgetPassword)
user_route.post('/forget-password',  userController.forgetPasswordVerify)

user_route.get('/reset-password', adminLoginAuth.isLogout, userController.resetPasswordLoad)
user_route.post('/reset-password', userController.resetPassword)


// user_route.get('/blog-setup', adminController.blogSetup);


// user_route.post('/blog-setup', upload.single("blog_image"), adminController.blogSetupSave);




module.exports = user_route
















