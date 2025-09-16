#!/bin/bash

# Script to remove all files listed in .gitignore from Git tracking
# This keeps the files locally but stops tracking them in the repository

echo "Removing files from Git tracking that are listed in .gitignore..."

# Remove platform-specific files
echo "Removing platform-specific files..."
git rm --cached .replit 2>/dev/null || echo ".replit not tracked"
git rm --cached -r .config 2>/dev/null || echo ".config not tracked"
git rm --cached -r .upm 2>/dev/null || echo ".upm not tracked"
git rm --cached replit.nix 2>/dev/null || echo "replit.nix not tracked"

# Remove environment files
echo "Removing environment files..."
git rm --cached .env 2>/dev/null || echo ".env not tracked"
git rm --cached .env.local 2>/dev/null || echo ".env.local not tracked"
git rm --cached .env.development.local 2>/dev/null || echo ".env.development.local not tracked"
git rm --cached .env.test.local 2>/dev/null || echo ".env.test.local not tracked"
git rm --cached .env.production.local 2>/dev/null || echo ".env.production.local not tracked"

# Remove build outputs
echo "Removing build outputs..."
git rm --cached -r dist 2>/dev/null || echo "dist not tracked"
git rm --cached -r build 2>/dev/null || echo "build not tracked"
git rm --cached -r .next 2>/dev/null || echo ".next not tracked"
git rm --cached -r out 2>/dev/null || echo "out not tracked"
git rm --cached -r server/public 2>/dev/null || echo "server/public not tracked"

# Remove cache and temporary files
echo "Removing cache files..."
git rm --cached -r .cache 2>/dev/null || echo ".cache not tracked"
git rm --cached -r .parcel-cache 2>/dev/null || echo ".parcel-cache not tracked"
git rm --cached -r .drizzle 2>/dev/null || echo ".drizzle not tracked"

# Remove logs
echo "Removing log files..."
git rm --cached -r logs 2>/dev/null || echo "logs not tracked"
git rm --cached "*.log" 2>/dev/null || echo "*.log files not tracked"
git rm --cached npm-debug.log* 2>/dev/null || echo "npm-debug.log not tracked"
git rm --cached yarn-debug.log* 2>/dev/null || echo "yarn-debug.log not tracked"
git rm --cached yarn-error.log* 2>/dev/null || echo "yarn-error.log not tracked"

# Remove IDE files
echo "Removing IDE files..."
git rm --cached -r .vscode 2>/dev/null || echo ".vscode not tracked"
git rm --cached -r .idea 2>/dev/null || echo ".idea not tracked"

# Remove OS files
echo "Removing OS files..."
git rm --cached .DS_Store 2>/dev/null || echo ".DS_Store not tracked"
git rm --cached .DS_Store? 2>/dev/null || echo ".DS_Store? not tracked"
git rm --cached Thumbs.db 2>/dev/null || echo "Thumbs.db not tracked"
git rm --cached ehthumbs.db 2>/dev/null || echo "ehthumbs.db not tracked"

# Remove database files
echo "Removing database files..."
git rm --cached "*.db" 2>/dev/null || echo "*.db files not tracked"
git rm --cached "*.sqlite" 2>/dev/null || echo "*.sqlite files not tracked"
git rm --cached "*.sqlite3" 2>/dev/null || echo "*.sqlite3 files not tracked"

# Remove other common files
echo "Removing other ignored files..."
git rm --cached -r node_modules 2>/dev/null || echo "node_modules not tracked"
git rm --cached -r coverage 2>/dev/null || echo "coverage not tracked"
git rm --cached -r .nyc_output 2>/dev/null || echo ".nyc_output not tracked"
git rm --cached "*.tsbuildinfo" 2>/dev/null || echo "*.tsbuildinfo files not tracked"

echo ""
echo "Cleanup complete! Now run:"
echo "git add .gitignore"
echo "git commit -m 'Remove tracked files that should be ignored'"
echo "git push origin main"
echo ""
echo "This will remove these files from your GitHub repository while keeping them locally."