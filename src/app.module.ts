import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WaitlistModule } from './waitlist/waitlist.module';

@Module({
  imports: [PrismaModule, WaitlistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
