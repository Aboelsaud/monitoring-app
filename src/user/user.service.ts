import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthHelper } from '../auth/auth.helper';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserInput): Promise<User> {
    try {
      const password = AuthHelper.hash(user.password);
      user.password = password;
      const userEntity = this.userRepository.create(user);
      const newUser = await this.userRepository.save(userEntity);
      return newUser;
    } catch (error) {
      throw new BadRequestException('failed_user_creation');
    }
  }
  async getByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({
        email: email,
      });
      return user;
    } catch (error) {
      throw new NotFoundException('user_not_found');
    }
  }

  async markEmailAsConfirmed(email: string) {
    try {
      await this.userRepository.update(
        { email },
        {
          isEmailConfirmed: true,
        },
      );
      return { message: 'email confirmed' };
    } catch (error) {
      throw new InternalServerErrorException('failed_updating_user');
    }
  }

  async findOneByQuery(query: FindOneOptions<User>): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(query);
      return user;
    } catch (error) {
      throw new NotFoundException('user_not_found');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id: id,
        },
      });
      return user;
    } catch (error) {
      throw new NotFoundException('user_not_found');
    }
  }
}
