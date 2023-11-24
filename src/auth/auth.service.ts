import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { faker } from '@faker-js/faker';
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';



@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async login(dto: AuthDto){
        const user = await this.validateUser(dto)
        const tokens = await this.issueTokens(user.id)

        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }

    async getNewTokens(refreshToken: string){
        const result = await this.jwt.verifyAsync(refreshToken) // расскрываем, забираем id (payload 2 часть)
        if(!result) throw new UnauthorizedException('invalid refresh token')

        const user = await this.prisma.user.findUnique({where: {
            id: result.id,
        }})

        const tokens = await this.issueTokens(user.id)

        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }
    //Получение старого юзера
    async register(dto: AuthDto) {
       const oldUser = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
    
        if (oldUser) throw new BadRequestException('User already exists')

        // Создание юзера (фейкового)
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                name: faker.person.firstName(),
                avatarPath: faker.image.avatar(),
                phone: faker.phone.number(),
                password: await hash(dto.password) // Хешурем пароль в не понятном формате 
            }
        })

        const tokens = await this.issueTokens(user.id)

        return {
            user: this.returnUserFields(user),
            ...tokens
        }
    }
    private async issueTokens(userId: number){
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

    //Получаем юзера
    private async validateUser (dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
    
        if (!user) throw new NotFoundException('User not found')

        // пароль валидный или нет
        const isValid = await verify(user.password, dto.password)

        if (!isValid) throw new UnauthorizedException('Invalid password')

        return user
    }
}
