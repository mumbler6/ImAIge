import { Schema, model } from 'mongoose';

const ProjectSchema = new Schema({
    name: String,
    userId: String,
    designs: [{ type: Schema.Types.ObjectId, ref: 'Design' }],
}, { timestamps: true });

const Project = model('Project', ProjectSchema);
export default Project;