import { Body, Controller, Post } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { EmailAddressDTO, WalletDTO } from './dto/waitlist.dto';

@Controller('api/waitlist')
export class WaitlistController {
  constructor(private waitlistService: WaitlistService) {}

  @Post('email-address')
  async joinWaitListByEmailAddress(@Body() email_address: EmailAddressDTO) {
    return await this.waitlistService.joinWaitListByEmailAddress(email_address);
  }

  @Post('wallet-address')
  async joinWaitListByWalletAddress(@Body() wallet_address: WalletDTO) {
    return await this.waitlistService.joinWaitListByWalletAddress(
      wallet_address,
    );
  }
}
