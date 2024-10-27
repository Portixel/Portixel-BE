import { Module } from '@nestjs/common';
import { FigmaIntegrationService } from './figma-integration.service';
import { FigmaIntegrationController } from './figma-integration.controller';

@Module({
  providers: [FigmaIntegrationService],
  controllers: [FigmaIntegrationController]
})
export class FigmaIntegrationModule {}
