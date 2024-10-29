import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GithubService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async initiateGithubAuthentication() {
    const client_id = this.config.get('GITHUB_CLIENT_ID');
    const callback_url = this.config.get('CALLBACK_URL');
    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${callback_url}&scope=repo,user`;

    return {
      message: 'Github authentication url initiated',
      statusCode: HttpStatus.OK,
      url: url,
    };
  }
}
