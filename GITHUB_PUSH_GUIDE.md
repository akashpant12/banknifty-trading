# Git Commands to Push Code to GitHub

## Step 1: Open Terminal

1. Press **Cmd + Space** (spotlight search)
2. Type **"Terminal"**
3. Press **Enter**

## Step 2: Navigate to Your Project Folder

If you have the project on your desktop:

```bash
cd ~/Desktop/banknifty-trading
```

Or wherever you saved the project folder.

## Step 3: Run These Commands (One by One)

Run each command separately and press Enter:

```bash
git init
```

```bash
git remote add origin https://github.com/YOUR_USERNAME/banknifty-trading.git
```

(Replace `YOUR_USERNAME` with your actual GitHub username)

```bash
git add -A
```

```bash
git commit -m "BankNifty Trading Agent - Initial commit"
```

```bash
git push -u origin main
```

## Step 4: Enter Your GitHub Credentials

When asked:
- **Username**: Your GitHub username
- **Password**: Your GitHub password (or Personal Access Token if enabled)

## Step 5: Connect to Vercel

1. Go to **https://vercel.com**
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Select your repository `banknifty-trading`
5. Click **"Deploy"**

---

## If You Get "Permission Denied" Error

You may need to create a Personal Access Token:
1. Go to **https://github.com/settings/tokens**
2. Click **"Generate new token (classic)"**
3. Name it "Vercel Deploy"
4. Check **"repo"** scope
5. Copy the token
6. Use the token as password when pushing

What error are you seeing? Tell me and I'll help fix it!