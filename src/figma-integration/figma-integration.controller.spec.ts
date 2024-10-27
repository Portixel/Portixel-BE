import { Test, TestingModule } from '@nestjs/testing';
import { FigmaIntegrationController } from './figma-integration.controller';

describe('FigmaIntegrationController', () => {
  let controller: FigmaIntegrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FigmaIntegrationController],
    }).compile();

    controller = module.get<FigmaIntegrationController>(
      FigmaIntegrationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
