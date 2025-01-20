import express from 'express';
import { Design, Project } from '../models';
import { authMiddleware } from '../utils/permissions';

const app = express();
app.use(authMiddleware);

app.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.user.uid }).populate('designs');
    if (!project)
        return res.status(400).json({ message: 'Invalid project' });

    return res.json({ data: project.toJSON() });
});

app.get('/', async (req, res) => {
    const projects = await Project.find({ userId: req.user.uid }).populate('designs');
    return res.json({ data: projects.map(p => p.toJSON()) });
});

app.post('/', async (req, res) => {
    const { name } = req.body;
    const project = await Project.create({ userId: req.user.uid, name });
    return res.json({ data: project.toJSON() });
});

app.put('/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const { name } = req.body;
    const project = await Project.findOne({ _id: projectId, userId: req.user.uid });
    if (!project)
        return res.json({ message: 'Invalid Project' });

    project.name = name;
    await project.save();

    return res.json({ data: project.toJSON() });
});


app.delete('/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.user.uid });
    if (!project)
        return res.status(400).json({ message: 'Invalid project' });

    await Design.deleteMany({
        _id: { '$in': project.designs }
    });
    await project.deleteOne();
    return res.json({ data: project.toJSON() });
});

export default app;