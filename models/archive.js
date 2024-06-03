const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Archive = sequelize.define('archives', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    chats: {
        type: Sequelize.STRING,
    },
    groupId: {
        type: Sequelize.INTEGER,
    },
    userId: {
        type: Sequelize.INTEGER,
    },
    userName: {
        type: Sequelize.STRING,
    },


});
module.exports = Archive;