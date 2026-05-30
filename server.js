const express = require("express");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 3000;

async function fetchCloudinaryFolderAssets(folderName) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const maxResults = 36;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("Missing Cloudinary environment variables.");
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/by_asset_folder?asset_folder=${encodeURIComponent(folderName)}&max_results=${maxResults}`;
    const authorization = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

    const response = await fetch(url, {
        headers: {
            Authorization: `Basic ${authorization}`,
            Accept: "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Cloudinary asset lookup failed with status ${response.status}`);
    }

    return response.json();
}

app.get("/health", (_req, res) => {
    res.json({ ok: true });
});

app.get("/config.js", (_req, res) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
    res.type("application/javascript");
    res.send(`window.__APP_CONFIG__ = { CLOUDINARY_CLOUD_NAME: ${JSON.stringify(cloudName)} };`);
});

app.get("/gallery-assets", async (req, res) => {
    const folderName = String(req.query.folder || "smallkitchen");

    try {
        const payload = await fetchCloudinaryFolderAssets(folderName);
        const resources = Array.isArray(payload.resources) ? payload.resources : [];
        const selectedResources = resources.slice(0, 36);

        res.json({
            folder: folderName,
            resources: selectedResources.map((resource) => ({
                public_id: resource.public_id,
                resource_type: resource.resource_type,
                type: resource.type,
                format: resource.format,
                asset_folder: resource.asset_folder
            }))
        });
    } catch (error) {
        res.status(500).json({
            error: "Unable to load gallery assets.",
            message: error.message
        });
    }
});

app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
    console.log(`smallkitchenSite listening on port ${port}`);
});
