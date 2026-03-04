// src/components/site-navbar.js
import { watchAuth, logoutUser } from "../authentication.js";

class SiteNavbar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.attachAuth();
  }

  render() {
    this.innerHTML = `
      <nav style="display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:#1f2937;color:#fff;">
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="font-weight:800;font-size:18px;">SuzyHikes</div>
          <a href="/index.html" style="color:#fff;text-decoration:none;opacity:.9;">Home</a>
          <a href="/main.html" style="color:#fff;text-decoration:none;opacity:.9;">Main</a>
        </div>

        <div id="authControls" style="display:flex;align-items:center;gap:12px;"></div>
      </nav>
    `;
  }

  attachAuth() {
    const box = this.querySelector("#authControls");
    if (!box) return;

    watchAuth((user) => {
      if (user) {
        const name = user.displayName || user.email || "User";
        box.innerHTML = `
          <span style="opacity:.9;">Hello, ${name}</span>
          <button id="logoutBtn" style="padding:8px 12px;border:1px solid #fff;background:transparent;color:#fff;border-radius:6px;cursor:pointer;">
            Log out
          </button>
        `;
        box.querySelector("#logoutBtn").addEventListener("click", async () => {
          await logoutUser();
          window.location.href = "/index.html";
        });
      } else {
        box.innerHTML = `
          <a href="/login.html" style="padding:8px 12px;border:1px solid #fff;background:transparent;color:#fff;border-radius:6px;text-decoration:none;">
            Log in
          </a>
        `;
      }
    });
  }
}

customElements.define("site-navbar", SiteNavbar);
