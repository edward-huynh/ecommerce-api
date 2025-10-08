import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole, UserStatus } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    // Kiểm tra email đã tồn tại
    const existingUser = await this.userModel.findOne({ email: userData.email });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Tạo verification token
    userData.emailVerificationToken = this.generateVerificationToken();

    const user = new this.userModel(userData);
    return user.save();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.userModel.findOne({ emailVerificationToken: token });
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.findByVerificationToken(token);
    if (!user) {
      throw new NotFoundException('Token xác thực không hợp lệ');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.status = UserStatus.ACTIVE;

    return user.save();
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async updateProfile(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    
    // Không cho phép cập nhật email, password, role qua method này
    delete updateData.email;
    delete updateData.password;
    delete updateData.role;

    Object.assign(user, updateData);
    return user.save();
  }

  async changePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.findById(id);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.userModel.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      this.userModel.countDocuments(),
    ]);

    return { users, total };
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findById(id);
    user.role = role;
    return user.save();
  }

  async updateStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findById(id);
    user.status = status;
    return user.save();
  }

  private generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}