# SARATHI AI - Deployment Guide (AWS Amplify)

This guide covers deploying SARATHI AI to AWS Amplify for free.

## Prerequisites

- GitHub/GitLab/Bitbucket account
- AWS account (free tier eligible)
- Your project code pushed to a git repository

---

## Step 1: Push Your Code to Git

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit your changes
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/sarathi-ai.git
git branch -M main
git push -u origin main
```

---

## Step 2: Set Up AWS Amplify

1. Go to **https://aws.amazon.com/amplify/**
2. Click **Sign in to the Console** → Sign in to your AWS account
3. Click **Create new app**

---

## Step 3: Connect Your Repository

1. Select your git provider (GitHub)
2. Click **Connect branch**
3. Select your repository and branch (`main`)
4. Click **Next**

---

## Step 4: Configure Build Settings

Amplify auto-detects Next.js. Verify these settings:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build directory | `.next` |
| Node version | `18.x` |

Click **Next**.

---

## Step 5: Add Environment Variables

In the **Environment variables** section, add:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENROUTER_API_KEY=your_openrouter_key
```

Click **Next**.

---

## Step 6: Review and Deploy

1. Review your settings
2. Click **Save and deploy**

Wait 3-5 minutes for the first deployment.

---

## Step 7: Configure Domain (Optional)

1. Go to **Amplify → Domain management**
2. Click **Add domain**
3. Enter your domain (e.g., `sarathi-ai.com`)
4. Follow the DNS verification steps

---

## Troubleshooting

### Build Fails
- Check **Build logs** in Amplify console
- Ensure all environment variables are set
- Verify Node version matches local (`18.x`)

### 500 Errors on Pages
- Check environment variables are correctly set
- Verify Supabase tables exist
- Check **CloudWatch logs** in AWS Console

### Custom Domain Not Working
- Wait up to 24-48 hours for DNS propagation
- Verify CNAME records in your domain registrar

---

## Free Tier Limits

| Service | Free Tier |
|---------|---------|
| Amplify Hosting | 1000 build minutes/month |
| Storage | 5 GB |
| Data Transfer | 15 GB/month |

This should be sufficient for development and testing.