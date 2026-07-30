Param(
    [Parameter(Mandatory = $true)]
    [string]$RemoteUrl
)

Set-StrictMode -Version Latest

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not available in this environment. Install Git and re-run this script."
    exit 1
}

Write-Host "Setting remote to: $RemoteUrl"
try { git remote remove origin } catch { }
git remote add origin $RemoteUrl
git branch -M main

Write-Host "Pushing to origin main..."
git push -u origin main

Write-Host "Repository pushed. Next manual steps:"
Write-Host " - In GitHub repository Settings → Secrets → Actions, add: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID"
Write-Host " - Optionally enable 'Workflow permissions' (Settings → Actions → General) to allow GHCR pushes, or create a PAT with 'write:packages' and add as GHCR_PAT secret."
