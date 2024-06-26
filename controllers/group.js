const messages = require('../models/group-chat')
require('dotenv').config();
const groupsdb = require('../models/group')
const User = require('../models/user');


const usergroupdb = require('../models/group-member');


exports.addgroup = async (req, res, next) => {
    try {

        const gname = req.body.gname;
        const data = await groupsdb.create({
            groupName: gname
        })
        console.log(data.dataValues)
        // res.json({success:true,data:data})
        const grp = data.dataValues.id
        const response = await usergroupdb.create({
            groupId: grp,
            userId: req.user.id,
            isAdmin: true
        })
        // console.log(response)
        res.json({ data: data })

    } catch (e) {
        console.log("err in create group backend", e)
        res.json({ err: e })

    }
}

exports.getgroups = async (req, res) => {
    try {
        const id = req.user.id;
        const data = await usergroupdb.findAll({ where: { userId: id } });
        const groupIds = data.map(item => item.dataValues.groupId);

        const groupsData = await Promise.all(groupIds.map(groupId =>
            groupsdb.findAll({ where: { id: groupId } })
        ));

        const namearr = groupsData.flatMap(group =>
            group.map(ele2 => ele2.dataValues.groupName)
        );

        const idarr = groupsData.flatMap(group =>
            group.map(ele2 => ele2.dataValues.id)
        );

        res.json({ groupNames: namearr, groupId: idarr });
    } catch (err) {
        console.log("error getAllgroupnames", err)
        res.json({ Error: err })
    }
}