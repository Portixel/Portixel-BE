import { Test, TestingModule } from '@nestjs/testing';
import { FigmaIntegrationService } from './figma-integration.service';

describe('FigmaIntegrationService', () => {
  let service: FigmaIntegrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FigmaIntegrationService],
    }).compile();

    service = module.get<FigmaIntegrationService>(FigmaIntegrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
