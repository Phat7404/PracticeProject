import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({  enum: ['User', 'Admin'], default: 'User' })
    role: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ default: "" })
    profilePic: string; // URL to image

    @Prop({ default: "" })
    bio: string;

    @Prop({ type: [{ type: 'ObjectId', ref: 'User' }] })
    followers: string[]; // Array of user IDs

    @Prop({ type: [{ type: 'ObjectId', ref: 'User' }] })
    following: string[]; // Array of user IDs

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    lastActive: Date;

    @Prop({ type: Object, default: {} })
    preferences: {
        theme: string;
        notifications: boolean;
    };
}

export const UserSchema = SchemaFactory.createForClass(User);

// {
//     _id: ObjectId,
//     username: String,
//     passwordHash: String,
//     email: String,
//     profilePic: String, // URL to image
//     bio: String,
//     followers: [ObjectId], // Array of user IDs
//     following: [ObjectId], // Array of user IDs
//     createdAt: Date,
//     lastActive: Date,
//     preferences: {
//       theme: String,
//       notifications: Boolean
//     }
//   }