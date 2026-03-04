class SiteFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <footer class="py-4 bg-white border-top mt-auto">
        <div class="container text-center text-muted">
          <small>© ${year} SuzyHikes • Suzy Hham</small>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-footer", SiteFooter);
