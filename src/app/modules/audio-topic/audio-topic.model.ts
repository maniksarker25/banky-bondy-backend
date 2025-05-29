import { model, Schema } from 'mongoose';
import { IAudioTopic } from './audio-topic.interface';

const CategorySchema: Schema = new Schema<IAudioTopic>(
    {
        name: { type: String, required: true },
        topic_image: { type: String, required: true },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Category = model<IAudioTopic>('AudioTopic', CategorySchema);

export default Category;
