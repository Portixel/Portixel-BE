import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FilesController } from './files.controller';

@Module({
  controllers: [FilesController],
  providers: [FilesService, CloudinaryService],
  exports: [FilesService],
})
export class FilesModule {}
