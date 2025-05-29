import { Schema, model } from 'mongoose';
import { ITopic } from './topic.interface';

const TopicSchema = new Schema<ITopic>(
    {
        category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Category',
        },
        topic_icon: {
            type: String,
            required: true,
        },
        name: { type: String, required: true },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Topic = model<ITopic>('Topic', TopicSchema);

export { Topic };
