// src/loginSignup.js
import { signupUser, loginUser } from "./authentication.js";

function showMsg(text, type = "error") {
  const box = document.getElementById("msg");
  if (!box) return;

  box.style.display = "block";
  box.textContent = text;

  if (type === "ok") {
    box.style.background = "#dcfce7";
    box.style.border = "1px solid #86efac";
    box.style.color = "#14532d";
  } else {
    box.style.background = "#fee2e2";
    box.style.border = "1px solid #fca5a5";
    box.style.color = "#7f1d1d";
  }
}

function hideMsg() {
  const box = document.getElementById("msg");
  if (!box) return;
  box.style.display = "none";
  box.textContent = "";
}

function setMode(mode) {
  const login = document.getElementById("loginSection");
  const signup = document.getElementById("signupSection");
  hideMsg();

  if (mode === "signup") {
    login.style.display = "none";
    signup.style.display = "block";
  } else {
    signup.style.display = "none";
    login.style.display = "block";
  }
}

function friendlyFirebaseError(err) {
  const msg = err?.message ? err.message : String(err);

  if (msg.includes("auth/invalid-api-key")) {
    return "Invalid Firebase API key. Please check your .env values and restart the dev server.";
  }
  if (msg.includes("auth/email-already-in-use")) {
    return "This email is already registered. Please go to Login and sign in.";
  }
  if (msg.includes("auth/weak-password")) {
    return "Password is too weak. Please use at least 6 characters.";
  }
  if (msg.includes("auth/invalid-email")) {
    return "Invalid email format. Please check your email address.";
  }
  if (msg.includes("auth/wrong-password") || msg.includes("auth/invalid-credential")) {
    return "Incorrect email or password. Please try again.";
  }

  return msg;
}

document.addEventListener("DOMContentLoaded", () => {
  // Toggle links
  const goSignup = document.getElementById("goSignup");
  const goLogin = document.getElementById("goLogin");

  goSignup?.addEventListener("click", (e) => {
    e.preventDefault();
    setMode("signup");
  });

  goLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    setMode("login");
  });

  // Buttons
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");

  loginBtn?.addEventListener("click", async () => {
    hideMsg();

    const email = document.getElementById("loginEmail")?.value?.trim();
    const password = document.getElementById("loginPassword")?.value;

    if (!email || !password) {
      showMsg("Please enter your email and password.");
      return;
    }

    try {
      await loginUser(email, password);
      window.location.href = "/main.html";
    } catch (err) {
      showMsg(friendlyFirebaseError(err));
      console.error(err);
    }
  });

  signupBtn?.addEventListener("click", async () => {
    hideMsg();

    const name = document.getElementById("signupName")?.value?.trim();
    const email = document.getElementById("signupEmail")?.value?.trim();
    const password = document.getElementById("signupPassword")?.value;

    if (!name || !email || !password) {
      showMsg("Please fill in name, email, and password.");
      return;
    }

    try {
      await signupUser(name, email, password);
      showMsg("Account created! Redirecting...", "ok");
      window.location.href = "/main.html";
    } catch (err) {
      showMsg(friendlyFirebaseError(err));
      console.error(err);
    }
  });
});
