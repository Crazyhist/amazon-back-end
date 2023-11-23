// JwtStrategy для обработки файлов 
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { th } from '@faker-js/faker';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
 {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //Bearer token
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  async validate({id}: Pick<User,'id'>) {
    return this.prisma.user.findUnique({ where: { id: +id}})
  }
}