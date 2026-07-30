import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')

export class UserController {
    // GET /user
    @Get()
    getUsers(@Query('name') name: string) {
        const users = [
            { id: 1, name: 'Tajuddin' },
            { id: 2, name: 'Imran' },
            { id: 3, name: 'Ali' },
            { id: 4, name: 'Ahmed' },
            { id: 5, name: 'Hasan' },
        ];
        // console.log("name", name);
        if (name) {
            return users.filter((user) =>
                user.name.toLowerCase().includes(name.toLowerCase())
            );
        }
        return users;
    }

    @Get(':id')
    getUserById(@Param('id') id: string) {
        return { id, name: 'Tajuddin' };
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return {
            data: createUserDto, message: 'User created successfully!'
        };
    }

    @Put(':id')
    updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return {
            data: { id, ...updateUserDto },
            message: 'User updated successfully'
        }
    }

}
