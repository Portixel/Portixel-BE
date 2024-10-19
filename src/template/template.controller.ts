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
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { TemplateService } from 'src/template/template.service';
import { TemplateDto } from './dto/template.dto';

@Controller('api/template')
@UseGuards(AuthGuard('jwt'))
export class TemplateController {
  constructor(private template: TemplateService) {}

  @Post()
  async createTemplateObject(
    @GetUser() { id }: User,
    @Body() objectkeyDto: TemplateDto,
  ) {
    return await this.template.createTemplateObject(id, objectkeyDto);
  }

  @Delete(':templateId')
  async deleteTemplateObject(@Param() templateId: number) {
    return await this.template.deleteTemplateObject(templateId);
  }

  @Patch(':templateId')
  async updateTemplateObject(
    @Param() templateId: number,
    @Body() templateDto: TemplateDto,
  ) {
    return await this.template.updateTemplateObject(templateId, templateDto);
  }

  @Get(':templateId')
  async getSingleTemplate(@Param() templateId: number) {
    return await this.template.getSingleTemplate(templateId);
  }

  @Get()
  async getAllTemplates(@GetUser() { id }: User) {
    return this.template.getAllTemplates(id);
  }
}
