import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FigmaIntegrationService } from './figma-integration.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { User } from '@prisma/client';
import { FigmaDto, UpdateFigmaDto } from './dto/figma.dto';

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

  @Get('project/:projectId')
  async getFigmaProjectFiles(
    @Param('projectId') projectId: string,
    @GetUser() { id }: User,
  ) {
    return await this.figma.getFigmaFile(id, projectId);
  }

  @Get('user')
  async getFigmaUser(@GetUser() { id }: User) {
    return await this.figma.getFigmaUser(id);
  }

  @Patch('toggle')
  async updateIntegration(
    @GetUser() { id }: User,
    @Body() activeDto: UpdateFigmaDto,
  ) {
    return await this.figma.updateIntegration(id, activeDto);
  }

  @Delete('')
  async removeIntegration(@GetUser() { id }: User) {
    return await this.figma.removeIntegration(id);
  }
}
