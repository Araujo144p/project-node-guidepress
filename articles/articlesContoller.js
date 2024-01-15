const express = require("express")
const router = express.Router()
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")
const adminAuth = require("../middlewares/adminAuth")



router.get("/admin/article", adminAuth, (req,res)=> {
    Article.findAll({
        include: [{model: Category}]
    }).then((articles) =>{
        res.render("admin/articles", {
            articles: articles
        })    
    })  
});


router.get("/admin/article/new", adminAuth, (req,res)=> {

    Category.findAll().then((categories)=>{{
        res.render("admin/articles/newarticle", {
            categories: categories
        })
    }})
    
});

router.post("/articles/save", (req, res) => {
    var article = req.body.article
    var body = req.body.body
    var category = req.body.category

    Article.create({
        title: article,
        slug: slugify(article),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect("/admin/article")
    })
})

router.post("/articles/delete",(req,res)=> {
    var id = req.body.id;
    if(id != undefined || id != null){
        if(!isNaN(id)){
            Article.destroy({
                where:{
                    id: id
                }
            }).then(() =>{
                res.redirect("/admin/article")
            })

        }else{
            res.redirect("/admin/article")
        }
    }else{
        res.redirect("/admin/article")
    }
})

router.get("/admin/article/edit/:id", adminAuth, (req, res)=>{
    var id = req.params.id;
    Article.findByPk(id).then(articles =>{
        if(articles.id === null || !(!isNaN(id))){
            res.redirect("/admin/article")
           
        }else{
            Category.findAll().then(categories=>{
                    res.render("admin/articles/edit",{
                        articles: articles,
                        categories: categories
                    })
               
            })
        }
    }).catch(err=>{
        res.redirect("/admin/article")
    })
    
})

router.post("/article/upgrade", (req,res)=>{
    var id = req.body.id
    var title = req.body.article
    var body = req.body.body
    var categoryId = req.body.category
    Article.update({title: title, body: body, slug: slugify(title), categoryId: categoryId},{
        where:{
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/article")
    }).catch(err =>{
        res.redirect("/admin/article")
    })

})

router.get("/article/page/:num", adminAuth, (req,res) => {
    var num = req.params.num;

    if(isNaN(num) || num !== '0'){

        var offset = (parseInt(num) -1) *4
        Article.findAndCountAll({
            limit: 4,
            offset: offset,
            order:[
            ['id','DESC']
            ]
        }).then(articles =>{
            var next = true;
            var pagExistente = offset
            
            if(pagExistente >= articles.count){
                res.redirect("/")
            }
        
            if(offset + 4 >= articles.count){
                next = false
            }
            var result = {
                next: next,
                articles: articles,
                num: parseInt(num)
            }
            Category.findAll().then(categories =>{
                res.render("admin/articles/pages", {result: result, categories: categories})
              //  res.json(result)
            })
           
        })
    }else{
        res.redirect("/article/page/1")
    }
    
})

module.exports = router;