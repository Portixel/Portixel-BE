import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { FigmaDto, UpdateFigmaDto } from './dto/figma.dto';
import axios from 'axios';

@Injectable()
export class FigmaIntegrationService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  //initiate figma authentication
  async initiateFigmaAuthentication(id: number) {
    const client_id = this.config.get('FIGMA_CLIENT_ID');
    const callback_url = this.config.get('CALLBACK_URL');
    const state_code = crypto.randomUUID();
    const url = `https://www.figma.com/oauth?client_id=${client_id}&redirect_uri=${callback_url}&scope=files:read,file_comments:write&state=${state_code}&response_type=code`;
    console.log(state_code);

    await this.prisma.user.update({
      where: { id },
      data: {
        FigmaIntegration: {
          upsert: {
            where: { userId: id },
            create: {
              figmaState: state_code,
              integration: {
                create: { type: 'FIGMA', userId: id },
              },
            },
            update: {
              figmaState: state_code,
            },
          },
        },
      },
    });
    return {
      message: 'Figma authentication url initiated',
      statusCode: HttpStatus.OK,
      url: url,
    };
  }

  //authenticate
  async authenticateFigma(id: number, figmaDto: FigmaDto) {
    try {
      const isValid = await this.prisma.figmaIntegration.findFirst({
        where: {
          figmaState: figmaDto.state,
        },
      });
      if (!isValid) throw new NotFoundException('Invalid state code');
      const body = new URLSearchParams({
        client_id: this.config.get('FIGMA_CLIENT_ID'),
        client_secret: this.config.get('FIGMA_CLIENT_SECRET'),
        redirect_uri: this.config.get('CALLBACK_URL'),
        code: figmaDto.code,
        grant_type: 'authorization_code',
      });
      const res = await axios.post(
        'https://api.figma.com/v1/oauth/token',
        body.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      if (res.status === 200) {
        const { access_token, refresh_token, user_id, expires_in } = res.data;

        await this.prisma.user.update({
          where: { id },
          data: {
            FigmaIntegration: {
              update: {
                figmaAccessToken: access_token,
                figmaRefreshToken: refresh_token,
                figmaTeamId: String(user_id),
                integration: {
                  update: {
                    active: true,
                    expiresAt: new Date(Date.now() + expires_in * 1000),
                  },
                },
              },
            },
          },
        });
      }
      return {
        message: 'Figma integration connected successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  //individual files
  async getFigmaFile(id: number, key: string) {
    const accessToken = await this.refreshToken(id);
    const res = await axios.get(
      `${this.config.get('FIGMA_API_URL')}/files/${key}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return res.data;
  }

  //get project files
  async getFigmaProjectFiles(id: number, projectId: string) {
    const accessToken = await this.refreshToken(id);
    const res = await axios.get(
      `${this.config.get('FIGMA_API_URL')}/projects/${projectId}/files`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return res.data;
  }

  async getFigmaUser(id: number) {
    const accessToken = await this.refreshToken(id);
    const res = await axios.get(`${this.config.get('FIGMA_API_URL')}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  }

  //refresh token
  async refreshToken(id: number) {
    const figmaIntegration = await this.prisma.integration.findFirst({
      where: { userId: id },
    });

    if (!figmaIntegration) {
      throw new HttpException(
        'Figma integration is not enabled for this user',
        HttpStatus.FORBIDDEN,
      );
    }

    const figma = await this.prisma.figmaIntegration.findFirst({
      where: { userId: id },
    });

    if (new Date() < figmaIntegration.expiresAt) return figma.figmaAccessToken;

    const body = new URLSearchParams({
      client_id: this.config.get('FIGMA_CLIENT_ID'),
      client_secret: this.config.get('FIGMA_CLIENT_SECRET'),
      refresh_token: figma.figmaRefreshToken,
      grant_type: 'refresh_token',
    });

    const res = await axios.post(
      'https://api.figma.com/v1/oauth/token',
      body.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );

    if (res.status === 200) {
      const { access_token, expires_in } = res.data;
      await this.prisma.user.update({
        where: { id },
        data: {
          FigmaIntegration: {
            update: {
              figmaAccessToken: access_token,
              integration: {
                update: {
                  expiresAt: new Date(Date.now() + expires_in * 1000),
                },
              },
            },
          },
        },
      });
      return access_token;
    }
    throw new HttpException(
      'Failed to refresh Figma token',
      HttpStatus.UNAUTHORIZED,
    );
  }

  //update integration
  async updateIntegration(id: number, { active }: UpdateFigmaDto) {
    return await this.prisma.integration.updateMany({
      where: {
        userId: id,
      },
      data: {
        active: active,
      },
    });
  }

  //remove integration
  async removeIntegration(id: number) {
    return await this.prisma.figmaIntegration.delete({
      where: {
        userId: id,
      },
    });
  }
}
