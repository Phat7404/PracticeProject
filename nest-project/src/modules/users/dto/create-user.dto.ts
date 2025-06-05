import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    
    @IsNotEmpty({ message: "Please enter a username" })
    username: string;

    @IsNotEmpty( { message: "Please enter a password" })
    password: string;

    @IsNotEmpty( { message: "Please enter an email" })
    @IsEmail({}, { message: "Please enter a valid email" })
    email: string;

    @IsOptional()
    profilePic: string; // URL to image

    @IsOptional()
    bio: string;
}
