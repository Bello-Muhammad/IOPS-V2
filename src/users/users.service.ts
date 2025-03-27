import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { compare } from 'bcrypt';
import { EmailHandler } from '../general.util/email.Handler';
import { randomBytes } from 'crypto';


@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository, readonly emailHandler: EmailHandler) {}

  async findUsers(): Promise<User[]> {
    return this.userRepository.find({});
  }

  async findOneUser(userId: string): Promise<User> {
    return this.userRepository.findOne({ _id: userId });
  }

  async registerUser(createUserDto: CreateUserDto): Promise<any> {
    const userExist = await this.userRepository.findOne({
      email: createUserDto.email
    });

    if (userExist) {
      throw new HttpException('user exist', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if(createUserDto.role === 'official') {
      let password = randomBytes(8).toString();

      let newOfficial = await this.userRepository.create({
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        role: createUserDto.role,
        state: createUserDto.state,
        lga: createUserDto.lga,
        password
      })

      if (!newOfficial) {
        throw new HttpException('user not created', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      this.emailHandler.newStaffNotification(createUserDto.email, password, createUserDto.firstName, createUserDto.lastName);

      return newOfficial;
    }

    if (!createUserDto.password) throw new HttpException('password cannot be empty', HttpStatus.EXPECTATION_FAILED)

    return await this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      role: createUserDto.role,
      state: createUserDto.state,
      lga: createUserDto.lga,
      password: createUserDto.password
    });
  }

  async updateUser(
    userId: string,
    userUpdates: UpdateUserDto
  ): Promise<User> {
    const checkForUser = await this.userRepository.findOne({ _id: userId });

    if (!checkForUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    return this.userRepository.findOneAndUpdate({ _id: userId }, userUpdates);
  }

  async updateUserPassword(
    userId: string,
    updatePassword: ChangePasswordDto
  ): Promise<User> {

    const { oldPassword, newPassword } = updatePassword;
    
    const checkForUser = await this.userRepository.findOne({ _id: userId });

    if (!checkForUser) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordCorrect = await compare(oldPassword, checkForUser.password);

    if (!isPasswordCorrect) {
        throw new HttpException(
          'invalid password',
          HttpStatus.UNPROCESSABLE_ENTITY
        );
    }

    return this.userRepository.findAndUpdatePassword({ _id: userId }, newPassword);
  }

  async deleteUser(userId: string): Promise<User> {
    return this.userRepository.findOneAndDelete({ _id: userId });
  }

}
