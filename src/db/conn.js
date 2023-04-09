const mongoose = require('mongoose');

//creates connection and creater newdatabase if not present
mongoose.connect("mongodb://localhost:27017/registrationform",{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("connection successful"))
.catch((err)=>console.log("not connected"))