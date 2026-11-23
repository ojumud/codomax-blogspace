/* BlogSpace demo authentication. Not suitable for production security. */
(function () {
  const USERS_KEY = "blogspace_users";
  const LOCAL_USER_KEY = "blogspace_currentUser";
  const SESSION_USER_KEY = "blogspace_currentUser";

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
    catch { return []; }
  }

  async function hashPassword(password) {
    if (!window.crypto || !crypto.subtle) {
      throw new Error("Password hashing requires localhost or HTTPS. Open this project with Live Server.");
    }
    const bytes = new TextEncoder().encode(password);
    const hash = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  function getCurrentUser() {
    try {
      const raw = sessionStorage.getItem(SESSION_USER_KEY) || localStorage.getItem(LOCAL_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function setCurrentUser(user, remember) {
    sessionStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(LOCAL_USER_KEY);
    const safeUser = { id: user.id, name: user.name, email: user.email };
    (remember ? localStorage : sessionStorage).setItem(SESSION_USER_KEY, JSON.stringify(safeUser));
  }

  function logout() {
    sessionStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(LOCAL_USER_KEY);
    window.location.href = "login.html";
  }

  function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
      window.location.replace("login.html");
      return null;
    }
    return user;
  }

  function updateUserUI() {
    const user = getCurrentUser();
    if (!user) return;
    const name = user.name || "Writer";
    const initials = name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
    document.querySelectorAll("#topbarName").forEach(el => el.textContent = name);
    document.querySelectorAll("#welcomeName").forEach(el => el.textContent = name.split(/\s+/)[0]);
    document.querySelectorAll("#userInitials").forEach(el => el.textContent = initials || "W");
    const guest = document.getElementById("guestLinks");
    const signed = document.getElementById("userLinks");
    if (guest) guest.classList.add("hidden");
    if (signed) signed.classList.remove("hidden");
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-logout]").forEach(button => button.addEventListener("click", logout));
    if (document.body.dataset.protected === "true") {
      const user = requireAuth();
      if (!user) return;
      updateUserUI();
    } else {
      updateUserUI();
    }
  });

  window.BlogAuth = { getUsers, hashPassword, getCurrentUser, setCurrentUser, logout, requireAuth, updateUserUI };
})();