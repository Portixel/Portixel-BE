import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FigmaIntegrationService } from './figma-integration.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { User } from '@prisma/client';
import { FigmaDto } from './dto/figma.dto';

@ApiTags('Figma Integration')
@Controller('api/figma-integration')
@UseGuards(AuthGuard('jwt'))
export class FigmaIntegrationController {
  constructor(private figma: FigmaIntegrationService) {}

  //get authentication url
  @Get('initiate')
  async initiateFigmaAuthentication(@GetUser() { id }: User) {
    return await this.figma.initiateFigmaAuthentication(id);
  }

  //authenticate with figma
  @Post('authenticate')
  async authenticateFigma(@GetUser() { id }: User, @Body() figmaDto: FigmaDto) {
    return await this.figma.authenticateFigma(id, figmaDto);
  }

  @Get('file/:key')
  async getFigmaFile(@Param('key') key: string, @GetUser() { id }: User) {
    return await this.figma.getFigmaFile(id, key);
  }
}
