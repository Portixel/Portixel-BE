import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

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

export class UpdateFigmaDto {
  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  active: boolean;
}
