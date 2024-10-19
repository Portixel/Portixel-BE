import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AuthWithEmailDto,
  AuthWithWallet,
  GoogleAuthDto,
  OTPDto,
} from './dto/auth.dto';
import * as argon from 'argon2';
import randomBytes from 'randombytes';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async registerWithEmail(authDto: AuthWithEmailDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email_address: authDto.email,
        },
      });
      if (user)
        throw new HttpException('Email is already taken', HttpStatus.CONFLICT);

      const token = randomBytes(6).toString('hex');

      await this.prisma.user.create({
        data: {
          email_address: authDto.email,
          password: await argon.hash(authDto.password),
          otp: parseInt(token, 16).toString().slice(0, 6),
        },
      });

      //add resend to send otp to user email
    } catch (error) {
      throw error;
    }
  }

  async registerWithWalletAddress(walletDto: AuthWithWallet) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          wallet_address: walletDto.wallet_address,
        },
      });
      if (user)
        throw new HttpException('Wallet address is taken', HttpStatus.CONFLICT);

      const newUser = await this.prisma.user.create({
        data: {
          wallet_address: walletDto.wallet_address,
          active: true,
        },
      });

      return this.signToken(newUser.id, newUser.wallet_address);
    } catch (error) {
      throw error;
    }
  }

  async loginWithWalletAddress(walletDto: AuthWithWallet) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          wallet_address: walletDto.wallet_address,
        },
        select: {
          id: true,
          name: true,
          email_address: true,
          authMethod: true,
          wallet_address: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          integrations: true,
        },
      });

      if (!user) throw new ForbiddenException('User not found');

      const token = await this.signToken(user.id, user.wallet_address);
      return {
        token,
        user,
        message: 'Authentication was successful',
      };
    } catch (error) {
      throw error;
    }
  }

  async loginWithEmail(loginDto: AuthWithEmailDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email_address: loginDto.email,
        },
      });

      if (!user) throw new ForbiddenException('User not found');
      const password = await argon.verify(user.password, loginDto.password);
      if (!password)
        throw new HttpException('Password is incorrect', HttpStatus.FORBIDDEN);

      const token = await this.signToken(user.id, user.email_address);
      delete user.password;
      return {
        token,
        message: 'Login was successful',
        user,
      };
    } catch (error) {
      throw error;
    }
  }

  async authenticateWithGoogle(req: GoogleAuthDto) {
    try {
      const payload = await this.jwt.decode(req.access_token);
      if (payload && payload.iss === 'https://accounts.google.com') {
        const user = await this.prisma.user.findUnique({
          where: { email_address: payload.email },
        });
        if (user) {
          if (user.authMethod !== 'GOOGLE') {
            throw new ForbiddenException(
              'Google authentication is not allowed for this user',
            );
          }
          return this.signToken(user.id, user.email_address);
        }
        const newUser = await this.prisma.user.create({
          data: {
            name: payload.name,
            email_address: payload.email,
            authMethod: 'GOOGLE',
            active: true,
          },
        });
        return this.signToken(newUser.id, newUser.email_address);
      }
      throw new ForbiddenException('Incorrect Credentials');
    } catch (error) {
      throw error;
    }
  }

  async verifyOtp(otpDto: OTPDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email_address: otpDto.email,
        },
      });
      if (!user) throw new NotFoundException('User not found');
      if (!user.active) {
        return {
          message: 'User is already verified',
          statusCode: HttpStatus.CONTINUE,
        };
      }
      if (otpDto.otp !== user.otp) {
        throw new HttpException(
          'Invalid or expired otp',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      await this.prisma.user.update({
        where: {
          email_address: otpDto.email,
        },
        data: {
          email_address: otpDto.email,
          active: true,
          otp: null,
        },
      });
      return {
        message: 'User is verified',
        statusCode: HttpStatus.ACCEPTED,
      };
    } catch (error) {
      throw error;
    }
  }

  async signToken(
    userId: number,
    payload: string,
  ): Promise<{ access_token: string; statusCode: 200 }> {
    const data = {
      sub: userId,
      payload,
    };

    const token = await this.jwt.signAsync(data, {
      expiresIn: '72h',
      secret: this.config.get('JWT_SECRET'),
    });

    return {
      access_token: token,
      statusCode: HttpStatus.OK,
    };
  }
}
