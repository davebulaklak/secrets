require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const e = require("express");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));



app.use(session({
    secret: "ThisIsBascicallyYourEncryptionKey.",
    resave: false,
    saveUninitialized: false
  }));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.LOCAL_HOST, { useNewUrlParser: true,useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

userSchema = new mongoose.Schema({
    username    :   String,
    password    :   String
});

userSchema.plugin(passportLocalMongoose);

User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req, res){
    res.render("home");
});

app.get("/register",function(req, res){
    res.render("register");
});

app.get("/secrets",function(req, res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
});

app.post("/register",function(req, res){
    User.register({username:req.body.username, active: false}, req.body.password, function(err, user) {
        if (err) {
            console.log("Error :" + err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res,function(){
                res.redirect("/secrets");
            });
        }
       
      });
});

app.get("/login",function(req, res){
    res.render("login");
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

app.post("/login",function(req, res){
    const user = new User({
        username : req.body.username,
        password : req.body.password
    });

    req.login(user,function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
