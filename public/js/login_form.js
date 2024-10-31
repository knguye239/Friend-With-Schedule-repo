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

// login
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent default form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password1").value;

    const data = {
        username: username,
        password: password
    };

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "schedule.html";  // Redirect to a welcome page or dashboard
        } else {
            alert(data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
