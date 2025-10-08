import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserStatus } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: User; message: string }> {
    const user = await this.usersService.create(registerDto);
    
    // Trong thực tế, bạn sẽ gửi email xác thực ở đây
    // await this.emailService.sendVerificationEmail(user.email, user.emailVerificationToken);
    
    return {
      user,
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: User }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Tài khoản đã bị khóa hoặc chưa được kích hoạt');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Vui lòng xác thực email trước khi đăng nhập');
    }

    const payload = { email: user.email, sub: (user as any)._id.toString(), role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    const isPasswordValid = await this.usersService.validatePassword(user, password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    return user;
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Token xác thực không được để trống');
    }

    await this.usersService.verifyEmail(token);
    
    return {
      message: 'Xác thực email thành công. Bạn có thể đăng nhập ngay bây giờ.',
    };
  }

  async getProfile(userId: string): Promise<User> {
    return this.usersService.findById(userId);
  }

  async refreshToken(user: User): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: (user as any)._id.toString(), role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}