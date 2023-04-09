const jwt=require('jsonwebtoken')
const Register=require('../models/registers')

const auth=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt
        console.log('middleware token value is ',token)
        //comparing token that user login krne pr jo token uske db pr store hai and  the token value that we are getting at the chrome page(1st time login)
        const verify=jwt.verify(token,process.env.SECRET_KEY)
        console.log(verify)
        const user=await Register.findOne({_id:verify._id})
        return token
        next()
    }catch(err){
        res.status(401).send(err)
    }
}

module.exports=auth