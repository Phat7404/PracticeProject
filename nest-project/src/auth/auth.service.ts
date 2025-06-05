import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/modules/users/users.service';
import { comparePassword } from 'src/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'Registration successful',
      user: user.user
    };
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isValidPassword = await comparePassword(pass, user.passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return user;
  }

  async login(user: any): Promise<any> {
    await this.usersService.update(user.username, { lastActive: new Date() } as UpdateUserDto);

    const payload = { username: user.username, sub: user._id, role: user.role };
    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        bio: user.bio
      }
    };
  }
}
