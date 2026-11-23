# BlogSpace — Frontend Blog Application

A responsive blogging platform built with HTML, CSS and vanilla JavaScript.

## Features
- Responsive public homepage with category filters and search
- Account registration and login demo
- Protected author dashboard
- Create, edit, publish and save draft articles
- Manage and delete your articles
- Public article reading pages
- Browser-based storage using `localStorage` and `sessionStorage`
- Featured image upload with client-side resizing

## Run locally
1. Extract the project folder.
2. Open the folder in Visual Studio Code.
3. Install the **Live Server** extension if you have not already.
4. Right-click `index.html` and select **Open with Live Server**.
5. Register a test account, then create and publish an article.

Use the same Live Server address for every page. Do not open HTML files by double-clicking them.

## Project structure
```text
BlogSpace-Redesigned/
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── my-blogs.html
├── article.html
├── css/
│   └── style.css
├── js/
│   ├── auth.js
│   ├── auth-pages.js
│   ├── blog.js
│   ├── main.js
│   ├── dashboard.js
│   ├── editor.js
│   ├── my-blogs.js
│   └── article.js
└── README.md
```

## Important limitations
This is a frontend learning/demo project. User accounts, password hashes and articles are stored in the browser and are not shared between devices or browsers. Browser storage is not secure authentication and can be edited by the user. Do not use real passwords or sensitive information. A production app needs a backend/database and server-side authentication.

If you already registered with an earlier version, the account format using `blogspace_users` and `passwordHash` is compatible. If the same browser and same Live Server origin are used, the account should still be available.
