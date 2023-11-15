import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule],
  controllers: [ AppController],
  providers: [AppService, PrismaService]
})
export class AppModule {}