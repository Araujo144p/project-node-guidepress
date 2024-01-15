const Sequelize = require('sequelize');
const connection = require('../database/database')

const User = connection.define('user',{
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },password:{
        type: Sequelize.STRING,
        allowNull: false
    },username:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

//User.sync({force: false})

module.exports = User;