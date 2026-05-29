# smallkitchenSite

## Deploy on Render from GitHub

Yes, this can run on Render using your GitHub repo.

### 1) Push this repo to GitHub

Render deploys by pulling from your repository.

### 2) Create a Render Web Service (standard)

This app now runs as an HTTP service.

- Environment: Node
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`

### 3) Set environment variables in Render

Add these in Render -> Environment:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Never store real secrets in this repository.

## Where secrets are protected

- In GitHub: secrets are **not committed** because `.env` is ignored by `.gitignore`.
- In Render: you store secrets in the service's Environment settings, not in code.
- At runtime: Render injects those values as process environment variables (`process.env`).
- In this app: credentials are read from environment variables only and never hardcoded.

## Test after deploy

- `GET /health` should return `{ "ok": true }`
- `POST /upload-sample` should upload to Cloudinary and return URLs

