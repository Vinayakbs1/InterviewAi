import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
    
    // Add any other fields you want to store in the user model here.
});
const User = mongoose.model('User',userSchema);
export default User;