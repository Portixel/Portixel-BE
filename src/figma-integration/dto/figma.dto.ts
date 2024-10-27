import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FigmaDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  state: string;
}
