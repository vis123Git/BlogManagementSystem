const BlogSetting = require('../models/blogSettingModel')
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const { use } = require('../routes/adminRoute')
const Post = require('../models/postModel')

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10,)
        return passwordHash;
    } catch (error) {
        console.log(error);
    }
}




const blogSetup = async (req, res) => {
    try {
        const blogSetting = await BlogSetting.find({});
        if (blogSetting.length > 0) {
            res.redirect('login')
        } else {
            res.render('blogSetup')
        }
    } catch (error) {
        console.log(error);
    }
}


const blogSetupSave = async (req, res) => {
    try {


        console.log("blogSetupSave called");
        const blog_title = req.body.blog_title
        const blog_image = req.file.filename
        const description = req.body.description
        const email = req.body.email
        const name = req.body.name
        const password = await securePassword(req.body.password)


        const blogSetting = new BlogSetting({
            blog_title: blog_title,
            blog_image: blog_image,
            description: description
        })
        await blogSetting.save();

        const user = new User({
            name: name,
            email: email,
            password: password,
            is_admin: 1
        })


        const userData = await user.save();
        if (userData) {
            res.redirect('/login')
        } else {
            res.render('blogSetup', { message: 'Blog not setup properly' })
        }

    } catch (error) {
        console.log(error);
    }
}


const dashboard = async (req, res) => {
    try {
        res.render('admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}



const loadPostDashboard = async (req, res) => {
    try {
        res.render('admin/postDashboard')
    } catch (error) {
        console.log(error);
    }
}


const addPost = async (req, res) => {
    try {
        var image = '';
        if(req.body.image !== undefined){
            image = req.body.image
        }
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            image : image
            

        })
        const postData = await post.save()

        res.render('admin/postDashboard', {message:"Post added sucessfuly."})

    } catch (error) {
        console.log(error.message);
    }
}

const uploadPostImage= async(req,res)=> {
    try {
        var imagePath = '/images'
        imagePath = imagePath+'/'+req.file.filename
        res.send({success:true, message:"Post image upload successfuly", path:imagePath})

    } catch (error) {
         res.send({success:false, message:error.message})
    }
}

module.exports = {
    blogSetup,
    blogSetupSave,
    securePassword,
    dashboard,
    loadPostDashboard,
    addPost,
    uploadPostImage,
}