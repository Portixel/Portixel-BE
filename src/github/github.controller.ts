import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { GithubService } from './github.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { User } from '@prisma/client';
import { GithubDto } from './dto/github.dto';

@ApiTags('Github Integration')
@Controller('api/github')
@UseGuards(AuthGuard('jwt'))
export class GithubController {
  constructor(private github: GithubService) {}

  @Get('initiate')
  async initiateGithubAuthentication(@GetUser() { id }: User) {
    return await this.github.initiateGithubAuthentication(id);
  }

  @Post('authenticate')
  async authenticateGithub(
    @GetUser() { id }: User,
    @Body() githubDto: GithubDto,
  ) {
    return await this.github.authenticateGithub(id, githubDto);
  }

  @Get('repositories')
  async getGithubRepositories(@GetUser() { id }: User) {
    return await this.github.getGithubRepositories(id);
  }

  @Delete('revoke')
  async revokeGithubAccess(@GetUser() { id }: User) {
    return await this.github.revokeGithubToken(id);
  }
}
