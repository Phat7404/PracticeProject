import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Activity extends Document {
    @Prop({ required: true, enum: ['upload', 'like', 'repost', 'follow'] })
    type: string;

    @Prop({ type: 'ObjectId', ref: 'User', required: true })
    userId: User;

    @Prop({ required: true })
    targetId: string; // Can reference multiple collections

    @Prop({ required: true, enum: ['track', 'user', 'playlist'] })
    targetType: string;

    @Prop({ type: Object })
    metadata: {
        trackTitle?: string;
        username?: string;
    };
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
// {
//     _id: ObjectId,
//     type: String, // 'upload', 'like', 'repost', 'follow'
//     userId: ObjectId, // Who performed the action
//     targetId: ObjectId, // Track/User ID affected
//     targetType: String, // 'track', 'user', 'playlist'
//     createdAt: Date,
//     metadata: { // Additional context
//       trackTitle: String, // For performance
//       username: String    // For performance
//     }
//   }