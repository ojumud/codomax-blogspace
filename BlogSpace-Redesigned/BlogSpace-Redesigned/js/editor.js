document.addEventListener("DOMContentLoaded", () => {
  const user = BlogAuth.requireAuth();
  if (!user) return;
  BlogAuth.updateUserUI();
  const form = document.getElementById("articleForm");
  const params = new URLSearchParams(location.search);
  const editId = params.get("id");
  let existing = editId ? BlogStore.getPost(editId) : null;
  if (editId && (!existing || existing.authorId !== user.id)) {
    document.getElementById("editorMessage").textContent = "That article could not be found in your account.";
    document.getElementById("editorMessage").classList.remove("hidden");
    form.classList.add("hidden"); return;
  }
  const title = document.getElementById("postTitle");
  const excerpt = document.getElementById("postExcerpt");
  const content = document.getElementById("postContent");
  const category = document.getElementById("postCategory");
  const imageInput = document.getElementById("postImage");
  const preview = document.getElementById("imagePreview");
  const removeImage = document.getElementById("removeImage");
  let imageData = existing?.image || "";
  if (existing) {
    document.getElementById("editorHeading").textContent = "Edit your article";
    title.value = existing.title; excerpt.value = existing.excerpt; content.value = existing.content; category.value = existing.category;
    if (imageData) { preview.src = imageData; preview.classList.remove("hidden"); removeImage.classList.remove("hidden"); }
  }
  const updateCounts = () => {
    document.getElementById("titleCount").textContent = title.value.length;
    document.getElementById("excerptCount").textContent = excerpt.value.length;
  };
  title.addEventListener("input", updateCounts); excerpt.addEventListener("input", updateCounts); updateCounts();

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    if (!["image/jpeg","image/png","image/webp"].includes(file.type)) return show("Please choose a JPG, PNG or WebP image.");
    if (file.size > 3 * 1024 * 1024) return show("Please choose an image smaller than 3 MB.");
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const max = 1200, scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        imageData = canvas.toDataURL("image/jpeg", .78);
        preview.src = imageData; preview.classList.remove("hidden"); removeImage.classList.remove("hidden");
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
  removeImage.addEventListener("click", () => { imageData = ""; imageInput.value = ""; preview.src = ""; preview.classList.add("hidden"); removeImage.classList.add("hidden"); });

  function show(text, success = false) {
    const box = document.getElementById("editorMessage");
    box.textContent = text; box.classList.remove("hidden","success");
    if (success) box.classList.add("success");
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const intent = event.submitter?.value || "draft";
    const cleanTitle = title.value.trim(), cleanExcerpt = excerpt.value.trim(), cleanContent = content.value.trim();
    if (!cleanTitle || !cleanExcerpt || !cleanContent || !category.value) return show("Please complete the title, introduction, story and category.");
    const now = new Date().toISOString();
    const post = {
      id: existing?.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      authorId: user.id, authorName: user.name, title: cleanTitle, excerpt: cleanExcerpt,
      content: cleanContent, category: category.value, image: imageData,
      status: intent, views: existing?.views || 0,
      createdAt: existing?.createdAt || now, updatedAt: now
    };
    try {
      BlogStore.savePost(post);
      window.location.href = "my-blogs.html";
    } catch (error) {
      console.error(error);
      show("Your article could not be saved. The image may be too large; remove it and try again.");
    }
  });

  const toggle = document.getElementById("sidebarToggle"), sidebar = document.getElementById("sidebar"), scrim = document.getElementById("sidebarScrim");
  const close = () => { sidebar.classList.remove("open"); scrim.classList.remove("show"); };
  toggle?.addEventListener("click", () => { sidebar.classList.add("open"); scrim.classList.add("show"); });
  scrim?.addEventListener("click", close);
});