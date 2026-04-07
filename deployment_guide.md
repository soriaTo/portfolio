# Hosting Your Portfolio on GitHub Pages

This guide explains how to host your Vite-powered portfolio on GitHub Pages for free.

## Prerequisites
- A GitHub account.
- Git installed on your local machine.

---

## Step 1: Initialize Git and Push to GitHub

If you haven't already initialized a Git repository, run these commands in your project root (`d:\projects\porfolio`):

```bash
git init
git add .
git commit -m "Initial commit"
```

1. Create a new repository on GitHub (e.g., `my-portfolio`).
2. Link your local repo to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Configure Vite for GitHub Pages

Vite needs to know your repository name to serve assets correctly.

1. Open `vite.config.ts`.
2. Add the `base` property with your repository name:

```typescript
export default defineConfig({
  base: '/YOUR_REPO_NAME/', // Replace with your repository name
  plugins: [react(), tailwindcss()],
  // ... other config
})
```

---

## Step 3: Automated Deployment (GitHub Actions)

The most robust way to deploy is using GitHub Actions. It will automatically build and deploy your site every time you push code.

1. Create a folder structure in your root: `.github/workflows/`.
2. Create a file named `deploy.yml` inside that folder:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build_site:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Upload Artifacts
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build_site
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

3. Commit and push this file:
   ```bash
   git add .
   git commit -m "Add deployment workflow"
   git push
   ```

---

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.

Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` within a few minutes!
