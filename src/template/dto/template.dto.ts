import { IsNotEmpty, IsString } from 'class-validator';

export class TemplateDto {
  @IsString()
  @IsNotEmpty()
  object_key: string;
}
