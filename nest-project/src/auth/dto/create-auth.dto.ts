import { IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty({message: "Please enter username"})
    username: string;

    @IsNotEmpty({message: "Please enter password"})
    password: string;
}
