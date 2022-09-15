import { SignUpUserDto } from './dto/sign-up-user.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
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
  async login(@Body() authUserDto: AuthUserDto, @Request() req) {
    const { _id } = req.user;

    return this.authService.login({ ...authUserDto, _id });
  }
}
