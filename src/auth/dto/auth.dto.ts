import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthWithEmailDto {
  @ApiProperty({
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  password: string;
}

export class AuthWithWallet {
  @ApiProperty({
    type: String,
  })
  @IsString()
  wallet_address: string;
}

export class GoogleAuthDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  access_token: string;
}

export class OTPDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  otp: string;
}
