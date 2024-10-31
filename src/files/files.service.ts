import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async uploadProjectFiles(userId: number, files) {
    try {
      const res = files?.map(({ secure_url }) => ({
        file: secure_url,
        userId,
      }));

      await this.prisma.files.createMany({
        data: res,
      });

      return {
        message: 'Project files uploaded successfully',
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw error;
    }
  }
}
