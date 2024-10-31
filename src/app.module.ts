import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WaitlistModule } from './waitlist/waitlist.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TemplateModule } from './template/template.module';
import { IntegrationModule } from './integration/integration.module';
import { UserModule } from './user/user.module';
import { FigmaIntegrationModule } from './figma-integration/figma-integration.module';
import { GithubModule } from './github/github.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FilesController } from './files/files.controller';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    WaitlistModule,
    AuthModule,
    TemplateModule,
    IntegrationModule,
    UserModule,
    FigmaIntegrationModule,
    GithubModule,
    CloudinaryModule,
    FilesModule,
  ],
  controllers: [AppController, FilesController],
  providers: [AppService],
})
export class AppModule {}
