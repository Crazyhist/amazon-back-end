import { IsEmail, IsString, MinLength } from "class-validator";

export class AuthDto {
    @IsEmail()
    email: string

    @MinLength(6, {
        message: 'min 6 symbol idiot'
    })
    @IsString()
    password: string
}