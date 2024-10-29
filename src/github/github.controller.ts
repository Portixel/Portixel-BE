import { Controller, Get, UseGuards } from '@nestjs/common';
import { GithubService } from './github.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { User } from '@prisma/client';

@ApiTags('Github Integration')
@Controller('api/github')
@UseGuards(AuthGuard('jwt'))
export class GithubController {
  constructor(private github: GithubService) {}

  @Get('initiate')
  async initiateGithubAuthentication() {
    return await this.github.initiateGithubAuthentication();
  }
}
