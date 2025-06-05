import { IsString, IsOptional, IsNumber, IsBoolean, IsArray } from 'class-validator';

export class CreateTrackDto {
    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    audioFile: string;

    @IsString()
    @IsOptional()
    coverArt?: string;

    @IsNumber()
    duration: number;

    @IsString()
    @IsOptional()
    genre?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsBoolean()
    @IsOptional()
    private?: boolean;
}
