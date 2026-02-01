# How to Create a GitHub Personal Access Token

## Step 1: Go to GitHub Settings

1. Log into your GitHub account
2. Click your profile picture (top right) → **Settings**
3. In the left sidebar, scroll down and click **Developer settings**
4. Click **Personal access tokens** → **Tokens (classic)**

## Step 2: Generate a New Token

1. Click **Generate new token (classic)**
2. Give your token a descriptive name (e.g., "banknifty-trading-push")
3. Set an expiration (recommended: 30 days or 90 days)
4. Select the following scopes:
   - ☑️ **repo** - Full control of private repositories
5. Click **Generate token**

## Step 3: Copy and Save Your Token

⚠️ **Important**: Copy your token immediately! GitHub won't show it again.

## Step 4: Use the Token to Push

Run these commands in your terminal:

```bash
# Set the GitHub remote with your token
git remote set-url github https://YOUR_TOKEN_HERE@github.com/akashpant12/banknifty-trading.git

# Push to GitHub
git push github main
```

Replace `YOUR_TOKEN_HERE` with the token you copied.

## Security Note

Never share your token publicly or commit it to version control. If exposed, revoke it immediately from GitHub settings.
