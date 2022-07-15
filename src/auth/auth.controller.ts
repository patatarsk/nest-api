import { AuthUserDto } from './dto/auth-user.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() authUserDto: AuthUserDto) {
    return this.authService.login(authUserDto);
  }
}
