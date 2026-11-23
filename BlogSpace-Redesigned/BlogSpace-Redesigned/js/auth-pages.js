document.addEventListener("DOMContentLoaded", () => {
  const message = document.getElementById("authMessage");
  const showMessage = (text, success = false) => {
    message.textContent = text;
    message.classList.remove("hidden", "success");
    if (success) message.classList.add("success");
  };

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async event => {
      event.preventDefault();
      const button = document.getElementById("registerButton");
      const name = document.getElementById("registerName").value.trim();
      const email = document.getElementById("registerEmail").value.trim().toLowerCase();
      const password = document.getElementById("registerPassword").value;
      const confirm = document.getElementById("confirmPassword").value;
      if (!name || !email || !password || !confirm) return showMessage("Please complete all fields.");
      if (password.length < 8) return showMessage("Your password must contain at least 8 characters.");
      if (password !== confirm) return showMessage("Your passwords do not match.");
      if (!document.getElementById("termsAccepted").checked) return showMessage("Please accept the terms before continuing.");
      button.disabled = true; button.textContent = "Creating account...";
      try {
        const users = BlogAuth.getUsers();
        if (users.some(user => user.email.toLowerCase() === email)) {
          button.disabled = false; button.textContent = "Create account ↗";
          return showMessage("An account with this email already exists. Please sign in.");
        }
        const passwordHash = await BlogAuth.hashPassword(password);
        const user = { id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())), name, email, passwordHash };
        users.push(user);
        localStorage.setItem("blogspace_users", JSON.stringify(users));
        BlogAuth.setCurrentUser(user, false);
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error(error); showMessage(error.message || "Could not create your account.");
        button.disabled = false; button.textContent = "Create account ↗";
      }
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async event => {
      event.preventDefault();
      const button = document.getElementById("loginButton");
      const email = document.getElementById("loginEmail").value.trim().toLowerCase();
      const password = document.getElementById("loginPassword").value;
      button.disabled = true; button.textContent = "Signing in...";
      try {
        const users = BlogAuth.getUsers();
        const user = users.find(account => account.email.toLowerCase() === email);
        if (!user) {
          button.disabled = false; button.textContent = "Sign in ↗";
          return showMessage("We couldn't find an account with that email.");
        }
        const enteredHash = await BlogAuth.hashPassword(password);
        if (enteredHash !== user.passwordHash) {
          button.disabled = false; button.textContent = "Sign in ↗";
          return showMessage("Incorrect password. Please try again.");
        }
        BlogAuth.setCurrentUser(user, document.getElementById("rememberMe").checked);
        window.location.href = "dashboard.html";
      } catch (error) {
        console.error(error); showMessage(error.message || "Could not sign in.");
        button.disabled = false; button.textContent = "Sign in ↗";
      }
    });
    document.getElementById("forgotPassword").addEventListener("click", event => {
      event.preventDefault(); showMessage("Password reset is not available in this frontend demo. Please create a new test account if needed.");
    });
  }
});