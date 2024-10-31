import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { User } from '@prisma/client';

@ApiTags('Project Files upload')
@Controller('api/project/files')
export class FilesController {
  constructor(
    private file: FilesService,
    private cloudinary: CloudinaryService,
  ) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async uploadProjectFiles(
    @GetUser() { id }: User,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      const projectFiles = files.map(async (file) => {
        return await this.cloudinary.uploadFile(file);
      });

      const response = await Promise.all(projectFiles);
      return await this.file.uploadProjectFiles(id, response);
    } catch (error) {
      throw new HttpException('Unable to upload files', error);
    }
  }

  //get single file
  @Get(':id')
  async getSingleProjectFile(@Param('id') id: number) {
    return await this.file.getSingleProjectFile(id);
  }

  //get all files
  @Get('')
  async getAllProjectFiles(@GetUser() { id }: User) {
    return await this.file.getAllProjectFiles(id);
  }

  //delete single file
  @Delete(':id')
  async deleteSingleFile(@Param('id') id: number) {
    return await this.file.deleteSingleFile(id);
  }
}
