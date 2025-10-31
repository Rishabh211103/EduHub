const mongoose=require("mongoose");

const courseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    courseStartDate:{
        type:Date,
        default:Date.now,
        required:true
    },
    courseEndDate:{
        type:Date,
        default:Date.now,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    level:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

module.exports=mongoose.model('Course',courseSchema)