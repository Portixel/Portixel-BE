import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TemplateDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  object_key: string;
}
