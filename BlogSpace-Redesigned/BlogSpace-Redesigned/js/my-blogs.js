document.addEventListener("DOMContentLoaded", () => {
  const user = BlogAuth.requireAuth();
  if (!user) return;
  BlogAuth.updateUserUI();
  let filter = "all";
  const tbody = document.getElementById("myArticles");
  const empty = document.getElementById("myArticlesEmpty");
  const search = document.getElementById("articleSearch");

  function render() {
    const query = search.value.trim().toLowerCase();
    const posts = BlogStore.byCurrentUser().filter(post => filter === "all" || post.status === filter)
      .filter(post => `${post.title} ${post.category}`.toLowerCase().includes(query))
      .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    tbody.innerHTML = posts.map(post => `
      <tr><td><div class="table-title"><img class="table-thumb" src="${post.image || 'https://placehold.co/80x80/e9edf5/65718a?text=BS'}" alt=""><span>${BlogStore.escapeHTML(post.title)}</span></div></td>
      <td>${BlogStore.escapeHTML(post.category)}</td><td>${BlogStore.dateLabel(post.updatedAt)}</td>
      <td><span class="status status-${post.status}">${post.status === "published" ? "Published" : "Draft"}</span></td>
      <td><div class="table-actions"><a href="create-blog.html?id=${encodeURIComponent(post.id)}">Edit</a>${post.status === "published" ? `<a href="article.html?id=${encodeURIComponent(post.id)}">View</a>` : ""}<button type="button" data-delete="${post.id}">Delete</button></div></td></tr>`).join("");
    empty.classList.toggle("hidden", posts.length > 0);
    tbody.closest(".table-wrap").classList.toggle("hidden", posts.length === 0);
    tbody.querySelectorAll("[data-delete]").forEach(button => button.addEventListener("click", () => {
      if (confirm("Delete this article permanently?")) { BlogStore.deletePost(button.dataset.delete); render(); }
    }));
  }
  document.querySelectorAll("[data-filter]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(item => item.classList.remove("active"));
    button.classList.add("active"); filter = button.dataset.filter; render();
  }));
  search.addEventListener("input", render); render();
  const toggle = document.getElementById("sidebarToggle"), sidebar = document.getElementById("sidebar"), scrim = document.getElementById("sidebarScrim");
  const close = () => { sidebar.classList.remove("open"); scrim.classList.remove("show"); };
  toggle?.addEventListener("click", () => { sidebar.classList.add("open"); scrim.classList.add("show"); });
  scrim?.addEventListener("click", close);
});