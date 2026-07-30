Set-StrictMode -Version Latest

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Error "Vercel CLI not found. Install it with: npm i -g vercel"
    exit 1
}

$ViteApi = Read-Host -Prompt "Enter VITE_API_URL (e.g. https://api.example.com/api)"

Write-Host "Logging into Vercel (interactive)..."
vercel login

Write-Host "Now adding VITE_API_URL to the Production environment. When prompted, paste the value: $ViteApi"
vercel env add VITE_API_URL production

Write-Host "Triggering production deploy (interactive)..."
Push-Location frontend
try {
    vercel --prod --confirm
} finally {
    Pop-Location
}
