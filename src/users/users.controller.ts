import { Body, Controller, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponseHandler } from 'src/responseHandler/petResponse.handler';
import { User } from './users.schema';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getAllUsers(
    // @Query() staff: string,
  ): Promise<User[]> {
    try {
        const users = await this.userService.findUsers();
  
        return ApiResponseHandler.successResponse(
          200,
          'user fetched successfully',
          users
        );
      } catch (error) {
        if (error instanceof Error) {
          return ApiResponseHandler.failedResponse(
            500,
            'request handle failed',
            error.message
          );
        } else {
          return ApiResponseHandler.failedResponse(
            500,
            'server error try again later',
            error as string
          );
        }
      }
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto
  ): Promise<User> {
    try {
      const newUser = await this.userService.registerUser(createUserDto);

      return ApiResponseHandler.successResponse(
        201,
        'user created successfully',
        newUser
      );
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponseHandler.failedResponse(
          500,
          'request handle failed',
          error.message
        );
      } else {
        return ApiResponseHandler.failedResponse(
          500,
          'server error try again later',
          error as string
        );
      }
    }
  }

  @Patch('/update/:userId')
  async updateUserData(
    @Request() req: Request | any,
    @Param() userId: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    // const { username } = req.user;
    try {
      const modifiedUser = await this.userService.updateUser(
        userId,
        updateUserDto
      );

      return ApiResponseHandler.successResponse(
        200,
        'password changed successfully',
        modifiedUser
      );
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponseHandler.failedResponse(
          500,
          'request handle failed',
          error.message
        );
      } else {
        return ApiResponseHandler.failedResponse(
          500,
          'server error try again later',
          error as string
        );
      }
    }
  }

  @Patch('change-password/:userId')
  async changeUserPassword(
    @Request() req: Request | any,
    @Param() userId: string,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<User> {
    
    try {
      const modifiedUser = await this.userService.updateUserPassword(
        userId,
        changePasswordDto
      );

      return ApiResponseHandler.successResponse(
        200,
        'password changed successfully',
        modifiedUser
      );
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponseHandler.failedResponse(
          500,
          'request handle failed',
          error.message
        );
      } else {
        return ApiResponseHandler.failedResponse(
          500,
          'server error try again later',
          error as string
        );
      }
    }
  }
}
