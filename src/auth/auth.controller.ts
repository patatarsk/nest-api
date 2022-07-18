import { SignUpUserDto } from './dto/sign-up-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.signUpUser(signUpUserDto);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(@Body() authUserDto: AuthUserDto) {
    return this.authService.login(authUserDto);
  }
}
