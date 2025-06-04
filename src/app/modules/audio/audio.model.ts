import { Schema, model } from 'mongoose';
import { IAudio } from './audio.interface';

const audioSchema = new Schema<IAudio>(
    {
        audioTopic: {
            type: Schema.Types.ObjectId,
            ref: 'Topic',
            required: true,
        },
        audio_url: {
            type: String,
            required: true,
        },
        title: { type: String, required: true, trim: true },
        description: { type: String },
        cover_image: { type: String, required: false },
        tags: { type: [String], default: [] },
        totalPlay: { type: Number, default: 0 },
        duration: { type: Number, required: true },
    },
    { timestamps: true }
);

const Audio = model<IAudio>('Audio', audioSchema);

export default Audio;
