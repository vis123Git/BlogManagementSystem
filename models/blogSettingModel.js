const mongoose = require('mongoose');

 const blogSettingSchema = mongoose.Schema({
    blog_title : {
        type : String,
         required : true
    },
    blog_image : {
        type : String,
         required : true
    },
    description : {
        type : String,
         required : true
    }
})

module.exports = mongoose.model('BlogSetting', blogSettingSchema)

