const Sequelize = require("sequelize");

const connection = new Sequelize('guidepress', 'root', '123456789',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});



module.exports = connection;