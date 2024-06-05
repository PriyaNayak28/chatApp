
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cron = require("node-cron");
const sequelize = require('./util/database');
const User = require('./models/user.js');
const Group = require('./models/group.js');
const GroupChat = require('./models/groupchat.js');
const GroupMember = require('./models/groupmember.js');
const Archive = require('./models/archive.js');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const WebSocket = require('ws');

// get config vars
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.set('views', 'views');

const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const messageRoutes = require('./routes/message');

app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRoutes);
app.use('/group', groupRoutes);
app.use('/messages', messageRoutes);

app.use((req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, `views/${req.url}`));
});

User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

Group.hasMany(GroupChat);
GroupChat.belongsTo(Group);

User.hasMany(GroupChat);
GroupChat.belongsTo(User);

sequelize.sync()
    .then(result => {
        // console.log(result);
        server.listen(5000, () => {
            console.log('Server is listening on port 5000');
        });
    })
    .catch(err => {
        console.log(err);
    });

cron.schedule('*/10 * * * *', async () => {
    console.log('This runs every 10 minutes');
    const response = await GroupChat.findAll();
    for (let i = 0; i < response.length; i++) {
        const data = await Archive.create({
            chats: response[i].dataValues.chats,
            userId: response[i].dataValues.userId,
            groupId: response[i].dataValues.groupId,
            userName: response[i].dataValues.userName
        });
        await GroupChat.destroy({ where: { id: response[i].dataValues.id } });
    }
});

// WebSocket server logic
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received message => ${message}`);
        // Broadcast the message to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
