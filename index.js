import express from 'express';
import { v2 as cloudinary } from 'cloudinary';

const app = express();
app.use(express.json());

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, PORT } = process.env;
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error('Missing Cloudinary env vars: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
}

// Configure Cloudinary once at startup.
cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
});

app.get('/', (_req, res) => {
        res.status(200).type('html').send(`<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>smallkitchenSite</title>
</head>
<body>
    <h1>smallkitchenSite is running</h1>
    <p>Available endpoints:</p>
    <ul>
        <li>GET /health</li>
        <li>POST /upload-sample</li>
    </ul>
</body>
</html>`);
});

app.post('/upload-sample', async (_req, res) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/dnyfkpshi/image/upload/5A799082-A07E-4922-A55F-4285181664C2_sj5amk',
            { public_id: 'main-sample' }
        );

        const imageUrl = cloudinary.image('main-sample');

        res.status(200).json({
            uploaded: true,
            public_id: uploadResult.public_id,
            secure_url: uploadResult.secure_url,
            transformed_url: imageUrl,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            uploaded: false,
            error: 'Upload failed',
        });
    }
});

const serverPort = Number(PORT) || 3000;
app.listen(serverPort, () => {
    console.log(`Server listening on port ${serverPort}`);
});
