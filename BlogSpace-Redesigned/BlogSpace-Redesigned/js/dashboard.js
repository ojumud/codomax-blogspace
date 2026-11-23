document.addEventListener("DOMContentLoaded", () => {
  const user = BlogAuth.requireAuth();
  if (!user) return;
  BlogAuth.updateUserUI();
  const posts = BlogStore.byCurrentUser();
  const published = posts.filter(post => post.status === "published");
  const drafts = posts.filter(post => post.status === "draft");
  document.getElementById("totalArticles").textContent = posts.length;
  document.getElementById("publishedArticles").textContent = published.length;
  document.getElementById("draftArticles").textContent = drafts.length;
  document.getElementById("totalViews").textContent = posts.reduce((sum, post) => sum + (post.views || 0), 0).toLocaleString();
  const tbody = document.getElementById("recentArticles");
  const empty = document.getElementById("dashboardEmpty");
  const recent = [...posts].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0,5);
  tbody.innerHTML = recent.map(post => `
    <tr><td><div class="table-title"><img class="table-thumb" src="${post.image || 'https://placehold.co/80x80/e9edf5/65718a?text=BS'}" alt=""><span>${BlogStore.escapeHTML(post.title)}</span></div></td>
    <td>${BlogStore.escapeHTML(post.category)}</td><td>${BlogStore.dateLabel(post.updatedAt)}</td>
    <td><span class="status status-${post.status}">${post.status === "published" ? "Published" : "Draft"}</span></td>
    <td><div class="table-actions"><a href="create-blog.html?id=${encodeURIComponent(post.id)}">Edit</a></div></td></tr>`).join("");
  empty.classList.toggle("hidden", posts.length > 0);
  tbody.closest(".table-wrap").classList.toggle("hidden", posts.length === 0);
  const toggle = document.getElementById("sidebarToggle");
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebarScrim");
  const close = () => { sidebar.classList.remove("open"); scrim.classList.remove("show"); };
  toggle?.addEventListener("click", () => { sidebar.classList.add("open"); scrim.classList.add("show"); });
  scrim?.addEventListener("click", close);
});