# PHX JAX Leasing Assistant

AI-powered leasing assistant for the Phoenix Arts & Innovation District, Jacksonville FL.

## Deploy to Vercel (Step-by-Step)

### 1. Push to GitHub
- Create a new repository on github.com (call it `phxjax-assistant`)
- Upload all these files to the repo

### 2. Connect to Vercel
- Go to vercel.com and click **Add New Project**
- Import your GitHub repository
- Vercel will auto-detect it as a Next.js project

### 3. Add your API Key
- In Vercel, before deploying, go to **Environment Variables**
- Add: `ANTHROPIC_API_KEY` = your key (starts with `sk-ant-...`)
- Click **Deploy**

### 4. Get your URL
- Vercel will give you a URL like `phxjax-assistant.vercel.app`
- Your assistant is live!

### 5. Embed in Squarespace
- Go to your Squarespace page
- Add a **Code Block**
- Paste:
```html
<iframe 
  src="https://your-project.vercel.app/assistant" 
  width="100%" 
  height="700px" 
  frameborder="0" 
  style="border:none;">
</iframe>
```

## Local Development
```bash
npm install
cp .env.example .env.local
# Add your API key to .env.local
npm run dev
```

Open http://localhost:3000
