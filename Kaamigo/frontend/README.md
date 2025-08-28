# Kaamigo - Voice-First Freelance Platform

Kaamigo is a revolutionary voice-first, reels-powered platform connecting talent with opportunities in Tier 2/3 India.

## 🚨 IMPORTANT: Project Structure Guidelines

### Repository Structure
```
Kaamigo/
├── frontend/          # React frontend application
├── backend/           # Node.js backend application
├── .gitignore        # Root-level gitignore
├── README.md         # This file (project overview)
└── package.json      # Root package.json (if needed)
```

### 🔐 Security Requirements

**CRITICAL - Environment Variables:**
- ✅ **DO**: Add `.env` to `.gitignore` before committing anything
- ❌ **DON'T**: Push environment files or secrets under any circumstances
- ✅ **DO**: Use environment variables for all API keys, tokens, and sensitive data
- ❌ **DON'T**: Hardcode credentials in source code

**Firebase Configuration:**
- All Firebase API keys are now stored in `.env` files
- Never commit the actual values to the repository
- Use `import.meta.env.VITE_*` for frontend environment variables

### 📁 Team Responsibilities

**Frontend Team:**
- Work exclusively in the `frontend/` folder
- Keep all React components, styles, and frontend assets here
- Do not mix backend code into frontend folders

**Backend Team:**
- Work exclusively in the `backend/` folder  
- Keep all Node.js/Express code, APIs, and server logic here
- Do not mix frontend code into backend folders

### 🔄 Workflow Guidelines

1. **Pull Latest Changes**: Always pull from main before starting work
2. **Create Feature Branch**: Work on feature branches, not directly on main
3. **Submit Pull Requests**: All changes must go through PR review process
4. **Code Review**: Wait for approval before merging
5. **Clean Structure**: Maintain separation between frontend/backend

### 🚫 What NOT to Commit

- `.env` files (all variants)
- `node_modules/` directories
- Build artifacts (`dist/`, `build/`)
- IDE-specific files (except `.vscode/extensions.json`)
- Temporary files and logs
- Any files containing API keys or passwords

### ⚠️ Before You Commit

**Checklist:**
- [ ] `.env` files are in `.gitignore`
- [ ] No hardcoded API keys in source code
- [ ] Code is in the correct folder (frontend/ or backend/)
- [ ] No sensitive data is being committed
- [ ] Changes are focused and well-documented

### 🛠️ Setup Instructions

**Frontend Setup:**
```bash
cd frontend
npm install
cp .env.example .env  # Add your actual environment variables
npm run dev
```

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env  # Add your actual environment variables
npm start
```

### 🔗 Environment Variables

**Frontend (.env):**
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_key_here
```

### 📞 Need Help?

If you're unsure about the project structure or have questions about where to place your code, please ask in the team chat before pushing changes.

**Remember**: Maintaining clean project structure saves time and prevents conflicts! 🚀
