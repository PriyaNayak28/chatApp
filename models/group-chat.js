const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const GroupChats = sequelize.define('groupchats', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    chats: {
        type: Sequelize.STRING,
    },
    userName: {
        type: Sequelize.STRING
    },
});
module.exports = GroupChats;