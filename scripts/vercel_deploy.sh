#!/usr/bin/env bash
set -euo pipefail

echo "This script uses the Vercel CLI to add an env var and trigger a production deploy."

if ! command -v vercel >/dev/null 2>&1; then
  echo "Please install the Vercel CLI: npm i -g vercel"
  exit 1
fi

read -p "Enter VITE_API_URL (e.g. https://api.example.com/api): " VITE_API_URL

echo "Logging into Vercel..."
vercel login || true

echo "Adding VITE_API_URL to production environment..."
vercel env add VITE_API_URL production <<<"$VITE_API_URL" || true

echo "Triggering production deploy..."
cd frontend
vercel --prod --confirm
