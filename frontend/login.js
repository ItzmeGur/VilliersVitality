document.addEventListener("DOMContentLoaded", function () {
    // Slideshow
    let images = document.querySelectorAll(".slideshow-container img");
    let index = 0;

    function changeImage() {
        console.log("Changing image to index:", index);
        images.forEach(img => img.classList.remove("active"));
        images[index].classList.add("active");
        index = (index + 1) % images.length;
    }

    changeImage();
    setInterval(changeImage, 10000);

    // Login Functionality
    const loginContainer = document.querySelector(".login-container");
    if (loginContainer) {
        const inputs = loginContainer.querySelectorAll("input[type='text'], input[type='password']");
        const usernameInput = inputs[0];
        const passwordInput = inputs[1];
        const loginButton = loginContainer.querySelector("button");

        // Error message element
        let errorMessage = loginContainer.querySelector(".error-message");
        if (!errorMessage) {
            errorMessage = document.createElement("p");
            errorMessage.className = "error-message";
            errorMessage.style.color = "red";
            errorMessage.style.marginTop = "10px";
            loginContainer.appendChild(errorMessage);
        }

        loginButton.addEventListener("click", async () => {
            errorMessage.textContent = "";
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                errorMessage.textContent = "Please enter username and password";
                return;
            }

            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem("userRole", data.role);
                    window.location.href = "home.html"; // Redirect regardless of role for now
                } else {
                    errorMessage.textContent = "Login error, please try again.";
                }
            } catch (error) {
                errorMessage.textContent = "Login error, please try again.";
                console.error("Login request failed:", error);
            }
        });

        // Forgot Password Modal Functionality
        const forgotPasswordLink = document.getElementById("forgotPasswordLink");
        const modal = document.getElementById("forgotPasswordModal");
        const closeModalBtn = document.getElementById("closeModal");
        const submitResetBtn = document.getElementById("submitReset");
        const cancelResetBtn = document.getElementById("cancelReset");
        const resetInput = document.getElementById("resetInput");

        if (forgotPasswordLink && modal && closeModalBtn && submitResetBtn && cancelResetBtn && resetInput) {
            forgotPasswordLink.addEventListener("click", (event) => {
                event.preventDefault();
                resetInput.value = "";
                modal.style.display = "block";
                resetInput.focus();
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
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
