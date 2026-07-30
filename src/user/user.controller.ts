import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
// this is root route
export class UserController {
  constructor(private readonly userService: UserService) {}

  // GET /user
  @Get()
  getUsers(@Query('name') name: string): unknown {
    return this.userService.findAllUsers(name);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): unknown {
    return this.userService.findOneUser(id);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto): unknown {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): unknown {
    return this.userService.updateUser(Number(id), updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): unknown {
    return this.userService.deleteUser(Number(id));
  }
}
