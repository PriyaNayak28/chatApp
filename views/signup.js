// function signup(event) {
//     event.preventDefault();

//     const name = event.target.name.value;
//     const email = event.target.email.value;
//     const phone = event.target.phone.value;
//     const password = event.target.password.value;


//     const signupDetails = {
//         name,
//         email,
//         phone,
//         password
//     }
//     axios.post("http://localhost:5000/user/signup", signupDetails)
//         .then((response) => {
//             console.log(response)
//             if (response.status === 201) {
//                 window.location.href = "./login.html"
//             } else {
//                 throw new Error('Failed to login')
//             }
//         })
//         .catch((err) => {
//             console.log(err)
//             document.body.innerHTML += `<div style="color: red;">${err}</div>`;
//         })

// }







function signup(event) {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;

    const signupDetails = {
        name,
        email,
        phone,
        password
    };

    axios.post("http://localhost:5000/user/signup", signupDetails)
        .then((response) => {
            if (response.status === 201) {
                window.location.href = "./login.html";
            } else {
                throw new Error('Failed to sign up');
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
