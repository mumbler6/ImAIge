import express from 'express';
import { Design, Project } from '../models';
import { authMiddleware } from '../utils/permissions';
import axios from 'axios';
import { storage } from 'firebase-admin';
import { createHash } from 'crypto';

const app = express();
app.use(authMiddleware);

app.get('/:designId', async (req, res) => {
    const { designId } = req.params;
    const design = await Design.findOne({ _id: designId, userId: req.user.uid });
    if (!design)
        return res.json({ message: 'Design does not exist' });

    return res.json({ data: design.toJSON() });
});

app.get('/', async (req, res) => {
    const designs = await Design.find({ userId: req.user.uid });
    return res.json({ data: designs.map(d => d.toJSON()) });
});

app.post('/', async (req, res) => {
    const { prompt, projectId } = req.body;

    const project = await Project.findOne({ _id: projectId, userId: req.user.uid });
    if (!project)
        return res.status(400).json({ message: 'Invalid project' });

    const OPENAI_API_KEY = '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';
    try {
        const response = await axios.post(`https://api.openai.com/v1/images/generations`, {
            model: "dall-e-2",
            prompt, n: 1, size: '512x512',
            response_format: 'b64_json' // b64_json/url
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        const images = response.data.data.map((i: any) => i.url || i.b64_json);
        const buffer = Buffer.from(images[0], 'base64');

        const design = new Design();

        const file = storage().bucket().file(`designs/user_${req.user.uid}/${design._id}`);
        await file.save(buffer, { metadata: { contentType: 'image/png' } });
        const imageUrl = (await file.getSignedUrl({ action: 'read', expires: '9999-12-31' }))[0];

        design.prompt = prompt;
        design.imageUrl = imageUrl;
        design.project = project.id;

        const hash = createHash('sha256');
        hash.update(buffer);
        hash.update('SALT_IMAIGEN');
        design.token = hash.digest('hex');
        await design.save();

        project.designs = [...project.designs, design.id];
        await project.save();

        return res.json({ data: design.toJSON() });
    }
    catch (err: any)
    {
        console.log(err);
        return res.status(400).json({ message: 'Error' });
    }
});

app.delete('/:designId', async (req, res) => {
    const { designId } = req.params;
    const design = await Design.findOne({ _id: designId, userId: req.user.uid });
    if (!design)
        return res.status(400).json({ message: 'Design does not exist' });

    const project = (await Project.findById(design.project));
    if (!project)
        return res.status(500).json({ message: 'Internal server error: Project doesn\'t exist' });

    const file = storage().bucket().file(`/designs/user_${req.user.uid}/${design._id}`);
    await file.delete();

    project.designs = project.designs.filter(d => d.id != design.id);
    await project.save();
    await design.deleteOne();

    return res.json({ message: 'Design deleted' });
});


export default app;