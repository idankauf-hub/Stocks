import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string) {
    const existing = await this.userModel.findOne({ email });
    if (existing) throw new UnauthorizedException('Email already used');
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ email, password: hashed });
    return this.login(user);
  }

  async login(user: UserDocument) {
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user._id, email: user.email },
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.login(user);
  }
}
