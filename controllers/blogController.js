const Post =require('../models/postModel');
const Setting = require('../models/settingModel');

const {ObjectID, ObjectId} = require('mongodb');
const config = require('../config/config')
const nodemailer = require('nodemailer')


const sendCommentMail = async(name, email, post_id)=> {
    try {
        const transporter = nodemailer.createTransport({
            host : 'smtp.gmail.com',
            port :587,
            secure :false,
            requireTLS : true,
            auth : {
                user : config.emailUser,
                pass : config.emailPassword
            }
        });

        const mailOptions = { 
            from : 'BMS',
            to :  email,
            subject :"New Reply",
            html : '<p>' +name+', has replied to your comment. <a href="http://localhost:5100/post/'+ post_id+'">Read new comments</a></p>'
        }

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log("Email has been sent.", info.response);
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}

const loadBlog = async(req, res)=>{
    try {
        var setting = await Setting.findOne({});
        var limit = setting.post_limit
        const posts = await Post.find({}).limit(limit);
        res.render('blog', {
           posts:posts,
           postLimit : limit
        
        });
    } catch (error) {
        console.log(error);
    }
}


const loadPost = async(req,res)=> {
    try {
        const post = await Post.findOne({_id:req.params.id});
        // console.log("post===",post);
        res.render('post', {post:post});
    } catch (error) {
        console.log(error);
    }
}

const addComment = async(req,res)=>{
    try {
        const post_id = req.body.post_id
        const username = req.body.username
        const email = req.body.email
        const comment = req.body.comment

        var comment_id = new ObjectID()
        console.log("post_id===",post_id);
        console.log("username===",username);
        console.log("comment===",comment);

        await Post.findByIdAndUpdate({_id:post_id}, {
            $push: {
                "comments": {_id:comment_id,username:username, email:email,comment:comment}
            }
        })
        res.status(200).send({success:true, message:"Comment added successfuly", _id:comment_id})
    } catch (error) {
        res.status(200).send({success:false, message:error.message})
    }
}


const doReply =  async(req, res)=> {
    try {
        console.log("doReply call---");
        var reply_id = new ObjectID();
        await Post.updateOne({
            "_id" : ObjectID(req.body.post_id),
            "comments._id": ObjectID(req.body.comment_id),
        },{
            $push : {
                "comments.$.replies": {_id:reply_id, name:req.body.name, reply:req.body.reply}
            }
        })
        sendCommentMail(req.body.name, req.body.comment_email, req.body.post_id)
        res.status(200).send({success:true, message:"Reply added", _id:reply_id})


        
    } catch (error) {
        res.status(200).send({success:false, message:error.message})
    }
}


 
const getPosts = async(req, res)=>{
    try {
       
        const posts = await Post.find({}).skip(req.params.start).limit(req.params.limit);
        res.send(posts)
        
    } catch (error) {
        res.status(200).send({success:false, message:error.message})
    }
}


module.exports = { 
    loadBlog,
    loadPost,
    addComment,
    doReply,
    getPosts
}