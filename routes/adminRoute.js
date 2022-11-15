
const express = require('express');
const admin_route = express();
const path = require('path');

const multer = require('multer');

const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.use(express.static('public'));


const config = require('../config/config')

const session = require('express-session')
admin_route.use(session({
    secret: config.sessionSecret,
    resave : true,
    saveUninitialized : true
}))

const adminLoginAuth = require('../middelwares/adminLoginAuth')

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, path.join(__dirname,'../public/images'), function(err, success){
            if (err) {
                throw err;
              }
        });
    },
    filename : function(req, file ,  cb){
        const name = Date.now()+ '-' + file.originalname

        // console.log("name", name);
        cb(null,name);
    }
});

const upload = multer({storage:storage});

admin_route.set('view engine', 'ejs');
admin_route.set('views', './views');

const adminController =  require('../controllers/adminController');

admin_route.get('/blog-setup', adminController.blogSetup);


admin_route.post('/blog-setup', upload.single("blog_image"), adminController.blogSetupSave);
admin_route.get('/dashboard',adminLoginAuth.isLogin, adminController.dashboard);

admin_route.get('/create-post',adminLoginAuth.isLogin, adminController.loadPostDashboard);
admin_route.post('/create-post',adminLoginAuth.isLogin, adminController.addPost);

admin_route.post('/upload-post-image',adminLoginAuth.isLogin, upload.single("image"), adminController.uploadPostImage);








module.exports = admin_route