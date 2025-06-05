import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    password: string;

    @IsOptional()
    profilePic: string; // URL to image

    @IsOptional()
    bio: string;

    @IsOptional()
    lastActive: Date;
}
