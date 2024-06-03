const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const GroupMembers = sequelize.define('groupmembers', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
    }
});
module.exports = GroupMembers;