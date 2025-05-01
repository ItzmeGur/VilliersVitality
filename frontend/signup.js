document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const passwordInput = document.getElementById("newPassword");
  const passwordStrength = document.getElementById("passwordStrength");
  const showPasswordCheckbox = document.getElementById("showPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

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

    passwordStrength.textContent = result.text;
    passwordStrength.style.color = result.color;
  });

  showPasswordCheckbox.addEventListener("change", () => {
    const type = showPasswordCheckbox.checked ? "text" : "password";
    passwordInput.type = type;
    confirmPasswordInput.type = type;
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const username = document.getElementById("emailUsername").value.trim();
    const password = passwordInput.value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!firstName || !lastName || !username || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      event.preventDefault();
      return;
    }

    const email = username + "@villiers.ealing.sch.uk";

    const data = {
      firstName,
      lastName,
      username,
      email,
      password
    };

    try {
      const response = await fetch("http://localhost:3001/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      let result = {};
      try {
        result = await response.json();
      } catch (e) {
        // JSON parsing failed, possibly empty response
        result = {};
      }

      if (response.ok) {
        alert("Signup successful! You can now log in.");
        window.location.href = "login.html";
      } else {
        // Hide any previous popup
        const emailErrorPopup = document.getElementById("emailErrorPopup");
        if (emailErrorPopup) {
          emailErrorPopup.style.display = "block";
        }
        // Optionally, you can log the error or handle other UI changes here
      }
    } catch (error) {
      alert("Error connecting to server: " + error.message);
    }
  });
});
