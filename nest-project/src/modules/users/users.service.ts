import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { formatDate, hashPassword } from 'src/helpers/utils';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userModule: Model<User>,
  ) { }

  async isMailExists(email: string): Promise<boolean> {
    return this.userModule.exists({ email }).then((exists) => !!exists);
  }
  async isUsernameExists(username: string): Promise<boolean> {
    return this.userModule.exists({ username }).then((exists) => !!exists);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { username, password, email, profilePic, bio } = createUserDto;

      // Check if email already exists
      const emailExists = await this.isMailExists(email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
      // Check if username already exists
      const usernameExists = await this.isUsernameExists(username);
      if (usernameExists) {
        throw new Error('Username already exists');
      }

      const passwordHash = await hashPassword(password);

      const user = await this.userModule.create({ username, passwordHash, email, profilePic, bio });

      return {
        message: 'User created successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
          bio: user.bio,
        },
      };
    } catch (error) {
      throw new Error(error.message || "Failed to create user");
    }
  }

  async findAll(query: string, current: number, pageSize: number) {
    try {
      const { filter, sort } = aqp(query);
      if (filter.current) delete filter.current;
      if (filter.pageSize) delete filter.pageSize;
      if (!current) current = 1;
      if (!pageSize) pageSize = 10;

      const totalItems = (await this.userModule.find(filter)).length;
      const totalPages = Math.ceil(totalItems / pageSize);
      const skip = (current - 1) * pageSize;

      const users = await this.userModule
        .find(filter)
        .sort(sort as any)
        .skip(skip)
        .limit(pageSize)
        .select('-passwordHash -__v')
        .exec();

      return {
        message: 'Users retrieved successfully',
        users: users.map(user => ({
          id: user._id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
          bio: user.bio,
          lastActive: formatDate(user.lastActive),
          createdAt: formatDate(user.createdAt),
        })),
        totalItems,
        totalPages,
      }
    } catch (error) {
      throw new Error(error.message || 'Failed to retrieve users');
    }
  }

  async findOne(username: string) {
    try {
      const user = await this.userModule.findOne({ username: username }).exec();
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(error.message || 'Failed to retrieve user');
    }
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userModule.findOneAndUpdate({ username: username }, updateUserDto, { new: true }).select('-passwordHash -__v').exec();

      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new Error(error.message || 'Failed to update user');
    }
  }

  async remove(username: string) {
    try {
      const deletedUser = await this.userModule.findOneAndDelete({ username: username }).exec();
      if (!deletedUser) {
        throw new Error('User not found');
      }
      return {
        message: 'User deleted successfully',
        user: {
          username: deletedUser.username,
        },
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to delete user');
    }
  }
}
