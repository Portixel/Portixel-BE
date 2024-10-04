import { EmailAddressDTO, WalletDTO } from './dto/waitlist.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WaitlistService {
  constructor(private prisma: PrismaService) {}

  async joinWaitListByEmailAddress({ email_address }: EmailAddressDTO) {
    try {
      const email = await this.prisma.waitList.findFirst({
        where: {
          email_address,
        },
      });
      if (email)
        throw new HttpException(
          'Email address is already on the waitlist',
          HttpStatus.CONFLICT,
        );

      const new_email = await this.prisma.waitList.create({
        data: {
          email_address,
        },
      });

      return {
        seat: `#${new_email.id}`,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw error;
    }
  }

  async joinWaitListByWalletAddress({ wallet_address }: WalletDTO) {
    try {
      const address = await this.prisma.waitList.findFirst({
        where: {
          wallet_address,
        },
      });
      if (address)
        throw new HttpException(
          'Wallet address is already on the waitlist',
          HttpStatus.CONFLICT,
        );

      const new_wallet = await this.prisma.waitList.create({
        data: {
          wallet_address,
        },
      });

      return {
        seat: `#${new_wallet.id}`,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw error;
    }
  }
}
