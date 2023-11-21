import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './auth.dto';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    //Получение старого юзера
    async register(dto: AuthDto) {
       const oldUser = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
    
        if (oldUser) throw new BadRequestException('User already exists')

        // Создание бзера (фейкового)
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: faker.name.firstName(),
                avatarPath: faker.image.avatar(),
                phone: faker.phone.number('+7 (###) ###-##-##'),
                password: await hash(dto.password) // Хешурем пароль в не понятном формате 
            }
        })

        const tokens = await this.issueToken(user.id)

        return {
            user: this.returnUserFields(user),
            ...tokens,
        }
    }
    private async issueToken(userId: number){
        const data = {id: userId} // payload записываем внутри токена
        
        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h',
        })

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d',
        })

        return {accessToken, refreshToken}
    }

    private returnUserFields(user: User) {
        return {
            id: user.id,
            email: user.email,
        }
    }
}
