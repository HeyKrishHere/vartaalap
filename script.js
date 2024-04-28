// script.js
document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    if (data.success) {
        document.getElementById("signupMessage").innerText = "Signup successful!";
    } else {
        document.getElementById("signupMessage").innerText = data.message;
    }
});

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.success) {
        document.getElementById("loginMessage").innerText = "Login successful!";
        window.location.href = "http://localhost:3030/action.html";
        document.getElementById('signInBtn').innerHTML = "Hello, " + username + "!";
    } else {
        document.getElementById("loginMessage").innerText = data.message;
    }
});

document.getElementById('showSignup').addEventListener('click', function() {
    document.getElementById('signupFormContainer').style.display = 'block';
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('showLogin').style.display = 'block';
    document.getElementById('showSignup').style.display = 'none';
  });
  
  document.getElementById('showLogin').addEventListener('click', function() {
    document.getElementById('signupFormContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('showSignup').style.display = 'block';
    document.getElementById('showLogin').style.display = 'none';
  });

  window.onload = function() {
    Particles.init({
      selector: '.background'
    });
  };
