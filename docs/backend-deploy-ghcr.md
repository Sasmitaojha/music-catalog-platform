# Backend: Build & Publish Docker Image (GitHub Container Registry)

This repository includes a GitHub Actions workflow that builds the backend Docker image and pushes it to `ghcr.io` on pushes to `main`.

Workflow: `.github/workflows/backend-ghcr.yml`

What to check:
- The workflow uses the `GITHUB_TOKEN` to authenticate and push to GitHub Container Registry. Ensure repository permissions for `packages: write` are enabled.

After the workflow runs, the image will be available at:

```
ghcr.io/<your-org-or-username>/music-backend:latest
ghcr.io/<your-org-or-username>/music-backend:<commit-sha>
```

Deploy options after image is published:
- Render: Create a new service using the published image and set the environment variables (APP_JWT_SECRET, SPRING_DATASOURCE_URL, etc.).
- Railway/Other: Use the image URL or let the platform build from the `backend/` Dockerfile.
