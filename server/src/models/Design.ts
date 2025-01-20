import { Schema, model } from 'mongoose';

const DesignSchema = new Schema({
    userId: String,
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    prompt: String,
    imageUrl: String,
    token: String,
    isPublic: { type: Boolean, default: false },
}, { timestamps: true });

const Design = model('Design', DesignSchema);
export default Design;