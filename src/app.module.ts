
import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/app.controller';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [ AuthController],
  providers: [AuthService, PrismaService]
})
export class AuthModule {}