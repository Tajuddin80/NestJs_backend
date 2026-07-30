import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from './user.logger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface IUser {
    id: number,
    name: string,
    email: string
}
@Injectable()
export class UserService {
    constructor(private readonly logger: LoggerService
    ) { }
    private users: IUser[] = [
        { id: 1, name: 'tajuddin', email: 'taj@gmail.com' },
        { id: 2, name: 'uddin', email: 'uddin@gmail.com' }
    ];

    findAllUsers(name: string = '') {
        this.logger.log('Finding all users')

        return this.users.filter((user) =>
            user.name.toLowerCase().includes(name.toLowerCase())
        )
    }

    findOneUser(id: number) {
        const user = this.users.find((user) => user.id === id) ?? null;
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    createUser(dto: CreateUserDto) {
        this.logger.log('creating user');

        const newUser: IUser = { id: this.users.length + 1, email: '', ...dto };
        this.users.push(newUser);

        return newUser;
    }

    updateUser(id: number, dto: UpdateUserDto) {
        this.logger.log(`updating user ${id}`)

        const index = this.users.findIndex((user) => user.id === id);
        if (index === -1) return null;

        this.users[index] = { ...this.users[index], ...dto };
        return this.users[index];
    }

    deleteUser(id: number) {
        this.logger.log(`deleting user ${id}`)

        const index = this.users.findIndex((user) => user.id === id);
        if (index === -1) return null;
        const [deleted] = this.users.splice(index, 1);
        return deleted;
    }
}
