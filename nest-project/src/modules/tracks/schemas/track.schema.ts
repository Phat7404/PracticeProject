import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema } from "mongoose";
import { User } from "src/modules/users/schemas/user.schema";

export type UserDocument = HydratedDocument<Track>;

@Schema()
export class Track {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ required: true, type: Buffer })
    audioFile: Buffer;

    @Prop()
    coverArt: string; // URL to image

    @Prop({ required: true })
    duration: number; // in seconds

    @Prop()
    genre: string;

    @Prop({ type: [String], default: [] })
    tags: string[]; // Array of tags

    @Prop({ default: 0 })
    plays: number;

    @Prop({ default: 0 })
    likes: number;

    @Prop({ default: 0 })
    reposts: number;

    @Prop({ default: 0 })
    comments: number;

    @Prop({ default: false })
    private: boolean; // Private track

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    userId: User; // Creator reference

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const TrackSchema = SchemaFactory.createForClass(Track);

// {
//     _id: ObjectId,
//     title: String,
//     description: String,
//     audioFile: String, // URL to audio file
//     coverArt: String, // URL to image
//     duration: Number, // in seconds
//     genre: String,
//     tags: [String],
//     plays: Number,
//     likes: Number,
//     reposts: Number,
//     comments: Number,
//     private: Boolean,
//     userId: ObjectId, // Creator reference
//     createdAt: Date,
//     updatedAt: Date
//   }