require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");
const e = require("express");
// const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect(process.env.LOCAL_HOST, { useNewUrlParser: true,useUnifiedTopology: true });

userSchema = new mongoose.Schema({
    email   :   String,
    password:   String
});

userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields: ["password"] });

User = mongoose.model("User", userSchema);

app.get("/",function(req, res){
    res.render("home");
});

app.get("/register",function(req, res){
    res.render("register");
});

app.post("/register",function(req, res){
    //console.log(req.body.username + " : " + req.body.password);
    const newUser = new User({email : req.body.username, password : req.body.password});
    newUser.save(function(err){
        if(err){
            res.send("Error: " + err);
        }else{
            res.render("secrets");
        }
    });
});

app.get("/login",function(req, res){
    res.render("login");
});

app.post("/login",function(req, res){
    console.log(req.body.username + " : " + req.body.password);
    const userName = req.body.username;
    const passWord = req.body.password;
    User.findOne({ email: userName }, function (err, user) {
        if(err){
            res.send("ErrorL " + err);
        }else{
            if (user != null && user != ""){
                console.log(user);
                if( passWord === user.password){
                    res.render("secrets");
                }else{
                    res.send("Incorrect password");
                }
               
            }else{
                res.send("User not found.");
            }
        }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
