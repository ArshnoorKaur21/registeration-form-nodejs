const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const employeeSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
        min:10
    },
    state:{
        type:String,
        required:true
    },
    ration:{
        type:Number,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})


//here methods tbhi call krte when we have to work with instance fxns
//generating tokens
employeeSchema.methods.generateAuthToken=async function(){
    try {
        console.log(this._id)
        const token=await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)          //id that is at database id object id so apply toString
        console.log(`the token of registers is ${token}`)
        this.tokens=this.tokens.concat({token:token})
        await this.save()
        return  token                                                        //undefined token in apppjs bcz we were not returning anyhting from fxn
    } catch (err) {
       res.send(err)
       console.log(err)   
    }
}


//creating collection
const Register=new mongoose.model('Register',employeeSchema)
module.exports=Register


//this.something is the key stored in db