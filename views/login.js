// function login(event) {
//     event.preventDefault();

//     const email = event.target.email.value;
//     const password = event.target.password.value;


//     const loginDetails = {
//         email,
//         password
//     }
//     axios.post("http://localhost:5000/user/login", loginDetails)
//         .then((response) => {
//             console.log(response)
//             if (response.status === 200) {
//                 alert(response.data.message)
//                 localStorage.setItem('token', response.data.token)
//                 window.location.href = "./chat.html"
//             } else {
//                 throw new Error(response.data.message)
//             }
//         })
//         .catch((err) => {
//             console.log(err)
//             document.body.innerHTML += `<div style="color: red;">${err}</div>`;
//         })

// }
// function forgotpassword() {
//     window.location.href = "./password.html"
// }


function login(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    const loginDetails = {
        email,
        password
    };

    axios.post("http://localhost:5000/user/login", loginDetails)
        .then((response) => {
            if (response.status === 200) {
                alert(response.data.message);
                localStorage.setItem('token', response.data.token);
                window.location.href = "./chat.html";
            } else {
                throw new Error(response.data.message);
            }
        })
        .catch((err) => {
            console.error(err);
            const errorDiv = document.createElement('div');
            errorDiv.style.color = 'red';
            errorDiv.innerText = err.response ? err.response.data : 'An error occurred. Please try again.';
            document.body.appendChild(errorDiv);
        });
}

function forgotpassword() {
    window.location.href = "./password.html";
}
