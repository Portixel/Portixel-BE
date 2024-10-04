import { IsNotEmpty, IsString } from 'class-validator';

export class WalletDTO {
  @IsString()
  @IsNotEmpty()
  wallet_address: string;
}

export class EmailAddressDTO {
  @IsString()
  @IsNotEmpty()
  email_address: string;
}
