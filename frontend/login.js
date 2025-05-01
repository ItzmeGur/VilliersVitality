document.addEventListener("DOMContentLoaded", function () { // Wait for DOM to load before running script
    // Slideshow
    let images = document.querySelectorAll(".slideshow-container img"); // Select all slideshow images
    let index = 0; // Current image index

    function changeImage() { // Change visible image in slideshow
        console.log("Changing image to index:", index);
        images.forEach(img => img.classList.remove("active")); // Remove active class from all images
        images[index].classList.add("active"); // Add active class to current image
        index = (index + 1) % images.length; // Increment index cyclically
    }

    changeImage(); // Initial image display
    setInterval(changeImage, 10000); // Change image every 10 seconds

    // Login Functionality
    const loginContainer = document.querySelector(".login-container"); // Login form container
    if (loginContainer) {
        const inputs = loginContainer.querySelectorAll("input[type='text'], input[type='password']"); // Username and password inputs
        const usernameInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = loginContainer.querySelector("button"); // Login button

        // Error message element
        let errorMessage = loginContainer.querySelector(".error-message"); // Existing error message element
        if (!errorMessage) { // Create if not present
            errorMessage = document.createElement("p");
            errorMessage.className = "error-message";
            errorMessage.style.color = "red";
            errorMessage.style.marginTop = "10px";
            loginContainer.appendChild(errorMessage);
        }

        loginButton.addEventListener("click", async () => { // Handle login button click
            errorMessage.textContent = ""; // Clear previous error
            const username = usernameInput.value.trim(); // Get username
            const password = passwordInput.value.trim(); // Get password

            if (!username || !password) { // Validate inputs
                errorMessage.textContent = "Please enter username and password";
                return;
            }

            try {
                const response = await fetch("/api/login", { // Send login request
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) { // Successful login
                    const data = await response.json();
                    localStorage.setItem("userRole", data.role); // Store user role
                    window.location.href = "home.html"; // Redirect to home
                } else {
                    errorMessage.textContent = "Login error, please try again."; // Show error
                }
            } catch (error) {
                errorMessage.textContent = "Login error, please try again."; // Show error on fetch failure
                console.error("Login request failed:", error);
            }
        });

        // Forgot Password Modal Functionality
        const forgotPasswordLink = document.getElementById("forgotPasswordLink"); // Forgot password link
        const modal = document.getElementById("forgotPasswordModal"); // Modal element
        const closeModalBtn = document.getElementById("closeModal"); // Close button
        const submitResetBtn = document.getElementById("submitReset"); // Submit reset button
        const cancelResetBtn = document.getElementById("cancelReset"); // Cancel reset button
        const resetInput = document.getElementById("resetInput"); // Email input

        if (forgotPasswordLink && modal && closeModalBtn && submitResetBtn && cancelResetBtn && resetInput) {
            forgotPasswordLink.addEventListener("click", (event) => { // Show modal on link click
                event.preventDefault();
                resetInput.value = ""; // Clear input
                modal.style.display = "block"; // Show modal
                resetInput.focus(); // Focus input
            });

            // Close modal on X
            closeModalBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });

            // Close modal on cancel
            cancelResetBtn.addEventListener("click", () => {
                modal.style.display = "none";
            });

            // Close modal if clicking outside
            window.addEventListener("click", (event) => {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            });

            // Handle reset
            submitResetBtn.addEventListener("click", () => {
                const email = resetInput.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex

                if (!email) {
                    alert("Please enter your email to reset your password.");
                    resetInput.focus();
                } else if (!emailRegex.test(email)) {
                    alert("Please enter a valid email address.");
                    resetInput.focus();
                } else {
                    alert("Please contact your admin to change password, thanks");
                    modal.style.display = "none";
                }
            });
        }
    }
});
