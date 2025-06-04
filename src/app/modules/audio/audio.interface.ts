import { Types } from 'mongoose';

export interface IAudio {
    audioTopic: Types.ObjectId;
    title: string;
    audio_url: string;
    description: string;
    cover_image: string;
    tags: string[];
    totalPlay: number;
    duration: number;
    createdAt?: Date;
    updatedAt?: Date;
}
