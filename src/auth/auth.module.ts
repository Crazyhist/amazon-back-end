import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt'
import { getJwtConfig } from 'src/config/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],
      useFactory: getJwtConfig //подключаем динамично из env файла конфиг
    })
  ],
})
export class AuthModule {}
