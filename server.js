const path = require('path');


const express = require('express');
const bodyParser = require('body-parser');
const cron = require("node-cron")


const sequelize = require('./util/database');

const User = require('./models/users.js');
const Group = require('./models/group.js');
const GroupChat = require('./models/groupchat.js');
const GroupMember = require('./models/groupmember.js');
const Archive = require('./models/archive.js');


var cors = require('cors');

const app = express();

const dotenv = require('dotenv');

// get config vars
dotenv.config();


app.use(cors());

app.set('views', 'views');

const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const messageRoutes = require('./routes/messages');



app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use('/messages', messageRoutes);



app.use((req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, `views/${req.url}`));
})



User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

Group.hasMany(GroupChat);
GroupChat.belongsTo(Group);

User.hasMany(GroupChat);
GroupChat.belongsTo(User);


sequelize.sync()
    .then(result => {
        // console.log(result);
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });

cron.schedule('*/10 * * * *', async () => {
    console.log('This runs every 10 minute');
    const response = await GroupChat.findAll()
    for (let i = 0; i < response.length; i++) {
        const data = await Archive.create({
            chats: response[i].dataValues.chats,
            userId: response[i].dataValues.userId,
            groupId: response[i].dataValues.groupId,
            userName: response[i].dataValues.userName
        })
        await GroupChat.destroy({ where: { id: response[i].dataValues.id } })
    }

});