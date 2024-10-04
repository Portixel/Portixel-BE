import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  wallet_address: string;
}

export class EmailAddressDTO {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  email_address: string;
}
