let sendbtn = document.getElementById("send")
let message = document.getElementById("chat")
let managebtn = document.getElementById("manage")
const parent = document.getElementById("allmessages")


sendbtn.onclick = async (e) => {
    try {
        e.preventDefault();
        const groupId = localStorage.getItem("groupId")
        const obj = {
            msg: message.value,
            groupId: groupId
        }
        const token = localStorage.getItem("token")
        const response = await axios.post("http://localhost:5000/messages/add-message", obj, { headers: { 'Authorization': token } })
        console.log(response.data.message.userName,)
        showChatOnScreen(response.data.message.id, response.data.message.userName, response.data.message.chats)

    } catch (e) {
        console.log("error in snding message", e)
    }
}

async function showChatOnScreen(id, name, postmsg) {
    try {
        if (postmsg) {
            let recent = id - 10;
            localStorage.removeItem(recent)
            localStorage.setItem(id, postmsg)
            window.location.reload();
        }
        const token = localStorage.getItem("token")
        const decodeToken = parseJwt(token)


        const user = decodeToken.name;
        console.log('Username:', user);

        const msg = localStorage.getItem(id)
        const parent = document.getElementById("allmessages")
        const child = document.createElement('div');
        child.innerHTML = `<p id="username">~ ${name}</p>${msg}`;
        child.classList.add('message');
        if (`${name}` === user) {
            child.classList.add('your-message')
        }
        else {
            child.classList.add('other-message')
        }
        parent.appendChild(child)
        // const child=`<li>${name}:${msg}</li><br>`
        // parent.innerHTML=parent.innerHTML+child

    } catch (e) {
        console.log("error in showchatonscreen", e)
    }
}



function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// window reload code

window.addEventListener("DOMContentLoaded", async () => {

    try {
        const groupId = localStorage.getItem("groupId")
        const response = await axios.get("http://localhost:5000/messages/get-messages", { headers: { "Authorization": groupId } })

        const showData = response.data.allData;



        //  console.log(showData[1].userName)
        if (showData.length <= 10) {
            for (let i = 0; i < 10; i++) {
                localStorage.setItem(showData[i].id, showData[i].chats)
                showChatOnScreen(showData[i].id, showData[i].userName)

            }
        } else {
            for (let i = showData.length - 10; i < showData.length; i++) {
                localStorage.setItem(showData[i].id, showData[i].chats)
                showChatOnScreen(showData[i].id, showData[i].userName)
            }


        }

    } catch (err) {
        console.log("dom loading error in messages", err)
    }


})







managebtn.onclick = async function manageMembers(e) {
    try {
        e.preventDefault()
        parent.style.display = "none"
        document.getElementById('showMembers').style.display = 'block'
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:5000/messages/getuser", {
            headers: { "Authorization": token }
        })
        const members = document.getElementById("alreadyMember")
        const userDetails = response.data.allUser
        console.log(userDetails.length)

        let arr1 = []
        for (let i = 0; i < userDetails.length; i++) {
            arr1.push(userDetails[i].id)
        }
        const result = await axios.get("http://localhost:5000/messages/allusers", {
            headers: { "Authorization": token }
        })
        let arr2 = []
        console.log(result)
        const users = result.data.allUser
        for (let i = 0; i < users.length; i++) {
            arr2.push(users[i].id)
        }
        const mergeArray = [...arr1, ...arr2]
        let map = new Map()
        mergeArray.forEach((ele) => {
            if (map.get(ele) === undefined) {
                map.set(ele, 1)
            } else {
                map.set(ele, 2)
            }
        })
        const membersArray = []
        const addMembersArray = []
        for (let [key, value] of map) {
            if (value === 1) {
                addMembersArray.push(key)
            } else {
                membersArray.push(key)
            }
            const adminDetails = response.data.isAdmin
            console.log("admin details--.", adminDetails)

            members.innerHTML = ""

            const adminArray = []
            adminDetails.forEach((ele) => {
                if (ele.isAdmin === true) {
                    adminArray.push(ele.userId)
                }
            })

            const mergeArrayForAdmin = [...membersArray, ...adminArray]

            let map2 = new Map()
            mergeArrayForAdmin.forEach((ele) => {
                if (map2.get(ele) === undefined) {
                    map2.set(ele, 1)
                } else {
                    map2.set(ele, 2)
                }
            })

            const adminAccess = []
            const adminReject = []
            for (let [key, value] of map2) {
                if (value === 2) {
                    adminAccess.push(key)
                } else {
                    adminReject.push(key)
                }
            }
            const tokenId = localStorage.getItem("token")
            const decodeToken = parseJwt(tokenId)

            const parentUser = document.getElementById("members")
            parentUser.innerHTML = ""


            //add members
            for (let i = 0; i < adminAccess.length; i++) {
                if (adminAccess[i] === decodeToken.userId) {
                    for (let i = 0; i < addMembersArray.length; i++) {
                        const child = `<li>${users[addMembersArray[i] - 1].name}
                   <button onclick="addMember(${users[addMembersArray[i] - 1].id})" class="btn btn-success btn-sm" style="float:right">add</button></li><br>`
                        parentUser.innerHTML = parentUser.innerHTML + child
                    }
                }
                //   else{
                //       for(let i=0;i<addMembersArray.length;i++){
                //           const child=`<li ${users[addMembersArray[i]-1].id}>${users[addMembersArray[i]-1].name}</li><br>`
                //           parentUser.innerHTML+=child 
                //       }
                //   }
            }
            //members
            for (let i = 0; i < adminAccess.length; i++) {
                if (adminAccess[i] === decodeToken.userId) {
                    for (let i = 0; i < membersArray.length; i++) {
                        if (membersArray[i] === decodeToken.userId) {
                            const child = `<li>${users[membersArray[i] - 1].name}</li><br>`
                            members.innerHTML += child
                        } else {
                            const child = `<li id="${users[membersArray[i] - 1].id}">${users[membersArray[i] - 1].name}
                    <button onclick="removeMember(${users[membersArray[i] - 1].id})" class="btn btn-danger btn-sm" style="float:right">remove</button>
                    <button onclick="addAdmin(${users[membersArray[i] - 1].id})"  id="adminbtn" class="btn btn-primary btn-sm" style="float:right">Add as Admin</button>
                    </li><br>`
                            members.innerHTML += child
                        }
                    }
                }


            }
            for (let i = 0; i < adminReject.length; i++) {
                if (adminReject[i] === decodeToken.userId) {
                    for (let i = 0; i < membersArray.length; i++) {
                        if (membersArray[i] === decodeToken.userId) {
                            const child = `<li>${users[membersArray[i] - 1].name}</li><br>`
                            members.innerHTML += child
                        }
                        else {
                            const child = `<li id="${users[membersArray[i] - 1].id}">${users[membersArray[i] - 1].name}

                        </li><br>`
                            members.innerHTML += child
                        }

                    }
                }
                //   else{
                //      for(let i=0;i<membersArray.length;i++){
                //          const child=`<li ${users[membersArray[i]-1].id}>${users[membersArray[i]-1].name}</li><br>`
                //          members.innerHTML+=child 
                //     }
                //  }
            }

        }
    }
    catch (e) {
        console.log("error in manage members", e)
    }
}

document.getElementById("back").onclick = () => {
    document.getElementById("showMembers").style.display = "none"
    parent.style.display = "block"
    window.location.href = "./message.html"

}

async function addMember(id) {
    console.log(id)
    const groupId = localStorage.getItem("groupId")
    const obj = {
        userId: id,
        groupId: groupId
    }
    document.getElementById('showMembers').style.display = 'none'
    const response = await axios.post("http://localhost:5000/messages/addToGroup", obj)

    window.location.reload()

    confirm("User added successfully...")
}

async function removeMember(id) {
    try {
        const groupId = localStorage.getItem("groupId")
        const obj = {
            userId: id,
            groupId: groupId
        }
        console.log(obj)
        const members = document.getElementById("alreadyMember")
        const child = document.getElementById(id)
        if (confirm("Do you want to remove this user?")) {
            members.removeChild(child)
            // confirm("Do you want to remove this user?")
            const response = await axios.post("http://localhost:5000/messages/removeMember", obj)
            window.location.reload()
        } else {
            window.location.reload()
        }

    } catch (e) {
        console.log("error in remove member dom")
    }

}
async function addAdmin(id) {
    try {

        const groupId = localStorage.getItem("groupId")
        const obj = {
            userId: id,
            groupId: groupId
        }
        console.log(obj)
        var btn = document.getElementById('adminbtn');
        btn.style.display = 'none';

        const members = document.getElementById("alreadyMember")
        const child = document.getElementById(id)
        //members.innerHTML='';
        if (confirm("Do you want to add as admin ?")) {

            const response = await axios.post("http://localhost:5000/messages/addAdmin", obj)
            window.location.reload()

        } else {
            window.location.reload()
        }


    } catch (e) {
        console.log("error in remove member dom")
    }

}

