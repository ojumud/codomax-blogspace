document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year"); if (year) year.textContent = new Date().getFullYear();
  const id = new URLSearchParams(location.search).get("id");
  const post = id ? BlogStore.getPost(id) : null;
  const root = document.getElementById("articleDetail");
  if (!post || post.status !== "published") {
    root.innerHTML = '<div class="article-loading"><h2>Story not found</h2><p>This article may have been removed or is not published.</p><a class="btn btn-primary" href="index.html">Explore stories</a></div>';
    return;
  }
  post.views = (post.views || 0) + 1;
  BlogStore.savePost(post);
  const paragraphs = post.content.split(/\n\s*\n/).map(part => `<p>${BlogStore.escapeHTML(part).replace(/\n/g,"<br>")}</p>`).join("");
  root.innerHTML = `
    <div class="article-detail-category">${BlogStore.escapeHTML(post.category)}</div>
    <h1 class="article-detail-title">${BlogStore.escapeHTML(post.title)}</h1>
    <p class="article-detail-excerpt">${BlogStore.escapeHTML(post.excerpt)}</p>
    <div class="article-byline"><span class="user-avatar">${BlogStore.escapeHTML((post.authorName || "W").split(/\s+/).map(x=>x[0]).slice(0,2).join("").toUpperCase())}</span><span>By <strong>${BlogStore.escapeHTML(post.authorName)}</strong> · ${BlogStore.dateLabel(post.updatedAt)}</span></div>
    ${post.image ? `<img class="article-cover" src="${post.image}" alt="">` : ""}
    <div class="article-content">${paragraphs}</div>`;
});