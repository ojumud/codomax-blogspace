document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (menuButton && nav) menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  const grid = document.getElementById("homeArticles");
  if (!grid || !window.BlogStore) return;
  let activeCategory = "All";
  const search = document.getElementById("homeSearch");
  const empty = document.getElementById("homeEmpty");

  function render() {
    const query = (search?.value || "").trim().toLowerCase();
    const posts = BlogStore.getPosts().filter(post => post.status === "published")
      .filter(post => activeCategory === "All" || post.category === activeCategory)
      .filter(post => !query || `${post.title} ${post.excerpt} ${post.category} ${post.authorName}`.toLowerCase().includes(query))
      .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    grid.innerHTML = posts.map(post => `
      <article class="story-card">
        <a href="article.html?id=${encodeURIComponent(post.id)}">
          <div class="story-image">${post.image ? `<img src="${post.image}" alt="">` : ""}</div>
          <div class="story-body">
            <div class="story-meta"><span class="story-category">${BlogStore.escapeHTML(post.category)}</span><span>•</span><span>${BlogStore.dateLabel(post.updatedAt)}</span></div>
            <h3>${BlogStore.escapeHTML(post.title)}</h3>
            <p>${BlogStore.escapeHTML(post.excerpt)}</p>
            <span class="story-read">Read story ↗</span>
          </div>
        </a>
      </article>`).join("");
    empty.classList.toggle("hidden", posts.length > 0);
  }

  document.querySelectorAll("[data-category]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-category]").forEach(item => item.classList.remove("active"));
    button.classList.add("active"); activeCategory = button.dataset.category; render();
  }));
  search?.addEventListener("input", render);
  render();
});