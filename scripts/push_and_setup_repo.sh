#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <git-remote-url>"
  echo "Example: $0 https://github.com/your-username/your-repo.git"
  exit 1
fi

REMOTE_URL=$1

echo "Setting remote to: $REMOTE_URL"
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE_URL"
git branch -M main
echo "Pushing to origin main..."
git push -u origin main

echo "Repo pushed."
echo "Next steps (manual):"
echo " - In GitHub repository settings → Secrets → Actions, add: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
echo " - Optionally enable packages: write permissions for GITHUB_TOKEN to publish GHCR images (Settings -> Actions -> General -> Workflow permissions)."
