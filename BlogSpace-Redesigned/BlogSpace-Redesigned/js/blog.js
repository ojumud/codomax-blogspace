/* Local browser storage for BlogSpace demo articles. */
(function () {
  const POSTS_KEY = "blogspace_posts";
  const getPosts = () => {
    try { return JSON.parse(localStorage.getItem(POSTS_KEY) || "[]"); } catch { return []; }
  };
  const savePosts = posts => localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  const currentUser = () => window.BlogAuth ? BlogAuth.getCurrentUser() : null;
  const byCurrentUser = () => {
    const user = currentUser();
    return user ? getPosts().filter(post => post.authorId === user.id) : [];
  };
  const dateLabel = value => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  };
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  const savePost = post => {
    const posts = getPosts();
    const index = posts.findIndex(item => item.id === post.id);
    if (index >= 0) posts[index] = post; else posts.unshift(post);
    savePosts(posts);
    return post;
  };
  const deletePost = id => savePosts(getPosts().filter(post => post.id !== id));
  const getPost = id => getPosts().find(post => post.id === id);
  window.BlogStore = { getPosts, savePosts, byCurrentUser, dateLabel, escapeHTML, savePost, deletePost, getPost };
})();