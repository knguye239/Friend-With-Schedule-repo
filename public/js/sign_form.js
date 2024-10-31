document.addEventListener("DOMContentLoaded", function() {
    // Toggle password visibility
    togglePasswordVisibility("checkEye1", "password1");
    togglePasswordVisibility("checkEye2", "password2");

    // Add form validation on submission
    document.querySelector('form').addEventListener('submit', validateForm);
});

// eye function
function togglePasswordVisibility(checkEyeId, passwordId) {
    var checkEye = document.getElementById(checkEyeId);
    var password = document.getElementById(passwordId);

    checkEye.addEventListener("click", function(e){
        if(e.target.classList.contains('bxs-show')){
            e.target.classList.remove('bxs-show');
            e.target.classList.add('bxs-hide');
            password.setAttribute('type', 'text');
        } else {
            password.setAttribute('type', 'password');
            e.target.classList.remove('bxs-hide');
            e.target.classList.add('bxs-show');
        }
    });
}

// signup: validateForm
async function isUsernameAvailable(username) {
    try {
        const response = await fetch('/check-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        const data = await response.json();
        return data.available;
    } catch (error) {
        console.error('Error checking username:', error);
        return false;
    }
}

async function validateForm(event) {
    event.preventDefault();  // Prevent default form submission

    const username = document.getElementById("username").value;
    const password1 = document.getElementById("password1").value;
    const password2 = document.getElementById("password2").value;

    if (!username) {
        alert("Username is required!");
        return;
    }

    if (password1 !== password2) {
        alert("Passwords do not match!");
        return;
    }

    const available = await isUsernameAvailable(username);
    if (!available) {
        alert("Username is already taken!");
        return;
    }

    // Prepare data for POST request to /signup
    const data = {
        username: username,
        password: password1
    };

    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
