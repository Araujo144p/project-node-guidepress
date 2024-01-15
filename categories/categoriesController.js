const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")



router.get("/admin/categories/new", adminAuth, (req,res)=> {
    res.render("admin/categories/newcategory")
});

router.post("/categories/save", (req, res) =>{
    var category = req.body.category;
    if(!category || category.length <3){
            console.log("if funcionou" + category)
            res.redirect("/admin/categories/new")
    }else{
        console.log("else funcionou ")
        Category.create({
            title: category,
            slug: slugify(category)
        }).then(() =>{
            res.redirect("/admin/categories")
        })
    }
})

router.get("/admin/categories", adminAuth, (req,res)=> {
    Category.findAll().then(categories =>{
        console.log(categories)
         res.render("admin/categories",{categories: categories})
    })
});

router.post("/categories/delete",(req,res)=> {
    var id = req.body.id;
    if(id != undefined || id != null){
        if(!isNaN(id)){
            Category.destroy({
                where:{
                    id: id
                }
            }).then(() =>{
                res.redirect("/admin/categories")
            })

        }else{
            res.redirect("/admin/categories")
        }
    }else{
        res.redirect("/admin/categories")
    }
})

router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/categories")
    }

    Category.findByPk(id).then(categories => {
        res.render("admin/categories/edit",{categories: categories})   
    })
});

router.post("/categories/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    Category.update({title: title, slug: slugify(title)},{
        where:{
            id: id
        }
    }).then(()=>{
        res.redirect("/admin/categories")
    })
})

module.exports = router;