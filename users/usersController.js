const express = require("express");
const User = require("./User");
const router = express.Router();
const bcrypt = require("bcryptjs")
const session = require("express-session")
const adminAuth = require("../middlewares/adminAuth")



router.get("/admin/users", adminAuth, (req,res)=> {
    User.findAll().then(users =>{
        res.render("admin/users/users", {users: users})
    })
})

router.get("/admin/user/create", (req, res)=> {
    res.render("admin/users/createUser")
})

router.post("/user/save", (req, res)=> {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where:{
            email : email
        }
    }).then(user =>{
        if(user === null){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                username: name,
                email: email,
                password: hash

            }).then(() =>{
                console.log("deu errado")
                res.redirect("/admin/users")
            }).catch(err =>{
                console.log("deu errado")
                res.json({name, email, hash})
            })
        }else{
            res.redirect("/admin/user/create")
        }
    })

    

})

router.get("/login", (req,res) =>{

        res.render("admin/users/login")
    
    
})

router.post("/authenticate", (req,res)=> {
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password

    User.findOne({where: {email: email, username: name}}).then(user =>{
        if(user !== null){
            console.log("Email valido")
            var correct = bcrypt.compareSync(password, user.password)
            if(correct){
                req.session.user = {
                    id: user.id,
                    name: user.username,
                    email: user.email
                }
                res.redirect("/admin/users")
            }else{
                res.redirect("/login")
            }
        }else{
            res.redirect("/login")
        }    
    })
})

router.get("/logout", (req, res)=>{
    req.session.user = undefined
    res.redirect("/")
})

module.exports = router