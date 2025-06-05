import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Track } from 'src/modules/tracks/schemas/track.schema';

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ type: 'ObjectId', ref: 'Track', required: true })
    trackId: Track;

    @Prop({ type: 'ObjectId', ref: 'User', required: true })
    userId: User;

    @Prop({ required: true })
    text: string;

    @Prop()
    timestamp: number;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({
        type: [{
            userId: { type: 'ObjectId', ref: 'User' },
            text: String,
            createdAt: Date
        }]
    })
    replies: {
        userId: User;
        text: string;
        createdAt: Date;
    }[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// {
//     _id: ObjectId,
//     trackId: ObjectId,
//     userId: ObjectId,
//     text: String,
//     timestamp: Number, // For comments at specific points in track
//     createdAt: Date,
//     replies: [{
//       userId: ObjectId,
//       text: String,
//       createdAt: Date
//     }]
//   }