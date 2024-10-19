import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthWithEmailDto,
  AuthWithWallet,
  GoogleAuthDto,
  OTPDto,
} from './dto/auth.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register/email')
  async registerWithEmail(@Body() authDto: AuthWithEmailDto) {
    return await this.auth.registerWithEmail(authDto);
  }

  @Post('register/wallet')
  async registerWithWalletAddress(@Body() walletDto: AuthWithWallet) {
    return await this.auth.registerWithWalletAddress(walletDto);
  }

  @Post('login/wallet')
  async loginWithWalletAddress(@Body() walletDto: AuthWithWallet) {
    return await this.auth.loginWithWalletAddress(walletDto);
  }

  @Post('login/email')
  async loginWithEmail(@Body() authDto: AuthWithEmailDto) {
    return await this.auth.loginWithEmail(authDto);
  }

  @Post('google')
  async authenticateWithGoogle(@Body() googleDto: GoogleAuthDto) {
    return await this.auth.authenticateWithGoogle(googleDto);
  }

  @Patch('verify-otp')
  async verifyOtp(@Body() otpDto: OTPDto) {
    return await this.auth.verifyOtp(otpDto);
  }
}
