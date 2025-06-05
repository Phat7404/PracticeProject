import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { Track } from 'src/modules/tracks/schemas/track.schema';

@Schema({ timestamps: true })
export class Playlist extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop()
    coverArt: string;

    @Prop({ type: [{ type: 'ObjectId', ref: 'Track' }] })
    tracks: Track[];

    @Prop({ type: 'ObjectId', ref: 'User', required: true })
    userId: User;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;

    @Prop({ default: true })
    public: boolean;

    @Prop({ default: false })
    collaborative: boolean;

    @Prop({ type: [{ type: 'ObjectId', ref: 'User' }] })
    contributors: User[];
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

// {
//     _id: ObjectId,
//     name: String,
//     description: String,
//     coverArt: String, // URL to image
//     tracks: [ObjectId], // Array of track IDs
//     userId: ObjectId, // Creator reference
//     createdAt: Date,
//     updatedAt: Date,
//     public: Boolean,
//     collaborative: Boolean,
//     contributors: [ObjectId] // For collaborative playlists
//   }