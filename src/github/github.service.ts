import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { GithubDto } from './dto/github.dto';
import axios from 'axios';

@Injectable()
export class GithubService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  //initiate github
  async initiateGithubAuthentication(id: number) {
    const client_id = this.config.get('GITHUB_CLIENT_ID');
    const callback_url = this.config.get('CALLBACK_URL');
    const url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${callback_url}&scope=repo,user`;

    const existingGithubIntegration =
      await this.prisma.githubIntegration.findUnique({
        where: { userId: id },
      });

    if (existingGithubIntegration) {
      await this.prisma.user.update({
        where: { id },
        data: {
          GithubIntegration: {
            update: {
              where: { userId: id },
              data: {
                integration: {
                  update: { type: 'GITHUB' },
                },
              },
            },
          },
        },
      });
    } else {
      // Create a new GithubIntegration
      await this.prisma.user.update({
        where: { id },
        data: {
          GithubIntegration: {
            create: {
              githubAccessToken: null,
              integration: {
                create: { type: 'GITHUB', userId: id },
              },
            },
          },
        },
      });
    }

    return {
      message: 'Github authentication url initiated',
      statusCode: HttpStatus.OK,
      url: url,
    };
  }

  //authenticate github
  async authenticateGithub(id: number, { code }: GithubDto) {
    try {
      const res = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.config.get('GITHUB_CLIENT_ID'),
          client_secret: this.config.get('GITHUB_CLIENT_SECRET'),
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        },
      );
      if (res.status === 201 || res.status === 200) {
        const { access_token } = res.data;

        await this.prisma.user.update({
          where: {
            id,
          },
          data: {
            GithubIntegration: {
              update: {
                githubAccessToken: access_token,
                integration: {
                  update: {
                    active: true,
                  },
                },
              },
            },
          },
        });
      }

      return {
        message: 'Github integration connected successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  //get user repositories
  async getGithubRepositories(id: number) {
    try {
      const githubIntegration = await this.prisma.githubIntegration.findFirst({
        where: { userId: id },
      });

      if (!githubIntegration) {
        throw new ForbiddenException(
          'Integration is not enabled for this user',
        );
      }

      const integration = await this.prisma.integration.findFirst({
        where: { userId: id, type: 'GITHUB' },
      });

      if (!integration || !integration.active) {
        throw new ForbiddenException(
          'Integration is not enabled for this user',
        );
      }

      const token = githubIntegration.githubAccessToken.trim();

      const res = await axios.get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async revokeGithubToken(userId: number) {
    try {
      const githubIntegration = await this.prisma.githubIntegration.findFirst({
        where: { userId },
      });

      if (!githubIntegration) {
        throw new ForbiddenException(
          'No GitHub integration found for this user',
        );
      }

      const clientId = this.config.get('GITHUB_CLIENT_ID');
      const clientSecret = this.config.get('GITHUB_CLIENT_SECRET');
      const accessToken = githubIntegration.githubAccessToken.trim();

      const url = `https://api.github.com/applications/${clientId}/tokens/${accessToken}`;

      const headers = {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      };

      await axios.delete(url, { headers });

      await this.prisma.githubIntegration.update({
        where: { userId },
        data: { githubAccessToken: null },
      });

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          GithubIntegration: {
            update: {
              integration: {
                update: {
                  active: false,
                },
              },
            },
          },
        },
      });
      return { message: 'Token revoked successfully' };
    } catch (error) {
      throw new ForbiddenException(
        `Error revoking token: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}
