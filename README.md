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

If you later add uploads or admin calls, also add:

- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Never store real secrets in this repository.

## Where secrets are protected

- In GitHub: secrets are **not committed** because `.env` is ignored by `.gitignore`.
- In Render: `CLOUDINARY_CLOUD_NAME` is injected at runtime and exposed to the page through `/config.js`.
- In this app: the gallery reads the cloud name from `window.__APP_CONFIG__`, not from a hardcoded value.

## Test after deploy

- `GET /health` should return `{ "ok": true }`
- `POST /upload-sample` should upload to Cloudinary and return URLs

