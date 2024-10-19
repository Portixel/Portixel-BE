import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TemplateDto } from './dto/template.dto';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  async createTemplateObject(id: number, objectKeyDto: TemplateDto) {
    try {
      const template = await this.prisma.template.create({
        data: {
          template_key: objectKeyDto.object_key,
          userId: id,
        },
      });

      return {
        message: 'Template created successfully',
        statusCode: HttpStatus.CREATED,
        data: template,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteTemplateObject(id: number) {
    await this.prisma.template.delete({
      where: {
        id,
      },
    });

    return {
      mesage: 'Template object key removed successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async updateTemplateObject(id: number, templateDto: TemplateDto) {
    await this.prisma.template.update({
      where: {
        id,
      },
      data: {
        template_key: templateDto.object_key,
      },
    });

    return {
      message: 'Template updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async getSingleTemplate(id: number) {
    return await this.prisma.template.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        template_key: true,
      },
    });
  }

  async getAllTemplates(userId: number) {
    const templates = await this.prisma.template.findMany({
      where: {
        userId,
      },
    });

    return {
      data: {
        ...templates,
      },
      message: 'Templates loaded successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
