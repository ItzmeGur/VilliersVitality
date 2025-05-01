document.addEventListener("DOMContentLoaded", () => { // Wait for DOM to load before running script
  const signupForm = document.getElementById("signupForm"); // Signup form element
  const passwordInput = document.getElementById("newPassword"); // Password input field
  const passwordStrength = document.getElementById("passwordStrength"); // Password strength display
  const showPasswordCheckbox = document.getElementById("showPassword"); // Show password checkbox
  const confirmPasswordInput = document.getElementById("confirmPassword"); // Confirm password input

  function checkPasswordStrength(password) { // Check password strength function
    let strength = 0;
    if (password.length >= 8) strength++; // Length check
    if (/[A-Z]/.test(password)) strength++; // Uppercase letter check
    if (/[a-z]/.test(password)) strength++; // Lowercase letter check
    if (/[0-9]/.test(password)) strength++; // Number check
    if (/[^A-Za-z0-9]/.test(password)) strength++; // Special character check

    if (strength === 0) {
      return { text: "Password strength: ", color: "" };
    } else if (strength <= 2) {
      return { text: "Password strength: Weak", color: "red" };
    } else if (strength <= 4) {
      return { text: "Password strength: Medium", color: "orange" };
    } else {
      return { text: "Password strength: Strong", color: "green" };
    }
  }

  // Real-time feedback on password input
  passwordInput.addEventListener("input", (event) => {
    const password = event.target.value;
    const result = checkPasswordStrength(password);

    passwordStrength.textContent = result.text; // Update text
    passwordStrength.style.color = result.color; // Update color
  });

  showPasswordCheckbox.addEventListener("change", () => { // Toggle password visibility
    const type = showPasswordCheckbox.checked ? "text" : "password";
    passwordInput.type = type;
    confirmPasswordInput.type = type;
  });

  signupForm.addEventListener("submit", async (event) => { // Handle form submission
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const username = document.getElementById("emailUsername").value.trim();
    const password = passwordInput.value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!firstName || !lastName || !username || !password || !confirmPassword) { // Validate all fields
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) { // Check password match
      alert("Passwords do not match.");
      event.preventDefault();
      return;
    }

    const email = username + "@villiers.ealing.sch.uk"; // Construct email

    const data = { // Data to send
      firstName,
      lastName,
      username,
      email,
      password
    };

    try {
      const response = await fetch("http://localhost:3001/api/signup", { // Send signup request
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      let result = {};
      try {
        result = await response.json(); // Parse JSON response
      } catch (e) {
        // JSON parsing failed, possibly empty response
        result = {};
      }

      if (response.ok) { // Signup success
        alert("Signup successful! You can now log in.");
        window.location.href = "login.html"; // Redirect to login
      } else {
        // Show email error popup on failure
        const emailErrorPopup = document.getElementById("emailErrorPopup");
        if (emailErrorPopup) {
          emailErrorPopup.style.display = "block";
        }
        // Optionally, log error or handle UI changes here
      }
    } catch (error) {
      alert("Error connecting to server: " + error.message); // Network or other error
    }
  });
});
