const express = require("express");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.get("/health", (_req, res) => {
    res.json({ ok: true });
});

app.get("/config.js", (_req, res) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
    res.type("application/javascript");
    res.send(`window.__APP_CONFIG__ = { CLOUDINARY_CLOUD_NAME: ${JSON.stringify(cloudName)} };`);
});

app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
    console.log(`smallkitchenSite listening on port ${port}`);
});
