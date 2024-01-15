const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const session = require("express-session")

const connection = require("./database/database")


const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesContoller")
const usersController = require("./users/usersController")

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");


// view engine
app.set('view engine', 'ejs');

// static
app.use(express.static('public'));

// body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// session
app.use(
    session({
    secret: "aaaooiii",
    cookie:{secure: false},
    resave: false,
    saveUninitialized: true
    })
)

connection
    .authenticate()
    .then(()=>{
        console.log("back-end is running!")
    }).catch((err)=>{
        console.log(err)
    })


app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);


app.get("/", (req, res)=> {
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit: 4
    }).then((articles) =>{
        Category.findAll().then(categories =>{
            res.render("index",{
                articles:articles,
                categories: categories
            });
        }) 
    })
});

app.get("/:slug", (req, res)=> {
    var slug = req.params.slug;
    Article.findOne({
        where : {
            slug: slug
        }
    }).then((article) => {
        Category.findAll().then(categories =>{
            if(slug != undefined){
                res.render("article",{
                    article: article,
                    categories: categories 
                })
            }
            else{
                res.redirect("/")
            }
        })
    }).catch(err =>{
        res.redirect("/")
    })
})

app.get("/category/:slug", (req,res) =>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug: slug
        },
        include:[{model: Article}]
    }).then(category =>{
        if(slug != undefined || slug != null){
        Category.findAll().then(categories =>{
            res.render("index",{
                articles: category.articles,
                categories: categories
            })
        })
    }else{
        res.redirect("/")
    }
    })
})
 

app.listen("8080", ()=>{
    console.log("Server is running!");
})