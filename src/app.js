require('dotenv').config()
const express=require('express')
const path=require('path')
const hbs=require('hbs')
const jwt=require('jsonwebtoken')
const cookieparser=require('cookie-parser')
// const auth=require('./middleware/auth')

const app=express()
const port=process.env.port|| 3000
const hostname = 'localhost'
const conn=require("./db/conn")
const Register=require('./models/registers')
const { json }=require('express')
const { log }=require('console')


const static_path=path.join(__dirname,"../public")
const template_path=path.join(__dirname,"../templates/views")
const partials_path=path.join(__dirname,"../templates/partials")


app.use(express.static(static_path))
app.use(cookieparser()) //using as middleware
app.set("view engine","hbs")
app.set("views",template_path)
hbs.registerPartials(partials_path)

app.use(express.json())
app.use(express.urlencoded({extended:false}))


console.log(process.env.SECRET_KEY)
app.get("/",(req,res)=>{
    res.render("register")
})
//creating new user  in db
app.post('/',async(req,res)=>{
    try {
        // console.log(req.body.name)//that i am putting while registering on form
        // res.send(req.body.name) registeremploye is instance of register

        const registeremployee=new Register({
            name:req.body.name,
            email:req.body.email,
            address:req.body.address,
            phone:req.body.phone,
            state:req.body.state,
            ration:req.body.ration
        })

        //miidleware before saving user and after registering on db we have to generate token , register employee is instance of collection
        const token=await registeremployee.generateAuthToken() 
        console.log('token register is '+token)

        //stroing token in cookies 
        res.cookie("jwt",token,{
            // expires:new Date(Date.now()+30000),
            httpOnly:true 
        })

        const registered=await registeremployee.save();
        console.log('registered data is '+registered)
        res.status(201).render('login')

    } catch (err) {
        res.status(400).send(err)
    }
})
//login page
app.get('/login',async(req,res)=>{
    try {
        res.status(201).render('verify')

    } catch (err) {
        res.status(400).send(err)
    }
})

//verify page
app.post('/verify',async(req,res)=>{
    try {
        const email=req.body.email
        const ration=req.body.ration
        // console.log(`email is ${email} and ration is ${ration}`)
        const useremail=await Register.findOne({email:email})//1st is db email and second that we are regsitering
        
        const tokenverify=await useremail.generateAuthToken() 
        console.log('token verify is ',tokenverify)
        res.cookie("jwt",tokenverify,{
            // expires:new Date(Date.now()+70000),
            httpOnly:true 
            // secure:true
            //cookie value will only run in secure connection
        
        })
        console.log(`this is cookie token value ${req.cookies.jwt}`)
        
        const gettoken=req.cookies.jwt
        if(useremail.ration==ration)
        {
            if(jwt.verify(gettoken,process.env.SECRET_KEY))
            {
                res.render('hospital')
                console.log('verifcation done')
                // const user=await Register.findOne({_id:verify._id})
                // console.log(user)
            }
            else{
                console.log('cant verify')
            }
        }
        else{
            res.send("You are not verified for the process")
        }
        
    } catch (err) {
     res.status(400).send(err)   
    }
})

app.get('/hospital',(req,res)=>{
    res.render('hospital')
})
app.post('/hospital',(req,res)=>{
    try{
        res.status(201).render('bill')

    }catch(err){
        res.status(400).send(err)   
    }
})

app.get('/bill',(req,res)=>{
    res.render('wallet')
})
//hospital page
// app.get('/hospital',auth,(req,res)=>{
//     console.log(`this is cookie value ${req.cookies.jwtcookie}`) 
//     res.render('hospital')
// })
app.listen(port,hostname,()=>{
    console.log("listening on port")
})